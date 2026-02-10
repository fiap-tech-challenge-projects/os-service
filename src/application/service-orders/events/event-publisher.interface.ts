import { ServiceOrderStatus } from '@prisma/client'

/**
 * Event payload for OrderCreated event
 */
export interface OrderCreatedEvent {
  orderId: string
  clientId: string
  vehicleId: string
  status: ServiceOrderStatus
  requestDate: Date
}

/**
 * Event payload for OrderStatusUpdated event
 */
export interface OrderStatusUpdatedEvent {
  orderId: string
  status: ServiceOrderStatus
  updatedAt: Date
}

/**
 * Interface for publishing domain events to EventBridge
 */
export interface IEventPublisher {
  /**
   * Publish OrderCreated event
   */
  publishOrderCreated(event: OrderCreatedEvent): Promise<void>

  /**
   * Publish OrderStatusUpdated event
   */
  publishOrderStatusUpdated(event: OrderStatusUpdatedEvent): Promise<void>
}

export const EVENT_PUBLISHER = Symbol('EVENT_PUBLISHER')
