import { Injectable, Logger } from '@nestjs/common';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

@Injectable()
export class PushService {
  private expo = new Expo();
  private logger = new Logger(PushService.name);

  async sendToTokens(tokens: (string | null)[], title: string, body: string) {
    const validTokens = tokens.filter(
      (t): t is string => !!t && Expo.isExpoPushToken(t),
    );

    if (validTokens.length === 0) return;

    const messages: ExpoPushMessage[] = validTokens.map((token) => ({
      to: token,
      sound: 'default',
      title,
      body,
    }));

    const chunks = this.expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      try {
        await this.expo.sendPushNotificationsAsync(chunk);
      } catch (error) {
        this.logger.error('Error enviando notificaciones push', error);
      }
    }
  }
}