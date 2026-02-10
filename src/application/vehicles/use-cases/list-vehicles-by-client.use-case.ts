import { Inject, Injectable } from '@nestjs/common'
import { IVehicleRepository, VEHICLE_REPOSITORY } from '@domain/vehicles'
import { VehicleDto } from '../dtos'
import { VehicleMapper } from '../mappers'

/**
 * Use case for listing all vehicles for a client
 */
@Injectable()
export class ListVehiclesByClientUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepository: IVehicleRepository,
  ) {}

  async execute(clientId: string): Promise<VehicleDto[]> {
    const vehicles = await this.vehicleRepository.findByClientId(clientId)
    return VehicleMapper.toDtos(vehicles)
  }
}
