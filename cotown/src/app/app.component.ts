import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from './constants/Constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'cotown';

  constructor(private translate: TranslateService) {
    this.setAppLanguage();
  }

  setAppLanguage() {
    this.translate.setDefaultLang(Constants.defaultBaseLanguageForTranslation);
    this.translate.use(this.translate.getBrowserLang() || 'es');
  }
}
