import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BaseHttpClientService {

  constructor(private http: HttpClient) { }

  //http get method
  get<T>(url: string, options: any = { observe: 'response'}, authenticationRequired: boolean = true) {
    options = this.optionsWithHeader(options, authenticationRequired);
    return this.http.get<T>(url, options);
  }

  //http post method
  post<T>(url: string, data: any, options: any = {observe: 'response'}, authenticationRequired: boolean = true) {
    options = this.optionsWithHeader(options, authenticationRequired);
    return this.http.post<T>(url, data, options);
  }

  //http put method
  put<T>(url: string, data: any, options: any = {observe: 'response'}, authenticationRequired: boolean = true) {
    options = this.optionsWithHeader(options, authenticationRequired);
    return this.http.put<T>(url, data, options);
  }

  //http delete method
  delete<T>(url: string, options: any = {observe: 'response'}, authenticationRequired: boolean = true) {
    options = this.optionsWithHeader(options, authenticationRequired);
    return this.http.delete<T>(url, options);
  }

  //helpers
  private optionsWithHeader(options: any, authenticationRequired: boolean) {
    if (!authenticationRequired) {
      if (!options) { options = {}; }
      if (!options.headers) { options.headers = new HttpHeaders({ "No-Authentication": "True" }); }
      else { options.headers=options.headers.append("No-Authentication", "True") }
    }
    return options;    
  }
}
