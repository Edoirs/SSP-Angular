import {NgClass} from "@angular/common"
import {
  Component,
  effect,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
} from "@angular/core"
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms"
import {SubscriptionHandler} from "@shared/utils/subscription-handler.utils"
import {
  AdminChangePasswordInterface,
  AdminCreateUserInterface,
} from "src/app/auth/data-access/auth.models"

@Component({
  selector: "app-add-user-form",
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: "./add-user-form.component.html",
  styleUrl: "./add-user-form.component.scss",
})
export class AddUserFormComponent implements OnInit, OnDestroy {
  isRegisterSent = input.required()
  adminSignUpEvent = output<AdminCreateUserInterface>()
  otpSignUpEvent = output<AdminChangePasswordInterface>()
  message = input("")

  adminSignUpForm = new FormGroup({
    email: new FormControl("", {
      validators: [Validators.required, Validators.email],
    }),
    userRole: new FormControl("", {
      validators: [Validators.required],
    }),
  })

  get adminEmail() {
    return this.adminSignUpForm.get("email")
  }

  get adminRole() {
    return this.adminSignUpForm.get("userRole")
  }

  subs = new SubscriptionHandler()

  constructor() {
    effect(() => {
      if (this.isRegisterSent()) {
        this.adminSignUpForm.reset()
        this.adminRole?.setValue("")
      }
    })
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subs.clear()
  }

  onAdminSubmit() {
    if (this.adminSignUpForm.valid) {
      const payload = {
        email: this.adminEmail?.value as string,
        userRole: this.adminRole?.value as string,
      } as AdminCreateUserInterface

      this.adminSignUpEvent.emit(payload)
    }
  }
}
