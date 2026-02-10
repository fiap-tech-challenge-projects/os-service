import { Injectable } from '@nestjs/common'
import { Client, IClientRepository } from '@domain/clients'
import { Email, CpfCnpj } from '@shared/value-objects'
import { PrismaService } from '../prisma.service'

/**
 * Prisma implementation of Client repository
 */
@Injectable()
export class PrismaClientRepository implements IClientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(client: Client): Promise<Client> {
    const created = await this.prisma.client.create({
      data: {
        name: client.name,
        email: client.email.value,
        cpfCnpj: client.cpfCnpj.clean,
        phone: client.phone,
        address: client.address,
      },
    })

    return this.toDomain(created)
  }

  async findById(id: string): Promise<Client | null> {
    const found = await this.prisma.client.findUnique({
      where: { id },
    })

    return found ? this.toDomain(found) : null
  }

  async findByEmail(email: string): Promise<Client | null> {
    const found = await this.prisma.client.findUnique({
      where: { email: email.toLowerCase() },
    })

    return found ? this.toDomain(found) : null
  }

  async findByCpfCnpj(cpfCnpj: string): Promise<Client | null> {
    const clean = cpfCnpj.replace(/\D/g, '')
    const found = await this.prisma.client.findUnique({
      where: { cpfCnpj: clean },
    })

    return found ? this.toDomain(found) : null
  }

  async findAll(search?: string): Promise<Client[]> {
    const found = await this.prisma.client.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { cpfCnpj: { contains: search.replace(/\D/g, '') } },
            ],
          }
        : undefined,
      orderBy: {
        name: 'asc',
      },
    })

    return found.map(item => this.toDomain(item))
  }

  async update(id: string, client: Client): Promise<Client> {
    const updated = await this.prisma.client.update({
      where: { id },
      data: {
        name: client.name,
        email: client.email.value,
        phone: client.phone,
        address: client.address,
        updatedAt: client.updatedAt,
      },
    })

    return this.toDomain(updated)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.delete({
      where: { id },
    })
  }

  /**
   * Map Prisma model to domain entity
   */
  private toDomain(model: any): Client {
    return new Client(
      model.id,
      model.name,
      Email.create(model.email),
      CpfCnpj.create(model.cpfCnpj),
      model.phone,
      model.address,
      model.createdAt,
      model.updatedAt,
    )
  }
}
