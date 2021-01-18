import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { RequestsService } from 'src/app/services/requests.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Placeholder {
  central: string;
  mercado: string;
  pais: string;
}
interface UpdateInfo {
  id: number;
  central?: string;
  mercado?: string;
  pais?: string;
}

@Component({
  selector: 'app-dialog-update',
  templateUrl: './dialog-update.component.html',
  styleUrls: ['./dialog-update.component.scss']
})
export class DialogUpdateComponent implements OnInit {
  subscriptionRequets: Subscription;
  public placeholder: Placeholder;
  public updateInfo: UpdateInfo;
  form: FormGroup;
  load = false;
  public requetType = [
    null,
    'update',
    'insert',
    'delete'
  ];

  processNumber = 0;


  constructor(
    protected dialogRef: NbDialogRef<DialogUpdateComponent>,
    private requets: RequestsService, private fb: FormBuilder,
    private toastr: NbToastrService
  ) {
    this.form = fb.group({
      central: [null, Validators.required],
      mercado: [null, Validators.required],
      pais: [null, Validators.required],
    });
  }

  ngOnInit(): void {
  }

  close(r) {
    this.dialogRef.close(r);
  }

  update() {
    this.load = true;
    const input = this.form.value;
    if (this.subscriptionRequets) { this.subscriptionRequets.unsubscribe(); }
    this.updateInfo.central = input.central === null ? '' : input.central.trim(),
    this.updateInfo.mercado = input.mercado === null ? '' : input.mercado.trim(),
    this.updateInfo.pais = input.pais === null ? '' : input.pais.trim(),
    this.subscriptionRequets = this.requets.update(this.updateInfo, this.requetType[this.processNumber]).subscribe(res => {
      this.load = false;
      this.close(1);
    }, err => {
      this.load = false;
    });
  }

}
