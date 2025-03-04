import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';
import { ClientService } from '../services/client.service'; // Importar el servicio de cliente

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
  edadesIndividuales: number[] = []; // NUEVA PROPIEDAD
  mostrarEdadesIndividuales: boolean = false; // NUEVA PROPIEDAD

  selectedCard: string = '';

  clientesChartData: ChartData<'pie'> = {
    labels: ['Total Clientes'],
    datasets: [
      {
        label: 'Clientes',
        data: [this.totalClientes],  // Usando el total de clientes
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

  // Opciones específicas para cada gráfico (pie y bar)
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
      const users = data.users; // Acceder a la lista de usuarios desde la respuesta

      this.totalClientes = users.length;

      // Calcular el promedio de edad
      this.promedioEdad = users.reduce((sum: number, user: any) => sum + (user.age || 0), 0) / users.length || 0;
      this.edadesIndividuales = users.map((user: any) => user.age); // SE AGREGA LA LISTA DE EDADES
 // SE AGREGA LA LISTA DE EDADES

      // Calcular la distribución de género
      this.distribucionGenero = users.reduce((acc: any, user: any) => {
        const genero = user.gender.charAt(0).toUpperCase() + user.gender.slice(1);
        acc[genero] = (acc[genero] || 0) + 1;
        return acc;
      }, {});

      // Calcular la distribución por ciudad
      this.ciudades = this.getDistribucionPorCiudad(users);

      // Calcular la distribución por país
      this.paises = this.getDistribucionPorPais(users);

      // Calcular la distribución por teléfono (por prefijo)
      this.telefonos = this.getDistribucionPorTelefono(users);

      // Actualizar los gráficos
      this.actualizarDatosGraficos();
    }, error => {
      console.error('Error al obtener los datos:', error);
    });
  }

  getDistribucionPorCiudad(users: any[]): any[] {
    const distribucion: any = {};
    users.forEach((user: any) => {
      const ciudad = user.address?.city || 'Desconocido'; // Evita errores si no tiene dirección
      distribucion[ciudad] = (distribucion[ciudad] || 0) + 1;
    });
    return Object.keys(distribucion).map(city => ({ name: city, count: distribucion[city] }));
  }

  getDistribucionPorPais(users: any[]): any[] {
    const distribucion: any = {};
    users.forEach((user: any) => {
      const pais = user.address?.country || 'Desconocido'; // Evita errores
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

    this.edadChartData.datasets[0].data = [this.promedioEdad]; // ACTUALIZA EL GRÁFICO DE EDAD

    // ACTUALIZAR GRÁFICO DE CIUDADES
    this.ciudadChartData.labels = this.ciudades.map(ciudad => ciudad.name);
    this.ciudadChartData.datasets[0].data = this.ciudades.map(ciudad => ciudad.count);

    // ACTUALIZAR GRÁFICO DE PAÍSES
    this.paisChartData.labels = this.paises.map(pais => pais.name);
    this.paisChartData.datasets[0].data = this.paises.map(pais => pais.count);

    // ACTUALIZAR GRÁFICO DE TELÉFONOS
    this.telefonoChartData.labels = this.telefonos.map(telefono => telefono.prefix);
    this.telefonoChartData.datasets[0].data = this.telefonos.map(telefono => telefono.count);
  }

  onCardClick(card: string): void {
    this.selectedCard = card;

    if (card === 'edad') {
      this.mostrarEdadesIndividuales = !this.mostrarEdadesIndividuales;

      if (this.mostrarEdadesIndividuales) {
        // Mostrar todas las edades individuales en el gráfico de barras
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
        // Volver al promedio de edad
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
