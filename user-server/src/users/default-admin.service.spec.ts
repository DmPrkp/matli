import { ConfigService } from '@nestjs/config';
import { Role } from '@prisma/client';
import { compare } from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { DEFAULT_ADMIN_ID, DefaultAdminService } from './default-admin.service';

describe('DefaultAdminService', () => {
  function setup(existing: unknown, env: Record<string, string> = {}) {
    const prisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue(existing),
        create: jest.fn(async ({ data }) => data),
      },
      $executeRaw: jest.fn().mockResolvedValue(1),
      $transaction: jest.fn(async (operations: Promise<unknown>[]) => Promise.all(operations)),
    };
    const config = new ConfigService(env);
    const service = new DefaultAdminService(prisma as unknown as PrismaService, config);
    return { prisma, service };
  }

  it('creates an admin with id 1 and moves the id sequence past it', async () => {
    const { prisma, service } = setup(null, { DEFAULT_ADMIN_LOGIN: ' Root ', DEFAULT_ADMIN_PASSWORD: 'topsecret' });

    await service.onApplicationBootstrap();

    const { data } = prisma.user.create.mock.calls[0][0];
    expect(data).toMatchObject({ id: DEFAULT_ADMIN_ID, login: 'root', role: Role.ADMIN });
    expect(await compare('topsecret', data.password)).toBe(true);
    expect(prisma.$executeRaw).toHaveBeenCalledTimes(1);
  });

  it('leaves an existing user with id 1 untouched', async () => {
    const { prisma, service } = setup({ id: DEFAULT_ADMIN_ID });

    await service.onApplicationBootstrap();

    expect(prisma.user.create).not.toHaveBeenCalled();
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
