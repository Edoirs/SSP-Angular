import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async"
import {DatePipe, HashLocationStrategy, LocationStrategy} from "@angular/common"
import {AppRoutingModule} from "./app-routing.module"
import {AppComponent} from "./app.component"
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
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader"
import {ComingSoonComponent} from "@shared/components/coming-soon.component"
import {BulkUploadNoticeComponent} from "@shared/components/bulk-upload-notice.component"
import {IncModule} from "./__inc/inc.module"

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    LogoutComponent,
    DashboardComponent,
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
    ComingSoonComponent,
    BulkUploadNoticeComponent,
    IncModule,
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
    NgxSkeletonLoaderModule.forRoot({loadingText: "loading..."}),
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
