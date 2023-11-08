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
  public chartOptionsTotalReaccionesFecha2: Partial<ChartOptions2>;

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
  mostrarUltmo: boolean;
  totalComentarioGeneralFiltrado2: any;

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
        this.pages = response.data.slice(0, 1);

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
    this.graficosFiltrados = false;
    this.mostrarPrimero = true;
    this.mostrarSegundo = true;
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
          id: '660261270686611_4639085656137466',
          message:
            '¿𝙉𝙤 𝙩𝙞𝙚𝙣𝙚𝙨 𝙩𝙪 𝙧𝙚𝙜𝙖𝙡𝙤 𝙥𝙖𝙧𝙖 𝙚𝙡 𝙙𝙞́𝙖 𝙙𝙚 𝙡𝙖𝙨 𝙢𝙖𝙙𝙧𝙚𝙨?🎆🎊\n𝙋𝙞𝙯𝙯𝙖 𝙈𝙚𝙡𝙡𝙞𝙨𝙤𝙨 𝙩𝙚 𝙩𝙧𝙖𝙚 𝙪𝙣𝙖 𝙨𝙪𝙥𝙚𝙧 𝙥𝙧𝙤𝙢𝙤 𝙥𝙖𝙧𝙖 𝙚𝙡 𝙙𝙞́𝙖 𝙙𝙚 𝙡𝙖𝙨 𝙢𝙖𝙙𝙧𝙚𝙨.🥳🤩\n𝙋𝙪𝙚𝙙𝙚𝙨 𝙥𝙚𝙙𝙞𝙧 𝟮 𝙥𝙞𝙯𝙯𝙖𝙨 𝙀𝙭𝙩𝙧𝙖 𝙁𝙖𝙢𝙞𝙡𝙞𝙖𝙧𝙚𝙨 𝙙𝙚 𝟭𝟲 𝙥𝙤𝙧𝙘𝙞𝙤𝙣𝙚𝙨 𝙘𝙖𝙙𝙖 𝙪𝙣𝙖, 𝙙𝙤𝙣𝙙𝙚 𝙥𝙪𝙚𝙙𝙚𝙨 𝙞𝙣𝙘𝙡𝙪𝙞𝙧 𝙝𝙖𝙨𝙩𝙖 𝟰 𝙞𝙣𝙜𝙧𝙚𝙙𝙞𝙚𝙣𝙩𝙚𝙨 𝙖 𝙩𝙪 𝙚𝙡𝙚𝙘𝙘𝙞𝙤́𝙣 𝙮 𝙪𝙣𝙖 𝙘𝙤𝙡𝙖 𝙙𝙚 𝟭𝙇 𝙥𝙤𝙧 𝙨𝙤𝙡𝙤 $𝟮𝟬.🤯🍕\n𝙍𝙚𝙘𝙪𝙚𝙧𝙙𝙖 𝙦𝙪𝙚 𝙩𝙖𝙢𝙗𝙞𝙚́𝙣 𝙩𝙚𝙣𝙚𝙢𝙤𝙨 𝙥𝙞𝙯𝙯𝙖 𝙙𝙚 𝙛𝙤𝙧𝙢𝙖 𝙙𝙚 𝙘𝙤𝙧𝙖𝙯𝙤́𝙣!❤️',
          created_time: '2021-07-14T18:36:27+0000',
          totalComentario: '5',
        },
        {
          id: '660261270686611_4639085656137466',
          message:
            '𝗣𝘂𝗲𝗱𝗲𝘀 𝗽𝗲𝗱𝗶𝗿 𝗲𝗻 𝘁𝘂 𝗽𝗶𝘇𝘇𝗮 𝘂𝗻𝗮 𝗴𝗿𝗮𝗻 𝘃𝗮𝗿𝗶𝗲𝗱𝗮𝗱 𝗱𝗲 𝗶𝗻𝗴𝗿𝗲𝗱𝗶𝗲𝗻𝘁𝗲𝘀.🤤\n𝗖𝗼𝗺𝘂𝗻í𝗰𝗮𝘁𝗲 𝗰𝗼𝗻 𝗻𝗼𝘀𝗼𝘁𝗿𝗼𝘀 𝘆 𝗽𝗶𝗱𝗲 𝘁𝘂 𝗽𝗶𝘇𝘇𝗮, 𝗿𝗲𝗰𝘂𝗲𝗿𝗱𝗮 𝗾𝘂𝗲 𝘁𝗲𝗻𝗲𝗺𝗼𝘀 𝘀𝗲𝗿𝘃𝗶𝗰𝗶𝗼 𝗮 𝗱𝗼𝗺𝗶𝗰𝗶𝗹𝗶𝗼. 🍕🛵',
          created_time: '2021-07-14T18:36:27+0000',
          totalComentario: '5',
        },
        {
          id: '660261270686611_4639085656137466',
          message:
            '𝗥𝗲𝗰𝘂𝗲𝗿𝗱𝗮 𝗾𝘂𝗲 𝘀á𝗯𝗮𝗱𝗼 𝘆 𝗱𝗼𝗺𝗶𝗻𝗴𝗼 𝗱𝗲𝗯𝗶𝗱𝗼 𝗮𝗹 𝗲𝘀𝘁𝗮𝗱𝗼 𝗱𝗲 𝗲𝘅𝗰𝗲𝗽𝗰𝗶ó𝗻 𝗻𝘂𝗲𝘀𝘁𝗿𝗼𝘀 𝗹𝗼𝗰𝗮𝗹𝗲𝘀 𝗻𝗼 𝘀𝗲 𝗲𝗻𝗰𝘂𝗲𝗻𝘁𝗿𝗮𝗻 𝗮𝗯𝗶𝗲𝗿𝘁𝗼𝘀, 𝗽𝗲𝗿𝗼 𝘀𝗶 𝗽𝘂𝗲𝗱𝗲𝘀 𝗽𝗲𝗱𝗶𝗿 𝘁𝘂 𝗽𝗶𝘇𝘇𝗮 𝗮 𝗱𝗼𝗺𝗶𝗰𝗶𝗹𝗶𝗼🍕.\n𝗬𝗮 𝗲𝘀𝘁𝗮𝗺𝗼𝘀 𝗿𝗲𝗰𝗶𝗯𝗶𝗲𝗻𝗱𝗼 𝗽𝗲𝗱𝗶𝗱𝗼𝘀 𝗽𝗮𝗿𝗮 𝗲𝗻𝘃𝗶𝗮𝗿𝗹𝗼𝘀 𝗮 𝗽𝗮𝗿𝘁𝗶𝗿 𝗱𝗲 𝗹𝗮𝘀 16:00 𝗽𝗺. 😋',
          created_time: '2021-07-14T18:36:27+0000',
          totalComentario: '5',
        },
        {
          id: '660261270686611_4639085656137466',
          message:
            '𝐀𝐏𝐑𝐎𝐕𝐄𝐂𝐇𝐀 𝐄𝐋 𝐌𝐀𝐑𝐓𝐄𝐒 𝐋𝐎𝐂𝐎 🍕🍕\n\nEn Pizza Mellisos te traemos las siguientes promociones para este martes loco🍕\n\nEscríbenos al WhatsApp y realiza tu pedido! 🍕🛵',
          created_time: '2021-07-14T18:36:27+0000',
          totalComentario: '5',
        },
        {
          id: '660261270686611_4639085656137466',
          message:
            'Nuestro menú en Pizza Mellisos🍕🍕🤤\n\nRecuerda que también tenemos envío a domicilio.🛵',
          created_time: '2021-07-14T18:36:27+0000',
          totalComentario: '5',
        },

        {
          id: '660261270686611_4639085656137466',
          message:
            '𝙏𝙚 𝙘𝙤𝙢𝙥𝙖𝙧𝙩𝙞𝙢𝙤𝙨 𝙣𝙪𝙚𝙨𝙩𝙧𝙤𝙨 𝙣𝙪𝙚𝙫𝙤𝙨 𝙝𝙤𝙧𝙖𝙧𝙞𝙤𝙨 𝙙𝙚𝙗𝙞𝙙𝙤 𝙖𝙡 𝙚𝙨𝙩𝙖𝙙𝙤 𝙙𝙚 𝙚𝙭𝙘𝙚𝙥𝙘𝙞𝙤́𝙣, 𝙮 𝙖𝙙𝙚𝙢𝙖́𝙨 𝙡𝙖 𝙡𝙤𝙘𝙖𝙡𝙞𝙯𝙖𝙘𝙞𝙤́𝙣 𝙙𝙚 𝙣𝙪𝙚𝙨𝙩𝙧𝙤𝙨 𝙚𝙨𝙩𝙖𝙗𝙡𝙚𝙘𝙞𝙢𝙞𝙚𝙣𝙩𝙤𝙨.🤗🍕\n𝙍𝙚𝙘𝙪𝙚𝙧𝙙𝙖 𝙦𝙪𝙚 𝙘𝙤𝙣𝙩𝙖𝙢𝙤𝙨 𝙘𝙤𝙣 𝙨𝙚𝙧𝙫𝙞𝙘𝙞𝙤 𝙖 𝙙𝙤𝙢𝙞𝙘𝙞𝙡𝙞𝙤, 𝙥𝙞𝙙𝙚 𝙩𝙪 𝙥𝙞𝙯𝙯𝙖 𝙘𝙤𝙣 𝙖𝙣𝙩𝙞𝙘𝙞𝙥𝙖𝙘𝙞𝙤́𝙣!🛵🏠',
          created_time: '2021-07-14T18:36:27+0000',
          totalComentario: '5',
        },
        {
          id: '660261270686611_4639085656137466',
          message:
            'Cliente satisfecho🥰\nNo olvides tú también pedir tu pizza🍕',

          created_time: '2021-07-14T18:36:27+0000',
          totalComentario: '5',
        },
      ],
      totalComentario: 35,
      totalComments: {
        positive: 20,
        negative: 5,
        neutral: 10,
      },
    };

    this.graficoPublicacionesFecha1(endpointData);
    this.graficoPastelFecha(endpointData);

    this.graficosFiltrados = true;

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
      totalComentario: 12,
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
      totalComentario: 0,
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
      totalComentario: 11,
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
    this.selectedSentimiento = '';
  }

  sentimientoChange(value: string): void {
    this.mostrarUltmo = false;

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

    this.graficoPastelFechaUltimo(endpointData);

    this.mostrarUltmo = true;

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

        this.mostrarUltmo = true;
        this.loading = false;
      },
      (error) => {
        console.error(error);
        this.loading = false;
        this.mostrarUltmo = false;
      }
    ); */
  }

  graficoPastelFechaUltimo(endpointData: any) {
    // Obtener los valores de "totalComentario" y "totalComments"
    this.totalComentarioGeneralFiltrado2 = endpointData.totalComentario;
    const totalPositive = endpointData.totalComments.positive;
    const totalNegative = endpointData.totalComments.negative;
    const totalNeutral = endpointData.totalComments.neutral;

    console.log(totalNegative, totalNeutral, totalPositive);

    this.chartOptionsTotalReaccionesFecha2 = {
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
}
