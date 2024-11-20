import {Component, inject, OnInit, signal} from "@angular/core"
import {PageEvent} from "@angular/material/paginator"
import {TokenService} from "@shared/services/token.service"
import {SettingsService} from "../../data-access/services/system-settings.services"
import {MatSelectModule} from "@angular/material/select"
import {ActionButtonComponent} from "@admin-pages/settings/ui/action-btn.component"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {NgxUiLoaderService} from "ngx-ui-loader"
import Swal from "sweetalert2"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import {ServerResInterface} from "@shared/types/server-response.model"

@Component({
  selector: "app-system-settings",
  standalone: true,
  imports: [MatSelectModule, ActionButtonComponent],
  providers: [SettingsService],
  templateUrl: "./system-settings.component.html",
  styleUrl: "./system-settings.component.css",
})
export class SystemSettingsComponent implements OnInit {
  public readonly tokenService = inject(TokenService)
  public readonly settingsService = inject(SettingsService)
  private ngxService = inject(NgxUiLoaderService)

  subs = new SubscriptionHandler()

  queryString = signal("")

  pageSize = signal(10)
  totalLength = signal(500)
  pageIndex = signal(0)

  ngOnInit(): void {
    this.settingsService.getUsers()
  }

  syncCorperate() {
    this.ngxService.start()

    this.subs.add = this.settingsService
      .syncCorporate()
      .subscribe(this.syncHandler())
  }

  syncRules() {
    this.subs.add = this.settingsService
      .syncRules()
      .subscribe(this.syncHandler())
  }

  syncItems() {
    this.subs.add = this.settingsService
      .syncItems()
      .subscribe(this.syncHandler())
  }

  syncAssets() {
    this.ngxService.start()
    this.subs.add = this.settingsService
      .syncAssets()
      .subscribe(this.syncHandler())
  }

  handlePageEvent(event: PageEvent) {}

  syncHandler = () => ({
    next: (res: ServerResInterface<any>) => {
      this.ngxService.stop()
      if (res.status === true) {
        Swal.fire(SweetAlertOptions(res?.message, true))
      } else {
        Swal.fire(SweetAlertOptions(res?.message))
      }
    },
    error: (err: any) => {
      this.ngxService.stop()
      Swal.fire(
        SweetAlertOptions(
          err?.error?.message || err?.error?.error?.message || err?.message
        )
      )
    },
  })
}
