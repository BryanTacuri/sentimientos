import { Component, OnInit } from '@angular/core';
import {
  FacebookLoginProvider,
  SocialAuthService,
} from 'angularx-social-login';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-facebook-conexion',
  templateUrl: './facebook-conexion.component.html',
  styleUrls: ['./facebook-conexion.component.css'],
})
export class FacebookConexionComponent implements OnInit {
  user: any;
  loggedIn: boolean;
  constructor(
    private authServiceFB: SocialAuthService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authServiceFB.authState.subscribe((user) => {
      this.user = user;
      console.log(this.user);
      this.loggedIn = user != null;
      // if (this.user) {
      //  this.authService.setIsAuthInfluncer(true);
      //}
    });
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
