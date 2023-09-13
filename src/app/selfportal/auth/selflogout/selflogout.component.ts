import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-selflogout',
  templateUrl: './selflogout.component.html',
  styleUrls: ['./selflogout.component.css']
})
export class SelflogoutComponent implements OnInit {
  apiUrl: any;

 constructor(private router: Router, private http: HttpClient) { }

 ngOnInit(): void {
  this.logOut();
  }

  public logOut() {
    Object.keys(localStorage).filter(x =>x.startsWith('niswasec_')).forEach(x =>localStorage.removeItem(x))

    this.apiUrl = environment.AUTHAPIURL + "self-portal/admins/logout";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    this.http.post<any>(this.apiUrl, { headers: reqHeader }).subscribe((data) => {
    });

    Object.keys(localStorage).filter(x =>
      x.startsWith('niswasec_')).forEach(x => localStorage.removeItem(x));

    this.router.navigate(["/selflogin"]);
  }
}
