import { Module } from '@nestjs/common';
import { EventService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [PrismaModule, ConfigModule, JwtModule.register({})],
    controllers: [EventsController],
    providers: [EventService],
})
export class EventsModule {

}
