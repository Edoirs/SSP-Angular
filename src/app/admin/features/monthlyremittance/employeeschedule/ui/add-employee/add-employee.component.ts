import {
  ChangeDetectionStrategy,
  Component,
  effect,
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
import Swal from "sweetalert2"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import {combineLatest, forkJoin, Observable, of, Subject} from "rxjs"

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

  loading = signal(false)
  message = signal("")

  totalOtherIncome = signal(0)
  totalGrossIncome = signal(0)
  checkTotal$ = new Subject<boolean>()

  grossIncomeIncorrect!: boolean
  validateCacTin!: boolean

  stateLocalGovts = signal<{lganame: string; lgaid: string}[] | null>(null)
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
    jtbtn: new FormControl("0", {
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
    // employeeTIN: new FormControl("", {
    //   validators: [
    //     Validators.pattern(EmployeeUtils.CardIdRegex),
    //     Validators.minLength(10),
    //     Validators.maxLength(10),
    //   ],
    // }),
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
        Validators.minLength(3),
        Validators.maxLength(150),
      ],
    }),
    lgaCode: new FormControl("", {validators: [Validators.required]}),
    NSIRSTaxPayerID: new FormControl(""),
    // CRA: new FormControl(""),
    // taxYear: new FormControl(""),
  })

  constructor() {
    this.checkTotalIncome()
  }

  ngOnInit(): void {
    this.getStateLocalGovts()
    this.groupComputations()
  }

  ngOnDestroy(): void {
    this.subs.clear()
  }

  closeModal() {
    this.dialogRef.close()
  }

  get basic() {
    return this.addEmployeeForm.get("basic")
  }

  get rent() {
    return this.addEmployeeForm.get("rent")
  }

  get transport() {
    return this.addEmployeeForm.get("transport")
  }

  get otherIncome() {
    return this.addEmployeeForm.get("otherIncome")
  }

  get pension() {
    return this.addEmployeeForm.get("pension")
  }
  get nhf() {
    return this.addEmployeeForm.get("nhf")
  }
  get nhis() {
    return this.addEmployeeForm.get("nhis")
  }
  get LifeAssurance() {
    return this.addEmployeeForm.get("lifeAssurance")
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
      .subscribe({
        next: (res) => {
          if (res.status) return this.stateLocalGovts.set(res.data)
          Swal.fire(SweetAlertOptions(res?.message))
        },
        error: (err) => {
          Swal.fire(SweetAlertOptions(err?.message || err?.error?.message))
        },
      })
  }

  getZipcodes() {
    this.subs.add = this.employeeScheduleService.getZipcodes().subscribe({
      next: (res) => {
        if (res.status) return this.zipCodes.set(res.data)
        Swal.fire(SweetAlertOptions(res?.message))
      },
      error: (err) => {
        Swal.fire(SweetAlertOptions(err?.message || err?.error?.message))
      },
    })
  }

  sumTotalIncome() {
    this.subs.add = combineLatest({
      basic: this.basic!.valueChanges || of(0),
      rent: this.rent!.valueChanges || of(0),
      transport: this.transport!.valueChanges || of(0),
      otherIncome: this.otherIncome!.valueChanges || of(0),
    }).subscribe(({basic, rent, transport, otherIncome}) => {
      const sum =
        parseInt(<string>basic) +
        parseInt(<string>rent) +
        parseInt(<string>transport) +
        parseInt(<string>otherIncome)
      this.totalOtherIncome.set(sum)
    })
  }

  sumGrossIncome() {
    this.subs.add = combineLatest({
      pension: this.pension!.valueChanges || of(0),
      nhf: this.nhf!.valueChanges || of(0),
      nhis: this.nhis!.valueChanges || of(0),
      LifeAssurance: this.LifeAssurance!.valueChanges || of(0),
      checkTotalIncome: this.checkTotal$,
    }).subscribe(({pension, nhf, nhis, LifeAssurance}) => {
      const sum =
        this.totalOtherIncome() +
        parseInt(<string>pension) +
        parseInt(<string>nhf) +
        parseInt(<string>nhis) +
        parseInt(<string>LifeAssurance)
      this.totalGrossIncome.set(sum)
    })
  }

  groupComputations() {
    this.sumTotalIncome()
    this.sumGrossIncome()
  }

  checkTotalIncome = () =>
    effect(
      () => {
        if (this.totalOtherIncome()) {
          this.checkTotal$.next(true)
        }
      },
      {
        allowSignalWrites: true,
      }
    )

  onSubmit() {
    const payload = {
      ...this.addEmployeeForm.value,
      businessRin: this.injectedData.businessRin,
      companyRin: this.injectedData.companyRin,
    } as Partial<AddEmployeeInterface>
    if (this.addEmployeeForm.valid)
      this.subs.add = this.employeeScheduleService
        .addEmployee(payload as AddEmployeeInterface)
        .subscribe({
          next: (res) => {
            if (res.status) return window.location.reload()
            Swal.fire(SweetAlertOptions(res?.message))
          },
          error: (err) => {
            Swal.fire(SweetAlertOptions(err?.message || err?.error?.message))
          },
        })
  }
}
