import {NgxUiLoaderService} from "ngx-ui-loader"
import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  Signal,
  signal,
} from "@angular/core"
import {HttpClient, HttpHeaders} from "@angular/common/http"
import {FormBuilder, FormGroup, Validators} from "@angular/forms"
import {ActivatedRoute, Router} from "@angular/router"
import {
  ModalDismissReasons,
  NgbModal,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap"
import {SessionService} from "src/app/session.service"
import {environment} from "src/environments/environment"
import Swal from "sweetalert2"
// import { Ng4LoadingSpinnerService } from "ng4-loading-spinner";
import {DatePipe} from "@angular/common"
// import { DashboardComponent } from "src/app/paye/dashboard/dashboard.component";
import {Title} from "@angular/platform-browser"
import {UtilityService} from "src/app/utility.service"
import {ScheduleTableImage} from "./utils/schedules.utils"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {ScheduleService} from "./services/schedules.service"
import {ScheduleResInterface} from "./data-access/schedule.model"
import {PageEvent} from "@angular/material/paginator"
import {MatDialog} from "@angular/material/dialog"
import {ScheduleDetailsComponent} from "./ui/schedule-details/schedule-details.component"

@Component({
  selector: "app-schedules",
  templateUrl: "./schedules.component.html",
  styleUrls: ["./schedules.component.css"],
})
export class SchedulesComponent implements OnInit, OnDestroy {
  private readonly scheduleService = inject(ScheduleService)
  private readonly route = inject(ActivatedRoute)
  private readonly dialog = inject(MatDialog)
  dtOptions: any = {}
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
  showForwardSchedule: boolean = false
  managerRole: boolean = false
  editorRole: boolean = false
  forwardedTrue: boolean = false
  assessmentStatusTrue: boolean = false
  schedule: any
  commentsData: any
  date!: Date
  assessmentID: any
  showEditEmployee: boolean = false
  assessmentGenerated!: boolean
  selectedEmployee: any
  selectedEmployeeId: any
  selectedScheduleRecordId: any
  addEmployeeTitle!: string
  showSaveEmployee!: boolean
  editEmployeeModalRef: any
  corporateId!: any
  addEmployeeForm!: FormGroup
  selectedScheduleId: any
  title = "PAYE - Monthly Schedules Report"
  zipCodes: any
  grossIncomeIncorrect!: boolean
  stateLocalGovts: any
  validateCacTin!: boolean
  selectedBusiness: any
  businessId: any
  truthy: boolean = true
  companyId: any

  businessesData = signal<ScheduleResInterface[] | null>(null)
  pageSize = signal(15)
  totalLength = signal(500)
  pageIndex = signal(1)

  subs = new SubscriptionHandler()

  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    private httpClient: HttpClient,
    private router: Router,
    private datepipe: DatePipe,
    private sess: SessionService,
    private utilityService: UtilityService,
    private modalService: NgbModal,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    // this.sess.isCorporate();
    this.titleService.setTitle(this.title)
    // this.component.checkIfEditorExist();
    this.initialiseForms()
    this.getZipcodes()
    this.getStateLocalGovts()
    // console.log("token: ", localStorage.getItem("access_token"))
    var userRole = localStorage.getItem("role_id")
    this.corporateId = localStorage.getItem("corporate_id")

    this.companyId = localStorage.getItem("companyId")
    console.log("companyId: ", this.companyId)

    this.listenToRoute()

    this.showGenerateAssessment = true
    // if (userRole == "5") {
    //   this.showGenerateAssessment = true;
    //   this.managerRole = true;
    // }

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
      pagingType: "full_numbers",
      responsive: true,
      pageLength: 10,
      lengthChange: true,
      processing: true,
      ordering: false,
      info: true,
      dom:
        "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-5'i><'col-sm-7'p>>",
      buttons: [
        {
          extend: "csv",
          className: "btn btn-outline-dark export-btn",
          text: '<i class="fas fa-file-csv"> CSV</i>',
          exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6]},
        },
        // tslint:disable-next-line: max-line-length
        {
          extend: "excel",
          className: "btn btn-outline-dark export-btn",
          text: '<i class="fas fa-file-excel"> Excel</i>',
          exportOptions: {columns: [0, 1, 2, 3, 4, 5, 6]},
        },

        {
          extend: "pdfHtml5",
          className: "btn btn-outline-dark export-btn",
          text: '<i class="fas fa-file-pdf"> PDF</i>',
          orientation: "portrait",
          pageSize: "LEGAL",
          exportOptions: {
            columns: [0, 1, 2, 3, 4, 5, 6],
          },

          customize: function (doc: any) {
            doc.content.splice(1, 0, {
              margin: [0, 0, 0, 10],
              alignment: "left",
              image: ScheduleTableImage,
            })
          },
        },
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
      scheduleMonthId: ["", Validators.required],
      comment: [""],
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
      assessmentMonthId: ["", Validators.required],
    })

    this.scheduleForm = this.formBuilder.group({
      forwardedTo: [""],
      assessmentStatus: [""],
      dateForwarded: [""],
      status: [""],
      dueDate: [""],
      corporateId: [""],
      createdAt: [""],
    })

    this.addEmployeeForm = this.formBuilder.group({
      emailAddress: [
        "",
        [
          Validators.required,
          Validators.maxLength(60),
          Validators.pattern(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
        ],
      ],
      NSIRSTaxPayerID: [""],
      zipCode: ["", [Validators.required]],
      nationality: ["Nigerian", Validators.required],
      startMonthId: ["", Validators.required],
      // otherIncome: ["", [Validators.pattern(/^[0-9\s]*$/)]],
      NHF: ["", [Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/)]],
      NHIS: ["", [Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/)]],
      CRA: ["", [Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,3})$/)]],
      pension: ["", [Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/)]],
      grossIncome: [
        "",
        [
          Validators.required,
          Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/),
        ],
      ],
      totalIncome: [
        "",
        [
          Validators.required,
          Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/),
        ],
      ],

      basicIncome: [
        "0",
        [
          Validators.required,
          Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/),
        ],
      ],
      rent: [
        "0",
        [
          // Validators.required,
          Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/),
        ],
      ],
      transport: [
        "0",
        [
          // Validators.required,
          Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/),
        ],
      ],
      otherIncome: [
        "0",
        [
          // Validators.required,
          Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/),
        ],
      ],

      lifeAssurance: [
        "0",
        [Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,2})$/)],
      ],
      bvn: [
        "",
        [
          Validators.pattern(/^[0-9\s]*$/),
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      nin: [
        "",
        [
          Validators.pattern(/^[0-9\s]*$/),
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      employeeTIN: [
        "",
        [
          Validators.pattern(/^[0-9\s]*$/),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      phoneNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/),
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      homeAddress: ["", [Validators.required, Validators.minLength(10)]],
      firstName: [
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

      otherName: [
        "",
        [
          // Validators.required,
          Validators.pattern("[a-zA-Z ]*"),
          Validators.maxLength(30),
        ],
      ],

      titleId: [""],
      designation: ["", Validators.required],
      existingTaxId: ["", [Validators.minLength(11), Validators.maxLength(11)]],
      localGovernmentId: ["", Validators.required],
    })
  }

  viewSchedule(modal: any, selectedSchedule: any) {
    console.log("selectedSchedule: ", selectedSchedule)
    this.showModal(modal)
    this.selectedScheduleId = selectedSchedule.id
    this.assessmentGenerated = selectedSchedule.assessment_status

    this.getSingleSchedule(selectedSchedule.id)
    var array = selectedSchedule.due_date.split("-", 3)
    var dueDateYear = array[0]
    var dueDateMonth = array[1]

    this.assessmentForm = this.formBuilder.group({
      assessmentYear: [dueDateYear],
      assessmentMonthId: [dueDateMonth],
    })

    this.forwardScheduleForm = this.formBuilder.group({
      scheduleYear: [dueDateYear],
      scheduleMonthId: [dueDateMonth],
      comment: [""],
    })
  }

  openScheduleView(data: ScheduleResInterface) {
    this.dialog.open(ScheduleDetailsComponent, {
      data,
      minWidth: 1000,
    })
  }

  viewBusinessSchedules(modal: any, selectedBusiness: any) {
    this.showModal(modal)
    this.businessId = selectedBusiness.id
    this.getSchedules(selectedBusiness.id)
  }

  loadSelectedScheduleData(selectedSchedule: any) {
    // this.scheduleEmployeesData = '';
    let status = selectedSchedule.status == 0 ? "In Active" : "Active"
    let assessmentStatus =
      selectedSchedule.assessment_status == 0 ? "Still Open" : "Case Closed"
    let forwardedTo =
      selectedSchedule.forwarded_to == 0
        ? "Schedule Not forwarded"
        : selectedSchedule.forwarded_to == 1
        ? "Sent back to Editor"
        : "Forwarded to Manager"

    this.date = new Date(selectedSchedule.created_at)
    let latest_date = this.datepipe.transform(this.date, "yyyy-MM-dd")
    this.scheduleForm = this.formBuilder.group({
      forwardedTo: [forwardedTo],
      assessmentStatus: [assessmentStatus],
      dateForwarded: [selectedSchedule.date_forwarded],
      status: [status],
      dueDate: [selectedSchedule.due_date],
      corporateId: [selectedSchedule.corporate_id],
      createdAt: [latest_date],
    })

    if (forwardedTo === "Schedule Forwarded to Manager") {
      this.forwardedTrue = true
    }

    if (assessmentStatus === "Case Closed") {
      this.assessmentStatusTrue = true
    } else {
      this.assessmentStatusTrue = false
    }

    console.log("assessmentStatusTrue: ", this.assessmentStatusTrue)
    this.commentsData = this.selectedSchedule.comments
    // this.scheduleEmployeesData = this.selectedSchedule.schedule_records.reverse();
  }

  getSchedules(businessId: any) {
    // this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "Schedule/getall"

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    let corporateId = localStorage.getItem("corporate_id")

    // const obj = {
    //   corporate_id: corporateId,
    //   business_id: businessId,
    // };

    this.httpClient
      .get<any>(this.apiUrl, {headers: reqHeader})
      .subscribe((data) => {
        console.log("schedulesData: ", data)
        this.schedulesData = data.data == null ? [] : data.data
        // this.ngxService.stop();
      })
  }

  getZipcodes() {
    this.apiUrl = environment.AUTHAPIURL + "LocalGovtPostalCode/getall"

    this.httpClient.get<any>(this.apiUrl).subscribe((data) => {
      console.log("zipcodes: ", data)
      this.zipCodes = data.data
    })
  }

  getStateLocalGovts() {
    this.apiUrl = `${environment.AUTHAPIURL}LocalGovernmentArea/getall`

    this.httpClient.get<any>(this.apiUrl).subscribe((data) => {
      this.stateLocalGovts = data.data
      console.log("stateLocalGovts: ", data)
    })
  }

  getSingleSchedule(scheduleId: any) {
    // this.ngxService.start();
    this.scheduleEmployeesData = ""
    this.commentsData = ""
    this.apiUrl = `${environment.AUTHAPIURL}Schedule/GetbyId/${scheduleId}`
    // this.apiUrl = environment.AUTHAPIURL + "schedules/" + scheduleId + "?corporate_id=" + this.corporateId +
    //   "&business_id=" +
    //   this.businessId;

    // const obj = {
    //   corporate_id: this.corporateId,
    //   business_id: this.businessId,
    // };

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .get<any>(this.apiUrl, {headers: reqHeader})
      .subscribe((data) => {
        console.log("singleScheduleData: ", data)
        this.selectedSchedule = data.data
        this.schedule = data.data.schedule
        this.loadSelectedScheduleData(this.schedule)
        // this.ngxService.stop();
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
      business_id: this.businessId,
      comment: formAllData.comment,
      due_date: formAllData.scheduleYear + "-" + formAllData.scheduleMonthId,
      corporate_ids: [corporateId],
    }

    console.log("scheduleFormData: ", obj)
    this.postForwardSchedule(obj)
  }

  postForwardSchedule(jsonData: any) {
    // this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "schedules/forward"

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .post<any>(this.apiUrl, jsonData, {headers: reqHeader})
      .subscribe((data) => {
        console.log("scheduleApiResponseData: ", data)

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

          this.getSchedules(this.businessId)
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
      due_date:
        formAllData.assessmentYear + "-" + formAllData.assessmentMonthId,
      corporate_id: corporateId,
      business_id: this.businessId,
    }

    console.log("assessmentFormData: ", obj)
    this.postGenerateAssessment(obj)
  }

  postGenerateAssessment(jsonData: any) {
    // this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "assessments"

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .post<any>(this.apiUrl, jsonData, {headers: reqHeader})
      .subscribe((data) => {
        console.log("assessmentApiResponseData: ", data)

        if (data.status === true) {
          // Rest form fithout errors
          this.assessmentForm.reset()
          Object.keys(this.assessmentForm.controls).forEach((key) => {
            this.assessmentForm.get(key)?.setErrors(null)
          })

          this.assessmentID = data.response.id
          // this.processInvoice(this.assessmentID);
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

          this.getSchedules(this.businessId)
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

  editEmployee(modal: any, selectedEmployee: any) {
    // console.log("selectedEmployee: ---", selectedEmployee);
    this.submitted = false
    this.selectedEmployeeId = selectedEmployee.employee_id
    this.selectedScheduleRecordId = selectedEmployee.id
    this.addEmployeeTitle = "Edit Employee And Monthly Income"
    this.showSaveEmployee = true

    this.editEmployeeModalRef = this.modalService.open(modal, this.modalOptions)
    this.manageModal(this.editEmployeeModalRef)

    // this.showModal(modal);
    this.getSingleEmployee(this.selectedEmployeeId)
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

  getSingleEmployee(employeeId: any) {
    // this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "Employee/GetbyId/" + employeeId
    // this.apiUrl = environment.AUTHAPIURL + 'employees/' + employeeId + '?corporate_id=' + corporateId;

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .get<any>(this.apiUrl, {headers: reqHeader})
      .subscribe((data) => {
        console.log("singleEmployeeData: ", data)

        if (data.response !== null) {
          this.loadSelectedEmployeeData(data.response)
          this.selectedEmployee = data.response
        } else {
          this.editEmployeeModalRef.close()

          Swal.fire({
            icon: "info",
            title: "Info",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
          })
        }

        // this.ngxService.stop();
      })
  }

  listenToRoute() {
    this.subs.add = this.route.queryParams.subscribe((params) => {
      if (Object.keys(params)) {
        if (params["pageIndex"]) this.pageIndex.set(params["pageIndex"])
        if (params["pageSize"]) this.pageSize.set(params["pageSize"])
        this.subs.add = this.scheduleService
          .getSchedules(this.pageIndex(), this.pageSize())
          .subscribe({
            next: (res) => {
              if (res.status === true) {
                this.businessesData.set(res.data.businesses)
                this.totalLength.set(res.data?.totalCount)
              } else {
                this.ngxService.stop()
                Swal.fire({
                  icon: "error",
                  title: "Oops...",
                  text: res.message,
                  showConfirmButton: true,
                  timer: 5000,
                })
              }
            },
          })
      }
    })
  }

  handlePageEvent(event: PageEvent) {
    this.router.navigate(["."], {
      relativeTo: this.route,
      queryParams: {
        pageSize: event.pageSize,
        pageIndex: event.pageIndex === 0 ? 1 : event.pageIndex,
      },
    })
  }

  getSingleBusiness(businessId: any) {
    // this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "Business/GetbyId/" + businessId

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .get<any>(this.apiUrl, {headers: reqHeader})
      .subscribe((data) => {
        console.log("singleBusinessData: ", data)

        this.selectedBusiness = data.response
        // this.ngxService.stop();
      })
  }

  loadSelectedEmployeeData(selectedEmployee: any) {
    this.addEmployeeForm.controls["emailAddress"].setValue(
      selectedEmployee.email
    )
    this.addEmployeeForm.controls["NSIRSTaxPayerID"].setValue(
      selectedEmployee?.taxpayer_id
    )
    this.addEmployeeForm.controls["zipCode"].setValue(
      selectedEmployee?.zip_code
    )
    this.addEmployeeForm.controls["nationality"].setValue(
      selectedEmployee?.nationality
    )
    this.addEmployeeForm.controls["startMonthId"].setValue(
      selectedEmployee?.start_month
    )
    this.addEmployeeForm.controls["NHF"].setValue(selectedEmployee?.nhf)
    this.addEmployeeForm?.controls["NHIS"].setValue(selectedEmployee?.nhis)
    this.addEmployeeForm.controls["CRA"].setValue(selectedEmployee?.cra)
    this.addEmployeeForm.controls["pension"].setValue(selectedEmployee?.pension)
    this.addEmployeeForm.controls["grossIncome"].setValue(
      selectedEmployee?.gross_income
    )
    this.addEmployeeForm.controls["totalIncome"].setValue(
      selectedEmployee?.total_income
    )
    this.addEmployeeForm.controls["basicIncome"].setValue(
      selectedEmployee?.basic
    )
    this.addEmployeeForm.controls["rent"].setValue(selectedEmployee?.rent)
    this.addEmployeeForm.controls["transport"].setValue(
      selectedEmployee?.transport
    )
    this.addEmployeeForm.controls["otherIncome"].setValue(
      selectedEmployee?.other_income
    )
    this.addEmployeeForm.controls["lifeAssurance"].setValue(
      selectedEmployee.life_assurance
    )
    this.addEmployeeForm.controls["bvn"].setValue(selectedEmployee.bvn)
    this.addEmployeeForm.controls["nin"].setValue(selectedEmployee.nin)
    this.addEmployeeForm.controls["employeeTIN"].setValue(selectedEmployee.tin)
    this.addEmployeeForm.controls["phoneNumber"].setValue(
      selectedEmployee.phone
    )
    this.addEmployeeForm.controls["firstName"].setValue(
      selectedEmployee.first_name
    )
    this.addEmployeeForm.controls["surname"].setValue(
      selectedEmployee.last_name
    )
    this.addEmployeeForm.controls["otherName"].setValue(
      selectedEmployee.other_name
    )
    this.addEmployeeForm.controls["titleId"].setValue(selectedEmployee.title)
    this.addEmployeeForm.controls["designation"].setValue(
      selectedEmployee.designation
    )
    this.addEmployeeForm.controls["existingTaxId"].setValue(
      selectedEmployee.taxpayer_id
    )
    this.addEmployeeForm.controls["homeAddress"].setValue(
      selectedEmployee.home_address
    )
    this.addEmployeeForm.controls["localGovernmentId"].setValue(
      selectedEmployee.lga_code
    )
  }

  onSubmitEmployee(formAllData: any) {
    this.submitted = true

    // stop the process here if form is invalid
    this.validateTinPhoneNinBvn(this.addEmployeeForm)

    if (this.addEmployeeForm.invalid || this.validateCacTin) {
      return
    }

    const obj = {
      tin: formAllData.employeeTIN,
      bvn: formAllData.bvn,
      nhis: formAllData.NHIS,
      nhf: formAllData.NHF,
      designation: formAllData.designation,
      title: formAllData.titleId,
      first_name: formAllData.firstName,
      last_name: formAllData.surname,
      other_name: formAllData.otherName,
      email: formAllData.emailAddress,
      nationality: formAllData.nationality,
      zip_code: formAllData.zipCode,
      cra: formAllData.CRA,
      pension: formAllData.pension,
      gross_income: formAllData.grossIncome,
      phone: formAllData.phoneNumber,
      start_month: formAllData.startMonthId,
      corporate_id: this.corporateId,
      taxpayer_id: formAllData.existingTaxId,
      home_address: formAllData.homeAddress,
      id: this.selectedEmployeeId,
      schedule_record_id: this.selectedScheduleRecordId,

      life_assurance: formAllData.lifeAssurance,
      total_income: formAllData.totalIncome,
      lga_code: formAllData.localGovernmentId,
      nin: formAllData.nin,

      basic: formAllData.basicIncome,
      rent: formAllData.rent,
      transport: formAllData.transport,
      other_income: formAllData.otherIncome,

      business_id: this.businessId,
    }

    console.log("employeeFormData: ", obj)
    this.postUpdateEmployee(obj)
  }

  postUpdateEmployee(jsonData: any) {
    // this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "employees/update"

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .post<any>(this.apiUrl, jsonData, {headers: reqHeader})
      .subscribe((data) => {
        console.log("employeeResponseData: ", data)
        this.submitted = false
        if (data.status === true) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Employee has been updated successfully!",
            // text: data.response != null && data.response[0] != undefined ? data.response[0].message : data.message,
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

  calculateGrossIncome(event: any) {
    // console.log("test: ", this.addEmployeeForm.get('lifeAssurance').value);
    this.grossIncomeIncorrect = this.utilityService.calculateGrossIncome(
      this.addEmployeeForm
    )
  }

  calculateTotalIncome(event: any) {
    this.utilityService.calculateTotalIncome(this.addEmployeeForm)
  }

  validateTinPhoneNinBvn(selectedForm: any) {
    let tin = selectedForm.get("employeeTIN").value
    let nin = selectedForm.get("nin").value
    let bvn = selectedForm.get("bvn").value

    if (
      (tin == "" || tin == null) &&
      (nin == "" || nin == null) &&
      (bvn == "" || bvn == null)
    ) {
      this.validateCacTin = true
    } else {
      this.validateCacTin = false
    }
  }

  changeTinPhoneNinBvnStatus() {
    this.validateCacTin = false
  }

  processInvoice(assessmentId: any) {
    // this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "invoices"

    const obj = {
      assessment_id: assessmentId,
    }
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("access_token"),
    })

    this.httpClient
      .post<any>(this.apiUrl, obj, {headers: reqHeader})
      .subscribe((data: any) => {
        console.log("invoice: ", data)
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
