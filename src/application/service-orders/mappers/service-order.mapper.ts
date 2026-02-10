import { ServiceOrder } from '@domain/service-orders'
import { ServiceOrderDto } from '../dtos'

/**
 * Mapper for ServiceOrder entity to DTO and vice versa
 */
export class ServiceOrderMapper {
  /**
   * Map entity to DTO
   */
  static toDto(entity: ServiceOrder): ServiceOrderDto {
    return {
      id: entity.id,
      status: entity.status,
      requestDate: entity.requestDate,
      deliveryDate: entity.deliveryDate,
      cancellationReason: entity.cancellationReason,
      notes: entity.notes,
      clientId: entity.clientId,
      vehicleId: entity.vehicleId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }

  /**
   * Map array of entities to DTOs
   */
  static toDtos(entities: ServiceOrder[]): ServiceOrderDto[] {
    return entities.map(entity => this.toDto(entity))
  }
}
