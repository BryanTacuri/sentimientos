import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SessionStorageService } from '../services/session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: boolean;
  idAdmin: any;

  private isAuth = new Subject<boolean>();
  isAuthChallange$ = this.isAuth.asObservable();

  constructor(private ss: SessionStorageService) {
    if (this.ss.getItem('isAuthenticated') !== '') {
      this.isAuthenticated = this.ss.getItem('isAuthenticated');
      this.isAuth.next(this.isAuthenticated);
    }
  }

  public setIsAuth(nombre: boolean) {
    this.isAuthenticated = nombre;
    this.ss.setItem('isAuthenticated', nombre);
    this.isAuth.next(nombre);
  }

  public delIsAuth() {
    this.isAuthenticated = false;
    this.ss.setItem('isAuthenticated', '');
    this.isAuth.next(false);
  }

  public CerrarSesion() {
    this.delIsAuth();

    this.isAuthenticated = false;
  }
}
