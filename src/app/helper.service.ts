import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  getDropDownData: any = new BehaviorSubject<any>(null);
  dropDownData: any = {
    brands: [],
    checklistTypes: [],
    checklistUserRoles: [],
    checklistAreas: [],
    checksddl: [],
  };

  userInfo: any = null;

  constructor() {}

  setUserData(userInfo: any) {
    this.userInfo = userInfo;
    localStorage.setItem('UserInfoDetails', JSON.stringify(userInfo));
  }

  getUserData() {
    if (this.userInfo) {
      return this.userInfo;
    } else {
      let userInfoUnparsed: any = localStorage.getItem('UserInfoDetails');
      this.userInfo = JSON.parse(userInfoUnparsed);
      return this.userInfo;
    }
  }

  setDropDownData(data: any, keyName: string | null) {
    if (keyName) {
      this.dropDownData[keyName] = data;
      this.getDropDownData.next(this.dropDownData);
    }
  }

  setDropDownData2(ddlData: any = []) {
    let checklistTypes = this.getDDLDataByCategory(ddlData, 'List Type');
    this.setDropDownData(checklistTypes, 'checklistTypes');
    let checklistUserRoles = this.getDDLDataByCategory(ddlData, 'List Role');
    this.setDropDownData(checklistUserRoles, 'checklistUserRoles');
    let checklistAreas = this.getDDLDataByCategory(ddlData, 'Checklist Area');
    this.setDropDownData(checklistAreas, 'checklistAreas');
  }

  getDDLDataByCategory(
    list: any[],
    categoryName: string,
    orderByCodeId: boolean = false
  ): any[] {
    if (!categoryName) {
      return [];
    }
    let result: any[] = [];
    for (let index = 0; index < list.length; index++) {
      if (
        list[index].CodeCategoryName &&
        list[index].CodeCategoryName.toLowerCase() == categoryName.toLowerCase()
      ) {
        result = list[index].CodeValues;
        break;
      }
    }
    if (orderByCodeId && result) {
      result.sort((a, b) => {
        if (a.CodeId < b.CodeId) {
          return -1;
        }
        if (a.CodeId > b.CodeId) {
          return 1;
        }
        return 0;
      });
    }
    return result;
  }
}
