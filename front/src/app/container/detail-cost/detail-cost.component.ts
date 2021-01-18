import { Component, OnInit, Pipe, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Label } from 'ng2-charts';
import { DetailService } from 'src/app/services/detail.service';
import { ObjReport, TableCost, UserCampaign } from '../../services/interfaces';
import { NbToastrService, NbTreeGridDataSourceBuilder, NbTreeGridDataSource, NbGetters, NbThemeService, NbWindowService } from '@nebular/theme';
import { LoginService } from 'src/app/services/login.service';
import { CurrencyPipe } from '@angular/common';
import { obsselect } from 'src/app/services/obs-select';
import * as XLSX from 'xlsx';
import * as $ from 'jquery';
import { graphic } from 'echarts';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexXAxis, ApexYAxis, ApexStroke, ApexTitleSubtitle, ChartComponent, ApexTheme } from 'ng-apexcharts';
import { Subscription } from 'rxjs';
import { ReportIncidentComponent } from '../report-incident/report-incident.component';
import { obsReport } from 'src/app/services/obs-report';

interface FSEntry {
  indicator: string;
  actual: number;
  ob: number;
  rft: number;
  childEntries?: FSEntry[];
  expanded?: boolean;
}

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
  theme: ApexTheme;
};

@Component({
  selector: 'app-detail-cost',
  templateUrl: './detail-cost.component.html',
  styleUrls: ['./detail-cost.component.scss']
})
export class DetailCostComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild("bar") bar: ChartComponent;
  public chartOptionsBar: Partial<ChartOptionsBar>;
  
  public suscripcion: Subscription;
  public objReport: ObjReport;
  public windowRef: any;
  public tblRatiosXlsx;
  public tblPositionXlsx;
  public tblAcXlsx = [];
  public market = null;
  public client = null;
  public campaign = null;
  public month;
  public coin;
  public themeAc = 'light';
  public varSize ='';

  public totalActualPosition: number = 0;
  public totalObPosition: number = 0;
  public totalRftPosition: number = 0;
  public stepsize: number = 0;
  public e: number = 1;
  public p: number = 1;
  public themeActual;
  public themeCphRph;

  public Listflipped:boolean=false;
  public ListflippedTow:boolean=false;
  public spinnerGraphic = true;
  public spinnerTableRatios = true;
  public spinnerTablePosition = true;
  public spinnerTableCost = true;
  public spinnerMonth = true;
  public spinnerCoin = true;
  public position = true;

  private error: number = 0;

  private data: FSEntry[] = [];
  private dataPosition: FSEntry[] = [];
  public labelArrayCon: Array<string> = [];
  public tableDataRatios: Array<TableCost> = [];
  public tableDataPosition: Array<TableCost> = [];
  public marketArray: Array<any> = [];
  public clientArray: Array<any> = [];
  public campaignArray: Array<any> = [];
  public filtersArray: Array<UserCampaign>;
  public optionsCphRph: any;
  public valoresActual: any[] = [];
  public valoresOb: any[] = [];
  public valoresRFT: any[] = [];

  customColumn = 'indicator';
  defaultColumns = ['actual', 'ob', 'rft'];
  allColumns = [this.customColumn, ...this.defaultColumns];
  source: NbTreeGridDataSource<FSEntry>;
  sourcePosition: NbTreeGridDataSource<FSEntry>;
  public getters: NbGetters<FSEntry, FSEntry>;
  constructor(private detail: DetailService,
    private toastr: NbToastrService,
    private login: LoginService,
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>,
    private theme: NbThemeService,
    private obsSelect: obsselect,
    private windowService: NbWindowService,
    private obsreport: obsReport) {
    this.objReport = {component:null, campaing:null};
    this.filtersArray = this.login.getUserCampaing();
    this.getListFilters();
    this.detail.setYear(null);
    this.detail.setMonth(null);
    this.detail.setCountry(null);
    this.market = detail.getMarket();
    this.client = detail.getClient();
    this.campaign = detail.getCampaing();
    
    if (this.client != null) {
      this.filterSelected(null, 2);
    } else if (this.campaign != null) {
      this.filterSelected(null, 3);
    } else if (this.market != null) {
      this.filterSelected(null, 1);
    } else {
      this.getAllData(this.market, this.campaign, this.client);

      this.chartOptionsBar = {
        theme: {
          mode: 'light',
        },
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
          height: 430,
          background: this.themeAc === 'dark' ? '#222B45' : '#ffffff'
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
          categories: [],
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
    }
    this.getters = {
      dataGetter: (node: FSEntry) => node,
      childrenGetter: (node: FSEntry) => node.childEntries || undefined,
      expandedGetter: (node: FSEntry) => !!node.expanded,
    };

  }


  ngOnInit(): void {
    this.suscripcion = this.obsSelect.datos$.subscribe(datos => {
      this.market=datos.market;
      this.campaign=datos.campaign;
      this.client=datos.client;
      this.filterSelected(event, datos.type);
    });
  }

  ngOnDestroy() {
    this.suscripcion.unsubscribe();
  }

  ngAfterViewInit() {
    this.theme.getJsTheme()
      .subscribe(config => {
        this.themeActual = config;
        const themeCphRph = config.variables.profit;
        this.themeCphRph = config.variables.profit;
        var aux = this.chartOptionsBar;
        this.setOptionsCphRph(themeCphRph);
        if (config.name != 'dark') {
          $('#tablaIndi').css('color', '#000000');
          this.themeAc = 'light';
          this.chartOptionsBar = {
            colors: ["#338C85", "#9070BD", "#FA8E04"],
            theme: {
              mode: 'light',
            },
            series: [
              {
                name: "Actual",
                data: aux.series[0].data
              },
              {
                name: "OB",
                data: aux.series[1].data
              },
              {
                name: "RFT",
                data: aux.series[2].data
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
              text: "CPH & RPH EUR",
              align: "left"
            },
          };
        } else {
          $('#tablaIndi').css('color', '#ffffff');
          this.themeAc = config.name;
          this.chartOptionsBar = {
            colors: ["#338C85", "#9070BD", "#FA8E04"],
            theme: {
              mode: 'dark',
            },
            series: [
              {
                name: "Actual",
                data: aux.series[0].data
              },
              {
                name: "OB",
                data: aux.series[1].data
              },
              {
                name: "RFT",
                data: aux.series[2].data
              }
            ],
            chart: {
              type: "bar",
              height: 430,
              background: '#222B45'
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
              text: "CPH & RPH EUR",
              align: "left"
            },
          };
        }
      });
  }

  setOptionsCphRph(eTheme) {
    var aux = this.chartOptionsBar;
    this.optionsCphRph = {
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
          data: this.labelArrayCon,
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
          data: this.valoresActual,
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
          data: this.valoresOb,
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
          data: this.valoresRFT,
        },
      ],
    };
  }

  getDetailCost(market, campaign, client, caseType) {

    this.detail.getDetailCost(market, campaign, client, caseType).then((res: any) => {
      var bol: Boolean;
      var bolDos: Boolean;
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
                this.valoresActual.push(detail.Valor);
                break;
              case 'OB':
                this.valoresOb.push(detail.Valor);
                break;
              case 'RFT':
                this.valoresRFT.push(detail.Valor);
                break;
            }

          });
          console.log(res);
          this.setOptionsCphRph(this.themeCphRph);
          this.spinnerGraphic = false;
        } else if (caseType == 3) {


          res.Result.forEach(data => {
            bol = false;
            if (this.tableDataRatios.length > 0) {
              for (var i = 0; i < this.tableDataRatios.length; i++) {
                if (this.tableDataRatios[i].indicator == data.Concepto) {
                  bol = true;
                  switch (data.Indicador2) {
                    case 'Actual':
                      this.tableDataRatios[i].actual = data.Valor;
                      break;
                    case 'OB':
                      this.tableDataRatios[i].ob = data.Valor;
                      break;
                    case 'RFT':
                      this.tableDataRatios[i].rft = data.Valor;
                      break;
                  }
                }
              }
              if (bol != true) {
                switch (data.Indicador2) {
                  case 'Actual':
                    this.tableDataRatios.push({ indicator: data.Concepto, actual: data.Valor, ob: 0, rft: 0 });
                    break;
                  case 'OB':
                    this.tableDataRatios.push({ indicator: data.Concepto, actual: 0, ob: data.Valor, rft: 0 });
                    break;
                  case 'RFT':
                    this.tableDataRatios.push({ indicator: data.Concepto, actual: 0, ob: 0, rft: data.Valor });
                    break;
                }
              }
            } else {
              switch (data.Indicador2) {
                case 'Actual':
                  this.tableDataRatios.push({ indicator: data.Concepto, actual: data.Valor, ob: 0, rft: 0 });
                  break;
                case 'OB':
                  this.tableDataRatios.push({ indicator: data.Concepto, actual: 0, ob: data.Valor, rft: 0 });
                  break;
                case 'RFT':
                  this.tableDataRatios.push({ indicator: data.Concepto, actual: 0, ob: 0, rft: data.Valor });
                  break;
              }
            }
          });
          this.tblRatiosXlsx = this.tableDataRatios;
          if (this.themeAc != 'dark') {
            $('#tablaIndi').css('color', '#000000');
          } else {
            $('#tablaIndi').css('color', '#ffffff');
          }
          this.spinnerTableRatios = false;
        } else if (caseType == 4) {
          this.dataPosition.push({ indicator: 'Position', actual: 0, ob: 0, rft: 0, expanded: true })
          res.Result.forEach(data => {
            bol = false;
            if (this.tableDataPosition.length > 0) {
              for (var i = 0; i < this.tableDataPosition.length; i++) {
                if (this.tableDataPosition[i].indicator == data.Concepto) {
                  bol = true;
                  switch (data.Indicador2) {
                    case 'Actual':
                      this.tableDataPosition[i].actual = data.Valor;
                      this.totalActualPosition += data.Valor;
                      break;
                    case 'OB':
                      this.tableDataPosition[i].ob = data.Valor;
                      this.totalObPosition += data.Valor;
                      break;
                    case 'RFT':
                      this.tableDataPosition[i].rft = data.Valor;
                      this.totalRftPosition += data.Valor;
                      break;
                  }
                }
              }
              if (bol != true) {
                switch (data.Indicador2) {
                  case 'Actual':
                    this.tableDataPosition.push({ indicator: data.Concepto, actual: data.Valor, ob: 0, rft: 0 });
                    this.totalActualPosition += data.Valor;
                    break;
                  case 'OB':
                    this.tableDataPosition.push({ indicator: data.Concepto, actual: 0, ob: data.Valor, rft: 0 });
                    this.totalObPosition += data.Valor;
                    break;
                  case 'RFT':
                    this.tableDataPosition.push({ indicator: data.Concepto, actual: 0, ob: 0, rft: data.Valor });
                    this.totalRftPosition += data.Valor;
                    break;
                }
              }
            } else {
              switch (data.Indicador2) {
                case 'Actual':
                  this.tableDataPosition.push({ indicator: data.Concepto, actual: data.Valor, ob: 0, rft: 0 });
                  this.totalActualPosition += data.Valor;
                  break;
                case 'OB':
                  this.tableDataPosition.push({ indicator: data.Concepto, actual: 0, ob: data.Valor, rft: 0 });
                  this.totalObPosition += data.Valor;
                  break;
                case 'RFT':
                  this.tableDataPosition.push({ indicator: data.Concepto, actual: 0, ob: 0, rft: data.Valor });
                  this.totalRftPosition += data.Valor;
                  break;
              }
            }
          });
          this.dataPosition[0].childEntries = this.tableDataPosition;
          this.dataPosition[0].actual = this.totalActualPosition;
          this.dataPosition[0].ob = this.totalObPosition;
          this.dataPosition[0].rft = this.totalRftPosition;
          this.sourcePosition = this.dataSourceBuilder.create(this.dataPosition, this.getters);
          this.tblPositionXlsx = this.tableDataPosition;
          this.spinnerTablePosition = false;
        } else if (caseType == 5) {
          res.Result.forEach(data => {
            bol = false;
            bolDos = false;
            if (this.data.length > 0) {
              for (var i = 0; i < this.data.length; i++) {
                bol = false;
                if (this.data[i].indicator == data.Indicador3) {
                  bolDos = true;
                  for (var j = 0; j < this.data[i].childEntries.length; j++) {
                    if (this.data[i].childEntries[j].indicator == data.Concepto) {
                      bol = true;
                      switch (data.Indicador2) {
                        case 'Actual':
                          this.data[i].childEntries[j].actual = data.Valor;
                          this.data[i].actual += data.Valor;
                          break;
                        case 'OB':
                          this.data[i].childEntries[j].ob = data.Valor;
                          this.data[i].ob += data.Valor;
                          break;
                        case 'RFT':
                          this.data[i].childEntries[j].rft = data.Valor;
                          this.data[i].rft += data.Valor;
                          break;
                      }
                    }
                  }
                  if (bol != true) {
                    switch (data.Indicador2) {
                      case 'Actual':
                        this.data[i].childEntries.push({
                          indicator: data.Concepto, actual: data.Valor, ob: 0, rft: 0
                        });
                        this.data[i].actual += data.Valor;
                        break;
                      case 'OB':
                        this.data[i].childEntries.push({
                          indicator: data.Concepto, actual: 0, ob: data.Valor, rft: 0
                        });
                        this.data[i].ob += data.Valor;
                        break;
                      case 'RFT':
                        this.data[i].childEntries.push({
                          indicator: data.Concepto, actual: 0, ob: 0, rft: data.Valor
                        });
                        this.data[i].rft += data.Valor;
                        break;
                    }
                  }
                }

              }
              if (bolDos != true) {
                switch (data.Indicador2) {
                  case 'Actual':
                    this.data.push({
                      indicator: data.Indicador3, actual: data.Valor, ob: 0, rft: 0, childEntries: [
                        { indicator: data.Concepto, actual: data.Valor, ob: 0, rft: 0 }
                      ]
                    });
                    break;
                  case 'OB':
                    this.data.push({
                      indicator: data.Indicador3, actual: 0, ob: data.Valor, rft: 0, childEntries: [
                        { indicator: data.Concepto, actual: 0, ob: data.Valor, rft: 0 }
                      ]
                    });
                    break;
                  case 'RFT':
                    this.data.push({
                      indicator: data.Indicador3, actual: 0, ob: 0, rft: data.Valor, childEntries: [
                        { indicator: data.Concepto, actual: 0, ob: 0, rft: data.Valor }
                      ]
                    });
                    break;
                }
              }
            } else {
              switch (data.Indicador2) {
                case 'Actual':
                  this.data.push({
                    indicator: data.Indicador3, actual: data.Valor, ob: 0, rft: 0, childEntries: [
                      { indicator: data.Concepto, actual: data.Valor, ob: 0, rft: 0 }
                    ],
                  });
                  break;
                case 'OB':
                  this.data.push({
                    indicator: data.Indicador3, actual: 0, ob: data.Valor, rft: 0, childEntries: [
                      { indicator: data.Concepto, actual: 0, ob: data.Valor, rft: 0 }
                    ]
                  });
                  break;
                case 'RFT':
                  this.data.push({
                    indicator: data.Indicador3, actual: 0, ob: 0, rft: data.Valor, childEntries: [
                      { indicator: data.Concepto, actual: 0, ob: 0, rft: data.Valor }
                    ]
                  });
                  break;
              }
            }
          });

          this.source = this.dataSourceBuilder.create(this.data, this.getters);
          this.tblAcXlsx = this.data[0].childEntries.concat(this.data[1].childEntries.concat(this.data[2].childEntries));
          this.spinnerTableCost = false;
        } else if (caseType == 6) {
          this.month = res.Result[0].Month;
          this.spinnerMonth = false;
        } else if (caseType == 7) {
          this.coin = res.Result[0].Moneda;
          this.spinnerCoin = false;
        }
      } else {
        this.error += 1;

        switch (caseType) {
          case 2:

            break;
          case 3:
            break;
          case 4:
            break;
          case 5:
            break;
          case 6:
            this.month = 'No data';
            break;
          case 7:
            this.coin = 'No data';
            break;
          default:
            break;
        }
      }
      if (caseType == 7) {
        if (this.error > 0) {
          this.toastr.warning('No Data', 'Wrong');
          this.error = 0;
        }
      }
    }, err => {
      console.log('Error');
    });
  }

  getAllData(market, campaign, client) {

    this.getDetailCost(market, campaign, client, 2);
    this.getDetailCost(market, campaign, client, 3);
    this.getDetailCost(market, campaign, client, 4);
    this.getDetailCost(market, campaign, client, 5);
    this.getDetailCost(market, campaign, client, 6);
    this.getDetailCost(market, campaign, client, 7);
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

  filterSelected(event, num) {
    this.error = 0;
    this.resetList(num);
    this.getAllData(this.market, this.campaign, this.client);
    this.getListFilters();
    this.detail.setMarket(this.market);
    this.detail.setCampaing(this.campaign);
    this.detail.setClient(this.client);
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
    this.labelArrayCon = [];
    this.valoresActual = [];
    this.valoresOb = [];
    this.valoresRFT = [];
    this.tableDataRatios = [];
    this.tableDataPosition = [];
    this.data = [];
    this.source = this.dataSourceBuilder.create(this.data, this.getters);
    this.dataPosition = [];
    this.sourcePosition = this.dataSourceBuilder.create(this.dataPosition, this.getters);
  }

  generateXlxs(num) {
    switch (num) {
      case 1:
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tblRatiosXlsx);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'CostRatios');

        /* save to file */
        XLSX.writeFile(wb, 'CostRatios.xlsx');
        break;
      case 2:
        const wsPos: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tblPositionXlsx);
        /* generate workbook and add the worksheet */
        const wbPos: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wbPos, wsPos, 'CostPosition');

        /* save to file */
        XLSX.writeFile(wbPos, 'CostPosition.xlsx');
        break;
      case 3:
        const wsAc: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tblAcXlsx);
        /* generate workbook and add the worksheet */
        const wbAc: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wbAc, wsAc, 'CostAccountingAcconunts');

        /* save to file */
        XLSX.writeFile(wbAc, 'CostAccountingAcconunts.xlsx');
        break;
    }

  }

  toggleView() {
    this.Listflipped = !this.Listflipped;   
  }

  toggleViewTow(){   
    this.ListflippedTow = !this.ListflippedTow;
    if(this.ListflippedTow===true && this.position===true){
      this.varSize="large";
    }else{
      this.varSize="";
    }
  }

  changeT(){
    if(this.varSize===""){
      this.varSize="large";
      this.position=true;
    }else{
      this.varSize="";
      this.position=false;
    }
  }

  generateReport() {
    this.windowRef = this.windowService.open(ReportIncidentComponent, { title: `Report` });
    this.objReport.component=this.windowRef;
    this.obsreport.datos$.emit(this.objReport);
  }
}