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
  headerData: any = null;

  constructor() {}

  setHeaderData(data: any) {
    this.headerData = data;
  }

  getHeaderData() {
    return this.headerData;
  }

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

  createJSON(formData: any) {
    console.log(formData);
    let sampleData = {
      Checklists: [
        {
          IsChecklistOptional: false,
          IsQualityControlChecklist: false,
          NewLocationListFlag: false,
          CanBeAssociateChecklist: false,
          IsRTMChecklist: false,
          ListInternalName: null,
          ListNameTextId: 291,
          ListDescriptionTextId: 542,

          ListName: 'Training Checklist',
          ListDescription:
            'A pyrometer that is properly calibrated allows you to calibrate equipment and complete internal temperature checks on cooked products. Test the pyrometer each day before you begin any temperature measurements.',

          Tags: [],
          ExpiryAlert: [],
          DisplayExpiryAlert: false,
          Schedules: [
            {
              ScheduleRecurrenceTypeId: 1,
              ScheduleRecurrenceType: 'Hourly',
              DayRecurrence: 1,
              HourRecurrence: 1,
              DayRecurrenceWeekdayFlag: false,
              WeekRecurrence: null,
              SundayFlag: false,
              MondayFlag: false,
              TuesdayFlag: false,
              WednesdayFlag: false,
              ThursdayFlag: false,
              FridayFlag: false,
              SaturdayFlag: false,
              FirstStartTime: '12:00:00',
              LastStartTime: '12:00:00',
              TimeDuration: 1,
              StartDate: '12/17/2023',
              EndDate: '12/17/2023',
              MonthRecurrenceType: null,
              MonthRecurrenceTypeId: null,
              MonthRecurrenceDay: 10,
              MonthRecurrence: null,
              MonthRecurrenceDayOccurrence: 1,
              NoEndDateFlag: false,
              MinimumRequiredRecurring: 0,
              MaximumDailyRecurrence: null,
              ListKey: null,
              ListScheduleId: null,
              LocationIdentifiers: [],
              IsEdit: false,
              IsModified: true,
            },
          ],
          ConfigureQuestions: [
            {
              QuestionKey: 17,
              QuestionSort: 0,
              QuestionText: 'Oven Temperature',
              QuestionTypeId: 8,
              AddResponseTextToNameFlag: false,
              ChildQuestions: [],
            },
            {
              QuestionKey: 19,
              QuestionSort: 1,
              QuestionText:
                'QUALITY CHECK:  Are at least three of the four temperatures above between 155-170F?',
              QuestionTypeId: 8,
              MinimumPreferred: null,
              ObservedQuestions: null,
              AddResponseTextToNameFlag: false,
              ListQuestionKey: null,
              IsRunSizeQuestion: null,
              ChildQuestions: [],
            },
          ],
          EffectiveDate: null,
          Locations: [],

          ListRoleId: formData?.listRoleId,
          ListRole: this.getData(
            formData?.listRoleId,
            'checklistUserRoles',
            'CodeValue',
            'CodeId'
          ),

          CorporateAccountIdentifier: this.getData(
            formData?.CorporateAccountId,
            'brands',
            'CorporateAccountIdentifier',
            'CorporateAccountId'
          ),
          CorporateAccountName: this.getData(
            formData?.CorporateAccountId,
            'brands',
            'Brand',
            'CorporateAccountId',
          ),
          Areas: this.createArea(formData?.areaIds),
          ListTypeId: formData?.listTypeId,
          ListType: this.getData(
            formData?.listTypeId,
            'checklistTypes',
            'CodeValue',
            'CodeId'
          ),
        },
      ],
    };
    console.log(sampleData);
  }

  createArea(data: any) {
    let returnData: any = [];
    data?.forEach((id: any) => {
      this.dropDownData?.checklistAreas.forEach((eachArea: any) => {
        if (id == eachArea?.CodeId) {
          returnData.push({
            Area: eachArea?.CodeValue,
            AreaTextId: eachArea?.CodeId,
            ListKey: eachArea?.CodeValueName,
          });
        }
      });
    });
    return returnData;
  }

  getData(data: any, key: string, key2: string, key3: string) {
    let returnData = '';
    this.dropDownData[key]?.forEach((eachType: any) => {
      if (data == eachType[key3]) {
        returnData = eachType[key2];
      }
    });
    return returnData;
  }

}
