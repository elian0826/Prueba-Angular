import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { ClientService } from '../services/client.service'; 

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalClientes: number = 0;
  distribucionGenero: any = {};
  promedioEdad: number = 0;
  ciudades: any[] = [];
  paises: any[] = [];
  telefonos: any[] = [];
  edadesIndividuales: number[] = [];
  mostrarEdadesIndividuales: boolean = false;

  selectedCard: string = '';

  clientesChartData: ChartData<'pie'> = {
    labels: ['Total Clientes'],
    datasets: [
      {
        label: 'Clientes',
        data: [this.totalClientes],
        backgroundColor: ['blue'],
      }
    ]
  };

  edadChartData: ChartData<'bar'> = {
    labels: ['Promedio de Edad'],
    datasets: [
      {
        label: 'Edad Promedio',
        data: [0],
        backgroundColor: 'green'
      }
    ]
  };

  generoChartData: ChartData<'pie'> = {
    labels: ['Masculino', 'Femenino', 'Otro'],
    datasets: [
      {
        label: 'Distribución por Género',
        data: [0, 0, 0],
        backgroundColor: ['blue', 'pink', 'gray']
      }
    ]
  };

  ciudadChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Distribución por Ciudad',
        data: [],
        backgroundColor: 'lightblue'
      }
    ]
  };

  paisChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Distribución por País',
        data: [],
        backgroundColor: 'lightgreen'
      }
    ]
  };

  telefonoChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        label: 'Distribución por Teléfono',
        data: [],
        backgroundColor: ['purple', 'orange', 'yellow']
      }
    ]
  };


  chartOptionsPie: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };

  chartOptionsBar: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true
      }
    }
  };

  chartLegend: boolean = true;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.obtenerEstadisticas();
    this.clientService.getClients().subscribe(data => {
      this.edadesIndividuales = data.users.map((user: any) => user.age);

    });
  }

  obtenerEstadisticas(): void {
    this.clientService.getClients().subscribe(data => {
      const users = data.users;

      this.totalClientes = users.length;


      this.promedioEdad = users.reduce((sum: number, user: any) => sum + (user.age || 0), 0) / users.length || 0;
      this.edadesIndividuales = users.map((user: any) => user.age);



      this.distribucionGenero = users.reduce((acc: any, user: any) => {
        const genero = user.gender.charAt(0).toUpperCase() + user.gender.slice(1);
        acc[genero] = (acc[genero] || 0) + 1;
        return acc;
      }, {});


      this.ciudades = this.getDistribucionPorCiudad(users);


      this.paises = this.getDistribucionPorPais(users);


      this.telefonos = this.getDistribucionPorTelefono(users);


      this.actualizarDatosGraficos();
    }, error => {
      console.error('Error al obtener los datos:', error);
    });
  }

  getDistribucionPorCiudad(users: any[]): any[] {
    const distribucion: any = {};
    users.forEach((user: any) => {
      const ciudad = user.address?.city || 'Desconocido';
      distribucion[ciudad] = (distribucion[ciudad] || 0) + 1;
    });
    return Object.keys(distribucion).map(city => ({ name: city, count: distribucion[city] }));
  }

  getDistribucionPorPais(users: any[]): any[] {
    const distribucion: any = {};
    users.forEach((user: any) => {
      const pais = user.address?.country || 'Desconocido';
      distribucion[pais] = (distribucion[pais] || 0) + 1;
    });
    return Object.keys(distribucion).map(country => ({ name: country, count: distribucion[country] }));
  }

  getDistribucionPorTelefono(users: any[]): any[] {
    const distribucion: any = {};
    users.forEach((user: any) => {
      const telefono = user.phone;
      const prefijo = telefono.substring(0, telefono.indexOf(' '));
      distribucion[prefijo] = (distribucion[prefijo] || 0) + 1;
    });
    return Object.keys(distribucion).map(prefix => ({ prefix, count: distribucion[prefix] }));
  }

  actualizarDatosGraficos(): void {
    this.clientesChartData.datasets[0].data = [this.totalClientes];

    this.generoChartData.datasets[0].data = [
      this.distribucionGenero['Male'] || 0,
      this.distribucionGenero['Female'] || 0,
      this.distribucionGenero['Other'] || 0
    ];

    this.edadChartData.datasets[0].data = [this.promedioEdad];


    this.ciudadChartData.labels = this.ciudades.map(ciudad => ciudad.name);
    this.ciudadChartData.datasets[0].data = this.ciudades.map(ciudad => ciudad.count);


    this.paisChartData.labels = this.paises.map(pais => pais.name);
    this.paisChartData.datasets[0].data = this.paises.map(pais => pais.count);


    this.telefonoChartData.labels = this.telefonos.map(telefono => telefono.prefix);
    this.telefonoChartData.datasets[0].data = this.telefonos.map(telefono => telefono.count);
  }

  onCardClick(card: string): void {
    this.selectedCard = card;

    if (card === 'edad') {
      this.mostrarEdadesIndividuales = !this.mostrarEdadesIndividuales;

      if (this.mostrarEdadesIndividuales) {

        this.edadChartData = {
          labels: this.edadesIndividuales.map((_, index) => `Cliente ${index + 1}`),
          datasets: [
            {
              label: 'Edades Individuales',
              data: this.edadesIndividuales,
              backgroundColor: 'blue'
            }
          ]
        };
      } else {

        this.edadChartData = {
          labels: ['Promedio de Edad'],
          datasets: [
            {
              label: 'Edad Promedio',
              data: [this.promedioEdad],
              backgroundColor: 'green'
            }
          ]
        };
      }
    }
  }
}
