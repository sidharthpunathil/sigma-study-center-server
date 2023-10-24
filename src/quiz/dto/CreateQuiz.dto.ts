import { CreateMcqOptionDto } from "./CreateMcqOptions.dto";
import { CreateTextOptionDto } from "./CreateText.dto";

export class CreateQuizDto {
  heading: string;
  description?: string;
  type: 'mcq' | 'text';
  mcqOptions?: CreateMcqOptionDto;
  textOptions?: CreateTextOptionDto;
}