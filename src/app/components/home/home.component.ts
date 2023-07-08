import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  SocialAuthService,
  FacebookLoginProvider,
} from 'angularx-social-login';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  title = '<el_HACKATHON>';
  isCollapsed = false;
  offsetTop = 0;
  menuItems: {
    title: string;
    icon: string;
    subItems: { title: string; routerLink: string }[];
  }[];
  user: import('angularx-social-login').SocialUser;
  loggedIn: boolean;

  constructor(
    private router: Router,
    public valueService: AuthService,
    private authServiceFB: SocialAuthService
  ) {
    this.getRoutes();
  }
  ngOnInit(): void {
    this.authServiceFB.authState.subscribe((user) => {
      this.user = user;
      console.log(this.user);
      this.loggedIn = user != null;
      if (this.loggedIn) {
        this.router.navigate(['/analytics']);
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.toggleCollapsedOnSmallScreen();
  }

  toggleCollapsedOnSmallScreen(): void {
    const isSmallScreen = window.innerWidth < 768; // ajusta el valor según tus necesidades
    if (isSmallScreen) {
      this.isCollapsed = true;
    }
  }

  onLogout() {
    this.valueService.CerrarSesion();
    this.router.navigate(['/login']);
  }

  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  getRoutes() {
    this.menuItems = [
      {
        title: 'Analytics',
        icon: 'container',
        subItems: [
          {
            title: 'Influencers',
            routerLink: '',
          },
        ],
      },
    ];
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
