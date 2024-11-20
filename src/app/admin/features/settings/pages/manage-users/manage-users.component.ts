import {SettingsService} from "@admin-pages/settings/data-access/services/system-settings.services"
import {Component, inject, OnDestroy, OnInit, signal} from "@angular/core"
import {MatFormFieldModule} from "@angular/material/form-field"
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator"
import {MatSelectModule} from "@angular/material/select"
import {ActivatedRoute, Router} from "@angular/router"
import {TokenService} from "@shared/services/token.service"
import {ThrotlleQuery} from "@shared/utils/shared.utils"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import {NgToggleModule} from "ng-toggle-button"
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader"
import Swal from "sweetalert2"

@Component({
  selector: "app-manage-users",
  standalone: true,
  imports: [
    MatPaginatorModule,
    NgxSkeletonLoaderModule,
    NgToggleModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: "./manage-users.component.html",
  styleUrl: "./manage-users.component.css",
})
export class ManageUsersComponent implements OnInit, OnDestroy {
  public readonly tokenService = inject(TokenService)
  public readonly settingsService = inject(SettingsService)
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)

  users = signal<any | null>(null)

  dataLoading = signal(false)
  dataMessage = signal("")

  queryString = signal("")

  pageSize = signal(10)
  totalLength = signal(500)
  pageIndex = signal(0)

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
        if (params["search"]) this.queryString.set(params["search"])
        this.subs.add = this.settingsService
          .getUsers(this.pageIndex(), this.pageSize(), this.queryString())
          .subscribe({
            next: (res) => {
              this.dataLoading.set(false)
              if (res.status === true) {
                this.users.set(res.data)
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

  queryUserType(event: Event) {
    const query = (event?.target as any)?.value as string
    this.router.navigate(["."], {
      relativeTo: this.route,
      queryParams: {
        search: query,
        pageSize: 15,
        pageIndex: 1,
      },
      queryParamsHandling: "replace",
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

  switchStatus(event: any, employeeRin?: string) {
    const status = event.target.checked as boolean

    const ask = window.confirm(
      "Are you sure you want to change this employee's status?"
    )
    if (ask) {
      // this.subs.add = this.employeeScheduleService
      //   .markEmployeeInactive(payload)
      //   .subscribe({
      //     next: (res) => {
      //       if (res.status) Swal.fire(SweetAlertOptions(res?.message, true))
      //     },
      //     error: (err) => {
      //       Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
      //     },
      //   })
    }
  }
}
