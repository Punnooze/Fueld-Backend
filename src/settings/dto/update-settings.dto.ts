import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  targetCalories?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  targetProtein?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  targetCarbs?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  targetFat?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  height?: number;

  @IsOptional()
  @IsString()
  characterName?: string;

  @IsOptional()
  @IsString()
  hevyApiKey?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  stepTarget?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sleepTarget?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  goalWeight?: number;
}
