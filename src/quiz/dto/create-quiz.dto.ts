export class CreateQuizDto {
  heading: string;
  description: string;
  type: 'mcq' | 'text';
  mcqOptions?: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  textOption?: string;
  email: string;
}