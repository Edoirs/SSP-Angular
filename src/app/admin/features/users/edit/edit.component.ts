import {Component, OnInit} from "@angular/core"
import {FormBuilder, FormGroup, Validators} from "@angular/forms"
import {HttpClient, HttpHeaders} from "@angular/common/http"
import {Router, ActivatedRoute} from "@angular/router"
import {SessionService} from "../../../../session.service"
import {environment} from "../../../../../environments/environment"
// import { FlashMessagesService } from 'angular2-flash-messages';
// import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import Swal from "sweetalert2"
// import { DashboardComponent } from 'src/app/paye/dashboard/dashboard.component';

@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.css"],
})
export class EditComponent implements OnInit {
  editForm!: FormGroup
  submitted = false
  apiUrl: any
  userId: any
  roles: any
  myroles: any
  userRecord: any
  roleID: any
  applications: any
  myapplications: any

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private sess: SessionService // private component: DashboardComponent,
  ) // private flashMessage: FlashMessagesService,
  // private spinnerService: Ng4LoadingSpinnerService

  {
    this.userId = this.route.snapshot.params["id"]
  }

  ngOnInit(): void {
    // this.sess.isCorporate();
    // this.component.checkIfEditorExist();
    // Check User Login
    this.sess.checkLogin()
    this.roleID = localStorage.getItem("role_id")

    // if (this.roleID != 5) {
    //   this.router.navigate(['/dashboard']);
    // }

    // this.roleID = localStorage.getItem('role_id');
    // if (this.roleID != 5) {
    // this.router.navigate(['/logout']);
    // }

    this.getUserById()
    this.getApplication()

    this.editForm = this.formBuilder.group({
      name: ["", [Validators.required]],
      phone: [
        "",
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      email: ["", [Validators.required, Validators.email]],
      role: ["", [Validators.required]],
    })
  }

  getRole() {
    this.apiUrl = environment.AUTHAPIURL + "roles"

    return this.httpClient.get<any>(this.apiUrl).subscribe((res: any) => {
      console.log(res.response)
      this.roles = res.response

      const arr = []
      for (const obj of this.roles) {
        // console.log(obj);
        arr.push({
          id: obj.id,
          role_name: obj.role_name,
          status: obj.status,
        })
        this.myroles = arr
      }
    })
  }

  getApplication() {
    this.apiUrl = environment.AUTHAPIURL + "applications/1/roles"
    // this.ngxService.start();
    return this.httpClient.get<any>(this.apiUrl).subscribe((res: any) => {
      console.log(res.response)
      this.applications = res.response
      this.roles = res.response
      // this.ngxService.stop();
      const arr = []
      for (const obj of this.applications) {
        // console.log(obj);
        arr.push({
          id: obj.id,
          application_name: obj.application_name,
          status: obj.status,
        })
        this.myapplications = arr
      }
    })
  }

  onSubmit(formAllData: any) {
    this.submitted = true
    // stop the process here if form is invalid
    if (this.editForm.invalid) {
      return
    }
    console.log(formAllData)

    const obj = {
      id: this.userId,
      name: formAllData.name,
      role_id: formAllData.role,
      phone: formAllData.phone,
    }
    this.postData(obj)
  }

  postData(jsonData: any) {
    this.apiUrl = environment.AUTHAPIURL + "users/update"

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .post<any>(this.apiUrl, jsonData, {headers: reqHeader})
      .subscribe((data: any) => {
        console.log(data)

        // this.router.navigate(['/display']);
        if (data.status == true) {
          // Rest form fithout errors
          Object.keys(this.editForm.controls).forEach((key) => {
            this.editForm.get(key)?.setErrors(null)
          })
          Swal.fire({
            icon: "success",
            title: "Success",
            text:
              data.response != null && data.response[0] != undefined
                ? data.response[0].message
                : data.message,
            showConfirmButton: true,
            timer: 5000,
            timerProgressBar: true,
          })
          // this.ngxService.stop();
          this.router.navigate(["/admin", "display-user"])
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text:
              data.response != null && data.response[0] != undefined
                ? data.response[0].message
                : data.message,
            showConfirmButton: true,
            timer: 5000,
            timerProgressBar: true,
          })
        }
      })
  }

  getUserById() {
    this.apiUrl = environment.AUTHAPIURL + "users/" + this.userId

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    // this.ngxService.start();
    this.httpClient
      .get<any>(this.apiUrl, {headers: reqHeader})
      .subscribe((data: any) => {
        console.log(data)
        this.userRecord = data.response
        // this.ngxService.stop();
      })
  }
}
