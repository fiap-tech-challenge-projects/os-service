import { Inject, Injectable } from '@nestjs/common'
import { Client, IClientRepository, CLIENT_REPOSITORY } from '@domain/clients'
import { CreateClientDto, ClientDto } from '../dtos'
import { ClientMapper } from '../mappers'

/**
 * Use case for creating a new client
 */
@Injectable()
export class CreateClientUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(dto: CreateClientDto): Promise<ClientDto> {
    // Check if email already exists
    const existingEmail = await this.clientRepository.findByEmail(dto.email)
    if (existingEmail) {
      throw new Error(`Client with email ${dto.email} already exists`)
    }

    // Check if CPF/CNPJ already exists
    const existingCpfCnpj = await this.clientRepository.findByCpfCnpj(dto.cpfCnpj)
    if (existingCpfCnpj) {
      throw new Error(`Client with CPF/CNPJ ${dto.cpfCnpj} already exists`)
    }

    // Create client entity
    const client = Client.create(dto.name, dto.email, dto.cpfCnpj, dto.phone, dto.address)

    // Persist
    const created = await this.clientRepository.create(client)

    return ClientMapper.toDto(created)
  }
}
