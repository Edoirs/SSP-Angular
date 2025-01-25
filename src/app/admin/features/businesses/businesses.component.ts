import {Component, inject, OnDestroy, OnInit, signal} from "@angular/core"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {BusinessService} from "./services/businesses.services"
import {ActivatedRoute, Router} from "@angular/router"
import {BusinessResInterface} from "./data-access/business.model"

import {MatPaginatorModule, PageEvent} from "@angular/material/paginator"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"

import Swal from "sweetalert2"
import {TokenService} from "@shared/services/token.service"
import {ExportAsConfig, ExportAsService} from "ngx-export-as"
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader"
import {TableSearchComponent} from "@shared/components/table-search/table-search.component"

@Component({
  selector: "app-businesses",
  templateUrl: "./businesses.component.html",
  styleUrl: "./businesses.component.scss",
  standalone: true,
  imports: [MatPaginatorModule, NgxSkeletonLoaderModule, TableSearchComponent],
  providers: [BusinessService],
})
export class BusinessesComponent implements OnInit, OnDestroy {
  private readonly businessService = inject(BusinessService)
  public readonly tokenService = inject(TokenService)
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private exportAsService = inject(ExportAsService)

  pageSize = signal(100)
  totalLength = signal(500)
  pageIndex = signal(1)

  businesses = signal<BusinessResInterface | null>(null)
  dataLoading = signal(false)
  dataMessage = signal("")

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

  listenToRoute() {
    this.subs.add = this.route.queryParams.subscribe((params) => {
      this.dataLoading.set(true)
      if (Object.keys(params)) {
        if (params["pageIndex"]) this.pageIndex.set(+params["pageIndex"])
        if (params["pageSize"]) this.pageSize.set(+params["pageSize"])
        this.subs.add = this.businessService
          .getBusinesses(
            this.pageIndex() === 0 ? 1 : this.pageIndex(),
            this.pageSize(),
            params["busRin"] && params["busRin"],
            params["businessName"] && params["businessName"],
            params["companyRin"] && params["companyRin"],
            params["companyName"] && params["companyName"],
            params["search"] && params["search"]
          )
          .subscribe({
            next: (res) => {
              this.dataLoading.set(false)
              if (res.status === true) {
                this.businesses.set(res.data)
                this.totalLength.set(res.data.totalCount)
              } else {
                this.dataLoading.set(false)
                this.dataMessage.set(res?.message)
                Swal.fire(SweetAlertOptions(res?.message))
              }
            },
            error: (err) => {
              this.dataLoading.set(false)
              this.dataMessage.set(err?.error?.message || err?.message)
              Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
            },
          })
      }
    })
  }

  async downloadExcel() {
    this.dataLoading.set(true)

    try {
      this.dataLoading.set(false)
      const {fileURL, filename} =
        await this.businessService.downloadBusinessExcel()
      // Create an anchor element
      const link = document.createElement("a")
      link.href = fileURL
      link.download = filename // Set the filename for the download

      // Trigger the download
      link.click()

      // Clean up the URL object
      URL.revokeObjectURL(fileURL)
    } catch (err: any) {
      // console.log({err})
      this.dataLoading.set(false)
      Swal.fire(SweetAlertOptions(err?.error?.error?.message || err?.message))
    }
  }

  dowloadCsv() {
    this.subs.add = this.exportAsService
      .save(this.exportAsCSVConfig, `My Report ${new Date().toISOString()}`)
      .subscribe()
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
}
