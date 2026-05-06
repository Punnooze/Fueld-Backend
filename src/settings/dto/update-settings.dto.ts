import { IsNumber, IsOptional, Min } from 'class-validator';

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
}
