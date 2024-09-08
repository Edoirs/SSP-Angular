import {Component, inject, OnDestroy, OnInit, signal} from "@angular/core"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {BusinessService} from "./services/businesses.services"
import {ActivatedRoute, Router} from "@angular/router"
import {BusinessResInterface} from "./data-access/business.model"

import {MatPaginatorModule, PageEvent} from "@angular/material/paginator"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"

import Swal from "sweetalert2"

@Component({
  selector: "app-businesses",
  templateUrl: "./businesses.component.html",
  styleUrl: "./businesses.component.scss",
  standalone: true,
  imports: [MatPaginatorModule],
  providers: [BusinessService],
})
export class BusinessesComponent implements OnInit, OnDestroy {
  private readonly businessService = inject(BusinessService)
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)
  pageSize = signal(15)
  totalLength = signal(500)
  pageIndex = signal(1)

  businesses = signal<BusinessResInterface | null>(null)
  dataLoading = signal(false)
  dataMessage = signal("")

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
        if (params["pageIndex"]) this.pageIndex.set(params["pageIndex"])
        if (params["pageSize"]) this.pageSize.set(params["pageSize"])
        this.subs.add = this.businessService
          .getBusinesses(this.pageIndex(), this.pageSize())
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
    })
  }
}
