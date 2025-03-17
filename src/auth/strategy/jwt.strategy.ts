import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>("JWT_SECRET") || "default_secret_key"
        });
    }

    async validate(payload: { sub: string; email: string }) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
            include: { profile: true } 
        });

        if (!user || !user.profile) {
            throw new UnauthorizedException("User or profile not found");
        }

        return user.profile;
    }
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService, private readonly config: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException("No authorization header provided");
    }
    const token = authHeader.split(' ')[1];
    try {
      const jwtSecret = this.config.get<string>("JWT_SECRET");
      request.user = await this.jwtService.verifyAsync(token, { secret: jwtSecret });
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
