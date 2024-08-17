import {NgModule} from "@angular/core"
import {RouterModule, Routes} from "@angular/router"
import {ApprovedprojectionComponent} from "./annualprojection/approvedprojection/approvedprojection.component"
import {PendingprojectionComponent} from "./annualprojection/pendingprojection/pendingprojection.component"
import {UploadprojectionComponent} from "./annualprojection/uploadprojection/uploadprojection.component"
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

const routes: Routes = [
  {path: "dashboard", component: DashboardComponent},
  {path: "assessments", component: AssessmentsComponent},
  {path: "deleted-employees", component: DeletedemployeesComponent},
  {path: "employee-schedule", component: EmployeescheduleComponent},
  {path: "schedules", component: SchedulesComponent},

  {
    path: "annual-return-employees-upload",
    component: AnnualreturnemployeesuploadComponent,
  },
  {
    path: "annual-return-assessments",
    component: AnnualreturnassessmentsComponent,
  },
  {path: "annual-return-schedules", component: AnnualreturnschedulesComponent},
  {path: "annual-returns", component: AnnualreturnsComponent},
  {path: "reassessment-appeals", component: ReassessmentappealsComponent},
  {path: "reassessments", component: ReassessmentsComponent},

  {path: "approved-projection", component: ApprovedprojectionComponent},
  {path: "pending-projection", component: PendingprojectionComponent},
  {path: "upload-projection", component: UploadprojectionComponent},

  {path: "add-user", component: AdduserComponent},
  {path: "edit-user", component: EditComponent},
  {path: "display-user", component: DisplayuserComponent},
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayeRoutingModule {}
