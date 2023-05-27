import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from './constants/Constants';
import { ActivatedRoute } from '@angular/router';
import { LanguageService } from './services/language.service';
import { ApoloQueryApi } from './services/Apollo-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  title = 'cotown';

  constructor(
    private translate: TranslateService,
    private route: ActivatedRoute,
    private language: LanguageService,
    private apolloApi: ApoloQueryApi,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(async (params) => {
      const { language, access_token } = params;
      if (language) {
        this.language.lang = language.substring(0,2);
      }
      this.apolloApi.token = access_token;
      this.setAppLanguage();
    });
  }

  setAppLanguage() {
    this.translate.setDefaultLang(Constants.defaultBaseLanguageForTranslation);
    this.translate.use(this.language.lang || 'es');
  }
}
