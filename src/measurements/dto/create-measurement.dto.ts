import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateMeasurementDto {
  @IsDateString()
  date!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  neck?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  chest?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  waist?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hip?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rightArm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  leftArm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  forearm?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  thigh?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  calf?: number;
}
