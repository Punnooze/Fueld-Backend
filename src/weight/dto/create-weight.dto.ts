import { IsDateString, IsNumber, Min } from 'class-validator';

export class CreateWeightDto {
  @IsNumber()
  @Min(1)
  weight!: number;

  @IsDateString()
  date!: string;
}
