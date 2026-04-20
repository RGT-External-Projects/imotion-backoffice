import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables from .env file
config({ path: join(__dirname, '.env') });

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/imotion_backoffice',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: true,
});
