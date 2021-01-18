import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { DetailService } from 'src/app/services/detail.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { NbToastrService, NbThemeService, NbSearchService, NbWindowService } from '@nebular/theme';
import { LoginService } from 'src/app/services/login.service';
import { UserCampaign, TableCost, ObjSelect, ObjReport } from 'src/app/services/interfaces';
import {obsselectHeader} from 'src/app/services/obs-select-header';
import { obsselect } from 'src/app/services/obs-select';
import { error } from 'protractor';
import { DecimalPipe } from '@angular/common';
import { graphic } from 'echarts';
import * as XLSX from 'xlsx';
import * as $ from 'jquery';
import { Subscription } from 'rxjs';
import { ReportIncidentComponent } from '../report-incident/report-incident.component';
import { obsReport } from 'src/app/services/obs-report';


@Component({
  selector: 'app-detail-revenue',
  templateUrl: './detail-revenue.component.html',
  styleUrls: ['./detail-revenue.component.scss']
})
export class DetailRevenueComponent implements OnInit, AfterViewInit,OnDestroy {

  public market = null;
  public client = null;
  public campaign = null;
  public month;
  public coin;
  public trmAct: number;
  public trmOb: number;
  public totalValue: number = 0;
  public themeAc = 'light';
  private error: number = 0;
  public obsSel: ObjSelect;
  public windowRef: any;
  public objReport: ObjReport;
  public suscripcionTres: Subscription;
  flipped = false;

  public tblRevenueXlsx;
  public tblVolumeXlsx;

  public spinnerCoin: Boolean = true;
  public spinnerConcep: Boolean = true;
  public spinnerTable: Boolean = true;
  public spinnerText: Boolean = true;
  public spinnerVol: Boolean = true;
  public Listflipped:boolean=false;
  public ListflippedTow:boolean=true;
  public showVisitorsStatistics = false;
  
  public marketArray: Array<any> = [];
  public clientArray: Array<any> = [];
  public campaignArray: Array<any> = [];

  public tableDataRevenue: Array<any> = [];
  public tableDataVolume: Array<any> = [];
  public backupDataRev: Array<any> = [];
  public backupDataVol: Array<any> = [];
  public labelArray: Array<string> = [];
  public labelArrayCon: Array<string> = [];
  public labelArrayVol: Array<string> = [];
  public filtersArray: Array<UserCampaign>;

  public barChartLabelsHor: Label[] = this.labelArray;
  public barChartTypeHor: ChartType = 'horizontalBar';

  public barChartOptions: ChartOptions = {};
  public barChartOptionsHor: ChartOptions = {};
  public barChartOptionsVol: ChartOptions = {};
  public e: number = 1;
  public p: number = 1;
  public optionsWrapperGraph: any;
  


  public barChartDataHor: ChartDataSets[] = [
    {
      data: [], label: 'Valor',
      backgroundColor: '#00ffaf',
      hoverBackgroundColor: '#00ffaf',
      borderColor: '#00ffaf'
    }
  ];

  public barChartLabels: Label[] = this.labelArrayCon;
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public themeWrapper: any;

  public barChartData: ChartDataSets[] = [
    {
      data: [], label: 'Actual',

      barThickness: 12,
      maxBarThickness: 50,
      // minBarLength: 2, 
      backgroundColor: '#338C85',
      hoverBackgroundColor: '#338C85',
      borderColor: '#338C85',

    },
    {
      data: [], label: 'OB',

      barThickness: 12,
      maxBarThickness: 50,
      // minBarLength: 2, 
      backgroundColor: '#9070BD',
      hoverBackgroundColor: '#9070BD',
      borderColor: '#9070BD'
    },
    {
      data: [], label: 'RFT',

      barThickness: 12,
      maxBarThickness: 50,
      // minBarLength: 2,
      backgroundColor: '#FA8E04',
      hoverBackgroundColor: '#FA8E04',
      borderColor: '#FA8E04'
    }
  ];

  public barChartLabelsVol: Label[] = this.labelArrayVol;

  public barChartDataVol: ChartDataSets[] = [
    {
      data: [], label: 'Actual',

      barThickness: 12,
      maxBarThickness: 50,
      // minBarLength: 2,
      backgroundColor: '#338C85',
      hoverBackgroundColor: '#338C85',
      borderColor: '#338C85'
    },
    {
      data: [], label: 'OB',
      barThickness: 12,
      maxBarThickness: 50,
      // minBarLength: 2,
      backgroundColor: '#9070BD',
      hoverBackgroundColor: '#9070BD',
      borderColor: '#9070BD'
    },
    {
      data: [], label: 'RFT',
      barThickness: 12,
      maxBarThickness: 50,
      // minBarLength: 2,
      backgroundColor: '#FA8E04',
      hoverBackgroundColor: '#FA8E04',
      borderColor: '#FA8E04'
    }
  ];

  constructor(private revenueService: DetailService,
    private toastr: NbToastrService,
    private login: LoginService, private pipeNum: DecimalPipe,
    private theme: NbThemeService,
    private searchService: NbSearchService,
    private obsSelect: obsselect,
    private obsselectHeader: obsselectHeader,
    private windowService: NbWindowService,
    private obsreport: obsReport) {
    this.objReport = {component:null, campaing:null};
    this.obsSel={type:null,market:"",campaign:"",client:"",year:"",month:""};
    this.filtersArray = this.login.getUserCampaing();
    this.getListFilters();
    this.revenueService.setYear(null);
    this.revenueService.setMonth(null);
    this.revenueService.setCountry(null);
    this.market = revenueService.getMarket();
    this.client = revenueService.getClient();
    this.campaign = revenueService.getCampaing();
    if (this.client != null) {
      this.filterSelected(null, 2);
    } else if (this.campaign != null) {
      this.filterSelected(null, 3);
    } else if (this.market != null) {
      this.filterSelected(null, 1);
    } else {
      this.getAllData(this.market, this.campaign, this.client, true);
    }

    this.searchService.onSearchSubmit()
      .subscribe((data: any) => {
        let provisional:any[]=[];
        let provisionalVo:any[]=[];
        this.backupDataRev.forEach(elemento=>{
          if(elemento.indicator===data.term){
            provisional.push(elemento);
          }
        });
        this.tableDataRevenue=provisional;
        this.backupDataVol.forEach(elemento=>{
          if(elemento.indicator===data.term.toString()){
            provisionalVo.push(elemento);
          }
        });
        this.tableDataVolume=provisionalVo;
        this.Listflipped=true;
        document.getElementById("scrollTabla").scrollIntoView({behavior:'smooth',block:'center'});
      })
      
  }

  ngOnInit(): void {
    this.suscripcionTres = this.obsselectHeader.datos$.subscribe(datos => {
      this.campaign=datos.campaign;
      this.client=datos.client;
      this.market=datos.market;
      this.filterSelected(event, datos.type);
    });
  }

  ngOnDestroy() {
    this.suscripcionTres.unsubscribe();
  }

  ngAfterViewInit() {
    this.theme.getJsTheme()
      .subscribe(config => {
        var hor = this.barChartOptionsHor;
        var aux = this.barChartOptions;
        var vol = this.barChartOptionsVol;
        this.themeWrapper = config.variables.countryOrders;
        const themeWrapper = config.variables.countryOrders;
        this.setOptions(themeWrapper);
        this.themeAc = config.name;
        if (Object.keys(hor).length !== 0) {
          if (config.name != 'dark') {
            this.themeAc = 'light';
            $('#tablaCon').css('color', '#000000');
            $('#tablaVol').css('color', '#000000');
            this.barChartOptionsHor = {
              responsive: true,
              maintainAspectRatio: false,
              // We use these empty structures as placeholders for dynamic theming.
              scales: {
                xAxes: [{
                  gridLines: {
                    color: '#000000',
                  },
                  ticks: {
                    fontColor: '#000000',
                    stepSize: hor.scales.xAxes[0].ticks.stepSize,
                    callback: function (value, index, values) {
                      return value.toLocaleString("en-US", { style: "currency", currency: "USD" })
                    },
                  }
                }], yAxes: [{
                  ticks: {
                    fontColor: '#000000',
                  }
                }]
              },

              plugins: {
                datalabels: {
                  anchor: 'end',
                  align: 'end',

                }
              },
            };
            // this.barChartOptions = {
            //   responsive: true,
            //   maintainAspectRatio: false,
            //   // We use these empty structures as placeholders for dynamic theming.
            //   scales: {
            //     xAxes: [{
            //       ticks: {
            //         fontColor: '#000000',
            //       }
            //     }], yAxes: [{
            //       gridLines: {
            //         color: '#000000',
            //       },
            //       ticks: {
            //         fontColor: '#000000',
            //         stepSize: aux.scales.yAxes[0].ticks.stepSize,
            //         callback: function (value, index, values) {
            //           return value.toLocaleString("en-US", { style: "currency", currency: "USD" })
            //         },
            //       }
            //     }]
            //   },

            //   plugins: {
            //     datalabels: {
            //       anchor: 'end',
            //       align: 'end',
            //     }
            //   },
            // };
            // this.barChartOptionsVol = {
            //   responsive: true,
            //   maintainAspectRatio: false,
            //   // We use these empty structures as placeholders for dynamic theming.
            //   scales: {
            //     xAxes: [{
            //       ticks: {
            //         fontColor: '#000000',
            //       }

            //     }], yAxes: [{
            //       gridLines: {
            //         color: '#000000',
            //       },
            //       ticks: {
            //         fontColor: '#000000',
            //         stepSize: vol.scales.yAxes[0].ticks.stepSize,
            //         callback: function (value, index, values) {
            //           return value.toLocaleString();
            //         },
            //       }
            //     }]
            //   },

            //   plugins: {
            //     datalabels: {
            //       anchor: 'end',
            //       align: 'end',
            //     }
            //   },
            // };
          } else {
            this.themeAc = config.name;

            $('#tablaCon').css('color', '#ffffff');
            $('#tablaVol').css('color', '#ffffff');
            this.barChartOptionsHor = {
              responsive: true,
              maintainAspectRatio: false,
              // We use these empty structures as placeholders for dynamic theming.
              scales: {
                xAxes: [{
                  gridLines: {
                    color: '#ffffff',
                  },
                  ticks: {
                    fontColor: '#ffffff',
                    stepSize: hor.scales.xAxes[0].ticks.stepSize,
                    callback: function (value, index, values) {
                      return value.toLocaleString("en-US", { style: "currency", currency: "USD" })
                    },
                  }
                }], yAxes: [{
                  ticks: {
                    fontColor: '#ffffff',
                  }
                }]
              },

              plugins: {
                datalabels: {
                  anchor: 'end',
                  align: 'end',

                }
              },
            };
            // this.barChartOptions = {
            //   responsive: true,
            //   maintainAspectRatio: false,
            //   // We use these empty structures as placeholders for dynamic theming.
            //   scales: {
            //     xAxes: [{
            //       ticks: {
            //         fontColor: '#ffffff',
            //       }
            //     }], yAxes: [{
            //       gridLines: {
            //         color: '#ffffff',
            //       },
            //       ticks: {
            //         fontColor: '#ffffff',
            //         stepSize: aux.scales.yAxes[0].ticks.stepSize,
            //         callback: function (value, index, values) {
            //           return value.toLocaleString("en-US", { style: "currency", currency: "USD" })
            //         },
            //       }
            //     }]
            //   },

            //   plugins: {
            //     datalabels: {
            //       anchor: 'end',
            //       align: 'end',
            //     }
            //   },
            // };
            // this.barChartOptionsVol = {
            //   responsive: true,
            //   maintainAspectRatio: false,
            //   // We use these empty structures as placeholders for dynamic theming.
            //   scales: {
            //     xAxes: [{
            //       ticks: {
            //         fontColor: '#ffffff',
            //       }

            //     }], yAxes: [{
            //       gridLines: {
            //         color: '#ffffff',
            //       },
            //       ticks: {
            //         fontColor: '#ffffff',
            //         stepSize: vol.scales.yAxes[0].ticks.stepSize,
            //         callback: function (value, index, values) {
            //           return value.toLocaleString();
            //         },
            //       }
            //     }]
            //   },

            //   plugins: {
            //     datalabels: {
            //       anchor: 'end',
            //       align: 'end',
            //     }
            //   },
            // };
          }
        }

      });
  }

  setOptions(eTheme){
    this.optionsWrapperGraph = Object.assign({}, {
      grid: {
        left: '3%',
        right: '3%',
        bottom: '3%',
        top: '3%',
        containLabel: true,
      },
      xAxis: {
        axisLabel: {
          color: eTheme.chartAxisTextColor,
          fontSize: eTheme.chartAxisFontSize,
          rotate: 45
        },
        axisLine: {
          lineStyle: {
            color: eTheme.chartAxisLineColor,
            width: '2',
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: eTheme.chartAxisSplitLine,
            width: '1',
          },
        },
      },
      yAxis: {
        data: this.labelArray,
        axisLabel: {
          color: eTheme.chartAxisTextColor,
          fontSize: eTheme.chartAxisFontSize,
        },
        axisLine: {
          lineStyle: {
            color: eTheme.chartAxisLineColor,
            width: '2',
          },
        },
        axisTick: {
          show: false,
        },
      },
      series: [
        { // For shadow
          type: 'bar',
          data: this.barChartDataHor[0].data,
          cursor: 'default',
          itemStyle: {
            normal: {
              color: eTheme.chartInnerLineColor,
            },
            opacity: 1,
          },
          barWidth: '40%',
          barGap: '-100%',
          barCategoryGap: '30%',
          animation: false,
          z: 1,
        },
        { // For bottom line
          type: 'bar',
          data: this.barChartDataHor[0].data,
          cursor: 'default',
          itemStyle: {
            normal: {
              color: eTheme.chartLineBottomShadowColor,
            },
            opacity: 1,
          },
          barWidth: '40%',
          barGap: '-100%',
          barCategoryGap: '30%',
          z: 2,
        },
        {
          type: 'bar',
          barWidth: '35%',
          data: this.barChartDataHor[0].data,
          cursor: 'default',
          itemStyle: {
            normal: {
              color: new graphic.LinearGradient(1, 0, 0, 0, [{
                offset: 0,
                color: eTheme.chartGradientFrom,
              }, {
                offset: 1,
                color: eTheme.chartGradientTo,
              }]),
            },
          },
          z: 3,
        },
      ],
    });
  }

  cleanFilter() {
    // this.barChartDataHor[0].data=[];
    this.getAllData(this.market, this.campaign, this.client, false);
  }

  getDetailRevenue(market, campaign, client, caseType) {
    this.revenueService.getDetailRevenue(market, campaign, client, caseType).then((res: any) => {

      var bol: Boolean;
      if (Object.keys(res.Result[0]).length !== 0) {
        if (caseType == 2) {
          res.Result.forEach(detail => {
            this.labelArray.push(detail.Indicador2);
            this.barChartDataHor[0].data.push(detail.Valor);
          });
          this.setOptions(this.themeWrapper);
          console.log(this.barChartDataHor);
          const aux = Math.max.apply(null, this.barChartDataHor[0].data);
          var stepsize = (aux / 4);
          stepsize = Math.round(stepsize);
          this.barChartOptionsHor = {
            responsive: true,
            maintainAspectRatio: false,
            // We use these empty structures as placeholders for dynamic theming.
            scales: {
              xAxes: [{
                gridLines: {
                  color: this.themeAc === 'dark' ? '#ffffff' : '#000000',
                },
                ticks: {
                  fontColor: this.themeAc === 'dark' ? '#ffffff' : '#000000',
                  stepSize: stepsize,
                  callback: function (value, index, values) {
                    return value.toLocaleString("en-US", { style: "currency", currency: "USD" })
                  },
                }
              }], yAxes: [{
                ticks: {
                  fontColor: this.themeAc === 'dark' ? '#ffffff' : '#000000',
                }
              }]
            },

            plugins: {
              datalabels: {
                anchor: 'end',
                align: 'end',

              }
            },
          };
          this.barChartLabelsHor = this.labelArray;
          this.spinnerTable = false;
        } else if (caseType == 3) {
          console.log(res.Result);
          res.Result.forEach(detail => {
            bol = false;
            if (this.tableDataRevenue.length > 0) {
              for (var i = 0; i < this.tableDataRevenue.length; i++) {
                if (this.tableDataRevenue[i].indicator == detail.Concepto) {
                  bol = true;
                  switch (detail.Indicador2) {
                    case 'Actual':
                      this.tableDataRevenue[i].actual = detail.Valor;
                      break;
                    case 'OB':
                      this.tableDataRevenue[i].ob = detail.Valor;
                      break;
                    case 'RFT':
                      this.tableDataRevenue[i].rft = detail.Valor;
                      break;
                  }
                }
              }

              if (bol != true) {
                switch (detail.Indicador2) {
                  case 'Actual':
                    this.tableDataRevenue.push({ indicator: detail.Concepto, actual: detail.Valor, ob: 0, rft: 0 });
                    break;
                  case 'OB':
                    this.tableDataRevenue.push({ indicator: detail.Concepto, actual: 0, ob: detail.Valor, rft: 0 });
                    break;
                  case 'RFT':
                    this.tableDataRevenue.push({ indicator: detail.Concepto, actual: 0, ob: 0, rft: detail.Valor });
                    break;
                }
              }

            } else {
              switch (detail.Indicador2) {
                case 'Actual':
                  this.tableDataRevenue.push({ indicator: detail.Concepto, actual: detail.Valor, ob: 0, rft: 0 });
                  break;
                case 'OB':
                  this.tableDataRevenue.push({ indicator: detail.Concepto, actual: 0, ob: detail.Valor, rft: 0 });
                  break;
                case 'RFT':
                  this.tableDataRevenue.push({ indicator: detail.Concepto, actual: 0, ob: 0, rft: detail.Valor });
                  break;
              }
            }
          });
          this.backupDataRev=this.tableDataRevenue;
          if (this.themeAc != 'dark') {
            $('#tablaCon').css('color', '#000000');
          } else {
            $('#tablaCon').css('color', '#ffffff');
          }
          this.tblRevenueXlsx = this.tableDataRevenue;
          // const aux = Math.max.apply(null, this.barChartData[0].data);
          // const aux2 = Math.max.apply(null, this.barChartData[1].data);
          // const aux3 = Math.max.apply(null, this.barChartData[2].data);
          // var stepsize = (Math.max(aux, aux2, aux3) / 4);
          // stepsize = Math.round(stepsize);
          // this.barChartOptions = {
          //   responsive: true,
          //   maintainAspectRatio: false,
          //   // We use these empty structures as placeholders for dynamic theming.
          //   scales: {
          //     xAxes: [{
          //       ticks: {
          //         fontColor: this.themeAc === 'dark' ? '#ffffff' : '#000000',
          //       }
          //     }], yAxes: [{
          //       gridLines: {
          //         color: this.themeAc === 'dark' ? '#ffffff' : '#000000',
          //       },
          //       ticks: {
          //         fontColor: this.themeAc === 'dark' ? '#ffffff' : '#000000',
          //         stepSize: stepsize,
          //         callback: function (value, index, values) {
          //           return value.toLocaleString("en-US", { style: "currency", currency: "USD" })
          //         },
          //       }
          //     }]
          //   },

          //   plugins: {
          //     datalabels: {
          //       anchor: 'end',
          //       align: 'end',
          //     }
          //   },
          // };
          // this.barChartLabels = this.labelArrayCon;
          this.spinnerConcep = false;
        } else if (caseType == 4) {
          res.Result.forEach(detail => {
            bol = false;
            if (this.tableDataVolume.length > 0) {
              for (var i = 0; i < this.tableDataVolume.length; i++) {

                if (this.tableDataVolume[i].indicator == detail.Concepto) {
                  bol = true;
                  switch (detail.Indicador2) {
                    case 'Actual':
                      this.tableDataVolume[i].actual = detail.Valor;
                      break;
                    case 'OB':
                      this.tableDataVolume[i].ob = detail.Valor;
                      break;
                    case 'RFT':
                      this.tableDataVolume[i].rft = detail.Valor;
                      break;
                  }
                }
              }

              if (bol != true) {
                switch (detail.Indicador2) {
                  case 'Actual':
                    this.tableDataVolume.push({ indicator: detail.Concepto, actual: detail.Valor, ob: 0, rft: 0 });
                    break;
                  case 'OB':
                    this.tableDataVolume.push({ indicator: detail.Concepto, actual: 0, ob: detail.Valor, rft: 0 });
                    break;
                  case 'RFT':
                    this.tableDataVolume.push({ indicator: detail.Concepto, actual: 0, ob: 0, rft: detail.Valor });
                    break;
                }
              }

            } else {
              switch (detail.Indicador2) {
                case 'Actual':
                  this.tableDataVolume.push({ indicator: detail.Concepto, actual: detail.Valor, ob: 0, rft: 0 });
                  break;
                case 'OB':
                  this.tableDataVolume.push({ indicator: detail.Concepto, actual: 0, ob: detail.Valor, rft: 0 });
                  break;
                case 'RFT':
                  this.tableDataVolume.push({ indicator: detail.Concepto, actual: 0, ob: 0, rft: detail.Valor });
                  break;
              }
            }
          });
          this.backupDataVol=this.tableDataVolume;
          if (this.themeAc != 'dark') {
            $('#tablaVol').css('color', '#000000');
          } else {
            $('#tablaVol').css('color', '#ffffff');
          }
          this.tblVolumeXlsx = this.tableDataVolume;
          // const aux = Math.max.apply(null, this.barChartDataVol[0].data);
          // const aux2 = Math.max.apply(null, this.barChartDataVol[1].data);
          // const aux3 = Math.max.apply(null, this.barChartDataVol[2].data);
          // var stepsize = (Math.max(aux, aux2, aux3) / 4);
          // stepsize = Math.round(stepsize);
          // this.barChartOptionsVol = {
          //   responsive: true,
          //   maintainAspectRatio: false,
          //   // We use these empty structures as placeholders for dynamic theming.
          //   scales: {
          //     xAxes: [{
          //       ticks: {
          //         fontColor: this.themeAc === 'dark' ? '#ffffff' : '#000000',
          //       }

          //     }], yAxes: [{
          //       gridLines: {
          //         color: this.themeAc === 'dark' ? '#ffffff' : '#000000',
          //       },
          //       ticks: {
          //         fontColor: this.themeAc === 'dark' ? '#ffffff' : '#000000',
          //         stepSize: stepsize,
          //         callback: function (value, index, values) {
          //           return value.toLocaleString();
          //         },
          //       }
          //     }]
          //   },

          //   plugins: {
          //     datalabels: {
          //       anchor: 'end',
          //       align: 'end',
          //     }
          //   },
          // };
          // this.barChartLabelsVol = this.labelArrayVol;
          this.spinnerVol = false;
        } else if (caseType == 5) {
          this.totalValue = res.Result[0].Valor;
          this.month = res.Result[0].Month;
          this.trmAct = res.Result[0].TrmAct;
          this.trmOb = res.Result[0].TRM;
          this.spinnerText = false;
        } else if (caseType == 6) {
          this.coin = res.Result[0].Moneda;
          this.spinnerCoin = false;
        }
      } else {
        this.error += 1;
        switch (caseType) {
          case 2:
            this.barChartLabelsHor = ['No data'];
            break;
          case 3:
            this.barChartLabels = ['No data'];
            break;
          case 4:
            this.barChartLabelsVol = ['No data'];
            break;
          case 5:
            this.month = 'No data';
            this.trmAct = 0;
            this.trmOb = 0;
            this.totalValue = 0;
            break;
          case 6:
            this.coin = 'No data';
            break;
          default:
            break;
        }
      }
      if (caseType == 6) {
        if (this.error > 0) {
          this.toastr.warning('No Data', 'Wrong');
          this.error = 0;
        }
      }

    }).catch(error => {
      console.log(error);
    });
  }

  getListFilters() {
    var bol: Boolean;
    var bolCam: Boolean;
    var bolCli: Boolean;
    this.filtersArray.forEach(filter => {

      bol = false;
      bolCam = false;
      bolCli = false;
      if (this.campaign) {
        if (filter.Campaign == this.campaign) {
          this.fillList(filter, bol, bolCam, bolCli);
        }
      } else if (this.client) {
        if (filter.Client == this.client) {
          this.fillList(filter, bol, bolCam, bolCli);
        }
      } else if (this.market) {
        if (filter.Market == this.market) {
          this.fillList(filter, bol, bolCam, bolCli);
        }
      } else {
        this.fillList(filter, bol, bolCam, bolCli);
      }

    })
  }

  getAllData(market, campaign, client, fase) {

    if(fase===true){
      this.getDetailRevenue(market, campaign, client, 2);
    }
    this.getDetailRevenue(market, campaign, client, 3);
    this.getDetailRevenue(market, campaign, client, 4);
    this.getDetailRevenue(market, campaign, client, 5);
    this.getDetailRevenue(market, campaign, client, 6);
  }

  filterSelected(event, num) {
    this.error = 0;
    this.resetList(num);
    this.getAllData(this.market, this.campaign, this.client, true);
    this.getListFilters();
    this.revenueService.setMarket(this.market);
    this.revenueService.setCampaing(this.campaign);
    this.revenueService.setClient(this.client);
    this.obsSel.market=this.market;
    this.obsSel.campaign=this.campaign;
    this.obsSel.client=this.client;
    this.obsSel.type=num;
    this.obsSelect.datos$.emit(this.obsSel);
  }

  fillList(filter, bol, bolCam, bolCli) {
    if (this.marketArray.length > 0) {
      this.marketArray.forEach(mark => {
        if (mark == filter.Market) {
          bol = true;
        }
      });
      if (bol != true) {
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
        break;
      case 2:
        this.marketArray = [];
        this.campaignArray = [];
        break;
      case 3:
        this.clientArray = [];
        this.marketArray = [];
        break;
    }

    this.labelArray = [];
    this.labelArrayCon = [];
    this.labelArrayVol = [];
    this.barChartDataHor[0].data = [];
    this.barChartData[0].data = [];
    this.barChartData[1].data = [];
    this.barChartData[2].data = [];
    this.barChartDataVol[0].data = [];
    this.barChartDataVol[1].data = [];
    this.barChartDataVol[2].data = [];
    this.tableDataVolume = [];
    this.tableDataRevenue = [];
  }

  generateXlxs(num) {
    switch (num) {
      case 1:
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tblRevenueXlsx);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Revenue');

        /* save to file */
        XLSX.writeFile(wb, 'Revenue.xlsx');
        break;
      case 2:
        const wsOb: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tblVolumeXlsx);
        /* generate workbook and add the worksheet */
        const wbOb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wbOb, wsOb, 'Volume');

        /* save to file */
        XLSX.writeFile(wbOb, 'Volume.xlsx');
        break;

    }

  }

  toggleView() {
    this.Listflipped = !this.Listflipped;
    if(this.Listflipped===true){
      $('#cardOne').css('height', '36.5625rem !important');
    }else{
      $('#cardOne').css('height', '66px !important');
    }
    
  }

  toggleViewTow(){   
    this.ListflippedTow = !this.ListflippedTow;
    if(this.ListflippedTow===true){
      $('#cardTow').css('height', '36.5625rem !important');
    }else{
      $('#cardTow').css('height', '66px !important');
    }
  }

  toggleStatistics() {
    this.showVisitorsStatistics = !this.showVisitorsStatistics;
  }

  generateReport() {
    this.windowRef = this.windowService.open(ReportIncidentComponent, { title: `Report` });
    this.objReport.component=this.windowRef;
    this.obsreport.datos$.emit(this.objReport);
  }
}