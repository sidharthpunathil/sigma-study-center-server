import { IsNumber, IsString } from 'class-validator';


export class CreateQuizDto {

  @IsString()
  heading?: string;
  description: string;
  type: 'mcq' | 'text';

  @IsNumber()
  score?: number;
  mcqOptions?: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  textOption?: string;
  email: string;
}