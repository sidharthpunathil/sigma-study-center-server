import { createMcqOptionDto } from "./create-mcq-option.dto";
import { CreateTextOptionDto } from "./create-text.dto";

export class QuizDto {
  quizId?: string;
  heading: string;
  description?: string;
  type: 'mcq' | 'text';
  mcqOptions?: createMcqOptionDto;
  textOptions?: CreateTextOptionDto;
}