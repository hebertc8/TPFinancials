import { Component, OnInit, ViewChild } from '@angular/core';
import { RequestsService } from 'src/app/services/requests.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { SummaryService } from 'src/app/services/summary.service';
import { UserCampaign } from 'src/app/services/interfaces';
import { LoginService } from 'src/app/services/login.service';
import { Label, BaseChartDirective } from 'ng2-charts';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { DetailService } from 'src/app/services/detail.service';
import * as XLSX from 'xlsx';
import {
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexChart,
  ApexLegend,
  ApexResponsive,
  ChartComponent,
  ApexAxisChartSeries,
  ApexDataLabels,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexTitleSubtitle
} from "ng-apexcharts";


export type ChartOptionsApex = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive | ApexResponsive[];
};

export type ChartOptionsBar = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  colors: Array<string>;
};

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptionsApex>;
  
  @ViewChild("bar") bar: ChartComponent;
  public chartOptionsBar: Partial<ChartOptionsBar>;

  public tblActXlsx;
  public tblObXlsx;
  public tblRftXlsx;
  options: any;
  public year;
  public month;
  public coin;
  public country = null;
  public market = null;
  public client = null;
  public campaign = null;
  public trmOb;
  public trmAct;
  public stepsize: number = 0;

  public spinnerActual: Boolean = true;
  public spinnerOb: Boolean = true;
  public spinnerRft: Boolean = true;
  public spinnerDetailReve: Boolean = true;
  public spinnerNetReve: Boolean = true;
  public spinnerGM: Boolean = true;
  public spinnerTrm: Boolean = true;
  public spinnerGraphic = true;

  public tableActual: Array<any> = [];
  public tableOb: Array<any> = [];
  public tableRft: Array<any> = [];
  public yearArray: Array<any> = [];
  public monthArray: Array<any> = [];
  public countryArray: Array<any> = [];
  public marketArray: Array<any> = [];
  public clientArray: Array<any> = [];
  public campaignArray: Array<any> = [];
  public dateArray: Array<any> = [];
  public filtersArray: Array<UserCampaign>;
  public labelArrayCon: Array<string> = [];

  private error: number;

  constructor(private requets: RequestsService,
    private toastr: NbToastrService,
    private dialog: NbDialogService,
    private summaryservice: SummaryService,
    private login: LoginService,
    private detailservice: DetailService) {
    this.filtersArray = this.login.getUserCampaing();
    this.month = detailservice.getMonth();
    this.year = detailservice.getYear();
    this.country = detailservice.getCountry();
    this.market = detailservice.getMarket();
    this.client = detailservice.getClient();
    this.campaign = detailservice.getCampaing();
    if (this.month == null) {
      this.getMonth();
    }
    if (this.year == null) {
      this.year = new Date().getFullYear();
    }
    this.getAllData(this.year, this.month, this.country, this.market, this.campaign, this.client);
    this.getDetailCost(this.market, this.campaign, this.client, 2);
    this.getListFilters();
    this.getListDate(login.getUser().username, 2);
    this.getCoin();
    this.chartOptions = {
      series: [],
      chart: {
        height: 300,
        type: "radialBar"
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: "30%",
            background: "transparent",
            image: undefined
          },
          dataLabels: {
            name: {
              show: false
            },
            value: {
              show: false
            }
          }
        }
      },
      colors: ['#5AA454', '#E44D25'],
      labels: ["%GM ACT", "%GM RFT"],
      legend: {
        show: true,
        floating: true,
        fontSize: "16px",
        position: "left",
        offsetX: 50,
        offsetY: 10,
        labels: {
          useSeriesColors: true
        },
        formatter: function (seriesName, opts) {
          return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex] + "%";
        },
        itemMargin: {
          horizontal: 3
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false
            }
          }
        }
      ]
    };

    this.chartOptionsBar = {
      colors: ["#338C85", "#9070BD", "#FA8E04"],
      series: [
        {
          name: "Actual",
          data: []
        },
        {
          name: "OB",

          data: []
        },
        {
          name: "RFT",

          data: []
        }
      ],
      chart: {
        type: "bar",
        height: 430
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            position: "top"
          }
        }
      },
      dataLabels: {
        enabled: false,

        style: {
          fontSize: "12px",
          colors: ["#fff"]
        }
      },
      stroke: {
        show: true,
        width: 1,
        colors: ["#fff"]
      },
      xaxis: {
        categories: []
      },
      yaxis: {
        labels: {
          formatter: (value) => { return value.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
        }
      },
      title: {
        text: "CPH & RPH EUR",
        align: "left"
      },
    };
  }

  getMonth() {
    this.detailservice.getDetailCost(this.market, this.campaign, this.client, 6).then((res: any) => {
      this.month = res.Result[0].Month;
    });
  }

  getCoin() {
    this.detailservice.getDetailCost(this.market, this.campaign, this.client, 7).then((res: any) => {
      this.coin = res.Result[0].Moneda;
    });
  }

  getListDate(user, caseType) {
    this.login.userCampaing(user, caseType).subscribe((res: any) => {
      var bol: Boolean;
      var bolDos: Boolean;
      res.Result.forEach(data => {
        bol = false;
        bolDos = false;
        if (this.dateArray.length > 0) {
          for (var i = 0; i < this.dateArray.length; i++) {
            if (this.dateArray[i].year === data.year) {
              bol = true;
              this.dateArray[i].months.forEach(element => {
                if (element === data.monthname) {
                  bolDos = true
                }
              });
              if (!bolDos) {
                this.dateArray[i].months.push(data.monthname)
              }
            }
          };
          if (!bol) {
            this.dateArray.push({ year: data.year, months: [data.monthname] });
          }
        } else {
          this.dateArray.push({ year: data.year, months: [data.monthname] });
        }
      });
      this.dateArray.forEach(date => {
        this.yearArray.push(date.year);
        if (this.year === date.year) {
          date.months.forEach(month => {
            this.monthArray.push(month.trim());
          });
        }
      });
    });
  }

  getSummary(year, month, country, market, campaign, client, caseType) {
    this.summaryservice.getSummary(year, month, country, market, campaign, client, caseType).then((res: any) => {
      if (Object.keys(res.Result[0]).length !== 0) {
        if (caseType == 2) {
          this.tblActXlsx = [res.Result[0]];
          this.tableActual.push({ indicator: 'Net Revenue', valor: res.Result[0].NetRevenue });
          this.tableActual.push({ indicator: 'Direct Cost', valor: res.Result[0].DirectCost });
          this.tableActual.push({ indicator: 'GM', valor: res.Result[0].GM });
          this.tableActual.push({ indicator: '%GM', valor: res.Result[0].PORGM });
          this.spinnerActual = false;
        } else if (caseType == 3) {
          this.tblObXlsx = [res.Result[0]];
          this.tableOb.push({ indicator: 'Net Revenue', valor: res.Result[0].NetRevenueOB });
          this.tableOb.push({ indicator: 'Direct Cost', valor: res.Result[0].DirectCostOB });
          this.tableOb.push({ indicator: 'GM', valor: res.Result[0].GMOB });
          this.tableOb.push({ indicator: '%GM', valor: res.Result[0].PORGMOB });
          this.spinnerOb = false;
        } else if (caseType == 4) {
          this.tblRftXlsx = [res.Result[0]];
          this.tableRft.push({ indicator: 'Net Revenue', valor: res.Result[0].NetRevenueRFT });
          this.tableRft.push({ indicator: 'Direct Cost', valor: res.Result[0].DirectCostRFT });
          this.tableRft.push({ indicator: 'GM', valor: res.Result[0].GMRFT });
          this.tableRft.push({ indicator: '%GM', valor: res.Result[0].PORGMRFT });
          this.spinnerRft = false;
        } else if (caseType == 5) {
          this.chartOptions = {
            series: [res.Result[0].PORGM, res.Result[0].PORGMRFT],
            chart: {
              height: 300,
              type: "radialBar"
            },
            plotOptions: {
              radialBar: {
                offsetY: -20,
                // offsetX: 12,
                startAngle: 0,
                endAngle: 270,
                hollow: {
                  margin: 5,
                  size: "30%",
                  background: "transparent",
                  image: undefined
                },
                dataLabels: {
                  name: {
                    show: false
                  },
                  value: {
                    show: false
                  }
                }
              }
            },
            colors: ['#338C85', '#9070BD'],
            labels: ["%GM ACT", "%GM RFT"],
            legend: {
              show: true,
              floating: true,
              fontSize: "16px",
              position: "left",
              // offsetX: 50,
              // offsetY: 10,
              labels: {
                useSeriesColors: true
              },
              formatter: function (seriesName, opts) {
                return seriesName + ":  " + parseFloat(opts.w.globals.series[opts.seriesIndex]).toFixed(2) + "%";
              },
              itemMargin: {
                horizontal: 3
              }
            },
            responsive: [
              {
                breakpoint: 407,
                options: {
                  legend: {
                    show: false,
                  },
                  plotOptions: {
                    radialBar: {
                      dataLabels: {
                        name: {
                          show: true
                        },
                        value: {
                          show: true
                        }
                      }
                    }
                  }
                },

              }
            ]
          };
          this.spinnerRft = false;
          // } else if (caseType == 6) {
          //   this.labelArray.push('Value');
          //   this.barChartData[0].data.push(res.Result[0].NetRevenue);
          //   this.barChartData[1].data.push(res.Result[0].DirectCost);
          //   this.barChartData[2].data.push(res.Result[0].NetRevenueOB);
          //   this.barChartData[3].data.push(res.Result[0].DirectCostOB);
          //   this.barChartData[4].data.push(res.Result[0].NetRevenueRFT);
          //   this.barChartData[5].data.push(res.Result[0].DirectCostRFT);
          //   const aux = Math.max.apply(null, this.barChartData[0].data);
          //   const aux2 = Math.max.apply(null, this.barChartData[1].data);
          //   const aux3 = Math.max.apply(null, this.barChartData[2].data);
          //   const aux4 = Math.max.apply(null, this.barChartData[3].data);
          //   const aux5 = Math.max.apply(null, this.barChartData[4].data);
          //   const aux6 = Math.max.apply(null, this.barChartData[5].data);
          //   var stepsize = (Math.max(aux, aux2, aux3, aux4, aux5, aux6) / 4);
          //   stepsize = Math.round(stepsize);
          //   this.barChartOptions = {
          //     responsive: true,
          //     maintainAspectRatio: false,
          //     // We use these empty structures as placeholders for dynamic theming.
          //     scales: {
          //       xAxes: [{}], yAxes: [{
          //         ticks: {
          //           stepSize: stepsize,
          //           callback: function (value, index, values) {
          //             return value.toLocaleString("en-US", { style: "currency", currency: "USD" })
          //           },
          //         }
          //       }]
          //     },

          //     plugins: {
          //       datalabels: {
          //         anchor: 'end',
          //         align: 'end',
          //       }
          //     },
          //   };
          //   this.spinnerDetailReve = false;
          // } else if (caseType == 7) {
          // this.labelArrayHor.push('Value');
          // this.barChartDataHor[0].data.push(res.Result[0].NetRevenueRFT);
          // this.barChartDataHor[1].data.push(res.Result[0].NetRevenueOB);
          // this.barChartDataHor[2].data.push(res.Result[0].NetRevenue);
          // const aux = Math.max.apply(null, this.barChartDataHor[0].data);
          // const aux2 = Math.max.apply(null, this.barChartDataHor[1].data);
          // const aux3 = Math.max.apply(null, this.barChartDataHor[2].data);
          // var stepsize = (Math.max(aux, aux2, aux3) / 4);
          // stepsize = Math.round(stepsize);
          // this.barChartOptionsHor = {
          //   responsive: true,
          //   maintainAspectRatio: false,
          //   // We use these empty structures as placeholders for dynamic theming.
          //   scales: {
          //     xAxes: [{
          //       ticks: {
          //         stepSize: stepsize,
          //         callback: function (value, index, values) {
          //           return value.toLocaleString("en-US", { style: "currency", currency: "USD" })
          //         },
          //       }
          //     }], yAxes: [{

          //     }]
          //   },

          //   plugins: {
          //     datalabels: {
          //       anchor: 'end',
          //       align: 'end',
          //     }
          //   },
          // };
          // this.spinnerNetReve = false;
        } else if (caseType == 8) {
          this.trmOb = res.Result[0].TRM;
          this.trmAct = res.Result[0].TRMActual;
          this.spinnerTrm = false;
        }
      } else {
        this.error += 1;
        switch (caseType) {
          case 2:
            // this.tableActual = ['No data'];
            break;
          case 3:
            // this.tableOb = ['No data'];
            break;
          case 4:
            // this.tableRft = ['No data'];
            break;
          case 5:
            break;
          case 6:
            // this.barChartLabels = ['No data'];
            break;
          case 7:
            // this.barChartLabelsHor = ['No data'];
            break;
          case 8:
            this.trmOb = 0;
            this.trmAct = 0;
            break;
          default:
            break;
        }
      }
      if (caseType == 8) {
        if (this.error > 0) {
          this.toastr.warning('No Data', 'Wrong');
          this.error = 0;
        }
      }
    })
  }

  getDetailCost(market, campaign, client, caseType) {

    this.detailservice.getDetailCost(market, campaign, client, caseType).then((res: any) => {
      var bol: Boolean;
      if (res.Result) {
        if (caseType == 2) {
          var actualArray = [];
          var obArray = [];
          var rftArray = [];
          res.Result.forEach(detail => {
            bol = false;
            if (this.labelArrayCon.length > 0) {
              this.labelArrayCon.forEach(label => {
                if (label == detail.Concepto) {
                  bol = true;
                }
              });
              if (bol != true) {
                this.labelArrayCon.push(detail.Concepto)
              }
            } else {
              this.labelArrayCon.push(detail.Concepto)
            }
            switch (detail.Indicador2) {
              case 'Actual':
                actualArray.push(detail.Valor);
                break;
              case 'OB':
                obArray.push(detail.Valor);
                break;
              case 'RFT':
                rftArray.push(detail.Valor);
                break;
            }

          });
          
          this.chartOptionsBar = {
            colors: ["#338C85", "#9070BD", "#FA8E04"],
            series: [
              {
                name: "Actual",
                data: actualArray
              },
              {
                name: "OB",

                data: obArray
              },
              {
                name: "RFT",

                data: rftArray
              }
            ],
            chart: {
              type: "bar",
              height: 430
            },
            plotOptions: {
              bar: {
                horizontal: false,
                dataLabels: {
                  position: "top"
                }
              }
            },
            dataLabels: {
              enabled: false,

              style: {
                fontSize: "12px",
                colors: ["#fff"]
              }
            },
            stroke: {
              show: true,
              width: 1,
              colors: ["#fff"]
            },
            xaxis: {
              categories: this.labelArrayCon,
            },
            yaxis: {
              labels: {
                formatter: (value) => { return value.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
              }
            },
            title: {
              text: "CPH & RPH",
              align: "left"
            },
          };
         
          this.spinnerGraphic = false;
        }
      }
    })
  }
  ngOnInit(): void {

  }

  ngOnDestroy() {
  }
  getAllData(year, month, country, market, campaign, client) {
    this.getSummary(year, month, country, market, campaign, client, 2);
    this.getSummary(year, month, country, market, campaign, client, 3);
    this.getSummary(year, month, country, market, campaign, client, 4);
    this.getSummary(year, month, country, market, campaign, client, 5);
    // this.getSummary(year, month, country, market, campaign, client, 6);
    // this.getSummary(year, month, country, market, campaign, client, 7);
    this.getSummary(year, month, country, market, campaign, client, 8);
  }

  getListFilters() {
    var bol: Boolean;
    var bolCam: Boolean;
    var bolCli: Boolean;
    var bolMar: Boolean;
    this.filtersArray.forEach(filter => {
      bol = false;
      bolCam = false;
      bolCli = false;
      bolMar = false;
      if (this.campaign) {
        if (filter.Campaign == this.campaign) {
          this.fillList(filter, bol, bolCam, bolCli, bolMar);
        }
      } else if (this.client) {
        if (filter.Client == this.client) {
          this.fillList(filter, bol, bolCam, bolCli, bolMar);
        }
      } else if (this.market) {
        if (filter.Market == this.market) {
          this.fillList(filter, bol, bolCam, bolCli, bolMar);
        }
      } else if (this.country) {
        if (filter.Country == this.country) {
          this.fillList(filter, bol, bolCam, bolCli, bolMar);
        }
      } else {
        this.fillList(filter, bol, bolCam, bolCli, bolMar);
      }

    })
  }

  filterSelected(event, num) {
    this.error = 0;
    this.resetList(num);
    this.getCoin();
    this.getAllData(this.year, this.month, this.country, this.market, this.campaign, this.client);
    if (num === 1 || num === 2 || num === 3) {
      this.getDetailCost(this.market, this.campaign, this.client, 2);
    }
    this.getListFilters();
    this.detailservice.setYear(this.year);
    this.detailservice.setMonth(this.month);
    this.detailservice.setCountry(this.country);
    this.detailservice.setMarket(this.market);
    this.detailservice.setCampaing(this.campaign);
    this.detailservice.setClient(this.client);
  }

  filterDateSelected(event) {
    this.monthArray = [];
    this.dateArray.forEach(date => {
      if (this.year === date.year) {
        date.months.forEach(month => {
          this.monthArray.push(month.trim());
        });
      }
    });
    this.filterSelected(event, 0);
  }

  fillList(filter, bol, bolCam, bolCli, bolMar) {
    if (this.countryArray.length > 0) {
      this.countryArray.forEach(coun => {
        if (coun == filter.Country) {
          bol = true;
        }
      });
      if (bol != true) {
        this.countryArray.push(filter.Country);
      }
    } else {
      this.countryArray.push(filter.Country);
    }
    if (this.marketArray.length > 0) {
      this.marketArray.forEach(mark => {
        if (mark == filter.Market) {
          bolMar = true;
        }
      });
      if (bolMar != true) {
        this.marketArray.push(filter.Market);
      }
    } else {
      this.marketArray.push(filter.Market);
    }
    if (this.campaignArray.length > 0) {
      this.campaignArray.forEach(campa => {
        if (campa == filter.Campaign) {
          bolCam = true;
        }
      });
      if (bolCam != true) {
        this.campaignArray.push(filter.Campaign);
      }
    } else {
      this.campaignArray.push(filter.Campaign);
    }
    if (this.clientArray.length > 0) {
      this.clientArray.forEach(cli => {
        if (cli == filter.Client) {
          bolCli = true;
        }
      });
      if (bolCli != true) {
        this.clientArray.push(filter.Client);
      }
    } else {
      this.clientArray.push(filter.Client);
    }
  }

  resetList(num) {
    switch (num) {
      case 1:
        this.clientArray = [];
        this.campaignArray = [];
        this.countryArray = [];
        break;
      case 2:
        this.marketArray = [];
        this.campaignArray = [];
        this.countryArray = [];
        break;
      case 3:
        this.clientArray = [];
        this.marketArray = [];
        this.countryArray = [];
        break;
      case 4:
        this.clientArray = [];
        this.marketArray = [];
        this.campaignArray = [];
        break;
      default:
        break;
    }
    // this.labelArray = [];
    // this.labelArrayHor = [];
    this.tableActual = [];
    this.tableOb = [];
    this.tableRft = [];
    // this.barChartData[3].data = [];
    // this.barChartData[4].data = [];
    // this.barChartData[5].data = [];
    // this.barChartDataHor[0].data = [];
    // this.barChartDataHor[1].data = [];
    // this.barChartDataHor[2].data = [];
  }

  generateXlxs(num) {
    switch (num) {
      case 1:
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tblActXlsx);
        console.log('worksheet', ws);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'SummaryActual');

        /* save to file */
        XLSX.writeFile(wb, 'SummaryActual.xlsx');
        break;
      case 2:
        const wsOb: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tblObXlsx);
        console.log('worksheet', wsOb);
        /* generate workbook and add the worksheet */
        const wbOb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wbOb, wsOb, 'SummaryOb');

        /* save to file */
        XLSX.writeFile(wbOb, 'SummaryOb.xlsx');
        break;
      case 3:
        const wsRft: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tblRftXlsx);
        console.log('worksheet', wsRft);
        /* generate workbook and add the worksheet */
        const wbRft: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wbRft, wsRft, 'SummaryRft');

        /* save to file */
        XLSX.writeFile(wbRft, 'SummaryRft.xlsx');
        break;
    }

  }
}
