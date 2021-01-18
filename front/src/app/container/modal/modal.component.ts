import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { UserCampaign } from 'src/app/services/interfaces';
import { obsTableFilter } from '../../services/obs-table-filter';
import { ObjTable } from '../../services/interfaces';
import { NbToastrService } from '@nebular/theme';
import { DetailService } from 'src/app/services/detail.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  public year;
  public month;
  public coin;
  public country = null;
  public market = null;
  public client = null;
  public campaign = null;
  public data: ObjTable;
  public nowMonth;
  public nowYear;
  public lastMonth;
  public lastYear;

  public yearArray: Array<any> = [];
  public monthArray: Array<any> = [];
  public countryArray: Array<any> = [];
  public marketArray: Array<any> = [];
  public clientArray: Array<any> = [];
  public campaignArray: Array<any> = [];
  public dateArray: Array<any> = [];
  public filtersArray: Array<UserCampaign>;

  private error: number;

  constructor(private login: LoginService,
              private obsTableFilter:obsTableFilter,
              private toastr: NbToastrService,
              private detailservice: DetailService,) { 
    this.data={year:null,campaign:null,client:null,name:null,country:null,market:null,month:null}
    this.getListDate(login.getUser().username, 2);
    this.filtersArray = this.login.getUserCampaing();
    this.getListFilters();
  }

  ngOnInit(): void {
  }

  filterSelected(event, num) {
    this.error = 0;
    this.resetList(num);
    this.getListFilters();
    // this.detailservice.setYear(this.year);
    // this.detailservice.setMonth(this.month);
    // this.detailservice.setCountry(this.country);
    // this.detailservice.setMarket(this.market);
    // this.detailservice.setCampaing(this.campaign);
    // this.detailservice.setClient(this.client);
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
      if (this.data.campaign) {
        if (filter.Campaign == this.data.campaign) {
          this.fillList(filter, bol, bolCam, bolCli, bolMar);
        }
      } else if (this.data.client) {
        if (filter.Client == this.data.client) {
          this.fillList(filter, bol, bolCam, bolCli, bolMar);
        }
      } else if (this.data.market) {
        if (filter.Market == this.data.market) {
          this.fillList(filter, bol, bolCam, bolCli, bolMar);
        }
      } else if (this.data.country) {
        if (filter.Country == this.data.country) {
          this.fillList(filter, bol, bolCam, bolCli, bolMar);
        }
      } else {
        this.fillList(filter, bol, bolCam, bolCli, bolMar);
      }

    })
  }

  filterDateSelected(event) {
    this.monthArray = [];
    this.dateArray.forEach(date => {
      if (this.data.year === date.year) {
        date.months.forEach(month => {
          this.monthArray.push(month.trim());
        });
      }
    });
    this.filterSelected(event, 0);
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
  }

  findByFilters(){
    this.obsTableFilter.datos$.emit(this.data);
  }

}
