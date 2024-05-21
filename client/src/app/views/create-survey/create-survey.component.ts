import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule,NgModel } from '@angular/forms';
import { SurveyService } from '../../service/survey.service'; // Import SurveyService
import { CommonModule } from '@angular/common';
import { HttpClientModule} from '@angular/common/http';

// Update Question interface to match backend schema
interface Question {
  _id: string|undefined;
  text: string;
  options: { text: string }[]; // Array of objects with text property
}

@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  providers: [SurveyService] // Import ReactiveFormsModule here
})
export class CreateSurveyComponent implements OnInit {
  surveyForm: FormGroup = new FormGroup({});
  questions: Question[] = []; // Array to store available questions
  selectedQuestionIds: string[] = []; // Array to store selected question IDs
  isChecked = false;


  constructor(
    private fb: FormBuilder, // Inject FormBuilder for creating form
    private surveyService: SurveyService // Inject SurveyService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.fetchAvailableQuestions();
  }

  createForm() {
    this.surveyForm = this.fb.group({
      batch: ['', Validators.required],
      // description: ['', Validators.required],  // Uncomment if description is required
      semester: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      questionIds: [[]] // Array to store selected question IDs
    });
  }

  fetchAvailableQuestions() {
    this.surveyService.getQuestions().subscribe(questions => {
      this.questions = questions.map(question => ({
        _id: question._id,
        text: question.text,
        options: question.options
      }));
    });
  }

  onSubmit() {
    if (this.surveyForm.valid && this.selectedQuestionIds.length > 0) { // Ensure some questions are selected
      const formValue = this.surveyForm.value;
      const surveyData = {
        ...formValue,
        questions: this.selectedQuestionIds
      };

      this.surveyService.createSurvey(surveyData).subscribe(response => {
        console.log('Survey created successfully!', response);
        // Optionally, clear the form and selected questions after successful creation
      }, error => {
        console.error('Error creating survey:', error);
      });
    } else {
      console.error('Please fill in all required fields and select at least one question.');
      // Optionally, display an error message in the UI
    }
  }

  onQuestionSelectionChange(Checked: boolean, questionId: string="")  {
    if (Checked) {
      this.selectedQuestionIds.push(questionId);
    } else {
      const index = this.selectedQuestionIds.indexOf(questionId);
      if (index !== -1) {
        this.selectedQuestionIds.splice(index, 1);
      }
    }
  }
}
