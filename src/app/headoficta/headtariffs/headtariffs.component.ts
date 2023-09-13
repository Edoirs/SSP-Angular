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
  selector: 'app-headtariffs',
  templateUrl: './headtariffs.component.html',
  styleUrls: ['./headtariffs.component.css']
})
export class HeadtariffsComponent {

    apiUrl: string | undefined;
    config: any
    currentPageLength: any = 10;
    title = 'angulardatatables';
    dtOptions: any = {};
    closeResult: string = '';
    submitted!: boolean
    modalOptions!: NgbModalOptions;
    dtOptionsPopUp1: any = {};
    tariffTypes: any;
  
    userId: any;
    tariffListData: any;
    selectedUserId: any;
    singleTariffData: any;
    selectedUser: any;
    selectedId: any;
    editTariffForm!: FormGroup
    addAdminform!: FormGroup
    tariffId: any;
    fieldTextType!: boolean;
    submitted1!: boolean
  
    constructor(private modalService: NgbModal,
      private httpClient: HttpClient,  private sess: SessionService,
      private router: Router,
      private ngxService: NgxUiLoaderService, private waterService: CommonService,
      private route: ActivatedRoute, private formBuilder: FormBuilder,
    ) {
    }
  
    ngOnInit() {
      this.sess.isHeadOfICTA();
      this.getTariffTypes();
      this.initialiseForms();
      this.intialiseTableProperties();
      this.initialiseCreateForms();
      this.userId = localStorage.getItem('niswasec_role_id')
  
      this.config = {
        currentPage: 1,
        itemsPerPage: 10,
      };
      this.route.queryParams.subscribe(
        (params) =>
          (this.config.currentPage = params["page"] ? params["page"] : 1)
      );
      this.getTariff(this.config.itemsPerPage, this.config.currentPage);
    }
    initialiseForms() {
      this.editTariffForm = this.formBuilder.group({
        name: ["", [
          Validators.required
        ]],
       
      });
    }
    initialiseCreateForms(){
      this.addAdminform = this.formBuilder.group({
        emailAddress: ["", [
          Validators.required,
          Validators.maxLength(40),
          Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ]],
    
        firstName: ["", [
          Validators.required,
          Validators.pattern("^[A-Za-z]+[A-Za-z ]*$"),
          Validators.maxLength(30),
        ]],
        middleName: [
          "",
          [
            Validators.pattern("^[A-Za-z]+[A-Za-z ]*$"),
            Validators.maxLength(30),
          ],
        ],
        lastName: [
          "",
          [
            Validators.required,
            Validators.pattern("^[A-Za-z]+[A-Za-z ]*$"),
            Validators.maxLength(30),
          ],
        ],
    
        role: ["", [
          Validators.required
        ]],
        phoneNumber: [
          "",
          [
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(11),
            Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/),
          ],
        ],
        password: ["", [
          Validators.required
        ]],
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
    getTariff(perpage: any, pageno: any) {
      this.ngxService.start();
  
      this.apiUrl = `${environment.AUTHAPIURL}admins/tariffs/list?per_page=${perpage}&page=${pageno}`;
      const reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
      });
  
      this.httpClient
        .get<any>(this.apiUrl, { headers: reqHeader })
        .subscribe((data) => {
          this.tariffListData = data.response;
          this.config.totalItems = data.response?.totalItems;
        });
      this.ngxService.stop();
    }
  
    public setItemsPerPage($event: any) {
      this.config.itemsPerPage = $event;
      this.config.currentPage = 1;
      this.currentPageLength = this.config.itemsPerPage;
      this.router.navigate(["/headtariffs"]);
      this.getTariff(this.config.itemsPerPage, 1);
    }
    keyPressNumbersWithDecimal(event: any) {
      var charCode = event.which ? event.which : event.keyCode;
      if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
        return false;
      }
      return true;
    }
  
    viewSingleTariff(modal: any, selected: any) {
      this.selectedUser = selected.id;
      this.showModal(modal);
      this.viewUser(this.selectedUser);
    }
  
    viewUser(selectedUserId: any) {
  
      this.tariffId = selectedUserId;
      this.ngxService.start();
      this.apiUrl = `${environment.AUTHAPIURL}admins/tariffs/single?tariff_id=${this.tariffId}`
  
      const reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("niswasec_access_token"),
      });
  
      this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe((data) => {
        this.singleTariffData = data.response;
        this.ngxService.stop();
      });
    }
  
    onEditTariff(modal: any, selectedData: any) {
      this.submitted = false;
      this.showModal(modal);
      this.selectedId = selectedData.id;
  
      this.editTariffForm = this.formBuilder.group({
        name: [selectedData.id, [
          Validators.required
        ]],
      });
  
    }
  
    updateAdmin(formAllData: any) {
      this.submitted = true;
      if (this.editTariffForm.invalid) {
        return;
      }
      let requestObj = {
        tariff_id: this.selectedId,
        name: formAllData.name
      };
      this.apiUrl = `${environment.AUTHAPIURL}admins/tariffs/update`;
  
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
          this.getTariff(this.config.itemsPerPage, this.config.currentPage);
          this.initialiseForms();
          this.submitted = false;
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
    toggleFieldTextType() {
      this.fieldTextType = !this.fieldTextType;
    }
  
  
    createAdmin(modal: any) {
      this.showModal(modal);
    }
  
  onAddNewUser(formAllData: any){
      this.submitted1 = true;
      if (this.addAdminform.invalid) {
        return;
      }
      let requestObj = {
        
        first_name: formAllData.firstName,
        middle_name: formAllData.middleName,
        last_name: formAllData.lastName,
        email: formAllData.emailAddress,
        phone: formAllData.phoneNumber,
        role_id: formAllData.role,
        password: formAllData.password,
      };
      this.apiUrl = `${environment.AUTHAPIURL}admins/create`;
  
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
          this.getTariff(this.config.itemsPerPage, this.config.currentPage);
          this.initialiseCreateForms();
          this.submitted1 = false;
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
  
    pageChange(newPage: number) {
      this.router.navigate(["/headtariffs"], {
        queryParams: { page: newPage },
      });
      this.getTariff(this.config.itemsPerPage, newPage);
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
  
  
  
  
  
