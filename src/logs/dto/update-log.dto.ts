import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateLogDto {
  @IsOptional()
  @IsString()
  foodItemId?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.1)
  quantity?: number;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  meal?: string; // breakfast | lunch | dinner | other
}
