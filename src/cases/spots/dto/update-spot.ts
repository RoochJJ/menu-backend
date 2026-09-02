import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength} from "class-validator";

export class UpdateSpotDto {
    @IsOptional()
    @IsString()
    @MaxLength(60)
    name?: string;

    @IsOptional()
    @IsBoolean()
    active?: boolean;
}