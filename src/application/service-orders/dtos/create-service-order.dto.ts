export class CreateServiceOrderDto {
  clientId: string
  vehicleId: string
  notes?: string
}

export class CreateServiceOrderResponseDto {
  id: string
  status: string
  requestDate: Date
  clientId: string
  vehicleId: string
  notes?: string
  createdAt: Date
}
