import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength} from "class-validator";

export class CreateCategoryDto {
    name: string;
}
export class UpdateCategoryDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsBoolean()
    active?: boolean;
}
export class CreateCategoryResponseDto {
    
    @IsOptional()

    @IsString()

    @IsNotEmpty()

    @MaxLength(60)

    name: string;

    @IsOptional()
    @IsBoolean()
    active?: boolean;
}