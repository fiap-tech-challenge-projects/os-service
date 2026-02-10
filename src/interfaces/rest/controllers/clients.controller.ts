import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import {
  CreateClientUseCase,
  GetClientByIdUseCase,
  ListClientsUseCase,
} from '@application/clients'
import { CreateClientRequestDto } from '../dtos'

@ApiTags('clients')
@ApiBearerAuth()
@Controller('clients')
export class ClientsController {
  constructor(
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly getClientByIdUseCase: GetClientByIdUseCase,
    private readonly listClientsUseCase: ListClientsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new client' })
  @ApiResponse({ status: 201, description: 'Client registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Client already exists (email or CPF/CNPJ)' })
  async create(@Body() dto: CreateClientRequestDto) {
    try {
      return await this.createClientUseCase.execute(dto)
    } catch (error) {
      if (error.message.includes('already exists')) {
        throw new ConflictException(error.message)
      }
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by ID' })
  @ApiResponse({ status: 200, description: 'Client found' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  async findById(@Param('id') id: string) {
    try {
      return await this.getClientByIdUseCase.execute(id)
    } catch (error) {
      throw new NotFoundException(`Client with ID ${id} not found`)
    }
  }

  @Get()
  @ApiOperation({ summary: 'List all clients with optional search' })
  @ApiResponse({ status: 200, description: 'List of clients' })
  async findAll(@Query('search') search?: string) {
    return await this.listClientsUseCase.execute(search)
  }
}
