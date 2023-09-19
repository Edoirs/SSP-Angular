import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CommonService } from 'src/app/common.service';
import Swal from 'sweetalert2';
import { SessionService } from 'src/app/session.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-billingsettlements',
  templateUrl: './billingsettlements.component.html',
  styleUrls: ['./billingsettlements.component.css']
})
export class BillingsettlementsComponent implements OnInit {
  userId: any
  apiUrl: string | undefined;
  config: any
  currentPageLength: any = 10;
  title = 'angulardatatables';
  dtOptions: any = {};
  closeResult: string = '';
  modalOptions!: NgbModalOptions;
  dtOptionsPopUp1: any = {};
  settlementData: any
  searchForm!: FormGroup
  submitted!: boolean
  consumerSubCategory: any
  tariffTypes: any
  startedDate: any
  date: any;
  modifiedDate: any;
  modifiedMin: any;
  minDate: any;
  paymentStatsData: any;
  setItem!:boolean

  constructor(private modalService: NgbModal,
    private httpClient: HttpClient, private sess: SessionService,
    private router: Router, private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService, private waterService: CommonService,
    private route: ActivatedRoute,private datePipe: DatePipe,
  ) {
  }

  ngOnInit() {
    this.sess.isbillingOfficer();
    this.intialiseTableProperties();
    this.userId = localStorage.getItem('niswasec_role_id')
    this.initialiseForms();
    this.submitted = false;
    this.config = {
      currentPage: 1,
      itemsPerPage: 10,
    };
    this.route.queryParams.subscribe(
      (params) =>
        (this.config.currentPage = params["page"] ? params["page"] : 1)
    );
    this.getSettlementsHistory(this.config.itemsPerPage, this.config.currentPage);
    let dte = new Date();
    this.modifiedDate = dte.setDate(dte.getDate());
    this.date = this.datePipe.transform(this.modifiedDate, "yyyy-MM-dd");
    this.modifiedMin = dte.setFullYear(1900, 1, 1),
    this.minDate = this.datePipe.transform(this.modifiedMin, "yyyy-MM-dd");
  }
  initialiseForms() {
    this.searchForm = this.formBuilder.group({
      invoice: [""],
      startDate: [""],
      endDate: [""],
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
          className: "btn btn-success font-12 export-btn mb-4",
          text: '<i class="fas fa-file-csv"> CSV</i>',
          exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10, 11 , 12,13] },
        },
        {
          extend: "excel",
          className: "btn btn-success font-12 export-btn mb-4",
          text: '<i class="fas fa-file-excel"> Excel</i>',
          exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9,10, 11 , 12,13] },
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

  getSettlementsHistory(perpage: any, pageno: any) {
    this.settlementData = "";
    this.ngxService.start();
    this.apiUrl = `${environment.AUTHAPIURL}admins/reports/settlements?per_page=${perpage}&page=${pageno}`;
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });

    this.httpClient
      .get<any>(this.apiUrl, { headers: reqHeader })
      .subscribe((data) => {
        this.settlementData = data.response.payload.items;
        this.paymentStatsData = data.response.stats;
        this.config.totalItems = data.response?.payload.totalItems;
        this.config.currentPage = data.response?.payload?.currentPage;
      });
    this.ngxService.stop();
  }

  public setItemsPerPage($event: any) {
    this.setItem =true;
    this.config.itemsPerPage = $event;
    this.config.currentPage = 1;
    this.currentPageLength = this.config.itemsPerPage;
    this.router.navigate(["/billingsettlement"]); 
    if(this.submitted == true){
      this.onSubmitSearch();
    }
    if(this.submitted == false){
      this.getSettlementsHistory(this.config.itemsPerPage, 1);
    }
  }

  pageChange(newPage: number) {
    this.router.navigate(["/billingsettlement"], {
      queryParams: { page: newPage },
    });
    this.getSettlementsHistory(this.config.itemsPerPage, newPage);
  }
  onSubmitSearch() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    }
    if(this.setItem == true){
      this.config = {
        currentPage: 1,
        itemsPerPage: this.currentPageLength,
      };
      
    }
    else{
      this.config = {
        currentPage: 1,
        itemsPerPage: 10,
      };
    }
  

    let invoice = this.searchForm.controls['invoice'].value;

    if (this.searchForm.get('startDate')!.value != "") {
      this.startedDate = this.searchForm.controls['startDate'].value + '' + '/' + '' + this.searchForm.controls['endDate'].value;
    }

    let perpage = this.config.itemsPerPage;
    let pageno = this.config.currentPage;
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
    if (this.startedDate != '') {
      params = params.append('date_range', this.startedDate)
    }

    this.httpClient
      .get<any>(this.apiUrl, { headers: reqHeader, params: params })
      .subscribe((data) => {
        this.settlementData = data.response.payload.items;
        this.paymentStatsData = data.response.stats;
        this.config.totalItems = data.response?.payload.totalItems;
      });
    this.ngxService.stop();
  }
  clearSearch() {
    this.searchForm.reset();
    this.submitted = false;
    this.initialiseForms();
    this.settlementData = [];
    this.currentPageLength = 10;
    this.config.itemsPerPage = 10;
    this.getSettlementsHistory(this.config.itemsPerPage, this.config.currentPage);
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







