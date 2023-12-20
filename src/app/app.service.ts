import { Injectable } from '@angular/core';
import { BaseHttpClientService } from './base-http-client.service';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  // api path config
  baseOdataAPI: string = 'https://emcaodata-qa.azurewebsites.net';
  baseChecklistAPI: string = 'https://emcachecklists-qa.azurewebsites.net';
  pushNotificationAPIURL: string =
    'https://emcanotifications-qa.azurewebsites.net';
  SecurityAPIURL: string = 'https://emcasecurity-qa.azurewebsites.net';

  constructor(
    private httpClient: BaseHttpClientService,
    private helperService: HelperService
  ) {}

  getUserInfoDetails(): Observable<any> {
    const URL = `${this.SecurityAPIURL}/api/currentuser/2`;
    const response = this.httpClient.get<any>(URL).pipe(
      map((res: any) => res.body),
      catchError((err) => of(new Error(err))),
      tap((data) => this.helperService.setUserData(data))
    );
    return response;
  }

  getBrandList(): Observable<any> {
    const userInfo = this.helperService.getUserData();
    const URL =
      userInfo && userInfo.StoreNumber && userInfo.CountryCode
        ? `${this.baseChecklistAPI}/api/checklistbrand/${userInfo?.Email}?storeNumber=${userInfo.StoreNumber}&countryCode=${userInfo.CountryCode}`
        : `${this.baseChecklistAPI}/api/checklistbrand/${userInfo?.Email}`;
    const response = this.httpClient.get<any[]>(URL).pipe(
      map((res: any) => res.body),
      catchError((err) => of(new Error(err))),
      tap((data) => this.helperService.setDropDownData(data, 'brands'))
    );
    return response;
  }

  getChecklistDropdownData(
    userEmail: string,
    corporateIdentifier: string,
    language: string
  ): Observable<any[]> {
    return this.httpClient
      .get(
        `${this.baseChecklistAPI}/api/codevalue?logon=${userEmail}&corporateAccountIdentifier=${corporateIdentifier}&languageCode=${language}`
      )
      .pipe(
        map((res: any) => {
          return res.body;
        }),
        catchError((err) => of(new Error(err))),
        tap((data) => this.helperService.setDropDownData2(data))
      );
  }

  getChecksByCheckListTypeId(
    corporateAccountId: number,
    checkListTypeId: number,
    isQualityControlChecklist: boolean,
    language: string
  ) {
    return this.httpClient
      .get(
        `${this.baseChecklistAPI}/api/Checklists/GetChecklistQuestionsByListType/${corporateAccountId}/${checkListTypeId}/${isQualityControlChecklist}/${language}`
      )
      .pipe(
        map((res: any) => {
          return res.body;
        }),
        catchError((err) => of(new Error(err))),
        tap((data) => {
          let checksddl = data?.ConfigureQuestions;
          this.helperService.setDropDownData(checksddl, 'checksddl');
        })
      );
  }

  getchecklistNames(): Observable<any[]> {
    let categoryId: number = 9;
    let corporateIdentifier: string =
      this.helperService.getUserData()?.CorporateAccountIdentifier;
    let language: string = 'en-US';
    return this.httpClient
      .get(
        `${this.baseChecklistAPI}/api/TextValueBaseByCategoryByCustomer?categoryId=${categoryId}&corporateAccountIdentifier=${corporateIdentifier}&languageCode=${language}`
      )
      .pipe(
        map((res: any) => {
          return res.body;
        }),
        catchError((err) => of(new Error(err))),
        tap((checklistNames) => {
          this.helperService.setDropDownData(checklistNames, 'checklistNames');
        })
      );
  }

  addTextValueRow(reqData: any): Observable<any> {
    return this.httpClient
      .post(`${this.baseChecklistAPI}/api/TextValueRow`, reqData)
      .pipe(
        map((res: any) => {
          return res.body;
        })
      );
  }

  submitChecklist(reqData: any): Observable<any> {
    return this.httpClient.post(`${this.baseChecklistAPI}/api/maintainchecklist`, reqData)
      .pipe(map((res:any) => {
        return res.body;
      }));
  }
}
