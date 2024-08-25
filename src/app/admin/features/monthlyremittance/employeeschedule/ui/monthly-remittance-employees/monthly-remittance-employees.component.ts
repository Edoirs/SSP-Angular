import {TitleCasePipe} from "@angular/common"
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core"
import {MAT_DIALOG_DATA} from "@angular/material/dialog"
import {
  EmployeeDetailResInterface,
  EmployeeScheduleResInterface,
} from "../../data-access/employee-schedule.model"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {EmployeeScheduleService} from "../../services/employee-schedule.service"
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator"

@Component({
  selector: "app-monthly-remittance-employees",
  templateUrl: "./monthly-remittance-employees.component.html",
  styleUrl: "./monthly-remittance-employees.component.css",
  standalone: true,
  imports: [TitleCasePipe, MatPaginatorModule],
  providers: [EmployeeScheduleService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthlyRemittanceEmployees implements OnInit, OnDestroy {
  private readonly injectedData =
    inject<EmployeeScheduleResInterface>(MAT_DIALOG_DATA)
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

  closeModal() {}

  viewAddEmployee(modal: any) {}

  showModal(modal: any) {}
}
