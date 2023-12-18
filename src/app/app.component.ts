import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppService } from './app.service';
import { HelperService } from './helper.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    private fb: FormBuilder,
    private appService: AppService,
    private helperService: HelperService
  ) {
    this.typeOfSchudule = ['No Recurrence', 'Hourly', 'Daily'];
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

  questionForm!: FormGroup;

  ngOnInit(): void {
    this.getInitalData();
    this.initializeForm();
    this.helperService.getDropDownData.subscribe((data: any) => {
      if (data) {
        console.log(this.helperService.dropDownData);
        this.brand = this.helperService.dropDownData.brands;
        this.checklistType = this.helperService.dropDownData.checklistTypes;
        this.role = this.helperService.dropDownData.checklistUserRoles;
        this.areas = this.helperService.dropDownData.checklistAreas;
        this.checksddl = this.helperService.dropDownData.checksddl;
      }
    });
  }

  async getInitalData() {
    await this.appService.getUserInfoDetails().subscribe();
    await this.appService.getBrandList().subscribe();
  }

  onBrandChange(brand: any) {
    this.selectedBrand = brand;
    this.getDropDownData();
  }

  onQuestionChange(question: any) {
    this.selectedQuestion = question;
  }

  onCheklistTypeChange(type: any) {
    this.selectedChecklistType = type;
    this.getQuestionData();
  }

  getDropDownData() {
    this.appService
      .getChecklistDropdownData(
        this.helperService.getUserData()?.Email,
        this.selectedBrand.CorporateAccountIdentifier,
        'en-US'
      )
      .subscribe();
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
    });
  }

  changeSchuduleType(getSchuduleType: any) {
    console.log(getSchuduleType)
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
}
