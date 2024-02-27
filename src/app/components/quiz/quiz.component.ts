import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import quizz_questions from '../../../assets/data/quizz_questions.json';

interface Question {
  id: number;
  question: string;
  options: Option[];
}

interface Option {
  id: number;
  name: string;
  alias: Alias;
}

enum Alias {
  A = 'A',
  B = 'B',
}

interface Results {
  A: string;
  B: string;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.css',
})
export class QuizComponent implements OnInit {
  title: string = '';
  questions: Question[] = [];
  selectedQuestion?: Question;

  answers: string[] = [];
  finalAnswer: string = '';

  questionIndex: number = 0;
  questionMaxIndex: number = 0;

  finished: boolean = true;

  constructor() {}
  ngOnInit(): void {
    if (quizz_questions) {
      this.finished = false;
      this.title = quizz_questions.title;
      this.questionIndex = 0;
      this.questionMaxIndex = quizz_questions.questions.length;
      this.answers = [];
      this.finalAnswer = '';
      this.questions = quizz_questions.questions as Question[];
      this.selectedQuestion = this.questions[this.questionIndex];
    }
  }
  userChoose(answer: Alias) {
    this.answers.push(answer);
    this.nextStep();
  }
  nextStep() {
    this.questionIndex += 1;
    if (this.questionIndex < this.questionMaxIndex) {
      this.selectedQuestion = this.questions[this.questionIndex];
    } else {
      this.finished = true;
      const calculatedResult =
        this.calculateResult() as keyof typeof quizz_questions.results;
      this.finalAnswer = quizz_questions.results[calculatedResult];
    }
  }
  calculateResult() {
    const result = this.answers.reduce((previous, current, i, arr) => {
      if (
        arr.filter((item) => item === previous).length >
        arr.filter((item) => item === current).length
      ) {
        return previous;
      }
      return current;
    });
    return result;
  }
}
