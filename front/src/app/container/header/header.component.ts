import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMenuService, NbSidebarService, NbThemeService, NbToastrService } from '@nebular/theme';
import { map, takeUntil, filter } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { ObjSelect, ObjSelectcgp, ObjTable, UserCampaign } from 'src/app/services/interfaces';
import {obsselectHeader} from 'src/app/services/obs-select-header';
import { SummaryService } from 'src/app/services/summary.service';
import { obscgpmain } from '../../services/obs-cgp-main';
import { obsselectcgp } from 'src/app/services/obs-select-cgp';

interface ProfileMenu {
  title: string;
  icon: Icon;
  target: string;
}

interface Icon {
  icon: string;
  pack: string;
}

interface UserInfo {
  nombre: string;
  username: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly = false;
  public viewHeader = true;
  public change = false;
  public button: boolean = true;
  public suscripcion: Subscription;
  public obsSelgcp: ObjSelectcgp;

  public filtersArray: Array<UserCampaign>;
  public filtersArraycgp: Array<any> = [];
  public photo;
  public user: any;
  public userInfo: UserInfo;

  public market = 9999;
  public client = 9999;
  public campaign = 9999;

  public sub: Array<any> = [];
  public countryCgp: Array<any> = [];
  public region: Array<any> = [];
  
  public campaignArray: Array<any> = [];
  public marketArray: Array<any> = [];
  public clientArray: Array<any> = [];

  public subArray: Array<any> = [];
  public countryArrayCgp: Array<any> = [];
  public regionArray: Array<any> = [];

  public year;
  public month;
  public coin;
  public country = null;
  public data: ObjTable;
  public nowMonth;
  public nowYear;
  public lastMonth;
  public lastYear;

  public yearArray: Array<any> = [];
  public monthArray: Array<any> = [];
  public countryArray: Array<any> = [];
  public dateArray: Array<any> = [];

  private error: number;
  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    }
  ];
  currentTheme = 'default';
  public profileMenu: ProfileMenu[] = [
    /*  {
        title: 'Profile',
        icon: { icon: 'user-circle', pack: 'fa' },
        target: 'main/profile',
      },*/
    {
      title: 'Log Out',
      icon: { icon: 'sign-out-alt', pack: 'fa' },
      target: 'login',
    },
  ];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private router: Router,
    private Login: LoginService,
    private toastr: NbToastrService,
    private obsselectHeader:obsselectHeader,
    private summaryservice: SummaryService,
    private obsCgpMain: obscgpmain,
    private obsSelectCgp:obsselectcgp,
  ) {
    this.data={year:null,campaign:null,client:null,name:null,country:null,market:null,month:null};
    this.obsSelgcp={country:[], region:[], sub:[]};
    this.getListDate(Login.getUser().username, 2);
    this.filtersArray = this.Login.getUserCampaing();
    this.getListFilters();
    if(this.router.url==="/container/cgp"){
      this.change=true;
    }
   }

  ngOnInit() {
    this.getCgp(null, null, null, 5);
    this.getListFilters();

    this.suscripcion = this.obsCgpMain.datos$.subscribe(datos => {
      this.change = datos;
    });

    if(window.screen.width<=420 && window.screen.height<=826){
      this.userPictureOnly=true;
    }
    this.viewHeader = this.Login.getUser().viewHeader;
    this.menuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'menu-action'),
        map(({ item: { target } }) => target)
      )
      .subscribe((target) => {

        switch (target) {
          case 'login':
            this.Login.logout();
            this.router.navigate([target]);
            break;

          default:
            this.router.navigate([target]);
            break;
        }
      });
    this.currentTheme = this.themeService.currentTheme;
    this.userInfo = this.Login.getUser() ? this.Login.getUser() : { nombre: 'Usuario', username: 'usuario.0' };
    const aux = this.Login.getUserCampaing();
    this.photo = aux[0].photo;
    setTimeout(() => {
      if(window.screen.width<=420 && window.screen.height<=826){
        this.sidebarService.collapse('menu-sidebar');
      }else if(window.screen.width>=1200) {
        this.sidebarService.toggle(true, 'menu-sidebar');
      }
    }, 100);

    this.themeService.onThemeChange().pipe(
      map(({name}) => name),
      takeUntil(this.destroy$)
    )
    .subscribe(themeName => this.currentTheme = themeName);
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): boolean {
    if (this.button === true) {
      this.button = !this.button;
      this.sidebarService.toggle(true, 'settings-sidebar');
    } else {
      this.button = !this.button;
      this.sidebarService.collapse('settings-sidebar');
    }
    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  filterSelected(event, num) {
    this.error = 0;
    this.resetList(num);
    this.getListFilters();
    this.findByFilters(num);
    // this.detailservice.setYear(this.year);
    // this.detailservice.setMonth(this.month);
    // this.detailservice.setCountry(this.country);
    // this.detailservice.setMarket(this.market);
    // this.detailservice.setCampaing(this.campaign);
    // this.detailservice.setClient(this.client);
  }


  getListDate(user, caseType) {
    this.Login.userCampaing(user, caseType).subscribe((res: any) => {
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

  findByFilters(num){
    let envioObs:ObjSelect={type:num,campaign:this.data.campaign,client:this.data.client,market:this.data.market, year: this.data.year, month: this.data.month};
    this.obsselectHeader.datos$.emit(envioObs);
  }

  getCgp(country, region, sub, caseType) {
    this.summaryservice.getCgp(country, region, sub, caseType).then((res: any) => {
      var bol: Boolean;
      if (res.Result) {
          this.filtersArraycgp = res.Result;
          this.getListFilterscgp();
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
      } else {
        this.error += 1;
      if (caseType == 5) {
        if (this.error > 0) {
          this.toastr.warning('No Data', 'Wrong');
          this.error = 0;
        }
      }
      }
    });
  }

  fillListcgp(filter, bol, bolCam, bolCli) {
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
    if (this.countryArrayCgp.length > 0) {
      this.countryArrayCgp.forEach(country => {
        if (country == filter.country) {
          bolCam = true;
        }
      });
      if (bolCam != true) {
        this.countryArrayCgp.push(filter.country);
      }
    } else {
      this.countryArrayCgp.push(filter.country);
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

  getListFilterscgp() {
    var bol: Boolean;
    var bolCam: Boolean;
    var bolCli: Boolean;
    this.filtersArraycgp.forEach(filter => {

      bol = false;
      bolCam = false;
      bolCli = false;
      if (this.sub[0]) {
        if (filter.sub == this.sub) {
          this.fillListcgp(filter, bol, bolCam, bolCli);
        }
      } else if (this.countryCgp[0]) {
        if (filter.countryCgp == this.countryCgp) {
          this.fillListcgp(filter, bol, bolCam, bolCli);
        }
      } else if (this.region[0]) {
        if (filter.region == this.region) {
          this.fillListcgp(filter, bol, bolCam, bolCli);
        }
      } else {
        this.fillListcgp(filter, bol, bolCam, bolCli);
      }

    })
  }

  filterSelectedcgp() {
    this.obsSelgcp.country=this.country;
    this.obsSelgcp.region=this.region;
    this.obsSelgcp.sub=this.sub;
    this.obsSelectCgp.datos$.emit(this.obsSelgcp);
  }

}
