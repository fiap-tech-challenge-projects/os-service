import { Inject, Injectable } from '@nestjs/common'
import { IClientRepository, CLIENT_REPOSITORY } from '@domain/clients'
import { ClientDto } from '../dtos'
import { ClientMapper } from '../mappers'

/**
 * Use case for getting a client by ID
 */
@Injectable()
export class GetClientByIdUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(id: string): Promise<ClientDto> {
    const client = await this.clientRepository.findById(id)
    if (!client) {
      throw new Error(`Client with ID ${id} not found`)
    }

    return ClientMapper.toDto(client)
  }
}
