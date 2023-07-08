import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClienteRoutingModule } from './cliente-routing.module';

import { NgZorroModule } from '../ngzorro/ngzorro.module';
import { BarraModule } from '../components/barra/barra.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListClientComponent } from './pages/list-client/list-client.component';
import { ModalClientComponent } from './pages/modal-client/modal-client.component';
import { HomeClientComponent } from './pages/home-client/home-client.component';

@NgModule({
  declarations: [
    ListClientComponent,
    HomeClientComponent,
    ModalClientComponent,
  ],
  imports: [
    CommonModule,
    NgZorroModule,
    ClienteRoutingModule,
    BarraModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class ClienteModule {}
