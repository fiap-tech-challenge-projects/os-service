import { ApiProperty } from '@nestjs/swagger'
import { IsEnum } from 'class-validator'
import { ServiceOrderStatus } from '@prisma/client'

export class UpdateServiceOrderStatusRequestDto {
  @ApiProperty({
    description: 'New service order status',
    enum: ServiceOrderStatus,
    example: ServiceOrderStatus.RECEIVED,
  })
  @IsEnum(ServiceOrderStatus)
  status: ServiceOrderStatus
}
