import { Component } from '@angular/core';

@Component({
  selector: 'app-main-sidebar',
  templateUrl: './main-sidebar.component.html',
  styleUrls: ['./main-sidebar.component.css']
})
export class MainSidebarComponent {
  roleID: any;
  isRegistrationOfficer!:boolean
  isSuperAdmin!:boolean
  isbillingOfficer!:boolean
  isheadbillingOfficer!:boolean
  isCustomer!:boolean
  
  constructor() { }

  ngOnInit(): void {
  this.roleID = localStorage.getItem('niswasec_role_id');

  if (this.roleID == 1) {
    this.isRegistrationOfficer = true;
  }
  if (this.roleID == 	2) {
    this.isheadbillingOfficer = true;
  }
  if (this.roleID == 	3) {
    this.isbillingOfficer = true;
  }
  if (this.roleID == 4) {
    this.isSuperAdmin = true;
  }

  if (this.roleID == 7) {
    this.isCustomer = true;
  }
}
}
