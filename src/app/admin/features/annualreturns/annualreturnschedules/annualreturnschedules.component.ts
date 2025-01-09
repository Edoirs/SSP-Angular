import {Component, inject, OnDestroy, OnInit} from "@angular/core"
import {HttpClient, HttpHeaders} from "@angular/common/http"
import {FormBuilder, FormGroup, Validators} from "@angular/forms"
import {Router} from "@angular/router"
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap"
import {SessionService} from "src/app/session.service"
import {environment} from "src/environments/environment"
import Swal from "sweetalert2"
import {DatePipe} from "@angular/common"
import {Title} from "@angular/platform-browser"
import {NgxUiLoaderService} from "ngx-ui-loader"
import {ViewReturnScheduleComponent} from "./ui/view-return-schedule/view-return-schedule.component"
import {MaterialDialogConfig} from "@shared/utils/material.utils"
import {MatDialog} from "@angular/material/dialog"
import {DtImageOne, DtImageTwo} from "./utils/annual-return-schedules.utils"
import {ServerResInterface} from "@shared/types/server-response.model"
import {AnnualScheduleReInterface} from "./data-access/annual-return-schedule.model"
import {TokenService} from "@shared/services/token.service"
import {FormHoneService} from "../data-access/services/form-h1.service"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"

@Component({
  selector: "app-annualreturnschedules",
  templateUrl: "./annualreturnschedules.component.html",
  styleUrls: ["./annualreturnschedules.component.css"],
})
export class AnnualreturnschedulesComponent implements OnInit, OnDestroy {
  private readonly dialog = inject(MatDialog)
  readonly tokenService = inject(TokenService)
  readonly formHoneService = inject(FormHoneService)
  dtOptions: any = {}
  dtSmOptions: any = {}
  modalOptions!: NgbModalOptions
  apiUrl!: string
  schedulesData: any
  forwardScheduleForm!: FormGroup
  scheduleForm!: FormGroup
  assessmentForm!: FormGroup
  closeResult!: string
  submitted: boolean = false
  scheduleEmployeesData: any
  selectedSchedule: any
  showGenerateAssessment: boolean = false
  months: {monthId: string; monthName: string}[] = []
  managerRole: boolean = false
  editorRole: boolean = false
  forwardedToManager: boolean = false
  forwardedToEditor: boolean = false
  commentsData: any
  date!: Date
  isFiled: any
  showEditEmployee!: boolean
  assessmentGenerated!: boolean
  selectedEmployeeId: any
  selectedScheduleRecordId: any
  editEmployeeModalRef: any
  annualReturnForm!: FormGroup
  corporateId: any
  selectedScheduleId: any
  businessesData: any
  selectedBusiness: any
  businessId: any
  title = "PAYE - Annual Return Schedules Report"
  companyId: any
  annualReturnsData: any
  apidataEmpty: boolean = false

  subs = new SubscriptionHandler()

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private router: Router,
    private titleService: Title,
    private datepipe: DatePipe,
    private sess: SessionService,
    // private component: DashboardComponent,
    private modalService: NgbModal,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(this.title)
    this.getAllMonths()

    this.companyId = localStorage.getItem("companyId")
    // console.log("companyId: ", this.companyId)
    // this.getBusinesses();
    this.getSchedules()

    this.initialiseForms()
    // console.log("token: ", localStorage.getItem("access_token"))
    var userRole = localStorage.getItem("role_id")
    this.corporateId = localStorage.getItem("corporate_id")

    if (userRole == "5") {
      this.showGenerateAssessment = true
      this.managerRole = true
    }

    if (userRole == "6") {
      this.editorRole = true
      this.showEditEmployee = true
    }

    this.modalOptions = {
      backdrop: true,
      centered: true,
      backdropClass: "customBackdrop",
      // size: 'lg'
      size: "xl",
    }

    this.intialiseTableProperties()
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }

  intialiseTableProperties() {
    this.dtOptions = {
      paging: true,
      scrollX: true,
      pagingType: "simple_numbers",
      responsive: true,
      pageLength: 50,
      lengthChange: true,
      processing: true,
      ordering: false,
      info: true,

      // columnDefs: [
      //   {
      //     //targets: [10],
      //     visible: false,
      //     searchable: false
      //   }
      // ],
      dom:
        "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-5'i><'col-sm-7'p>>",
      buttons: [
        // { extend: 'copy',  className: 'btn btn-outline-dark', text: '<i class="far fa-copy"> Copy</i>' },
        // tslint:disable-next-line: max-line-length
        {
          extend: "csv",
          className: "btn btn-outline-dark export-btn",
          text: '<i class="fas fa-file-csv"> CSV</i>',
          exportOptions: {columns: [0, 1, 2, 3, 4, 5]},
        },
        // tslint:disable-next-line: max-line-length
        {
          extend: "excel",
          className: "btn btn-outline-dark export-btn",
          text: '<i class="fas fa-file-excel"> Excel</i>',
          exportOptions: {columns: [0, 1, 2, 3, 4, 5]},
        },

        {
          extend: "pdfHtml5",
          className: "btn btn-outline-dark export-btn",
          text: '<i class="fas fa-file-pdf"> PDF</i>',
          orientation: "portrait",
          pageSize: "LEGAL",
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5],
          },

          customize: function (doc: any) {
            doc.content.splice(1, 0, {
              margin: [0, 0, 0, 10],
              alignment: "left",
              image: DtImageOne,
            })
          },
        },
      ],
    }
    this.dtSmOptions = {
      paging: true,
      pagingType: "simple_numbers",
      responsive: true,
      pageLength: 10,
      lengthChange: true,
      processing: true,
      ordering: false,
      info: true,
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
          exportOptions: {columns: [0, 1, 2, 3, 4, 5]},
        },
        {
          extend: "excel",
          className: "btn btn-outline-dark export-btn",
          text: '<i class="fas fa-file-excel"> Excel</i>',
          exportOptions: {columns: [0, 1, 2, 3, 4, 5]},
        },
        // tslint:disable-next-line: max-line-length

        {
          extend: "pdfHtml5",
          className: "btn btn-outline-dark export-btn",
          text: '<i class="fas fa-file-pdf"> PDF</i>',
          orientation: "portrait",
          pageSize: "LEGAL",
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5],
          },

          customize: function (doc: any) {
            doc.content.splice(1, 0, {
              margin: [0, 0, 0, 10],
              alignment: "left",
              image: DtImageTwo,
            })
          },
        },
        // { extend: 'print', className: 'btn btn-outline-dark', text: '<i class="far fas fa-print"> Print</i>' }
      ],
    }
  }

  initialiseForms() {
    this.forwardScheduleForm = this.formBuilder.group({
      scheduleYear: [
        "",
        [
          Validators.required,
          Validators.pattern(/^[0-9\s]*$/),
          Validators.minLength(4),
          Validators.maxLength(4),
        ],
      ],
      // scheduleMonthId: ['', Validators.required],
      // comment: ['', Validators.required],
    })

    this.assessmentForm = this.formBuilder.group({
      assessmentYear: [
        "",
        [
          Validators.required,
          Validators.pattern(/^[0-9\s]*$/),
          Validators.minLength(4),
          Validators.maxLength(4),
        ],
      ],
      // assessmentMonthId: ['', Validators.required],
    })

    this.scheduleForm = this.formBuilder.group({
      forwardedTo: [""],
      annualReturnStatus: [""],
      dateForwarded: [""],
      dueDate: [""],
    })

    this.annualReturnForm = this.formBuilder.group({
      // dateCreated: [''],
      taxPayerID: [""],
      monthlyIncome: [
        "",
        [Validators.required, Validators.pattern(/^[0-9\s]*$/)],
      ],
      annualGrossIncome: [
        "",
        [Validators.required, Validators.pattern(/^[0-9\s]*$/)],
      ],
      annualTaxPaid: [
        "",
        [Validators.required, Validators.pattern(/^[0-9\s]*$/)],
      ],
      months: [
        "",
        [
          Validators.required,
          Validators.pattern(/^[0-9\s]*$/),
          Validators.maxLength(2),
        ],
      ],
      firstName: [
        "",
        [
          Validators.required,
          Validators.pattern("[a-zA-Z ]*"),
          Validators.maxLength(30),
        ],
      ],
      middleName: [
        "",
        [
          Validators.required,
          Validators.pattern("[a-zA-Z ]*"),
          Validators.maxLength(30),
        ],
      ],
      surname: [
        "",
        [
          Validators.required,
          Validators.pattern("[a-zA-Z ]*"),
          Validators.maxLength(30),
        ],
      ],
      nationality: ["Nigerian", Validators.required],
      designation: ["", Validators.required],
      // corporateID: [''],
    })
  }

  getAllMonths() {
    this.months = [
      {monthId: "01", monthName: "January"},
      {monthId: "02", monthName: "February"},
      {monthId: "03", monthName: "March"},
      {monthId: "04", monthName: "April"},
      {monthId: "05", monthName: "May"},
      {monthId: "06", monthName: "June"},
      {monthId: "07", monthName: "July"},
      {monthId: "08", monthName: "August"},
      {monthId: "09", monthName: "September"},
      {monthId: "10", monthName: "October"},
      {monthId: "11", monthName: "November"},
      {monthId: "12", monthName: "December"},
    ]
  }

  getMonthName(monthId: string): string {
    var monthName = this.months.filter((m) => m.monthId == monthId)[0].monthName
    return monthName
  }

  viewSchedule(modal: any, selectedSchedule: any) {
    // console.log("selectedSchedule: ", selectedSchedule);
    this.showModal(modal)
    this.selectedScheduleId = selectedSchedule.id
    // this.assessmentGenerated = selectedSchedule.annual_return_assessment_status;

    this.getAnnualReturns(selectedSchedule.businessID, selectedSchedule.taxYear)
    this.loadSelectedScheduleData(selectedSchedule)

    // let filedStatus = selectedSchedule.filedStatus.trim();
    // let status = filedStatus == "1" ? "Filed" : filedStatus == "2" ? "Approved" : "Rejected";
    // let dateForwarded = this.datepipe.transform(selectedSchedule.datetcreated, "dd MMM yyyy");
    // let dateDue = this.datepipe.transform(selectedSchedule.dueDate, "dd MMM yyyy");

    // this.scheduleForm = this.formBuilder.group({
    //   forwardedTo: ["Forwarded to Manager"],
    //   annualReturnStatus: [status],
    //   dateForwarded: [dateForwarded],
    //   dueDate: [dateDue],
    // });
  }

  loadSelectedScheduleData(selectedSchedule: any) {
    // let status = selectedSchedule.status == 0 ? "In Active" : "Active";
    let annualReturnStatus = selectedSchedule.annualReturnStatus
    let forwardedTo = selectedSchedule.forwardedTO

    this.date = new Date(selectedSchedule.dateForwarded)
    // let dateForwarded = this.datepipe.transform(this.date, "dd MMM yyyy");

    let testDate = new Date(selectedSchedule.dueDate)
    // let dueDate = this.datepipe.transform(testDate, "dd MMM yyyy");

    this.scheduleForm = this.formBuilder.group({
      forwardedTo: [forwardedTo],
      annualReturnStatus: [annualReturnStatus],
      dateForwarded: [selectedSchedule.dateForwarded],
      dueDate: [selectedSchedule.dueDate],
    })

    // this.scheduleEmployeesData =
    //   selectedSchedule.annual_return_schedule_records;
    // if (forwardedTo === "Forwarded to Manager") {
    //   this.forwardedToManager = true;
    // } else if (forwardedTo === "Forwarded to Editor") {
    //   this.forwardedToEditor = true;
    // }
  }

  getBusinesses() {
    const obj = {}
    this.ngxService.start()
    this.apiUrl = `${environment.AUTHAPIURL}SSP/FormH1/getallformh3WithcompanyId/${this.companyId}`

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .get<any>(this.apiUrl, {headers: reqHeader})
      .subscribe((data) => {
        // console.log("BusinessData: ", data);

        this.businessesData = data
        this.ngxService.stop()
      })
  }

  openDetailView(data: AnnualScheduleReInterface) {
    this.modalService.dismissAll()
    this.dialog.open(ViewReturnScheduleComponent, MaterialDialogConfig({data}))
  }

  getSingleBusiness(businessId: any) {
    this.ngxService.start()
    this.apiUrl = environment.AUTHAPIURL + "Business/GetbyId/" + businessId

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .get<any>(this.apiUrl, {headers: reqHeader})
      .subscribe((data) => {
        // console.log("singleBusinessData: ", data);
        this.selectedBusiness = data
        this.ngxService.stop()
      })
  }

  viewBusinessAnnualReturn(modal: any, data: any) {
    this.businessId = data.id
    // this.getSchedules(this.businessId);
    this.showModal(modal)
  }

  getSchedules() {
    this.ngxService.start()

    this.subs.add = this.formHoneService
      .getAnnualScedules(this.companyId, "1", "2000000")
      .subscribe((res) => {
        // console.log("schedulesData: ", res);

        this.schedulesData = res?.data?.result
        this.ngxService.stop()
      })
  }

  getSingleSchedule(scheduleId: any) {
    this.ngxService.start()
    this.apiUrl =
      environment.AUTHAPIURL + "annual-return-schedules/" + scheduleId

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .get<any>(this.apiUrl, {headers: reqHeader})
      .subscribe((data) => {
        // console.log("singleScheduleData: ", data);
        this.selectedSchedule = data.response
        this.isFiled = this.selectedSchedule.annual_return_assessment_status
        this.loadSelectedScheduleData(this.selectedSchedule)
        this.ngxService.stop()
      })
  }

  getAnnualReturns(businessId: any, year: any) {
    this.ngxService.start()

    this.apiUrl = `${environment.AUTHAPIURL}SSP/FormH1/getallfiledformh1bycompanyId/${this.companyId}/bybusinessId/${businessId}/byyear/${year}`

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .get<ServerResInterface<AnnualScheduleReInterface[]>>(this.apiUrl, {
        headers: reqHeader,
      })
      .subscribe((res) => {
        // console.log("annualReturnsData: ", data);
        this.annualReturnsData = res.data || []
        if (res.data?.length > 0) {
          this.apidataEmpty = true
        }
        this.ngxService.stop()
      })
  }

  forwardSchedule(modal: any) {
    this.showModal(modal)
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

  onSubmitSchedule(formAllData: any) {
    this.submitted = true

    // stop the process here if form is invalid
    if (this.forwardScheduleForm.invalid) {
      return
    }

    let corporateId = localStorage.getItem("corporate_id")

    const obj = {
      // comment: formAllData.comment,
      due_date: formAllData.scheduleYear,
      businesses: [
        {
          corporate_id: corporateId,
          business_id: this.businessId,
        },
      ],
    }

    // console.log("scheduleFormData: ", obj);
    this.postForwardSchedule(obj)
  }

  postForwardSchedule(jsonData: any) {
    // this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "annual-return-schedules/forward"

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .post<any>(this.apiUrl, jsonData, {headers: reqHeader})
      .subscribe((data) => {
        // console.log("scheduleApiResponseData: ", data);

        if (data.status === true) {
          // Rest form fithout errors
          this.forwardScheduleForm.reset()
          Object.keys(this.forwardScheduleForm.controls).forEach((key) => {
            this.forwardScheduleForm.get(key)?.setErrors(null)
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
          this.modalService.dismissAll()
          // this.getSchedules(this.businessId);
        } else {
          // this.ngxService.stop();

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
          // this.getSchedules(this.businessId);
        }
      })
  }

  generateAssessment(modal: any) {
    this.showModal(modal)
  }

  onSubmitAssessment(formAllData: any) {
    this.submitted = true

    // stop the process here if form is invalid
    if (this.assessmentForm.invalid) {
      return
    }

    let corporateId = localStorage.getItem("corporate_id")

    const obj = {
      due_date: formAllData.assessmentYear,
      corporate_id: corporateId,
      business_id: this.businessId,
    }

    // console.log("assessmentFormData: ", obj);
    this.postGenerateAssessment(obj)
  }

  postGenerateAssessment(jsonData: any) {
    // this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "annual-return-assessments"

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .post<any>(this.apiUrl, jsonData, {headers: reqHeader})
      .subscribe((data) => {
        // console.log("assessmentApiResponseData: ", data);

        if (data.status === true) {
          // Rest form fithout errors
          this.assessmentForm.reset()
          Object.keys(this.assessmentForm.controls).forEach((key) => {
            this.assessmentForm.get(key)?.setErrors(null)
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

          // this.getSchedules(this.businessId);
          // this.ngxService.stop();
          this.modalService.dismissAll()
        } else {
          // this.ngxService.stop();

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

  editEmployee(modal: any, selectedAnnualReturn: any) {
    // console.log("selectedAnnualReturn: ", selectedAnnualReturn);
    this.selectedEmployeeId = selectedAnnualReturn.employee_id
    this.selectedScheduleRecordId = selectedAnnualReturn.id

    this.annualReturnForm = this.formBuilder.group({
      taxPayerID: [selectedAnnualReturn.taxpayer_id],

      monthlyIncome: [
        selectedAnnualReturn.monthly_income,
        [Validators.required, Validators.pattern(/^[0-9\s]*$/)],
      ],
      annualGrossIncome: [
        selectedAnnualReturn.annual_gross_income,
        [Validators.required, Validators.pattern(/^[0-9\s]*$/)],
      ],
      annualTaxPaid: [
        selectedAnnualReturn.annual_tax_paid,
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
        selectedAnnualReturn.first_name,
        [
          Validators.required,
          Validators.pattern("[a-zA-Z ]*"),
          Validators.maxLength(30),
        ],
      ],
      middleName: [
        selectedAnnualReturn.middle_name,
        [
          Validators.required,
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

    // stop the process here if form is invalid
    if (this.annualReturnForm.invalid) {
      return
    }

    const obj = {
      annual_return_upload_taxpayer_id: formAllData.taxPayerID,
      corporate_id: this.corporateId,
      monthly_income: formAllData.monthlyIncome,
      annual_gross_income: formAllData.annualGrossIncome,
      annual_tax_paid: formAllData.annualTaxPaid,
      months: formAllData.months,
      schedule_record_id: this.selectedScheduleRecordId,

      first_name: formAllData.firstName,
      middle_name: formAllData.middleName,
      surname: formAllData.surname,
      nationality: formAllData.nationality,
      designation: formAllData.designation,
    }

    // console.log("annualReturnFormData: ", obj);
    this.postUpdateAnnualReturn(obj)
  }

  manageModal(modalReference: any) {
    modalReference.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
      }
    )
  }

  postUpdateAnnualReturn(jsonData: any) {
    // this.ngxService.start();
    this.apiUrl = `${environment.AUTHAPIURL}annual-return-records/update`

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .post<any>(this.apiUrl, jsonData, {headers: reqHeader})
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

          this.getSingleSchedule(this.selectedScheduleId)
          this.editEmployeeModalRef.close()
          // this.ngxService.stop();
        } else {
          // this.ngxService.stop();

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

  deleteAnnualReturn(annualReturnId: number) {
    const obj = {
      id: annualReturnId,
      corporate_id: this.corporateId,
    }

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.apiUrl = `${environment.AUTHAPIURL}annual-return-records/delete`

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
          .post<any>(this.apiUrl, obj, {headers: reqHeader})
          .subscribe((data) => {
            // console.log(data);

            if (data.status == true) {
              Swal.fire({
                icon: "success",
                title: "Success",
                text: "Annual Return Successfully Deleted",
                showConfirmButton: false,
                timer: 1500,
              })

              this.getSingleSchedule(this.selectedScheduleId)
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC"
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop"
    } else {
      return `with: ${reason}`
    }
  }
}
