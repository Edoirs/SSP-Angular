import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotpasswordComponent } from './auth/forgotpassword/forgotpassword.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { ResetpasswordComponent } from './auth/resetpassword/resetpassword.component';
import { HeadBillPaymentComponent } from './headoficta/head-bill-payment/head-bill-payment.component';
import { HeadbillstructureComponent } from './headoficta/headbillstructure/headbillstructure.component';
import { HeadchangepasswordComponent } from './headoficta/headchangepassword/headchangepassword.component';
import { HeadconsumerlistingComponent } from './headoficta/headconsumerlisting/headconsumerlisting.component';
import { HeadcreatebillComponent } from './headoficta/headcreatebill/headcreatebill.component';
import { HeadgeneratedbillsComponent } from './headoficta/headgeneratedbills/headgeneratedbills.component';
import { HeadmanageadminComponent } from './headoficta/headmanageadmin/headmanageadmin.component';
import { HeadmyprofileComponent } from './headoficta/headmyprofile/headmyprofile.component';
import { HeadpayhistoryComponent } from './headoficta/headpayhistory/headpayhistory.component';
import { HeadtariffsComponent } from './headoficta/headtariffs/headtariffs.component';
import { AboutusComponent } from './webpages/aboutus/aboutus.component';
import { ContactusComponent } from './webpages/contactus/contactus.component';
import { FaqsComponent } from './webpages/faqs/faqs.component';
import { HomeComponent } from './webpages/home/home.component';
import { HeadprofilerequestsComponent } from './headoficta/headprofilerequests/headprofilerequests.component';
import { PrivacypolicyComponent } from './webpages/privacypolicy/privacypolicy.component';
import { HeadictsettlementsComponent } from './headoficta/headictsettlements/headictsettlements.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "logout", component: LogoutComponent },
  { path: "dashboard", component: DashboardComponent },
  { path: "resetpassword", component: ResetpasswordComponent },
  { path: "forgotpassword", component: ForgotpasswordComponent },
  { path: "signUp", component:SignUpComponent},

  { path: "contactus", component: ContactusComponent },
  { path: "aboutus", component: AboutusComponent },
  { path: "faqs", component: FaqsComponent },
  { path: "privacypolicy", component: PrivacypolicyComponent },


  { path: "headmanageadmin", component: HeadmanageadminComponent },
  { path: "headmyprofile", component: HeadmyprofileComponent },
  { path: "headchangepassword", component: HeadchangepasswordComponent },
  { path: "headtariffs", component: HeadtariffsComponent },
  { path: "headbillstructure", component: HeadbillstructureComponent },
  { path: "headconsumer", component: HeadconsumerlistingComponent },
  { path: "headgeneratedbills", component: HeadgeneratedbillsComponent },
  { path: "headbills", component: HeadcreatebillComponent },
  { path: "headbillspayment", component: HeadBillPaymentComponent },
  { path: "headpaymenthistory", component: HeadpayhistoryComponent },
  { path: "headprofilerequest", component: HeadprofilerequestsComponent },
   { path: "headsettlement", component: HeadictsettlementsComponent },
  
  


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
