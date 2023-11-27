import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  roleID: any;
  application_id: any;
  directAssessment_appId: any;
  selfportal_application_id: any;
  validtoken: any;
  months: { monthId: string; monthName: string }[] = [];
  taxMonths: { month: string; monthName: string }[] = [];

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
  public isheadbillingOfficer() {
    this.roleID = localStorage.getItem('niswasec_role_id');

    if (this.roleID != 2) {
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

  public isHeadOfICTA() {
    this.roleID = localStorage.getItem('niswasec_role_id');

    if (this.roleID != 4) {
      //localStorage.clear();
      Object.keys(localStorage).filter(x =>
        x.startsWith('niswasec_')).forEach(x => localStorage.removeItem(x))
      this.router.navigate(['/login']);
    }
  }

  public isCustomer() {
    this.roleID = localStorage.getItem('niswasec_role_id');

    if (this.roleID != 7) {
      //localStorage.clear();
      Object.keys(localStorage).filter(x =>
        x.startsWith('niswasec_')).forEach(x => localStorage.removeItem(x))
      this.router.navigate(['/selflogin']);
    }
  }

  public isCorporate() {
    this.application_id = localStorage.getItem("application_id");
    if (this.application_id == this.directAssessment_appId) {
      this.router.navigate(["/directassessment-dashboard"]);
    }
  }

  public isIndividual() {
    this.application_id = localStorage.getItem("application_id");
    if (this.application_id == this.selfportal_application_id) {
      this.router.navigate(["/dashboard"]);
    }
  }

  public islogin() {
    this.validtoken = localStorage.getItem("access_token");
    this.application_id = localStorage.getItem("application_id");

    if (
      this.validtoken != null &&
      this.application_id == this.selfportal_application_id
    ) {
      this.router.navigate(["/dashboard"]);
    }
    if (
      this.validtoken != null &&
      this.application_id == this.directAssessment_appId
    ) {
      this.router.navigate(["/directassessment-dashboard"]);
    }
  }

  public checkLogin() {
    this.validtoken = localStorage.getItem("access_token");
    // this.application_id = localStorage.getItem("application_id");

    console.log("token: ", this.validtoken);
    // tslint:disable-next-line: triple-equals
    if (this.validtoken == "" || this.validtoken === null) {
      this.router.navigate(["/login"]);
    }
  }

  getAllMonths() {
    this.months = [
      { monthId: "01", monthName: "January" },
      { monthId: "02", monthName: "February" },
      { monthId: "03", monthName: "March" },
      { monthId: "04", monthName: "April" },
      { monthId: "05", monthName: "May" },
      { monthId: "06", monthName: "June" },
      { monthId: "07", monthName: "July" },
      { monthId: "08", monthName: "August" },
      { monthId: "09", monthName: "September" },
      { monthId: "10", monthName: "October" },
      { monthId: "11", monthName: "November" },
      { monthId: "12", monthName: "December" },
    ];
  }

  getMonths() {
    this.taxMonths = [
      { month: "1", monthName: "Jan" },
      { month: "2", monthName: "Feb" },
      { month: "3", monthName: "Mar" },
      { month: "4", monthName: "Apr" },
      { month: "5", monthName: "May" },
      { month: "6", monthName: "Jun" },
      { month: "7", monthName: "Jul" },
      { month: "8", monthName: "Aug" },
      { month: "9", monthName: "Sep" },
      { month: "10", monthName: "Oct" },
      { month: "11", monthName: "Nov" },
      { month: "12", monthName: "Dec" },
    ];
  }

  getMonthName(monthId: string): string {
    var monthName = this.months.filter((m) => m.monthId == monthId)[0]
      .monthName;
    return monthName;
  }

}
