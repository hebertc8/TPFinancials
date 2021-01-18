import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Options } from 'ng5-slider';
import * as XLSX from 'xlsx';
import * as $ from 'jquery';
import { obsselectcgp } from 'src/app/services/obs-select-cgp';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexFill,
  ApexTooltip,
  ApexXAxis,
  ApexLegend,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexTheme
} from "ng-apexcharts";
import { SummaryService } from 'src/app/services/summary.service';
import { LoginService } from 'src/app/services/login.service';
import { version } from 'process';
import { NbToastrService, NbThemeService } from '@nebular/theme';
import { graphic } from 'echarts';
import { ObjSelectcgp } from 'src/app/services/interfaces';
import { Subscription } from 'rxjs';

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
  selector: 'app-cgp',
  templateUrl: './cgp.component.html',
  styleUrls: ['./cgp.component.scss']
})
export class CgpComponent implements OnInit, AfterViewInit {

  public spinnerActualPro: Boolean = true;
  public spinnerVariation: Boolean = true;
  public spinnerTblAP: Boolean = true;
  public spinnerTblVaria: Boolean = true;
  public spinnerTblPointVar: Boolean = true;
  public revealed: Boolean = true;
  public revealedTow: Boolean = true;

  public tableApArray: Array<any> = [];
  public tableVariArray: Array<any> = [];
  public tableGrafBarArray: Array<any> = [];
  public tableGrafVarArray: Array<any> = [];
  public tablePointVarArray: Array<any> = [];
  public subArray: Array<any> = [];
  public countryArray: Array<any> = [];
  public regionArray: Array<any> = [];
  public filtersArray: Array<any> = [];
  public labelArrayActualProjections: Array<string> = [];
  public labelArrayVariation: Array<string> = [];

  public sub: Array<any> = [];
  public country: Array<any> = [];
  public region: Array<any> = [];
  public optionsActualProjections: any;
  public themeActualProjections;
  public netArray: any[] = []
  public grossArray: any[] = [];
  public sgaArray: any[] = [];
  public depreArray: any[] = [];
  public ebitArray: any[] = [];
  public themeActual;

  public optionsVariation: any;
  public themeVariation;
  public netArrayVariation: any[] = []
  public grossArrayVariation: any[] = [];
  public sgaArrayVariation: any[] = [];
  public depreArrayVariation: any[] = [];
  public ebitArrayVariation: any[] = [];
  public obsSelgcp: ObjSelectcgp;
  public suscripcion: Subscription;
  // public sub;
  // public country;
  public themeAc = 'light';
  public error: number = 0;

  @ViewChild("bar") bar: ChartComponent;
  public chartOptionsBar: Partial<ChartOptionsBar>;

  @ViewChild("barVariation") variation: ChartComponent;
  public chartOptionsVariation: Partial<ChartOptionsBar>;


  constructor(private summaryservice: SummaryService,
    private login: LoginService,
    private toastr: NbToastrService,
    private theme: NbThemeService,
    private obsSelectCgp:obsselectcgp) {
    this.obsSelgcp={country:[], region:[], sub:[]}
    this.chartOptionsBar = {
      theme: {
        mode: this.themeAc === 'dark' ? 'dark' : 'light',
      },
      colors: ["#338C85", "#9070BD", "#FA8E04", "#8AD4EB", "#34C6BB"],
      series: [
        {
          name: "NetRev",
          data: []
        },
        {
          name: "Gross",
          data: []
        },
        {
          name: "SGA",
          data: []
        },
        {
          name: "Depreciation",
          data: []
        },
        {
          name: "EBIT",
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
        text: "Actual and Projections",
        align: "left"
      },
    };

    this.chartOptionsVariation = {
      theme: {
        mode: this.themeAc === 'dark' ? 'dark' : 'light',
      },
      colors: ["#338C85", "#9070BD", "#FA8E04", "#8AD4EB", "#34C6BB"],
      series: [
        {
          name: "NetRev",
          data: []
        },
        {
          name: "Gross",
          data: []
        },
        {
          name: "SGA",
          data: []
        },
        {
          name: "Depreciation",
          data: []
        },
        {
          name: "EBIT",
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

        },
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
        text: "Variation",
        align: "left"
      },

    };

    this.getCgp(null, null, null, 5);
    // this.getAllData('colombia', 'SISA', 'colombia');

  }
  
  ngOnInit(): void {
    this.suscripcion = this.obsSelectCgp.datos$.subscribe(datos => {
      this.country=datos.country;
      this.region=datos.region;
      this.sub=datos.sub;
      this.filterSelected(0);
    });
  }

  ngAfterViewInit() {
    this.theme.getJsTheme()
      .subscribe(config => {
        this.themeActual = config;
        const themeActualProjections = config.variables.profit;
        this.themeActualProjections = config.variables.profit;
        const themeVariation = config.variables.profit;
        this.themeVariation = config.variables.profit;
        this.setOptionActualProjections(themeActualProjections);
        var aux = this.chartOptionsBar;
        var vari = this.chartOptionsVariation;
        if (config.name != 'dark') {
          $('#tablaUno').css('color', '#000000');
          $('#tablaDos').css('color', '#000000');
          $('#tablaTres').css('color', '#000000');
          $('#tablaCuatro').css('color', '#000000');
          $('#tablaCinco').css('color', '#000000');
          this.themeAc = 'light';
          this.chartOptionsBar = {
            theme: {
              mode: 'light',
            },
            colors: ["#338C85", "#9070BD", "#FA8E04", "#8AD4EB", "#34C6BB"],
            series: [
              {
                name: "NetRev",
                data: aux.series[0].data
              },
              {
                name: "Gross",
                data: aux.series[1].data
              },
              {
                name: "SGA",
                data: aux.series[2].data
              },
              {
                name: "Depreciation",
                data: aux.series[3].data
              },
              {
                name: "EBIT",
                data: aux.series[4].data
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
              categories: aux.xaxis.categories,
            },
            yaxis: {
              labels: {
                formatter: (value) => { return value.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
              }
            },
            title: {
              text: "Actual and Projections",
              align: "left"
            },
          };
          this.chartOptionsVariation = {
            theme: {
              mode: 'light',
            },
            colors: ["#338C85", "#9070BD", "#FA8E04", "#8AD4EB", "#34C6BB"],
            series: [
              {
                name: "NetRev",
                data: vari.series[0].data
              },
              {
                name: "Gross",
                data: vari.series[1].data
              },
              {
                name: "SGA",
                data: vari.series[2].data
              },
              {
                name: "Depreciation",
                data: vari.series[3].data
              },
              {
                name: "EBIT",
                data: vari.series[4].data

              }
            ],
            chart: {
              type: "bar",
              height: 430,
            },
            plotOptions: {
              bar: {
                horizontal: false,
                dataLabels: {
                  position: "top"
                }

              },
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
              categories: vari.xaxis.categories,
            },
            yaxis: {
              labels: {
                formatter: (value) => { return value.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
              }
            },
            title: {
              text: "Variation",
              align: "left"
            },

          };
        } else {
          $('#tablaUno').css('color', '#ffffff');
          $('#tablaDos').css('color', '#ffffff');
          $('#tablaTres').css('color', '#ffffff');
          $('#tablaCuatro').css('color', '#ffffff');
          $('#tablaCinco').css('color', '#ffffff');
          this.themeAc = config.name;
          this.chartOptionsBar = {
            theme: {
              mode: 'dark',
            },
            colors: ["#338C85", "#9070BD", "#FA8E04", "#8AD4EB", "#34C6BB"],
            series: [
              {
                name: "NetRev",
                data: aux.series[0].data
              },
              {
                name: "Gross",
                data: aux.series[1].data
              },
              {
                name: "SGA",
                data: aux.series[2].data
              },
              {
                name: "Depreciation",
                data: aux.series[3].data
              },
              {
                name: "EBIT",
                data: aux.series[4].data
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
              categories: aux.xaxis.categories,
            },
            yaxis: {
              labels: {
                formatter: (value) => { return value.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
              }
            },
            title: {
              text: "Actual and Projections",
              align: "left"
            },
          };
          this.chartOptionsVariation = {
            theme: {
              mode: 'dark',
            },
            colors: ["#338C85", "#9070BD", "#FA8E04", "#8AD4EB", "#34C6BB"],
            series: [
              {
                name: "NetRev",
                data: vari.series[0].data
              },
              {
                name: "Gross",
                data: vari.series[1].data
              },
              {
                name: "SGA",
                data: vari.series[2].data
              },
              {
                name: "Depreciation",
                data: vari.series[3].data
              },
              {
                name: "EBIT",
                data: vari.series[4].data

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

              },
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
              categories: vari.xaxis.categories,
            },
            yaxis: {
              labels: {
                formatter: (value) => { return value.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
              }
            },
            title: {
              text: "Variation",
              align: "left"
            },

          };
        }
      });
  }

  setOptionActualProjections(eTheme){
    this.optionsActualProjections = {
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
        data: ['NetRev', 'Gross', 'SGA', 'Depreciation', 'EBIT'],
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
          data: this.labelArrayActualProjections,
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
            fontSize: 9,
            
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
          name: 'NetRev',
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
          data: this.netArray,
        },
        {
          name: 'Gross',
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
          data: this.grossArray,
        },
        {
          name: 'SGA',
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
          data: this.sgaArray,
        },
        {
          name: 'Depreciation',
          type: 'bar',
          barGap: 0,
          barWidth: '20%',
          itemStyle: {
            normal: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: "#8AD4EB",
              }, {
                offset: 1,
                color: "#8AD4EB",
              }]),
            },
          },
          animationDelay: idx => idx * 10 + 100,
          data: this.depreArray,
        },
        {
          name: 'EBIT',
          type: 'bar',
          barGap: 0,
          barWidth: '20%',
          itemStyle: {
            normal: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: "#34C6BB",
              }, {
                offset: 1,
                color: "#34C6BB",
              }]),
            },
          },
          animationDelay: idx => idx * 10 + 100,
          data: this.ebitArray,
        }
      ],
    };
  }

  setOptionsVariation(eTheme){
    this.optionsVariation = {
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
        data: ['NetRev', 'Gross', 'SGA', 'Depreciation', 'EBIT'],
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
          data: this.labelArrayVariation,
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
            fontSize: 9,
            
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
          name: 'NetRev',
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
          data: this.netArrayVariation,
        },
        {
          name: 'Gross',
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
          data: this.grossArrayVariation,
        },
        {
          name: 'SGA',
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
          data: this.sgaArrayVariation,
        },
        {
          name: 'Depreciation',
          type: 'bar',
          barGap: 0,
          barWidth: '20%',
          itemStyle: {
            normal: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: "#8AD4EB",
              }, {
                offset: 1,
                color: "#8AD4EB",
              }]),
            },
          },
          animationDelay: idx => idx * 10 + 100,
          data: this.depreArrayVariation,
        },
        {
          name: 'EBIT',
          type: 'bar',
          barGap: 0,
          barWidth: '20%',
          itemStyle: {
            normal: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: "#34C6BB",
              }, {
                offset: 1,
                color: "#34C6BB",
              }]),
            },
          },
          animationDelay: idx => idx * 10 + 100,
          data: this.ebitArrayVariation,
        }
      ],
    };
  }

  getCgp(country, region, sub, caseType) {
    this.summaryservice.getCgp(country, region, sub, caseType).then((res: any) => {
      var bol: Boolean;
      if (res.Result) {
        if (caseType == 1) {
          // var labelArrayCon = [];
          var netArray = [];
          var grossArray = [];
          var sgaArray = [];
          var depreArray = [];
          var ebitArray = [];
          res.Result.forEach(element => {
            bol = false;
            if (this.labelArrayActualProjections.length > 0) {
              for (var i = 0; i < this.labelArrayActualProjections.length; i++) {
                if (this.labelArrayActualProjections[i] == element.VERSION) {
                  bol = true;
                }
              };
              if (bol != true) {
                this.tableGrafBarArray.push({ version: element.VERSION, netrev: element.NetRev, gross: element.Gross, sga: element.SGA, depreciation: element.Depreciation, ebit: element.EBIT });
                this.labelArrayActualProjections.push(element.VERSION)
                this.netArray.push(element.NetRev);
                this.grossArray.push(element.Gross);
                this.sgaArray.push(element.SGA);
                this.depreArray.push(element.Depreciation);
                this.ebitArray.push(element.EBIT);
              }
            } else {
              this.tableGrafBarArray.push({ version: element.VERSION, netrev: element.NetRev, gross: element.Gross, sga: element.SGA, depreciation: element.Depreciation, ebit: element.EBIT });
              this.labelArrayActualProjections.push(element.VERSION)
              this.netArray.push(element.NetRev);
              this.grossArray.push(element.Gross);
              this.sgaArray.push(element.SGA);
              this.depreArray.push(element.Depreciation);
              this.ebitArray.push(element.EBIT);
            }
          });
          if (this.themeAc != 'dark') {
            $('#tablaUno').css('color', '#000000');
          } else {
            $('#tablaUno').css('color', '#ffffff');
          }
          this.chartOptionsBar = {
            theme: {
              mode: this.themeAc === 'dark' ? 'dark' : 'light',
            },
            colors: ["#338C85", "#9070BD", "#FA8E04", "#8AD4EB", "#34C6BB"],
            series: [
              {
                name: "NetRev",
                data: this.netArray
              },
              {
                name: "Gross",
                data: this.grossArray
              },
              {
                name: "SGA",
                data: this.sgaArray
              },
              {
                name: "Depreciation",
                data: this.depreArray
              },
              {
                name: "EBIT",
                data: this.ebitArray
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
              categories: this.labelArrayActualProjections,
            },
            yaxis: {
              labels: {
                formatter: (value) => { return value.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
              }
            },
            title: {
              text: "Actual and Projections",
              align: "left"
            },
          };
          console.log(this.labelArrayActualProjections);
          this.setOptionActualProjections(this.themeActualProjections);
          this.spinnerActualPro = false;
        } else if (caseType == 2) {
          // var labelArrayCon = [];
          var netArray = [];
          var grossArray = [];
          var sgaArray = [];
          var depreArray = [];
          var ebitArray = [];
          res.Result.forEach(element => {
            bol = false;
            if (this.labelArrayVariation.length > 0) {
              for (var i = 0; i < this.labelArrayVariation.length; i++) {
                if (this.labelArrayVariation[i] == element.VERSION) {
                  bol = true;
                }
              };
              if (bol != true) {
                this.tableGrafVarArray.push({ version: element.VERSION, netrev: element.NetRev, gross: element.Gross, sga: element.SGA, depreciation: element.Depreciation, ebit: element.EBIT });
                this.labelArrayVariation.push(element.VERSION)
                this.netArrayVariation.push(element.NetRev);
                this.grossArrayVariation.push(element.Gross);
                this.sgaArrayVariation.push(element.SGA);
                this.depreArrayVariation.push(element.Depreciation);
                this.ebitArrayVariation.push(element.EBIT);
              }
            } else {
              this.tableGrafVarArray.push({ version: element.VERSION, netrev: element.NetRev, gross: element.Gross, sga: element.SGA, depreciation: element.Depreciation, ebit: element.EBIT });
              this.labelArrayVariation.push(element.VERSION)
              this.netArrayVariation.push(element.NetRev);
              this.grossArrayVariation.push(element.Gross);
              this.sgaArrayVariation.push(element.SGA);
              this.depreArrayVariation.push(element.Depreciation);
              this.ebitArrayVariation.push(element.EBIT);
            }
          });
          if (this.themeAc != 'dark') {
            $('#tablaTres').css('color', '#000000');
          } else {
            $('#tablaTres').css('color', '#ffffff');
          }
          this.chartOptionsVariation = {
            theme: {
              mode: this.themeAc === 'dark' ? 'dark' : 'light',
            },
            colors: ["#338C85", "#9070BD", "#FA8E04", "#8AD4EB", "#34C6BB"],
            series: [
              {
                name: "NetRev",
                data: this.netArray
              },
              {
                name: "Gross",
                data: this.grossArray
              },
              {
                name: "SGA",
                data: this.sgaArray
              },
              {
                name: "Depreciation",
                data: this.depreArray
              },
              {
                name: "EBIT",
                data: this.ebitArray

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

              },
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
              categories: this.labelArrayVariation,
            },
            yaxis: {
              labels: {
                formatter: (value) => { return value.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
              }
            },
            title: {
              text: "Variation",
              align: "left"
            },

          };
          this.setOptionsVariation(this.themeVariation);
          this.spinnerVariation = false;
        } else if (caseType == 3) {
          // this.tblActXlsx = [res.Result[0]];
          res.Result.forEach(element => {
            bol = false;
            if (this.tableApArray.length > 0) {
              for (var i = 0; i < this.tableApArray.length; i++) {
                if (this.tableApArray[i].version == element.VERSION) {
                  bol = true;
                }
              };
              if (bol != true) {
                this.tableApArray.push({ version: element.VERSION, gross: element.Gross * 100, sga: element.SGA * 100, depreciation: element.Depreciation * 100, ebit: element.EBIT * 100 });
              }
            } else {
              this.tableApArray.push({ version: element.VERSION, gross: element.Gross * 100, sga: element.SGA * 100, depreciation: element.Depreciation * 100, ebit: element.EBIT * 100 });
            }
          });
          if (this.themeAc != 'dark') {
            $('#tablaDos').css('color', '#000000');
          } else {
            $('#tablaDos').css('color', '#ffffff');
          }
          this.spinnerTblAP = false;
        } else if (caseType == 4) {
          res.Result.forEach(element => {
            bol = false;
            if (this.tableVariArray.length > 0) {
              for (var i = 0; i < this.tableVariArray.length; i++) {
                if (this.tableVariArray[i].version == element.VERSION) {
                  bol = true;
                }
              };
              if (bol != true) {
                this.tableVariArray.push({ version: element.VERSION, gross: element.Gross * 100, sga: element.SGA * 100, depreciation: element.Depreciation * 100, ebit: element.EBIT * 100, net: element.NetRev * 100 });

              }
            } else {
              this.tableVariArray.push({ version: element.VERSION, gross: element.Gross * 100, sga: element.SGA * 100, depreciation: element.Depreciation * 100, ebit: element.EBIT * 100, net: element.NetRev * 100 });
            }

          });
          if (this.themeAc != 'dark') {
            $('#tablaCuatro').css('color', '#000000');
          } else {
            $('#tablaCuatro').css('color', '#ffffff');
          }
          this.spinnerTblVaria = false;
        } else if (caseType == 5) {
          this.filtersArray = res.Result;
          this.getListFilters();
          this.country = this.summaryservice.getCountry();
          this.region = this.summaryservice.getRegion();
          this.sub = this.summaryservice.getSub();
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
          this.getAllData(coun, reg, sub);
        } else if (caseType == 6) {
          res.Result.forEach(element => {
            bol = false;
            if (this.tablePointVarArray.length > 0) {
              for (var i = 0; i < this.tablePointVarArray.length; i++) {
                if (this.tablePointVarArray[i].version == element.VERSION) {
                  bol = true;
                }
              };
              if (bol != true) {
                this.tablePointVarArray.push({ version: element.VERSION, gross: element.Gross, sga: element.SGA, depreciation: element.Depreciation, ebit: element.EBIT });
              }
            } else {
              this.tablePointVarArray.push({ version: element.VERSION, gross: element.Gross, sga: element.SGA, depreciation: element.Depreciation, ebit: element.EBIT });
            }
          });
          if (this.themeAc != 'dark') {
            $('#tablaCinco').css('color', '#000000');
          } else {
            $('#tablaCinco').css('color', '#ffffff');
          }
          this.spinnerTblPointVar = false;
        }

      } else {
        this.error += 1;
        switch (caseType) {
          case 1:
            this.chartOptionsBar.series = []
            break;
          case 2:
            this.chartOptionsVariation.series = []
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
      if (caseType == 5) {
        if (this.error > 0) {
          this.toastr.warning('No Data', 'Wrong');
          this.error = 0;
        }
      }
    })
  }

  getAllData(country, region, sub) {
    this.getCgp(country, region, sub, 1);
    this.getCgp(country, region, sub, 2);
    this.getCgp(country, region, sub, 3);
    this.getCgp(country, region, sub, 4);
    this.getCgp(country, region, sub, 6);
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

  filterSelected(num) {
    this.error = 0;

    this.resetList(num);
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
    this.getAllData(coun, reg, sub);
    // this.getListFilters();
    this.summaryservice.setCountry(this.country);
    this.summaryservice.setRegion(this.region);
    this.summaryservice.setSub(this.sub);
    this.obsSelgcp.country=this.country;
    this.obsSelgcp.region=this.region;
    this.obsSelgcp.sub=this.sub;
    // this.obsSelectCgp.datos$.emit(this.obsSelgcp);
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
    this.labelArrayActualProjections = [];
    this.netArray = [];
    this.grossArray = [];
    this.sgaArray = [];
    this.depreArray = [];
    this.ebitArray = [];
    this.labelArrayVariation = [];
    this.netArrayVariation = [];
    this.grossArray = [];
    this.sgaArrayVariation = [];
    this.depreArrayVariation = [];
    this.ebitArrayVariation = [];
    this.tableApArray = [];
    this.tableVariArray = [];
    this.tablePointVarArray = [];
    this.tableGrafBarArray = [];
    this.tableGrafVarArray = [];
    this.spinnerActualPro = true;
    this.spinnerVariation = true;
    this.spinnerTblAP = true;
    this.spinnerTblVaria = true;
    this.spinnerTblPointVar = true;
  }

  toggleView() {
    this.revealed = !this.revealed;
  }

  toggleViewTwo() {
    this.revealedTow = !this.revealedTow;
  }

  generateXlxs(num) {
    // switch (num) {
    //   case 1:
    //     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tblActXlsx);
    //     console.log('worksheet', ws);
    //     /* generate workbook and add the worksheet */
    //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'SummaryActualEur');

    //     /* save to file */
    //     XLSX.writeFile(wb, 'SummaryActualEur.xlsx');
    //     break;
    //   case 2:
    //     const wsOb: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tblObXlsx);
    //     console.log('worksheet', wsOb);
    //     /* generate workbook and add the worksheet */
    //     const wbOb: XLSX.WorkBook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wbOb, wsOb, 'SummaryObEur');

    //     /* save to file */
    //     XLSX.writeFile(wbOb, 'SummaryObEur.xlsx');
    //     break;
    //   case 3:
    //     const wsRft: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tblRftXlsx);
    //     console.log('worksheet', wsRft);
    //     /* generate workbook and add the worksheet */
    //     const wbRft: XLSX.WorkBook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wbRft, wsRft, 'SummaryRftEur');

    //     /* save to file */
    //     XLSX.writeFile(wbRft, 'SummaryRftEur.xlsx');
    //     break;
    // }

  }
}