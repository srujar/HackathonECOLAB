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
    checklistNames: [],
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
          ListDescriptionTextId: null,
          ListDescription: '',
          Tags: [],
          ExpiryAlert: [],
          DisplayExpiryAlert: false,
          EffectiveDate: null,
          Locations: !this.getHeaderData()?.LocationIdentifier
            ? []
            : [
                {
                  LocationId: 0,
                  LocationIdentifier: this.getHeaderData()?.LocationIdentifier,
                },
              ],

          // ListKey: 0,
          Schedules: formData?.scheduleRecurrenceTypeId
            ? this.createSchedule(formData)
            : [],
          ConfigureQuestions: this.createQuestions(formData?.QuestionKey),
          ListNameTextId: formData?.listNameTextId,
          ListName: this.getData(
            formData?.listNameTextId,
            'checklistNames',
            'TextValue',
            'TextId'
          ),
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
            'CorporateAccountId'
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
    return sampleData;
  }

  createArea(data: any) {
    let returnData: any = [];
    data?.forEach((id: any) => {
      this.dropDownData?.checklistAreas.forEach((eachArea: any) => {
        if (id == eachArea?.CodeId) {
          returnData.push({
            Area: eachArea?.CodeValue,
            AreaTextId: eachArea?.CodeId,
            ListKey: null,
          });
        }
      });
    });
    return returnData;
  }

  getData(data: any, key: string, key2: string, key3: string) {
    if (!data || !key || !key2 || !key3) {
      return '';
    }
    let returnData = '';
    this.dropDownData[key]?.forEach((eachType: any) => {
      if (data == eachType[key3]) {
        returnData = eachType[key2];
      }
    });
    return returnData;
  }

  createQuestions(QuestionKey: any = []) {
    let returnData = [];
    QuestionKey?.forEach((id: any) => {
      this.dropDownData?.checksddl?.forEach((eachQ: any) => {
        if (id == eachQ?.QuestionKey) {
          returnData.push({
            QuestionKey: eachQ?.QuestionKey,
            QuestionSort: eachQ?.QuestionSort,
            QuestionText: eachQ?.CheckName,
            QuestionTypeId: eachQ?.QuestionTypeId,
            AddResponseTextToNameFlag: false,
            ChildQuestions: [],
          });
        }
      });
    });
  }

  createSchedule(formData: any) {
    let returnData: any = {
      DayRecurrenceWeekdayFlag: false,
      WeekRecurrence: null,
      SundayFlag: false,
      MondayFlag: false,
      TuesdayFlag: false,
      WednesdayFlag: false,
      ThursdayFlag: false,
      FridayFlag: false,
      SaturdayFlag: false,
      MonthRecurrenceType: null,
      MonthRecurrenceTypeId: null,
      MonthRecurrenceDay: null,
      MonthRecurrence: null,
      MonthRecurrenceDayOccurrence: null,
      NoEndDateFlag: false,
      MinimumRequiredRecurring: 0,
      MaximumDailyRecurrence: null,
      ListKey: null,
      ListScheduleId: null,
      LocationIdentifiers: [],
      IsEdit: false,
      IsModified: true,
      ScheduleRecurrenceTypeId: null,

      DayRecurrence: formData?.dayRecurrence,
      HourRecurrence: formData?.hourRecurrence,
      FirstStartTime: formData?.firstStartTime
        ? `${this.n(formData?.firstStartTime?.hour)}:${this.n(
            formData?.firstStartTime?.minute
          )}:${this.n(formData?.firstStartTime?.second)}`
        : null,
      LastStartTime: formData?.lastStartTime
        ? `${this.n(formData?.lastStartTime?.hour)}:${this.n(
            formData?.lastStartTime?.minute
          )}:${this.n(formData?.lastStartTime?.second)}`
        : null,
      TimeDuration: formData?.timeDuration,
      StartDate: formData?.startDate
        ? `${formData?.startDate?.month}:${formData?.startDate?.day}:${formData?.startDate?.year}`
        : null,
      EndDate: formData?.endDate
        ? `${formData?.endDate?.month}:${formData?.endDate?.day}:${formData?.endDate?.year}`
        : null,
      ScheduleRecurrenceType: formData?.scheduleRecurrenceTypeId,
    };

    if (formData?.scheduleRecurrenceTypeId == 'No Recurrence') {
      returnData['ScheduleRecurrenceTypeId'] = 1;
    } else if (formData?.scheduleRecurrenceTypeId == 'Hourly') {
      returnData['ScheduleRecurrenceTypeId'] = 2;
    } else {
      returnData['ScheduleRecurrenceTypeId'] = 3;
    }

    return [returnData];
  }

  n(num: any, len = 2) {
    return `${num}`.padStart(len, '0');
  }
}
