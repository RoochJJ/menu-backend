import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, MaxLength} from "class-validator";

export class UpdateCategoryDto {
    @IsOptional()
    @IsString()
    @MaxLength(60)
    name?: string;

    @IsOptional()
    @IsBoolean()
    active?: boolean;

    
    @IsOptional()
    @IsUrl()
    icon?: string;
}