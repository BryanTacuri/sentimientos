import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ClienteService } from '../../cliente.service';

@Component({
  selector: 'app-modal-client',
  templateUrl: './modal-client.component.html',
  styleUrls: ['./modal-client.component.css'],
})
export class ModalClientComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() cliente: any;
  @Output() isVisibleChange = new EventEmitter<boolean>();

  title = 'Modal';
  formCliente: FormGroup = this._formBuilder.group({
    id: [0],
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: [''],
    direccion: [''],
  });

  constructor(
    private _formBuilder: FormBuilder,
    private message: NzMessageService,
    private clienteService: ClienteService
  ) {}

  ngOnInit() {
    if (this.cliente) {
      this.formCliente.patchValue(this.cliente);
    }
    if (this.cliente?.id > 0) {
      this.title = 'Editar Cliente';
    } else {
      this.title = 'Nuevo Cliente';
    }

    console.log(this.formCliente.value);
  }

  handleCancel() {
    this.isVisible = false;

    this.isVisibleChange.emit(false);
  }

  handleOk() {
    if (!this.formCliente.valid) {
      console.log('invalid', this.formCliente.value);
      Object.values(this.formCliente.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    if (this.formCliente.value.id > 0) {
      console.log('edit', this.formCliente.value);
      this.clienteService.putCliente(this.formCliente.value);
      this.isVisibleChange.emit(true);
    } else {
      console.log('add', this.formCliente.value);
      this.clienteService.postCliente(this.formCliente.value);
      this.isVisibleChange.emit(true);
    }
  }
}
