import { Inject, Injectable } from '@nestjs/common'
import { IServiceOrderRepository, SERVICE_ORDER_REPOSITORY } from '@domain/service-orders'
import { ServiceOrderStatus } from '@prisma/client'
import { ServiceOrderDto } from '../dtos'
import { ServiceOrderMapper } from '../mappers'

export interface ListOrdersFilters {
  clientId?: string
  vehicleId?: string
  status?: ServiceOrderStatus
  fromDate?: Date
  toDate?: Date
}

/**
 * Use case for listing service orders with optional filters
 */
@Injectable()
export class ListOrdersUseCase {
  constructor(
    @Inject(SERVICE_ORDER_REPOSITORY)
    private readonly serviceOrderRepository: IServiceOrderRepository,
  ) {}

  async execute(filters?: ListOrdersFilters): Promise<ServiceOrderDto[]> {
    const orders = await this.serviceOrderRepository.findAll(filters)
    return ServiceOrderMapper.toDtos(orders)
  }
}
