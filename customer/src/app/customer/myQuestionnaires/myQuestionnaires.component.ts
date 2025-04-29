// Core
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { GET_QUESTIONNAIRE_BY_TYPE, INSERT_QUESTIONNAIRE_PHOTO } from 'src/app/schemas/query-definitions/questionnaire_query';
import { ApolloQueryApi } from 'src/app/services/apollo-api.service';
import { CustomerService } from 'src/app/services/customer.service';
import { FileService } from 'src/app/services/file.service';
import { Constants } from 'src/app/constants/Constants';
import { AxiosApi } from 'src/app/services/axios-api.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-my-questionnaires',
  templateUrl: './myQuestionnaires.component.html',
  styleUrls: ['./myQuestionnaires.component.scss']
})

export class MyQuestionnairesComponent implements OnInit {

  // Spinner
  public isLoading = false;

  // Questionnaires
  public questionnaire: any = null;
  public questions: any = null;

  // Answers
  public opt: string = "Sí";
  public star: number = 5;
  public issues: any = null;

  // Media
  mediaPreviews: { type: 'image' | 'video', url: string }[] = [];
  selectedFiles: File[] = [];

  // Constructor
  constructor(
    public customerService: CustomerService,
    private fileService: FileService,
    private apollo: ApolloQueryApi,
    private axiosApi: AxiosApi,
    public translate: TranslateService,
    private modalService: ModalService
  ) { }

  // On init
  ngOnInit() {
    // Get first questionnaire
    this.questionnaire = null;
    this.customerService.customer.bookings.forEach(b => {
      b.questionnaires?.forEach((q: any) => {
        if (!this.questionnaire || this.questionnaire.id > q.id) {
          this.questionnaire = q;
        }
      })
    })

    // Load questionnaire questions
    this.questions = null;
    this.issues = null;
    if (this.questionnaire) {
      this.apollo.getData(GET_QUESTIONNAIRE_BY_TYPE, { type: this.questionnaire.type }).subscribe((res: any) => {
        const data = res.data;
        if(data && data.data) {
          this.questions = data.data;
          this.questions.forEach((g: any) => {
            g.questions.forEach((q: any) => {
              if (q.type === "puntos")
                q.value = 5;
              else if (q.type === "check")
                q.value = "Sí";
              else
                q.value = "";
            })
          })
        }
      });
    }
  }

  onChange(value: any) {
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      this.selectedFiles = files;
      this.mediaPreviews = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            const fileType = file.type.startsWith('image/')
              ? 'image'
              : file.type.startsWith('video/')
                ? 'video'
                : null;
            if (fileType) {
              this.mediaPreviews.push({
                type: fileType,
                url: reader.result as string
              });
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  }

  save() {
    // Save questions
    this.isLoading = true;
    this.axiosApi.answerQuestionnaire(this.questionnaire.id, this.questions, this.issues).then((res: any) => {
      this.isLoading = false;
      if (res && res.data === 'ok') {
        this.customerService.customer.bookings.forEach((b: any) => {
          b.questionnaires = b.questionnaires.filter((q: any) => this.questionnaire.id != q.id);
        })
      }
      
      // Save photos
      this.selectedFiles.forEach((f: any) => {
        const variables = {
          questionnaireId: this.questionnaire.id,
          image: null,
          comnets: ""
        };
        this.apollo.setData(INSERT_QUESTIONNAIRE_PHOTO, variables).subscribe({
          next: (res) => {
          }, 
          error: (err)  => {
          }
        })
      });

      // Init
      this.ngOnInit();
    });
  }

  get isSpanish(): boolean {
    return this.customerService.customer.appLang === Constants.SPANISH.id
  }
}
