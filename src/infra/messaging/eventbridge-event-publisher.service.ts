import { Injectable } from '@nestjs/common'
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge'
import {
  IEventPublisher,
  OrderCreatedEvent,
  OrderStatusUpdatedEvent,
} from '@application/service-orders'

/**
 * EventBridge implementation of event publisher
 */
@Injectable()
export class EventBridgeEventPublisher implements IEventPublisher {
  private readonly eventBridge: EventBridgeClient
  private readonly eventBusName: string

  constructor() {
    const endpoint = process.env.LOCALSTACK_ENDPOINT
    this.eventBridge = new EventBridgeClient({
      region: process.env.AWS_REGION || 'us-east-1',
      ...(endpoint && {
        endpoint,
        credentials: {
          accessKeyId: 'local',
          secretAccessKey: 'local',
        },
      }),
    })
    this.eventBusName =
      process.env.EVENT_BUS_NAME || `fiap-tech-challenge-events-${process.env.NODE_ENV || 'development'}`
  }

  async publishOrderCreated(event: OrderCreatedEvent): Promise<void> {
    await this.publishEvent('OrderCreated', 'os-service', event)
  }

  async publishOrderStatusUpdated(event: OrderStatusUpdatedEvent): Promise<void> {
    await this.publishEvent('OrderStatusUpdated', 'os-service', event)
  }

  /**
   * Generic method to publish events to EventBridge
   */
  private async publishEvent(
    detailType: string,
    source: string,
    detail: any,
  ): Promise<void> {
    try {
      const command = new PutEventsCommand({
        Entries: [
          {
            EventBusName: this.eventBusName,
            Source: source,
            DetailType: detailType,
            Detail: JSON.stringify(detail),
            Time: new Date(),
          },
        ],
      })

      const response = await this.eventBridge.send(command)

      if (response.FailedEntryCount && response.FailedEntryCount > 0) {
        console.error('Failed to publish event:', response.Entries)
        throw new Error(`Failed to publish ${detailType} event`)
      }

      console.log(`✅ Event published: ${detailType}`, detail)
    } catch (error) {
      console.error(`Failed to publish ${detailType} event:`, error)
      throw error
    }
  }
}
