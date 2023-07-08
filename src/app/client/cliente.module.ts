import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteRoutingModule } from './cliente-routing.module';

import { NgZorroModule } from '../ngzorro/ngzorro.module';
import { BarraModule } from '../components/barra/barra.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListClientComponent } from './pages/list-client/list-client.component';
import { ModalClientComponent } from './pages/modal-client/modal-client.component';
import { HomeClientComponent } from './pages/home-client/home-client.component';
import { AnalyticsClientComponent } from './pages/analytics-client/analytics-client.component';
import { FacebookConexionComponent } from './facebook-conexion/facebook-conexion.component';
import {
  FacebookLoginProvider,
  SocialAuthServiceConfig,
} from 'angularx-social-login';

@NgModule({
  declarations: [
    ListClientComponent,
    HomeClientComponent,
    ModalClientComponent,
    AnalyticsClientComponent,
    FacebookConexionComponent,
  ],
  imports: [
    CommonModule,
    NgZorroModule,
    ClienteRoutingModule,
    BarraModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
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
})
export class ClienteModule {}
