import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { HomeComponent } from './components/home/home.component';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,

    children: [
      {
        path: '',
        component: SidenavComponent,
      },

      {
        path: 'analytics',
        component: AnalyticsComponent,
      },
      {
        path: 'clientes',
        loadChildren: () =>
          import('./client/cliente.module').then((m) => m.ClienteModule),
      },
    ],
  },

  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
