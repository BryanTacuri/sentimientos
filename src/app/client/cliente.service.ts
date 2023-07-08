import { Injectable } from '@angular/core';

import { Cliente } from '../models/Cliente';
import { SessionStorageService } from '../services/session.service';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  clientes: Cliente[] = [];
  cliente: Cliente = {
    id: 1,
    nombre: 'Juan',
    apellido: 'Perez',
    email: 'juanperez@gmail.com',
    telefono: '123456789',
    direccion: 'Calle 123',
  };
  cliente2: Cliente = {
    id: 2,
    nombre: 'Pedro',
    apellido: 'Gomez',
    email: 'pedroGomez@gmail.com',
    telefono: '123456789',
    direccion: 'Calle 123',
  };
  cliente3: Cliente = {
    id: 3,
    nombre: 'Maria',
    apellido: 'Gomez',
    email: 'mariago@gmail.com',
    telefono: '123456789',
    direccion: 'Calle 123',
  };

  constructor(private localService: SessionStorageService) {
    //si la lista de clientes no existe en el localstorage, la crea
    if (!this.localService.getItem('clientes')) {
      this.clientes = [this.cliente, this.cliente2, this.cliente3];
      this.localService.setItem('clientes', this.clientes);
    } else {
      this.clientes = this.localService.getItem('clientes');
    }
  }

  getClientes() {
    return this.localService.getItem('clientes');
  }

  getClientesByParams(param: string): Cliente[] {
    //buscar clientes por nombre o apellido
    this.clientes = this.localService.getItem('clientes');
    this.clientes = this.clientes.filter((cliente) => {
      return (
        cliente.nombre.toLowerCase().includes(param.toLowerCase()) ||
        cliente.apellido.toLowerCase().includes(param.toLowerCase())
      );
    });

    return this.clientes;
  }

  deleteCliente(id: number) {
    this.clientes = this.localService.getItem('clientes');
    this.clientes = this.clientes.filter((cliente) => cliente.id !== id);
    this.localService.setItem('clientes', this.clientes);
  }

  postCliente(cliente: Cliente) {
    this.clientes = this.localService.getItem('clientes');
    cliente.id = this.clientes.length + 1;
    this.clientes.push(cliente);
    console.log('clientes', this.clientes);
    this.localService.setItem('clientes', this.clientes);
  }

  putCliente(cliente: Cliente) {
    this.clientes = this.localService.getItem('clientes');
    this.clientes = this.clientes.filter((c) => c.id !== cliente.id);
    this.clientes.push(cliente);
    this.localService.setItem('clientes', this.clientes);
  }
}
