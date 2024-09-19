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
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator"
import {NgToggleModule} from "ng-toggle-button"

import Swal from "sweetalert2"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import {MaterialDialogConfig} from "@shared/utils/material.utils"
import {TccService} from "@admin-pages/tcc-application/services/tcc-application.services"
import {ViewTccApplicationComponent} from "../view-tcc/view-tcc.component"
import {UploadProjectionInterface} from "@admin-pages/annualprojection/features/uploadprojection/data-access/annual-projection.models"
import {
  PendingTccResInterface,
  ProcessTccInterface,
} from "@admin-pages/tcc-application/data-access/tcc.model"
import {ThrotlleQuery} from "@shared/utils/shared.utils"
import {ActivatedRoute, Router} from "@angular/router"

@Component({
  selector: "app-tcc-details",
  templateUrl: "./tcc-details.component.html",
  styleUrl: "./tcc-details.component.css",
  standalone: true,
  imports: [TitleCasePipe, MatPaginatorModule, MatDialogClose, NgToggleModule],
  providers: [TccService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TccApplicationDetailsComponent implements OnInit, OnDestroy {
  private readonly tccService = inject(TccService)
  private readonly dialog = inject(MatDialog)
  private readonly injectedData =
    inject<UploadProjectionInterface>(MAT_DIALOG_DATA)
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)

  employeeDetails = signal<PendingTccResInterface[] | null>(null)
  dataLoading = signal(false)
  btnLoading = signal(false)
  dataMessage = signal("")

  queryString = signal("")

  totalLength = signal(0)

  employeeIds = signal<number[] | []>([])

  subs = new SubscriptionHandler()

  ngOnInit(): void {
    this.getTccDetails()
  }

  ngOnDestroy(): void {
    this.subs.clear()
    this.employeeIds.set([])
  }

  getTccDetails(pageNumber?: number, pageSize?: number) {
    this.subs.add = this.tccService
      .getPendingTcc(pageNumber, pageSize, this.injectedData.businessID)
      .subscribe({
        next: (res) => {
          this.dataLoading.set(false)
          if (res.status) {
            this.employeeDetails.set(res.data)
          } else {
            this.dataLoading.set(false)
            this.dataMessage.set(res?.message)
            Swal.fire(SweetAlertOptions(res?.message))
          }
        },
        error: (err) => {
          this.dataLoading.set(false)
          this.dataMessage.set(err?.message || err?.error?.message)
          Swal.fire(SweetAlertOptions(err?.message || err?.error?.message))
        },
      })
  }

  handlePageEvent(event: PageEvent) {
    const pageIndex = event.pageIndex === 0 ? 1 : event.pageIndex
    this.getTccDetails(pageIndex, event.pageSize)
  }

  openTccView(data: PendingTccResInterface) {
    this.dialog.open(ViewTccApplicationComponent, MaterialDialogConfig(data))
  }

  processTCC(empId?: string) {
    let payload = {
      employeeIds: [],
      busId: this.injectedData.businessID,
    } as ProcessTccInterface

    if (empId) {
      // payload.employeeIds = [parseInt(empId)]
    } else {
      payload = {
        ...payload,
        employeeIds: <number[]>this.employeeIds(),
      }
    }

    this.dataLoading.set(true)

    this.subs.add = this.tccService.processTcc(payload).subscribe({
      next: (res) => {
        this.dataLoading.set(false)
        if (res.status) {
          Swal.fire(SweetAlertOptions(res?.message, true))
          window.location.reload()
        } else {
          this.dataLoading.set(false)
          Swal.fire(SweetAlertOptions(res?.message))
        }
      },
      error: (err) => {
        this.dataLoading.set(false)
        Swal.fire(SweetAlertOptions(err?.message || err?.error?.message))
      },
    })
  }

  queryTable(domInput: HTMLInputElement) {
    this.subs.add = ThrotlleQuery(domInput, "keyup").subscribe((query) => {
      this.router.navigate(["/admin/pending-application"], {
        relativeTo: this.route,
        queryParams: {
          search: query,
          pageSize: 15,
          pageIndex: 1,
        },
        fragment: "details",
        queryParamsHandling: "replace",
      })
    })
  }

  addEmployeeId(id: string) {
    if (this.employeeIds()?.length) {
      const exists = this.employeeIds()?.find((n) => n === +id)
      if (!exists)
        return this.employeeIds.update((nums) => {
          return [...(nums as number[]), parseInt(id)]
        })
    } else {
      this.employeeIds.update((nums) => [parseInt(id)])
    }
  }
}
