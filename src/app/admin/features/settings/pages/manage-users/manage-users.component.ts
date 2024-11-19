import {SettingsService} from "@admin-pages/settings/data-access/services/system-settings.services"
import {Component, inject, signal} from "@angular/core"
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator"
import {TokenService} from "@shared/services/token.service"
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader"

@Component({
  selector: "app-manage-users",
  standalone: true,
  imports: [MatPaginatorModule, NgxSkeletonLoaderModule],
  templateUrl: "./manage-users.component.html",
  styleUrl: "./manage-users.component.css",
})
export class ManageUsersComponent {
  public readonly tokenService = inject(TokenService)
  public readonly settingsService = inject(SettingsService)

  queryString = signal("")

  pageSize = signal(10)
  totalLength = signal(500)
  pageIndex = signal(0)

  ngOnInit(): void {
    this.settingsService.getUsers()
  }

  queryTable(domInput: HTMLInputElement) {}

  handlePageEvent(event: PageEvent) {}
}
