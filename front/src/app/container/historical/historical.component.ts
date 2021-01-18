import { Component, OnInit, ViewChild } from '@angular/core';
import { RequestsService } from 'src/app/services/requests.service';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { SummaryService } from 'src/app/services/summary.service';
import { UserCampaign } from 'src/app/services/interfaces';
import { LoginService } from 'src/app/services/login.service';
import { Label } from 'ng2-charts';
import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { DetailService } from 'src/app/services/detail.service';
import * as XLSX from 'xlsx';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexPlotOptions, ApexXAxis, ApexYAxis, ApexStroke, ApexTitleSubtitle, ChartComponent } from 'ng-apexcharts';

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
  selector: 'app-historical',
  templateUrl: './historical.component.html',
  styleUrls: ['./historical.component.scss']
})
export class HistoricalComponent implements OnInit {

  @ViewChild("rev") rev: ChartComponent;
  public chartOptionsRev: Partial<ChartOptionsBar>;

  @ViewChild("dc") dc: ChartComponent;
  public chartOptionsDc: Partial<ChartOptionsBar>;

  @ViewChild("gm") gm: ChartComponent;
  public chartOptionsGm: Partial<ChartOptionsBar>;

  public tblActXlsx;
  public tblObXlsx;
  public tblRftXlsx;
  public tblLastMXlsx;
  public tblLastYXlsx;
  public tblLastYMXlsx;
  public year;
  public month;
  public country = null;
  public market = null;
  public client = null;
  public campaign = null;
  public eurOb;
  public eurAct;
  public lastMonth;
  public lastYear;
  public nowMonth;
  public nowYear;

  public spinnerActual: Boolean = true;
  public spinnerOb: Boolean = true;
  public spinnerRft: Boolean = true;
  public spinnerCost: Boolean = true;
  public spinnerNetReve: Boolean = true;
  public spinnerGM: Boolean = true;
  public spinnerEur: Boolean = true;
  public spinnerLastMonth: Boolean = true;
  public spinnerLastYear: Boolean = true;
  public spinnerLastYM: Boolean = true;

  public tableActual: Array<any> = [];
  public tableOb: Array<any> = [];
  public tableRft: Array<any> = [];
  public tableLastMonth: Array<any> = [];
  public tableLastYear: Array<any> = [];
  public tableLastYearMonth: Array<any> = [];
  public yearArray: Array<any> = [];
  public monthArray: Array<any> = [];
  public countryArray: Array<any> = [];
  public marketArray: Array<any> = [];
  public clientArray: Array<any> = [];
  public campaignArray: Array<any> = [];
  public dateArray: Array<any> = [];
  public filtersArray: Array<UserCampaign>;
  public labelArray: Array<string> = [];

  private error: number = 0;


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
    this.getMonth();
    this.year = new Date().getFullYear();
    this.getAllData(this.year, this.month, this.country, this.market, this.campaign, this.client);
    this.getListFilters();
    this.getListDate(login.getUser().username, 2);
    this.getListDate(login.getUser().username, 3);
    this.getListDate(login.getUser().username, 4);

    this.chartOptionsDc = {
      colors: ["#338C85", "#34C6BB", "#8AD4EB", "#35d483", "#9070BD", "#FA8E04"],
      series: [
        {
          name: "Actual",
          data: []
        },
        {
          name: "Year-1",
          data: []
        },
        {
          name: "Month-1",
          data: []
        },
        {
          name: "Year-1 & Month-1",
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
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            position: "top"
          },

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
        categories: 'Value',

      },
      yaxis: {
        labels: {
          formatter: (value) => { return value.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
        }
      },
      title: {
        text: "Direct Cost",
        align: "left"
      },

    };
    this.chartOptionsRev = {
      colors: ["#338C85", "#34C6BB", "#8AD4EB", "#35d483", "#9070BD", "#FA8E04"],
      series: [
        {
          name: "Actual",
          data: []
        },
        {
          name: "Year-1",
          data: []
        },
        {
          name: "Month-1",
          data: []
        },
        {
          name: "Year-1 & Month-1",
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
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            position: "top"
          },

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
        categories: 'Value',

      },
      yaxis: {
        labels: {
          formatter: (value) => { return value.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
        }
      },
      title: {
        text: "Revenue",
        align: "left"
      },

    };
    this.chartOptionsGm = {
      colors: ["#338C85", "#34C6BB", "#8AD4EB", "#35d483", "#9070BD", "#FA8E04"],
      series: [
        {
          name: "Actual",
          data: []
        },
        {
          name: "Year-1",
          data: []
        },
        {
          name: "Month-1",
          data: []
        },
        {
          name: "Year-1 & Month-1",
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
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            position: "top"
          },

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
        categories: 'Value',

      },
      yaxis: {
        labels: {
          formatter: (value) => { return '%' + value },
        }
      },
      title: {
        text: "%GM",
        align: "left"
      },

    };
  }

  getMonth() {
    this.detailservice.getDetailCost(this.market, this.campaign, this.client, 6).then((res: any) => {
      this.month = res.Result[0].Month;
    })
  }

  getListDate(user, caseType) {
    this.login.userCampaing(user, caseType).subscribe((res: any) => {
      var bol: Boolean;
      var bolDos: Boolean;
      if (Object.keys(res.Result[0]).length !== 0) {
        if (caseType == 2) {
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
        } else if (caseType == 3) {
          this.nowYear = res.Result[0].year;
          this.nowMonth = res.Result[0].month;
        } else if (caseType == 4) {
          this.lastYear = res.Result[0].Lastyear;
          this.lastMonth = res.Result[0].Lastmonth;
        }
      } else {
        this.error += 1;
        switch (caseType) {
          case 2:
            break;
          case 3:
            this.nowYear = 'No Data';
            this.nowMonth = 'No Data';
            break;
          case 4:
            this.lastYear = 'No Data';
            this.lastMonth = 'No Data';
            break;
          default:
            break;
        }
      }
      if (caseType == 4) {
        if (this.error > 0) {
          this.toastr.warning('No Data', 'Wrong');
          this.error = 0;
        }

      }

    });
  }

  getSummaryEuro(year, month, country, market, campaign, client, caseType) {
    this.summaryservice.getSummaryEuro(year, month, country, market, campaign, client, caseType).then((res: any) => {

      if (Object.keys(res.Result[0]).length !== 0) {

        if (caseType == 2) {

          this.tableActual.push({ indicator: 'Net Revenue', valor: res.Result[0].NetRevenueEUR });
          this.tableActual.push({ indicator: 'Direct Cost', valor: res.Result[0].DirectCostEUR });
          this.tableActual.push({ indicator: 'GM', valor: res.Result[0].GMEUR });
          this.tableActual.push({ indicator: '%GM', valor: res.Result[0].PORGMEUR });
          this.spinnerActual = false;
        } else if (caseType == 3) {
          this.tableOb.push({ indicator: 'Net Revenue', valor: res.Result[0].NetRevenueEUROB });
          this.tableOb.push({ indicator: 'Direct Cost', valor: res.Result[0].DirectCostEUROB });
          this.tableOb.push({ indicator: 'GM', valor: res.Result[0].GMEUROB });
          this.tableOb.push({ indicator: '%GM', valor: res.Result[0].PORGMEUROB });
          this.spinnerOb = false;
        } else if (caseType == 4) {
          this.tableRft.push({ indicator: 'Net Revenue', valor: res.Result[0].NetRevenueEURRFT });
          this.tableRft.push({ indicator: 'Direct Cost', valor: res.Result[0].DirectCostEURRFT });
          this.tableRft.push({ indicator: 'GM', valor: res.Result[0].GMEURRFT });
          this.tableRft.push({ indicator: '%GM', valor: res.Result[0].PORGMEURRFT });
          this.spinnerRft = false;
        } else if (caseType == 8) {
          this.eurOb = res.Result[0].trmActEUR;
          this.eurAct = res.Result[0].trmObEUR;
          this.spinnerEur = false;
        }
      } else {
        this.error += 1;
        console.log(this.error, caseType);
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
          case 8:
            this.eurOb = 0;
            this.eurAct = 0;
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
          this.spinnerLastMonth = false;
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
          this.chartOptionsRev = {
            colors: ["#338C85", "#34C6BB", "#8AD4EB", "#35d483", "#9070BD", "#FA8E04"],
            series: [
              {
                name: "Actual",
                data: nrEur
              },
              {
                name: "Year-1",
                data: nrLy
              },
              {
                name: "Month-1",
                data: nrLm
              },
              {
                name: "Year-1 & Month-1",
                data: nrLym
              },
              {
                name: "OB",
                data: nrEOb
              },
              {
                name: "RFT",
                data: nrERft
              }
            ],
            chart: {
              type: "bar",
              height: 350,
            },
            plotOptions: {
              bar: {
                horizontal: false,
                dataLabels: {
                  position: "top"
                },

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
              categories: ['Value'],
            },
            yaxis: {
              labels: {
                formatter: (value) => { return value.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
              }
            },
            title: {
              text: "Revenue",
              align: "left"
            },

          };
          this.spinnerNetReve = false;
        } else if (caseType == 5) {
          const dcEur = res.Result[0].DirectCostEUR;
          const dcLy = res.Result[0].DirectCostLastYear;
          const dcLm = res.Result[0].DirectCostLastMonth;
          const dcLym = res.Result[0].DirectCostLastYearMonth;
          const dcEOb = res.Result[0].DirectCostEUROB;
          const dcERft = res.Result[0].DirectCostEURRFT;
          this.chartOptionsDc = {
            colors: ["#338C85", "#34C6BB", "#8AD4EB", "#35d483", "#9070BD", "#FA8E04"],
            series: [
              {
                name: "Actual",
                data: [dcEur]
              },
              {
                name: "Year-1",
                data: [dcLy]
              },
              {
                name: "Month-1",
                data: [dcLm]
              },
              {
                name: "Year-1 & Month-1",
                data: [dcLym]
              },
              {
                name: "OB",
                data: [dcEOb]
              },
              {
                name: "RFT",
                data: [dcERft]
              }
            ],
            chart: {
              type: "bar",
              height: 350,
            },
            plotOptions: {
              bar: {
                horizontal: false,
                dataLabels: {
                  position: "top"
                },

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
              categories: ['Value'],

            },
            yaxis: {
              labels: {
                formatter: (value) => { return value.toLocaleString("en-US", { style: "currency", currency: "USD" }) },
              }
            },
            title: {
              text: "Direct Cost",
              align: "left"
            },

          };
          this.spinnerCost = false;
        } else if (caseType == 6) {

          const porEur = res.Result[0].PORGMEUR;
          const porLy = res.Result[0].PORGMLastYear;
          const porLm = res.Result[0].PORGMLastMonth;
          const porLym = res.Result[0].PORGMLastYearMonth;
          const porEOb = res.Result[0].PORGMEUROB;
          const porERft = res.Result[0].PORGMEURRFT;

          this.chartOptionsGm = {
            colors: ["#338C85", "#34C6BB", "#8AD4EB", "#35d483", "#9070BD", "#FA8E04"],
            series: [
              {
                name: "Actual",
                data: [porEur]
              },
              {
                name: "Year-1",
                data: [porLy]
              },
              {
                name: "Month-1",
                data: [porLm]
              },
              {
                name: "Year-1 & Month-1",
                data: [porLym]
              },
              {
                name: "OB",
                data: [porEOb]
              },
              {
                name: "RFT",
                data: [porERft]
              }
            ],
            chart: {
              type: "bar",
              height: 350,
            },
            plotOptions: {
              bar: {
                horizontal: false,
                dataLabels: {
                  position: "top"
                },

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
              categories: ['Value'],
            },
            yaxis: {
              labels: {
                formatter: (value) => { return '%' + value },
              }
            },
            title: {
              text: "%GM",
              align: "left"
            },

          };
          this.spinnerGM = false;
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

  ngOnInit(): void {

  }

  ngOnDestroy() {
  }
  getAllData(year, month, country, market, campaign, client) {

    this.getSummaryEuro(year, month, country, market, campaign, client, 2);
    this.getSummaryEuro(year, month, country, market, campaign, client, 3);
    this.getSummaryEuro(year, month, country, market, campaign, client, 4);
    this.getSummaryEuro(year, month, country, market, campaign, client, 8);
    this.getDetailHistoric(year, month, country, market, campaign, client, 1);
    this.getDetailHistoric(year, month, country, market, campaign, client, 2);
    this.getDetailHistoric(year, month, country, market, campaign, client, 3);
    this.getDetailHistoric(year, month, country, market, campaign, client, 4);
    this.getDetailHistoric(year, month, country, market, campaign, client, 5);
    this.getDetailHistoric(year, month, country, market, campaign, client, 6);
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
    this.getAllData(this.year, this.month, this.country, this.market, this.campaign, this.client);
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
    }
    this.labelArray = [];
    this.tableActual = [];
    this.tableOb = [];
    this.tableRft = [];
    this.tableLastMonth = [];
    this.tableLastYear = [];
    this.tableLastYearMonth = [];

  }

  generateXlxs(num) {
    switch (num) {
      case 1:
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tblActXlsx);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'HistoricalActual');

        /* save to file */
        XLSX.writeFile(wb, 'HistoricalActual.xlsx');
        break;
      case 2:
        const wsOb: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tblObXlsx);
        /* generate workbook and add the worksheet */
        const wbOb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wbOb, wsOb, 'HistoricalOb');

        /* save to file */
        XLSX.writeFile(wbOb, 'HistoricalOb.xlsx');
        break;
      case 3:
        const wsRft: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tblRftXlsx);
        /* generate workbook and add the worksheet */
        const wbRft: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wbRft, wsRft, 'HistoricalRft');

        /* save to file */
        XLSX.writeFile(wbRft, 'HistoricalRft.xlsx');
        break;
      case 4:
        const wsLM: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tblLastMXlsx);
        /* generate workbook and add the worksheet */
        const wbLM: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wbLM, wsLM, 'HistoricalLastMonth');

        /* save to file */
        XLSX.writeFile(wbLM, 'HistoricalLastMonth.xlsx');
        break;
      case 5:
        const wsLY: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tblLastYXlsx);
        /* generate workbook and add the worksheet */
        const wbLY: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wbLY, wsLY, 'HistoricalLastYear');

        /* save to file */
        XLSX.writeFile(wbLY, 'HistoricalLastYear.xlsx');
        break;
      case 6:
        const wsLYM: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.tblLastYMXlsx);
        /* generate workbook and add the worksheet */
        const wbLYM: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wbLYM, wsLYM, 'HistoricalLastYearMonth');

        /* save to file */
        XLSX.writeFile(wbLYM, 'HistoricalLastYearMonth.xlsx');
        break;
    }

  }
}
