import {Component, inject, OnInit, signal} from "@angular/core"
import {PageEvent} from "@angular/material/paginator"
import {TokenService} from "@shared/services/token.service"
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader"
import {SettingsService} from "../../data-access/services/system-settings.services"
import {MatSelectModule} from "@angular/material/select"
import {ActionButtonComponent} from "@admin-pages/settings/ui/action-btn.component"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"

@Component({
  selector: "app-system-settings",
  standalone: true,
  imports: [MatSelectModule, NgxSkeletonLoaderModule, ActionButtonComponent],
  providers: [SettingsService],
  templateUrl: "./system-settings.component.html",
  styleUrl: "./system-settings.component.css",
})
export class SystemSettingsComponent implements OnInit {
  public readonly tokenService = inject(TokenService)
  public readonly settingsService = inject(SettingsService)

  subs = new SubscriptionHandler()

  queryString = signal("")

  pageSize = signal(10)
  totalLength = signal(500)
  pageIndex = signal(0)

  ngOnInit(): void {
    this.settingsService.getUsers()
  }

  syncCorperate() {
    this.subs.add = this.settingsService.syncCorporate().subscribe()
  }

  syncRules() {
    this.subs.add = this.settingsService.syncRules().subscribe()
  }

  syncItems() {
    this.subs.add = this.settingsService.syncItems().subscribe()
  }

  syncAssets() {
    this.subs.add = this.settingsService.syncAssets().subscribe()
  }

  handlePageEvent(event: PageEvent) {}
}
