import { Inject, Injectable } from '@nestjs/common'
import { IServiceOrderRepository, SERVICE_ORDER_REPOSITORY } from '@domain/service-orders'
import { UpdateServiceOrderStatusDto, UpdateServiceOrderStatusResponseDto } from '../dtos'
import { IEventPublisher, EVENT_PUBLISHER } from '../events/event-publisher.interface'

/**
 * Use case for updating service order status
 */
@Injectable()
export class UpdateOrderStatusUseCase {
  constructor(
    @Inject(SERVICE_ORDER_REPOSITORY)
    private readonly serviceOrderRepository: IServiceOrderRepository,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(id: string, dto: UpdateServiceOrderStatusDto): Promise<UpdateServiceOrderStatusResponseDto> {
    // Find service order
    const serviceOrder = await this.serviceOrderRepository.findById(id)
    if (!serviceOrder) {
      throw new Error(`Service order with ID ${id} not found`)
    }

    // Update status (entity validates transition)
    serviceOrder.updateStatus(dto.status)

    // Persist
    const updated = await this.serviceOrderRepository.update(id, serviceOrder)

    // Publish OrderStatusUpdated event
    await this.eventPublisher.publishOrderStatusUpdated({
      orderId: updated.id,
      status: updated.status,
      updatedAt: updated.updatedAt,
    })

    return {
      id: updated.id,
      status: updated.status,
      updatedAt: updated.updatedAt,
    }
  }
}
