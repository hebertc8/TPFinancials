import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(private http: HttpClient) { }


  get() {
    const path = environment.apiUrl + '/api/sqlget';
    return this.http.post(path, {});
  }

  update(data, request) {
    const path = environment.apiUrl + '/api/sql' + request;
    return this.http.post(path, data);
  }

  refreshSession(refreshToken) {
    const path = environment.apiUrl + '/api/refreshToken';
    return this.http.post(path, { refreshToken });
  }
}
