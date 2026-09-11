import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { hashPassword } from './password';

export const DEFAULT_ADMIN_ID = 1;

// Админа заводит сам сервис при старте, а не `prisma db seed`: сид требует ts-node и
// отдельного шага в CMD, а прод-образ запускает собранный dist. Так админ появляется
// одинаково в dev и в проде, и раньше, чем сервер начнёт принимать запросы.
@Injectable()
export class DefaultAdminService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DefaultAdminService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    // Только создание, никакого upsert: старый сид на каждом запуске перезаписывал
    // пароль значением из env, и сменённый пароль админа не переживал рестарт.
    const existing = await this.prisma.user.findUnique({ where: { id: DEFAULT_ADMIN_ID } });
    if (existing) {
      return;
    }

    const login = (this.config.get<string>('DEFAULT_ADMIN_LOGIN') || 'admin').trim().toLowerCase();
    const envPassword = this.config.get<string>('DEFAULT_ADMIN_PASSWORD');
    const password = envPassword || randomBytes(12).toString('base64url');

    await this.prisma.$transaction([
      this.prisma.user.create({
        data: {
          id: DEFAULT_ADMIN_ID,
          login,
          password: await hashPassword(password),
          firstName: this.config.get<string>('DEFAULT_ADMIN_FIRST_NAME') || 'Администратор',
          role: Role.ADMIN,
        },
      }),
      // Явный id не двигает SERIAL-последовательность: без setval первая же
      // регистрация получила бы id 1 и упала на duplicate key.
      this.prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"User"', 'id'), (SELECT MAX(id) FROM "User"))`,
    ]);

    if (envPassword) {
      this.logger.log(`Default admin created: id=${DEFAULT_ADMIN_ID}, login "${login}"`);
    } else {
      // Пароль нигде больше не сохраняется — это единственный раз, когда его видно.
      this.logger.warn(
        `Default admin created: id=${DEFAULT_ADMIN_ID}, login "${login}", generated password "${password}". ` +
          'It is shown only once: change it via POST /auth/change-password.',
      );
    }
  }
}
