import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { CompleteprofiledetailsModule } from './completeprofiledetails/completeprofiledetails.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal:true
  }),AuthModule, EventsModule, CompleteprofiledetailsModule],
})
export class AppModule {}
