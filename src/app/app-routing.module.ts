import {DisplayuserComponent} from "./admin/features/users/displayuser/displayuser.component"
import {NgModule} from "@angular/core"
import {RouterModule, Routes} from "@angular/router"
import {ForgotpasswordComponent} from "./auth/pages/forgotpassword/forgotpassword.component"
import {LoginComponent} from "./auth/pages/login/login.component"
import {LogoutComponent} from "./auth/pages/logout/logout.component"
import {ResetpasswordComponent} from "./auth/pages/resetpassword/resetpassword.component"
import {AboutusComponent} from "./webpages/aboutus/aboutus.component"
import {ContactusComponent} from "./webpages/contactus/contactus.component"
import {FaqsComponent} from "./webpages/faqs/faqs.component"
import {HomeComponent} from "./webpages/home/home.component"
import {PrivacypolicyComponent} from "./webpages/privacypolicy/privacypolicy.component"
import {SignUpComponent} from "./auth/pages/sign-up/sign-up.component"
// import { CompanyprofileComponent } from './paye/users/companyprofile/companyprofile.component';

import {AuthGuard} from "@shared-guards/auth.guard"

export const LANDING_PATHS = {
  home: "home",
  login: "login",
  logout: "logout",
  resetPassword: "resetpassword",
  forgotPassword: "forgotpassword",
  signUp: "signUp",
  contactUs: "contactus",
  aboutUs: "aboutus",
  faqs: "faqs",
  privacyPolicy: "privacypolicy",
  admin: "admin",
}

const routes: Routes = [
  {path: "", redirectTo: LANDING_PATHS.home, pathMatch: "full"},
  {path: LANDING_PATHS.home, component: HomeComponent},
  {path: LANDING_PATHS.login, component: LoginComponent},
  {path: LANDING_PATHS.logout, component: LogoutComponent},
  {path: LANDING_PATHS.resetPassword, component: ResetpasswordComponent},
  {path: LANDING_PATHS.forgotPassword, component: ForgotpasswordComponent},
  {path: LANDING_PATHS.signUp, component: SignUpComponent},

  {path: LANDING_PATHS.contactUs, component: ContactusComponent},
  {path: LANDING_PATHS.aboutUs, component: AboutusComponent},
  {path: LANDING_PATHS.faqs, component: FaqsComponent},
  {path: LANDING_PATHS.privacyPolicy, component: PrivacypolicyComponent},

  {
    path: LANDING_PATHS.admin,
    loadChildren: () =>
      import("./admin/features/paye-routes.module").then(
        (m) => m.PayeRoutingModule
      ),
    canActivate: [AuthGuard],
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
