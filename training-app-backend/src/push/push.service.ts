import { Injectable, Logger } from '@nestjs/common';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';

@Injectable()
export class PushService {
  private expo = new Expo();
  private logger = new Logger(PushService.name);

  async sendToTokens(
    tokens: (string | null)[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    const validTokens = Array.from(
      new Set(tokens.filter((t): t is string => !!t && Expo.isExpoPushToken(t))),
    );

    if (validTokens.length === 0) return;

    const messages: ExpoPushMessage[] = validTokens.map((token) => ({
      to: token,
      sound: 'default',
      title,
      body,
      data,
    }));

    const chunks = this.expo.chunkPushNotifications(messages);

    for (const chunk of chunks) {
      try {
        const tickets = await this.expo.sendPushNotificationsAsync(chunk);
        for (const ticket of tickets) {
          if (ticket.status === 'error') {
            this.logger.warn(`Notificación rechazada por Expo: ${ticket.message}`);
          }
        }
      } catch (error) {
        this.logger.error('Error enviando notificaciones push', error);
      }
    }
  }
}