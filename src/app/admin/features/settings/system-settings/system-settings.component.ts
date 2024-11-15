import {Component, inject, signal} from "@angular/core"
import {MatPaginatorModule, PageEvent} from "@angular/material/paginator"
import {TokenService} from "@shared/services/token.service"
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader"

@Component({
  selector: "app-system-settings",
  standalone: true,
  imports: [MatPaginatorModule, NgxSkeletonLoaderModule],
  providers: [],
  templateUrl: "./system-settings.component.html",
  styleUrl: "./system-settings.component.css",
})
export class SystemSettingsComponent {
  public readonly tokenService = inject(TokenService)

  pageSize = signal(10)
  totalLength = signal(500)
  pageIndex = signal(0)

  handlePageEvent(event: PageEvent) {}
}
