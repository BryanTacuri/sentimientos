import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from './auth/auth.service';
@Component({
  selector: 'app-root',
  template: ` <router-outlet></router-outlet> `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Prueba';
  isCollapsed = false;

  constructor(
    private router: Router,
    private message: NzMessageService,
    public valueService: AuthService
  ) {}
  offsetTop = 0;
  onLogout() {
    this.valueService.CerrarSesion();
    this.router.navigate(['/login']);
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
