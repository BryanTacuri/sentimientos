import { Component, OnInit, ViewChild } from '@angular/core';

import { getISOWeek } from 'date-fns';

import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexFill,
  ApexAnnotations,
} from 'ng-apexcharts';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { SessionStorageService } from 'src/app/services/session.service';

type ApexXAxis = {
  type?: 'category' | 'datetime' | 'numeric';
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
};

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
};
export type ChartOptions2 = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
})
export class AnalyticsComponent implements OnInit {
  @ViewChild('chart1') chart1: ChartComponent;

  public chartOptions: Partial<ChartOptions>;
  public chartOptions2: Partial<ChartOptions2>;
  public chartOptionsTotalReaccionesFecha: Partial<ChartOptions2>;
  public chartOptionsGeneral2: Partial<ChartOptions>;

  date: any = null;
  totalComentario: any;
  access_token: any;

  pages: any[] = []; // Almacena los datos de las páginas

  posts: any[] = []; // Almacena los datos de las páginas

  selectedPage: any; // Almacena la página seleccionada
  selectedSetimiento: any; // Almacena la página seleccionada

  selectedPost: any;
  loading: boolean;
  graficos: boolean;
  iniDate: string;
  finDate: string;
  graficosFiltrados: boolean;
  totalComentarioGeneralFiltrado: any;
  mostrarPrimero: boolean;
  mostrarSegundo: boolean;
  mostrarSelect: boolean;
  selectedSentimiento: any;

  constructor(
    private valueService: SessionStorageService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.access_token = this.valueService.getItem('access_token');
    this.obtenerPaginas(this.access_token);
  }
  obtenerPaginas(access_token: string) {
    this.loading = true;
    this.analyticsService.obtenerPaginas(access_token).subscribe(
      (response: any) => {
        this.pages = response.data;
        this.loading = false;
      },
      (error) => {
        console.error(error);
        this.loading = false;
      }
    );
  }

  segundoGrafico(endpointData: any) {
    // Obtener los valores de "totalComentario" y "totalComments"
    this.totalComentario = endpointData.totalComentario;
    const totalPositive = endpointData.totalComments.positive;
    const totalNegative = endpointData.totalComments.negative;
    const totalNeutral = endpointData.totalComments.neutral;

    this.chartOptions2 = {
      series: [totalPositive, totalNegative, totalNeutral],
      chart: {
        width: 380,
        type: 'pie',
      },

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      labels: ['Positivo', 'Negativo', 'Neutral'], // Nombres de las series
    };
  }
  primerGrafico(endpointData: any) {
    // Obtener los datos del endpoint

    // Crear los arrays para almacenar los datos del gráfico
    const categories: any = [];
    const data = [];

    // Iterar sobre el array listFeed del endpointData
    for (const item of endpointData.listFeed) {
      // Obtener los valores necesarios para el gráfico
      const message = item.message
        ? item.message.length > 15
          ? item.message.substring(0, 15) + '...'
          : item.message
        : '';
      const totalComentario = parseInt(item.totalComentario);
      const category = [message]; // Ejemplo: ['1', '1']

      // Agregar los valores al array categories y data
      categories.push(category);
      data.push(totalComentario);
    }

    // Actualizar el chartOptions con los nuevos datos
    this.chartOptions = {
      series: [
        {
          name: 'distibuted',
          data: data,
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
        events: {
          click: function (chart, w, e) {
            // console.log(chart, w, e)
          },
        },
      },
      colors: [
        '#008FFB',
        '#00E396',
        '#FEB019',
        '#FF4560',
        '#775DD0',
        '#546E7A',
        '#26a69a',
        '#D10CE8',
      ],
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
      },
      xaxis: {
        categories: categories,
        labels: {
          style: {
            colors: [
              '#008FFB',
              '#00E396',
              '#FEB019',
              '#FF4560',
              '#775DD0',
              '#546E7A',
              '#26a69a',
              '#D10CE8',
            ],
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: ['#333'],
            fontSize: '12px',
            fontWeight: 'bold',
          },
        },
      },
    };
  }

  onChange(result: Date[]): void {
    if (result && result.length === 2) {
      this.iniDate = result[0].toISOString().split('T')[0];
      this.finDate = result[1].toISOString().split('T')[0];
    }
  }

  pageChange(value: string): void {
    this.selectedPage = value;
    console.log(this.selectedPage);
    this.obtenerPosts(this.selectedPage.access_token);
    this.generarGraficoGeneral(this.selectedPage.id);
  }

  generarGraficoGeneral(id: String) {
    var data = {
      idPage: id,
      iniDate: '2023-07-08',
      finDate: '2023-07-20',
    };

    //desde aqui borrar
    const endpointData: any = {
      access_token: null,
      name: null,
      id: null,
      listFeed: [
        {
          id: '660261270686611_776103240971957',
          message: 'test',
          created_time: '2023-07-08T07:33:11+0000',
          totalComentario: '3',
        },
        {
          id: '660261270686611_654098323172450',
          message:
            'Honor y respeto a los grandes maestros  gracias por tomar en cuenta a este cervidor un fuerte abrazo  a mis hermano Adrian Chillemi y a Luis Romero mis respetos siempre',
          created_time: '2022-12-20T19:03:40+0000',
          totalComentario: '5',
        },
        {
          id: '660261270686611_4639085656137466',
          message: null,
          created_time: '2021-07-14T18:36:27+0000',
          totalComentario: '10',
        },
      ],
      totalComentario: 2,
      totalComments: {
        positive: 10,
        negative: 3,
        neutral: 4,
      },
    };

    this.primerGrafico(endpointData);
    this.segundoGrafico(endpointData);

    this.graficos = true;

    //desde aqui dejar
    /*
    this.analyticsService.obtenerGraficoGeneral(data).subscribe(
      (response: any) => {
        //const endpointData: any = response;
        const endpointData: any = {
          access_token: null,
          name: null,
          id: null,
          listFeed: [
            {
              id: '660261270686611_776103240971957',
              message: 'test',
              created_time: '2023-07-08T07:33:11+0000',
              totalComentario: '3',
            },
            {
              id: '660261270686611_654098323172450',
              message:
                'Honor y respeto a los grandes maestros  gracias por tomar en cuenta a este cervidor un fuerte abrazo  a mis hermano Adrian Chillemi y a Luis Romero mis respetos siempre',
              created_time: '2022-12-20T19:03:40+0000',
              totalComentario: '5',
            },
            {
              id: '660261270686611_4639085656137466',
              message: null,
              created_time: '2021-07-14T18:36:27+0000',
              totalComentario: '10',
            },
          ],
          totalComentario: 2,
          totalComments: {
            positive: 10,
            negative: 3,
            neutral: 4,
          },
        };

        this.primerGrafico(endpointData);
        this.segundoGrafico(endpointData);
        this.loading = false;
        this.graficos = true;
      },
      (error) => {
        console.error(error);
        this.loading = false;
        this.graficos = false;
      }
    );
*/
  }

  postChange(value: string): void {
    this.selectedPost = value;
    console.log(this.selectedPage);
  }

  obtenerPosts(access_token: any) {
    this.loading = true;
    this.selectedPost = null;
    console.log('obtener', access_token);
    this.analyticsService.obtenerPosts(access_token).subscribe(
      (response: any) => {
        this.posts = response.data;
        this.posts = response.data.filter((item: any) => item.message);
        this.loading = false;
      },
      (error) => {
        console.error(error);
        this.loading = false;
      }
    );
  }

  totalReaccionesfecha() {
    this.graficosFiltrados = false;
    this.mostrarSelect = false;

    this.mostrarPrimero = false;
    this.mostrarSegundo = true;
    var data = {
      idPage: this.selectedPage.id,
      iniDate: this.iniDate,
      finDate: this.finDate,
    };

    const endpointData: any = {
      access_token: null,
      name: null,
      id: null,
      listFeed: [
        {
          id: '660261270686611_776103240971957',
          message: 'test',
          created_time: '2023-07-08T07:33:11+0000',
          totalComentario: '3',
        },
        {
          id: '660261270686611_654098323172450',
          message:
            'Honor y respeto a los grandes maestros  gracias por tomar en cuenta a este cervidor un fuerte abrazo  a mis hermano Adrian Chillemi y a Luis Romero mis respetos siempre',
          created_time: '2022-12-20T19:03:40+0000',
          totalComentario: '5',
        },
        {
          id: '660261270686611_4639085656137466',
          message: null,
          created_time: '2021-07-14T18:36:27+0000',
          totalComentario: '10',
        },
      ],
      totalComentario: 2,
      totalComments: {
        positive: 10,
        negative: 3,
        neutral: 4,
      },
    };

    this.graficoPastelFecha(endpointData);

    this.graficosFiltrados = true;

    //desde aqui dejar
    /*
    this.analyticsService.obtenerTotalReaccionesFecha(data).subscribe(
      (response: any) => {
        //const endpointData: any = response;
        const endpointData: any = {
          id: null,
          message: null,
          created_time: null,
          totalComentario: 0,
          totalComments: {
            positive: 10,
            negative: 3,
            neutral: 4,
          },
        };

        this.graficoPastelFecha(endpointData);

        this.graficosFiltrados = true;
        this.loading = false;
        this.graficosFiltrados = true;
      },
      (error) => {
        console.error(error);
        this.loading = false;
        this.graficosFiltrados = false;
      }
    ); */
  }

  totalComentariosFecha() {
    this.graficosFiltrados = false;
    this.mostrarSelect = false;

    this.mostrarPrimero = false;
    this.mostrarSegundo = true;
    var data = {
      idPage: this.selectedPage.id,
      iniDate: this.iniDate,
      finDate: this.finDate,
    };

    const endpointData: any = {
      access_token: null,
      name: null,
      id: null,
      listFeed: [
        {
          id: '660261270686611_776103240971957',
          message: 'test',
          created_time: '2023-07-08T07:33:11+0000',
          totalComentario: '3',
        },
        {
          id: '660261270686611_654098323172450',
          message:
            'Honor y respeto a los grandes maestros  gracias por tomar en cuenta a este cervidor un fuerte abrazo  a mis hermano Adrian Chillemi y a Luis Romero mis respetos siempre',
          created_time: '2022-12-20T19:03:40+0000',
          totalComentario: '5',
        },
        {
          id: '660261270686611_4639085656137466',
          message: null,
          created_time: '2021-07-14T18:36:27+0000',
          totalComentario: '10',
        },
      ],
      totalComentario: 2,
      totalComments: {
        positive: 10,
        negative: 3,
        neutral: 4,
      },
    };

    this.graficoPastelFecha(endpointData);

    this.graficosFiltrados = true;

    //desde aqui dejar
    /*
    this.analyticsService.obtenerTotalComentarioFecha(data).subscribe(
      (response: any) => {
        //const endpointData: any = response;
        const endpointData: any = {
          id: null,
          message: null,
          created_time: null,
          totalComentario: 10,
          totalComments: {
            positive: 10,
            negative: 3,
            neutral: 4,
          },
        };

        this.graficoPastelFecha(endpointData);

        this.graficosFiltrados = true;
        this.loading = false;
        this.graficosFiltrados = true;
      },
      (error) => {
        console.error(error);
        this.loading = false;
        this.graficosFiltrados = false;
      }
    ); */
  }
  graficoPastelFecha(endpointData: any) {
    // Obtener los valores de "totalComentario" y "totalComments"
    this.totalComentarioGeneralFiltrado = endpointData.totalComentario;
    const totalPositive = endpointData.totalComments.positive;
    const totalNegative = endpointData.totalComments.negative;
    const totalNeutral = endpointData.totalComments.neutral;

    console.log(totalNegative, totalNeutral, totalPositive);

    this.chartOptionsTotalReaccionesFecha = {
      series: [totalPositive, totalNegative, totalNeutral],
      chart: {
        width: 380,
        type: 'pie',
      },

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
      labels: ['Positivo', 'Negativo', 'Neutral'], // Nombres de las series
    };
  }

  totalPublicacionesFecha() {
    this.mostrarSelect = false;

    this.graficosFiltrados = false;
    this.mostrarPrimero = true;
    this.mostrarSegundo = true;
    var data = {
      idPage: this.selectedPage.id,
      iniDate: this.iniDate,
      finDate: this.finDate,
    };

    const endpointData: any = {
      access_token: null,
      name: null,
      id: null,
      listFeed: [
        {
          id: '660261270686611_776103240971957',
          message: 'test',
          created_time: '2023-07-08T07:33:11+0000',
          totalComentario: '3',
        },
        {
          id: '660261270686611_654098323172450',
          message:
            'Honor y respeto a los grandes maestros  gracias por tomar en cuenta a este cervidor un fuerte abrazo  a mis hermano Adrian Chillemi y a Luis Romero mis respetos siempre',
          created_time: '2022-12-20T19:03:40+0000',
          totalComentario: '5',
        },
        {
          id: '660261270686611_4639085656137466',
          message: null,
          created_time: '2021-07-14T18:36:27+0000',
          totalComentario: '10',
        },
      ],
      totalComentario: 2,
      totalComments: {
        positive: 10,
        negative: 3,
        neutral: 4,
      },
    };

    this.graficoPublicacionesFecha1(endpointData);
    this.graficoPastelFecha(endpointData);

    this.graficosFiltrados = true;

    //desde aqui dejar
    /*
    this.analyticsService.obtenerTotalPublicacionesFecha(data).subscribe(
      (response: any) => {
        //const endpointData: any = response;
        const endpointData: any = {
          access_token: null,
          name: null,
          id: null,
          listFeed: [
            {
              id: '660261270686611_776103240971957',
              message: 'test',
              created_time: '2023-07-08T07:33:11+0000',
              totalComentario: '3',
            },
            {
              id: '660261270686611_654098323172450',
              message:
                'Honor y respeto a los grandes maestros  gracias por tomar en cuenta a este cervidor un fuerte abrazo  a mis hermano Adrian Chillemi y a Luis Romero mis respetos siempre',
              created_time: '2022-12-20T19:03:40+0000',
              totalComentario: '5',
            },
            {
              id: '660261270686611_4639085656137466',
              message: null,
              created_time: '2021-07-14T18:36:27+0000',
              totalComentario: '10',
            },
          ],
          totalComentario: 2,
          totalComments: {
            positive: 10,
            negative: 3,
            neutral: 4,
          },
        };

        this.graficoPublicacionesFecha1(endpointData);
        this.graficoPastelFecha(endpointData);

        this.graficosFiltrados = true;
        this.loading = false;
        this.graficosFiltrados = true;
      },
      (error) => {
        console.error(error);
        this.loading = false;
        this.graficosFiltrados = false;
      }
    ); */
  }
  graficoPublicacionesFecha1(endpointData: any) {
    // Obtener los datos del endpoint

    // Crear los arrays para almacenar los datos del gráfico
    const categories: any = [];
    const data = [];

    // Iterar sobre el array listFeed del endpointData
    for (const item of endpointData.listFeed) {
      // Obtener los valores necesarios para el gráfico
      const message = item.message
        ? item.message.length > 15
          ? item.message.substring(0, 15) + '...'
          : item.message
        : '';
      const totalComentario = parseInt(item.totalComentario);
      const category = [message]; // Ejemplo: ['1', '1']

      // Agregar los valores al array categories y data
      categories.push(category);
      data.push(totalComentario);
    }

    // Actualizar el chartOptions con los nuevos datos
    this.chartOptionsGeneral2 = {
      series: [
        {
          name: 'distibuted',
          data: data,
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
        events: {
          click: function (chart, w, e) {
            // console.log(chart, w, e)
          },
        },
      },
      colors: [
        '#008FFB',
        '#00E396',
        '#FEB019',
        '#FF4560',
        '#775DD0',
        '#546E7A',
        '#26a69a',
        '#D10CE8',
      ],
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
      },
      xaxis: {
        categories: categories,
        labels: {
          style: {
            colors: [
              '#008FFB',
              '#00E396',
              '#FEB019',
              '#FF4560',
              '#775DD0',
              '#546E7A',
              '#26a69a',
              '#D10CE8',
            ],
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: ['#333'],
            fontSize: '12px',
            fontWeight: 'bold',
          },
        },
      },
    };
  }

  totalComnetarioSentimiento() {
    this.mostrarSelect = true;
    this.graficosFiltrados = false;
    this.mostrarPrimero = false;
    this.mostrarSegundo = false;
    this.selectedSentimiento = '';
  }

  sentimientoChange(value: string): void {
    this.mostrarSelect = true;
    this.graficosFiltrados = false;
    this.mostrarPrimero = false;
    this.mostrarSegundo = true;

    this.selectedSentimiento = value;

    var data = {
      idPage: this.selectedPage.id,
      idFeed: this.selectedPost,

      sentiment: value,
    };

    const endpointData: any = {
      access_token: null,
      name: null,
      id: null,
      listFeed: [
        {
          id: '660261270686611_776103240971957',
          message: 'test',
          created_time: '2023-07-08T07:33:11+0000',
          totalComentario: '3',
        },
        {
          id: '660261270686611_654098323172450',
          message:
            'Honor y respeto a los grandes maestros  gracias por tomar en cuenta a este cervidor un fuerte abrazo  a mis hermano Adrian Chillemi y a Luis Romero mis respetos siempre',
          created_time: '2022-12-20T19:03:40+0000',
          totalComentario: '5',
        },
        {
          id: '660261270686611_4639085656137466',
          message: null,
          created_time: '2021-07-14T18:36:27+0000',
          totalComentario: '10',
        },
      ],
      totalComentario: 2,
      totalComments: {
        positive: 10,
        negative: 3,
        neutral: 4,
      },
    };

    this.graficoPastelFecha(endpointData);

    this.graficosFiltrados = true;

    //desde aqui dejar
    /*
    this.analyticsService.obtenerTotalComentarioSentimiento(data).subscribe(
      (response: any) => {
        //const endpointData: any = response;
        const endpointData: any = {
          id: null,
          message: null,
          created_time: null,
          totalComentario: 10,
          totalComments: {
            positive: 10,
            negative: 3,
            neutral: 4,
          },
        };

        this.graficoPastelFecha(endpointData);

        this.graficosFiltrados = true;
        this.loading = false;
        this.graficosFiltrados = true;
      },
      (error) => {
        console.error(error);
        this.loading = false;
        this.graficosFiltrados = false;
      }
    ); */
  }
}
