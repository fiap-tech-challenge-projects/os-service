import { Inject, Injectable } from '@nestjs/common'
import { ServiceOrder, IServiceOrderRepository, SERVICE_ORDER_REPOSITORY } from '@domain/service-orders'
import { IClientRepository, CLIENT_REPOSITORY } from '@domain/clients'
import { IVehicleRepository, VEHICLE_REPOSITORY } from '@domain/vehicles'
import { CreateServiceOrderDto, CreateServiceOrderResponseDto } from '../dtos'
import { ServiceOrderMapper } from '../mappers'
import { IEventPublisher, EVENT_PUBLISHER } from '../events/event-publisher.interface'

/**
 * Use case for creating a new service order
 */
@Injectable()
export class CreateServiceOrderUseCase {
  constructor(
    @Inject(SERVICE_ORDER_REPOSITORY)
    private readonly serviceOrderRepository: IServiceOrderRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepository: IVehicleRepository,
    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: IEventPublisher,
  ) {}

  async execute(dto: CreateServiceOrderDto): Promise<CreateServiceOrderResponseDto> {
    // Validate client exists
    const client = await this.clientRepository.findById(dto.clientId)
    if (!client) {
      throw new Error(`Client with ID ${dto.clientId} not found`)
    }

    // Validate vehicle exists and belongs to client
    const vehicle = await this.vehicleRepository.findById(dto.vehicleId)
    if (!vehicle) {
      throw new Error(`Vehicle with ID ${dto.vehicleId} not found`)
    }
    if (vehicle.clientId !== dto.clientId) {
      throw new Error(`Vehicle ${dto.vehicleId} does not belong to client ${dto.clientId}`)
    }

    // Create service order entity
    const serviceOrder = ServiceOrder.create(dto.clientId, dto.vehicleId, dto.notes)

    // Persist
    const created = await this.serviceOrderRepository.create(serviceOrder)

    // Publish OrderCreated event
    await this.eventPublisher.publishOrderCreated({
      orderId: created.id,
      clientId: created.clientId,
      vehicleId: created.vehicleId,
      status: created.status,
      requestDate: created.requestDate,
    })

    // Return response
    const mapped = ServiceOrderMapper.toDto(created)
    return {
      id: mapped.id,
      status: mapped.status,
      requestDate: mapped.requestDate,
      clientId: mapped.clientId,
      vehicleId: mapped.vehicleId,
      notes: mapped.notes,
      createdAt: mapped.createdAt,
    }
  }
}
