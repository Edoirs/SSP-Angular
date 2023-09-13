import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  roleID:any;

  constructor(private router: Router) { }

  public isRegistrationOfficer() {
    this.roleID = localStorage.getItem("niswasec_role_id");

    if (this.roleID != "1") {
      // localStorage.clear();
      Object.keys(localStorage).filter(x =>
        x.startsWith('niswasec_')).forEach(x => localStorage.removeItem(x))
      this.router.navigate(['/login']);
    }
  }
  public isheadbillingOfficer(){
    this.roleID = localStorage.getItem('niswasec_role_id');
 
    if(this.roleID != 2){
      // localStorage.clear();
      Object.keys(localStorage).filter(x =>
        x.startsWith('niswasec_')).forEach(x => localStorage.removeItem(x))
      this.router.navigate(['/login']);
    }
}
  public isbillingOfficer() {
    this.roleID = localStorage.getItem("niswasec_role_id");

    if (this.roleID !== "3") {
      // localStorage.clear();
      Object.keys(localStorage).filter(x =>
        x.startsWith('niswasec_')).forEach(x => localStorage.removeItem(x))
      this.router.navigate(['/login']);
    }
  }
 
   public isHeadOfICTA(){
    this.roleID = localStorage.getItem('niswasec_role_id');
 
    if(this.roleID != 4){
     //localStorage.clear();
     Object.keys(localStorage).filter(x =>
       x.startsWith('niswasec_')).forEach(x => localStorage.removeItem(x))
      this.router.navigate(['/login']);
    }
}

public isCustomer(){
  this.roleID = localStorage.getItem('niswasec_role_id');

  if(this.roleID != 7){
   //localStorage.clear();
   Object.keys(localStorage).filter(x =>
     x.startsWith('niswasec_')).forEach(x => localStorage.removeItem(x))
    this.router.navigate(['/selflogin']);
  }
}
}
