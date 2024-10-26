import {Component, inject, OnDestroy, OnInit, signal} from "@angular/core"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {TccService} from "../../services/tcc-application.services"
import {ActivatedRoute, Router} from "@angular/router"

import {MatPaginatorModule, PageEvent} from "@angular/material/paginator"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"

import Swal from "sweetalert2"
import {ThrotlleQuery} from "@shared/utils/shared.utils"
import {TokenService} from "@shared/services/token.service"
import {UploadProjectionInterface} from "@admin-pages/annualprojection/features/uploadprojection/data-access/annual-projection.models"
import {MatDialog} from "@angular/material/dialog"
import {TccApplicationDetailsComponent} from "../../ui/tcc-details/tcc-details.component"
import {MaterialDialogConfig} from "@shared/utils/material.utils"
import {ExportAsConfig, ExportAsService} from "ngx-export-as"
import {DecimalPipe} from "@angular/common"
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader"

@Component({
  selector: "app-pending-application",
  templateUrl: "./pending-application.component.html",
  styleUrl: "./pending-application.component.scss",
  standalone: true,
  imports: [MatPaginatorModule, DecimalPipe, NgxSkeletonLoaderModule],
  providers: [TccService],
})
export class TccPendingApplicationComponent implements OnInit, OnDestroy {
  private readonly tccService = inject(TccService)
  public readonly tokenService = inject(TokenService)
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly dialog = inject(MatDialog)
  private exportAsService = inject(ExportAsService)

  pageSize = signal(10)
  totalLength = signal(500)
  pageIndex = signal(1)

  businesses = signal<UploadProjectionInterface[] | null>(null)
  dataLoading = signal(false)
  dataMessage = signal("")

  queryString = signal("")

  exportAsConfig: ExportAsConfig = {
    type: "xls",
    elementIdOrContent: "xlsTable",
    download: true,
  }

  exportAsCSVConfig: ExportAsConfig = {
    type: "csv",
    elementIdOrContent: "xlsTable",
    download: false,
  }

  subs = new SubscriptionHandler()

  ngOnInit(): void {
    this.listenToRoute()
  }

  ngOnDestroy(): void {
    this.subs.clear()
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

  listenToRoute() {
    this.subs.add = this.route.queryParams.subscribe((params) => {
      this.dataLoading.set(true)
      if (Object.keys(params)) {
        if (params["pageIndex"]) this.pageIndex.set(+params["pageIndex"])
        if (params["pageSize"]) this.pageSize.set(+params["pageSize"])
        if (params["search"]) this.queryString.set(params["search"])
        this.subs.add = this.tccService
          .getBusinesses(
            this.pageIndex(),
            this.pageSize(),
            this.tokenService.getLoginResData.companyId.toString(),
            this.queryString()
          )
          .subscribe({
            next: (res) => {
              this.dataLoading.set(false)
              if (res.status === true) {
                this.businesses.set(res?.data?.result)
                this.pageSize.set(res?.data?.totalCount || 0)
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
    })
  }

  handlePageEvent(event: PageEvent) {
    this.router.navigate(["."], {
      relativeTo: this.route,
      queryParams: {
        pageSize: event.pageSize,
        pageIndex: event.pageIndex,
      },
      queryParamsHandling: "replace",
    })
  }

  dowloadCsv() {
    this.subs.add = this.exportAsService
      .save(this.exportAsCSVConfig, `My Report ${new Date().toISOString()}`)
      .subscribe()
  }

  dowloadExcel() {
    this.subs.add = this.exportAsService
      .save(this.exportAsConfig, `My Report ${new Date().toISOString()}`)
      .subscribe()
  }

  openTccDetails(business: UploadProjectionInterface) {
    this.dialog.open(
      TccApplicationDetailsComponent,
      MaterialDialogConfig(business)
    )
  }
}
