import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DatePipe, HashLocationStrategy, LocationStrategy  } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContentWrapperComponent } from './__inc/content-wrapper/content-wrapper.component';
import { ControlSidebarComponent } from './__inc/control-sidebar/control-sidebar.component';
import { MainFooterComponent } from './__inc/main-footer/main-footer.component';
import { MainHeaderComponent } from './__inc/main-header/main-header.component';
import { MainSidebarComponent } from './__inc/main-sidebar/main-sidebar.component';
import { WebfooterComponent } from './__inc/webfooter/webfooter.component';
import { WebheaderComponent } from './__inc/webheader/webheader.component';
import { WhatsupchatComponent } from './__inc/whatsupchat/whatsupchat.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule } from "ngx-ui-loader";
import { DataTablesModule } from 'angular-datatables';
import { HomeComponent } from './webpages/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgChartsModule } from 'ng2-charts';
import { LogoutComponent } from './auth/logout/logout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MenuComponent } from './__inc/menuitem/menu/menu.component';
import { ResetpasswordComponent } from './auth/resetpassword/resetpassword.component';
import { ForgotpasswordComponent } from './auth/forgotpassword/forgotpassword.component';
import { AboutusComponent } from './webpages/aboutus/aboutus.component';
import { ContactusComponent } from './webpages/contactus/contactus.component';
import { FaqsComponent } from './webpages/faqs/faqs.component';
import { SuperadminComponent } from './__inc/menuitem/superadmin/superadmin.component';
import { RegistrationoffcrComponent } from './__inc/menuitem/registrationoffcr/registrationoffcr.component';
import { HeadofbillingComponent } from './__inc/menuitem/headofbilling/headofbilling.component';
import { HeadmanageadminComponent } from './headoficta/headmanageadmin/headmanageadmin.component';
import { HeadmyprofileComponent } from './headoficta/headmyprofile/headmyprofile.component';
import { HeadchangepasswordComponent } from './headoficta/headchangepassword/headchangepassword.component';
import { HeadtariffsComponent } from './headoficta/headtariffs/headtariffs.component';
import { HeadbillstructureComponent } from './headoficta/headbillstructure/headbillstructure.component';
import { HeadconsumerlistingComponent } from './headoficta/headconsumerlisting/headconsumerlisting.component';
import { RegisteroffcrprofileComponent } from './registrationoffcr/registeroffcrprofile/registeroffcrprofile.component';
import { HeadgeneratedbillsComponent } from './headoficta/headgeneratedbills/headgeneratedbills.component';
import { HeadpayhistoryComponent } from './headoficta/headpayhistory/headpayhistory.component';
import { HeadcreatebillComponent } from './headoficta/headcreatebill/headcreatebill.component';
import { HeadBillPaymentComponent } from './headoficta/head-bill-payment/head-bill-payment.component';
import { RegstrncreatebillComponent } from './registrationoffcr/regstrncreatebill/regstrncreatebill.component';
import { RegistrationbillpaymntComponent } from './registrationoffcr/registrationbillpaymnt/registrationbillpaymnt.component';

import { BillingofficerComponent } from './__inc/menuitem/billingofficer/billingofficer.component';
import { BillingbillstructureComponent } from './billingofficer/billingbillstructure/billingbillstructure.component';
import { BillingbillpaymentComponent } from './billingofficer/billingbillpayment/billingbillpayment.component';
import { BillingcreatebillComponent } from './billingofficer/billingcreatebill/billingcreatebill.component';
import { BillingpaymnthistoryComponent } from './billingofficer/billingpaymnthistory/billingpaymnthistory.component';
import { BillingreportsbillsComponent } from './billingofficer/billingreportsbills/billingreportsbills.component';
import { HeadbilligcreatebillComponent } from './headbilling/headbilligcreatebill/headbilligcreatebill.component';
import { HeadbillingpaymentComponent } from './headbilling/headbillingpayment/headbillingpayment.component';
import { HeadbillingpaymenthistryComponent } from './headbilling/headbillingpaymenthistry/headbillingpaymenthistry.component';
import { HeadbillinggeneratedbillsComponent } from './headbilling/headbillinggeneratedbills/headbillinggeneratedbills.component';
import { HeadbliingconsumerlistComponent } from './headbilling/headbliingconsumerlist/headbliingconsumerlist.component';
import { HeadprofilerequestsComponent } from './headoficta/headprofilerequests/headprofilerequests.component';
import { HeadbillingprofilereqComponent } from './headbilling/headbillingprofilereq/headbillingprofilereq.component';
import { BillingprofileComponent } from './billingofficer/billingprofile/billingprofile.component';
import { HeadbillingbillstrctureComponent } from './headbilling/headbillingbillstrcture/headbillingbillstrcture.component';
import { BillingprofilereqComponent } from './billingofficer/billingprofilereq/billingprofilereq.component';
import { PrivacypolicyComponent } from './webpages/privacypolicy/privacypolicy.component';
import { NumbersOnlyDirective } from './numbers-only.directive';
import { BillingsettlementsComponent } from './billingofficer/billingsettlements/billingsettlements.component';
import { HeadictsettlementsComponent } from './headoficta/headictsettlements/headictsettlements.component';
import { HeadbillingsettlementsComponent } from './headbilling/headbillingsettlements/headbillingsettlements.component';



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
    SuperadminComponent,
    RegistrationoffcrComponent,
    HeadofbillingComponent,
    HeadmanageadminComponent,
    HeadmyprofileComponent,
    HeadchangepasswordComponent,
    HeadtariffsComponent,
    HeadbillstructureComponent,
    HeadconsumerlistingComponent,
    RegisteroffcrprofileComponent,
    HeadgeneratedbillsComponent,
    HeadpayhistoryComponent,
    HeadcreatebillComponent,
    HeadBillPaymentComponent,
    RegstrncreatebillComponent,
    RegistrationbillpaymntComponent,
    BillingofficerComponent,
    BillingbillstructureComponent,
    BillingbillpaymentComponent,
    BillingcreatebillComponent,
    BillingpaymnthistoryComponent,
    BillingreportsbillsComponent,
    HeadbilligcreatebillComponent,
    HeadbillingpaymentComponent,
    HeadbillingpaymenthistryComponent,
    HeadbillinggeneratedbillsComponent,
    HeadbliingconsumerlistComponent,
    HeadprofilerequestsComponent,
    HeadbillingprofilereqComponent,
    BillingprofileComponent,
    HeadbillingbillstrctureComponent,
    BillingprofilereqComponent,
    PrivacypolicyComponent,
    NumbersOnlyDirective,
    BillingsettlementsComponent,
    HeadictsettlementsComponent,
    HeadbillingsettlementsComponent,

 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxUiLoaderModule,
    FormsModule,
    DataTablesModule,
    NgbModule,
    HttpClientModule,
    NgxPaginationModule,
    NgChartsModule,
    
   
  ],
  providers: [
    DatePipe,
    {provide : LocationStrategy , useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
