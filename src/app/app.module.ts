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
import {LoginComponent} from "./auth/pages/login/login.component"
import {NgbModule} from "@ng-bootstrap/ng-bootstrap"
import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from "@angular/common/http"
import {NgxPaginationModule} from "ngx-pagination"
import {NgChartsModule} from "ng2-charts"
import {LogoutComponent} from "./auth/pages/logout/logout.component"
import {DashboardComponent} from "./admin/features/dashboard/dashboard.component"
import {MenuComponent} from "./__inc/menuitem/menu/menu.component"
import {ResetpasswordComponent} from "./auth/pages/resetpassword/resetpassword.component"
import {ForgotpasswordComponent} from "./auth/pages/forgotpassword/forgotpassword.component"
import {AboutusComponent} from "./webpages/aboutus/aboutus.component"
import {ContactusComponent} from "./webpages/contactus/contactus.component"
import {FaqsComponent} from "./webpages/faqs/faqs.component"

import {PrivacypolicyComponent} from "./webpages/privacypolicy/privacypolicy.component"
import {NumbersOnlyDirective} from "./numbers-only.directive"
import {SignUpComponent} from "./auth/pages/sign-up/sign-up.component"
import {AnnualreturnemployeesuploadComponent} from "./admin/features/annualreturns/annualreturnemployeesupload/annualreturnemployeesupload.component"
import {AnnualreturnsComponent} from "./admin/features/annualreturns/annualreturns/annualreturns.component"
import {AnnualreturnschedulesComponent} from "./admin/features/annualreturns/annualreturnschedules/annualreturnschedules.component"
import {AnnualreturnassessmentsComponent} from "./admin/features/annualreturns/annualreturnassessments/annualreturnassessments.component"
import {ReassessmentsComponent} from "./admin/features/annualreturns/reassessments/reassessments.component"
import {ReassessmentappealsComponent} from "./admin/features/annualreturns/reassessmentappeals/reassessmentappeals.component"
import {UploadprojectionComponent} from "./admin/features/annualprojection/features/uploadprojection/uploadprojection.component"
import {PendingprojectionComponent} from "./admin/features/annualprojection/features/pendingprojection/pendingprojection.component"
import {ApprovedprojectionComponent} from "./admin/features/annualprojection/features/approvedprojection/approvedprojection.component"
import {EmployeescheduleComponent} from "./admin/features/monthlyremittance/employeeschedule/employeeschedule.component"
import {DeletedemployeesComponent} from "./admin/features/monthlyremittance/deletedemployees/deletedemployees.component"
import {SchedulesComponent} from "./admin/features/monthlyremittance/schedules/schedules.component"
import {AssessmentsComponent} from "./admin/features/monthlyremittance/assessments/assessments.component"
import {DisplayuserComponent} from "./admin/features/users/displayuser/displayuser.component"
import {AdduserComponent} from "./admin/features/users/adduser/adduser.component"
import {EditComponent} from "./admin/features/users/edit/edit.component"
import {CompanyprofileComponent} from "./admin/features/profile/companyprofile/companyprofile.component"
import {MatPaginatorModule} from "@angular/material/paginator"
import {NgToggleModule} from "ng-toggle-button"
import {loggingInterceptor} from "@shared/interceptor/logging.interceptor"
import {ExportAsModule} from "ngx-export-as"

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
    MatPaginatorModule,
    ExportAsModule,
    NgToggleModule.forRoot(),
  ],
  providers: [
    DatePipe,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([loggingInterceptor])
    ),
    provideAnimationsAsync(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
