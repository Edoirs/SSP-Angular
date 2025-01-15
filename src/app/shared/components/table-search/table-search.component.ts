import {Component, inject} from "@angular/core"
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
export class TableSearchComponent {
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

  queryTable() {
    const {businessName, busRin, companyName, companyRin} =
      this.tableFilterForm.value
    this.router.navigate(["."], {
      relativeTo: this.route,
      queryParams: {
        ...(businessName && {businessName}),
        ...(busRin && {busRin}),
        ...(companyName && {companyName}),
        ...(companyRin && {companyRin}),
        pageSize: 100,
        pageIndex: 1,
      },
      queryParamsHandling: "replace",
    })
  }
}
