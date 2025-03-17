import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true
  }),AuthModule, EventsModule],
})
export class AppModule {}
