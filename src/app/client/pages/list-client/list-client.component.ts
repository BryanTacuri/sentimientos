import { Component, OnDestroy, OnInit } from '@angular/core';

import { Cliente } from 'src/app/models/Cliente';
import { MenuBarraService } from 'src/app/services/menuBarra.service';
import { ClienteService } from 'src/app/client/cliente.service';

@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.css'],
})
export class ListClientComponent implements OnInit, OnDestroy {
  search: string = '';
  clientes: Cliente[] = [];
  cliente: Cliente;
  loading: boolean = false;
  dataFound: any = '';
  search$: any;
  subscription: any;
  isVisible: boolean;

  listOfColumn = [
    {
      title: 'Nombre',
      compare: (a: Cliente, b: Cliente) => a.nombre.localeCompare(b.nombre),
      priority: false,
    },
    {
      title: 'Apellido',
      compare: (a: Cliente, b: Cliente) => a.apellido.localeCompare(b.apellido),
      priority: 3,
    },
    {
      title: 'Correo',
      compare: (a: Cliente, b: Cliente) => a.email.localeCompare(b.email),
      priority: 2,
    },
    {
      title: 'Telefono',
      compare: (a: Cliente, b: Cliente) => a.telefono.localeCompare(b.telefono),
      priority: 1,
    },
    {
      title: 'Direccion',
      compare: (a: Cliente, b: Cliente) =>
        a.direccion.localeCompare(b.direccion),
      priority: 1,
    },
    {
      title: 'Acciones',
    },
  ];

  constructor(
    private barraService: MenuBarraService,
    private clienteService: ClienteService
  ) {}

  ngOnInit() {
    this.getAllclientes();

    this.barraService.disparadorBarra.subscribe((res) => {
      console.log('res', res);
      this.isVisible = false;
      this.addClient();
    });

    this.search$ = this.barraService.search;
    this.subscription = this.search$.subscribe((res: string) => {
      this.buscarCliente(res);
    });
  }

  buscarCliente(res: string) {
    //si res es vacio entonces se muestra todos los clientes
    this.clientes = this.clienteService.getClientes();
    if (res == '') {
      this.getAllclientes();
    } else {
      this.clientes = this.clienteService.getClientesByParams(res);
    }
  }
  getAllclientes() {
    this.loading = true;
    //depsues de 1 segundo se muestra los clientes
    setTimeout(() => {
      this.clientes = this.clienteService.getClientes();
      this.loading = false;
    }, 1000);

    this.dataFound = ' ';
  }

  editRow(cliente: Cliente): void {
    console.log('cliente', cliente);
    this.cliente = cliente;
    this.isVisible = true;
  }

  deleteRow(id: any): void {
    //eliminar cliente por id de clientes
    this.clienteService.deleteCliente(id);
    this.getAllclientes();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  addClient(): void {
    this.cliente = null;
    this.isVisible = true;
  }

  closeModal(handleResponse: boolean): void {
    if (handleResponse) {
      this.getAllclientes();
    }

    this.isVisible = false;
  }
}
