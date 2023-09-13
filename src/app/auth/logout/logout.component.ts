import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {

  
    apiUrl: any;
  
    constructor( private router: Router, private http: HttpClient, private ngxService: NgxUiLoaderService) { }
  
    ngOnInit(): void {
      this.logOut();
    }
  
    public logOut() {
      //this.ngxService.start();
  
      // localStorage.clear();
      Object.keys(localStorage)
      .filter(x =>
        x.startsWith('niswasec_'))
      .forEach(x =>
        localStorage.removeItem(x))
      this.apiUrl = environment.AUTHAPIURL + "users/logout";
      const reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
      });
      
      this.http.post<any>(this.apiUrl,  { headers: reqHeader }).subscribe((data) => {console.log(data);
  
  
     });
    // localStorage.clear();
    Object.keys(localStorage).filter(x =>
      x.startsWith('niswasec_')).forEach(x => localStorage.removeItem(x))
    this.router.navigate(["/login"]);
  }
  }