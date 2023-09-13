import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from 'src/app/common.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { SessionService } from 'src/app/session.service';
@Component({
  selector: 'app-headmyprofile',
  templateUrl: './headmyprofile.component.html',
  styleUrls: ['./headmyprofile.component.css']
})
export class HeadmyprofileComponent {


  profileform!: FormGroup
  facilitiesData: any;
  rolesData: any;
  submitted!: boolean
  apiUrl: any;

  userData: any;
  constructor(private formBuilder: FormBuilder, private modalService: NgbModal,
    private httpClient: HttpClient, private sess: SessionService,
    private hospitalService: CommonService,
    private ngxService: NgxUiLoaderService,) { }

  ngOnInit(): void {
    this.sess.isHeadOfICTA();
    this.getUsers();
    this.initialiseForms();

    this.getRoles();


  }
  initialiseForms() {
    this.profileform = this.formBuilder.group({
      emailAddress: ["", [
        Validators.required,
        Validators.maxLength(40),
        Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
      ]],
      firstName: ["", [
        Validators.required,
        Validators.pattern("^[A-Za-z]+[A-Za-z ]*$"),
        Validators.maxLength(30),
      ]],
      middleName: [
        "",
        [
          Validators.pattern("^[A-Za-z]+[A-Za-z ]*$"),
          Validators.maxLength(30),
        ],
      ],
      lastName: [
        "",
        [
          Validators.required,
          Validators.pattern("^[A-Za-z]+[A-Za-z ]*$"),
          Validators.maxLength(30),
        ],
      ],

      department: [""],
      designation: [""],
      phoneNumber: ["", [
        Validators.required,
        Validators.minLength(11),
        Validators.maxLength(11),
        Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/),
      ],
      ],
    });
  }


  getRoles() {
    this.hospitalService.getRoles().subscribe((data: any) => { this.rolesData = data.response; },);
  }

  keyPressNumbersWithDecimal(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }


  getUsers() {
    this.ngxService.start();

    this.apiUrl = `${environment.AUTHAPIURL}admins/profile`;
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });

    this.httpClient
      .get<any>(this.apiUrl, { headers: reqHeader })
      .subscribe((data) => {
        this.userData = data.response;
        this.profileform = this.formBuilder.group({
          emailAddress:  new FormControl({ value: this.userData.email, disabled: true }),
          firstName: new FormControl({ value: this.userData.first_name, disabled: true }),
           
          middleName:new FormControl({ value: this.userData.middle_name, disabled: true }), 
          lastName: new FormControl({ value: this.userData.last_name, disabled: true }), 

          phoneNumber:  new FormControl({ value: this.userData.phone, disabled: true }), 
          department: new FormControl({ value: this.userData.department, disabled: true }), 
          designation: new FormControl({ value: this.userData.designation, disabled: true }),
        });

      });
    this.ngxService.stop();
  }
  onupdateUser(formAllData: any) {
    this.submitted = true;
    if (this.profileform.invalid) {
      return;
    }
    let requestObj = {

      first_name: formAllData.firstName,
      middle_name: formAllData.middleName,
      last_name: formAllData.lastName,
      phone: formAllData.phoneNumber,
      email: formAllData.emailAddress,
      department: formAllData.department,
      designation: formAllData.designation,

    };
    this.apiUrl = `${environment.AUTHAPIURL}admins/update-profile`;

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("niswasec_access_token"),
    });

    this.ngxService.start();
    this.httpClient.post<any>(this.apiUrl, requestObj, { headers: reqHeader }).subscribe((data) => {
      this.ngxService.stop();

      if (data.status == true) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message,
          showConfirmButton: true,
          timer: 5000,
        });
        this.getUsers()
        this.initialiseForms();
        this.submitted = false;

      }

      else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text:
            data.response != null && data.response[0] != undefined
              ? data.response[0].message
              : data.message,
          showConfirmButton: true,
          timer: 5000,
        });
      }
    });
  }
}

