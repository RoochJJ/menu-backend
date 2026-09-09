import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CategoryModule } from './cases/categories/category.module';
import { Category } from './cases/categories/category.entity';
import { Product } from './cases/products/product.entity';
import { ProductModule } from './cases/products/product.module';
import { SpotModule } from './cases/spots/spot.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Product]), // Adicione a entidade Product aqui
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
          ssl: false
        };
      }
    }),
    CategoryModule,
    ProductModule,
    SpotModule

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
