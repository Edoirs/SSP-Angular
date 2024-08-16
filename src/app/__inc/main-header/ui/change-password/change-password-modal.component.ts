import {Component, ChangeDetectionStrategy, signal} from "@angular/core"
import {MatFormFieldModule} from "@angular/material/form-field"
import {MatIconModule} from "@angular/material/icon"
import {MatInputModule} from "@angular/material/input"
import {MatButtonModule} from "@angular/material/button"
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms"

@Component({
  selector: "app-change-password-modal",
  templateUrl: "./change-password-modal.component.html",
  styleUrl: "./change-password-modal.component.scss",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordModalComponent {
  showPassword = signal(false)
  showRepeatPassword = signal(false)

  changePasswordForm = new FormGroup({
    otp: new FormControl("", {validators: [Validators.required]}),
    new_password: new FormControl("", {validators: [Validators.required]}),
    repeat_password: new FormControl("", {validators: [Validators.required]}),
  })

  onSubmit() {
    console.log(this.changePasswordForm.value)
  }
}
