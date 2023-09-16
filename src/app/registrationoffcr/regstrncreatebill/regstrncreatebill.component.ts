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
@Component({
  selector: 'app-regstrncreatebill',
  templateUrl: './regstrncreatebill.component.html',
  styleUrls: ['./regstrncreatebill.component.css']
})
export class RegstrncreatebillComponent {

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
  tariffTypes: any;
  subtariffTypes: any;
  searchForm!: FormGroup
  submitted!: boolean
  billType: any
  perpage: any
  pageno: any
  subtarrifId: any
  masterSelected!:boolean;
  selected!:boolean
  masterData:boolean = true;
  checkedFruits: any[] = [];
  tariffTypeId:any;
  billGroup:any;
  subtarrif:any;
  
  constructor(private modalService: NgbModal,
    private httpClient: HttpClient, private sess: SessionService,
    private router: Router, private formBuilder: FormBuilder,
    private ngxService: NgxUiLoaderService, private waterService: CommonService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.initialiseForms();
    this.intialiseTableProperties();
    this.userId = localStorage.getItem('niswasec_role_id');
    this.sess.isRegistrationOfficer();
    this.getTariffTypes();
   
    this.getBillTypes();

    this.config = {
      currentPage: 1,
      itemsPerPage: 10,
    };
    this.route.queryParams.subscribe(
      (params) =>
        (this.config.currentPage = params["page"] ? params["page"] : 1)
    );
    //  this.getGeneratedBills(this.config.itemsPerPage, this.config.currentPage);
  }

  initialiseForms() {
    this.searchForm = this.formBuilder.group({
      tariff: ["", [
        Validators.required
      ]],
      subtariff: ["", [
        Validators.required
      ]],
       billType: ["", [
        Validators.required
      ]],
      billingGroup: [""],
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
          exportOptions: { columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
        },
        {
          extend: "excel",
          className: "btn btn-success font-12 export-btn mb-4",
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
  }
  getTariffTypes() {
    this.waterService.getTariffTypes().subscribe((data: any) => { this.tariffTypes = data.response; },);
  }

  getSubTariffType(tariffID:any) {
    this.waterService.getSubTariffTypeById(tariffID).subscribe((data: any) => { this.subtariffTypes = data.response; },);
  }
  getbillgroup() {
    this.tariffTypeId = this.searchForm.get('tariff')!.value;
    let subTariffTypeId = this.searchForm.get('subtariff')!.value;
    let billType = this.searchForm.get('billType')!.value;
    this.waterService.getbillgroups(this.tariffTypeId, subTariffTypeId, billType).subscribe((data: any) => { this.billGroup = data.response; },);

    
  }
  getBillTypes() {
    this.waterService.getBillTypes().subscribe((data: any) => { this.billType = data.response; },);
  }
  getGeneratedBills(perpage: any, pageno: any) {
    this.ngxService.start();
    this.apiUrl = `${environment.AUTHAPIURL}admins/payments/fetch-billable-customers?per_page=${perpage}&page=${pageno}&bill_type_id=${this.searchForm.get('billType')!.value}&tariff_type_id=${this.searchForm.get('tariff')!.value}&sub_tariff_type_id=${this.searchForm.get('subtariff')!.value}`;
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
  getTariffByID($event:any){
    this.subtarrifId = $event?.target.value;
    this.getSubTariffType(this.subtarrifId)
   
  }
  viewSingleBill(modal: any, selected: any) {
    this.selectedBill = selected.id; 
    this.viewBill(this.selectedBill);
    this.showModal(modal);
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
  public setItemsPerPage($event: any) {
    this.config.itemsPerPage = $event;
    this.config.currentPage = 1;
    this.currentPageLength = this.config.itemsPerPage;
    this.router.navigate(["/registrationbills"]);
    this.getGeneratedBills(this.config.itemsPerPage, 1);
  }

  pageChange(newPage: number) {
    this.router.navigate(["/registrationbills"], {
      queryParams: { page: newPage },
    });
    this.getGeneratedBills(this.config.itemsPerPage, newPage);
  }

  clearSearch() {
    // this.searchObject = {};
    this.searchForm.reset();
    this.submitted = false;
    this.initialiseForms();
  }

  onSubmitSearch(formAllData: any) {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    }
    
    this.fetchbilling(this.config.itemsPerPage, this.config.currentPage, this.searchForm.get('billType')!.value,this.searchForm.get('tariff')!.value,this.searchForm.get('subtariff')!.value,this.searchForm.get('billingGroup')!.value);
  }

  getsubTriffValue($event:any){
    this.subtarrif = $event?.target.value;
  }
  fetchbilling(perpage: any, pageno: any, billId: any,tariffId:any,subtariffId:any,billingGroup:any){
    this.ngxService.start();

    this.apiUrl = `${environment.AUTHAPIURL}admins/payments/fetch-billable-customers?per_page=${perpage}&page=${pageno}&bill_type_id=${billId}&tariff_type_id=${tariffId}&sub_tariff_type_id=${subtariffId}&bill_group_id=${billingGroup}`;
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
  toggleCheck(fruit: any) {
    this.masterData = true;
    if (this.checkedFruits.indexOf(fruit) === -1) {
      this.checkedFruits.push(fruit);
    } else {
      this.checkedFruits.splice(this.checkedFruits.indexOf(fruit), 1);
    }
  }
  checkAllCheckBox(ev: any) {
    this.generatedBillsData.forEach((x:any
       ) => x.checked = ev.target.checked)
       this.checkedFruits.push(this.generatedBillsData);
       this.masterData = false;
   }
 
   isAllCheckBoxChecked() {
     this.selected = this.generatedBillsData.forEach((p:any) => p.checked)
     return this.generatedBillsData.forEach((p:any) => p.checked);
   }
   generateBill() {
    let ids: any[] = [];
    if (this.masterData == true) {
      this.checkedFruits.forEach((fruit)  => {
        ids.push(fruit.consumer_id);
      });
    }
  
    if(this.masterData == false){
      this.generatedBillsData.forEach((obj: any) => {
        ids.push(obj.consumer_id);
      });
    }
   
    var req = {
      consumer_profile_ids: ids
    }
    this.ngxService.start();

    this.apiUrl = `${environment.AUTHAPIURL}admins/payments/generate-bill`;
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });

    this.httpClient
      .post<any>(this.apiUrl, req, { headers: reqHeader })
      .subscribe((data) => {
        if (data.status == true) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
          });
          this.intialiseTableProperties();
          this.generatedBillsData = [];
          this.masterData == true;
          this.isAllCheckBoxChecked();
          // this.hospitalService.isBillGenerated = true;
         
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
    this.ngxService.stop();
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





