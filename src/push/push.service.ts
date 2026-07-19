import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as webpush from 'web-push';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class PushService {
  private readonly log = new Logger('Push');
  private ready = false;

  constructor(
    private readonly config: ConfigService,
    private readonly settingsService: SettingsService,
  ) {
    const pub = config.get<string>('VAPID_PUBLIC_KEY');
    const priv = config.get<string>('VAPID_PRIVATE_KEY');
    const email = config.get<string>('VAPID_EMAIL') ?? 'mailto:admin@fueld.app';
    if (pub && priv) {
      webpush.setVapidDetails(email, pub, priv);
      this.ready = true;
    }
  }

  publicKey(): string {
    return this.config.get<string>('VAPID_PUBLIC_KEY') ?? '';
  }

  async subscribe(sub: Record<string, unknown>): Promise<{ ok: boolean }> {
    await this.settingsService.setPushSubscription(sub);
    return { ok: true };
  }

  /** Fire a push to the stored subscription. Silent no-op if not set up. */
  async notify(title: string, body: string, url = '/'): Promise<boolean> {
    if (!this.ready) return false;
    const sub = await this.settingsService.getPushSubscription();
    if (!sub) return false;
    try {
      await webpush.sendNotification(sub as any, JSON.stringify({ title, body, url }));
      return true;
    } catch (e: any) {
      // subscription expired/gone → drop it
      if (e?.statusCode === 404 || e?.statusCode === 410) {
        await this.settingsService.setPushSubscription({} as any);
      }
      this.log.warn(`push failed: ${e?.statusCode ?? e?.message}`);
      return false;
    }
  }

  test(): Promise<boolean> {
    return this.notify('FUELD', 'Notifications armed. No excuses now.', '/');
  }
}
