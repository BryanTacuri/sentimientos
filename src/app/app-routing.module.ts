import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [] },
  { path: 'login', component: LoginComponent, canActivate: [] },
  {
    path: 'not-found',
    component: NotFoundComponent,
    canActivate: [AuthGuard],
  },

  {
    path: '',
    component: SidenavComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
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
