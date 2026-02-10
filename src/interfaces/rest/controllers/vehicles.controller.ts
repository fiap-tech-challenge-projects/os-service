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
  RegisterVehicleUseCase,
  GetVehicleByIdUseCase,
  ListVehiclesByClientUseCase,
} from '@application/vehicles'
import { CreateVehicleRequestDto } from '../dtos'

@ApiTags('vehicles')
@ApiBearerAuth()
@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly registerVehicleUseCase: RegisterVehicleUseCase,
    private readonly getVehicleByIdUseCase: GetVehicleByIdUseCase,
    private readonly listVehiclesByClientUseCase: ListVehiclesByClientUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new vehicle' })
  @ApiResponse({ status: 201, description: 'Vehicle registered successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Client not found' })
  @ApiResponse({ status: 409, description: 'License plate already exists' })
  async create(@Body() dto: CreateVehicleRequestDto) {
    try {
      return await this.registerVehicleUseCase.execute(dto)
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new NotFoundException(error.message)
      }
      if (error.message.includes('already exists')) {
        throw new ConflictException(error.message)
      }
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vehicle by ID' })
  @ApiResponse({ status: 200, description: 'Vehicle found' })
  @ApiResponse({ status: 404, description: 'Vehicle not found' })
  async findById(@Param('id') id: string) {
    try {
      return await this.getVehicleByIdUseCase.execute(id)
    } catch (error) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`)
    }
  }

  @Get()
  @ApiOperation({ summary: 'List vehicles by client ID' })
  @ApiResponse({ status: 200, description: 'List of vehicles' })
  async findByClient(@Query('clientId') clientId: string) {
    if (!clientId) {
      throw new NotFoundException('clientId query parameter is required')
    }
    return await this.listVehiclesByClientUseCase.execute(clientId)
  }
}
