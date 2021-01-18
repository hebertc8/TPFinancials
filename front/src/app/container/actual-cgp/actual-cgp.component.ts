import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexDataLabels, ApexTitleSubtitle, ApexLegend, ApexFill, ApexTooltip, ApexTheme } from 'ng-apexcharts';
import { Options } from 'ng5-slider';
import { SummaryService } from 'src/app/services/summary.service';
import { NbToastrService, NbThemeService } from '@nebular/theme';
import * as $ from 'jquery';
import { ObjSelectcgp } from 'src/app/services/interfaces';
import { Subscription } from 'rxjs';
import { obsselectcgp } from 'src/app/services/obs-select-cgp';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  markers: any; //ApexMarkers;
  stroke: any; //ApexStroke;
  yaxis: ApexYAxis | ApexYAxis[];
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
  colors: Array<string>;
  theme: ApexTheme;
};

@Component({
  selector: 'app-actual-cgp',
  templateUrl: './actual-cgp.component.html',
  styleUrls: ['./actual-cgp.component.scss']
})
export class ActualCgpComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild("sga") sga: ChartComponent;
  public chartOptionsSga: Partial<ChartOptions>;

  @ViewChild("grossCou") grossCou: ChartComponent;
  public chartOptionsGrossCou: Partial<ChartOptions>;

  public spinnerChart: Boolean = true;
  public spinnerSga: Boolean = true;
  public spinnerDepre: Boolean = true;
  public spinnerGrossCou: Boolean = true;
  public spinnerSgaCou: Boolean = true;
  public spinnerDepreCou: Boolean = true;
  public revealed: Boolean = false;

  public yearArray: Array<any> = [];
  public monthArray: Array<any> = [];
  public subArray: Array<any> = [];
  public countryArray: Array<any> = [];
  public regionArray: Array<any> = [];
  public filtersArray: Array<any> = [];
  public obsSelgcp: ObjSelectcgp;
  public suscripcion: Subscription;
  
  public titleCountry;
  public error = 0;
  public ini = 0;
  public sub: Array<any> = [];
  public country: Array<any> = [];
  public region: Array<any> = [];
  // public sub;
  // public country;
  // public region;

  public themeAc = 'light';
  countryName = '';
  minValue: number = 0;
  maxValue: number = 0;
  minValueMonth: number = 0;
  maxValueMonth: number = 0;
  options: Options = {
    floor: 0,
    ceil: 0
  };
  optionsMonth: Options = {
    floor: 0,
    ceil: 0
  };
  constructor(private summaryservice: SummaryService,
    private toastr: NbToastrService,
    private theme: NbThemeService,
    private obsSelectCgp:obsselectcgp) {

    const year = new Date().getFullYear();
    this.getCgp(null, null, null, 5);
    this.getActualCgp(null, null, null, year, year, 1, 12, 1);

    this.chartOptions = {

      colors: ["rgb(1,12,80)", "#00ffaf", "#f3b915"],
      theme: {
        mode: this.themeAc === 'dark' ? 'dark' : 'light',
      },
      series: [
        {
          name: "NetRev2",
          type: "column",
          data: []
        },
        {
          name: "Gross2",
          type: "column",
          data: []
        },
        {
          name: "Gross2 dividido por NetRev2",
          type: "line",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "line",
        stacked: false,
        toolbar: {
          show: true,
          tools: {
            download: false,
            zoomin: true,
            zoomout: true,
            pan: true,
            zoom: false,
            selection: false,
          }
        }

      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [1, 1, 4]
      },
      xaxis: {
        categories: []
      },
      yaxis: [
        {
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#338C85"
          },
          labels: {
            style: {
              colors: "#aaaad1"
            },
            formatter: (value) => { return value.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
          },
          tooltip: {
            enabled: true
          }
        },
        {
          seriesName: "NetRev",
          opposite: false,
          show: false,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#9070BD"
          },
          labels: {
            style: {
              colors: "#9070BD"
            },
            formatter: (value) => { return value.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
          }
        },
        {
          seriesName: "Gross percentage",
          opposite: true,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#FA8E04"
          },
          labels: {
            style: {
              colors: "#FA8E04"
            },
            formatter: (value) => { return '%' + value.toFixed(2) },
          },
        }
      ],

      tooltip: {
        fixed: {
          enabled: true,
          position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60
        }
      },
      legend: {
        horizontalAlign: "left",
        offsetX: 40
      }
    };
    this.chartOptionsSga = {
      colors: ["#dc3545", "#28a745", "#8AD4EB"],
      theme: {
        mode: this.themeAc === 'dark' ? 'dark' : 'light',
      },
      series: [
        {
          name: "Percentage EBIT",
          type: "line",
          data: []
        },
        {
          name: "Percentage Gross",
          type: "line",
          data: []
        },
        {
          name: "Percentage Overhead",
          type: "line",
          data: []
        }

      ],
      chart: {
        height: 350,
        type: "line",
        stacked: false,
        toolbar: {
          show: true,
          tools: {
            download: false,
            zoomin: true,
            zoomout: true,
            pan: true,
            zoom: false,
            selection: false,
          }
        }

      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [4, 4, 4]
      },
      xaxis: {
        categories: []
      },
      yaxis: [
        {
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#338C85"
          },
          labels: {
            style: {
              colors: "#aaaad1"
            },
            formatter: (value) => { return '%' + value.toFixed(2) },
          },
          tooltip: {
            enabled: true
          }
        },
        {
          seriesName: "Percentage EBIT",
          opposite: true,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#FA8E04"
          },
          labels: {
            style: {
              colors: "#FA8E04"
            },
            formatter: (value) => { return '%' + value.toFixed(2) },
          }
        },
        {
          seriesName: "Percentage EBIT",
          show: false,
          opposite: true,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#35d483"
          },
          labels: {
            style: {
              colors: "#35d483"
            },
            formatter: (value) => { return '%' + value.toFixed(2) },
          }
        },
        {
          seriesName: "Percentage EBIT",
          show: false,
          opposite: true,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#8AD4EB"
          },
          labels: {
            style: {
              colors: "#8AD4EB"
            },
            formatter: (value) => { return '%' + value.toFixed(2) },
          }
        }
      ],
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val) {
                return val;
              }
            }
          },
          {
            title: {
              formatter: function (val) {
                return val;
              }
            }
          },
          {
            title: {
              formatter: function (val) {
                return val;
              }
            }
          }
        ]
      },
      legend: {
        horizontalAlign: "left",
        offsetX: 40
      }
    };
    this.chartOptionsGrossCou = {
      colors: ["rgb(1,12,80)", "#00ffaf", "#f3b915"],
      theme: {
        mode: this.themeAc === 'dark' ? 'dark' : 'light',
      },
      series: [
        {
          name: "Gross2",
          type: "column",
          data: []
        },
        {
          name: "Gross2 dividido por NetRev2",
          type: "column",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "line",
        stacked: false,
        toolbar: {
          show: true,
          tools: {
            download: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            zoom: false,
            selection: false,
          }
        },
        background: 'transparent',

      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [1, 1, 4]
      },
      xaxis: {
        categories: []
      },
      yaxis: [
        {
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#338C85"
          },
          labels: {
            style: {
              colors: "#aaaad1"
            },
            formatter: (value) => { return '%' + value.toFixed(2) },
          },
          tooltip: {
            enabled: true
          }
        },
        {
          seriesName: "Gross percentage",
          show: false,
          opposite: true,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#9070BD"
          },
          labels: {
            style: {
              colors: "#9070BD"
            },
            formatter: (value) => { return '%' + value.toFixed(2) },
          },
        },
        {
          seriesName: "Gross percentage",
          show: false,
          opposite: true,
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
            color: "#FA8E04"
          },
          labels: {
            style: {
              colors: "#FA8E04"
            },
            formatter: (value) => { return '%' + value.toFixed(2) },
          },
        },
      ],
      tooltip: {
        fixed: {
          enabled: true,
          position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60
        }
      },
      legend: {
        horizontalAlign: "left",
        offsetX: 40
      }
    };
  }

  ngOnInit(): void {
    this.suscripcion = this.obsSelectCgp.datos$.subscribe(datos => {
      this.country=datos.country;
      this.region=datos.region;
      this.sub=datos.sub;
      this.filterSelected(0);
    });
  }

  ngOnDestroy() {
    this.suscripcion.unsubscribe();
  }


  ngAfterViewInit() {
    this.theme.getJsTheme()
      .subscribe(config => {
        console.log("entro ACTUAL CGP");
        var aux = this.chartOptions;
        var groco = this.chartOptionsGrossCou;
        var sga = this.chartOptionsSga;
        if (config.name != 'cosmic') {
          this.themeAc = 'light';
          this.chartOptions = {
            colors: ["rgb(1,12,80)", "#00ffaf", "#f3b915"],
            theme: {
              mode: 'light',
            },
            series: [
              {
                name: "NetRev",
                type: "column",
                data: aux.series[0].data
              },
              {
                name: "Gross",
                type: "column",
                data: aux.series[1].data
              },
              {
                name: "Gross percentage",
                type: "line",
                data: aux.series[2].data
              }
            ],
            chart: {
              height: 350,
              type: "line",
              stacked: false,
              toolbar: {
                show: true,
                tools: {
                  download: true,
                  zoomin: true,
                  zoomout: true,
                  pan: true,
                  zoom: false,
                  selection: false,
                }
              }

            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              width: [1, 1, 4]
            },
            xaxis: {
              categories: aux.xaxis.categories
            },
            yaxis: [
              {
                axisTicks: {
                  show: true
                },
                axisBorder: {
                  show: true,
                  color: "#338C85"
                },
                labels: {
                  style: {
                    colors: "#aaaad1"
                  },
                  formatter: (value) => { return value.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
                },
                tooltip: {
                  enabled: true
                }
              },
              {
                seriesName: "NetRev",
                opposite: false,
                show: false,
                axisTicks: {
                  show: true
                },
                axisBorder: {
                  show: true,
                  color: "#9070BD"
                },
                labels: {
                  style: {
                    colors: "#9070BD"
                  },
                  formatter: (value) => { return value.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
                }
              },
              {
                seriesName: "Gross percentage",
                opposite: true,
                axisTicks: {
                  show: true
                },
                axisBorder: {
                  show: true,
                  color: "#FA8E04"
                },
                labels: {
                  style: {
                    colors: "#FA8E04"
                  },
                  formatter: (value) => { return '%' + value.toFixed(2) },
                },
              }
            ],

            tooltip: {
              fixed: {
                enabled: true,
                position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
                offsetY: 30,
                offsetX: 60
              }
            },
            legend: {
              horizontalAlign: "left",
              offsetX: 40
            }
          };
          this.chartOptionsSga = {
            colors: ["#dc3545", "#28a745", "#8AD4EB"],
            theme: {
              mode: 'light',
            },
            series: [
              {
                name: "Percentage EBIT",
                type: "line",
                data: sga.series[3].data
              },
              {
                name: "Percentage Gross",
                type: "line",
                data: sga.series[4].data
              },
              {
                name: "Percentage Overhead",
                type: "line",
                data: sga.series[5].data
              }
            ],
            chart: {
              height: 350,
              type: "line",
              stacked: false,
              toolbar: {
                show: true,
                tools: {
                  download: true,
                  zoomin: true,
                  zoomout: true,
                  pan: true,
                  zoom: false,
                  selection: false,
                }
              }

            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              width: [4, 4, 4]
            },
            xaxis: {
              categories: sga.xaxis.categories
            },
            yaxis: [
              {
                axisTicks: {
                  show: true
                },
                axisBorder: {
                  show: true,
                  color: "#338C85"
                },
                labels: {
                  style: {
                    colors: "#aaaad1"
                  },
                  formatter: (value) => { return '%' + value.toFixed(2) },
                  // formatter: (value) => { return value.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
                },
                tooltip: {
                  enabled: true
                }
              },
              {
                seriesName: "Percentage EBIT",
                show: false,
                opposite: true,
                axisTicks: {
                  show: true
                },
                axisBorder: {
                  show: true,
                  color: "#FA8E04"
                },
                labels: {
                  style: {
                    colors: "#FA8E04"
                  },
                  formatter: (value) => { return '%' + value.toFixed(2) },
                }
              },
              {
                seriesName: "Percentage EBIT",
                show: false,
                opposite: true,
                axisTicks: {
                  show: true
                },
                axisBorder: {
                  show: true,
                  color: "#35d483"
                },
                labels: {
                  style: {
                    colors: "#35d483"
                  },
                  formatter: (value) => { return '%' + value.toFixed(2) },
                }
              },
            ],
            tooltip: {
              y: [
                {
                  title: {
                    formatter: function (val) {
                      return val;
                    }
                  }
                },
                {
                  title: {
                    formatter: function (val) {
                      return val;
                    }
                  }
                },
                {
                  title: {
                    formatter: function (val) {
                      return val;
                    }
                  }
                }
              ]
            },
            legend: {
              horizontalAlign: "left",
              offsetX: 40
            }
          };
          this.chartOptionsGrossCou.colors=["rgb(1,12,80)", "#00ffaf", "#f3b915"];
          this.chartOptionsGrossCou.theme={
            mode: 'light',
          };
          this.chartOptionsGrossCou.yaxis= [
            {
              axisTicks: {
                show: true
              },
              axisBorder: {
                show: true,
                color: "#338C85"
              },
              labels: {
                style: {
                  colors: "#aaaad1"
                },
                formatter: (value) => { return '%' + value.toFixed(2) },
              },
              tooltip: {
                enabled: true
              }
            },
            {
              seriesName: "Gross percentage",
              show: false,
              opposite: true,
              axisTicks: {
                show: true
              },
              axisBorder: {
                show: true,
                color: "#9070BD"
              },
              labels: {
                style: {
                  colors: "#9070BD"
                },
                formatter: (value) => { return '%' + value.toFixed(2) },
              },
            },
            {
              seriesName: "Gross percentage",
              show: false,
              opposite: true,
              axisTicks: {
                show: true
              },
              axisBorder: {
                show: true,
                color: "#FA8E04"
              },
              labels: {
                style: {
                  colors: "#FA8E04"
                },
                formatter: (value) => { return '%' + value.toFixed(2) },
              },
            },
          ];
          // this.chartOptionsGrossCou = {
          //   colors: ["rgb(1,12,80)", "#00ffaf", "#f3b915"],
          //   theme: {
          //     mode: 'light',
          //   },
          //   series: [
          //     {
          //       name: "Gross percentage",
          //       type: "line",
          //       data: groco.series[0].data
          //     },
          //     {
          //       name: "Depreciation percentage",
          //       type: "line",
          //       data: groco.series[1] ? groco.series[1].data : []
          //     },
          //     {
          //       name: "SGA percentage",
          //       type: "line",
          //       data: groco.series[2] ? groco.series[2].data : []
          //     }
          //   ],
          //   chart: {
          //     height: 350,
          //     type: "line",
          //     stacked: false,
          //     toolbar: {
          //       show: true,
          //       tools: {
          //         download: true,
          //         zoomin: true,
          //         zoomout: true,
          //         pan: true,
          //         zoom: false,
          //         selection: false,
          //       }
          //     }

          //   },
          //   dataLabels: {
          //     enabled: false
          //   },
          //   stroke: {
          //     width: [4, 4, 4]
          //   },
          //   xaxis: {
          //     categories: groco.xaxis.categories
          //   },
          //   yaxis: [
          //     {
          //       axisTicks: {
          //         show: true
          //       },
          //       axisBorder: {
          //         show: true,
          //         color: "#338C85"
          //       },
          //       labels: {
          //         style: {
          //           colors: "#aaaad1"
          //         },
          //         formatter: (value) => { return '%' + value.toFixed(2) },
          //       },
          //       tooltip: {
          //         enabled: true
          //       }
          //     },
          //     {
          //       seriesName: "Gross percentage",
          //       show: false,
          //       opposite: true,
          //       axisTicks: {
          //         show: true
          //       },
          //       axisBorder: {
          //         show: true,
          //         color: "#9070BD"
          //       },
          //       labels: {
          //         style: {
          //           colors: "#9070BD"
          //         },
          //         formatter: (value) => { return '%' + value.toFixed(2) },
          //       },
          //     },
          //     {
          //       seriesName: "Gross percentage",
          //       show: false,
          //       opposite: true,
          //       axisTicks: {
          //         show: true
          //       },
          //       axisBorder: {
          //         show: true,
          //         color: "#FA8E04"
          //       },
          //       labels: {
          //         style: {
          //           colors: "#FA8E04"
          //         },
          //         formatter: (value) => { return '%' + value.toFixed(2) },
          //       },
          //     },
          //   ],
          //   tooltip: {
          //     fixed: {
          //       enabled: true,
          //       position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
          //       offsetY: 30,
          //       offsetX: 60
          //     }
          //   },
          //   legend: {
          //     horizontalAlign: "left",
          //     offsetX: 40
          //   }
          // };
        } else {
          this.themeAc = 'dark';
          this.chartOptions = {
            colors: ["rgb(1,12,80)", "#00ffaf", "#f3b915"],
            theme: {
              mode: 'dark',
            },
            series: [
              {
                name: "NetRev",
                type: "column",
                data: aux.series[0].data
              },
              {
                name: "Gross",
                type: "column",
                data: aux.series[1].data
              },
              {
                name: "Gross percentage",
                type: "line",
                data: aux.series[2].data
              }
            ],
            chart: {
              height: 350,
              type: "line",
              background: '#323259',
              stacked: false,
              toolbar: {
                show: true,
                tools: {
                  download: true,
                  zoomin: true,
                  zoomout: true,
                  pan: true,
                  zoom: false,
                  selection: false,
                }
              },
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              width: [1, 1, 4],
              colors: ["#fff"]
            },
            xaxis: {
              categories: aux.xaxis.categories
            },
            yaxis: [
              {
                axisTicks: {
                  show: true
                },
                axisBorder: {
                  show: true,
                  color: "#aaaad1"
                },
                labels: {
                  style: {
                    colors: "#aaaad1"
                  },
                  formatter: (value) => { return value.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
                },
                tooltip: {
                  enabled: true
                }
              },
              {
                seriesName: "NetRev",
                opposite: false,
                show: false,
                axisTicks: {
                  show: true
                },
                axisBorder: {
                  show: true,
                  color: "#9070BD"
                },
                labels: {
                  style: {
                    colors: "#9070BD"
                  },
                  formatter: (value) => { return value.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
                }
              },
              {
                seriesName: "Gross percentage",
                opposite: true,
                axisTicks: {
                  show: true
                },
                axisBorder: {
                  show: true,
                  color: "#FA8E04"
                },
                labels: {
                  style: {
                    colors: "#FA8E04"
                  },
                  formatter: (value) => { return '%' + value.toFixed(2) },
                },
              }
            ],

            tooltip: {
              fixed: {
                enabled: true,
                position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
                offsetY: 30,
                offsetX: 60
              }
            },
            legend: {
              horizontalAlign: "left",
              offsetX: 40
            }
          };
          this.chartOptionsSga = {
            colors: ["#dc3545", "#28a745", "#8AD4EB"],
            theme: {
              mode: 'dark',
            },
            series: [
              {
                name: "Percentage EBIT",
                type: "line",
                data: sga.series[3].data
              },
              {
                name: "Percentage Gross",
                type: "line",
                data: sga.series[4].data
              },
              {
                name: "Percentage Overhead",
                type: "column",
                data: sga.series[5].data
              }
            ],
            chart: {
              height: 350,
              type: "line",
              stacked: false,
              toolbar: {
                show: true,
                tools: {
                  download: true,
                  zoomin: true,
                  zoomout: true,
                  pan: true,
                  zoom: false,
                  selection: false,
                }
              },
              background: '#323259',

            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              width: [4, 4, 4]
            },
            xaxis: {
              categories: sga.xaxis.categories
            },
            yaxis: [
              {
                axisTicks: {
                  show: true
                },
                axisBorder: {
                  show: true,
                  color: "#338C85"
                },
                labels: {
                  style: {
                    colors: "#aaaad1"
                  },
                  formatter: (value) => { return '%' + value.toFixed(2) },
                  // formatter: (value) => { return value.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
                },
                tooltip: {
                  enabled: true
                }
              },
              {
                seriesName: "Percentage EBIT",
                opposite: true,
                axisTicks: {
                  show: true
                },
                axisBorder: {
                  show: true,
                  color: "#FA8E04"
                },
                labels: {
                  style: {
                    colors: "#FA8E04"
                  },
                  formatter: (value) => { return '%' + value.toFixed(2) },
                }
              },
              {
                seriesName: "Percentage EBIT",
                show: false,
                opposite: true,
                axisTicks: {
                  show: true
                },
                axisBorder: {
                  show: true,
                  color: "#35d483"
                },
                labels: {
                  style: {
                    colors: "#35d483"
                  },
                  formatter: (value) => { return '%' + value.toFixed(2) },
                }
              },
              {
                seriesName: "Percentage EBIT",
                show: false,
                opposite: true,
                axisTicks: {
                  show: true
                },
                axisBorder: {
                  show: true,
                  color: "#8AD4EB"
                },
                labels: {
                  style: {
                    colors: "#8AD4EB"
                  },
                  formatter: (value) => { return '%' + value.toFixed(2) },
                }
              }
            ],
            tooltip: {
              y: [
                {
                  title: {
                    formatter: function (val) {
                      return val;
                    }
                  }
                },
                {
                  title: {
                    formatter: function (val) {
                      return val;
                    }
                  }
                },
                {
                  title: {
                    formatter: function (val) {
                      return val;
                    }
                  }
                }
              ]
            },
            legend: {
              horizontalAlign: "left",
              offsetX: 40
            }
          };
          this.chartOptionsGrossCou = {
            colors: ["rgb(1,12,80)", "#00ffaf", "#f3b915"],
            theme: {
              mode: 'dark',
            },
            series: [
              {
                name: "Gross percentage",
                type: "line",
                data: groco.series[0].data
              },
              {
                name: "Depreciation percentage",
                type: "line",
                data: groco.series[1] ? groco.series[1].data : []
              },
              {
                name: "SGA percentage",
                type: "line",
                data: groco.series[2] ? groco.series[2].data : []
              }
            ],
            chart: {
              height: 350,
              type: "line",
              stacked: false,
              toolbar: {
                show: true,
                tools: {
                  download: true,
                  zoomin: true,
                  zoomout: true,
                  pan: true,
                  zoom: false,
                  selection: false,
                }
              },
              background: '#323259',
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              width: [4, 4, 4]
            },
            xaxis: {
              categories: groco.xaxis.categories
            },
            yaxis: [
              {
                axisTicks: {
                  show: true
                },
                axisBorder: {
                  show: true,
                  color: "#338C85"
                },
                labels: {
                  style: {
                    colors: "#aaaad1"
                  },
                  formatter: (value) => { return '%' + value.toFixed(2) },
                },
                tooltip: {
                  enabled: true
                }
              },
              {
                seriesName: "Gross percentage",
                show: false,
                opposite: true,
                axisTicks: {
                  show: true
                },
                axisBorder: {
                  show: true,
                  color: "#9070BD"
                },
                labels: {
                  style: {
                    colors: "#9070BD"
                  },
                  formatter: (value) => { return '%' + value.toFixed(2) },
                },
              },
              {
                seriesName: "Gross percentage",
                show: false,
                opposite: true,
                axisTicks: {
                  show: true
                },
                axisBorder: {
                  show: true,
                  color: "#FA8E04"
                },
                labels: {
                  style: {
                    colors: "#FA8E04"
                  },
                  formatter: (value) => { return '%' + value.toFixed(2) },
                },
              },
            ],

            tooltip: {
              fixed: {
                enabled: true,
                position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
                offsetY: 30,
                offsetX: 60
              }
            },
            legend: {
              horizontalAlign: "left",
              offsetX: 40
            }
          };
        }
      });
  }

  getActualCgp(country, region, sub, yearIni, yearFin, monthIni, monthFin, caseType) {
    this.summaryservice.getActualCgp(country, region, sub, yearIni, yearFin, monthIni, monthFin, caseType).then((res: any) => {
      var bol: Boolean;
      var bol2: Boolean;
      if (res.Result) {
        switch (caseType) {
          case 1:
            res.Result.forEach(detail => {
              bol = false;
              bol2 = false;
              if (this.yearArray.length > 0) {
                this.yearArray.forEach(year => {
                  if (year == detail.YEAR) {
                    bol = true;
                  }
                });
                if (bol != true) {
                  this.yearArray.push(detail.YEAR)
                }
              } else {
                this.yearArray.push(detail.YEAR)
              }

              if (this.monthArray.length > 0) {
                this.monthArray.forEach(mon => {
                  if (mon == detail.month) {
                    bol2 = true;
                  }
                });
                if (bol2 != true) {
                  this.monthArray.push(detail.month);
                }
              } else {
                this.monthArray.push(detail.month);
              }
            });
            const aux = this.yearArray.length;
            this.minValue = this.yearArray[aux - 1];
            this.maxValue = this.yearArray[aux - 1];
            this.options = {
              floor: this.yearArray[0],
              ceil: this.yearArray[aux - 1]
            };
            const aux2 = this.monthArray.length;
            this.minValueMonth = this.monthArray[0];
            this.maxValueMonth = this.monthArray[aux2 - 1];
            var floor = this.monthArray[0];
            var ceil = this.monthArray[aux2 - 1];
            this.optionsMonth = {
              floor: floor,
              ceil: ceil
            };

            break;
          case 2:
            var net = [];
            var gross = [];
            var grossnet = [];
            var months = [];
            var years = [];
            res.Result.forEach(element => {
              bol = false;
              bol2 = false;
              if (years.length > 0) {
                for (var i = 0; i < years.length; i++) {
                  if (years[i] == element.year) {
                    // months.forEach(mon => {
                    //   if (mon === element.month) {
                    //     net[i] += (element.NetRev);
                    //     gross[i] += (element.Gross);
                    //     grossnet[i] += (element.PorcGross);
                    //     bol2 = true;
                    //   }
                    // });
                    // if (bol2 != true) {
                    //   net.push((element.NetRev));
                    //   gross.push((element.Gross));
                    //   grossnet.push((element.PorcGross * 100));
                    //   months.push(element.month);
                    // }
                    net.push((element.NetRev));
                    gross.push((element.Gross));
                    grossnet.push((element.PorcGross * 100));
                    months.push(element.year + '-' + element.month);
                    bol = true;
                  }
                };
                if (bol != true) {
                  years.push(element.year);
                  net.push((element.NetRev));
                  gross.push((element.Gross));
                  grossnet.push((element.PorcGross * 100));
                  months.push(element.year + '-' + element.month);
                }
              } else {
                years.push(element.year);
                net.push((element.NetRev));
                gross.push((element.Gross));
                grossnet.push((element.PorcGross * 100));
                months.push(element.year + '-' + element.month);
              }
            });
            this.chartOptions = {
              colors: ["rgb(1,12,80)", "#00ffaf", "#f3b915"],
              theme: {
                mode: this.themeAc === 'dark' ? 'dark' : 'light',
              },
              series: [
                {
                  name: "NetRev",
                  type: "column",
                  data: net
                },
                {
                  name: "Gross",
                  type: "column",
                  data: gross
                },
                {
                  name: "Gross percentage",
                  type: "line",
                  data: grossnet
                }
              ],
              chart: {
                height: 350,
                type: "line",
                stacked: false,
                toolbar: {
                  show: true,
                  tools: {
                    download: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    zoom: false,
                    selection: false,
                  }             
                },
                background: this.themeAc === 'dark' ? '#323259' : '#ffffff'

              },
              dataLabels: {
                enabled: false
              },
              stroke: {
                width: [1, 1, 4]
              },
              xaxis: {
                categories: months
              },
              yaxis: [
                {
                  axisTicks: {
                    show: true
                  },
                  axisBorder: {
                    show: true,
                    color: "#338C85"
                  },
                  labels: {
                    style: {
                      colors: "#aaaad1"
                    },
                    formatter: (value) => { return value.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
                  },
                  tooltip: {
                    enabled: true
                  }
                },
                {
                  seriesName: "NetRev",
                  opposite: false,
                  show: false,
                  axisTicks: {
                    show: true
                  },
                  axisBorder: {
                    show: true,
                    color: "#9070BD"
                  },
                  labels: {
                    style: {
                      colors: "#9070BD"
                    },
                    formatter: (value) => { return value.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
                  }
                },
                {
                  seriesName: "Gross percentage",
                  opposite: true,
                  axisTicks: {
                    show: true
                  },
                  axisBorder: {
                    show: true,
                    color: "#FA8E04"
                  },
                  labels: {
                    style: {
                      colors: "#FA8E04"
                    },
                    formatter: (value) => { return '%' + value.toFixed(2) },
                  },
                }
              ],

              tooltip: {
                fixed: {
                  enabled: true,
                  position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
                  offsetY: 30,
                  offsetX: 60
                }
              },
              legend: {
                horizontalAlign: "left",
                offsetX: 40
              }
            };
            this.spinnerChart = false;
            break;
          case 3:
            var net = [];
            var gross = [];
            var overget = [];
            var porcEbit = [];
            var porcGross = [];
            var porcOver = [];
            var months = [];
            var years = [];

            res.Result.forEach(element => {
              bol = false;
              bol2 = false;
              if (years.length > 0) {
                for (var i = 0; i < years.length; i++) {
                  if (years[i] == element.year) {
                    // months.forEach(mon => {
                    //   if (mon === element.month) {
                    //     if (element.trm != 0) {
                    //       net[i] += (element.NetRev);
                    //       sga[i] += (element.sga);
                    //       grossnet[i] += (element.trm);
                    //     }
                    //     bol2 = true;
                    //   }
                    // });
                    // if (bol2 != true) {
                    //   net.push((element.NetRev));
                    //   sga.push((element.sga));
                    //   grossnet.push((element.trm));
                    //   months.push(element.month);
                    // }
                    net.push((element.NetRev));
                    gross.push((element.Gross));
                    overget.push((element.Overhead));
                    porcEbit.push((element.PorcEBIT * 100));
                    porcGross.push((element.PorcGross * 100));
                    porcOver.push((element.PorOverhead * 100));
                    months.push(element.year + '-' + element.month);
                    bol = true;
                  }
                };
                if (bol != true) {
                  net.push((element.NetRev));
                  years.push(element.year);
                  gross.push((element.Gross));
                  overget.push((element.Overhead));
                  porcEbit.push((element.PorcEBIT * 100));
                  porcGross.push((element.PorcGross * 100));
                  porcOver.push((element.PorOverhead * 100));
                  months.push(element.year + '-' + element.month);
                }
              } else {
                net.push((element.NetRev));
                years.push(element.year);
                gross.push((element.Gross));
                overget.push((element.Overhead));
                porcEbit.push((element.PorcEBIT * 100));
                porcGross.push((element.PorcGross * 100));
                porcOver.push((element.PorOverhead * 100));
                months.push(element.year + '-' + element.month);
              }
            });
            this.chartOptionsSga = {
              colors: ["#dc3545", "#28a745", "#8AD4EB"],
              theme: {
                mode: this.themeAc === 'dark' ? 'dark' : 'light',
              },
              series: [
                {
                  name: "Percentage EBIT",
                  type: "line",
                  data: porcEbit
                },
                {
                  name: "Percentage Gross",
                  type: "line",
                  data: porcGross
                },
                {
                  name: "Percentage Overhead",
                  type: "line",
                  data: porcOver
                }
              ],
              chart: {
                height: 350,
                type: "line",
                stacked: false,
                toolbar: {
                  show: true,
                  tools: {
                    download: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    zoom: false,
                    selection: false,
                  }
                },
                background: this.themeAc === 'dark' ? '#323259' : '#ffffff'

              },
              dataLabels: {
                enabled: false
              },
              stroke: {
                width: [4, 4, 4]
              },
              xaxis: {
                categories: months
              },
              yaxis: [
                {
                  axisTicks: {
                    show: true
                  },
                  axisBorder: {
                    show: true,
                    color: "#338C85"
                  },
                  labels: {
                    style: {
                      colors: "#aaaad1"
                    },
                    formatter: (value) => { 
                      if(value!== undefined){
                        return value.toFixed(2) + '%';
                      }else{
                        return "";
                      }
                    },
                    // formatter: (value) => {
                    //   return value.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
                  },
                  tooltip: {
                    enabled: true
                  }
                },
                {
                  seriesName: "Percentage EBIT",
                  show: false,
                  opposite: true,
                  axisTicks: {
                    show: true
                  },
                  axisBorder: {
                    show: true,
                    color: "#35d483"
                  },
                  labels: {
                    style: {
                      colors: "#35d483"
                    },
                    formatter: (value) => { return '%' + value.toFixed(2) },
                  }
                },
                {
                  seriesName: "Percentage EBIT",
                  show: false,
                  opposite: true,
                  axisTicks: {
                    show: true
                  },
                  axisBorder: {
                    show: true,
                    color: "#8AD4EB"
                  },
                  labels: {
                    style: {
                      colors: "#8AD4EB"
                    },
                    formatter: (value) => { return '%' + value.toFixed(2) },
                  }
                }
              ],

              tooltip: {
                y: [
                  {
                    title: {
                      formatter: function (val) {
                        return val;
                      }
                    }
                  },
                  {
                    title: {
                      formatter: function (val) {
                        return val;
                      }
                    }
                  },
                  {
                    title: {
                      formatter: function (val) {
                        return val;
                      }
                    }
                  }
                ]
              },
              legend: {
                horizontalAlign: "left",
                offsetX: 40
              }
            };
            this.spinnerSga = false;
            break;
          case 5:
            var country = [];
            var gross = [];
            var lineData = [];
            var sga = [];
            res.Result.forEach(element => {
              bol = false;
              if (country.length > 0) {
                for (var i = 0; i < country.length; i++) {
                  if (country[i] == element.country) {
                    bol = true;
                  }
                };
                if (bol != true) {
                  country.push(element.country);
                  gross.push(element.PorcGross * 100);
                  lineData.push(element.PorcDepreciation * 100);
                  sga.push(element.PorcSGA * 100);
                }
              } else {
                country.push(element.country);
                gross.push(element.PorcGross * 100);
                lineData.push(element.PorcDepreciation * 100);
                sga.push(element.PorcSGA * 100);
              }
            });
            this.chartOptionsGrossCou = {
              colors: ["rgb(1,12,80)", "#00ffaf", "#f3b915"],
              theme: {
                mode: this.themeAc === 'dark' ? 'dark' : 'light',
              },
              series: [
                {
                  name: "Gross percentage",
                  type: "line",
                  data: gross
                },
                {
                  name: "Depreciation percentage",
                  type: "line",
                  data: lineData
                },
                {
                  name: "SGA percentage",
                  type: "line",
                  data: sga
                }
              ],
              chart: {
                height: 350,
                type: "line",
                stacked: false,
                toolbar: {
                  show: true,
                  tools: {
                    download: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    zoom: false,
                    selection: false,
                  }
                },
                background: this.themeAc === 'dark' ? '#323259' : '#ffffff'

              },
              dataLabels: {
                enabled: false
              },
              stroke: {
                width: [4, 4, 4]
              },
              xaxis: {
                categories: country
              },
              yaxis: [
                {
                  axisTicks: {
                    show: true
                  },
                  axisBorder: {
                    show: true,
                    color: "#338C85"
                  },
                  labels: {
                    style: {
                      colors: "#aaaad1"
                    },
                    formatter: (value) => { 
                      console.log();
                      return '%' + value.toFixed(2) 
                    },
                  },
                  tooltip: {
                    enabled: true
                  }
                },
                {
                  seriesName: "Gross percentage",
                  show: false,
                  opposite: true,
                  axisTicks: {
                    show: true
                  },
                  axisBorder: {
                    show: true,
                    color: "#9070BD"
                  },
                  labels: {
                    style: {
                      colors: "#9070BD"
                    },
                    formatter: (value) => { return '%' + value.toFixed(2) },
                  },
                },
                {
                  seriesName: "Gross percentage",
                  show: false,
                  opposite: true,
                  axisTicks: {
                    show: true
                  },
                  axisBorder: {
                    show: true,
                    color: "#FA8E04"
                  },
                  labels: {
                    style: {
                      colors: "#FA8E04"
                    },
                    formatter: (value) => { return '%' + value.toFixed(2) },
                  },
                }
              ],

              tooltip: {
                fixed: {
                  enabled: true,
                  position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
                  offsetY: 30,
                  offsetX: 60
                }
              },
              legend: {
                horizontalAlign: "left",
                offsetX: 40
              }
            };
            this.spinnerGrossCou = false
            break;
          case 6:
            var country = [];
            var sga = [];
            var lineData = [];
            res.Result.forEach(element => {
              bol = false;
              if (country.length > 0) {
                for (var i = 0; i < country.length; i++) {
                  if (country[i] == element.country) {
                    bol = true;
                  }
                };
                if (bol != true) {
                  country.push(element.country);
                  sga.push(element.SGA);
                  lineData.push(element.PorcSGA * 100);
                }
              } else {
                country.push(element.country);
                sga.push(element.SGA);
                lineData.push(element.PorcSGA * 100);
              }
            });
            this.spinnerSgaCou = false
            break;
          case 7:
            var country = [];
            var depre = [];
            var lineData = [];
            res.Result.forEach(element => {
              bol = false;
              if (country.length > 0) {
                for (var i = 0; i < country.length; i++) {
                  if (country[i] == element.country) {
                    bol = true;
                  }
                };
                if (bol != true) {
                  country.push(element.country);
                  depre.push(element.Depreciation);
                  lineData.push(element.PorcDepreciation * 100);
                }
              } else {
                country.push(element.country);
                depre.push(element.Depreciation);
                lineData.push(element.PorcDepreciation * 100);
              }
            });
            this.spinnerDepreCou = false
            break;
        }

      } else {
        this.error += 1;
        switch (caseType) {
          case 1:
            // this.chartOptionsBar.series = []
            break;
          case 2:
            // this.chartOptionsVariation.series = []
            break;
          case 3:
            // this.tableApArray = [];
            break;
          case 4:
            // this.tableVariArray = [];
            break;
          //   case 5:
          //     break;

          default:
            break;
        }
      }
      // if (caseType == 5) {
      //   if (this.error > 0) {
      //     this.toastr.warning('No Data', 'Wrong');
      //     this.error = 0;
      //   }
      // }
    })
  }

  getCgp(country, region, sub, caseType) {
    this.summaryservice.getCgp(country, region, sub, caseType).then((res: any) => {

      if (res.Result) {
        if (caseType == 5) {
          this.filtersArray = res.Result;
          this.getListFilters();
          this.country = this.summaryservice.getCountry();
          this.region = this.summaryservice.getRegion();
          this.sub = this.summaryservice.getSub();
          var coun = this.country.join(',');
          var reg = this.region.join(',');
          var sub = this.sub.join(',');
          if (!coun) {
            coun = null;
          }
          if (!reg) {
            reg = null;
          }
          if (!sub) {
            sub = null;
          }
          const year = new Date().getFullYear();
          this.getAllData(coun, reg, sub, year, year, 1, 12);
        }
      } else {
        this.error += 1;
      }
      if (caseType == 5) {
        if (this.error > 0) {
          this.toastr.warning('No Data', 'Wrong');
          this.error = 0;
        }
      }
    })
  }

  getAllData(country, region, sub, yearIni, yearFin, monthIni, monthFin) {
    this.getActualCgp(country, region, sub, yearIni, yearFin, monthIni, monthFin, 2);
    this.getActualCgp(country, region, sub, yearIni, yearFin, monthIni, monthFin, 3);
    this.getActualCgp(country, region, sub, yearIni, yearFin, monthIni, monthFin, 4);
    this.getActualCgp(country, region, sub, yearIni, yearFin, monthIni, monthFin, 5);
    // this.getActualCgp(country, region, sub, yearIni, yearFin, monthIni, monthFin, 6);
    // this.getActualCgp(country, region, sub, yearIni, yearFin, monthIni, monthFin, 7);
  }

  getListFilters() {
    var bol: Boolean;
    var bolCam: Boolean;
    var bolCli: Boolean;
    this.filtersArray.forEach(filter => {

      bol = false;
      bolCam = false;
      bolCli = false;
      if (this.sub[0]) {
        if (filter.sub == this.sub) {
          this.fillList(filter, bol, bolCam, bolCli);
        }
      } else if (this.country[0]) {
        if (filter.country == this.country) {
          this.fillList(filter, bol, bolCam, bolCli);
        }
      } else if (this.region[0]) {
        if (filter.region == this.region) {
          this.fillList(filter, bol, bolCam, bolCli);
        }
      } else {
        this.fillList(filter, bol, bolCam, bolCli);
      }

    })
  }

  countryAll(){

  }

  filterSelected(num) {
    this.error = 0;
    var coun = this.country.join(',');
    var reg = this.region.join(',');
    var sub = this.sub.join(',');

    if (!coun) {
      coun = null
    }
    if (!reg) {
      reg = null
    }
    if (!sub) {
      sub = null
    }
    this.getAllData(coun, reg, sub, this.minValue, this.maxValue, this.minValueMonth, this.maxValueMonth);
    this.summaryservice.setCountry(this.country);
    this.summaryservice.setRegion(this.region);
    this.summaryservice.setSub(this.sub);
  }

  fillList(filter, bol, bolCam, bolCli) {
    if (this.subArray.length > 0) {
      this.subArray.forEach(sub => {
        if (sub == filter.sub) {
          bol = true;
        }
      });
      if (bol != true) {
        this.subArray.push(filter.sub);
      }
    } else {
      this.subArray.push(filter.sub);
    }
    if (this.countryArray.length > 0) {
      this.countryArray.forEach(country => {
        if (country == filter.country) {
          bolCam = true;
        }
      });
      if (bolCam != true) {
        this.countryArray.push(filter.country);
      }
    } else {
      this.countryArray.push(filter.country);
    }
    if (this.regionArray.length > 0) {
      this.regionArray.forEach(region => {
        if (region == filter.region) {
          bolCli = true;
        }
      });
      if (bolCli != true) {
        this.regionArray.push(filter.region);
      }
    } else {
      this.regionArray.push(filter.region);
    }
  }

  resetList(num) {
    switch (num) {
      case 1:
        this.subArray = [];
        this.countryArray = [];
        break;
      case 2:
        this.regionArray = [];
        this.subArray = [];
        break;
      case 3:
        this.countryArray = [];
        this.regionArray = [];
        break;
    }

    this.spinnerChart = true;
    this.spinnerDepre = true;
    this.spinnerDepreCou = true;
    this.spinnerGrossCou = true;
    this.spinnerSga = true;
    this.spinnerSgaCou = true;
  }

  selectCountryById(countryName: string) {
    this.countryName = countryName;
    this.titleCountry = countryName;
    if (this.ini > 0) {
      if (countryName == 'Colombia' || countryName == 'Peru' || countryName == 'Guyana') {
        this.country = [];
        this.country.push(countryName);
        this.filterSelected(0);
      }
    } else {
      this.ini++;
    }
  }

  toggleView() {
    this.revealed = !this.revealed;
  }

}
