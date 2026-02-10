export class CreateVehicleDto {
  licensePlate: string
  make: string
  model: string
  year: number
  clientId: string
  vin?: string
  color?: string
}

export class VehicleDto {
  id: string
  licensePlate: string
  make: string
  model: string
  year: number
  clientId: string
  vin?: string
  color?: string
  createdAt: Date
  updatedAt: Date
}
