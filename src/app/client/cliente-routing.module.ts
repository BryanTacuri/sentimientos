import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeClientComponent } from './pages/home-client/home-client.component';
import { ListClientComponent } from './pages/list-client/list-client.component';

const routes: Routes = [
  {
    path: '',
    component: HomeClientComponent,
    children: [
      { path: 'list', component: ListClientComponent },

      { path: '**', redirectTo: '', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClienteRoutingModule {}
