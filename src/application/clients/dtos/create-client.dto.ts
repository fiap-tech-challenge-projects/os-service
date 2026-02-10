export class CreateClientDto {
  name: string
  email: string
  cpfCnpj: string
  phone?: string
  address?: string
}

export class ClientDto {
  id: string
  name: string
  email: string
  cpfCnpj: string
  phone?: string
  address?: string
  createdAt: Date
  updatedAt: Date
}
