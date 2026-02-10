import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID, IsInt, IsOptional, MaxLength, Min, Max, Matches } from 'class-validator'

export class CreateVehicleRequestDto {
  @ApiProperty({
    description: 'Vehicle license plate (Brazilian format)',
    example: 'ABC-1234',
  })
  @IsString()
  @Matches(/^[A-Z]{3}[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$|^[A-Z]{3}-[0-9]{4}$/, {
    message: 'License plate must be in format ABC-1234 or ABC1D23',
  })
  licensePlate: string

  @ApiProperty({
    description: 'Vehicle make/brand',
    example: 'Toyota',
  })
  @IsString()
  @MaxLength(100)
  make: string

  @ApiProperty({
    description: 'Vehicle model',
    example: 'Corolla',
  })
  @IsString()
  @MaxLength(100)
  model: string

  @ApiProperty({
    description: 'Manufacturing year',
    example: 2022,
  })
  @IsInt()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number

  @ApiProperty({
    description: 'Client ID (vehicle owner)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  clientId: string

  @ApiProperty({
    description: 'Vehicle Identification Number (17 characters)',
    example: '1HGBH41JXMN109186',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-HJ-NPR-Z0-9]{17}$/, {
    message: 'VIN must be exactly 17 alphanumeric characters (excluding I, O, Q)',
  })
  vin?: string

  @ApiProperty({
    description: 'Vehicle color',
    example: 'Silver',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string
}
