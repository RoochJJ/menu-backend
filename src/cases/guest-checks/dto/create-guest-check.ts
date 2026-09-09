import { IsNotEmpty, IsString, IsUUID, isUUID, MaxLength } from "class-validator";
import { FindOperator } from "typeorm";

export class CreateGuestCheckDto {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  name?: string;
  spotId: string | FindOperator<string> | undefined;
}