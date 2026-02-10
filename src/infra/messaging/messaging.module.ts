import { Module } from '@nestjs/common'
import { EventBridgeEventPublisher } from './eventbridge-event-publisher.service'
import { EVENT_PUBLISHER } from '@application/service-orders'

/**
 * Messaging module providing event publisher implementation
 */
@Module({
  providers: [
    {
      provide: EVENT_PUBLISHER,
      useClass: EventBridgeEventPublisher,
    },
  ],
  exports: [EVENT_PUBLISHER],
})
export class MessagingModule {}
