import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import Swal from 'sweetalert2';
import { SessionService } from 'src/app/session.service';
@Component({
  selector: 'app-headchangepassword',
  templateUrl: './headchangepassword.component.html',
  styleUrls: ['./headchangepassword.component.css']
})
export class HeadchangepasswordComponent {
  changePasswordForm!: FormGroup;
  submitted = false;
  apiUrl: any;
  roleID: any;

  roles: any;
  myroles: any;
  applications: any;
  myapplications: any;
  fieldTextType1!: boolean;
  fieldTextType2!: boolean;
  fieldTextType!: boolean;

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder,
    private httpClient: HttpClient, private sess: SessionService,
    private router: Router) { }

  ngOnInit(): void {
    this.sess.isHeadOfICTA();
    this.initialiseForms();
  }
  initialiseForms() {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.minLength(8),Validators.maxLength(40)]],

      newPassword: ["", [
        Validators.required,Validators.minLength(8),Validators.maxLength(40)
      ]],
      confirmPassword: ["", [
        Validators.required,Validators.minLength(8),Validators.maxLength(40)
      ]] }, {
        validator: MustMatch('newPassword', 'confirmPassword')
      });
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleFieldTextType1() {
    this.fieldTextType1 = !this.fieldTextType1;
  }

  toggleFieldTextType2() {
    this.fieldTextType2 = !this.fieldTextType2;
  }

  onSubmit(formAllData: any) {
    this.submitted = true;
    // stop the process here if form is invalid
    if (this.changePasswordForm.invalid) {
      return;
    }

    const obj = {
      old_password: formAllData.oldPassword,
      password: formAllData.newPassword,
      confirm_password: formAllData.confirmPassword,
    };


    this.apiUrl = environment.AUTHAPIURL + 'admins/change-password';

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("niswasec_access_token"),
    });


    this.httpClient.post<any>(this.apiUrl, obj, { headers: reqHeader }).subscribe(data => {

      if (data.status === true) {

        // Rest form fithout errors
        this.changePasswordForm.reset();
        Object.keys(this.changePasswordForm.controls).forEach(key => {
          this.changePasswordForm.get(key)!.setErrors(null);
        });

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: data.message,
          showConfirmButton: true,
          timer: 5000,
          timerProgressBar: true
        });
      }
      else if(data.status == false &&  data.response == null){
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text:
            data.message ,
          showConfirmButton: true,
          timer: 5000,
        });
      }
     else if (data.response.password !== null){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:
          data.response.password.message != null && data.response.password.message != undefined
            ? data.response.password.message
            : data.message ,
        showConfirmButton: true,
        timer: 5000,
      });
     }
      else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text:
            data.response != null && data.response[0] != undefined
              ? data.response[0].message
              : data.message ,
          showConfirmButton: true,
          timer: 5000,
        });
      }
    });
  }
}
  export function MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];
  
        if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
            // return if another validator has already found an error on the matchingControl
            return;
        }
  
        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
  }



