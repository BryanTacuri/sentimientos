import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found',
  template: `
    <nz-result
      class="animate__animated animate__bounceInLeft"
      nzStatus="404"
      nzTitle="404"
      nzSubTitle="Lo sentimos, la página que intenta acceder no existe."
    >
      <div nz-result-extra>
        <button nz-button nzType="primary" (click)="goBack()">Regresar</button>
      </div>
    </nz-result>
  `,
  styles: [],
})
export class NotFoundComponent implements OnInit {
  constructor(private location: Location) {}

  ngOnInit() {}

  goBack() {
    this.location.back();
  }
}
