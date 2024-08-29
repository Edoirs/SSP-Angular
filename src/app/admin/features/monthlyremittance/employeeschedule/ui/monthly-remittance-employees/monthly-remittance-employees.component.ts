import {TitleCasePipe} from "@angular/common"
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core"
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogClose,
} from "@angular/material/dialog"
import {EmployeeDetailResInterface} from "../../data-access/employee-schedule.model"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {EmployeeScheduleService} from "../../services/employee-schedule.service"
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator"
import {CreateScheduleComponent} from "../create-schedule/create-schedule.component"
import {NgToggleModule} from "ng-toggle-button"
import {BulkUploadComponent} from "../bulk-upload/bulk-upload.component"

@Component({
  selector: "app-monthly-remittance-employees",
  templateUrl: "./monthly-remittance-employees.component.html",
  styleUrl: "./monthly-remittance-employees.component.css",
  standalone: true,
  imports: [TitleCasePipe, MatPaginatorModule, MatDialogClose, NgToggleModule],
  providers: [EmployeeScheduleService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthlyRemittanceEmployees implements OnInit, OnDestroy {
  private readonly dialog = inject<any>(MatDialog)
  private readonly injectedData = inject<any>(MAT_DIALOG_DATA)
  private readonly employeeScheduleService = inject(EmployeeScheduleService)

  employeeDetails = signal<EmployeeDetailResInterface[] | null>(null)

  subs = new SubscriptionHandler()

  ngOnInit(): void {
    this.getEmployeeDetail()
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }

  getEmployeeDetail(pageNumber?: number, pageSize?: number) {
    this.subs.add = this.employeeScheduleService
      .getEmployeeDetails(
        this.injectedData.businessRin,
        this.injectedData.companyRin,
        pageNumber,
        pageSize
      )
      .subscribe((res) => {
        this.employeeDetails.set(res.data)
      })
  }

  handlePageEvent(event: PageEvent) {
    const pageIndex = event.pageIndex === 0 ? 1 : event.pageIndex
    this.getEmployeeDetail(pageIndex, event.pageSize)
  }

  openCreateSchedule() {
    this.dialog.open(CreateScheduleComponent, {minWidth: 1000})
  }

  openBulkUpload() {
    this.dialog.open(BulkUploadComponent, {minWidth: 1000})
  }

  closeModal() {}

  viewAddEmployee(modal: any) {}

  switchStatus(event: any) {
    const status = event.target.checked
    if (
      window.confirm("Are you sure you want to change this employee's status?")
    )
      console.log("changed")
  }
}
