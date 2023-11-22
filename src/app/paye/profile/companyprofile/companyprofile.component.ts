import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { SessionService } from 'src/app/session.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-companyprofile',
  templateUrl: './companyprofile.component.html',
  styleUrls: ['./companyprofile.component.css']
})
export class CompanyprofileComponent implements OnInit {
  companyProfileForm!: FormGroup;
  submitted = false;
  userID: any;
  apiUrl: any;
  corporateID: any;
  apidata: any;
  corporate_id: any;
  roles: any;
  isReadOnly: boolean = false;
  employeesCount!: number;
  myroles: any;
  industrySectors: any;
  taxTaxOffices: any;
  roleID: any;
  file: any;
  imageSrc!: string;
  corporateLogo!: string;
  filePath: any;
  filename: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private sess: SessionService,
    // private component: DashboardComponent,
    // private flashMessage: FlashMessagesService,
    // private spinnerService: Ng4LoadingSpinnerService

  ) { 
    this.corporate_id = this.route.snapshot.params['id'];
   }

   ngOnInit(): void {
    this.sess.isCorporate();
    // this.component.checkIfEditorExist();
    // Check User Login
    this.sess.checkLogin();
    this.roleID = localStorage.getItem("role_id");

    if (this.roleID != 5 && this.roleID != 6 && this.roleID != 7) {
      this.router.navigate(["/dashboard"]);
    }



    this.userID = localStorage.getItem("id");
    this.corporateID = localStorage.getItem("corporate_id");

    this.getTaxOffices();
    this.getIndustrySectors();
    this.getEmployees();
    this.getCompanyData();

    this.companyProfileForm = this.formBuilder.group({
      companyName: ["", [Validators.required, Validators.maxLength(45)]],
      phone: [
        "",
        [
          Validators.required,
          Validators.pattern(/^[0-9\s]*$/),
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      email: ["", [Validators.required, Validators.email]],
      taxOffice: ["", [Validators.required]],
      rcNumber: ["", [Validators.required]],
      myfile: [""],
      industry: ["", [Validators.required]],
      tin: ["", [Validators.required]],
      contactAddress: ["", [Validators.required]],
      // preferredNotification: ['', [Validators.required]],
    });
    if(this.roleID == 6){
      this.isReadOnly = true;
      this.companyProfileForm.controls['myfile'].disable();
      this.companyProfileForm.controls['industry'].disable();

    }

    if (this.roleID == 7) {
      this.isReadOnly = true;
      this.companyProfileForm.controls['myfile'].disable();
      this.companyProfileForm.controls['industry'].disable();
    }
  }

  getIndustrySectors() {
    this.apiUrl = environment.AUTHAPIURL + "industry-sectors";

    this.httpClient.get<any>(this.apiUrl).subscribe((data: any) => {
      console.log("industrySectors: ", data);
      this.industrySectors = data.response;
    });
  }

  getTaxOffices() {
    this.apiUrl = environment.AUTHAPIURL + "tax-offices";

    this.httpClient.get<any>(this.apiUrl).subscribe((data: any) => {
      console.log("taxTaxOffices: ", data);
      this.taxTaxOffices = data.response;
    });
  }

  getCompanyData() {
    this.apiUrl = environment.AUTHAPIURL + "corporates/" + this.corporateID;

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    });
    // this.spinnerService.show();
    console.log("getCompanyData");
    this.httpClient
      .get<any>(this.apiUrl, { headers: reqHeader })
      .subscribe((data: any) => {
        console.log("companyData", data);
        this.apidata = data.response;
        console.log(this.apidata.company_name)
        this.corporateLogo = data.response.corporate_logo;
        // this.spinnerService.hide();
      });
  }

  onUpdate(formAllData: any) {
    this.submitted = true;
    // console.log("formData: ", formAllData);

    // stop the process here if form is invalid
    if (this.companyProfileForm.invalid) {
      // console.log("NOT JUST HERE!");
      return;
    } else {
      // console.log("JUST HERE!");

      if (formAllData.myfile === "") {
        const user = {
          id: this.corporateID,
          industry_sector_id: formAllData.industry,
          tax_office_id: formAllData.taxOffice,
          contact_address: formAllData.contactAddress,
          phone: formAllData.phone,
        };

        this.postData(user);
      } 
      else {
        this.apiUrl = environment.AUTHAPIURL + "file/upload";

        const formData = new FormData();
        formData.append("file", this.companyProfileForm.get("myfile")?.value);

        const config = {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("access_token"),
          },
        };

        // this.spinnerService.show();
        this.httpClient
          .post<any>(this.apiUrl, formData, config)
          .subscribe((data: any) => {
            console.log(data);

            if (data.status === true) {
              Object.keys(this.companyProfileForm.controls).forEach((key) => {
                this.companyProfileForm.get(key)?.setErrors(null);
              });

              const company = {
                corporate_logo: data.response.url,
                id: this.corporateID,
                industry_sector_id: formAllData.industry,
                tax_office_id: formAllData.taxOffice,
                contact_address: formAllData.contactAddress,
              };

              this.corporateLogo = company.corporate_logo;
              console.log("Image Url = " + this.imageSrc);
              this.postData(company);
            } 
            else {
              // this.spinnerService.hide();

              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Please attach only JPEG and PNG Files",
                showConfirmButton: true,
                timer: 5000,
                timerProgressBar: true,
              });
            }
          });
      }
    }

  }

  postData(jsonData: any) {
    this.apiUrl = environment.AUTHAPIURL + "corporates/update";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    });

    // this.spinnerService.show();
    this.httpClient
      .post<any>(this.apiUrl, jsonData, { headers: reqHeader })
      .subscribe((data: any) => {
        console.log(data);
        // Rest form fithout errors

        // this.router.navigate(['/display']);
        if (data.status === true) {
          Object.keys(this.companyProfileForm.controls).forEach((key) => {
            this.companyProfileForm.get(key)?.setErrors(null);
          });
          this.getCompanyData();
          // this.spinnerService.hide();
          // this.flashMessage.show(data.response, { cssClass: 'alert-success', timeout: 5000 });
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Company Profile has been updated successfully",
            showConfirmButton: true,
            timer: 5000,
            timerProgressBar: true,
          });
        } else {
          // this.spinnerService.hide();

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
          });
        }
      });
  }

  getEmployees() {
    this.apiUrl = environment.AUTHAPIURL + "Employee/getall";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    });

    let corporateId = localStorage.getItem("corporate_id");

    // const obj = {
    //   corporate_ids: [corporateId],
    //   business_id: "",
    // };

    this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe((data: any) => {
      console.log('employeesData: ', data);
      this.employeesCount = data.response.data?.length;
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.file = event.target.files[0];
      this.filePath = event.target.files[0].name;
      this.companyProfileForm.get("myfile")?.setValue(file);
    }
  }
}
