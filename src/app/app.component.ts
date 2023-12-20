import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppService } from './app.service';
import { HelperService } from './helper.service';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private helperService: HelperService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.typeOfSchudule = ['No Recurrence', 'Hourly', 'Daily'];

    activatedRoute.queryParamMap.subscribe(async (params: any) => {
      if (params.params.hasOwnProperty('token')) {
        this.helperService.setHeaderData(params.params);
        await this.getInitalData();
      }
    });
  }

  title = 'createChecklistFormMobile';
  firstStarttime = { hour: 12, minute: 0 };
  lastStarttime = { hour: 12, minute: 0 };
  standalone = true;
  meridian = true;
  typeOfSchudule: Array<string> | undefined;
  model = { option: 'noRecurrence' };

  selectedBrand: any = null;
  selectedQuestion: any = null;
  selectedChecklistType: any = null;

  noRecurrence: boolean = true;
  hourly: boolean = false;
  daily: boolean = false;

  brand = [];
  checklistType = [];
  role = [];
  areas = [];
  checksddl = [];
  checklistNames: any = [];

  questionForm!: FormGroup;

  loadData: boolean = false;

  async ngOnInit() {
    this.initializeForm();
    this.helperService.getDropDownData.subscribe((data: any) => {
      if (data) {
        console.log(data);
        this.brand = this.helperService.dropDownData.brands;
        this.checklistType = this.helperService.dropDownData.checklistTypes;
        this.role = this.helperService.dropDownData.checklistUserRoles;
        this.areas = this.helperService.dropDownData.checklistAreas;
        this.checksddl = this.helperService.dropDownData.checksddl;
        this.checklistNames = this.helperService.dropDownData.checklistNames;
      }
    });
  }

  async getInitalData() {
    this.spinner.show();
    await this.appService.getUserInfoDetails().subscribe();
    await this.appService.getBrandList().subscribe();
    await this.appService.getchecklistNames().subscribe();
    this.spinner.show();
  }

  onBrandChange(brand: any) {
    console.log(brand);
    this.selectedBrand = brand;
    this.getDropDownData();
  }

  onQuestionChange(question: any) {
    console.log('question..................', question);
    this.selectedQuestion = question;
  }

  onCheklistTypeChange(type: any) {
    this.selectedChecklistType = type;
    this.getQuestionData();
  }

  async getDropDownData() {
    this.spinner.show();
    await this.appService
      .getChecklistDropdownData(
        this.helperService.getUserData()?.Email,
        this.selectedBrand.CorporateAccountIdentifier,
        'en-US'
      )
      .subscribe();
    this.spinner.hide();
  }

  getQuestionData() {
    this.appService
      .getChecksByCheckListTypeId(
        this.selectedBrand?.CorporateAccountId,
        this.selectedChecklistType?.CodeId,
        false,
        'en-US'
      )
      .subscribe();
  }

  initializeForm() {
    this.changeSchuduleType(this.model);
    this.questionForm = this.fb.group({
      CorporateAccountId: [{ value: null, disabled: false }, []],
      listNameTextId: [{ value: null, disabled: false }, []],
      listTypeId: [{ value: null, disabled: false }, []],
      listRoleId: [{ value: null, disabled: false }, []],
      areaIds: [{ value: null, disabled: false }, []],
      QuestionKey: [{ value: null, disabled: false }, []],
      scheduleRecurrenceTypeId: [{ value: null, disabled: false }, []],
      firstStartTime: [{ value: null, disabled: false }, []],
      lastStartTime: [{ value: null, disabled: false }, []],
      timeDuration: [{ value: null, disabled: false }, []],
      startDate: [{ value: null, disabled: false }, []],
      endDate: [{ value: null, disabled: false }, []],
      dayRecurrence: [{ value: null, disabled: false }, []],
      hourRecurrence: [{ value: null, disabled: false }, []],
      dayRecurrenceWeekdayFlag: [{ value: null, disabled: false }, []],
    });
  }

  changeSchuduleType(getSchuduleType: any) {
    // console.log(getSchuduleType)
    if (getSchuduleType === 'No Recurrence') {
      this.noRecurrence = true;
      this.hourly = false;
      this.daily = false;
    } else if (getSchuduleType === 'Hourly') {
      this.hourly = true;
      this.noRecurrence = false;
      this.daily = false;
    } else if (getSchuduleType === 'Daily') {
      this.daily = true;
      this.hourly = false;
      this.noRecurrence = false;
    }
  }

  addDisplayNamePromise = (newText: string) => {
    return new Promise((resolve, reject) => {
      this.loadData = true;
      const reqData = this.getNewTextValueRow(9, newText);
      this.appService.addTextValueRow(reqData).subscribe(
        (res: any) => {
          if (res) {
            let newData: any = {
              TextId: res.TextId,
              TextValue: res.TextValue,
            };
            this.checklistNames.push(newData);
            resolve(newData);
            this.loadData = false;
          } else {
            reject();
          }
        },
        (err: any) => {
          this.loadData = false;
          console.log(err);
          reject();
        }
      );
    });
  };

  getNewTextValueRow(catId: number, text: string): any {
    return {
      TextId: 0,
      TextCategoryId: catId,
      LanguageId: 1,
      TextValue: text,
      TextValueVersion: 1,
      ActiveFlag: true,
      CorporateAccountId: this.selectedBrand?.CorporateAccountId,
    };
  }

  submit() {
    console.log(this.questionForm.value);
    this.spinner.show();
    let reqData = this.helperService.createJSON(this.questionForm.value);
    this.appService.submitChecklist(reqData).subscribe(
      (res) => {
        console.log('res', res);
        alert("Checklist Created!")
        this.spinner.hide();
        this.router.navigate(['/success']);
      },
      (err) => {
        this.router.navigate(['/error']);
        console.log('err on submit checklist', err);
      }
    );
  }
}
