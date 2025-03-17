import { Module } from '@nestjs/common';
import { CompleteprofiledetailsService } from './completeprofiledetails.service';
import { CompleteprofiledetailsController } from './completeprofiledetails.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [CompleteprofiledetailsController],
  providers: [CompleteprofiledetailsService],
  imports: [PrismaModule, ConfigModule, JwtModule.register({})]
})
export class CompleteprofiledetailsModule { }
