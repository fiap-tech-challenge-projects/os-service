import { Client } from '@domain/clients'
import { ClientDto } from '../dtos'

/**
 * Mapper for Client entity to DTO
 */
export class ClientMapper {
  static toDto(entity: Client): ClientDto {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email.value,
      cpfCnpj: entity.cpfCnpj.formatted,
      phone: entity.phone,
      address: entity.address,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }
  }

  static toDtos(entities: Client[]): ClientDto[] {
    return entities.map(entity => this.toDto(entity))
  }
}
