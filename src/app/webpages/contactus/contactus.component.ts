import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgxUiLoaderService } from "ngx-ui-loader";
import Swal from 'sweetalert2';
@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent {
    contactUsForm!: FormGroup;
    apiUrl!: string;
    submitted!: boolean;
    phone: any;
    message: any;
    name: any;
    
    constructor(
      private httpClient: HttpClient,
      private router: Router,
      private ngxService: NgxUiLoaderService,
      private route: ActivatedRoute,
      private formBuilder: FormBuilder,
    ) { }
  
    ngOnInit(): void {
      this.initialiseForm();
    }
  
    initialiseForm() {
      this.contactUsForm = this.formBuilder.group({
        phone: [
          "",
          [
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(11),
            Validators.pattern(/^[0-9]\d{10}$|^[0-9]\d{10}$/),
          ],
        ],
        email: ["",
         [Validators.required]
        ],
        name: ["",
        [Validators.required]
      ],
        address: [""],
        message: ["", 
        [Validators.required]
      ]
      });
    }
  
    keyPressNumbersWithDecimal(event: any) {
      var charCode = event.which ? event.which : event.keyCode;
      if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
        return false;
      }
      return true;
    }
  
    onSubmitContactUs(formAllData: any) {
      this.submitted = true;
      if (this.contactUsForm.invalid) {
        return;
      }
            this.ngxService.start();
            this.apiUrl = environment.AUTHAPIURL + "common/submit-contact";
        
            const reqHeader = new HttpHeaders({
              "Content-Type": "application/json",
            });
            var appObj = {
                email : formAllData.email,
                name: formAllData.name,
                message: formAllData.message,
            };
            this.httpClient.post<any>(this.apiUrl, appObj, { headers: reqHeader }).subscribe((data) => {
                this.ngxService.stop(); 
                if (data.status == true) {
        
                  // Rest form fithout errors
        
                  this.initialiseForm();
                  this.submitted =  false;
        
                  Swal.fire({
                   icon: "success",
                   title: "Success",
                   text: data.message,
                   showConfirmButton: true,
                   timer: 5000,
                   timerProgressBar: true,
                 });
                }  else {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: data.response != null ? data.response[0].message : data.message,
                    showConfirmButton: true,
                    timer: 5000,
                    timerProgressBar: true,
                  });
                }
        
              });
          
    }
  
  }
  
