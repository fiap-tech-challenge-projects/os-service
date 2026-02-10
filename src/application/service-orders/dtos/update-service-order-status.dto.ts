import { ServiceOrderStatus } from '@prisma/client'

export class UpdateServiceOrderStatusDto {
  status: ServiceOrderStatus
}

export class UpdateServiceOrderStatusResponseDto {
  id: string
  status: string
  updatedAt: Date
}
