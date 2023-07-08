import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenuBarraService {
  @Output() disparadorBarra: EventEmitter<any> = new EventEmitter();
  @Output() search: EventEmitter<any> = new EventEmitter();
  @Output() searchDate: EventEmitter<any> = new EventEmitter();

  constructor() {}
}
