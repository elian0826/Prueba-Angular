import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { FormComponent } from '../form/form.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @Output() clientChanged = new EventEmitter<void>();
  clients: any[] = [];
  showModal: boolean = false;
  selectedClient: any = null;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe(response => {
      this.clients = response.users.map((user: any) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        ip: user.ip || 'No disponible',
        country: user.address?.country || 'No especificado',
        city: user.address?.city || 'No especificado'
      }));
    }, error => {
      console.error('Error al obtener clientes:', error);
    });
  }

  deleteClient(id: number): void {
    if (confirm('¿Seguro que quieres eliminar este cliente?')) {
      this.clientService.deleteClient(id).subscribe(() => {
        this.loadClients();
        this.clientChanged.emit();
      });
    }
  }

  openModal(client: any = null): void {
    this.selectedClient = client;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.loadClients();
    this.clientChanged.emit();
  }
}
