import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Global() 
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Exporting so other services so other modules can use it
})


export class PrismaModule {}
