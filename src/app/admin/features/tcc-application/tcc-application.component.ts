import {Component, inject, OnDestroy, OnInit, signal} from "@angular/core"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {TccService} from "./services/tcc-application.services"
import {ActivatedRoute, Router} from "@angular/router"
import {BusinessResInterface} from "./data-access/tcc.model"

import {MatPaginatorModule, PageEvent} from "@angular/material/paginator"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"

import Swal from "sweetalert2"
import {ThrotlleQuery} from "@shared/utils/shared.utils"
import {TokenService} from "@shared/services/token.service"
import {
  UploadProjectionInterface,
  UploadProjectioResInterface,
} from "@admin-pages/annualprojection/features/uploadprojection/data-access/annual-projection.models"
import {MatDialog} from "@angular/material/dialog"
import {TccApplicationDetailsComponent} from "./ui/tcc-details/tcc-details.component"
import {MaterialDialogConfig} from "@shared/utils/material.utils"

@Component({
  selector: "app-tcc-application",
  templateUrl: "./tcc-application.component.html",
  styleUrl: "./tcc-application.component.scss",
  standalone: true,
  imports: [MatPaginatorModule],
  providers: [TccService],
})
export class TccApplicationComponent implements OnInit, OnDestroy {
  private readonly tccService = inject(TccService)
  public readonly tokenService = inject(TokenService)
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly dialog = inject(MatDialog)
  pageSize = signal(15)
  totalLength = signal(500)
  pageIndex = signal(1)

  businesses = signal<UploadProjectionInterface[] | null>(null)
  dataLoading = signal(false)
  dataMessage = signal("")

  queryString = signal("")

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
        if (params["pageIndex"]) this.pageIndex.set(params["pageIndex"])
        if (params["pageSize"]) this.pageSize.set(params["pageSize"])
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
                this.businesses.set(res.data)
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
        pageIndex: event.pageIndex === 0 ? 1 : event.pageIndex,
      },
      queryParamsHandling: "replace",
    })
  }

  openTccDetails(business: UploadProjectionInterface) {
    this.dialog.open(
      TccApplicationDetailsComponent,
      MaterialDialogConfig(business)
    )
  }
}
