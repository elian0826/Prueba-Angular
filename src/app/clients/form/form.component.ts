import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  @Input() client: any = null;
  @Output() close = new EventEmitter<void>();

  clientForm: FormGroup;

  constructor(private fb: FormBuilder, private clientService: ClientService) {
    this.clientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      gender: ['', Validators.required],
      ip: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.client) {
      this.clientForm.patchValue({ ...this.client });
    }
  }

  saveClient(): void {
    if (this.clientForm.invalid) return;

    const clientData = {
      ...this.clientForm.value,
      id: this.client ? this.client.id : Math.floor(Math.random() * 1000) + 30,
      address: {
        country: this.clientForm.value.country,
        city: this.clientForm.value.city
      }
    };

    const request$ = this.client
      ? this.clientService.updateClient(clientData.id, clientData)
      : this.clientService.addClient(clientData);

      request$.subscribe({
        next: () => this.close.emit(),
        error: (err) => console.error('Error al guardar el cliente', err)
      });
  }

    }




