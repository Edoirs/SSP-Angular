import {Component, inject, OnInit} from "@angular/core"
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms"
import {ActivatedRoute, Router} from "@angular/router"
import {TokenService} from "@shared/services/token.service"

@Component({
  selector: "app-table-search",
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: "./table-search.component.html",
  styleUrl: "./table-search.component.css",
})
export class TableSearchComponent implements OnInit {
  public readonly tokenService = inject(TokenService)
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)

  tableFilterForm = new FormGroup({
    ...(this.tokenService.getLoginResData.isAdminUser && {
      companyName: new FormControl(""),
      companyRin: new FormControl(""),
    }),
    businessName: new FormControl(""),
    busRin: new FormControl(""),
  })

  ngOnInit(): void {
    this.clearQuerysOnReload()
  }

  queryTable() {
    const {businessName, busRin, companyName, companyRin} =
      this.tableFilterForm.value
    this.router.navigate(["."], {
      relativeTo: this.route,
      queryParams: {
        ...(businessName && {businessName: businessName.trim()}),
        ...(busRin && {busRin: busRin.trim()}),
        ...(companyName && {companyName: companyName.trim()}),
        ...(companyRin && {companyRin: companyRin.trim()}),
        pageSize: 100,
        pageIndex: 1,
      },
      queryParamsHandling: "replace",
    })
  }

  clearQuerysOnReload() {
    this.router.navigate(["."], {
      relativeTo: this.route,
      queryParams: {
        busRin: null,
        businessName: null,
        companyRin: null,
        companyName: null,
      },
      queryParamsHandling: "merge",
    })
  }
}
