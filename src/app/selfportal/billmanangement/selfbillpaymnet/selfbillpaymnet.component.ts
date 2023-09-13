import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CommonService } from 'src/app/common.service';
import Swal from 'sweetalert2';
import { SessionService } from 'src/app/session.service';
@Component({
  selector: 'app-selfbillpaymnet',
  templateUrl: './selfbillpaymnet.component.html',
  styleUrls: ['./selfbillpaymnet.component.css']
})
export class SelfbillpaymnetComponent implements OnInit {
  userId: any
  apiUrl: string | undefined;
  config: any
  configSettlement: any
  currentPageLength: any = 10;
  title = 'angulardatatables';
  dtOptions: any = {};
  closeResult: string = '';
  modalOptions!: NgbModalOptions;
  dtOptionsPopUp1: any = {};
  unpaidBillsData: any
  selectedBill: any;
  singleBillData: any;
  selectedsubTariff: any;
  singlePartialPayData: any;
  groupPaymentItemsForm!: FormGroup;
  total: number = 0;
  navigationUrl: any;
  submitted!: boolean
  amountError!: boolean
  currentsettlePageLength: any = 10;
  singleInvoice: any;
  paymentLink: any;
  consumerSubCategory: any;
  distData: any;
  localGovtData: any;
  zoneData: any;
  searchForm!: FormGroup
  selectedInvoice!: any
  settlementData: any;
  setItem!: boolean
  makePaymentData: any
  payLinkData: any
  pageChanged!: boolean
  newPaged: any

  constructor(private modalService: NgbModal,
    private httpClient: HttpClient, private formBuilder: FormBuilder,
    private router: Router, private sess: SessionService,
    private ngxService: NgxUiLoaderService, private waterService: CommonService,
    private route: ActivatedRoute) { }


  ngOnInit() {
    this.sess.isCustomer();
    this.intialiseTableProperties();
    this.userId = localStorage.getItem('niswasec_role_id');
    this.getUnpaidBills();
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
          exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
        },
        {
          extend: "excel",
          className: "btn btn-primary font-12 export-btn mb-4",
          text: '<i class="fas fa-file-excel"> Excel</i>',
          exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
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
  }

  getUnpaidBills() {
    this.unpaidBillsData = "";
    let params = new HttpParams();
    this.ngxService.start();
    this.apiUrl = `${environment.AUTHAPIURL}self-portal/unpaid-bills`;
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    this.httpClient
      .get<any>(this.apiUrl, { headers: reqHeader, params: params })
      .subscribe((data) => {
        this.unpaidBillsData = data.response;
        this.ngxService.stop();
      });
  }

  viewSingleBill(modal: any, selected: any) {
    this.selectedBill = selected.id;
    this.selectedsubTariff = selected.sub_tariff_type_id;
    this.viewBill(this.selectedBill);
    this.showModal(modal);
  }

  viewBill(selectedBillId: any) {
    this.singleBillData = "";
    this.ngxService.start();
    this.apiUrl = `${environment.AUTHAPIURL}self-portal/single-bill?bill_id=${selectedBillId}`

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
    var req = {
      invoice_number: singleBillData.invoice_number
    }
    this.ngxService.start();
    this.apiUrl = `${environment.AUTHAPIURL}self-portal/pay/bill-others`

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("niswasec_access_token"),
    });

    this.httpClient.post<any>(this.apiUrl, req, { headers: reqHeader }).subscribe((data) => {

      if (data.status == true) {
        this.makePaymentData = data;
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
            data.response != null && data.response[0] != undefined
              ? data.response[0].message
              : data.message,
          showConfirmButton: true,
          timer: 5000,
        });
      }
    },
      error => {

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

  removeDefault() {
    this.settlementData = "";
  }
  goToLink(url: string) {
    window.open(url, "_blank");
  }
  public setItemsPerPage($event: any) {
    this.setItem = true;
    this.pageChanged = false;
    this.config.itemsPerPage = $event;
    this.config.currentPage = 1;
    this.currentPageLength = this.config.itemsPerPage;
    this.router.navigate(["/selfpayment"]);
    this.getUnpaidBills()
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






