import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const dbSchema = configService.get<string>('DB_SCHEMA', 'public');

        if (!databaseUrl) {
          throw new Error('A variaavel de ambiente DATABASE_URL não foi encontrada.');
        }

        return {
          type: 'postgres',
          url: databaseUrl,
          schema: dbSchema,
          autoLoadEntities: true,
          synchronize: true,
        };
      }
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
