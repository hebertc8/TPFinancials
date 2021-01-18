import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ContainerComponent } from './container/container.component';
import { MainComponent } from './container/main/main.component';
import { LoginGuard } from './services/guards/login.guard';
import { ValidateLoginGuard } from './services/guards/validate-login.guard';
import { DetailRevenueComponent } from './container/detail-revenue/detail-revenue.component';
import { HistoricalComponent } from './container/historical/historical.component';
import { DetailCostComponent } from './container/detail-cost/detail-cost.component';
import { SummaryComponent } from './container/summary/summary.component';
import { CgpComponent } from './container/cgp/cgp.component';
import { ActualCgpComponent } from './container/actual-cgp/actual-cgp.component';
import { TableFilterComponent } from './container/table-filter/table-filter.component'


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'prefix' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'container',
    component: ContainerComponent,
    children: [
      {
        path: 'main',
        component: TableFilterComponent,
        canActivate: [ValidateLoginGuard]
      },
      {
        path: 'detailRevenue',
        component: DetailRevenueComponent,
        canActivate: [ValidateLoginGuard]
      },
      {
        path: 'historic',
        component: HistoricalComponent,
        canActivate: [ValidateLoginGuard]
      },
      {
        path: 'detailCost',
        component: DetailCostComponent,
        canActivate: [ValidateLoginGuard]
      },
      {
        path: 'summary',
        component: SummaryComponent,
        canActivate: [ValidateLoginGuard]
      },
      {
        path: 'cgp',
        component: CgpComponent,
        canActivate: [ValidateLoginGuard]
      },
      {
        path: 'actualCgp',
        component: ActualCgpComponent,
        canActivate: [ValidateLoginGuard]
      }
    ]
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
