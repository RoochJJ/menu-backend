import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUrl, IsUUID, MaxLength } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsUUID()
  categoryId?: string | null;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  picture?: string | null;

  @IsOptional()
  @IsBoolean()
  vegetarian?: boolean;

  @IsOptional()
  @IsBoolean()
  isNew?: boolean;
}