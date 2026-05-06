import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateLogDto {
  @IsString()
  @IsNotEmpty()
  foodItemId: string;

  @IsNumber()
  @Min(0.1)
  quantity: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  note?: string;
}
