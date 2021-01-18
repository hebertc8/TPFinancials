import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DetailService {

  private year = null;
  private month = null;
  private country = null;
  private market = null;
  private client = null;
  private campaing = null;

  constructor(private http: HttpClient) { }

  getYear() {
    return this.year;
  }

  setYear(year) {
    this.year = year;
  }

  getMonth() {
    return this.month;
  }

  setMonth(month) {
    this.month = month;
  }

  getCountry() {
    return this.country;
  }

  setCountry(country) {
    this.country = country;
  }

  getMarket() {
    return this.market;
  }

  setMarket(market) {
    this.market = market;
  }

  getClient() {
    return this.client;
  }

  setClient(client) {
    this.client = client;
  }

  getCampaing() {
    return this.campaing;
  }

  setCampaing(campaing) {
    this.campaing = campaing;
  }
  getDetailRevenue(market, campaign, cliente, caseType) {
    const path = environment.apiUrl + '/api/getDetailRevenue';
    let promise = new Promise((resolve, reject) => {
      this.http.post(path, { mercado: market, campaign: campaign, cliente: cliente, caseType: caseType }).subscribe((res => {
        resolve(res);
      }), (err) => {
        reject(err);
      });
    })
    return promise;
  }

  getDetailCost(market, campaign, cliente, caseType) {
    const path = environment.apiUrl + '/api/getDetailCost';
    let promise = new Promise((resolve, reject) => {
      this.http.post(path, { mercado: market, campaign: campaign, cliente: cliente, caseType: caseType }).subscribe((res => {
        resolve(res);
      }), (err) => {
        reject(err);
      });
    })
    return promise;
  }

  getDetailHistoric(year, month, country, market, campaign, cliente, caseType) {
    const path = environment.apiUrl + '/api/getDetailHistoric';
    let promise = new Promise((resolve, reject) => {
      this.http.post(path, { year: year, mes: month, country: country, mercado: market, campaign: campaign, cliente: cliente, caseType: caseType }).subscribe((res => {
        resolve(res);
      }), (err) => {
        reject(err);
      });
    })
    return promise;
  }
}
