import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})
export class MainHeaderComponent implements OnInit {
  roleID: any;
  roleName: any;
  name: any;
  middleName: any;
  lastName: any;
  constructor() { }

  ngOnInit(): void {

    this.roleID = localStorage.getItem('niswasec_role_id');
    this.roleName = localStorage.getItem('niswasec_role_name');
    this.name = localStorage.getItem('niswasec_name');
    this.middleName = localStorage.getItem('niswasec_middle_name');
    this.lastName =  localStorage.getItem('niswasec_last_name');
  }

}
