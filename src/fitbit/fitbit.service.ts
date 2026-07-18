import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SettingsService } from '../settings/settings.service';

const SCOPES = 'activity heartrate sleep weight profile';
const API = 'https://api.fitbit.com';

@Injectable()
export class FitbitService {
  constructor(
    private readonly config: ConfigService,
    private readonly settingsService: SettingsService,
  ) {}

  private cfg(key: string): string {
    const v = this.config.get<string>(key);
    if (!v) throw new BadRequestException(`Missing ${key} in backend env`);
    return v;
  }

  private basicAuth(): string {
    return Buffer.from(
      `${this.cfg('FITBIT_CLIENT_ID')}:${this.cfg('FITBIT_CLIENT_SECRET')}`,
    ).toString('base64');
  }

  authUrl(): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.cfg('FITBIT_CLIENT_ID'),
      redirect_uri: this.cfg('FITBIT_REDIRECT_URI'),
      scope: SCOPES,
    });
    return `https://www.fitbit.com/oauth2/authorize?${params}`;
  }

  async exchangeCode(code: string): Promise<void> {
    const res = await fetch(`${API}/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.basicAuth()}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: this.cfg('FITBIT_REDIRECT_URI'),
      }),
    });
    if (!res.ok)
      throw new BadRequestException(`Fitbit token exchange failed: ${await res.text()}`);
    const data = (await res.json()) as { refresh_token?: string };
    if (!data.refresh_token) throw new BadRequestException('No refresh token from Fitbit');
    await this.settingsService.setFitbitTokens(data.refresh_token);
  }

  private async accessToken(): Promise<string> {
    const refresh = await this.settingsService.getFitbitRefreshToken();
    if (!refresh) throw new BadRequestException('Fitbit not connected');
    const res = await fetch(`${API}/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.basicAuth()}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh }),
    });
    if (!res.ok) throw new BadRequestException('Failed to refresh Fitbit token');
    const data = (await res.json()) as { access_token: string; refresh_token?: string };
    // Fitbit rotates refresh tokens — persist the new one
    if (data.refresh_token) await this.settingsService.setFitbitTokens(data.refresh_token);
    return data.access_token;
  }

  private async get(token: string, path: string): Promise<any | null> {
    try {
      const res = await fetch(`${API}${path}`, {
        headers: { Authorization: `Bearer ${token}`, 'Accept-Language': 'en_US' },
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  async today() {
    const token = await this.accessToken();
    const [activity, sleep, hrv, weight] = await Promise.all([
      this.get(token, '/1/user/-/activities/date/today.json'),
      this.get(token, '/1.2/user/-/sleep/date/today.json'),
      this.get(token, '/1/user/-/hrv/date/today.json'),
      this.get(token, '/1/user/-/body/log/weight/date/today.json'),
    ]);

    const steps = activity?.summary?.steps ?? null;
    const restingHeartRate = activity?.summary?.restingHeartRate ?? null;
    const sleepHours = sleep?.summary?.totalMinutesAsleep
      ? Math.round((sleep.summary.totalMinutesAsleep / 60) * 10) / 10
      : null;
    const hrvVal = hrv?.hrv?.[0]?.value?.dailyRmssd ?? null;
    const w = weight?.weight?.slice(-1)?.[0]?.weight ?? null;

    return {
      steps,
      restingHeartRate,
      sleepHours,
      hrv: hrvVal != null ? Math.round(hrvVal) : null,
      weightKg: w,
    };
  }
}
