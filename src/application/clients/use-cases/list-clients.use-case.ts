import { Inject, Injectable } from '@nestjs/common'
import { IClientRepository, CLIENT_REPOSITORY } from '@domain/clients'
import { ClientDto } from '../dtos'
import { ClientMapper } from '../mappers'

/**
 * Use case for listing all clients
 */
@Injectable()
export class ListClientsUseCase {
  constructor(
    @Inject(CLIENT_REPOSITORY)
    private readonly clientRepository: IClientRepository,
  ) {}

  async execute(search?: string): Promise<ClientDto[]> {
    const clients = await this.clientRepository.findAll(search)
    return ClientMapper.toDtos(clients)
  }
}
