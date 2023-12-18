import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbAlertModule, NgbDatepickerModule, NgbModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppInterceptor } from './app.interceptor';
import { BaseHttpClientService } from './base-http-client.service';
import { AppService } from './app.service';
import { HelperService } from './helper.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgbTimepickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbDatepickerModule, 
    NgbAlertModule, 
    JsonPipe,
    HttpClientModule
  ],
  providers: [
    HelperService,
    AppService,
    BaseHttpClientService,
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi : true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
