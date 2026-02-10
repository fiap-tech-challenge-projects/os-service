import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from '@infra/database/database.module'
import { MessagingModule } from '@infra/messaging/messaging.module'
import {
  ServiceOrdersController,
  ClientsController,
  VehiclesController,
  HealthController,
} from './interfaces/rest/controllers'
import {
  CreateServiceOrderUseCase,
  UpdateOrderStatusUseCase,
  GetOrderByIdUseCase,
  ListOrdersUseCase,
} from '@application/service-orders'
import {
  CreateClientUseCase,
  GetClientByIdUseCase,
  ListClientsUseCase,
} from '@application/clients'
import {
  RegisterVehicleUseCase,
  GetVehicleByIdUseCase,
  ListVehiclesByClientUseCase,
} from '@application/vehicles'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
    MessagingModule,
  ],
  controllers: [
    ServiceOrdersController,
    ClientsController,
    VehiclesController,
    HealthController,
  ],
  providers: [
    // Service Order use cases
    CreateServiceOrderUseCase,
    UpdateOrderStatusUseCase,
    GetOrderByIdUseCase,
    ListOrdersUseCase,
    // Client use cases
    CreateClientUseCase,
    GetClientByIdUseCase,
    ListClientsUseCase,
    // Vehicle use cases
    RegisterVehicleUseCase,
    GetVehicleByIdUseCase,
    ListVehiclesByClientUseCase,
  ],
})
export class AppModule {}
