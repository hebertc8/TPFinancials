import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from '../services/login.service';
import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { obsmenu } from '../services/obs-menu';
import { obscgpmain } from '../services/obs-cgp-main';
import * as $ from 'jquery';
import { Router } from '@angular/router';

@Component({
  selector: 'app-container',
  template: `
   <nb-layout windowMode>
      <nb-layout-header fixed>
      <button nbButton  id="cgp" *ngIf="this.pass===1 && this.botonCgp" shape="round" (click)="navegar()" hero class="boton-trans toggle-settings appearance-outline size-medium status-basic shape-rectangle icon-start icon-end">
        <p style="font-size:1rem;" *ngIf="this.componente">CGP</p>
        <p style="font-size:1rem;" *ngIf="!this.componente">Main</p>
        </button>
        <app-header></app-header>
        <!-- <button id="transform" *ngIf="this.componente" (click)="pushButton()" _ngcontent-pcm-c215="" nbbutton="" appearance="outline" class="boton-transOver toggle-settings appearance-outline size-medium status-basic shape-rectangle icon-start icon-end" _nghost-pcm-c87="" aria-disabled="false" tabindex="0">
        <img src="../../../assets/logos/reporte.png" alt="Logo" class="logoForm imagenMenu">
        </button> -->
      </nb-layout-header>
      <nb-sidebar state="collapsed" tag="settings-sidebar" class="settings-sidebar left" fixed>
        <div class="subBoton">
        <a class="logo" href="#">
        <img src="../../../assets/logos/reporte.png" alt="Logo" class="logoForm" style="width: 3rem;">
        </a>
        </div>
      <nb-menu tag="menu" [items]="menu" (click)="salto($event)"></nb-menu>
      </nb-sidebar>
      <nb-layout-column>

      <router-outlet></router-outlet>

      </nb-layout-column>
      <nb-layout-footer fixed>
        <app-footer></app-footer>
      </nb-layout-footer>
    </nb-layout>
    `,
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {
  @ViewChild('heatmapContainer', { static: false, read: ElementRef }) heatmapContainer: ElementRef;
  menu: any = [];
  public pass;
  public button: boolean = true;
  public componente: boolean = true;
  public botonCgp: boolean = true;

  constructor(private login: LoginService,
    private sidebarService: NbSidebarService,
    private obsmenu: obsmenu,
    private router: Router,
    private obsCgpMain: obscgpmain,) {
    this.sidebarService.toggle(true, 'menu-sidebar');
    const data = this.login.getUserCampaing();
    this.pass = data[0].pass;
    if(this.router.url==="/container/cgp"){
      this.componente=false;
    }
  }
  ngOnInit() {

      this.menu = [
        {
          title: 'Summary',
          // link: '/container/detailCost',
          icon: 'book-open-outline',
        },
        {
          title: 'History',
          icon: 'pie-chart-outline',
          // link: '/pages/dashboard',
        },
        {
          title: 'Revenue',
          icon: 'trending-up-outline',
          // link: '/pages/iot-dashboard',
        },
        {
          title: 'Cost',
          icon: 'credit-card-outline',
          // link: '/pages/iot-dashboard',
        },
      ];
    // if (this.pass === 1) {
    //   this.menu.push( {
    //     title: 'CGP',
    //     icon: 'globe-outline',
    //   },
    //   {
    //     title: 'Actual CGP',
    //     icon: 'globe-2-outline',
    //   })
    // }
  }

  pushButton() {
    if (this.button === true) {
      $('#transform').css('transform', 'translateX(-16.0rem)');
      this.botonCgp = false;
      this.button = !this.button;
      this.sidebarService.toggle(true, 'settings-sidebar');
    } else {
      $('#transform').css('transform', 'none');
      this.botonCgp = true;
      this.button = !this.button;
      this.sidebarService.collapse('settings-sidebar');
    }
  }

  salto(event){
    this.sidebarService.collapse('settings-sidebar');
    $('#transform').css('transform', 'none');
    // $('#cgp').css('display', 'none');
    // this.botonCgp = true;
    this.button = !this.button;
    this.obsmenu.datos$.emit(event.path[0].innerText);
  }

  getGesturePointFromEvent(evt) {
    var point = {x:null, y:null};

    if(evt.targetTouches) {
      // Prefer Touch Events
      point.x = evt.targetTouches[0].clientX;
      point.y = evt.targetTouches[0].clientY;
    } else {
      // Either Mouse event or Pointer Event
      point.x = evt.clientX;
      point.y = evt.clientY+200;
    }
    $('#transform').css('margin-top', point.y);
    // console.log(point);

  } 

  navegar(){
    if(this.componente===true){
      this.router.navigate(['/container/cgp']);
      this.obsCgpMain.datos$.emit(true);
    }else{
      this.router.navigate(['/container/main']);
      this.obsCgpMain.datos$.emit(false);
    }
    this.componente=!this.componente;
  }
}

