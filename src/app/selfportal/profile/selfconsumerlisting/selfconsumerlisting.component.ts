import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from 'src/app/common.service';
import { SessionService } from 'src/app/session.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-selfconsumerlisting',
  templateUrl: './selfconsumerlisting.component.html',
  styleUrls: ['./selfconsumerlisting.component.css']
})
export class SelfconsumerlistingComponent implements OnInit {
  apiUrl: string | undefined;
  config: any
  currentPageLength: any = 10;
  title = 'angulardatatables';
  dtOptions: any = {};
  closeResult: string = '';
  submitted!: boolean
  modalOptions!: NgbModalOptions;
  dtOptionsPopUp1: any = {};
  dtOptions2: any = {};
  activeTab: any;
  consumerData: any;
  minDate: any;
  date: any;
  bill: any
  titlesData: any;
  genderData: any;
  countriesData: any;
  statesData: any;
  localGovtData: any;
  maritalStatusData: any;
  occupationData: any;
  companyTypeData: any;
  industrySector: any;
  niswacdetails: any;
  approvalstatus: any;
  consumerDetailsForm!: FormGroup
  viewDetailsform!: FormGroup
  selectedConsumerId: any;
  consumercatgryTypes: any;

  billingCycle: any;
  modifiedDate: any;
  modifiedMin: any;
  singleConsumerData: any;
  billGroup: any;
  distData: any;
  niswasecDetailsData: any;
  zoneData: any;
  roundData: any;
  subtariffTypes: any;
  tariffTypes: any;
  connectionStatus: any;
  consumerSubCategory: any;

  consumerProfileId: any;
  calculateBillForm!: FormGroup
  submitCalculate!: boolean
  calculateBillData: any;
  billCalculated:boolean = false;

  constructor(private modalService: NgbModal,
    private httpClient: HttpClient, public datepipe: DatePipe,
    private router: Router, private sess: SessionService,
    private ngxService: NgxUiLoaderService, private waterService: CommonService,
    private route: ActivatedRoute, private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.sess.isCustomer();
    this.activeTab = 'consumerDetails';
    this.intialiseTableProperties();
    this.initialiseConsumerdetailsForms();
    this.initialiseDetailsForms();

    this.getTitle();
    this.getCountries();
    this.getState();
    this.getGender();
    this.getConsumer();
    this.getLocalGovernment();
    this.getMaritalStatus();
    this.getOccupations();
    this.getCompanyType();
    this.getIndustrySectors();
    this.getBillingCycles()
    this.getConsumerCategory();

    let dte = new Date();
    this.modifiedDate = dte.setFullYear(dte.getFullYear() - 15);
    this.date = this.datepipe.transform(this.modifiedDate, "yyyy-MM-dd");
    this.modifiedMin = dte.setFullYear(1900, 1, 1),
      this.minDate = this.datepipe.transform(this.modifiedMin, "yyyy-MM-dd");
  }

  initialiseConsumerdetailsForms() {
    this.consumerDetailsForm = this.formBuilder.group({
      taxpayerReference: [""],
      emailAddress: [""],
      title: [""],
      firstName: [""],
      middleName: [""],
      lastName: [""],
      dateOfBirth: [""],
      occupation: [""],
      companyName: [""],
      gender: [""],
      maritalStatus: [""],
      companyAddress: [""],
      phoneNumber: [""],
      countryId: [""],
      stateId: [""],
      localGovtId: [""],
      mode: [""],
      consumercategory: [""],
      consumerSubcategory: [""],
      address: [""],
      industrySector: [""],
      bvn: [""],
      tin: [""],
      nin: [""],
      cac: [""],
      companyType: [""]
    });
  }
  initialisePrePaidCalculateForms() {
    this.calculateBillForm = this.formBuilder.group({
      amount: ["", [
        Validators.required
      ]],
    });
  }
  initialiseDetailsForms() {
    this.viewDetailsform = this.formBuilder.group({
      billingCycle: [],
      meterNumber: [],
      connectionStatus: [],
      approvalstatus: [],
      address: [],
      consumercategory: [],
      consumerSubcategory: [],
      zone: [],
      contractReference: [],
      localGovtId: [],
      district: [],
      tariff: [],
      subtariff: [],
      round: [],
      billGroup: [],
    });
  }

  intialiseTableProperties() {
    this.modalOptions = {
      backdrop: true,
      centered: true,
      backdropClass: "customBackdrop",
      size: "xl",
    };
    this.dtOptionsPopUp1 = {
      paging: false,
      pagingType: "full_numbers",
      responsive: true,
      pageLength: 5,
      lengthMenu: [5, 10, 30, 50, 100],
      lengthChange: false,
      processing: false,
      ordering: false,
      info: false,
      searching: false,
    };
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      paging: false,
      responsive: true,
      lengthChange: false,
      ordering: false,
      searching: false,
      info: false,
    };
    this.dtOptions2 = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      paging: false,
      responsive: true,
      lengthChange: false,
      ordering: false,
      info: false,
      language: { search: "", searchPlaceholder: "Search Records" },
      dom:
        "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>" +
        "<'row'<'col-sm-12 table-responsive'tr>>" +
        "<'row'<'col-sm-5'i><'col-sm-7'p>>",
      buttons: [
        {
          extend: "csv",
          className: "btn btn-primary font-12 export-btn mb-4",
          text: '<i class="fas fa-file-csv"> CSV</i>',
          exportOptions: { columns: [0, 1, 2, 3, 4] },
        },
        {
          extend: "excel",
          className: "btn btn-primary font-12 export-btn mb-4",
          text: '<i class="fas fa-file-excel"> Excel</i>',
          exportOptions: { columns: [0, 1, 2, 3, 4] },
        },
        {
          extend: 'pdf',
          className: 'btn btn-outline-dark',
          text: '<i class="fas fa-file-pdf"> PDF</i>',
          orientation: 'landscape',
          pageSize: 'LEGAL',
        }
      ],
    };
  }

  getTitle() {
    this.waterService.getTitles().subscribe((data: any) => { this.titlesData = data.response; },);
  }
  getCountries() {
    this.waterService.getCountries().subscribe((data: any) => { this.countriesData = data.response; },);
  }
  getState() {
    this.waterService.getState().subscribe((data: any) => { this.statesData = data.response; },);
  }
  getGender() {
    this.waterService.getGender().subscribe((data: any) => { this.genderData = data.response; },);
  }

  getLocalGovernment() {
    this.waterService.getLocalGovernment().subscribe((data: any) => { this.localGovtData = data.response; },);
  }

  getMaritalStatus() {
    this.waterService.getMaritalStatus().subscribe((data: any) => { this.maritalStatusData = data.response; },);
  }

  getOccupations() {
    this.waterService.getOccupations().subscribe((data: any) => { this.occupationData = data.response; },);
  }
  getCompanyType() {
    this.waterService.getCompanyType().subscribe((data: any) => { this.companyTypeData = data.response; },);
  }
  getIndustrySectors() {
    this.waterService.getIndustrySectors().subscribe((data: any) => { this.industrySector = data.response; },);
  }

  getConsumerCategory() {
    this.waterService.getConsumerCategory().subscribe((data: any) => { this.consumercatgryTypes = data.response; },);
  }

  getbillgroupsbyId(tariffTypeId: any, subTariffTypeId: any, billType: any) {
    this.waterService.getbillgroups(tariffTypeId, subTariffTypeId, billType).subscribe((data: any) => { this.billGroup = data.response; },);
  }
  getRoundData() {
    let zone = this.viewDetailsform.get('zone')!.value;
    this.waterService.getRound(zone).subscribe((data: any) => { this.roundData = data.response; },);
  }
  getSubTariffType() {
    this.waterService.getSubTariffType().subscribe((data: any) => { this.subtariffTypes = data.response; },);
  }
  getBillingCycles() {
    this.waterService.getBillingCycles().subscribe((data: any) => { this.billingCycle = data.response; },);
  }

  getDistrictsData() {
    let localGovernmentId = this.viewDetailsform.get('localGovtId')!.value;
    this.waterService.getDistricts(localGovernmentId).subscribe((data: any) => { this.distData = data.response; },);
  }
  getZoneData() {
    let district = this.viewDetailsform.get('district')!.value;
    this.waterService.getZone(district).subscribe((data: any) => { this.zoneData = data.response; },);
  }
  getTariffTypes() {
    this.waterService.getTariffTypes().subscribe((data: any) => { this.tariffTypes = data.response; },);
  }

  getConnectionStatus() {
    this.waterService.getConnectionStatus().subscribe((data: any) => { this.connectionStatus = data.response; },);
  }
  getApprovalStatus() {
    this.waterService.getApprovalStatus().subscribe((data: any) => { this.approvalstatus = data.response; },);
  }
  getConsumerSubCategory() {
    this.waterService.getConsumerSubCategory().subscribe((data: any) => { this.consumerSubCategory = data.response; },);
  }
  getConsumer() {
    this.ngxService.start();
    this.apiUrl = `${environment.AUTHAPIURL}self-portal/profile`;
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });

    this.httpClient
      .get<any>(this.apiUrl, { headers: reqHeader })
      .subscribe((data) => {
        this.consumerData = data.response.items;
        this.selectedConsumerId = data?.response?.consumer_details?.consumer_category_id;
        this.singleConsumerData = data.response.consumer_details;
        this.loadSelectedData(this.singleConsumerData);
        this.niswacdetails = data.response.consumer_profiles;
      });
    this.ngxService.stop();
  }


  loadSelectedData(singleConsumerData: any) {
    this.consumerDetailsForm = this.formBuilder.group({
      taxpayerReference: new FormControl({ value: singleConsumerData.taxpayer_reference, disabled: true }, [
        Validators.required
      ]),
      title: new FormControl({ value: singleConsumerData.title_id, disabled: true }, [
        Validators.required
      ]),
      firstName: new FormControl({ value: singleConsumerData.first_name, disabled: true }, [
        Validators.required
      ]),
      middleName: new FormControl({ value: singleConsumerData.middle_name, disabled: true }, [
        Validators.required
      ]),
      lastName: new FormControl({ value: singleConsumerData.last_name, disabled: true }, [
        Validators.required
      ]),
      emailAddress: new FormControl({ value: singleConsumerData.email, disabled: true }, [
        Validators.required
      ]),
      phoneNumber: new FormControl({ value: singleConsumerData.phone, disabled: true }, [
        Validators.required
      ]),
      gender: new FormControl({ value: singleConsumerData.gender_id, disabled: true }, [
        Validators.required
      ]),
      countryId: new FormControl({ value: singleConsumerData.nationality_id, disabled: true }, [
        Validators.required
      ]),
      stateId: new FormControl({ value: singleConsumerData.state_id, disabled: true }, [
        Validators.required
      ]),
      localGovtId: new FormControl({ value: singleConsumerData.local_government_id, disabled: true }, [
        Validators.required
      ]),
      dateOfBirth: new FormControl({
        value: this.datepipe.transform(singleConsumerData.date_of_birth,
          "yyyy-MM-dd"), disabled: true
      }, [Validators.required]),
      maritalStatus: new FormControl({ value: singleConsumerData.marital_status_id, disabled: true }, [
        Validators.required
      ]),
      occupation: new FormControl({ value: singleConsumerData.occupation_id, disabled: true }, [
        Validators.required
      ]),
      consumercategory: new FormControl({ value: singleConsumerData.consumer_category_id, disabled: true }, [
        Validators.required
      ]),
      consumerSubcategory: new FormControl({ value: singleConsumerData.consumer_sub_category_name, disabled: true }, [
        Validators.required
      ]),
      companyName: new FormControl({ value: singleConsumerData.company_name, disabled: true }, [
        Validators.required
      ]),
      companyAddress: new FormControl({ value: singleConsumerData.company_address, disabled: true }, [
        Validators.required
      ]),
      address: new FormControl({ value: singleConsumerData.address, disabled: true }, [
        Validators.required
      ]),
      industrySector: new FormControl({ value: singleConsumerData.industry_sector_id, disabled: true }, [
        Validators.required
      ]),

      companyType: new FormControl({ value: singleConsumerData?.company_type_id, disabled: true }),
      cac: new FormControl({ value: singleConsumerData.cac_number, disabled: true }),
      bvn: new FormControl({ value: singleConsumerData.bvn, disabled: true }),
      tin: new FormControl({ value: singleConsumerData.tin, disabled: true }),
      nin: new FormControl({ value: singleConsumerData.nin, disabled: true }),
    });
  }
  public setItemsPerPage($event: any) {
    this.config.itemsPerPage = $event;
    this.config.currentPage = 1;
    this.currentPageLength = this.config.itemsPerPage;
    this.router.navigate(["/selfprofilelisting"]);
    this.getConsumer();
  }
  consumerDetails(activeTab: string, $event: MouseEvent): void {
    $event.preventDefault();
    this.activeTab = activeTab;
  }

  niswasecDetails(activeTab: string, $event: MouseEvent): void {
    $event.preventDefault();
    this.activeTab = activeTab;
  }

  keyPressNumbersWithDecimal(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  viewNISWADetails(modal: any, selectedData: any) {
    this.getSubTariffType();
    this.getTariffTypes();
    this.getConnectionStatus();
    this.getConsumerSubCategory();
    this.getApprovalStatus();
    this.niswasecDetailsData = selectedData;
    this.viewDetailsform = this.formBuilder.group({
      billingCycle: new FormControl({ value: selectedData.billing_cycle_id, disabled: true }, [
        Validators.required
      ]),
      meterNumber: new FormControl({ value: selectedData.meter_number, disabled: true }, [
        Validators.required
      ]),
      connectionStatus: new FormControl({ value: selectedData.connection_status_id, disabled: true }, [
        Validators.required
      ]),
      approvalstatus: new FormControl({ value: selectedData.approval_status_id, disabled: true }, [
        Validators.required
      ]),
      zone: new FormControl({ value: selectedData.zone_id, disabled: true }, [
        Validators.required
      ]),
      address: new FormControl({ value: selectedData.connection_address, disabled: true }, [
        Validators.required
      ]),
      consumercategory: new FormControl({ value: selectedData.consumer_category_id, disabled: true }, [
        Validators.required
      ]),
      consumerSubcategory: new FormControl({ value: selectedData.consumer_sub_category_id, disabled: true }, [
        Validators.required
      ]),
      contractReference: new FormControl({ value: selectedData.contract_reference, disabled: true }, [
        Validators.required
      ]),
      district: new FormControl({ value: selectedData.district_id, disabled: true }, [
        Validators.required
      ]),
      localGovtId: new FormControl({ value: selectedData.local_government_id, disabled: true }, [
        Validators.required
      ]),
      tariff: new FormControl({ value: selectedData.tariff_type_id, disabled: true }, [
        Validators.required
      ]),
      subtariff: new FormControl({ value: selectedData.sub_tariff_type_id, disabled: true }, [
        Validators.required
      ]),
      round: new FormControl({ value: selectedData.round_id, disabled: true }, [
        Validators.required
      ]),
      billGroup: new FormControl({ value: selectedData.bill_group_id, disabled: true }, [
        Validators.required
      ]),
    });
    this.getbillgroupsbyId(selectedData.tariff_type_id, selectedData.sub_tariff_type_id, selectedData.bill_type_id)
    this.getDistrictsData();
    this.getZoneData();
    this.getRoundData();
    this.showModal(modal);
  }

  getBill(billCycle: any) {
    this.bill = this.billingCycle?.filter((i: any) => i.id == billCycle)[0].name;
    return this.bill;
  }

  viewCalculateBill(modal: any, selectedbillData: any) {
    this.initialisePrePaidCalculateForms();
    this.consumerProfileId = selectedbillData.id;
    this.submitCalculate = false;
    this.showModal(modal);
  }

  onCalculate(formAllData: any) {
    this.submitCalculate = true;
    if (this.calculateBillForm.invalid) {
      return;
    }
    if (formAllData.amount < 1000) {
      Swal.fire({
        icon: "error",
        title: "Oops..",
        text: "Amount must not be less than ₦ 1000",
        showConfirmButton: true,
        timer: 5000,
      });
      return;
    }
    let requestObj = {
      amount: formAllData.amount,
      profile_id: this.consumerProfileId
    };
    this.apiUrl = `${environment.AUTHAPIURL}self-portal/calculate-pre-paid`;

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("niswasec_access_token"),
    });

    this.ngxService.start();
    this.httpClient.post<any>(this.apiUrl, requestObj, { headers: reqHeader }).subscribe((data) => {
      this.calculateBillData = data.response;
      this.ngxService.stop();

      if (data.status == true) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message,
          showConfirmButton: true,
          timer: 5000,
        });
        this.initialisePrePaidCalculateForms();
        this.submitCalculate = false;
        this.billCalculated = true;
      }
      else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text:
            data.response != null && data.response[0] != undefined
              ? data.response[0].message
              : data.message,
          showConfirmButton: true,
          timer: 5000,
        });
        this.billCalculated = false;
      }
    });
  }

  generateBillForPrepaid(){
    let requestObj = {
      amount: this.calculateBillData.amount,
      profile_id: this.consumerProfileId
    };

    this.apiUrl = `${environment.AUTHAPIURL}self-portal/generate-bill-pre-paid`;

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("niswasec_access_token"),
    });

    this.ngxService.start();
    this.httpClient.post<any>(this.apiUrl, requestObj, { headers: reqHeader }).subscribe((data) => {
      this.ngxService.stop();

      if (data.status == true) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message,
          showConfirmButton: true,
          timer: 5000,
        });
        this.modalService.dismissAll();
        this.billCalculated = false;
        this.getConsumer();
      }
      else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text:
            data.response != null && data.response[0] != undefined
              ? data.response[0].message
              : data.message,
          showConfirmButton: true,
          timer: 5000,
        });
      }
    });
  }

  check(){
    this.billCalculated =false;
  }
  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  showModal(modal: any) {
    this.modalService.open(modal, this.modalOptions).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
  /**
  * Write code on Method
  *
  * @return response()
  */
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
