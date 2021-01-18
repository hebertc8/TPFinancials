import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {

  private dataTable: any = [];

  private region = [];
  private country = [];
  private sub = [];

  constructor(private http: HttpClient) { }

  getDateTable(): any[] {
    return this.dataTable;
  }

  setDateTable(data: any) {
    console.log('entro al set');
    this.dataTable.push(data);
    console.log(this.dataTable);
  }

  getRegion() {
    return this.region;
  }

  setRegion(region) {
    this.region = region;
  }

  getCountry() {
    return this.country;
  }

  setCountry(country) {
    this.country = country;
  }

  getSub() {
    return this.sub;
  }

  setSub(sub) {
    this.sub = sub;
  }

  getSummaryEuro(year, month, country, market, campaign, cliente, caseType) {
    const path = environment.apiUrl + '/api/getSummaryEuro';
    let promise = new Promise((resolve, reject) => {
      this.http.post(path, { year: year, mes: month, country: country, mercado: market, campaign: campaign, cliente: cliente, caseType: caseType }).subscribe((res => {
        resolve(res);
      }), (err) => {
        reject(err);
      });
    })
    return promise;
  }

  getSummary(year, month, country, market, campaign, cliente, caseType) {
    const path = environment.apiUrl + '/api/getSummary';
    let promise = new Promise((resolve, reject) => {
      this.http.post(path, { year: year, mes: month, country: country, mercado: market, campaign: campaign, cliente: cliente, caseType: caseType }).subscribe((res => {
        resolve(res);
      }), (err) => {
        reject(err);
      });
    })
    return promise;
  }

  getCgp(country, region, sub, caseType) {
    const path = environment.apiUrl + '/api/getCgp';
    let promise = new Promise((resolve, reject) => {
      this.http.post(path, { country: country, region: region, sub: sub, caseType: caseType }).subscribe((res => {
        resolve(res);
      }), (err) => {
        reject(err);
      });
    })
    return promise;
  }

  getActualCgp(country, region, sub, yearIni, yearFin, monthIni, monthFin, caseType,) {
    const path = environment.apiUrl + '/api/getActualCgp';
    let promise = new Promise((resolve, reject) => {
      this.http.post(path, {
        caseType: caseType, country: country, region: region, sub: sub,
        yearIni: yearIni, yearFin: yearFin, monthIni: monthIni, monthFin: monthFin
      }).subscribe((res => {
        resolve(res);
      }), (err) => {
        reject(err);
      });
    })
    return promise;
  }

  getCords(): Observable<any> {
    return this.http.get('assets/countries/countries.geo.json');
  }
}
