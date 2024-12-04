import {ADMIN_PATHS} from "@admin-pages/paye-routes.module"
import {Component, OnDestroy, OnInit} from "@angular/core"
import {RouterLink} from "@angular/router"
import {LANDING_PATHS} from "src/app/app-routing.module"
@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  public readonly LandingPaths = LANDING_PATHS
  public readonly AdminPaths = ADMIN_PATHS

  ngOnInit(): void {}

  ngOnDestroy(): void {}
}
