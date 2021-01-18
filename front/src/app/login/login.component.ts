import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  showPassword = false;
  form: FormGroup;
  error = {
    status: false,
    error: '',
  };
  send = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private Login: LoginService,
    private toastr: NbToastrService
  ) {
    this.form = fb.group({
      user: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  ngOnInit(): void { }

  login(valid) {
    this.loading = true;

    if (valid) {
      const input = this.form.value;
      const Logindata = {
        user: input.user,
        pass: input.password,
      };

      this.Login.login(Logindata).subscribe(
        (res: any) => {
          this.error.status = false;
          if (res.message) {
            this.toastr.warning(res.message, 'Wrong');
          } else {
            res = { ...res, viewHeader: true };
            this.Login.setUser(res);
            this.Login.userCampaing('Mercadoortega.5', 1).subscribe((data: any) => {
            // this.Login.userCampaing(Logindata.user, 1).subscribe((data: any) => {
              if (data.Result) {
                this.Login.setUserCampaing(data.Result);
                this.router.navigate(['/container/main']);
                setTimeout(() => {
                  this.toastr.success('', 'Welcome');
                }, 1000);
              } else {

                this.Login.logout();
                this.loading = false;
                this.error.status = true;
                this.error.error = 'User without credentials';
                this.form.reset();
              }
            }, (err) => {
              this.loading = false;
              this.error.status = true;
              this.error.error = err;
              this.form.reset();
            })

          }

          this.loading = false;
        },
        (err) => {
          this.loading = false;
          this.error.status = true;
          this.error.error = err;
          this.form.reset();
        }
      );
    } else {
      this.loading = false;
    }

    // this.router.navigate(['/container/main']);
  }

  resetError() {
    if (this.error.status) {
      this.error.status = false;
    }
  }
}
