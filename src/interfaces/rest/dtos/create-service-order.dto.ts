import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID, IsOptional, MaxLength } from 'class-validator'

export class CreateServiceOrderRequestDto {
  @ApiProperty({
    description: 'Client ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  clientId: string

  @ApiProperty({
    description: 'Vehicle ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  vehicleId: string

  @ApiProperty({
    description: 'Optional notes about the service request',
    example: 'Client reported strange noise from engine',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string
}
