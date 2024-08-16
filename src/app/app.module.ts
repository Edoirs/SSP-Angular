import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async"
import {DatePipe, HashLocationStrategy, LocationStrategy} from "@angular/common"
import {AppRoutingModule} from "./app-routing.module"
import {AppComponent} from "./app.component"
import {ContentWrapperComponent} from "./__inc/content-wrapper/content-wrapper.component"
import {ControlSidebarComponent} from "./__inc/control-sidebar/control-sidebar.component"
import {MainFooterComponent} from "./__inc/main-footer/main-footer.component"
import {MainHeaderComponent} from "./__inc/main-header/main-header.component"
import {MainSidebarComponent} from "./__inc/main-sidebar/main-sidebar.component"
import {WebfooterComponent} from "./__inc/webfooter/webfooter.component"
import {WebheaderComponent} from "./__inc/webheader/webheader.component"
import {WhatsupchatComponent} from "./__inc/whatsupchat/whatsupchat.component"
import {FormsModule, ReactiveFormsModule} from "@angular/forms"
import {MatDialogModule} from "@angular/material/dialog"
import {NgxUiLoaderModule} from "ngx-ui-loader"
import {DataTablesModule} from "angular-datatables"
import {HomeComponent} from "./webpages/home/home.component"
import {LoginComponent} from "./auth/login/login.component"
import {NgbModule} from "@ng-bootstrap/ng-bootstrap"
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http"
import {NgxPaginationModule} from "ngx-pagination"
import {NgChartsModule} from "ng2-charts"
import {LogoutComponent} from "./auth/logout/logout.component"
import {DashboardComponent} from "./dashboard/dashboard.component"
import {MenuComponent} from "./__inc/menuitem/menu/menu.component"
import {ResetpasswordComponent} from "./auth/resetpassword/resetpassword.component"
import {ForgotpasswordComponent} from "./auth/forgotpassword/forgotpassword.component"
import {AboutusComponent} from "./webpages/aboutus/aboutus.component"
import {ContactusComponent} from "./webpages/contactus/contactus.component"
import {FaqsComponent} from "./webpages/faqs/faqs.component"

import {PrivacypolicyComponent} from "./webpages/privacypolicy/privacypolicy.component"
import {NumbersOnlyDirective} from "./numbers-only.directive"
import {SignUpComponent} from "./auth/sign-up/sign-up.component"
import {AnnualreturnemployeesuploadComponent} from "./paye/annualreturns/annualreturnemployeesupload/annualreturnemployeesupload.component"
import {AnnualreturnsComponent} from "./paye/annualreturns/annualreturns/annualreturns.component"
import {AnnualreturnschedulesComponent} from "./paye/annualreturns/annualreturnschedules/annualreturnschedules.component"
import {AnnualreturnassessmentsComponent} from "./paye/annualreturns/annualreturnassessments/annualreturnassessments.component"
import {ReassessmentsComponent} from "./paye/annualreturns/reassessments/reassessments.component"
import {ReassessmentappealsComponent} from "./paye/annualreturns/reassessmentappeals/reassessmentappeals.component"
import {UploadprojectionComponent} from "./paye/annualprojection/uploadprojection/uploadprojection.component"
import {PendingprojectionComponent} from "./paye/annualprojection/pendingprojection/pendingprojection.component"
import {ApprovedprojectionComponent} from "./paye/annualprojection/approvedprojection/approvedprojection.component"
import {EmployeescheduleComponent} from "./paye/monthlyremittance/employeeschedule/employeeschedule.component"
import {DeletedemployeesComponent} from "./paye/monthlyremittance/deletedemployees/deletedemployees.component"
import {SchedulesComponent} from "./paye/monthlyremittance/schedules/schedules.component"
import {AssessmentsComponent} from "./paye/monthlyremittance/assessments/assessments.component"
import {DisplayuserComponent} from "./paye/users/displayuser/displayuser.component"
import {AdduserComponent} from "./paye/users/adduser/adduser.component"
import {EditComponent} from "./paye/users/edit/edit.component"
import {CompanyprofileComponent} from "./paye/profile/companyprofile/companyprofile.component"

@NgModule({
  declarations: [
    AppComponent,
    ContentWrapperComponent,
    ControlSidebarComponent,
    MainFooterComponent,
    MainHeaderComponent,
    MainSidebarComponent,
    WebfooterComponent,
    WebheaderComponent,
    WhatsupchatComponent,
    HomeComponent,
    LoginComponent,
    LogoutComponent,
    DashboardComponent,
    MenuComponent,
    ResetpasswordComponent,
    ForgotpasswordComponent,
    AboutusComponent,
    ContactusComponent,
    FaqsComponent,
    PrivacypolicyComponent,
    NumbersOnlyDirective,
    SignUpComponent,
    AnnualreturnemployeesuploadComponent,
    AnnualreturnsComponent,
    AnnualreturnschedulesComponent,
    AnnualreturnassessmentsComponent,
    ReassessmentsComponent,
    ReassessmentappealsComponent,
    UploadprojectionComponent,
    PendingprojectionComponent,
    ApprovedprojectionComponent,
    EmployeescheduleComponent,
    DeletedemployeesComponent,
    SchedulesComponent,
    AssessmentsComponent,
    DisplayuserComponent,
    AdduserComponent,
    EditComponent,
    CompanyprofileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    FormsModule,
    DataTablesModule,
    NgbModule,
    NgxPaginationModule,
    NgChartsModule,
    MatDialogModule,
  ],
  providers: [
    DatePipe,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
