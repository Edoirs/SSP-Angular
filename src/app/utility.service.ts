import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Injectable } from '@angular/core';
import {environment} from "./../environments/environment"
import {HttpClient} from "@angular/common/http"

@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  apiUrl: any;
  taxTaxOffices: any;
  businessCategorData: any;
  businessSectorData: any;
  businessOperationData: any;
  businessStructureData: any;
  businessSubsectorData: any;
  businessTypeData: any;
  economicActivityData: any;
  genderData: any;
  localGovernmentsData: any;
  nationalityData: any;
  taxOfficesData: any;
  titleData: any;
  zoneData: any;

  constructor(
    private httpClient: HttpClient,
    private ngxService: NgxUiLoaderService
  ) {
    this.getTaxOffices();
  }

  getBusinessCategory() {
    this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "Utility/get-business-category";

    this.httpClient.get<any>(this.apiUrl).subscribe((data) => {
      // console.log("businessCategorData: ", data);
      this.businessCategorData = data.data == null ? [] : data.data
      this.ngxService.stop()
    });
  }

  getBusinessSector() {
    this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "Utility/get-business-Sector";

    this.httpClient.get<any>(this.apiUrl).subscribe((data) => {
      // console.log("businessSectorData: ", data);
      this.businessSectorData = data.data == null ? [] : data.data
      this.ngxService.stop()
    });
  }

  getBusinessOperation() {
    this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "Utility/get-business-operation";

    this.httpClient.get<any>(this.apiUrl).subscribe((data) => {
      // console.log("businessOperationData: ", data);
      this.businessOperationData = data.data == null ? [] : data.data
      this.ngxService.stop()
    });
  }

  getBusinessStructure() {
    this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "Utility/get-business-structure";

    this.httpClient.get<any>(this.apiUrl).subscribe((data) => {
      // console.log("businessStructureData: ", data);
      this.businessStructureData = data.data == null ? [] : data.data
      this.ngxService.stop()
    });
  }

  getBusinessSubsector() {
    this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "get-business-subsector";

    this.httpClient.get<any>(this.apiUrl).subscribe((data) => {
      // console.log("businessSubsectorData: ", data);
      this.businessSubsectorData = data.data == null ? [] : data.data
      this.ngxService.stop()
    });
  }

  getBusinessType() {
    this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "Utility/get-business-type";

    this.httpClient.get<any>(this.apiUrl).subscribe((data) => {
      // console.log("businessTypeData: ", data);
      this.businessTypeData = data.data == null ? [] : data.data
      this.ngxService.stop()
    });
  }

  getEconomicActivity() {
    this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "Utility/get-economic-activity";

    this.httpClient.get<any>(this.apiUrl).subscribe((data) => {
      // console.log("economicActivityData: ", data);
      this.economicActivityData = data.data == null ? [] : data.data
      this.ngxService.stop()
    });
  }

  getGender() {
    this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "Utility/get-gender";

    this.httpClient.get<any>(this.apiUrl).subscribe((data) => {
      // console.log("genderData: ", data);
      this.genderData = data.data == null ? [] : data.data
      this.ngxService.stop()
    });
  }

  getLocalGovernments() {
    this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "Utility/get-lga";

    this.httpClient.get<any>(this.apiUrl).subscribe((data) => {
      // console.log("localGovernmentsData: ", data);
      this.localGovernmentsData = data.data == null ? [] : data.data
      this.ngxService.stop()
    });
  }

  getNationality() {
    this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "Utility/get-nationality";

    this.httpClient.get<any>(this.apiUrl).subscribe((data) => {
      // console.log("nationalityData: ", data);
      this.nationalityData = data.data == null ? [] : data.data
      this.ngxService.stop()
    });
  }

  getTaxOffices() {
    this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "Utility/get-tax-office";

    this.httpClient.get<any>(this.apiUrl).subscribe((data) => {
      // console.log("taxOfficesData: ", data);
      this.taxOfficesData = data.data == null ? [] : data.data
      this.ngxService.stop()
    });
  }

  getTitles() {
    this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "Utility/get-title";

    this.httpClient.get<any>(this.apiUrl).subscribe((data) => {
      // console.log("titleData: ", data);
      this.titleData = data.data == null ? [] : data.data
      this.ngxService.stop()
    });
  }

  getZones() {
    this.ngxService.start();
    this.apiUrl = environment.AUTHAPIURL + "Utility/get-zone";

    this.httpClient.get<any>(this.apiUrl).subscribe((data) => {
      // console.log("zoneData: ", data);
      this.zoneData = data.data == null ? [] : data.data
      this.ngxService.stop()
    });
  }

  calculateGrossIncome(addEmployeeForm: any) {
    let nhis = Number(addEmployeeForm.get("NHIS").value);
    let nhf = Number(addEmployeeForm.get("NHF").value);
    let pension = Number(addEmployeeForm.get("pension").value);
    let totalIncome = Number(addEmployeeForm.get("totalIncome").value);

    let lifeAssurance = Number(addEmployeeForm.get("lifeAssurance").value);

    let grossIncome = totalIncome - (pension + nhis + nhf + lifeAssurance);
    grossIncome = this.numRound(grossIncome);
    addEmployeeForm.controls["grossIncome"].setValue(grossIncome);

    // check if gross income is correct
    let grossIncomeIncorrect;
    grossIncome <= 0
      ? (grossIncomeIncorrect = true)
      : (grossIncomeIncorrect = false);

    // calculate CRA
    let cra = grossIncome * 0.2 + 16666.667;
    let cra1 = grossIncome * 0.2 + 0.01 * grossIncome;

    let approxCra = Math.round((cra + Number.EPSILON) * 100) / 100;
    let approxCra1 = Math.round((cra1 + Number.EPSILON) * 100) / 100;

    if (approxCra > approxCra1) {
      addEmployeeForm.controls["CRA"].setValue(approxCra);
    } else {
      addEmployeeForm.controls["CRA"].setValue(approxCra1);
    }

    return grossIncomeIncorrect;
  }

  calculateTotalIncome(addEmployeeForm: any) {
    let basicIncome = Number(addEmployeeForm.get("basicIncome").value);
    let rent = Number(addEmployeeForm.get("rent").value);
    let transport = Number(addEmployeeForm.get("transport").value);
    let otherIncome = Number(addEmployeeForm.get("otherIncome").value);
    let totalIncome = basicIncome + rent + transport + otherIncome;
    totalIncome = this.numRound(totalIncome);
    addEmployeeForm.controls["totalIncome"].setValue(totalIncome);

    this.calculateGrossIncome(addEmployeeForm);
  }

  calculateTotalIncomeDA(declarationForm: any) {
    let bi = Number(declarationForm.get("businessIncome").value);
    let ei = Number(declarationForm.get("employmentIncome").value);
    let cf = Number(declarationForm.get("professionalFee").value);
    let oi = Number(declarationForm.get("otherIncome").value);
    let df = Number(declarationForm.get("directorFees").value);

    let bk = Number(declarationForm.get("benefit").value);
    let tb = Number(declarationForm.get("terminalBonus").value);
    let co = Number(declarationForm.get("contract").value);
    let al = Number(declarationForm.get("allowance").value);
    let ps = Number(declarationForm.get("profitSharing").value);

    let cm = Number(declarationForm.get("commission").value);
    let int = Number(declarationForm.get("interest").value);
    let ro = Number(declarationForm.get("royalty").value);
    let re = Number(declarationForm.get("rent").value);
    let bc = Number(declarationForm.get("balancingCharge").value);

    let totalIncome =
      bi + ei + cf + oi + df + bk + tb + co + al + ps + cm + int + ro + re + bc;
    declarationForm.controls["totalIncome"].setValue(totalIncome);
  }

  calculateGrossIncomeDA(reliefForm: any, declarationForm: any) {
    let nhis = Number(reliefForm.get("nhis").value);
    let nhf = Number(reliefForm.get("nhf").value);
    let la = Number(reliefForm.get("lifeAssurance").value);
    let pension = Number(reliefForm.get("nps").value);
    let totalIncome = Number(declarationForm.get("totalIncome").value);

    let grossIncome = totalIncome - (pension + nhis + nhf + la);
    reliefForm.controls["grossIncome"].setValue(grossIncome);

    // check if gross income is correct
    let grossIncomeIncorrectDA;
    grossIncome <= 0
      ? (grossIncomeIncorrectDA = true)
      : (grossIncomeIncorrectDA = false);

    // calculate CRA
    let cra = grossIncome * 0.2 + 200000;
    let cra1 = grossIncome * 0.21;
    let approxCra = Math.round((cra + Number.EPSILON) * 100) / 100;
    let approxCra1 = Math.round((cra1 + Number.EPSILON) * 100) / 100;

    if (approxCra > approxCra1) {
      reliefForm.controls["consolidateRelief"].setValue(approxCra);
    } else {
      reliefForm.controls["consolidateRelief"].setValue(approxCra1);
    }

    return grossIncomeIncorrectDA;
  }

  calculateAnnualGross(selectedForm: any) {
    let bi = Number(selectedForm.get("rent").value);
    let ei = Number(selectedForm.get("transport").value);
    let cf = Number(selectedForm.get("basicIncome").value);
    let oi = Number(selectedForm.get("otherIncome").value);

    let totalIncome = bi + ei + cf + oi;
      selectedForm.controls["annualGrossIncome"].setValue(totalIncome);
  }

  getTaxOfficeById(taxOfficeId: any) {
    if (taxOfficeId == null) {
      return "NOT UNDER ANY TAX OFFICE";
    }
    var taxOffice = this.taxTaxOffices.filter((x: any) => x.id == taxOfficeId)[0]
      ?.name;
    return taxOffice;
  }

  // getTaxOffices() {
  //   this.apiUrl = environment.AUTHAPIURL + "tax-offices";

  //   this.httpClient.get<any>(this.apiUrl).subscribe((data: any) => {
  //     console.log("taxTaxOffices: ", data);
  //     this.taxTaxOffices = data.response;
  //   });
  // }

  calculateAmountTaxDue(totalIncome: number) {
    // let totalIncome = Number(reassessmentForm.get('estimatedTotalIncome').value);
    let grossIncome = totalIncome - 0 // totalIncome equals grossIncome

    let cra = grossIncome * 0.2 + 200000
    let cra1 = grossIncome * 0.21
    let taxableIncome = 0
    let amountTaxDue = 0
    let taxableIncomeNet = 0

    if (cra > cra1) {
      taxableIncome = totalIncome - cra
    } else {
      taxableIncome = totalIncome - cra1
    }

    // console.log("taxableIncome: ", taxableIncome);

    if (taxableIncome > 0) {
      amountTaxDue += 300000 * 0.07
      taxableIncomeNet = taxableIncome - 300000
    }

    if (taxableIncomeNet > 0) {
      if (taxableIncomeNet - 300000 < 0) {
        amountTaxDue += taxableIncomeNet * 0.11
      } else {
        amountTaxDue += 300000 * 0.11
      }

      taxableIncomeNet = taxableIncomeNet - 300000
    }

    if (taxableIncomeNet > 0) {
      if (taxableIncomeNet - 500000 < 0) {
        amountTaxDue += taxableIncomeNet * 0.15
      } else {
        amountTaxDue += 500000 * 0.15
      }

      taxableIncomeNet = taxableIncomeNet - 500000
    }

    if (taxableIncomeNet > 0) {
      if (taxableIncomeNet - 500000 < 0) {
        amountTaxDue += taxableIncomeNet * 0.19
      } else {
        amountTaxDue += 500000 * 0.19
      }

      taxableIncomeNet = taxableIncomeNet - 500000
    }

    if (taxableIncomeNet > 0) {
      if (taxableIncomeNet - 1600000 < 0) {
        amountTaxDue += taxableIncomeNet * 0.21
      } else {
        amountTaxDue += 1600000 * 0.21
      }

      taxableIncomeNet = taxableIncomeNet - 1600000
    }

    if (taxableIncomeNet > 0) {
      // console.log("amountTaxDue5: ", amountTaxDue);
      amountTaxDue += taxableIncomeNet * 0.24
    }

    let amountTaxDue1 = totalIncome * 0.01
    amountTaxDue = this.roundUpToTwoDecimalPlaces(amountTaxDue)
    amountTaxDue1 = this.roundUpToTwoDecimalPlaces(amountTaxDue1)

    if (amountTaxDue > amountTaxDue1) {
      // reassessmentForm.controls['annualTaxDue'].setValue(amountTaxDue);
      return amountTaxDue
    } else {
      // reassessmentForm.controls['annualTaxDue'].setValue(amountTaxDue1);
      return amountTaxDue1
    }
  }

  computeTaxDue(amount: number, percentageTax: number = 7) {
    return this.roundUpToTwoDecimalPlaces(amount * (percentageTax / 100));
  }

  roundUpToTwoDecimalPlaces(value: number) {
    let test = Math.round((value + Number.EPSILON) * 100) / 100;
    return test;
  }

  prependZero(value: string): string {
    let newValue = value;
    if (value) {
      if (newValue.length < 11) newValue = "0" + newValue;
    }

    return newValue;
  }

  yearList(earliestYear: number = 1970): Array<number> {
    let yearList = [];

    let currentYear = new Date().getFullYear();
    let earliestYr = earliestYear;

    while (currentYear >= earliestYr) {
      yearList.push(currentYear);
      currentYear -= 1;
    }
    return yearList;
  }

  validFileExtension(files: Array<any>, extensions: Array<string> = ["png", "jpg", "jpeg"]): boolean {
    let validExtension = true;

    for (let i = 0; i < files.length; i++) {
      const name = files[i].name
      const ext = name.slice(((name.lastIndexOf(".") - 1) >>> 0) + 2)
      // console.log(ext);

      if (!extensions.includes(ext)) {
        validExtension = false
        // exit;
      }
    }

    return validExtension;
  }

  numRound(num: number, round = 2): number {
    return Math.round((num + Number.EPSILON) * 100) / 100; //approximates to 2 decimal places.
    // return Number(Number(num).toFixed(round));//Fix to 2 decimal places without approximation.
    // return Number(num) != NaN && Number(num).toFixed(round);
    // return Number(this.decimalPipe.transform(num, format));
  }

  slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
  }

}
