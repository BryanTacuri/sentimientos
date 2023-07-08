import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MenuBarraService } from '../../services/menuBarra.service';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs';
import { formatISO } from 'date-fns';

@Component({
  selector: 'app-barra',
  templateUrl: './barra.component.html',
  styleUrls: ['./barra.component.css'],
})
export class BarraComponent implements OnInit {
  inputSearch = new FormControl('');
  date: any = null;
  fechaFormat: any = '';
  filtroFecha: any = [];

  constructor(private servicioBarra: MenuBarraService) {}

  ngOnInit(): void {
    this.onChange();
  }

  add() {
    this.servicioBarra.disparadorBarra.emit();
  }

  onChangeDate(result: Date[]): void {
    this.fechaFormat = result.map((date) =>
      formatISO(date, { representation: 'date' })
    );
    this.filtroFecha = result;
    this.servicioBarra.searchDate.emit(this.fechaFormat);
  }

  reset() {
    this.inputSearch.setValue('');
    this.servicioBarra.search.emit(this.inputSearch.value);
  }

  onChange() {
    this.inputSearch.valueChanges
      .pipe(
        map((search: String) => search.trim().toLowerCase()),
        debounceTime(500),
        distinctUntilChanged(),
        tap((search: String) => this.servicioBarra.search.emit(search))
      )
      .subscribe();
  }
}
