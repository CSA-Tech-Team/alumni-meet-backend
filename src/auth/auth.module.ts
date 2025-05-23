import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { JWTStrategy } from "./strategy/jwt.strategy";
import { PrismaModule } from "src/prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [PrismaModule, JwtModule.register({}), ConfigModule], // we will have access to all the providers within that module in the import
    controllers: [AuthController], // handling requests
    providers: [AuthService, JWTStrategy] // providers/service handles the business logic
})

export class AuthModule { }