import {Component, inject, OnDestroy, OnInit, signal} from "@angular/core"
import {HttpClient} from "@angular/common/http"
import {HttpHeaders} from "@angular/common/http"
import {FormBuilder, FormGroup, Validators} from "@angular/forms"
import {ActivatedRoute, Router} from "@angular/router"
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap"
import {environment} from "src/environments/environment"
import Swal from "sweetalert2"
import {Title} from "@angular/platform-browser"
import {NgxUiLoaderService} from "ngx-ui-loader"
import {TokenService} from "@shared/services/token.service"
import {AnnualProjectionService} from "@admin-pages/annualprojection/data-access/services/annual-projection.service"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import {ProjectionImageString} from "@admin-pages/annualprojection/data-access/utils/projection.utils"

@Component({
  selector: "app-pendingprojection",
  templateUrl: "./pendingprojection.component.html",
  styleUrls: ["./pendingprojection.component.css"],
})
export class PendingprojectionComponent implements OnInit, OnDestroy {
  readonly tokenService = inject(TokenService)
  private readonly annualProjectionService = inject(AnnualProjectionService)

  forwardProjectionForm!: FormGroup
  selectedProjection: any
  updateProjectionForm!: FormGroup
  dtOptions: any = {}
  roleID: any
  projectionData: any
  myForm!: FormGroup
  submitted: boolean = false
  managerRole = false
  files: any
  file: any
  apidata: any
  forwardedTo: any
  singleCorporate = [] as any
  apiUrl!: string
  corporateId = localStorage.getItem("corporate_id")
  modalOptions!: NgbModalOptions
  closeResult!: string
  editorRole: boolean = false
  apidataEmpty: boolean = false
  disable: boolean = false
  isForwardedToEditor: boolean = false
  annualProjectionId: any
  comments = [] as any
  comment: any
  commentDate: any
  com: any
  apisingledata: any
  isForwarded!: boolean
  title = "PAYE - Pending Projections Report"
  businessesData: any
  selectedBusiness: any
  businessId: any
  companyId: any
  annualReturnsData: any
  editEmployeeModalRef: any
  RIN: any
  NIN: any
  JTBTIN: any
  homeAddress: any
  phoneNumber: any
  totalMonthsPaid: any
  CRA: any
  annualReturnForm: any
  disableEmployeeControl: any
  fileFormH3Form: any
  taxpayerID: any
  taxYear?: string

  btnLoading = signal(false)

  subs = new SubscriptionHandler()

  constructor(
    private httpClient: HttpClient,
    private titleService: Title,
    private route: ActivatedRoute,
    private router: Router,
    // private component: DashboardComponent,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    // private sess: SessionService,
    // private spinnerService: Ng4LoadingSpinnerService
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit() {
    // this.sess.isCorporate();
    this.titleService.setTitle(this.title)
    // this.component.checkIfEditorExist();
    this.initialiseForm()

    this.companyId = localStorage.getItem("companyId")
    // console.log("companyId: ", this.companyId);
    this.listenToRoute()
    // this.getUnapprovedProjectionRecord();

    this.modalOptions = {
      backdrop: true,
      centered: true,
      backdropClass: "customBackdrop",
      size: "xl",
      // size: 'lg'
    }

    this.roleID = localStorage.getItem("role_id")
    // if (this.roleID != 5 && this.roleID != 6 && this.roleID != 7) {
    //   this.router.navigate(['/admin', 'dashboard']);
    // }

    if (this.roleID === "5") {
      this.managerRole = true
    }
    if (this.roleID === "6") {
      this.editorRole = true
    }

    // this.getUnapprovedProjectionRecord();
    this.dtOptions = {
      paging: false,
      pagingType: "simple_numbers",
      responsive: true,
      pageLength: 100,
      lengthChange: false,
      processing: true,
      ordering: false,
      info: false,
      // dom: "<'row'<'col-sm-3'l><'col-sm-6 text-center'B><'col-sm-3'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
      dom:
        "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-5'i><'col-sm-7'p>>",
      buttons: [
        // { extend: 'copy',  className: 'btn btn-outline-dark', text: '<i class="far fa-copy"> Copy</i>' },
        {
          extend: "csv",
          className: "btn btn-outline-dark export-btn",
          text: '<i class="fas fa-file-csv"> CSV</i>',
          exportOptions: {
            columns: [0, 1, 2, 3, 4],
          },
        },
        {
          extend: "excel",
          className: "btn btn-outline-dark export-btn",
          text: '<i class="fas fa-file-excel"> Excel</i>',
          exportOptions: {
            columns: [0, 1, 2, 3, 4],
          },
        },

        {
          extend: "pdfHtml5",
          className: "btn btn-outline-dark export-btn",
          text: '<i class="fas fa-file-pdf"> PDF</i>',
          orientation: "portrait",
          pageSize: "LEGAL",
          exportOptions: {
            columns: [0, 1, 2, 3, 4],
          },

          customize: function (doc: any) {
            doc.content.splice(1, 0, {
              margin: [0, 0, 0, 10],
              alignment: "left",
              image: ProjectionImageString,
            })
          },
        },
      ],
    }
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }

  initialiseForm() {}

  listenToRoute() {
    this.subs.add = this.route.queryParams.subscribe((params) => {
      this.ngxService.start()
      if (Object.keys(params)) {
        this.subs.add = this.annualProjectionService
          .getUploads(
            this.companyId,
            "1",
            "100",
            params["busRin"] && params["busRin"],
            params["businessName"] && params["businessName"],
            params["companyRin"] && params["companyRin"],
            params["companyName"] && params["companyName"]
          )
          .subscribe({
            next: (res) => {
              this.ngxService.stop()

              if (res.status === true) {
                this.businessesData = res?.data?.result
              } else {
                Swal.fire(SweetAlertOptions(res?.message))
              }
            },
            error: (err) => {
              this.ngxService.stop()

              Swal.fire(SweetAlertOptions(err?.error?.message || err?.message))
            },
          })
      }
    })
  }

  viewBusinessProjection(modal: any, data: any) {
    this.businessId = data?.businessID
    this.taxYear = data?.taxYear
    this.getAnnualReturns(
      this.businessId,
      data?.companyId,
      <string>this.taxYear
    )
    this.showModal(modal)
  }

  getAnnualReturns(businessId: any, companyId: string, year: string) {
    this.ngxService.start()

    this.subs.add = this.httpClient
      .get<any>(
        `${environment.AUTHAPIURL}FormH3/getallfiledformh3bycompanyId/${companyId}/bybusinessId/${this.businessId}/byyear/${year}`
      )
      .subscribe((data) => {
        // console.log("annualReturnsData: ", data);
        this.ngxService.stop()
        this.annualReturnsData = data || []
        if (data?.data?.length > 0) {
          this.apidataEmpty = true
        }
      })
  }

  async downloadFiledExcelView() {
    this.btnLoading.set(true)
    this.ngxService.start()
    try {
      this.ngxService.stop()
      this.btnLoading.set(false)
      const {fileURL, filename} =
        await this.annualProjectionService.downloadFiledFormH3View(
          this.companyId,
          this.businessId,
          <string>this.taxYear
        )
      // Create an anchor element
      const link = document.createElement("a")
      link.href = fileURL
      link.download = filename // Set the filename for the download

      // Trigger the download
      link.click()

      // Clean up the URL object
      URL.revokeObjectURL(fileURL)
    } catch (err: any) {
      // console.log({err})
      this.ngxService.stop()
      this.btnLoading.set(false)
      Swal.fire(SweetAlertOptions(err?.error?.error?.message || err?.message))
    }
  }

  editAnnualReturn(modal: any, selectedAnnualReturn: any) {
    // console.log("selectedAnnualReturn: ", selectedAnnualReturn);
    // this.selectedEmployeeId = selectedAnnualReturn.employee_id;
    // this.selectedScheduleRecordId = selectedAnnualReturn.id;

    this.RIN = selectedAnnualReturn.rin
    this.NIN = selectedAnnualReturn.nin
    this.JTBTIN = selectedAnnualReturn.jtbtin
    this.homeAddress = selectedAnnualReturn.homeaddress
    this.phoneNumber = selectedAnnualReturn.phonenumber
    this.totalMonthsPaid = selectedAnnualReturn.numberOfMonths
    this.CRA = selectedAnnualReturn.consolidatedreliefallowancecra
    this.taxpayerID = selectedAnnualReturn.taxPayerId

    this.annualReturnForm = this.formBuilder.group({
      taxPayerID: [selectedAnnualReturn.taxPayerId],

      basicIncome: [
        selectedAnnualReturn.basic,
        [
          Validators.required,
          Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/),
        ],
      ],
      pension: [
        selectedAnnualReturn.pension,
        [Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/)],
      ],
      NHF: [
        selectedAnnualReturn.nhf,
        [Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/)],
      ],
      NHIS: [
        selectedAnnualReturn.nhis,
        [Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/)],
      ],
      CRA: [
        selectedAnnualReturn.cra,
        [Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,3})$/)],
      ],
      rent: [
        selectedAnnualReturn.rent,
        [
          // Validators.required,
          Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/),
        ],
      ],
      transport: [
        selectedAnnualReturn.transport,
        [
          // Validators.required,
          Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/),
        ],
      ],
      otherIncome: [
        selectedAnnualReturn.otherIncome,
        [
          // Validators.required,
          Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/),
        ],
      ],
      lifeAssurance: [
        selectedAnnualReturn.lifeassurance,
        [Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/)],
      ],

      monthlyIncome: [
        selectedAnnualReturn.totalmonthspaid,
        [Validators.required, Validators.pattern(/^[0-9\s]*$/)],
      ],
      annualGrossIncome: [
        selectedAnnualReturn.annual_gross_income,
        [Validators.required, Validators.pattern(/^[0-9\s]*$/)],
      ],
      annualTaxPaid: [
        selectedAnnualReturn.annualtaxpaid,
        [Validators.required, Validators.pattern(/^[0-9\s]*$/)],
      ],
      months: [
        selectedAnnualReturn.months,
        [
          Validators.required,
          Validators.pattern(/^[0-9\s]*$/),
          Validators.maxLength(2),
        ],
      ],
      firstName: [
        selectedAnnualReturn.firstname,
        [
          Validators.required,
          Validators.pattern("[a-zA-Z ]*"),
          Validators.maxLength(30),
        ],
      ],
      middleName: [
        selectedAnnualReturn.othername,
        [
          // Validators.required,
          Validators.pattern("[a-zA-Z ]*"),
          Validators.maxLength(30),
        ],
      ],
      surname: [
        selectedAnnualReturn.surname,
        [
          Validators.required,
          Validators.pattern("[a-zA-Z ]*"),
          Validators.maxLength(30),
        ],
      ],
      nationality: [selectedAnnualReturn.nationality, Validators.required],
      designation: [selectedAnnualReturn.designation, Validators.required],
    })

    this.editEmployeeModalRef = this.modalService.open(modal, this.modalOptions)
  }

  onSubmitAnnualReturn(formAllData: any) {
    this.submitted = true

    if (this.annualReturnForm.invalid) {
      return
    }

    const obj = {
      taxPayerId: this.taxpayerID,
      basic: formAllData.basicIncome,
      rent: formAllData.rent,
      transport: formAllData.transport,
      otherIncome: formAllData.otherIncome,
      companyId: this.companyId,
      businessId: this.businessId,
      pension: formAllData.pension,
      nhis: formAllData.NHIS,
      nhf: formAllData.NHF,
      lifeassurance: formAllData.lifeAssurance,
      monthly_income: formAllData.monthlyIncome,
      annual_gross_income: formAllData.annualGrossIncome,
      // annual_tax_paid: formAllData.annualTaxPaid,
      months: formAllData.months,
      // schedule_record_id: this.selectedScheduleRecordId,

      firstname: formAllData.firstName,
      othername: formAllData.middleName,
      surname: formAllData.surname,
      nationality: formAllData.nationality,
      designation: formAllData.designation,

      annualtaxpaid: formAllData.annualTaxPaid,
      rin: this.RIN,
      jtbtin: this.JTBTIN == undefined ? null : this.JTBTIN,
      nin: this.NIN == undefined ? null : this.NIN,
      homeaddress: this.homeAddress == undefined ? null : this.homeAddress,
      totalmonthspaid: formAllData.months,
      // totalmonthspaid: this.totalMonthsPaid,
      phonenumber: this.phoneNumber == undefined ? null : this.phoneNumber,
      consolidatedreliefallowancecra: "0",
      // consolidatedreliefallowancecra: this.CRA,
    }

    // console.log("annualReturnFormData: ", obj);
    this.postUpdateAnnualReturn(obj)
  }

  postUpdateAnnualReturn(jsonData: any) {
    this.ngxService.start()
    this.apiUrl = `${environment.AUTHAPIURL}FormH/update-TaxpayerH1`

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .put<any>(this.apiUrl, jsonData, {headers: reqHeader})
      .subscribe((data) => {
        // console.log("annualReturnResponseData: ", data);
        this.submitted = false

        if (data.status === true) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Annual Return has been updated successfully!",
            showConfirmButton: true,
            timer: 5000,
          })

          this.getAnnualReturns(
            this.businessId,
            this.companyId,
            <string>this.taxYear
          )
          this.editEmployeeModalRef.close()
          this.ngxService.stop()
        } else {
          this.ngxService.stop()

          Swal.fire({
            icon: "error",
            title: "Oops...",
            text:
              data.response != null ? data.response[0].message : data.message,
            showConfirmButton: true,
            timer: 5000,
          })
        }
      })
  }

  deleteAnnualReturn(taxpayerId: number) {
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.apiUrl = `${environment.AUTHAPIURL}FormH/delete-TaxpayerH3bybusinessId/${this.businessId}/bycompanyId/${this.companyId}/bytaxpayerId/${taxpayerId}`

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        this.httpClient
          .delete<any>(this.apiUrl, {headers: reqHeader})
          .subscribe((data) => {
            // console.log(data);
            if (data.status == true) {
              Swal.fire({
                icon: "success",
                title: "Success",
                text: "Employee Details Successfully Deleted",
                showConfirmButton: false,
                timer: 1500,
              })
              this.getAnnualReturns(
                this.businessId,
                this.companyId,
                <string>this.taxYear
              )
            } else {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: data.message,
                showConfirmButton: true,
                timer: 5000,
              })
            }
          })
      }
    })
  }

  calculateGrossIncome(event: any) {
    // // console.log("test: ", this.editEmployeeForm.get('lifeAssurance').value);
    // if (this.annualReturnForm.valid) {
    //   this.grossIncomeIncorrect = this.utilityService.calculateGrossIncome(
    //     this.annualReturnForm
    //   );
    // } else {
    //   this.grossIncomeIncorrect = this.utilityService.calculateGrossIncome(
    //     this.addEmployeeForm
    //   );
    // }
  }
  calculateTotalIncome(event: any) {
    //   if (this.annualReturnForm.valid) {
    //     this.utilityService.calculateTotalIncome(
    //       this.annualReturnForm
    //     );
    //   } else {
    //     this.utilityService.calculateTotalIncome(
    //       this.addEmployeeForm
    //     );
    //   }
  }

  getUnapprovedProjectionList(year: any, annualPID: any) {
    this.forwardProjectionForm = this.formBuilder.group({
      year: [this.selectedProjection.projection_year, Validators.required],
      comment: ["", Validators.required],
    })
    this.apiUrl = environment.AUTHAPIURL + "projections/unApprovedList"

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    const obj = {
      projection_year: year,
      annual_projection_id: annualPID,
      // corporate_id: this.corporateId,
    }
    // this.ngxService.start();
    this.httpClient
      .post<any>(this.apiUrl, obj, {headers: reqHeader})
      .subscribe((data) => {
        // console.log(data);
        if (data.status == false) {
        } else {
          this.apidata = data.data
          if (data.response.comments) {
            this.com = data.response.comments
            this.comments = this.com.filter(
              (x: any) => x.projection_id == this.com[0].projection_id
            )
            if (this.apidata.length > 0) {
              this.apidataEmpty = true

              this.annualProjectionId = data.data[0].annual_projection_id

              this.forwardedTo =
                this.apidata[0].forwarded_to == 1
                  ? "Projection Forwarded to Tax Office"
                  : this.apidata[0].forwarded_to == 2
                  ? "Projection Forwarded to Head of Station'"
                  : "Not Forwarded"
            }
          } else if (this.apidata.length > 0) {
            this.apidataEmpty = true

            this.annualProjectionId = data.data[0].annual_projection_id

            this.forwardedTo =
              this.apidata[0].forwarded_to == 1
                ? "Projection Forwarded to Tax Office"
                : this.apidata[0].forwarded_to == 2
                ? "Projection Forwarded to Head of Station'"
                : "Not Forwarded"
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: data.message,
              showConfirmButton: true,
              timer: 5000,
              timerProgressBar: true,
            })
          }
        }

        // this.ngxService.stop();
      })
  }

  getUnapprovedProjectionRecord() {
    this.apiUrl = environment.AUTHAPIURL + "projections/unApprovedRecord"

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    const obj = {
      corporate_id: this.corporateId,
      // business_id: businessId,
    }

    // this.ngxService.start();
    this.httpClient
      .post<any>(this.apiUrl, obj, {headers: reqHeader})
      .subscribe((data) => {
        // console.log(data);
        if (data.status == true) {
          if (this.roleID === "5") {
            this.apisingledata = data.response.filter(
              (x: any) => x.forwarded_to != 0
            )
          } else {
            this.apisingledata = data.data
          }
        } else {
          this.apisingledata = []
        }

        // this.ngxService.stop();
      })
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC"
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop"
    } else {
      return `with: ${reason}`
    }
  }

  forwardProjection(modal: any) {
    this.modalService.open(modal, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
      }
    )
  }

  onSubmitProjection(formAllData: any) {
    this.submitted = true

    // stop the process here if form is invalid
    if (this.forwardProjectionForm.invalid) {
      return
    }

    const obj = {
      comment: formAllData.comment,
      annual_projection_id: this.annualProjectionId,
      corporate_id: this.corporateId,
      business_id: this.businessId,
      projection_year: this.selectedProjection.projection_year,
    }

    // console.log("FormData: ", obj);
    this.postForwardProjection(obj)
  }

  postForwardProjection(jsonData: any) {
    // this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "projections/forward"

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .post<any>(this.apiUrl, jsonData, {headers: reqHeader})
      .subscribe((data) => {
        // console.log("ApiResponseData: ", data);

        if (data.status === true) {
          // Rest form fithout errors
          this.forwardProjectionForm.reset()
          Object.keys(this.forwardProjectionForm.controls).forEach((key) => {
            this.forwardProjectionForm.get(key)?.setErrors(null)
          })

          // this.ngxService.stop();
          // this.reload();
          Swal.fire({
            icon: "success",
            title: "Success",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
          })

          this.modalService.dismissAll()
          this.getUnapprovedProjectionRecord()
        } else {
          this.reload()
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
          })
        }
      })
  }

  showModal(modal: any) {
    this.modalService.open(modal, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
      }
    )
  }

  viewProjection(modal: any, selectedProjection: any) {
    // console.log("selectedEmployee: ", selectedProjection);
    this.selectedProjection = selectedProjection
    this.businessId = selectedProjection.business_primary_id

    this.showModal(modal)
    this.getUnapprovedProjectionList(
      this.selectedProjection.projection_year,
      this.selectedProjection.annual_projection_id
    )
    if (this.selectedProjection.forwarded_to === "0") {
      this.isForwardedToEditor = true
    }
    if (this.selectedProjection.forwarded_to === "1") {
      this.isForwarded = false
      this.isForwardedToEditor = true
    }
    if (this.selectedProjection.forwarded_to === "2") {
      this.isForwardedToEditor = false
      this.isForwarded = true
    }
  }

  getSingleProjection(obj: any) {
    // this.ngxService.start();
    this.apiUrl =
      environment.AUTHAPIURL + "projections?corporate_id=" + this.corporateId

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .get<any>(this.apiUrl, {headers: reqHeader})
      .subscribe((data) => {
        // console.log("singleProjectionData: ", data);
        this.projectionData = data.data
        // console.log(this.projectionData);
        this.selectedProjection = data.data
        // this.ngxService.stop();
      })
  }

  approveProjection(modal: any) {
    this.modalService.open(modal, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
      }
    )
  }

  postApproveProjection() {
    this.apiUrl = environment.AUTHAPIURL + "projections/approve"

    const obj = {
      projection_year: this.selectedProjection.projection_year,
      business_id: this.businessId,
      corporate_id: this.corporateId,
    }

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .post<any>(this.apiUrl, obj, {headers: reqHeader})
      .subscribe((data) => {
        // console.log("ApiResponseData: ", data);
        if (data.status === true) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
          })

          this.modalService.dismissAll()
          this.getUnapprovedProjectionRecord()
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
          })
        }
      })
  }

  onRevertProjection(formAllData: any) {
    this.submitted = true

    // stop the process here if form is invalid
    if (this.forwardProjectionForm.invalid) {
      return
    }

    const obj = {
      comment: formAllData.comment,
      annual_projection_id: this.annualProjectionId,
      corporate_id: this.corporateId,
    }

    // console.log("FormData: ", obj);
    this.postRevertProjection(obj)
  }

  postRevertProjection(jsonData: any) {
    this.apiUrl = environment.AUTHAPIURL + "projections/forward"

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .post<any>(this.apiUrl, jsonData, {headers: reqHeader})
      .subscribe((data) => {
        // console.log("ApiResponseData: ", data);

        if (data.status === true) {
          // Rest form fithout errors
          this.forwardProjectionForm.reset()
          Object.keys(this.forwardProjectionForm.controls).forEach((key) => {
            this.forwardProjectionForm.get(key)?.setErrors(null)
          })

          Swal.fire({
            icon: "success",
            title: "Success",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
          })

          this.modalService.dismissAll()
          this.getUnapprovedProjectionRecord()
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
          })
        }
      })
  }

  generateAssessment(modal: any) {
    // this.businessId = data.businessID;
    // this.loadSelectedBusinessData(data);
    // this.getAnnualReturns(this.businessId, this.companyId);
    this.showModal(modal)
  }

  reload() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false
    this.router.onSameUrlNavigation = "reload"
    this.router.navigate(["./"], {relativeTo: this.route})
  }
}
