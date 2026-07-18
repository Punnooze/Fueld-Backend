import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateWorkoutDto {
  @IsString()
  type!: string; // Push|Pull|Legs|Full Body|Cardio|Other

  @IsOptional()
  @IsNumber()
  @Min(0)
  duration?: number;

  @IsOptional()
  @IsIn(['Easy', 'Medium', 'Hard', 'Destroyed'])
  intensity?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsString()
  date!: string; // YYYY-MM-DD
}
