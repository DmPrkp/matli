import { Pool } from 'pg';
import { readdir, readFile } from 'node:fs/promises';

const MIGRATION_PATH = __dirname + '/migrations/';

export const PGClientName = Symbol('PGClient');

async function checkIsDBExist(client) {
  const { rows } = await client.query(
    "SELECT EXISTS(SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower('matli'));",
  );

  const { exists } = rows[0];
  return exists;
}

export const PGClientFactory = {
  provide: PGClientName,
  useFactory: async (): Promise<Pool> => {
    const client = await new Pool({
      host: 'db',
      port: 5432,
      database: 'matli',
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    });

    const fileNames = await readdir(MIGRATION_PATH);

    const isExist = await checkIsDBExist(client);

    if (isExist) {
      // Remove old data
      const downFileNames = fileNames
        .filter((elm) => elm.match(/.*\.(down.sql?)/gi))
        .reverse();

      const downFilesBuff = await Promise.all(
        downFileNames.map((name) => readFile(MIGRATION_PATH + name)),
      );
      const downFiles = downFilesBuff.map((file) => file.toString());

      for (const file of downFiles) {
        await client.query(file);
      }
    }

    // Add new data
    const upFileNames = fileNames.filter((elm) => elm.match(/.*\.(up.sql?)/gi));
    const upFilesBuff = await Promise.all(
      upFileNames.map((name) => readFile(MIGRATION_PATH + name)),
    );
    const upFiles = upFilesBuff.map((file) => file.toString());

    for (const file of upFiles) {
      try {
        await client.query(file);
      } catch (error) {
        console.error('Error executing up migration:', error);
      }
    }

    return client;
  },
};
