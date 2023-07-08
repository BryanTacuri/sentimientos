import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { es_ES } from 'ng-zorro-antd/i18n';
import { NzFormModule } from 'ng-zorro-antd/form';
import es from '@angular/common/locales/es';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider,
} from 'angularx-social-login';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/footer/footer.component';
import { NgZorroModule } from './ngzorro/ngzorro.module';
import { BarraModule } from './components/barra/barra.module';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { registerLocaleData } from '@angular/common';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { icons } from './models/Icons';
import { NotFoundComponent } from './components/not-found/not-found.component';

registerLocaleData(es);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FooterComponent,
    SidenavComponent,
    NotFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SocialLoginModule,

    FormsModule,
    NzIconModule.forRoot(icons),
    HttpClientModule,
    NzFormModule,
    ReactiveFormsModule,
    NgZorroModule,
    BarraModule,
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: es_ES },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('1410286952847183'),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
