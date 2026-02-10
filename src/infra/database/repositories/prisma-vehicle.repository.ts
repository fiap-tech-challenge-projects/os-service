import { Injectable } from '@nestjs/common'
import { Vehicle, IVehicleRepository } from '@domain/vehicles'
import { LicensePlate, Vin } from '@shared/value-objects'
import { PrismaService } from '../prisma.service'

/**
 * Prisma implementation of Vehicle repository
 */
@Injectable()
export class PrismaVehicleRepository implements IVehicleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(vehicle: Vehicle): Promise<Vehicle> {
    const created = await this.prisma.vehicle.create({
      data: {
        licensePlate: vehicle.licensePlate.clean,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        vin: vehicle.vin?.clean,
        color: vehicle.color,
        clientId: vehicle.clientId,
      },
    })

    return this.toDomain(created)
  }

  async findById(id: string): Promise<Vehicle | null> {
    const found = await this.prisma.vehicle.findUnique({
      where: { id },
    })

    return found ? this.toDomain(found) : null
  }

  async findByLicensePlate(licensePlate: string): Promise<Vehicle | null> {
    const clean = licensePlate.toUpperCase().replace(/[^A-Z0-9]/g, '')
    const found = await this.prisma.vehicle.findUnique({
      where: { licensePlate: clean },
    })

    return found ? this.toDomain(found) : null
  }

  async findByClientId(clientId: string): Promise<Vehicle[]> {
    const found = await this.prisma.vehicle.findMany({
      where: { clientId },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return found.map(item => this.toDomain(item))
  }

  async findAll(search?: string): Promise<Vehicle[]> {
    const found = await this.prisma.vehicle.findMany({
      where: search
        ? {
            OR: [
              { licensePlate: { contains: search.toUpperCase().replace(/[^A-Z0-9]/g, '') } },
              { make: { contains: search, mode: 'insensitive' } },
              { model: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return found.map(item => this.toDomain(item))
  }

  async update(id: string, vehicle: Vehicle): Promise<Vehicle> {
    const updated = await this.prisma.vehicle.update({
      where: { id },
      data: {
        licensePlate: vehicle.licensePlate.clean,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        vin: vehicle.vin?.clean,
        color: vehicle.color,
        updatedAt: vehicle.updatedAt,
      },
    })

    return this.toDomain(updated)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.vehicle.delete({
      where: { id },
    })
  }

  /**
   * Map Prisma model to domain entity
   */
  private toDomain(model: any): Vehicle {
    return new Vehicle(
      model.id,
      LicensePlate.create(model.licensePlate),
      model.make,
      model.model,
      model.year,
      model.clientId,
      model.vin ? Vin.create(model.vin) : undefined,
      model.color,
      model.createdAt,
      model.updatedAt,
    )
  }
}
