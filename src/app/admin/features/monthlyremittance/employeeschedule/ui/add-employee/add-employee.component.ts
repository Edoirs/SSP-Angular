import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core"
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from "@angular/material/dialog"
import {EmployeescheduleComponent} from "../../employeeschedule.component"
import {CommonModule} from "@angular/common"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {EmployeeScheduleService} from "../../services/employee-schedule.service"
import * as EmployeeUtils from "../../utils/employeeschedule.utils"
import {UtilityService} from "src/app/utility.service"
import {
  AddEmployeeInterface,
  BusinessesResInterface,
} from "../../data-access/employee-schedule.model"
import {MatSnackBar} from "@angular/material/snack-bar"

@Component({
  selector: "app-add-employee",
  templateUrl: "./add-employee.component.html",
  styleUrl: "./add-employee.component.css",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatDialogClose],
  providers: [EmployeeScheduleService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEmployeeComponent implements OnInit, OnDestroy {
  private readonly dialogRef = inject(MatDialogRef<EmployeescheduleComponent>)
  private readonly injectedData =
    inject<BusinessesResInterface>(MAT_DIALOG_DATA)
  private readonly employeeScheduleService = inject(EmployeeScheduleService)
  private readonly utilityService = inject(UtilityService)
  private readonly snackBar = inject(MatSnackBar)

  loading = signal(false)
  message = signal("")

  grossIncomeIncorrect!: boolean
  validateCacTin!: boolean

  stateLocalGovts = signal<any>(null)
  zipCodes = signal<any>(null)

  subs = new SubscriptionHandler()

  addEmployeeForm = new FormGroup({
    firstname: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern(EmployeeUtils.TextOnlyRegex),
        Validators.maxLength(30),
      ],
    }),
    surname: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern(EmployeeUtils.TextOnlyRegex),
        Validators.maxLength(30),
      ],
    }),
    othername: new FormControl("", {
      validators: [
        Validators.pattern(EmployeeUtils.TextOnlyRegex),
        Validators.maxLength(30),
      ],
    }),
    title: new FormControl("", {validators: [Validators.required]}),
    email: new FormControl("", {
      validators: [
        Validators.required,
        Validators.maxLength(45),
        Validators.email,
        Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
      ],
    }),
    zipCode: new FormControl("", {validators: [Validators.required]}),
    nationality: new FormControl("Nigerian", {
      validators: [
        Validators.required,
        Validators.pattern(EmployeeUtils.TextOnlyRegex),
      ],
    }),
    startMonth: new FormControl("01", {validators: [Validators.required]}),
    nhf: new FormControl("0", {
      validators: [Validators.pattern(EmployeeUtils.PositiveNumberRegex)],
    }),
    nhis: new FormControl("0", {
      validators: [Validators.pattern(EmployeeUtils.PositiveNumberRegex)],
    }),
    pension: new FormControl("0", {
      validators: [Validators.pattern(EmployeeUtils.PositiveNumberRegex)],
    }),
    grossIncome: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern(EmployeeUtils.PositiveNumberRegex),
      ],
    }),
    totalIncome: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern(EmployeeUtils.PositiveNumberRegex),
      ],
    }),
    basic: new FormControl("0", {
      validators: [
        Validators.required,
        Validators.pattern(EmployeeUtils.PositiveNumberRegex),
      ],
    }),
    rent: new FormControl("0", {
      validators: [Validators.pattern(EmployeeUtils.PositiveNumberRegex)],
    }),
    ltg: new FormControl("0", {
      validators: [Validators.pattern(EmployeeUtils.PositiveNumberRegex)],
    }),
    meal: new FormControl("0", {
      validators: [Validators.pattern(EmployeeUtils.PositiveNumberRegex)],
    }),
    utility: new FormControl("0", {
      validators: [Validators.pattern(EmployeeUtils.PositiveNumberRegex)],
    }),
    transport: new FormControl("0", {
      validators: [Validators.pattern(EmployeeUtils.PositiveNumberRegex)],
    }),
    otherIncome: new FormControl("0", {
      validators: [Validators.pattern(EmployeeUtils.PositiveNumberRegex)],
    }),
    lifeAssurance: new FormControl("0", {
      validators: [Validators.pattern(EmployeeUtils.PositiveNumberRegex)],
    }),
    bvn: new FormControl("", {
      validators: [
        Validators.pattern(EmployeeUtils.CardIdRegex),
        Validators.minLength(11),
        Validators.maxLength(11),
      ],
    }),
    nin: new FormControl("", {
      validators: [
        Validators.pattern(EmployeeUtils.CardIdRegex),
        Validators.minLength(11),
        Validators.maxLength(11),
      ],
    }),
    employeeTIN: new FormControl("", {
      validators: [
        Validators.pattern(EmployeeUtils.CardIdRegex),
        Validators.minLength(10),
        Validators.maxLength(10),
      ],
    }),
    phonenumber: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/),
        Validators.minLength(11),
        Validators.maxLength(11),
      ],
    }),
    existingTaxId: new FormControl("", {
      validators: [Validators.minLength(11), Validators.maxLength(11)],
    }),
    designation: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern(EmployeeUtils.TextOnlyRegex),
        Validators.maxLength(40),
      ],
    }),
    homeaddress: new FormControl("", {
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(80),
      ],
    }),
    lgaCode: new FormControl("", {validators: [Validators.required]}),
    NSIRSTaxPayerID: new FormControl(""),
    CRA: new FormControl(""),
    taxYear: new FormControl(""),
  })

  ngOnInit(): void {
    console.log(this.injectedData)
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }

  closeModal() {
    this.dialogRef.close()
  }

  changeTinPhoneNinBvnStatus() {
    this.validateCacTin = false
  }

  calculateTotalIncome(event: any) {
    this.utilityService.calculateTotalIncome(this.addEmployeeForm)
  }

  calculateGrossIncome(event: any) {
    this.grossIncomeIncorrect = this.utilityService.calculateGrossIncome(
      this.addEmployeeForm
    )
  }

  getStateLocalGovts() {
    this.subs.add = this.employeeScheduleService
      .getStateLocalGovts()
      .subscribe((data) => {
        this.stateLocalGovts.set(data.data)
      })
  }

  getZipcodes() {
    this.subs.add = this.employeeScheduleService
      .getZipcodes()
      .subscribe((data) => {
        this.zipCodes.set(data.data)
      })
  }

  onSubmit() {
    const payload = {
      ...this.addEmployeeForm.value,
      businessRin: this.injectedData.businessRin,
      companyRin: this.injectedData.companyRin,
    } as Partial<AddEmployeeInterface>
    console.log(this.addEmployeeForm.value)
    if (this.addEmployeeForm.valid)
      this.subs.add = this.employeeScheduleService
        .addEmployee(payload as AddEmployeeInterface)
        .subscribe({
          next: (res) => {
            window.location.reload()
          },
          error: (err) => {
            this.snackBar.open(err.message, "close", {duration: 2000})
          },
        })
  }
}
