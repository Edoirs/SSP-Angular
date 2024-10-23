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

const routes: Routes = [
  {path: "", redirectTo: "home", pathMatch: "full"},
  {path: "home", component: HomeComponent},
  {path: "login", component: LoginComponent},
  {path: "logout", component: LogoutComponent},
  {path: "resetpassword", component: ResetpasswordComponent},
  {path: "forgotpassword", component: ForgotpasswordComponent},
  {path: "signUp", component: SignUpComponent},

  {path: "contactus", component: ContactusComponent},
  {path: "aboutus", component: AboutusComponent},
  {path: "faqs", component: FaqsComponent},
  {path: "privacypolicy", component: PrivacypolicyComponent},

  {
    path: "admin",
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
