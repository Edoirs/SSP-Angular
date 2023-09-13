import { Component } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { NgxUiLoaderService } from "ngx-ui-loader";
import { CommonService } from 'src/app/common.service';
import Swal from 'sweetalert2';
import { SessionService } from 'src/app/session.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-headbillinggeneratedbills',
  templateUrl: './headbillinggeneratedbills.component.html',
  styleUrls: ['./headbillinggeneratedbills.component.css']
})
export class HeadbillinggeneratedbillsComponent {


  userId: any
  apiUrl: string | undefined;
  config: any
  currentPageLength: any = 10;
  title = 'angulardatatables';
  dtOptions: any = {};
  closeResult: string = '';
  modalOptions!: NgbModalOptions;
  dtOptionsPopUp1: any = {};
  generatedBillsData: any
  selectedBill: any;
  singleBillData: any;
  consumerSubCategory:any;
  tariffTypes:any;
  searchForm!: FormGroup
  submitted!:boolean
  startedDate: any;
  date: any;
  modifiedDate: any;
  modifiedMin: any;
  minDate: any;
  setItem!:boolean
  pageChanged!: boolean
  newPaged: any

  constructor(private modalService: NgbModal,private datePipe: DatePipe,
    private httpClient: HttpClient,private formBuilder: FormBuilder,
    private router: Router, private sess: SessionService,
    private ngxService: NgxUiLoaderService, private waterService: CommonService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.sess.isheadbillingOfficer();
    this.intialiseTableProperties();
    this.userId = localStorage.getItem('niswasec_role_id')
    this.getConsumerSubCategory();
    this.getTariffTypes();
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
    this.getGeneratedBills(this.config.itemsPerPage, this.config.currentPage);

    let dte = new Date();
    this.modifiedDate = dte.setDate(dte.getDate());
    this.date = this.datePipe.transform(this.modifiedDate, "yyyy-MM-dd");
    this.modifiedMin = dte.setFullYear(1900, 1, 1),
    this.minDate = this.datePipe.transform(this.modifiedMin, "yyyy-MM-dd");
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
          exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,13,14] },
        },
        {
          extend: "excel",
          className: "btn btn-primary font-12 export-btn mb-4",
          text: '<i class="fas fa-file-excel"> Excel</i>',
          exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,13,14] },
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
  getConsumerSubCategory() {
    this.waterService.getConsumerSubCategory().subscribe((data: any) => { this.consumerSubCategory = data.response; },);
  }

  getTariffTypes() {
    this.waterService.getTariffTypes().subscribe((data: any) => { this.tariffTypes = data.response; },);
  }
  initialiseForms() {
    this.searchForm = this.formBuilder.group({
      tariff: ["", [
        Validators.required
      ]],
      consumerSubcategory: ["", [
        Validators.required
      ]],
     
      startDate: [""],
      endDate: [""],
    });
  }
  getGeneratedBills(perpage: any, pageno: any) {
    this.generatedBillsData = "";
    this.ngxService.start();
    this.apiUrl = `${environment.AUTHAPIURL}admins/reports/generated-bills?per_page=${perpage}&page=${pageno}`;
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });

    this.httpClient
      .get<any>(this.apiUrl, { headers: reqHeader })
      .subscribe((data) => {
        this.generatedBillsData = data.response.items;
        this.config.totalItems = data.response?.totalItems;
      });
    this.ngxService.stop();
  }

  viewSingleBill(modal: any, selected: any) {
    this.selectedBill = selected.id;
    this.showModal(modal);
    this.viewBill(this.selectedBill);
  }
  viewBill(selectedBillId: any) {
    this.ngxService.start();
    this.apiUrl = `${environment.AUTHAPIURL}admins/reports/generated-bills/single?bill_id=${selectedBillId}`

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("niswasec_access_token"),
    });

    this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe((data) => {
      this.singleBillData = data.response;
      this.ngxService.stop();
    });
  }
  clearSearch() {
    this.searchForm.reset();
    this.submitted = false;
    this.initialiseForms();
    this.currentPageLength = 10;
    this.config.itemsPerPage = 10;
    this.generatedBillsData = "";
    this.getGeneratedBills(this.config.itemsPerPage, this.config.currentPage);
  }
  onSubmitSearch() {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    }
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
        let tariffId = this.searchForm.controls['tariff'].value;
        let consumerSubcategory = this.searchForm.controls['consumerSubcategory'].value;
        if(this.searchForm.get('startDate')!.value != ""){
          this.startedDate = this.searchForm.controls['startDate'].value  + '' + '/' + '' + this.searchForm.controls['endDate'].value;
        }
      if(this.searchForm.get('startDate')!.value == ""){
        this.startedDate = "";
      }
      
      let perpage = this.config.itemsPerPage;
      let pageno = this.config.currentPage;
      this.ngxService.start();

    this.apiUrl = `${environment.AUTHAPIURL}admins/reports/generated-bills?per_page=${perpage}&page=${pageno}&consumer_sub_category_id=${consumerSubcategory}&tariff_type_id=${tariffId}&date_range=${this.startedDate}`;
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });

    this.httpClient
      .get<any>(this.apiUrl, { headers: reqHeader })
      .subscribe((data) => {
        this.generatedBillsData = data.response.items;
        this.config.totalItems = data.response?.totalItems;
      });
    this.ngxService.stop();
  }
 

  public setItemsPerPage($event: any) {
    this.setItem = true;
    this.pageChanged = false;
    this.config.itemsPerPage = $event;
    this.config.currentPage = 1;
    this.currentPageLength = this.config.itemsPerPage;
    this.router.navigate(["/headbillinggeneratedbills"]);
    if (this.submitted == true) {
      this.onSubmitSearch();
    }
    if (this.submitted == false) {
      this.getGeneratedBills(this.config.itemsPerPage, 1);
    }
  }

  pageChange(newPage: number) {
    this.pageChanged = true;
    this.newPaged = newPage;
    this.router.navigate(["/headbillinggeneratedbills"], {
      queryParams: { page: newPage },
    });
    if (this.submitted == true) {
      this.onSubmitSearch();
    }
    if (this.submitted == false) {
      this.getGeneratedBills(this.config.itemsPerPage, newPage);
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





