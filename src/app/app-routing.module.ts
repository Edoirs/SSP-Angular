import { DisplayuserComponent } from './paye/users/displayuser/displayuser.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotpasswordComponent } from './auth/forgotpassword/forgotpassword.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { ResetpasswordComponent } from './auth/resetpassword/resetpassword.component';
import { AboutusComponent } from './webpages/aboutus/aboutus.component';
import { ContactusComponent } from './webpages/contactus/contactus.component';
import { FaqsComponent } from './webpages/faqs/faqs.component';
import { HomeComponent } from './webpages/home/home.component';
import { PrivacypolicyComponent } from './webpages/privacypolicy/privacypolicy.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AnnualreturnemployeesuploadComponent } from './paye/annualreturns/annualreturnemployeesupload/annualreturnemployeesupload.component';
import { AnnualreturnassessmentsComponent } from './paye/annualreturns/annualreturnassessments/annualreturnassessments.component';
import { AnnualreturnschedulesComponent } from './paye/annualreturns/annualreturnschedules/annualreturnschedules.component';
import { AnnualreturnsComponent } from './paye/annualreturns/annualreturns/annualreturns.component';
import { ReassessmentappealsComponent } from './paye/annualreturns/reassessmentappeals/reassessmentappeals.component';
import { ReassessmentsComponent } from './paye/annualreturns/reassessments/reassessments.component';
import { ApprovedprojectionComponent } from './paye/annualprojection/approvedprojection/approvedprojection.component';
import { PendingprojectionComponent } from './paye/annualprojection/pendingprojection/pendingprojection.component';
import { UploadprojectionComponent } from './paye/annualprojection/uploadprojection/uploadprojection.component';
import { AssessmentsComponent } from './paye/monthlyremittance/assessments/assessments.component';
import { DeletedemployeesComponent } from './paye/monthlyremittance/deletedemployees/deletedemployees.component';
import { EmployeescheduleComponent } from './paye/monthlyremittance/employeeschedule/employeeschedule.component';
import { SchedulesComponent } from './paye/monthlyremittance/schedules/schedules.component';
import { AdduserComponent } from './paye/users/adduser/adduser.component';
import { EditComponent } from './paye/users/edit/edit.component';
// import { CompanyprofileComponent } from './paye/users/companyprofile/companyprofile.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "logout", component: LogoutComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "resetpassword", component: ResetpasswordComponent },
  { path: "forgotpassword", component: ForgotpasswordComponent },
  { path: "signUp", component: SignUpComponent },

  { path: "contactus", component: ContactusComponent },
  { path: "aboutus", component: AboutusComponent },
  { path: "faqs", component: FaqsComponent },
  { path: "privacypolicy", component: PrivacypolicyComponent },




  { path: "assessments", component: AssessmentsComponent },
  { path: "deletedemployees", component: DeletedemployeesComponent },
  { path: "employeeschedule", component: EmployeescheduleComponent },
  { path: "schedules", component: SchedulesComponent },

  { path: "annualreturnemployeesupload", component: AnnualreturnemployeesuploadComponent },
  { path: "annualreturnassessments", component: AnnualreturnassessmentsComponent },
  { path: "annualreturnschedules", component: AnnualreturnschedulesComponent },
  { path: "annualreturns", component: AnnualreturnsComponent },
  { path: "reassessmentappeals", component: ReassessmentappealsComponent },
  { path: "reassessments", component: ReassessmentsComponent },

  { path: "approvedprojection", component: ApprovedprojectionComponent },
  { path: "pendingprojection", component: PendingprojectionComponent },
  { path: "uploadprojection", component: UploadprojectionComponent },

  { path: "adduser", component: AdduserComponent },
  { path: "edituser", component: EditComponent },
  { path: "displayuser", component: DisplayuserComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
