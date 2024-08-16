import {Component, inject, OnInit} from "@angular/core"
import {MatDialog} from "@angular/material/dialog"
import {ChangePasswordModalComponent} from "./ui/change-password/change-password-modal.component"

@Component({
  selector: "app-main-header",
  templateUrl: "./main-header.component.html",
  styleUrls: ["./main-header.component.css"],
})
export class MainHeaderComponent implements OnInit {
  private readonly dialog = inject(MatDialog)
  roleID: any
  roleName: any
  name: any
  middleName: any
  lastName: any

  constructor() {}

  ngOnInit(): void {
    this.roleID = localStorage.getItem("niswasec_role_id")
    this.roleName = localStorage.getItem("niswasec_role_name")
    this.name = localStorage.getItem("niswasec_name")
    this.middleName = localStorage.getItem("niswasec_middle_name")
    this.lastName = localStorage.getItem("niswasec_last_name")
  }

  openChangePassword(): void {
    const dialogRef = this.dialog.open(ChangePasswordModalComponent, {
      minWidth: 400,
    })
  }
}
