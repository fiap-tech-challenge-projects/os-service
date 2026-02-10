import { Inject, Injectable } from '@nestjs/common'
import { IVehicleRepository, VEHICLE_REPOSITORY } from '@domain/vehicles'
import { VehicleDto } from '../dtos'
import { VehicleMapper } from '../mappers'

/**
 * Use case for getting a vehicle by ID
 */
@Injectable()
export class GetVehicleByIdUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepository: IVehicleRepository,
  ) {}

  async execute(id: string): Promise<VehicleDto> {
    const vehicle = await this.vehicleRepository.findById(id)
    if (!vehicle) {
      throw new Error(`Vehicle with ID ${id} not found`)
    }

    return VehicleMapper.toDto(vehicle)
  }
}
