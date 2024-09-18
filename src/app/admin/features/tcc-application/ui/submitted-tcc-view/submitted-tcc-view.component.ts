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
import {
  SubmittedTccAppResInterface,
  TccAppDetailsInterface,
} from "@admin-pages/tcc-application/data-access/tcc.model"
import {ThrotlleQuery} from "@shared/utils/shared.utils"
import {ActivatedRoute, Router} from "@angular/router"
import {ViewSubmittedTccApplicationComponent} from "../view-submitted-tcc/view-submitted-tcc.component"

@Component({
  selector: "app-submitted-tcc-view",
  templateUrl: "./submitted-tcc-view.component.html",
  styleUrl: "./submitted-tcc-view.component.css",
  standalone: true,
  imports: [TitleCasePipe, MatPaginatorModule, MatDialogClose, NgToggleModule],
  providers: [TccService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TccSubmittedApplicationViewComponent implements OnInit, OnDestroy {
  private readonly tccService = inject(TccService)
  private readonly dialog = inject(MatDialog)
  private readonly injectedData =
    inject<SubmittedTccAppResInterface>(MAT_DIALOG_DATA)
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)

  employeeDetails = signal<TccAppDetailsInterface[] | null>(null)
  dataLoading = signal(false)
  btnLoading = signal(false)
  dataMessage = signal("")

  queryString = signal("")

  totalLength = signal(0)

  subs = new SubscriptionHandler()

  ngOnInit(): void {
    this.getTccDetails()
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }

  getTccDetails(pageNumber?: number, pageSize?: number) {
    this.subs.add = this.tccService
      .getSubmittedTccView(pageNumber, pageSize, this.injectedData.businessId)
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

  openTccView(data: TccAppDetailsInterface) {
    this.dialog.open(
      ViewSubmittedTccApplicationComponent,
      MaterialDialogConfig(data)
    )
  }

  queryTable(domInput: HTMLInputElement) {
    this.subs.add = ThrotlleQuery(domInput, "keyup").subscribe((query) => {
      this.router.navigate(["."], {
        relativeTo: this.route,
        queryParams: {
          search: query,
          pageSize: 15,
          pageIndex: 1,
        },
        queryParamsHandling: "replace",
      })
    })
  }
}
