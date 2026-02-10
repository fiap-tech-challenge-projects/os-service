import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import {
  CreateServiceOrderUseCase,
  UpdateOrderStatusUseCase,
  GetOrderByIdUseCase,
  ListOrdersUseCase,
} from '@application/service-orders'
import {
  CreateServiceOrderRequestDto,
  UpdateServiceOrderStatusRequestDto,
} from '../dtos'
import { ServiceOrderStatus } from '@prisma/client'

@ApiTags('service-orders')
@ApiBearerAuth()
@Controller('service-orders')
export class ServiceOrdersController {
  constructor(
    private readonly createServiceOrderUseCase: CreateServiceOrderUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    private readonly listOrdersUseCase: ListOrdersUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new service order' })
  @ApiResponse({ status: 201, description: 'Service order created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Client or vehicle not found' })
  async create(@Body() dto: CreateServiceOrderRequestDto) {
    try {
      return await this.createServiceOrderUseCase.execute(dto)
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new NotFoundException(error.message)
      }
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service order by ID' })
  @ApiResponse({ status: 200, description: 'Service order found' })
  @ApiResponse({ status: 404, description: 'Service order not found' })
  async findById(@Param('id') id: string) {
    try {
      return await this.getOrderByIdUseCase.execute(id)
    } catch (error) {
      throw new NotFoundException(`Service order with ID ${id} not found`)
    }
  }

  @Get()
  @ApiOperation({ summary: 'List service orders with optional filters' })
  @ApiResponse({ status: 200, description: 'List of service orders' })
  async findAll(
    @Query('clientId') clientId?: string,
    @Query('vehicleId') vehicleId?: string,
    @Query('status') status?: ServiceOrderStatus,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return await this.listOrdersUseCase.execute({
      clientId,
      vehicleId,
      status,
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
    })
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update service order status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  @ApiResponse({ status: 404, description: 'Service order not found' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateServiceOrderStatusRequestDto,
  ) {
    try {
      return await this.updateOrderStatusUseCase.execute(id, dto)
    } catch (error) {
      if (error.message.includes('not found')) {
        throw new NotFoundException(error.message)
      }
      throw error
    }
  }
}
