import { ServiceOrderStatus } from '@prisma/client'

export class ServiceOrderDto {
  id: string
  status: ServiceOrderStatus
  requestDate: Date
  deliveryDate?: Date
  cancellationReason?: string
  notes?: string
  clientId: string
  vehicleId: string
  createdAt: Date
  updatedAt: Date
}
