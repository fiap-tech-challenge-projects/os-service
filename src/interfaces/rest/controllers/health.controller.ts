import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { PrismaService } from '@infra/database/prisma.service'

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  async check() {
    // Check database connection
    try {
      await this.prisma.$queryRaw`SELECT 1`
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'os-service',
        database: 'connected',
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        service: 'os-service',
        database: 'disconnected',
        error: error.message,
      }
    }
  }
}
