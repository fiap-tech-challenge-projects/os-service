import { Injectable } from '@nestjs/common'
import { ServiceOrderStatus } from '@prisma/client'
import { ServiceOrder, IServiceOrderRepository } from '@domain/service-orders'
import { PrismaService } from '../prisma.service'

/**
 * Prisma implementation of ServiceOrder repository
 */
@Injectable()
export class PrismaServiceOrderRepository implements IServiceOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(serviceOrder: ServiceOrder): Promise<ServiceOrder> {
    const created = await this.prisma.serviceOrder.create({
      data: {
        status: serviceOrder.status,
        requestDate: serviceOrder.requestDate,
        deliveryDate: serviceOrder.deliveryDate,
        cancellationReason: serviceOrder.cancellationReason,
        notes: serviceOrder.notes,
        clientId: serviceOrder.clientId,
        vehicleId: serviceOrder.vehicleId,
      },
    })

    return this.toDomain(created)
  }

  async findById(id: string): Promise<ServiceOrder | null> {
    const found = await this.prisma.serviceOrder.findUnique({
      where: { id },
    })

    return found ? this.toDomain(found) : null
  }

  async findAll(filters?: {
    clientId?: string
    vehicleId?: string
    status?: ServiceOrderStatus
    fromDate?: Date
    toDate?: Date
  }): Promise<ServiceOrder[]> {
    const found = await this.prisma.serviceOrder.findMany({
      where: {
        clientId: filters?.clientId,
        vehicleId: filters?.vehicleId,
        status: filters?.status,
        requestDate: {
          gte: filters?.fromDate,
          lte: filters?.toDate,
        },
      },
      orderBy: {
        requestDate: 'desc',
      },
    })

    return found.map(item => this.toDomain(item))
  }

  async update(id: string, serviceOrder: ServiceOrder): Promise<ServiceOrder> {
    const updated = await this.prisma.serviceOrder.update({
      where: { id },
      data: {
        status: serviceOrder.status,
        deliveryDate: serviceOrder.deliveryDate,
        cancellationReason: serviceOrder.cancellationReason,
        notes: serviceOrder.notes,
        updatedAt: serviceOrder.updatedAt,
      },
    })

    return this.toDomain(updated)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.serviceOrder.delete({
      where: { id },
    })
  }

  async count(filters?: {
    clientId?: string
    vehicleId?: string
    status?: ServiceOrderStatus
  }): Promise<number> {
    return this.prisma.serviceOrder.count({
      where: {
        clientId: filters?.clientId,
        vehicleId: filters?.vehicleId,
        status: filters?.status,
      },
    })
  }

  /**
   * Map Prisma model to domain entity
   */
  private toDomain(model: any): ServiceOrder {
    return new ServiceOrder(
      model.id,
      model.status,
      model.requestDate,
      model.deliveryDate,
      model.cancellationReason,
      model.notes,
      model.clientId,
      model.vehicleId,
      model.createdAt,
      model.updatedAt,
    )
  }
}
