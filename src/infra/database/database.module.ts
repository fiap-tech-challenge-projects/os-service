import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import {
  PrismaServiceOrderRepository,
  PrismaClientRepository,
  PrismaVehicleRepository,
} from './repositories'
import { SERVICE_ORDER_REPOSITORY } from '@domain/service-orders'
import { CLIENT_REPOSITORY } from '@domain/clients'
import { VEHICLE_REPOSITORY } from '@domain/vehicles'

/**
 * Database module providing repository implementations
 */
@Module({
  providers: [
    PrismaService,
    {
      provide: SERVICE_ORDER_REPOSITORY,
      useClass: PrismaServiceOrderRepository,
    },
    {
      provide: CLIENT_REPOSITORY,
      useClass: PrismaClientRepository,
    },
    {
      provide: VEHICLE_REPOSITORY,
      useClass: PrismaVehicleRepository,
    },
  ],
  exports: [
    PrismaService,
    SERVICE_ORDER_REPOSITORY,
    CLIENT_REPOSITORY,
    VEHICLE_REPOSITORY,
  ],
})
export class DatabaseModule {}
