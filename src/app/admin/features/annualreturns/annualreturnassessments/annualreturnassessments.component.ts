import {Component, inject, OnInit, signal} from "@angular/core"
import Swal from "sweetalert2"
import {Title} from "@angular/platform-browser"
import {NgxUiLoaderService} from "ngx-ui-loader"
import {TokenService} from "@shared/services/token.service"
import {MatDialog} from "@angular/material/dialog"
import {ActivatedRoute, Router} from "@angular/router"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator"
import {AnnualAssesmentService} from "../data-access/services/annual-return.service"
import {ThrotlleQuery} from "@shared/utils/shared.utils"
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader"
import {AnnualAssesmentCompaniesComponent} from "./ui/annual-assesment-companies/annual-assesment-companies.component"
import {MaterialDialogConfig} from "@shared/utils/material.utils"
import {CommonModule} from "@angular/common"

@Component({
  selector: "app-annualreturnassessments",
  templateUrl: "./annualreturnassessments.component.html",
  styleUrls: ["./annualreturnassessments.component.css"],
  standalone: true,
  imports: [MatPaginatorModule, NgxSkeletonLoaderModule, CommonModule],
  providers: [],
})
export class AnnualreturnassessmentsComponent implements OnInit {
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)
  private readonly dialog = inject(MatDialog)
  public readonly tokenService = inject(TokenService)
  private readonly titleService = inject(Title)
  private readonly ngxService = inject(NgxUiLoaderService)
  private readonly annualAssesmentService = inject(AnnualAssesmentService)

  months = [
    {monthId: "01", monthName: "January"},
    {monthId: "02", monthName: "February"},
    {monthId: "03", monthName: "March"},
    {monthId: "04", monthName: "April"},
    {monthId: "05", monthName: "May"},
    {monthId: "06", monthName: "June"},
    {monthId: "07", monthName: "July"},
    {monthId: "08", monthName: "August"},
    {monthId: "09", monthName: "September"},
    {monthId: "10", monthName: "October"},
    {monthId: "11", monthName: "November"},
    {monthId: "12", monthName: "December"},
  ]

  pageSize = signal(50)
  totalLength = signal(500)
  pageIndex = signal(1)
  queryString = signal("")

  employeesList = signal<any | null>(null)
  dataLoading = signal(false)
  dataMessage = signal("")

  subs = new SubscriptionHandler()

  constructor() {}

  ngOnInit(): void {}

  queryTable(domInput: HTMLInputElement) {
    this.subs.add = ThrotlleQuery(domInput, "keyup").subscribe((query) => {
      this.router.navigate(["."], {
        relativeTo: this.route,
        queryParams: {
          search: query,
          pageSize: 50,
          pageIndex: 1,
        },
        queryParamsHandling: "replace",
      })
    })
  }

  listenToRoute() {
    this.dataLoading.set(true)
    this.subs.add = this.route.queryParams.subscribe((params) => {
      if (Object.keys(params)) {
        if (params["pageIndex"]) this.pageIndex.set(params["pageIndex"])
        if (params["pageSize"]) this.pageSize.set(params["pageSize"])
        if (params["search"]) this.queryString.set(params["search"])
        this.annualAssesmentService
          .getBusinesses("", this.pageSize(), params["search"])
          .subscribe({
            next: (res) => {
              this.dataLoading.set(false)
              if (res.status) {
                this.employeesList.set(res.data)
                this.totalLength.set(
                  res?.data?.totalCount || res?.data?.businesses?.length
                )
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

  handlePageEvent(event: PageEvent) {
    this.router.navigate(["."], {
      relativeTo: this.route,
      queryParams: {
        pageSize: event.pageSize,
        pageIndex: event.pageIndex,
      },
    })
  }

  openEmployeeDetails(data: any) {
    this.dialog.open(
      AnnualAssesmentCompaniesComponent,
      MaterialDialogConfig(data)
    )
  }
}
