import {CommonModule, TitleCasePipe} from "@angular/common"
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
import {MatSnackBar} from "@angular/material/snack-bar"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator"
import {ScheduleService} from "../../services/schedules.service"
import {ScheduleDetailResInterface} from "../../data-access/schedule.model"

@Component({
  selector: "app-schedule-details",
  templateUrl: "./schedule-details.component.html",
  styleUrl: "./schedule-details.component.css",
  standalone: true,
  imports: [CommonModule, MatPaginatorModule, MatDialogClose],
  providers: [ScheduleService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleDetailsComponent implements OnInit, OnDestroy {
  private readonly dialog = inject(MatDialog)
  private readonly snackBar = inject(MatSnackBar)
  private readonly injectedData = inject<any>(MAT_DIALOG_DATA)
  private readonly scheduleService = inject(ScheduleService)

  employeeDetails = signal<any[] | null>(null)

  schedulesData = signal<ScheduleDetailResInterface[] | null>(null)

  subs = new SubscriptionHandler()

  ngOnInit(): void {
    this.getEmployeeDetail()
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }

  getEmployeeDetail(pageNumber?: number, pageSize?: number) {
    this.subs.add = this.scheduleService
      .getScheduleView(
        this.injectedData.businessRin,
        this.injectedData.companyRin
      )
      .subscribe((res) => {
        console.log(res)
        this.schedulesData.set(res.data)
      })
  }

  handlePageEvent(event: PageEvent) {
    const pageIndex = event.pageIndex === 0 ? 1 : event.pageIndex
    this.getEmployeeDetail(pageIndex, event.pageSize)
  }

  viewSchedule(data: any) {
    console.log(data)
  }

  // openCreateSchedule() {
  //   this.dialog.open(CreateScheduleComponent, {
  //     data: this.injectedData,
  //     minWidth: 1000,
  //   })
  // }

  closeModal() {}

  viewAddEmployee(modal: any) {}
}
