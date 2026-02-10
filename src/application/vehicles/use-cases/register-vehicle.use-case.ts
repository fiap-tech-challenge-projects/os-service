import { Inject, Injectable } from '@nestjs/common'
import { Vehicle, IVehicleRepository, VEHICLE_REPOSITORY } from '@domain/vehicles'
import { IClientRepository, CLIENT_REPOSITORY } from '@domain/clients'
import { CreateVehicleDto, VehicleDto } from '../dtos'
import { VehicleMapper } from '../mappers'

/**
 * Use case for registering a new vehicle
 */
@Injectable()
export class RegisterVehicleUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicleRepository: IVehicleRepository,
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(dto: CreateVehicleDto): Promise<VehicleDto> {
    // Validate client exists
    const client = await this.clientRepository.findById(dto.clientId)
    if (!client) {
      throw new Error(`Client with ID ${dto.clientId} not found`)
    }

    // Check if license plate already exists
    const existingPlate = await this.vehicleRepository.findByLicensePlate(dto.licensePlate)
    if (existingPlate) {
      throw new Error(`Vehicle with license plate ${dto.licensePlate} already exists`)
    }

    // Create vehicle entity
    const vehicle = Vehicle.create(
      dto.licensePlate,
      dto.make,
      dto.model,
      dto.year,
      dto.clientId,
      dto.vin,
      dto.color,
    )

    // Persist
    const created = await this.vehicleRepository.create(vehicle)

    return VehicleMapper.toDto(created)
  }
}
