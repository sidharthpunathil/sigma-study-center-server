export class EditQuizDto {
  quizId: string;
  heading?: string;
  description?: string;
  type?: 'mcq' | 'text';
  score?: number;
  multimedia?: string;
  mcqOptions?: {
    a?: string;
    b?: string;
    c?: string;
    d?: string;
  };
  textOption?: string;
  email?: string;
}