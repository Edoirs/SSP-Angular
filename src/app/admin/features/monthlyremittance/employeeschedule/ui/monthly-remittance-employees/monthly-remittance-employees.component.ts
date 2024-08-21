import {ChangeDetectionStrategy, Component, inject} from "@angular/core"

@Component({
  selector: "app-monthly-remittance-employees",
  templateUrl: "./monthly-remittance-employees.component.html",
  styleUrl: "./monthly-remittance-employees.component.css",
  standalone: true,
  imports: [],
  providers: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthlyRemittanceEmployees {
  closeModal() {}
  //   initialiseAddForm() {
  //     // this.ngxService.start();
  //     this.addEmployeeForm = this.formBuilder.group({
  //       emailAddress: [
  //         "",
  //         [
  //           Validators.required,
  //           Validators.maxLength(45),
  //           Validators.email,
  //           Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
  //         ],
  //       ],
  //       zipCode: ["", [Validators.required]],
  //       nationality: [
  //         "Nigerian",
  //         [Validators.required, Validators.pattern(this.textOnlyRegex)],
  //       ],
  //       startMonthId: ["01", Validators.required],
  //       NHF: ["0", [Validators.pattern(this.validatorRegex)]],
  //       NHIS: ["0", [Validators.pattern(this.validatorRegex)]],
  //       // CRA: ["0", [Validators.pattern(/^(\d{1,17}|\d{0,17}\.\d{1,3})$/)]],
  //       pension: ["0", [Validators.pattern(this.validatorRegex)]],
  //       grossIncome: [
  //         "",
  //         [Validators.required, Validators.pattern(this.validatorRegex)],
  //       ],
  //       totalIncome: [
  //         "",
  //         [Validators.required, Validators.pattern(this.validatorRegex)],
  //       ],
  //       basicIncome: [
  //         "0",
  //         [Validators.required, Validators.pattern(this.validatorRegex)],
  //       ],
  //       rent: [
  //         "0",
  //         [
  //           // Validators.required,
  //           Validators.pattern(this.validatorRegex),
  //         ],
  //       ],
  //       transport: [
  //         "0",
  //         [
  //           // Validators.required,
  //           Validators.pattern(this.validatorRegex),
  //         ],
  //       ],
  //       otherIncome: [
  //         "0",
  //         [
  //           // Validators.required,
  //           Validators.pattern(this.validatorRegex),
  //         ],
  //       ],
  //       lifeAssurance: ["0", [Validators.pattern(this.validatorRegex)]],
  //       bvn: [
  //         "",
  //         [
  //           Validators.pattern(this.cardIdRegex),
  //           Validators.minLength(11),
  //           Validators.maxLength(11),
  //         ],
  //       ],
  //       nin: [
  //         "",
  //         [
  //           Validators.pattern(this.cardIdRegex),
  //           Validators.minLength(11),
  //           Validators.maxLength(11),
  //         ],
  //       ],
  //       employeeTIN: [
  //         "",
  //         [
  //           Validators.pattern(this.cardIdRegex),
  //           Validators.minLength(10),
  //           Validators.maxLength(10),
  //         ],
  //       ],
  //       phoneNumber: [
  //         "",
  //         [
  //           Validators.required,
  //           Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/),
  //           Validators.minLength(11),
  //           Validators.maxLength(11),
  //         ],
  //       ],
  //       existingTaxId: ["", [Validators.minLength(11), Validators.maxLength(11)]], //Not reuired for edit action
  //       firstName: [
  //         "",
  //         [
  //           Validators.required,
  //           Validators.pattern(this.textOnlyRegex),
  //           Validators.maxLength(30),
  //         ],
  //       ],
  //       surname: [
  //         "",
  //         [
  //           Validators.required,
  //           Validators.pattern(this.textOnlyRegex),
  //           Validators.maxLength(30),
  //         ],
  //       ],
  //       otherName: [
  //         "",
  //         [
  //           // Validators.required,
  //           Validators.pattern(this.textOnlyRegex),
  //           Validators.maxLength(30),
  //         ],
  //       ],
  //       titleId: ["", Validators.required],
  //       designation: [
  //         "",
  //         [
  //           Validators.required,
  //           Validators.pattern(this.textOnlyRegex),
  //           Validators.maxLength(40),
  //         ],
  //       ],
  //       contactAddress: [
  //         "",
  //         [
  //           Validators.required,
  //           Validators.minLength(10),
  //           Validators.maxLength(80),
  //         ],
  //       ],
  //       localGovernmentId: ["", Validators.required],

  //       NSIRSTaxPayerID: [""], //existingTaxId can replace this.
  //       CRA: [""], //Added to fix bug on calculateGrossIncome() in util service.
  //       taxYear: [""], //Required for edit action
  //     })

  //     // this.ngxService.stop();
  //   }

  viewAddEmployee(modal: any) {
    // this.showModal(modal)
    // this.initialiseAddForm()
  }

  showModal(modal: any) {
    // this.modalService.open(modal, this.modalOptions).result.then(
    //   (result) => {
    //     this.closeResult = `Closed with: ${result}`
    //   },
    //   (reason) => {
    //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
    //   }
    // )
  }
}
