import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotpasswordComponent } from './auth/forgotpassword/forgotpassword.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { ResetpasswordComponent } from './auth/resetpassword/resetpassword.component';
import { BillingbillpaymentComponent } from './billingofficer/billingbillpayment/billingbillpayment.component';
import { BillingbillstructureComponent } from './billingofficer/billingbillstructure/billingbillstructure.component';
import { BillingcreatebillComponent } from './billingofficer/billingcreatebill/billingcreatebill.component';
import { BillingpaymnthistoryComponent } from './billingofficer/billingpaymnthistory/billingpaymnthistory.component';
import { BillingreportsbillsComponent } from './billingofficer/billingreportsbills/billingreportsbills.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeadbilligcreatebillComponent } from './headbilling/headbilligcreatebill/headbilligcreatebill.component';
import { HeadbillinggeneratedbillsComponent } from './headbilling/headbillinggeneratedbills/headbillinggeneratedbills.component';
import { HeadbillingpaymentComponent } from './headbilling/headbillingpayment/headbillingpayment.component';
import { HeadbillingpaymenthistryComponent } from './headbilling/headbillingpaymenthistry/headbillingpaymenthistry.component';
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
import { RegisteroffcrprofileComponent } from './registrationoffcr/registeroffcrprofile/registeroffcrprofile.component';
import { RegistrationbillpaymntComponent } from './registrationoffcr/registrationbillpaymnt/registrationbillpaymnt.component';
import { RegstrncreatebillComponent } from './registrationoffcr/regstrncreatebill/regstrncreatebill.component';
import { AboutusComponent } from './webpages/aboutus/aboutus.component';
import { ContactusComponent } from './webpages/contactus/contactus.component';
import { FaqsComponent } from './webpages/faqs/faqs.component';
import { HomeComponent } from './webpages/home/home.component';
import { HeadbliingconsumerlistComponent } from './headbilling/headbliingconsumerlist/headbliingconsumerlist.component';
import { HeadprofilerequestsComponent } from './headoficta/headprofilerequests/headprofilerequests.component';
import { HeadbillingprofilereqComponent } from './headbilling/headbillingprofilereq/headbillingprofilereq.component';
import { BillingprofileComponent } from './billingofficer/billingprofile/billingprofile.component';
import { HeadbillingbillstrctureComponent } from './headbilling/headbillingbillstrcture/headbillingbillstrcture.component';
import { BillingprofilereqComponent } from './billingofficer/billingprofilereq/billingprofilereq.component';
import { PrivacypolicyComponent } from './webpages/privacypolicy/privacypolicy.component';
import { BillingsettlementsComponent } from './billingofficer/billingsettlements/billingsettlements.component';
import { HeadictsettlementsComponent } from './headoficta/headictsettlements/headictsettlements.component';
import { HeadbillingsettlementsComponent } from './headbilling/headbillingsettlements/headbillingsettlements.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';


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
  
  // <!------------ Register Officer Menu  ------------------>

  { path: "registrationprofiling", component: RegisteroffcrprofileComponent },
  { path: "registrationbills", component: RegstrncreatebillComponent },

  { path: "registrationpayment", component: RegistrationbillpaymntComponent },

  // <!------------ billing Officer Menu  ------------------>

  { path: "billingbillstructure", component: BillingbillstructureComponent },
  { path: "billingpaymentbill", component: BillingbillpaymentComponent },
  { path: "billingcreatebill", component: BillingcreatebillComponent },
  { path: "billinggeneratedbill", component: BillingreportsbillsComponent },
  { path: "billingprofile", component: BillingprofileComponent },
  { path: "billingpaymenthistory", component: BillingpaymnthistoryComponent },
  { path: "billingprofilereq", component: BillingprofilereqComponent },
  { path: "billingsettlement", component: BillingsettlementsComponent },
    

  // <!------------ head billing Officer Menu  ------------------>

  { path: "headbillingcreatebill", component: HeadbilligcreatebillComponent },
  { path: "headbillingpayment", component: HeadbillingpaymentComponent },
  { path: "headbillinggeneratedbills", component: HeadbillinggeneratedbillsComponent },
  { path: "headbillingpaymenthistory", component: HeadbillingpaymenthistryComponent },
  { path: "headbillingprofile", component: HeadbliingconsumerlistComponent },
  { path: "headbillingprofilerequest", component: HeadbillingprofilereqComponent },
  { path: "headbillingstructure", component: HeadbillingbillstrctureComponent },
  { path: "headbillingsettlement", component: HeadbillingsettlementsComponent },
  


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
