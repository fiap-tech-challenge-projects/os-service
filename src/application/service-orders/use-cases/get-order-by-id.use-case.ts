import { Inject, Injectable } from '@nestjs/common'
import { IServiceOrderRepository, SERVICE_ORDER_REPOSITORY } from '@domain/service-orders'
import { ServiceOrderDto } from '../dtos'
import { ServiceOrderMapper } from '../mappers'

/**
 * Use case for getting a service order by ID
 */
@Injectable()
export class GetOrderByIdUseCase {
  constructor(
    @Inject(SERVICE_ORDER_REPOSITORY)
    private readonly serviceOrderRepository: IServiceOrderRepository,
  ) {}

  async execute(id: string): Promise<ServiceOrderDto> {
    const serviceOrder = await this.serviceOrderRepository.findById(id)
    if (!serviceOrder) {
      throw new Error(`Service order with ID ${id} not found`)
    }

    return ServiceOrderMapper.toDto(serviceOrder)
  }
}
