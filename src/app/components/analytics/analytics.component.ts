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

  date: any = null;
  totalComentario: any;
  access_token: any;

  pages: any[] = []; // Almacena los datos de las páginas
  posts: any[] = []; // Almacena los datos de las páginas

  selectedPage: any; // Almacena la página seleccionada
  selectedPost: any;

  constructor(
    private valueService: SessionStorageService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.access_token = this.valueService.getItem('access_token');
    this.obtenerPaginas(this.access_token);
    this.generarGraficoGeneral();
  }
  obtenerPaginas(access_token: string) {
    this.analyticsService.obtenerPaginas(access_token).subscribe(
      (response: any) => {
        this.pages = response.data;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  generarGraficoGeneral() {
    this.primerGrafico();
    this.segundoGrafico();
  }
  segundoGrafico() {
    // Obtener los datos del endpoint
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
  primerGrafico() {
    // Obtener los datos del endpoint
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
    console.log('onChange: ', result);
  }

  selectedProvince = 'Zhejiang';
  selectedCity = 'Hangzhou';
  provinceData = ['Zhejiang', 'Jiangsu'];
  cityData: { [place: string]: string[] } = {
    Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
    Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang'],
  };

  provinceChange(value: string): void {
    this.selectedPage = value;
    console.log(this.selectedPage);
    this.obtenerPosts(this.selectedPage.access_token);
  }

  comentarioChange(value: string): void {
    this.selectedPost = value;
    console.log(this.selectedPage);
  }

  obtenerPosts(access_token: any) {
    this.selectedPost = null;
    console.log('obtener', access_token);
    this.analyticsService.obtenerPosts(access_token).subscribe(
      (response: any) => {
        this.posts = response.data;
        this.posts = response.data.filter((item: any) => item.message);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
