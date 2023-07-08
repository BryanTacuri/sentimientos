import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-Home',
  template: `
    <div class="animate__animated animate__fadeIn">
      <p>home works!</p>
    </div>
  `,
  styles: [``],
})
export class HomeComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
