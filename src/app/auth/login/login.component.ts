import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../auth.service';
import {
  FacebookLoginProvider,
  SocialAuthService,
} from 'angularx-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  validateFrm!: FormGroup;
  validateFrmRecuperar!: FormGroup;
  urlImageLogo: string;
  isVisible = false;
  passwordVisible = false;
  loading: boolean = false;

  loggedIn: boolean;
  user: any;
  constructor(
    private message: NzMessageService,
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private authServiceFB: SocialAuthService
  ) {
    this.urlImageLogo = 'assets/clientes.png';
    this.authService.CerrarSesion();
  }

  ngOnInit(): void {
    this.validateFrm = this.fb.group({
      usuario: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });

    this.authServiceFB.authState.subscribe((user) => {
      this.user = user;
      console.log(this.user);
      this.loggedIn = user != null;
    });
  }
  submitForm(): void {
    if (this.validateFrm.valid) {
      this.onLogin(this.validateFrm.value);
    } else {
      Object.values(this.validateFrm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  onLogin(formData: any): void {
    this.loading = true;
    if (formData.usuario == 'admin' && formData.password == 'admin') {
      this.authService.setIsAuth(true);
      setTimeout(() => { 
        this.loading = false;
        this.router.navigate(['/analytics']);
      }, 1200);
    } else {
      this.loading = false;
      this.message.error('Usuario o contraseña incorrectos');
    }
  }

  signInWithFB(): void {
    const fbLoginOptions = {
      scope:
        'pages_manage_engagement, pages_read_engagement, pages_show_list, email',
    };
    this.authServiceFB.signIn(
      FacebookLoginProvider.PROVIDER_ID,
      fbLoginOptions
    );
  }
}
