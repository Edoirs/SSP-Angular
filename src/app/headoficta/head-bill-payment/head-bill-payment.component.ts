import { Component } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CommonService } from 'src/app/common.service';
import Swal from 'sweetalert2';
import { SessionService } from 'src/app/session.service';
@Component({
  selector: 'app-head-bill-payment',
  templateUrl: './head-bill-payment.component.html',
  styleUrls: ['./head-bill-payment.component.css']
})
export class HeadBillPaymentComponent {

  userId: any
  apiUrl: string | undefined;
  config: any
  configSettlement: any
  currentPageLength: any = 10;
  currentsettlePageLength: any = 10;
  title = 'angulardatatables';
  dtOptions: any = {};
  dtOptions3: any = {};
  closeResult: string = '';
  modalOptions!: NgbModalOptions;
  dtOptionsPopUp1: any = {};
  unpaidBillsData: any
  selectedBill: any;
  singleBillData: any;
  searchForm!: FormGroup
  consumerSubCategory: any;
  localGovtData: any;
  zoneData: any;
  distData: any;
  submitted!: boolean
  payLinkData:any
  selectedsubTariff: any;
  groupPaymentItemsForm!: FormGroup
  singleInvoice: any;
  singlePartialPayData: any;
  paymentLink: any;
  total: number = 0;
  selectedInvoice:any
  settlementData:any
  setItem!:boolean
  makePaymentData:any
  pageChanged!: boolean
  newPaged:any

  constructor(private modalService: NgbModal,
    private httpClient: HttpClient, private formBuilder: FormBuilder,
    private router: Router, private sess: SessionService,
    private ngxService: NgxUiLoaderService, private waterService: CommonService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.sess.isHeadOfICTA();
    this.intialiseTableProperties();
    this.userId = localStorage.getItem('niswasec_role_id');
    this.initialiseForms();
    this.getConsumerSubCategory();
    this.getLocalGovernment();
    this.getDistricts();
    this.getZone();
    this.submitted = false;

    this.config = {
      currentPage: 1,
      itemsPerPage: 10,
    };
    this.route.queryParams.subscribe(
      (params) =>
        (this.config.currentPage = params["page"] ? params["page"] : 1)
    );
    this.getUnpaidBills(this.config.itemsPerPage, this.config.currentPage, this.searchForm.get('consumerSubcategory')!.value, this.searchForm.get('district')!.value, this.searchForm.get('zone')!.value);
  }
  initialiseForms() {
    this.searchForm = this.formBuilder.group({
      consumerSubcategory: [""],
      district: [""],
      zone: [""],
      lga: [""],

    });
  }
  initialiseGroupPaymentItemsForm() {
    this.groupPaymentItemsForm = this.formBuilder.group({
      amountAssessed: new FormControl({
        value: this.singlePartialPayData?.amount_due,
        disabled: true
      }),
      totalAmountToPay: new FormControl({ value: "0", disabled: true }),
      totalDueBalance: new FormControl({ value: this.singlePartialPayData?.amount_due, disabled: true }),
      amountToPay: ["", [Validators.required, Validators.pattern(/^(\d{1,19}|\d{0,19}\.\d{1,2})$/)]],

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
          exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
        },
        {
          extend: "excel",
          className: "btn btn-primary font-12 export-btn mb-4",
          text: '<i class="fas fa-file-excel"> Excel</i>',
          exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
        },
        {
          extend: 'pdf',
          className: 'btn btn-outline-dark mb-4',
          text: '<i class="fas fa-file-pdf"> PDF</i>',
          orientation: 'landscape',
          pageSize: 'LEGAL',
        }
      ],
    };
    this.dtOptions3 = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      paging: false,
      responsive: true,
      lengthChange: false,
      ordering: false,
      info: false,
      language: { search: "", searchPlaceholder: "Search Records" },
    
    };
  }

  getConsumerSubCategory() {
    this.waterService.getConsumerSubCategory().subscribe((data: any) => { this.consumerSubCategory = data.response; },);
  }
  getLocalGovernment() {
    this.waterService.getLocalGovernment().subscribe((data: any) => { this.localGovtData = data.response; },);
  }
  getDistricts() {
    this.searchForm.get('district')!.setValue('');
    let localGovernmentId = this.searchForm.get('lga')!.value;
    this.waterService.getDistricts(localGovernmentId).subscribe((data: any) => { this.distData = data.response; },);
  }
  getZone() {
    this.searchForm.get('zone')!.setValue('');
    let district = this.searchForm.get('district')!.value;
    this.waterService.getZone(district).subscribe((data: any) => { this.zoneData = data.response; },);
  }
  getUnpaidBills(perpage: any, pageno: any, consumerSubCatrgory: any, district: any ,zone: any) {
    this.unpaidBillsData = "";
    let params = new HttpParams();

    if (consumerSubCatrgory != '') {
      params = params.append('consumer_sub_category_id', consumerSubCatrgory)
    }
    if (district != '') {
      params = params.append('district_id', district)
    }
    if (zone != '') {
      params = params.append('zone_id', zone)
    }
    this.ngxService.start();
    this.apiUrl = `${environment.AUTHAPIURL}admins/payments/unpaid-bills?per_page=${perpage}&page=${pageno}`;
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    this.httpClient
      .get<any>(this.apiUrl, { headers: reqHeader, params: params })
      .subscribe((data) => {
        this.unpaidBillsData = data.response.items;
        this.config.totalItems = data.response?.totalItems;
        this.config.currentPage = data.response?.currentPage
        this.ngxService.stop();
      });
    
  }
  clearSearch() {
    this.searchForm.reset();
    this.submitted = false;
    this.currentPageLength = 10;
    this.config.itemsPerPage = 10;
    this.initialiseForms();
    this.unpaidBillsData = "";
    this.getUnpaidBills(this.config.itemsPerPage, this.config.currentPage, this.searchForm.get('consumerSubcategory')!.value, this.searchForm.get('district')!.value, this.searchForm.get('zone')!.value);

  }

  onSubmitSearch() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    }
    this.unpaidBillsData = "";
    if (this.setItem == true) {
      this.config = {
        currentPage: 1,
        itemsPerPage: this.currentPageLength,
      };
    }
    if (this.pageChanged == true) {
      this.config = {
        currentPage: this.newPaged,
        itemsPerPage: this.currentPageLength,
      };
    }
    else if (this.setItem != true) {
      this.config = {
        currentPage: 1,
        itemsPerPage: 10,
      };
    }
 
    this.getUnpaidBills(this.config.itemsPerPage, this.config.currentPage, this.searchForm.get('consumerSubcategory')!.value, this.searchForm.get('district')!.value, this.searchForm.get('zone')!.value);
  }
  viewSingleBill(modal: any, selected: any) {
    this.selectedBill = selected.id;
    this.selectedsubTariff = selected.sub_tariff_type_id;
    this.viewBill(this.selectedBill);
    this.showModal(modal);
  }

  viewSettlement(modal: any, selected: any){
    this.selectedInvoice = selected.invoice_number;
    this.onSubmitSettlementSearch();
    this.currentsettlePageLength= 10;
    this.modalOptions.size = 'lg'
    this.showModal(modal);
  }
  onSubmitSettlementSearch() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    }
    this.configSettlement = {
      currentPage: 1,
      itemsPerPage: 10,
      id: 'settlementPaging',
    };
    let invoice = this.selectedInvoice;

    // if (this.searchForm.get('startDate')!.value != "") {
    //   this.startedDate = formAllData.startDate + '' + '/' + '' + formAllData.endDate;
    // }

    let perpage = this.configSettlement.itemsPerPage;
    let pageno = this.configSettlement.currentPage;
    this.ngxService.start();

    this.apiUrl = `${environment.AUTHAPIURL}admins/reports/settlements?per_page=${perpage}&page=${pageno}`;
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });


    let params = new HttpParams();

    if (invoice != '') {
      params = params.append('invoice_number', invoice)
    }
   

    this.httpClient
      .get<any>(this.apiUrl, { headers: reqHeader, params: params })
      .subscribe((data) => {
        this.settlementData = data.response?.payload?.items;
        this.configSettlement.totalItems = data.response?.payload?.totalItems;
        this.configSettlement.currentPage = data.response?.payload?.currentPage;
  
      });
    this.ngxService.stop();
  }
  viewBill(selectedBillId: any) {
    this.ngxService.start();
    this.apiUrl = `${environment.AUTHAPIURL}admins/payments/single-bill?bill_id=${selectedBillId}`

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("niswasec_access_token"),
    });

    this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe((data) => {
      this.singleBillData = data.response;
      this.ngxService.stop();
    });
  }

  pay(singleBillData: any) {
    let invoice = singleBillData.invoice_number;
    this.waterService.makePaymentOtherBill(invoice).subscribe(
      data => {

        this.makePaymentData = data;
        if (this.makePaymentData.status == true) {
          window.open(this.makePaymentData.response.payment_link, "_blank");
          this.modalService.dismissAll();
          this.ngxService.stop();
        }
        else {
          this.ngxService.stop();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text:
              this.makePaymentData.response != null && this.makePaymentData.response[0] != undefined
                ? this.makePaymentData.response[0].message
                : this.makePaymentData.message,
            showConfirmButton: true,
            timer: 5000,
          });
        }
      }, error => {
        if (error.status === 429) {
          this.ngxService.stop();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text:
              error.error,
            showConfirmButton: true,
            timer: 5000,
          });
        }
      }
    );
  }
  calculateAmountAssessed() {
    let amountAssessed = 0;
    amountAssessed = this.groupPaymentItemsForm.get('amountToPay')!.value
    this.setTotalAmountAssessed(amountAssessed);
  }

  partialPay(singleBillData: any, modal: any) {
    this.singlePartialPayData = singleBillData;
    this.singleInvoice = singleBillData.invoice_number;
    this.initialiseGroupPaymentItemsForm();
    this.submitted = false;
    this.showModal(modal);
  }
  setTotalAmountAssessed(amountAssessed: any) {
    this.groupPaymentItemsForm.controls["totalAmountToPay"].setValue(
      amountAssessed
    );
  }

  removeDefault(){
    this.settlementData = "";
  } 

  onSubmitPaymentItem(formAllData: any) {
    this.submitted = true;

    if (this.groupPaymentItemsForm.invalid) {
      return;
    }
    let amount = this.groupPaymentItemsForm.controls['amountToPay'].value;

    if (amount < 1000) {
      Swal.fire({
        icon: "error",
        title: "Oops..",
        text: "Amount to pay must not be less than ₦ 1000",
        showConfirmButton: true,
        timer: 5000,
      });
      return;
    }
    let amountAssessed = this.groupPaymentItemsForm.controls['amountAssessed'].value;
    if (amount > amountAssessed) {
      this.ngxService.stop();
      Swal.fire({
        icon: "error",
        title: "Oops..",
        text: "The amount to pay of ₦ " + amount + ' ' + "must not be greater than the assessment amount of ₦ " + amountAssessed,
        showConfirmButton: true,
        timer: 5000,
      });
      return;
    }
   this.postFlatPayment(this.singleInvoice,formAllData.amountToPay)
}
postFlatPayment(invoice: any,amountToPay: any) {
  this.waterService.makePaymentFlatBill(invoice,amountToPay).subscribe(
    data => {
       this.payLinkData = data;
      if (this.payLinkData.status == true) {
      
        this.paymentLink = this.payLinkData.response.payment_link;
        this.modalService.dismissAll()
        this.goToLink(this.paymentLink);
        this.ngxService.stop();
      }
      else {
        this.ngxService.stop();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text:
            this.payLinkData.response != null && this.payLinkData.response[0] != undefined
              ? this.payLinkData.response[0].message
              : this.payLinkData.message,
          showConfirmButton: true,
          timer: 5000,
        });
      }
    }, error => {
      if (error.status === 429) {
        this.ngxService.stop();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text:
            error.error,
          showConfirmButton: true,
          timer: 5000,
        });
      }
    }
  );
}
  goToLink(url: string) {
    window.open(url, "_blank");
  }

 
  public setItemsPerPageSettlement($event: any) {
    this.configSettlement.itemsPerPage = $event;
    this.configSettlement.currentPage = 1;
    this.currentsettlePageLength = this.configSettlement.itemsPerPage;
    this.router.navigate(["/headbillspayment"]);
    this.onSubmitSettlementSearch();
  }

  pageChange(newPage: number) {
    this.pageChanged = true;
    this.newPaged = newPage;
    if (this.submitted == true && this.settlementData) {
      this.router.navigate(["/headbillspayment"], {
        queryParams: { page: newPage },
      });
      this.onSubmitSettlementSearch();
    }
    else {
      this.router.navigate(["/headbillspayment"], {
      });
      this.getUnpaidBills(this.config.itemsPerPage, newPage, this.searchForm.get('consumerSubcategory')!.value, this.searchForm.get('district')!.value, this.searchForm.get('zone')!.value);
    }

  }
  public setItemsPerPage($event: any) {
    this.setItem = true;
    this.pageChanged = false;
    this.config.itemsPerPage = $event;
    this.config.currentPage = 1;
    this.currentPageLength = this.config.itemsPerPage;
    this.router.navigate(["/headbillspayment"]);
    if (this.submitted == true) {
      this.onSubmitSearch();
    }
    if (this.submitted == false) {
      this.getUnpaidBills(this.config.itemsPerPage, 1, this.searchForm.get('consumerSubcategory')!.value, this.searchForm.get('district')!.value, this.searchForm.get('zone')!.value);
    }
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





