
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {

  NbThemeModule,
} from '@nebular/theme';


// import {
//   CapitalizePipe,
//   PluralPipe,
//   RoundPipe,
//   TimingPipe,
//   NumberWithCommasPipe,
// } from './pipes';

import { DEFAULT_THEME } from './styles/theme.default';
import { COSMIC_THEME } from './styles/theme.cosmic';
import { CORPORATE_THEME } from './styles/theme.corporate';
import { DARK_THEME } from './styles/theme.dark';

// export function CreateTranslateLoader (http: HttpBackend): TranslateHttpLoader {
//   return new TranslateHttpLoader(new HttpClient(http), '../assets/i18n/', '.json');
// }


// const NB_MODULES = [
// TranslateModule.forChild({
//   useDefaultLang: true,
//   loader: {
//       provide: TranslateLoader,
//       useFactory: CreateTranslateLoader,
//       deps: [HttpBackend],
//   },
//   isolate: false,
// }),
// ];


@NgModule({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: 'default',
          },
          [ DEFAULT_THEME, COSMIC_THEME, CORPORATE_THEME, DARK_THEME ],
        ).providers,
      ],
    };
  }
}
