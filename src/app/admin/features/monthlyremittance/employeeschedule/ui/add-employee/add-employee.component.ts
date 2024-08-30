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
  private readonly injectedData = inject<any>(MAT_DIALOG_DATA)
  private readonly employeeScheduleService = inject(EmployeeScheduleService)
  private readonly utilityService = inject(UtilityService)

  loading = signal(false)
  message = signal("")

  grossIncomeIncorrect!: boolean
  validateCacTin!: boolean

  stateLocalGovts = signal<any>(null)
  zipCodes = signal<any>(null)

  subs = new SubscriptionHandler()

  addEmployeeForm = new FormGroup({
    emailAddress: new FormControl("", {
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
    startMonthId: new FormControl("01", {validators: [Validators.required]}),
    NHF: new FormControl("0", {
      validators: [Validators.pattern(EmployeeUtils.PositiveNumberRegex)],
    }),
    NHIS: new FormControl("0", {
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
    basicIncome: new FormControl("0", {
      validators: [
        Validators.required,
        Validators.pattern(EmployeeUtils.PositiveNumberRegex),
      ],
    }),
    rent: new FormControl("0", {
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
    phoneNumber: new FormControl("", {
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
    firstName: new FormControl("", {
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
    otherName: new FormControl("", {
      validators: [
        Validators.pattern(EmployeeUtils.TextOnlyRegex),
        Validators.maxLength(30),
      ],
    }),
    titleId: new FormControl("", {validators: [Validators.required]}),
    designation: new FormControl("", {
      validators: [
        Validators.required,
        Validators.pattern(EmployeeUtils.TextOnlyRegex),
        Validators.maxLength(40),
      ],
    }),
    contactAddress: new FormControl("", {
      validators: [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(80),
      ],
    }),
    localGovernmentId: new FormControl("", {validators: [Validators.required]}),
    NSIRSTaxPayerID: new FormControl(""),
    CRA: new FormControl(""),
    taxYear: new FormControl(""),
  })

  ngOnInit(): void {}

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
    console.log(this.addEmployeeForm.value)
  }
}
