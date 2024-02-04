// Core
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { GET_QUESTIONNAIRE_BY_TYPE } from 'src/app/schemas/query-definitions/questionnaire_query';
import { ApolloQueryApi } from 'src/app/services/apollo-api.service';
import { CustomerService } from 'src/app/services/customer.service';
import { Constants } from 'src/app/constants/Constants';
import { AxiosApi } from 'src/app/services/axios-api.service';

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

  // Constructor
  constructor(
    public customerService: CustomerService,
    private apolloApi: ApolloQueryApi,
    private axiosApi: AxiosApi,
    public translate: TranslateService,
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
    if (this.questionnaire) {
      this.apolloApi.getData(GET_QUESTIONNAIRE_BY_TYPE, { type: this.questionnaire.type }).subscribe((res: any) => {
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

  save(){
    this.isLoading = true;
    this.axiosApi.answerQuestionnaire(this.questionnaire.id, this.questions).then((res: any) => {
      this.isLoading = false;
      if (res && res.data === 'ok') {
        this.ngOnInit();
      }
    });
  }

  get isSpanish(): boolean {
    return this.customerService.customer.appLang === Constants.SPANISH.id
  }
}
