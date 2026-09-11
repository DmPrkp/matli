import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { randomBytes } from 'crypto';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: resolveJwtSecret(config.get<string>('JWT_SECRET')),
        signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') || '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AuthModule {}

// Раньше без JWT_SECRET подставлялся общеизвестный 'dev-secret', и в проде тоже: NODE_ENV=production
// стоит даже в dev-образе, так что отличить одно от другого нельзя. Случайный секрет безопасен,
// но живёт до рестарта — выданные токены протухают, а другие сервисы проверить их не смогут.
function resolveJwtSecret(secret: string | undefined): string {
  if (secret) {
    return secret;
  }

  new Logger('AuthModule').warn('JWT_SECRET is not set: using a random secret, tokens will not survive a restart');
  return randomBytes(32).toString('hex');
}
