import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-HomeClient',
  templateUrl: './home-client.component.html',
  styleUrls: ['./home-client.component.css'],
})
export class HomeClientComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    const influencerAuth = this.obtenerInfluencerAuth();

    if (influencerAuth) {
      this.router.navigate(['/clientes/analytics']);
    } else {
      this.router.navigate(['/clientes/auth-anatytics']);
    }
  }

  obtenerInfluencerAuth() {
    //if (this.authService.isAuthenticated) {
    //  return true;
    //} else {
    //  return false;
    // }
    return false;
  }
}
