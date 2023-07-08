import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SessionStorageService } from '../services/session.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: boolean;
  idAdmin: any;
  isAuthenticatedInluencer: boolean;

  private isAuth = new Subject<boolean>();
  isAuthChallange$ = this.isAuth.asObservable();

  private isAuthI = new Subject<boolean>();
  isAuthChallangeI$ = this.isAuthI.asObservable();

  constructor(private ss: SessionStorageService) {
    if (this.ss.getItem('isAuthenticated') !== '') {
      this.isAuthenticated = this.ss.getItem('isAuthenticated');
      this.isAuth.next(this.isAuthenticated);
    }

    if (this.ss.getItem('isAuthenticatedInluencer') !== '') {
      this.isAuthenticatedInluencer = this.ss.getItem(
        'isAuthenticatedInluencer'
      );
      this.isAuthI.next(this.isAuthenticatedInluencer);
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

  public setIsAuthInfluncer(nombre: boolean) {
    this.isAuthenticatedInluencer = nombre;
    this.ss.setItem('isAuthenticatedInluencer', nombre);
    this.isAuthI.next(nombre);
  }

  public CerrarSesion() {
    this.delIsAuth();

    this.isAuthenticated = false;
  }
}
