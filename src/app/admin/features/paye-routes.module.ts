import {NgModule} from "@angular/core"
import {RouterModule, Routes} from "@angular/router"
import {ApprovedprojectionComponent} from "./annualprojection/features/approvedprojection/approvedprojection.component"
import {PendingprojectionComponent} from "./annualprojection/features/pendingprojection/pendingprojection.component"
import {UploadprojectionComponent} from "./annualprojection/features/uploadprojection/uploadprojection.component"
import {AnnualreturnassessmentsComponent} from "./annualreturns/annualreturnassessments/annualreturnassessments.component"
import {AnnualreturnemployeesuploadComponent} from "./annualreturns/annualreturnemployeesupload/annualreturnemployeesupload.component"
import {AnnualreturnsComponent} from "./annualreturns/annualreturns/annualreturns.component"
import {AnnualreturnschedulesComponent} from "./annualreturns/annualreturnschedules/annualreturnschedules.component"
import {ReassessmentappealsComponent} from "./annualreturns/reassessmentappeals/reassessmentappeals.component"
import {ReassessmentsComponent} from "./annualreturns/reassessments/reassessments.component"
import {DashboardComponent} from "./dashboard/dashboard.component"
import {AssessmentsComponent} from "./monthlyremittance/assessments/assessments.component"
import {DeletedemployeesComponent} from "./monthlyremittance/deletedemployees/deletedemployees.component"
import {EmployeescheduleComponent} from "./monthlyremittance/employeeschedule/employeeschedule.component"
import {SchedulesComponent} from "./monthlyremittance/schedules/schedules.component"
import {AdduserComponent} from "./users/adduser/adduser.component"
import {DisplayuserComponent} from "./users/displayuser/displayuser.component"
import {EditComponent} from "./users/edit/edit.component"
import {PayeComponent} from "./paye.component"

import {NgxUiLoaderModule} from "ngx-ui-loader"
import {IncModule} from "src/app/__inc/inc.module"

export const ADMIN_PATHS = {
  dashboard: "dashboard",
  assessments: "assessments",
  schedules: "schedules",
  deletedEmployees: "deleted-employees",
  employeeSchedule: "employee-schedule",
  annualReturnEmployeesUpload: "annual-return-employees-upload",
  annualReturnAssessments: "annual-return-assessments",
  annualReturnSchedules: "annual-return-schedules",
  annualReturns: "annual-returns",
  reassessmentAppeals: "reassessment-appeals",
  reassessments: "reassessments",
  approvedProjection: "approved-projection",
  pendingProjection: "pending-projection",
  uploadProjection: "upload-projection",
  addUser: "add-user",
  editUser: "edit-user",
  displayUser: "display-user",
  businesses: "businesses",
  pendingApplication: "pending-application",
  submittedApplication: "submitted-application",
  settings: "settings",
}

const routes: Routes = [
  {
    path: "",
    component: PayeComponent,
    children: [
      {path: "", redirectTo: ADMIN_PATHS.dashboard, pathMatch: "full"},
      {
        path: ADMIN_PATHS.dashboard,
        loadComponent: () =>
          import("./dashboard/dashboard.component").then(
            (c) => c.DashboardComponent
          ),
      },
      {path: ADMIN_PATHS.assessments, component: AssessmentsComponent},
      {
        path: ADMIN_PATHS.deletedEmployees,
        component: DeletedemployeesComponent,
      },
      {
        path: ADMIN_PATHS.employeeSchedule,
        component: EmployeescheduleComponent,
      },
      {path: ADMIN_PATHS.schedules, component: SchedulesComponent},

      {
        path: ADMIN_PATHS.annualReturnEmployeesUpload,
        component: AnnualreturnemployeesuploadComponent,
      },
      {
        path: ADMIN_PATHS.annualReturnAssessments,
        component: AnnualreturnassessmentsComponent,
      },
      {
        path: ADMIN_PATHS.annualReturnSchedules,
        component: AnnualreturnschedulesComponent,
      },
      {path: ADMIN_PATHS.annualReturns, component: AnnualreturnsComponent},
      {
        path: ADMIN_PATHS.reassessmentAppeals,
        component: ReassessmentappealsComponent,
      },
      {path: ADMIN_PATHS.reassessments, component: ReassessmentsComponent},

      {
        path: ADMIN_PATHS.approvedProjection,
        component: ApprovedprojectionComponent,
      },
      {
        path: ADMIN_PATHS.pendingProjection,
        component: PendingprojectionComponent,
      },
      {
        path: ADMIN_PATHS.uploadProjection,
        component: UploadprojectionComponent,
      },

      {path: ADMIN_PATHS.addUser, component: AdduserComponent},
      {path: ADMIN_PATHS.editUser, component: EditComponent},
      {path: ADMIN_PATHS.displayUser, component: DisplayuserComponent},

      {
        path: ADMIN_PATHS.businesses,
        loadComponent: () =>
          import("./businesses/businesses.component").then(
            (c) => c.BusinessesComponent
          ),
      },
      {
        path: ADMIN_PATHS.pendingApplication,
        loadComponent: () =>
          import(
            "./tcc-application/features/pending-application/pending-application.component"
          ).then((c) => c.TccPendingApplicationComponent),
      },
      {
        path: ADMIN_PATHS.submittedApplication,
        loadComponent: () =>
          import(
            "./tcc-application/features/submitted-application/submitted-application.component"
          ).then((c) => c.TccSubmittedApplicationComponent),
      },
      {
        path: ADMIN_PATHS.settings,
        loadChildren: () => import("@admin-pages/settings/settings.route"),
      },
    ],
  },
]

@NgModule({
  declarations: [PayeComponent],
  imports: [RouterModule.forChild(routes), NgxUiLoaderModule, IncModule],
  exports: [RouterModule],
})
export class PayeRoutingModule {}
