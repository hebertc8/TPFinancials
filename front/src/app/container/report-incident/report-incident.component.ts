import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbComponentStatus, NbToastrService, NbWindowService } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { obsReport } from 'src/app/services/obs-report';

@Component({
  selector: 'app-report-incident',
  templateUrl: './report-incident.component.html',
  styleUrls: ['./report-incident.component.scss']
})
export class ReportIncidentComponent implements OnInit, OnDestroy {
  
  public suscripcionDos: Subscription;
  public ventana:any;
  constructor(private windowService: NbWindowService,
              private obsreport: obsReport,
              private toastrService: NbToastrService) { }

  ngOnInit(): void {
    this.suscripcionDos = this.obsreport.datos$.subscribe(datos => {
    this.ventana=datos.component;
  });
  }

  ngOnDestroy() {
    this.suscripcionDos.unsubscribe();
  }

  close(){
    this.showToast('success');
    this.ventana.close();
  }

  showToast(status: NbComponentStatus) {
    this.toastrService.show(
      'Your report has been sent correctly',
      `Successful shipping`,
      { status }
    );
  }

}
