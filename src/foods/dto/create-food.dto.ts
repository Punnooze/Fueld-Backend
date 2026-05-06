import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateFoodDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  calories: number;

  @IsNumber()
  @Min(0)
  protein: number;

  @IsNumber()
  @Min(0)
  carbs: number;

  @IsNumber()
  @Min(0)
  fat: number;
}
