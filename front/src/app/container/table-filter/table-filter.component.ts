import { Component, OnDestroy, OnInit, AfterViewInit, TemplateRef } from '@angular/core';
import { NbToastrService, NbWindowService, NbComponentStatus, NbSearchService } from '@nebular/theme';
import { ModalComponent } from '../modal/modal.component'
import { Subscription, Observable, from } from 'rxjs';
import { obsTableFilter } from '../../services/obs-table-filter';
import { obsmenu } from '../../services/obs-menu';
import { ObjReport, ObjTable, UserCampaign } from '../../services/interfaces';
import { DetailService } from 'src/app/services/detail.service';
import { SummaryService } from 'src/app/services/summary.service';
import { LoginService } from 'src/app/services/login.service';
import { obsselectHeader } from 'src/app/services/obs-select-header';
import { LocalDataSource } from 'ng2-smart-table';
import { allowedNodeEnvironmentFlags } from 'process';
import { graphic } from 'echarts';
import { NbThemeService } from '@nebular/theme';
import { delay, takeWhile } from 'rxjs/operators';
import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { NbDialogService, NbMenuItem } from '@nebular/theme';
import $ from 'jquery';
import * as XLSX from 'xlsx';
import { element } from 'protractor';
import { ReportIncidentComponent } from '../report-incident/report-incident.component';
import { obsReport } from 'src/app/services/obs-report';

export interface OutlineData {
  label: string;
  value: number;
}

@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.scss']
})
export class TableFilterComponent implements OnInit, OnDestroy, AfterViewInit {

  dataTable = {}

  public monthList: String[] = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ]

  public option: any;
  public optionBar: any;
  public optionsBarGm: any;
  public optionComparative: any;
  public optionBarPORGM: any;
  public optionComparativeGm: any;

  settings = {
    hideSubHeader: false,
    selectMode: 'multi',
    actions: {
      position: 'left',
      add: false,
      edit: false,
      delete: false,
      custom: [
        {
          name: 'delet',
          title: '<i class="nb-trash tam"></i> ',
        }
      ],
    },
    //   rowClassFunction: (row) => {
    //     // console.log(row.data);
    //     if (row.data.Flag === 1 && row.data.name === "Actual"){
    //       // console.log("entro");
    //       return 'revenueVerde';
    //     }else if(row.data.Flag === 0 && row.data.name === "Actual"){
    //       return 'revenueRojo';
    //     }
    // },
    add: {
      addButtonContent: 'filters',
    },
    // edit: {
    //   editButtonContent: '<i class="nb-edit tam"></i>',
    //   saveButtonContent: '<i class="nb-checkmark tam"></i>',
    //   cancelButtonContent: '<i class="nb-close tam"></i>',
    // },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash tam"></i>',
    //   confirmDelete: true,
    // },
    columns: {
      client: {
        title: 'Client',
        type: 'string',
      },
      year: {
        title: 'Year',
        type: 'string',
      },
      month: {
        title: 'Month',
        type: 'string',
      },
      name: {
        title: 'Type',
        type: 'html',
      },
      netRevenue: {
        title: 'Net Revenue',
        type: 'html',
        valuePrepareFunction: (value) => {
          if (value && value!=="No Data") {
            let valor: any[] = value.toString().split("_");
            if (valor.length > 1) {
              if (this.coinSelected) {
                return valor[0] + this.currencyPipe.transform(parseInt(valor[1], 0));
              } else {
                return valor[0] + this.currencyPipe.transform(parseInt(valor[1], 0), 'EUR');
              }
            } else {
              if (this.coinSelected) {
                return this.currencyPipe.transform(value);
              } else {
                return this.currencyPipe.transform(value, 'EUR');
              }
            }

          } else {
            return 'no data';
          }
        }
      },
      directCost: {
        title: 'Direct Cost',
        type: 'number',
        valuePrepareFunction: (value) => {
          if (value && value!=="No Data") {
            if (this.coinSelected) {
              return this.currencyPipe.transform(value);
            } else {
              return this.currencyPipe.transform(value, 'EUR');
            }
          } else {
            return 'no data';
          }
        }
      },
      GM: {
        title: 'GM',
        type: 'number',
        valuePrepareFunction: (value) => {
          if (value && value!=="No Data") {
            if (this.coinSelected) {
              return this.currencyPipe.transform(value);
            } else {
              return this.currencyPipe.transform(value, 'EUR');
            }
          } else {
            return 'no data';
          }
        }
      },
      GMP: {
        title: 'GM%',
        type: 'html',
        valuePrepareFunction: (value) => {
          if (value && value!=="No Data") {
            let valor: any[] = value.toString().split("_");
            if (valor.length > 1) {
              return valor[0] + this.percentPipe.transform(parseInt(valor[1], 0) * 10);
            } else {
              return this.percentPipe.transform(value * 10);
            }
          } else {
            return 'no data';
          }
        }
      },
      market: {
        title: 'Market',
        type: 'string'
      },
      country: {
        title: 'Country',
        type: 'string'
      },
      campaign: {
        title: 'Campaign',
        type: 'string'
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  public campaign = null;
  public country = null;
  public market = null;
  public client = null;
  public eurOb;
  public eurAct;
  public resEu: any[]=[];
  public resCoin: any[]=[];
  public themeObj: any;
  public themeBar: any;
  public themeBarGm: any;
  public themeComparative: any;
  public themeBarPORGM: any;
  public coin;
  public trmOb;
  public trmAct;
  public objCampaign;
  public contador: number = 0;
  public spinnerActual: Boolean = true;
  public spinnerOb: Boolean = true;
  public spinnerRft: Boolean = true;
  public spinnerCost: Boolean = true;
  public spinnerNetReve: Boolean = true;
  public spinnerEur: Boolean = true;
  public spinner: Boolean = true;
  public spinnerLastYear: Boolean = true;
  public spinnerLastYM: Boolean = true;
  public Listflipped: boolean = false;
  private alive = true;
  public showVisitorsStatistics = false;
  public spinnerRevenue = false;
  public spinnerDirectCost = false;
  public spinnerGMBar = false;
  public coinSelected = false;

  public listFilters: any[] = [];
  public countryArray: Array<any> = [];
  public marketArray: Array<any> = [];
  public clientArray: Array<any> = [];
  public campaignArray: Array<any> = [];
  public labelArray: Array<string> = [];

  public valoresActual: Array<any> = [];
  public valoresOb: Array<any> = [];
  public valoresRFT: Array<any> = [];

  public valoresRevenueActual: Array<any> = [];
  public valoresRevenueOb: Array<any> = [];
  public valoresRevenueRFT: Array<any> = [];

  public valoresComparativeAC: Array<any> = [];
  public valoresComparativeOB: Array<any> = [];
  public valoresComparativeRFT: Array<any> = [];
  public valoresDirectCostActual: Array<any> = [];
  public valoresDirectCostOb: Array<any> = [];
  public valoresDirectCostRFT: Array<any> = [];

  public valoresGMActual: Array<any> = [];
  public valoresGMOb: Array<any> = [];
  public valoresGMRFT: Array<any> = [];

  public valoresPORGMActual: Array<any> = [];
  public valoresPORGMOb: Array<any> = [];
  public valoresPORGMRFT: Array<any> = [];

  public yearArray: Array<any> = [];
  public monthArray: Array<any> = [];
  public dateArray: Array<any> = [];
  public proviFull: Array<any> = [];
  public proviCoin: Array<any> = [];
  public tableFull: Array<any> = [];
  public tableCoin: Array<any> = [];
  public tableCoinOrder: Array<any> = [];
  public tableTotal: any = [];
  public tableOb: Array<any> = [];
  public tableRft: Array<any> = [];
  public tableLastMonth: Array<any> = [];
  public tableLastYear: Array<any> = [];
  public tableLastYearMonth: Array<any> = [];
  public booActual: Boolean = false;
  public suscripcion: Subscription;
  public suscripcionDos: Subscription;
  public suscripcionTres: Subscription;
  public filtersArray: Array<UserCampaign>;
  public data: ObjTable;
  public objReport: ObjReport;
  private error: number = 0;
  public windowRef: any;
  public echartsIntance: any;
  public spinnerTrm: Boolean = true;
  public themeActual;
  public labelToggle: string = 'Set USD-COP';
  public tableProv: any[] = [];

  constructor(private windowService: NbWindowService,
    private theme: NbThemeService,
    private obsTableFilter: obsTableFilter,
    private detailservice: DetailService,
    private summaryservice: SummaryService,
    private toastr: NbToastrService,
    private login: LoginService,
    private decimalPipe: DecimalPipe,
    private currencyPipe: CurrencyPipe,
    private percentPipe: PercentPipe,
    private dialogService: NbDialogService,
    private obsmenu: obsmenu,
    private obsselectHeader: obsselectHeader,
    private obsreport: obsReport) {
    this.objCampaign = { year: new Date().getFullYear(), campaign: null, month: null };
    this.data = { year: null, campaign: null, client: null, name: null, country: null, market: null, month: null };
    this.objReport = { component: null, campaing: null };
    this.getListDate(login.getUser().username, 2);
    this.filtersArray = this.login.getUserCampaing();
    this.getListFilters();
    this.getCoin();
    this.source.load(this.summaryservice.getDateTable());
  }

  ngOnInit(): void {
    this.getSummaryEuro("2020", null, null, null, null, null, 8);
    this.getSummary();
    this.suscripcion = this.obsTableFilter.datos$.subscribe(datos => {
      this.data = datos;
      this.filterSelected(0);
      this.windowRef.close();
    });
    this.suscripcionDos = this.obsmenu.datos$.subscribe(datos => {
      // $('html, body').animate({
      //   scrollTop: 0
      // }, 500);
      document.getElementById(datos).scrollIntoView({ behavior: 'smooth', block: 'start' });
      // document.getElementById(datos).scrollTop=200;
    });
    this.suscripcionTres = this.obsselectHeader.datos$.subscribe(datos => {
      this.objCampaign.campaign = datos.campaign;
      this.objCampaign.year = datos.year;
      this.objCampaign.month = datos.month;
      this.getAllGraphics(event);
    });
    this.objCampaign.year = new Date().getFullYear();
    let mes = new Date().getMonth();
    this.objCampaign.month = this.monthList[mes];
    this.getAllGraphics("");
  }

  ngAfterViewInit(): void {
    this.theme.getJsTheme()
      .pipe(
        delay(1),
        takeWhile(() => this.alive),
      )
      .subscribe(config => {
        this.themeActual = config;
        const eTheme: any = config.variables.visitors;
        const eTheme2: any = config.variables.profit;
        const eTheme3: any = config.variables.profitBarAnimationEchart;
        const eTheme4: any = config.variables.orders;
        const eTheme5: any = config.variables.profitBarAnimationEchart;
        this.themeObj = config.variables.visitors;
        this.themeBar = config.variables.profit;
        this.themeBarGm = config.variables.profitBarAnimationEchart;
        this.themeComparative = config.variables.orders;
        this.themeBarPORGM = config.variables.profitBarAnimationEchart;
        const visitorsPieLegend: any = config.variables.visitorsPieLegend;
        this.setOptions(eTheme);
        this.setOptionsBar(eTheme2);
        this.setOptionsBarGM(eTheme3);
        this.setOptionsComparative(eTheme4);
        this.setOptionsComparativeGm(eTheme4);
        this.setOptionsBarPORGM(eTheme5);
      });
  }

  ngOnDestroy() {
    this.suscripcion.unsubscribe();
    this.suscripcionDos.unsubscribe();
    this.suscripcionTres.unsubscribe();
  }

  generateXlxs() {
    this.contador = 0;
    this.listFilters = [];
    this.booActual = !this.booActual;
    this.windowRef = this.windowService.open(ModalComponent, { title: `Filters` });
  }

  generateReport() {
    this.windowRef = this.windowService.open(ReportIncidentComponent, { title: `Report` });
    this.objReport.component = this.windowRef;
    this.obsreport.datos$.emit(this.objReport);
  }

  setOptionsComparative(eTheme) {
    if (this.listFilters) {

      this.optionComparative = {
        backgroundColor: eTheme.bg,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(0, 0, 0, 0.3)',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        legend: {
          data: ['Net Revenue', 'Direct Cost', 'GM'],
          borderWidth: 0,
          borderRadius: 0,
          itemWidth: 15,
          itemHeight: 15,
          left: 'left',
          textStyle: {
            color: this.themeActual.variables.profitBarAnimationEchart.textColor,
          },
        },
        xAxis: [
          {
            type: 'category',
            data: [
              this.listFilters[0]?.client + ' ' + this.listFilters[0]?.name,
              this.listFilters[1]?.client + ' ' + this.listFilters[1]?.name
            ],
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: eTheme.axisLineColor,
              },
            },
            axisLabel: {
              color: eTheme.axisTextColor,
              fontSize: eTheme.axisFontSize,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: eTheme.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: eTheme.splitLineColor,
              },
            },
            axisLabel: {
              color: eTheme.axisTextColor,
              fontSize: eTheme.axisFontSize,
            },
          },
        ],
        series: [
          {
            name: 'Net Revenue',
            type: 'bar',
            barGap: 0,
            barWidth: '20%',
            itemStyle: {
              normal: {
                color: new graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: eTheme.secondLineGradFrom,
                }, {
                  offset: 1,
                  color: eTheme.secondLineGradTo,
                }]),
              },
            },
            animationDelay: idx => idx * 10,
            data: this.listFilters.map(i => {
              let valor: any[] = i.netRevenue.toString().split("_");
              if (valor.length > 1) {
                return parseInt(valor[1], 0);
              } else {
                return i.netRevenue;
              }
            }),
          },
          {
            name: 'Direct Cost',
            type: 'bar',
            barGap: 0,
            barWidth: '20%',
            itemStyle: {
              normal: {
                color: new graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: eTheme.thirdLineGradFrom,
                }, {
                  offset: 1,
                  color: eTheme.thirdLineGradTo,
                }]),
              },
            },
            animationDelay: idx => idx * 10 + 100,
            data: this.listFilters.map(i => i.directCost),
          },
          {
            name: 'GM',
            type: 'bar',
            barGap: 0,
            barWidth: '20%',
            itemStyle: {
              normal: {
                color: new graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: "#f3b915",
                }, {
                  offset: 1,
                  color: "#f3b915",
                }]),
              },
            },
            animationDelay: idx => idx * 10 + 100,
            data: this.listFilters.map(i => i.GM),
          },
        ],
      };
    }
  }

  setOptionsComparativeGm(eTheme) {
    if (this.listFilters) {

      this.optionComparativeGm = {
        backgroundColor: eTheme.bg,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(0, 0, 0, 0.3)',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: [
              this.listFilters[0]?.client + ' ' + this.listFilters[0]?.name,
              this.listFilters[1]?.client + ' ' + this.listFilters[1]?.name
            ],
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: eTheme.axisLineColor,
              },
            },
            axisLabel: {
              color: eTheme.axisTextColor,
              fontSize: eTheme.axisFontSize,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: eTheme.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: eTheme.splitLineColor,
              },
            },
            axisLabel: {
              color: eTheme.axisTextColor,
              fontSize: eTheme.axisFontSize,
              formatter: (value) => { return value.toFixed(2) + '%' },
            },
          },
        ],
        series: [
          {
            name: 'GM',
            type: 'bar',
            barGap: 0,
            barWidth: '20%',
            itemStyle: {
              normal: {
                color: new graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: "#f3b915",
                }, {
                  offset: 1,
                  color: "#f3b915",
                }]),
              },
            },
            data: this.listFilters.map(i => {
              let valor: any[] = i.GMP.toString().split("_");
              if (valor.length > 1) {
                return parseInt(valor[1], 0);
              } else {
                return i.GMP;
              }
            }),
          },
        ],
      };
    }
  }

  setOptionsBarGM(eTheme) {
    this.optionsBarGm = {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      color: [
        'rgb(1,12,80)',
        '#00ffaf',
        'rgb(243,185,21)'
      ],
      legend: {
        data: ['Actual', 'OB', 'RFT'],
        borderWidth: 0,
        borderRadius: 0,
        itemWidth: 15,
        itemHeight: 15,
        left: 'left',
        textStyle: {
          color: eTheme.textColor,
        },
      },
      tooltip: {
        axisPointer: {
          type: 'shadow',
        },
        textStyle: {
          color: eTheme.tooltipTextColor,
          fontWeight: eTheme.tooltipFontWeight,
          fontSize: eTheme.tooltipFontSize,
        },
        position: 'top',
        backgroundColor: eTheme.tooltipBg,
        borderColor: eTheme.tooltipBorderColor,
        borderWidth: eTheme.tooltipBorderWidth,
        extraCssText: eTheme.tooltipExtraCss,
      },
      xAxis: [
        {
          axisLabel: {
            color: eTheme.textColor,
            fontSize: eTheme.tooltipFontSize,
            show: true,
          },
          data: this.valoresGMActual.map(i => i.label),
          splitLine: {
            show: false
          }
        },
      ],
      yAxis: [
        {
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: eTheme.textColor,
            fontSize: eTheme.tooltipFontSize,
            show: true,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: eTheme.splitLineStyleColor,
              opacity: eTheme.splitLineStyleOpacity,
              width: eTheme.splitLineStyleWidth,
            },
          },
        },
      ],
      series: [
        {
          name: 'Actual',
          type: 'bar',
          data: this.valoresGMActual.map(i => i.value),
          animationDelay: idx => idx * 10,
        },
        {
          name: 'OB',
          type: 'bar',
          data: this.valoresGMOb.map(i => i.value),
          animationDelay: idx => idx * 10 + 100,
        },
        {
          name: 'RFT',
          type: 'bar',
          data: this.valoresGMRFT.map(i => i.value),
          animationDelay: idx => idx * 10 + 100,
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: idx => idx * 5,
    };
  }

  setOptionsBarPORGM(eTheme) {
    this.optionBarPORGM = {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      color: [
        'rgb(1,12,80)',
        '#00ffaf',
        'rgb(243,185,21)'
      ],
      legend: {
        data: ['Actual', 'OB', 'RFT'],
        borderWidth: 0,
        borderRadius: 0,
        itemWidth: 15,
        itemHeight: 15,
        left: 'left',
        textStyle: {
          color: eTheme.textColor,
        },
      },
      tooltip: {
        axisPointer: {
          type: 'shadow',
        },
        textStyle: {
          color: eTheme.tooltipTextColor,
          fontWeight: eTheme.tooltipFontWeight,
          fontSize: eTheme.tooltipFontSize,
        },
        position: 'top',
        backgroundColor: eTheme.tooltipBg,
        borderColor: eTheme.tooltipBorderColor,
        borderWidth: eTheme.tooltipBorderWidth,
        extraCssText: eTheme.tooltipExtraCss,
      },
      xAxis: [
        {
          axisLabel: {
            color: eTheme.textColor,
            fontSize: eTheme.tooltipFontSize,
            show: true,
          },
          data: this.valoresPORGMActual.map(i => i.label),
          splitLine: {
            show: false
          }
        },
      ],
      yAxis: [
        {
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: eTheme.textColor,
            fontSize: eTheme.tooltipFontSize,
            show: true,
            formatter: (value) => { return value.toFixed(2) + '%' }
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: eTheme.splitLineStyleColor,
              opacity: eTheme.splitLineStyleOpacity,
              width: eTheme.splitLineStyleWidth,
            },
          },
        },
      ],
      series: [
        {
          name: 'Actual',
          type: 'bar',
          data: this.valoresPORGMActual.map(i => i.value),
          animationDelay: idx => idx * 10,
        },
        {
          name: 'OB',
          type: 'bar',
          data: this.valoresPORGMOb.map(i => i.value),
          animationDelay: idx => idx * 10 + 100,
        },
        {
          name: 'RFT',
          type: 'bar',
          data: this.valoresPORGMRFT.map(i => i.value),
          animationDelay: idx => idx * 10 + 100,
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: idx => idx * 5,
    };
  }

  setOptionsBar(eTheme) {
    this.optionBar = {
      backgroundColor: eTheme.bg,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(0, 0, 0, 0.3)',
          },
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      legend: {
        data: ['Actual', 'OB', 'RFT'],
        borderWidth: 0,
        borderRadius: 0,
        itemWidth: 15,
        itemHeight: 15,
        left: 'left',
        textStyle: {
          color: eTheme.textColor,
        },
      },
      xAxis: [
        {
          type: 'category',
          data: this.valoresDirectCostActual.map(i => i.label),
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: eTheme.axisLineColor,
            },
          },
          axisLabel: {
            color: eTheme.axisTextColor,
            fontSize: eTheme.axisFontSize,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: eTheme.axisLineColor,
            },
          },
          splitLine: {
            lineStyle: {
              color: eTheme.splitLineColor,
            },
          },
          axisLabel: {
            color: eTheme.axisTextColor,
            fontSize: eTheme.axisFontSize,
          },
        },
      ],
      series: [
        {
          name: 'Actual',
          type: 'bar',
          barGap: 0,
          barWidth: '20%',
          itemStyle: {
            normal: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgb(1,12,80)',
              }, {
                offset: 1,
                color: 'rgb(1,12,80)',
              }]),
            },
          },
          animationDelay: idx => idx * 10,
          data: this.valoresDirectCostActual.map(i => i.value),
        },
        {
          name: 'OB',
          type: 'bar',
          barGap: 0,
          barWidth: '20%',
          itemStyle: {
            normal: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#00ffaf',
              }, {
                offset: 1,
                color: '#00ffaf',
              }]),
            },
          },
          animationDelay: idx => idx * 10 + 100,
          data: this.valoresDirectCostOb.map(i => i.value),
        },
        {
          name: 'RFT',
          type: 'bar',
          barGap: 0,
          barWidth: '20%',
          itemStyle: {
            normal: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: "#f3b915",
              }, {
                offset: 1,
                color: "#f3b915",
              }]),
            },
          },
          animationDelay: idx => idx * 10 + 100,
          data: this.valoresDirectCostRFT.map(i => i.value),
        },
      ],
    };
  }

  setOptions(eTheme) {
    this.option = {
      grid: {
        left: '3%',
        right: '4%',
        // top: '10%',
        // bottom: '3%',
        // left: 40,
        // right: 0,
        // top: 20,
        bottom: 60,
        containLabel: true,
      },
      color: [
        '#00ffaf',
        'rgb(1,12,80)',
        'rgb(243,185,21)'
      ],
      legend: {
        data: ['Actual', 'OB', 'RFT'],
        borderWidth: 0,
        borderRadius: 0,
        itemWidth: 15,
        itemHeight: 15,
        left: 'left',
        textStyle: {
          color: this.themeActual.variables.profitBarAnimationEchart.textColor,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: eTheme.tooltipLineColor,
            // color: "rgba(0, 0, 0, 0)",
            width: eTheme.tooltipLineWidth,
            // width: "1",
          },
        },
        textStyle: {
          color: eTheme.tooltipTextColor,
          // color: "#1a2138",
          fontSize: 20,
          fontWeight: eTheme.tooltipFontWeight,
          // fontWeight: "normal",
        },
        position: 'top',
        borderColor: eTheme.tooltipBorderColor,
        // borderColor: "#f7f9fc",
        borderWidth: 1,
        xtraCssText: eTheme.tooltipExtraCss,
        backgroundColor: eTheme.tooltipBg,
        // xtraCssText: "border-radius: 10px; padding: 8px 24px;",
      },
      backgroundColor: eTheme.tooltipBg,
      xAxis: {
        type: 'category',
        boundaryGap: false,
        offset: 25,
        data: this.valoresRevenueActual.map(i => i.label),
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: eTheme.axisTextColor,
          // color: "#8f9bb3",
          fontSize: eTheme.axisFontSize,
          // fontSize: "16",
        },
        axisLine: {
          lineStyle: {
            color: eTheme.axisLineColor,
            // color: "#e4e9f2",
            width: '2',
          },
        },
      },
      yAxis: {
        type: 'value',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: eTheme.axisLineColor,
            // color: "#e4e9f2",
            width: '1',
          },
        },
        axisLabel: {
          color: eTheme.axisTextColor,
          // color: "#8f9bb3",
          fontSize: eTheme.axisFontSize,
          // fontSize: "16",
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: eTheme.yAxisSplitLine,
            // color: "#e4e9f2",
            width: '1',
          },
        },
      },
      series: [
        this.getInnerLine(eTheme),
        this.getOuterLine(eTheme),
        this.getThridLine(eTheme),
      ]
    };
  }
  getThridLine(eTheme) {
    return {
      name: 'RFT',
      type: 'line',
      smooth: true,
      symbolSize: 20,
      itemStyle: {
        normal: {
          opacity: 0,
        },
        emphasis: {
          color: 'rgb(0 214 143)',
          borderColor: eTheme.itemBorderColor,
          borderWidth: 2,
          opacity: 1,
        },
      },
      lineStyle: {
        normal: {
          width: eTheme.lineWidth,
          type: eTheme.innerLineStyle,
          color: new graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: "rgb(243 185 21)",
          }, {
            offset: 1,
            color: "rgb(243 185 21)",
          }]),
          shadowColor: eTheme.lineShadow,
          shadowBlur: 6,
          shadowOffsetY: 12,
        },
      },
      areaStyle: {
        normal: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: "rgb(243 185 21)",
          }, {
            offset: 1,
            color: "rgb(243 185 21)",
          }]),
        },
      },
      animationDelay: idx => idx * 10 + 100,
      data: this.valoresRevenueRFT,
    };
  }



  getOuterLine(eTheme) {
    return {
      name: 'Actual',
      type: 'line',
      smooth: true,
      symbolSize: 20,
      itemStyle: {
        normal: {
          opacity: 0,
        },
        emphasis: {
          color: '#ffffff',
          borderColor: eTheme.itemBorderColor,
          borderWidth: 2,
          opacity: 1,
        },
      },
      lineStyle: {
        normal: {
          width: eTheme.lineWidth,
          type: eTheme.lineStyle,
          color: new graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: eTheme.lineGradFrom,
          }, {
            offset: 1,
            color: eTheme.lineGradTo,
          }]),
          shadowColor: eTheme.lineShadow,
          shadowBlur: 6,
          shadowOffsetY: 12,
        },
      },
      areaStyle: {
        normal: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgb(1,12,80)',
          }, {
            offset: 1,
            color: 'rgb(1,12,80)',
          }]),
        },
      },
      animationDelay: idx => idx * 10 + 100,
      data: this.valoresRevenueActual
    };
  }

  getInnerLine(eTheme) {
    return {
      name: 'OB',
      type: 'line',
      smooth: true,
      symbolSize: 20,
      tooltip: {
        show: true,
        extraCssText: '',
      },
      itemStyle: {
        normal: {
          opacity: 0,
        },
        emphasis: {
          color: '#ffffff',
          borderColor: eTheme.itemBorderColor,
          borderWidth: 2,
          opacity: 1,
        },
      },
      lineStyle: {
        normal: {
          width: eTheme.innerLineWidth,
          type: eTheme.innerLineStyle,
          color: new graphic.LinearGradient(0, 0, 0, 1),
        },
      },
      areaStyle: {
        normal: {
          color: new graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: '#00ffaf',
          }, {
            offset: 1,
            color: '#00ffaf',
          }]),
          opacity: 1,
        },
      },
      animationDelay: idx => idx * 10,
      data: this.valoresRevenueOb,
    }
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
                this.dateArray[i].months.push(data.monthname);
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
        if (this.objCampaign.year === date.year) {
          date.months.forEach(month => {
            this.monthArray.push(month.trim());
          });
        }
      });
    });
  }

  getCoin() {
    this.detailservice.getDetailCost(this.market, this.campaign, this.client, 7).then((res: any) => {
      this.coin = res.Result[0].Moneda;
    });
  }

  filterSelected(num) {
    this.error = 0;
    this.resetList(num);
    let valorType: number = 0;
    // if (this.data.name === "Actual") {
    //   valorType = 2;
    // } else if (this.data.name === "OB") {
    //   valorType = 3;
    // } else if (this.data.name === "RFT") {
    //   valorType = 4;
    // }
    this.getAllData(this.data.year, this.data.month, this.data.country, this.data.market, this.data.campaign, this.data.client, valorType);
    this.getListFilters();
    this.detailservice.setYear(this.data.year);
    this.detailservice.setMonth(this.data.month);
    this.detailservice.setCountry(this.data.country);
    this.detailservice.setMarket(this.data.market);
    this.detailservice.setCampaing(this.data.campaign);
    this.detailservice.setClient(this.data.client);
  }

  getAllData(year, month, country, market, campaign, client, type) {

    this.getSummaryEuro(year, month, country, market, campaign, client, 2);
    this.getSummaryEuro(year, month, country, market, campaign, client, 3);
    this.getSummaryEuro(year, month, country, market, campaign, client, 4);
    this.getSummaryEuro("2020", month, country, market, campaign, client, 8);
    this.getSummaryTable(year, month, country, market, campaign, client, 2);
    this.getSummaryTable(year, month, country, market, campaign, client, 3);
    this.getSummaryTable(year, month, country, market, campaign, client, 4);
    // this.getDetailHistoric(year, month, country, market, campaign, client, 1);
    // this.getDetailHistoric(year, month, country, market, campaign, client, 2);
    // this.getDetailHistoric(year, month, country, market, campaign, client, 3);
    // this.getDetailHistoric(year, month, country, market, campaign, client, 4);
    // this.getDetailHistoric(year, month, country, market, campaign, client, 5);
    // this.getDetailHistoric(year, month, country, market, campaign, client, 6);
  }


  getAllGraphics(event) {
    this.spinnerRevenue = true;
    this.spinnerDirectCost = true;
    this.spinnerGMBar = true;
    let month = 0;
    this.valoresActual = [];
    this.valoresOb = [];
    this.valoresRFT = [];
    for (let i = 0; i < this.monthList.length; i++) {
      if (this.monthList[i] === this.objCampaign.month) {
        month = i;
      }
    }
    let meses: any[] = [];
    let valor: any[] = [];
    let monthConf = month - 1;
    let monthAjus = month - 6;
    let newYear = this.objCampaign.year - 1;
    if (monthAjus < 0) {
      for (let i = 0; i > monthAjus; i--) {
        let mes = 11 + i;
        meses.push({ mes: this.monthList[mes], anio: newYear });
      }
      for (let i = 0; i <= monthConf; i++) {
        meses.push({ mes: this.monthList[i], anio: this.objCampaign.year });
      }
      this.getSummaryGraphic(this.objCampaign.year, this.objCampaign.month, this.objCampaign.campaign, 9);
      this.filterDateSelected();
      this.getSummary();
    } else {
      for (let i = monthConf; i >= monthAjus; i--) {
        meses.push({ mes: this.monthList[i + 1], anio: this.objCampaign.year });
      }
      //Actual
      this.getSummaryGraphic(this.objCampaign.year, this.objCampaign.month, this.objCampaign.campaign, 9);
      this.filterDateSelected();
      this.getSummary();
    }

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

  getSummaryEuro(year, month, country, market, campaign, client, caseType) {
    this.summaryservice.getSummaryEuro(year, month, country, market, campaign, client, caseType).then((res: any) => {
      this.resEu=res;
      let nameActual = "";
      let nameGM = "";
      year = year !== null ? year : "All";
      month = month !== null ? month : "All";
      country = country !== null ? country : "All";
      market = market !== null ? market : "All";
      campaign = campaign !== null ? campaign : "All";
      client = client !== null ? client : "All";
      caseType = caseType !== null ? caseType : "All";
      if (res.Result !== undefined && Object.keys(res.Result[0]).length !== 0 || res[0].Result === "No Data") {

        if (caseType == 2) {
          console.log(this.resEu.length);
          if (this.resEu.length===undefined) {
            if (res.Result[0].Flag === 1) {
              nameActual = "<i class='fas fa-thumbs-up'></i><br>_" + res.Result[0].NetRevenueEUR;
            } else {
              nameActual = "<i class='far fa-thumbs-down'></i><br>_" + res.Result[0].NetRevenueEUR;
            }

            if (res.Result[0].Flag1 === 1) {
              nameGM = "<i class='fas fa-thumbs-up'></i><br>_" + res.Result[0].PORGMEUR;
            } else {
              nameGM = "<i class='far fa-thumbs-down'></i><br>_" + res.Result[0].PORGMEUR;
            }
            this.tableTotal = {
              client: client, year: year, month: month,
              name: "Actual", netRevenue: nameActual,
              directCost: res.Result[0].DirectCostEUR, GM: res.Result[0].GMEUR,
              GMP: nameGM, market: market, country: country, campaign: campaign
            };
          } else {
            this.tableTotal = {
              client: client, year: year, month: month,
              name: "Actual", netRevenue: "No Data",
              directCost: "No Data", GM: "No Data",
              GMP: "No Data", market: market, country: country, campaign: campaign
            };
          }
          this.proviFull.push(this.tableTotal);
          this.spinner = false;
        } else if (caseType == 3) {
          if (this.resEu.length===undefined) {
            this.tableTotal = {
              client: client, year: year, month: month,
              name: "OB", netRevenue: res.Result[0].NetRevenueEUROB,
              directCost: res.Result[0].DirectCostEUROB, GM: res.Result[0].GMEUROB,
              GMP: res.Result[0].PORGMEUROB, market: market, country: country, campaign: campaign
            };
          } else {
            this.tableTotal = {
              client: client, year: year, month: month,
              name: "OB", netRevenue: "No Data",
              directCost: "No Data", GM: "No Data",
              GMP: "No Data", market: market, country: country, campaign: campaign
            };
          }
          this.proviFull.push(this.tableTotal);
          this.spinner = false;
        } else if (caseType == 4) {
          if (this.resEu.length===undefined) {
            this.tableTotal = {
              client: client, year: year, month: month,
              name: "RFT", netRevenue: res.Result[0].NetRevenueEURRFT,
              directCost: res.Result[0].DirectCostEURRFT, GM: res.Result[0].GMEURRFT,
              GMP: res.Result[0].PORGMEURRFT, market: market, country: country, campaign: campaign
            };
          } else {
            this.tableTotal = {
              client: client, year: year, month: month,
              name: "RFT", netRevenue: "No Data",
              directCost: "No Data", GM: "No Data",
              GMP: "No Data", market: market, country: country, campaign: campaign
            };
          }
          this.proviFull.push(this.tableTotal);
          this.spinner = false;
        } else if (caseType == 8) {
          this.eurOb = res.Result[0].trmActEUR;
          this.eurAct = res.Result[0].trmObEUR;
          this.spinner = false;
        }
        if (caseType !== 8) {
          let hash = {};
          this.checkedCoin(false);
          // this.source.add(this.tableTotal);
          // this.source.refresh();
        }
      } else {
        this.error += 1;
        console.log(this.error, caseType);
        switch (caseType) {
          case 2:
            // this.tableActual = ['No data'];
            this.toastr.warning('No Data', 'Wrong');
            this.error = 0;
            break;
          case 3:
            // this.tableOb = ['No data'];
            this.toastr.warning('No Data', 'Wrong');
            this.error = 0;
            break;
          case 4:
            // this.tableRft = ['No data'];
            this.toastr.warning('No Data', 'Wrong');
            this.error = 0;
            break;
          case 8:
            this.eurOb = 0;
            this.eurAct = 0;
            break;
          case 0:
            this.toastr.warning('No Data', 'Wrong');
            this.error = 0;
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
    });
  }

  getSummaryGraphic(year, month, campaign, caseType) {
    this.cleanArrayGraphics();
    this.summaryservice.getSummaryEuro(year, month, null, null, campaign, null, caseType).then((res: any) => {
      if (res.Result !== undefined && Object.keys(res.Result[0]).length !== 0) {
        if (caseType == 2) {

          this.valoresActual.push({ label: month, value: res.Result[0].NetRevenueEUR });
          this.spinner = false;
        } else if (caseType == 3) {
          this.valoresOb.push({ label: month, value: res.Result[0].NetRevenueEUROB });
          this.spinner = false;
        } else if (caseType == 4) {
          this.valoresRFT.push({ label: month, value: res.Result[0].NetRevenueEURRFT });
          this.spinner = false;
        } else if (caseType == 8) {
          this.eurOb = res.Result[0].trmActEUR;
          this.eurAct = res.Result[0].trmObEUR;
          this.setOptions(this.themeObj);
          this.setOptionsBar(this.themeBar);
          this.setOptionsBarGM(this.themeBarGm);
          this.spinner = false;
        } else if (caseType == 9) {
          let dataGraphics: any[] = res.Result;
          console.log(res);
          dataGraphics.forEach((data) => {
            this.valoresRevenueActual.push({ label: data.monthname, value: data.NetRevenueEUR });
            this.valoresRevenueOb.push({ value: data.NetRevenueEUROB });
            this.valoresRevenueRFT.push({ value: data.NetRevenueEURRFT });
            this.spinnerRevenue = false;

            this.valoresDirectCostActual.push({ label: data.monthname, value: data.DirectCostEUR });
            this.valoresDirectCostOb.push({ label: data.monthname, value: data.DirectCostEUROB });
            this.valoresDirectCostRFT.push({ label: data.monthname, value: data.DirectCostEURRFT });
            this.spinnerDirectCost = false;

            this.valoresGMActual.push({ label: data.monthname, value: data.GMEUR });
            this.valoresGMOb.push({ label: data.monthname, value: data.GMEUROB });
            this.valoresGMRFT.push({ label: data.monthname, value: data.GMEURRFT });

            this.valoresPORGMActual.push({ label: data.monthname, value: data.PORGMEUR });
            this.valoresPORGMOb.push({ label: data.monthname, value: data.PORGMEUROB });
            this.valoresPORGMRFT.push({ label: data.monthname, value: data.PORGMEURRFT });
            this.spinnerGMBar = false;
          })
        }
        if (this.themeActual) {
          this.setOptions(this.themeObj);
          this.setOptionsBar(this.themeBar);
          this.setOptionsBarGM(this.themeBarGm);
          this.setOptionsBarPORGM(this.themeBarPORGM);
        }
      } else {
        this.error += 1;
        console.log(this.error, caseType);
        switch (caseType) {
          case 2:
            // this.tableActual = ['No data'];
            this.spinnerRevenue = false;
            this.toastr.warning('No Data', 'Wrong');
            this.error = 0;
            break;
          case 3:
            // this.tableOb = ['No data'];
            this.spinnerRevenue = false;
            this.toastr.warning('No Data', 'Wrong');
            this.error = 0;
            break;
          case 4:
            // this.tableRft = ['No data'];
            this.spinnerRevenue = false;
            this.toastr.warning('No Data', 'Wrong');
            this.error = 0;
            break;
          case 8:
            this.eurOb = 0;
            this.eurAct = 0;
            break;
          case 9:
            // this.tableRft = ['No data'];
            this.spinnerRevenue = false;
            this.toastr.warning('No Data', 'Wrong');
            this.error = 0;
            break;
          case 0:
            this.spinnerRevenue = false;
            this.toastr.warning('No Data', 'Wrong');
            this.error = 0;
            break;
          default:
            break;
        }
      }
      if (caseType == 8) {
        if (this.error > 0) {
          this.spinnerRevenue = false;
          this.toastr.warning('No Data', 'Wrong');
          this.error = 0;
        }

      }
    });
  }

  getSummary() {
    this.summaryservice.getSummary(this.objCampaign.year, null, null, null, this.objCampaign.campaign, null, 8).then((res: any) => {
      if (Object.keys(res.Result[0]).length !== 0) {
        this.trmOb = res.Result[0].TRM;
        this.trmAct = res.Result[0].TRMActual;
        this.spinnerTrm = false;
      } else {
        this.error += 1;
        this.trmOb = 0;
        this.trmAct = 0;
      }
      if (this.error > 0) {
        this.toastr.warning('No Data', 'Wrong');
        this.error = 0;
      }
    });
  }

  getSummaryTable(year, month, country, market, campaign, client, caseType) {
    this.summaryservice.getSummary(year, month, country, market, campaign, client, caseType).then((res: any) => {
      this.resCoin=res;
      let nameActual = "";
      let nameGM = "";
      year = year !== null ? year : "All";
      month = month !== null ? month : "All";
      country = country !== null ? country : "All";
      market = market !== null ? market : "All";
      campaign = campaign !== null ? campaign : "All";
      client = client !== null ? client : "All";
      caseType = caseType !== null ? caseType : "All";
      if (res.Result !== undefined && Object.keys(res.Result[0]).length !== 0 || res[0].Result === "No Data") {

        if (caseType == 2) {
          if (this.resCoin.length===undefined) {
            if (res.Result[0].Flag === 1) {
              nameActual = "<i class='fas fa-thumbs-up'></i><br>_" + res.Result[0].NetRevenue;
            } else {
              nameActual = "<i class='far fa-thumbs-down'></i><br>_" + res.Result[0].NetRevenue;
            }


            if (res.Result[0].Flag1 === 1) {
              nameGM = "<i class='fas fa-thumbs-up'></i><br>_" + res.Result[0].PORGM;
            } else {
              nameGM = "<i class='far fa-thumbs-down'></i><br>_" + res.Result[0].PORGM;
            }

            this.tableTotal = {
              client: client, year: year, month: month,
              name: "Actual", netRevenue: nameActual,
              directCost: res.Result[0].DirectCost, GM: res.Result[0].GM,
              GMP: nameGM, market: market, country: country, campaign: campaign
            };
          } else {
            this.tableTotal = {
              client: client, year: year, month: month,
              name: "Actual", netRevenue: "No Data",
              directCost: "No Data", GM: "No Data",
              GMP: "No Data", market: market, country: country, campaign: campaign
            };
          }
          this.proviCoin.push(this.tableTotal);
          this.spinner = false;
        } else if (caseType == 3) {
          if (this.resCoin.length===undefined) {
            this.tableTotal = {
              client: client, year: year, month: month,
              name: "OB", netRevenue: res.Result[0].NetRevenueOB,
              directCost: res.Result[0].DirectCostOB, GM: res.Result[0].GMOB,
              GMP: res.Result[0].PORGMOB, market: market, country: country, campaign: campaign
            };
          } else {
            this.tableTotal = {
              client: client, year: year, month: month,
              name: "OB", netRevenue: "No Data",
              directCost: "No Data", GM: "No Data",
              GMP: "No Data", market: market, country: country, campaign: campaign
            };
          }
          this.proviCoin.push(this.tableTotal);
          this.spinner = false;
        } else if (caseType == 4) {
          if (this.resCoin.length===undefined) {
            this.tableTotal = {
              client: client, year: year, month: month,
              name: "RFT", netRevenue: res.Result[0].NetRevenueRFT,
              directCost: res.Result[0].DirectCostRFT, GM: res.Result[0].GMRFT,
              GMP: res.Result[0].PORGMRFT, market: market, country: country, campaign: campaign
            };
          } else {
            this.tableTotal = {
              client: client, year: year, month: month,
              name: "RFT", netRevenue: "No Data",
              directCost: "No Data", GM: "No Data",
              GMP: "No Data", market: market, country: country, campaign: campaign
            };
          }
          this.proviCoin.push(this.tableTotal);
          this.spinner = false;
        } else if (caseType == 8) {
          this.eurOb = res.Result[0].trmActEUR;
          this.eurAct = res.Result[0].trmObEUR;
          this.spinner = false;
        }
        if (caseType !== 8) {
          let hash = {};
          this.checkedCoin(false);
        }
      } else {
        this.error += 1;
        console.log(this.error, caseType);
        switch (caseType) {
          case 2:
            // this.tableActual = ['No data'];
            this.toastr.warning('No Data', 'Wrong');
            this.error = 0;
            break;
          case 3:
            // this.tableOb = ['No data'];
            this.toastr.warning('No Data', 'Wrong');
            this.error = 0;
            break;
          case 4:
            // this.tableRft = ['No data'];
            this.toastr.warning('No Data', 'Wrong');
            this.error = 0;
            break;
          case 8:
            this.eurOb = 0;
            this.eurAct = 0;
            break;
          case 0:
            this.toastr.warning('No Data', 'Wrong');
            this.error = 0;
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
    });
  }

  getDetailHistoric(year, month, country, market, campaign, client, caseType) {
    this.detailservice.getDetailHistoric(year, month, country, market, campaign, client, caseType).then((res: any) => {

      if (Object.keys(res.Result[0]).length !== 0) {
        if (caseType == 1) {
          this.tableLastMonth.push({ indicator: 'Net Revenue', valor: res.Result[0].NetRevenueLastMonth });
          this.tableLastMonth.push({ indicator: 'Direct Cost', valor: res.Result[0].DirectCostLastMonth });
          this.tableLastMonth.push({ indicator: 'GM', valor: res.Result[0].GMLastMonth });
          this.tableLastMonth.push({ indicator: '%GM', valor: res.Result[0].PORGMLastMonth });
          this.spinnerLastYear = false;
        } else if (caseType == 2) {
          this.tableLastYear.push({ indicator: 'Net Revenue', valor: res.Result[0].NetRevenueLastYear });
          this.tableLastYear.push({ indicator: 'Direct Cost', valor: res.Result[0].DirectCostLastYear });
          this.tableLastYear.push({ indicator: 'GM', valor: res.Result[0].GMLastYear });
          this.tableLastYear.push({ indicator: '%GM', valor: res.Result[0].PORGMLastYear });
          this.spinnerLastYear = false;
        } else if (caseType == 3) {
          this.tableLastYearMonth.push({ indicator: 'Net Revenue', valor: res.Result[0].NetRevenueLastYearMonth });
          this.tableLastYearMonth.push({ indicator: 'Direct Cost', valor: res.Result[0].DirectCostLastYearMonth });
          this.tableLastYearMonth.push({ indicator: 'GM', valor: res.Result[0].GMLastYearMonth });
          this.tableLastYearMonth.push({ indicator: '%GM', valor: res.Result[0].PORGMLastYearMonth });
          this.spinnerLastYM = false;
        } else if (caseType == 4) {

          var nrEur = [];
          var nrLy = [];
          var nrLm = [];
          var nrLym = [];
          var nrEOb = [];
          var nrERft = [];

          nrEur.push(res.Result[0].NetRevenueEUR);
          nrLy.push(res.Result[0].NetRevenueLastYear);
          nrLm.push(res.Result[0].NetRevenueLastMonth);
          nrLym.push(res.Result[0].NetRevenueLastYearMonth);
          nrEOb.push(res.Result[0].NetRevenueEUROB);
          nrERft.push(res.Result[0].NetRevenueEURRFT);
          this.spinnerNetReve = false;
        } else if (caseType == 5) {
          const dcEur = res.Result[0].DirectCostEUR;
          const dcLy = res.Result[0].DirectCostLastYear;
          const dcLm = res.Result[0].DirectCostLastMonth;
          const dcLym = res.Result[0].DirectCostLastYearMonth;
          const dcEOb = res.Result[0].DirectCostEUROB;
          const dcERft = res.Result[0].DirectCostEURRFT;
          this.spinnerCost = false;
        } else if (caseType == 6) {

          const porEur = res.Result[0].PORGMEUR;
          const porLy = res.Result[0].PORGMLastYear;
          const porLm = res.Result[0].PORGMLastMonth;
          const porLym = res.Result[0].PORGMLastYearMonth;
          const porEOb = res.Result[0].PORGMEUROB;
          const porERft = res.Result[0].PORGMEURRFT;
        }
      } else {
        this.error += 1;
        switch (caseType) {
          case 1:
            // this.tableLastMonth = ['No data'];
            break;
          case 2:
            // this.tableLastYear = ['No data'];
            break;
          case 3:
            // this.tableLastYearMonth = ['No data'];
            break;
          case 4:
            // this.barChartLabels = ['No data'];
            break;
          case 5:
            // this.barChartLabelsCost = ['No data'];
            break;
          case 6:
            // this.barChartLabelsGm = ['No data'];
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
    })
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
    }
    this.labelArray = [];
    this.tableTotal = [];
    this.tableOb = [];
    this.tableRft = [];
    this.tableLastMonth = [];
    this.tableLastYear = [];
    this.tableLastYearMonth = [];

  }

  cleanArrayGraphics() {
    this.valoresRevenueActual = [];
    this.valoresRevenueOb = [];
    this.valoresRevenueRFT = [];
    this.valoresDirectCostActual = [];
    this.valoresDirectCostOb = [];
    this.valoresDirectCostRFT = [];
    this.valoresGMActual = [];
    this.valoresGMOb = [];
    this.valoresGMRFT = [];
    this.valoresPORGMActual = [];
    this.valoresPORGMOb = [];
    this.valoresPORGMRFT = [];
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

  onCustom(event) {
    let tablaEUR: any[] = [];
    let tablaPESOS: any[] = [];
    this.source.refresh();
    if (event.action === "delet") {
      if (window.confirm('Are you sure you want to delete?')) {
        this.contador = 0;
        this.source.remove(event.data);
        this.tableFull.forEach(element => {
          if (element !== event.data) {
            tablaEUR.push(element);
          }
        });
        this.tableFull = tablaEUR;

        this.tableCoin.forEach(element => {
          if (element !== event.data) {
            tablaPESOS.push(element);
          }
        });
        this.tableCoin = tablaPESOS;
      } else {
      }
    } else {
      this.generateXlxs();
      this.settings.actions.add = false;
    }
  }

  checkedCoin(booleanA) {
    let order = {
      Actual: 1,
      RFT: 2,
      OB: 3
    };
    this.source.empty();
    if (booleanA === true) {
      this.coinSelected = !this.coinSelected;
    }
    let hash = {};
    this.contador = 0;
    if(this.resEu.length>=1 && this.resEu[0].Result !== "No Data"){
      this.proviFull = this.proviFull.filter(o => hash[o.netRevenue] ? false : hash[o.netRevenue] = true);
    }
    hash = {};
    if(this.resCoin.length>=1 && this.resCoin[0].Result !== "No Data"){
      this.proviCoin = this.proviCoin.filter(o => hash[o.netRevenue] ? false : hash[o.netRevenue] = true);
    }
    this.proviFull.sort((a, b) => (order[a.name] - order[b.name]));
    this.proviCoin.sort((a, b) => (order[a.name] - order[b.name]));
    if (this.proviFull.length === 3) {
      this.proviFull.forEach(element => {
        this.tableFull.push(element);
      });
      this.proviFull = [];
    } else if (this.proviCoin.length === 3) {
      this.proviCoin.forEach(element => {
        this.tableCoin.push(element);
      });
      this.proviCoin = [];
    }
    if (this.coinSelected === false) {
      // this.labelToggle = 'Set USD-COP';
      //Muestra en EUR
      this.tableFull.forEach(elemento => {
        this.source.add(elemento);
      });
      this.source.refresh();
    } else {
      // this.labelToggle = 'Set EUR';
      //Muestra en USD - COP
      this.tableCoin.forEach(elemento => {
        this.source.add(elemento);
      });
      this.source.refresh();
    }
  }

  toggleStatistics() {
    this.showVisitorsStatistics = !this.showVisitorsStatistics;
  }

  onChartInit(echarts) {
    this.echartsIntance = echarts;
  }

  filterDateSelected() {
    this.monthArray = [];
    this.dateArray.forEach(date => {
      if (this.objCampaign.year === date.year) {
        date.months.forEach(month => {
          this.monthArray.push(month.trim());
        });
      }
    });
  }

  onUserRowSelect(event, dialog: TemplateRef<any>) {
    let status: NbComponentStatus = 'success';
    if (event.isSelected === true) {
      this.listFilters.push(event.data);
      this.contador = this.contador + 1;
      if (this.contador === 2) {
        //  this.valoresComparativeAC.push({label: listFilters[0].monthname, value: data.DirectCostEUR});
        this.setOptionsComparative(this.themeComparative);
        this.setOptionsComparativeGm(this.themeComparative);
        this.dialogService.open(
          dialog,
          {
            context: "",
            closeOnEsc: false,
          });
      } else {
        this.toastr.show('Comparisons of more than 2 filters are not allowed', `Financials message`, { status });
      }
    } else {
      this.listFilters = this.listFilters.filter((objeto) => {
        return objeto !== event.data;
      })
      this.contador = this.contador - 1;
      if (this.contador === 2) {
        this.setOptionsComparative(this.themeComparative);
        this.setOptionsComparativeGm(this.themeComparative);
        this.dialogService.open(
          dialog,
          {
            context: "",
            closeOnEsc: false,
          });
      }
    }
  }

  toggleView() {
    this.Listflipped = !this.Listflipped;
  }

  generateXlxsSumary() {
    let tabla: any[] = [];
    switch (this.coinSelected) {
      case true:
        this.tableCoin.forEach(element => {
          let position = element;
          let gmp = position.GMP.toString().split("_");
          if (gmp.length === 1) {
            position.GMP = gmp[0];
          } else {
            position.GMP = gmp[1];
          }
          let netRevenue = position.netRevenue.toString().split("_");
          if (gmp.length === 1) {
            position.netRevenue = netRevenue[0];
          } else {
            position.netRevenue = netRevenue[1];
          }
          tabla.push(position);
        });
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tabla);
        console.log('worksheet', ws);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'SummaryCoin');

        /* save to file */
        XLSX.writeFile(wb, 'SummaryCoin.xlsx');
        break;
      case false:
        this.tableFull.forEach(element => {
          let position = element;
          let gmp = position.GMP.toString().split("_");
          if (gmp.length === 1) {
            position.GMP = gmp[0];
          } else {
            position.GMP = gmp[1];
          }
          let netRevenue = position.netRevenue.toString().split("_");
          if (gmp.length === 1) {
            position.netRevenue = netRevenue[0];
          } else {
            position.netRevenue = netRevenue[1];
          }
          tabla.push(position);
        });
        const wsOb: XLSX.WorkSheet = XLSX.utils.json_to_sheet(tabla);
        console.log('worksheet', wsOb);
        /* generate workbook and add the worksheet */
        const wbOb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wbOb, wsOb, 'SummaryEu');

        /* save to file */
        XLSX.writeFile(wbOb, 'SummaryEu.xlsx');
        break;
    }
  }
}
