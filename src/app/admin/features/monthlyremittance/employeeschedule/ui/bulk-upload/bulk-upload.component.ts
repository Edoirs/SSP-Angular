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
import Swal from "sweetalert2"
import {UtilityService} from "src/app/utility.service"
import {environment} from "@environment/environment"
import {Router} from "@angular/router"
import {BusinessesResInterface} from "../../data-access/employee-schedule.model"
import {SweetAlertOptions} from "@shared/utils/sweet-alert.utils"
import {timer} from "rxjs"

@Component({
  selector: "app-bulk-upload",
  templateUrl: "./bulk-upload.component.html",
  styleUrl: "./bulk-upload.component.css",
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, MatDialogClose],
  providers: [EmployeeScheduleService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BulkUploadComponent implements OnInit, OnDestroy {
  private readonly dialogRef = inject(MatDialogRef<EmployeescheduleComponent>)
  private readonly injectedData =
    inject<BusinessesResInterface>(MAT_DIALOG_DATA)
  private readonly employeeScheduleService = inject(EmployeeScheduleService)
  private readonly utilityService = inject(UtilityService)
  private readonly router = inject(Router)

  file = signal<File | null>(null)
  filePath = signal("")

  loading = signal(false)
  message = signal("")

  columnError = signal<string[]>([])

  sampleFile = signal(
    `${environment.SAMPLE_FILE_URL}employee-schedule-template.xlsx`
  )

  subs = new SubscriptionHandler()

  uploadForm = new FormGroup({
    file: new FormControl("", {validators: [Validators.required]}),
  })

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subs.clear()
  }

  reloadWindow() {
    return timer(3000).subscribe(() => {
      window.location.reload()
    })
  }

  onFileChange(event: any) {
    //Validate file extension
    if (
      !this.utilityService.validFileExtension(event.target?.files, [
        "xls",
        "xlsx",
      ])
    ) {
      Swal.fire({
        icon: "error",
        title: "Invalid file(s) extension",
        text: "Selected file(s) not supported.",
        showConfirmButton: true,
        timer: 25000,
      })
      return false
    }

    if (event?.target?.files?.length > 0) {
      const file = event.target?.files[0]
      this.file.set(event.target?.files[0])
      this.filePath.set(event.target.files[0]?.name)
      // this.uploadForm.get("file")?.setValue(file)
    }
    return true
  }

  onSubmit() {
    if (this.uploadForm.invalid) return

    const formData = new FormData()
    formData.append("file", this.file() as File)
    formData.append("BusinessId", this.injectedData.businessId.toString())
    formData.append("CompanyId", this.injectedData.companyId.toString())

    if (this.file()) {
      this.loading.set(true)
      this.subs.add = this.employeeScheduleService
        .bulkEmployeeUpload(formData)
        .subscribe({
          next: (res) => {
            if (res.status == true) {
              this.loading.set(false)
              this.file.set(null)
              this.uploadForm.reset()
              this.subs.add = this.reloadWindow()
              if (res.message === "0 Employees created; 0 updated.") {
                Swal.fire(
                  SweetAlertOptions("Confirm the file content and try again")
                )
              } else {
                this.subs.add = this.reloadWindow()
                Swal.fire(SweetAlertOptions(res?.message, true))
                this.router.navigate(["/admin", "employee-schedule"])
              }
            } else {
              this.loading.set(false)
              if (res.response == null) {
                Swal.fire(SweetAlertOptions(res?.message))
              }
            }
          },
          error: (err) => {
            this.loading.set(false)
            console.error(err)
            Swal.fire(
              SweetAlertOptions(
                err?.message ||
                  err?.error?.message ||
                  err?.error?.error?.message
              )
            )
          },
          complete: () => {
            this.loading.set(false)
          },
        })
    }
  }
}
