import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SettingsService } from '../settings/settings.service';
import { WeightLog, WeightLogDocument } from '../weight/schemas/weight-log.schema';

// Google Health API v4 (health.googleapis.com) — the Fitbit-successor API.
const SCOPES = [
  'https://www.googleapis.com/auth/googlehealth.activity_and_fitness.readonly',
  'https://www.googleapis.com/auth/googlehealth.health_metrics_and_measurements.readonly',
  'https://www.googleapis.com/auth/googlehealth.sleep.readonly',
];
const BASE = 'https://health.googleapis.com/v4/users/me/dataTypes';

@Injectable()
export class HealthService {
  constructor(
    private readonly config: ConfigService,
    private readonly settingsService: SettingsService,
    @InjectModel(WeightLog.name) private weightModel: Model<WeightLogDocument>,
  ) {}

  private cfg(key: string): string {
    const v = this.config.get<string>(key);
    if (!v) throw new BadRequestException(`Missing ${key} in backend env`);
    return v;
  }

  authUrl(): string {
    const params = new URLSearchParams({
      client_id: this.cfg('GOOGLE_CLIENT_ID'),
      redirect_uri: this.cfg('GOOGLE_REDIRECT_URI'),
      response_type: 'code',
      scope: SCOPES.join(' '),
      access_type: 'offline',
      prompt: 'consent',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }

  async exchangeCode(code: string): Promise<void> {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: this.cfg('GOOGLE_CLIENT_ID'),
        client_secret: this.cfg('GOOGLE_CLIENT_SECRET'),
        redirect_uri: this.cfg('GOOGLE_REDIRECT_URI'),
        grant_type: 'authorization_code',
      }),
    });
    if (!res.ok) throw new BadRequestException(`Token exchange failed: ${await res.text()}`);
    const data = (await res.json()) as { refresh_token?: string };
    if (!data.refresh_token)
      throw new BadRequestException('No refresh token (revoke access & retry)');
    await this.settingsService.setGoogleTokens(data.refresh_token);
  }

  private async accessToken(): Promise<string> {
    const refresh = await this.settingsService.getGoogleRefreshToken();
    if (!refresh) throw new BadRequestException('Google Health not connected');
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: this.cfg('GOOGLE_CLIENT_ID'),
        client_secret: this.cfg('GOOGLE_CLIENT_SECRET'),
        refresh_token: refresh,
        grant_type: 'refresh_token',
      }),
    });
    if (!res.ok) throw new BadRequestException('Failed to refresh Google token');
    return ((await res.json()) as { access_token: string }).access_token;
  }

  private civil(d: Date) {
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
  }

  private async list(token: string, type: string, filter?: string): Promise<any> {
    const url = `${BASE}/${type}/dataPoints${filter ? `?filter=${encodeURIComponent(filter)}` : ''}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) return { _error: res.status, _body: await res.text() };
    return res.json();
  }

  private async dailyRollUp(token: string, type: string, start: Date, end: Date): Promise<any> {
    const res = await fetch(`${BASE}/${type}/dataPoints:dailyRollUp`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        range: { start: { date: this.civil(start) }, end: { date: this.civil(end) } },
        windowSizeDays: 1,
      }),
    });
    if (!res.ok) return { _error: res.status, _body: await res.text() };
    return res.json();
  }

  // Depth-first search for the first number (or numeric string) under a key matching any hint.
  private findNum(obj: any, hints: string[], depth = 0): number | null {
    if (obj == null || depth > 7) return null;
    if (Array.isArray(obj)) {
      for (const it of obj) {
        const n = this.findNum(it, hints, depth + 1);
        if (n != null) return n;
      }
      return null;
    }
    if (typeof obj === 'object') {
      for (const [k, v] of Object.entries(obj)) {
        const kl = k.toLowerCase();
        if (!hints.some((h) => kl.includes(h))) continue;
        if (typeof v === 'number') return v;
        if (typeof v === 'string' && v !== '' && !isNaN(Number(v))) return Number(v);
      }
      for (const v of Object.values(obj)) {
        const n = this.findNum(v, hints, depth + 1);
        if (n != null) return n;
      }
    }
    return null;
  }

  async today() {
    const token = await this.accessToken();
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const end = new Date(start.getTime() + 86400000);
    const dateStr = start.toISOString().slice(0, 10);

    const [stepsAgg, rhr, hrv, sleep, weight] = await Promise.all([
      this.dailyRollUp(token, 'steps', start, end),
      this.list(token, 'daily-resting-heart-rate'),
      this.list(token, 'daily-heart-rate-variability'),
      this.list(token, 'sleep'),
      this.list(token, 'weight'),
    ]);

    const steps = this.findNum(stepsAgg, ['countsum', 'count', 'steps']);
    const restingHeartRate = this.findNum(rhr, ['beatsperminute', 'beats', 'bpm', 'resting']);
    const hrvVal = this.findNum(hrv, ['rmssd', 'variability', 'millis', 'hrv']);
    const sleepHours = this.sleepHours(sleep);
    const weightG = this.findNum(weight, ['kilogram', 'gram', 'weight']);
    const weightKg = weightG != null ? Math.round((weightG / 1000) * 10) / 10 : null;

    // auto-log weight into our DB once per day (no double entry)
    if (weightKg != null) {
      await this.weightModel
        .updateOne(
          { date: dateStr },
          { $setOnInsert: { weight: weightKg, date: dateStr, loggedAt: new Date() } },
          { upsert: true },
        )
        .exec();
    }

    return {
      steps,
      restingHeartRate: restingHeartRate != null ? Math.round(restingHeartRate) : null,
      hrv: hrvVal != null ? Math.round(hrvVal) : null,
      sleepHours,
      weightKg,
    };
  }

  /** Latest night's asleep hours from a sleep list response (excludes AWAKE stages). */
  private sleepHours(resp: any): number | null {
    const pts = resp?.dataPoints;
    if (!Array.isArray(pts) || !pts.length) return null;
    // most recent session by interval start
    const latest = [...pts].sort((a, b) =>
      String(b?.sleep?.interval?.startTime ?? '').localeCompare(
        String(a?.sleep?.interval?.startTime ?? ''),
      ),
    )[0];
    const s = latest?.sleep;
    if (!s?.interval) return null;
    const dur = (st?: string, en?: string) =>
      st && en ? new Date(en).getTime() - new Date(st).getTime() : 0;
    let ms = 0;
    if (Array.isArray(s.stages) && s.stages.length) {
      ms = s.stages
        .filter((g: any) => g.type !== 'AWAKE')
        .reduce((sum: number, g: any) => sum + dur(g.startTime, g.endTime), 0);
    } else {
      ms = dur(s.interval.startTime, s.interval.endTime);
    }
    return ms > 0 ? Math.round((ms / 3600000) * 10) / 10 : null;
  }

  /** Debug: raw response for one data type, to verify field shapes. */
  async raw(type: string) {
    const token = await this.accessToken();
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    const end = new Date(start.getTime() + 86400000);
    if (type === 'steps') return this.dailyRollUp(token, 'steps', start, end);
    return this.list(token, type);
  }
}
