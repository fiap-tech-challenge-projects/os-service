import { Vehicle } from '@domain/vehicles'
import { VehicleDto } from '../dtos'

/**
 * Mapper for Vehicle entity to DTO
 */
export class VehicleMapper {
  static toDto(entity: Vehicle): VehicleDto {
    return {
      id: entity.id,
      licensePlate: entity.licensePlate.formatted,
      make: entity.make,
      model: entity.model,
      year: entity.year,
      clientId: entity.clientId,
      vin: entity.vin?.clean,
      color: entity.color,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }

  static toDtos(entities: Vehicle[]): VehicleDto[] {
    return entities.map(entity => this.toDto(entity))
  }
}
