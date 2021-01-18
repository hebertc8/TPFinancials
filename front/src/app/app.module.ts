import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClientXsrfModule } from '@angular/common/http';
import { InterceptorService } from './services/interceptor.service';
import { MainComponent } from './container/main/main.component';
import { ContainerComponent } from './container/container.component';
import { FooterComponent } from './container/footer/footer.component';
import { HeaderComponent } from './container/header/header.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DialogUpdateComponent } from './container/main/dialogs/dialog-update/dialog-update.component';
import { ErrorInterceptor } from './services/error-interceptor';
import { NgxEchartsModule } from 'ngx-echarts';
import { HistoricalComponent } from './container/historical/historical.component';
import { DetailRevenueComponent } from './container/detail-revenue/detail-revenue.component';
import { DetailCostComponent } from './container/detail-cost/detail-cost.component';
import { SummaryComponent } from './container/summary/summary.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { AngularBillboardModule } from 'angular-billboard';
import { GridsterModule } from 'angular-gridster2';
import { NgApexchartsModule } from "ng-apexcharts";
import { DashboardComponent } from './container/dashboard/dashboard.component';
import { CgpComponent } from './container/cgp/cgp.component';
import { Ng5SliderModule } from 'ng5-slider';
import { ActualCgpComponent } from './container/actual-cgp/actual-cgp.component';
import { MapComponent } from './container/map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NbSidebarService, NbMenuService, NbSearchModule } from '@nebular/theme';
import {​​ ThemeModule }​​ from './nebular/@theme/theme.module';
import {​​ NebularModule }​​ from './nebular/nebular.module';
import { TableFilterComponent } from './container/table-filter/table-filter.component';
import { ModalComponent } from './container/modal/modal.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReportIncidentComponent } from './container/report-incident/report-incident.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainComponent,
    ContainerComponent,
    FooterComponent,
    HeaderComponent,
    DialogUpdateComponent,
    HistoricalComponent,
    DetailRevenueComponent,
    DetailCostComponent,
    SummaryComponent,
    DashboardComponent,
    CgpComponent,
    ActualCgpComponent,
    MapComponent,
    TableFilterComponent,
    ModalComponent,
    ReportIncidentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbEvaIconsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'CSRF-Token',
    }),
    Ng2SmartTableModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts'),
    }),
    ChartsModule,
    NgxChartsModule,
    AngularBillboardModule,
    GridsterModule,
    NgApexchartsModule,
    Ng5SliderModule,
    LeafletModule,
    NebularModule,
    ThemeModule.forRoot(),
    NgxPaginationModule,
    NbSearchModule
  ],
  providers: [NbSidebarService, NbMenuService,
  { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  DecimalPipe,
  CurrencyPipe,
  PercentPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
