import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroModule } from '../../ngzorro/ngzorro.module';
import { BarraComponent } from './barra.component';

@NgModule({
  declarations: [BarraComponent],
  imports: [NgZorroModule, FormsModule, ReactiveFormsModule],
  exports: [BarraComponent],
})
export class BarraModule {}
