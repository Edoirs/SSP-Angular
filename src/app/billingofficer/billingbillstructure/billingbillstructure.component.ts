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
  selector: 'app-billingbillstructure',
  templateUrl: './billingbillstructure.component.html',
  styleUrls: ['./billingbillstructure.component.css']
})
export class BillingbillstructureComponent {
 
    showOtherTabs!: boolean;
    subtariffData: any;
    subtariffId: any;
    districtListData: any
    apiUrl: string | undefined;
    config: any
    currentPageLength: any = 10;
    currentBillingPageLength: any = 10;
    title = 'angulardatatables';
    dtOptions: any = {};
    dtOptionsPopUpDistZones: any = {};
    closeResult: string = '';
    submitted!: boolean
    modalOptions!: NgbModalOptions;
    dtOptionsPopUp1: any = {};
    tariffTypes: any;
    selectedZoneId: any
    selectedcategory: any
    selectedSubcategory: any
    categoryId: any;
    userId: any;
    configZone:any;
    configDistZone:any;
    tariffListData: any;
    selectedUserId: any;
    singleTariffData: any;
    selectedUser: any;
    selectedId: any;
    editTariffForm!: FormGroup
    districtForm!: FormGroup
    addTariffForm!: FormGroup
    billingGroupForm!: FormGroup
    tariffId: any;
    fieldTextType!: boolean;
    submitted1!: boolean
    submitted3!: boolean
    selectedTariffId: any;
    categoryListData: any;
    subcategoryId: any;
    subCategoryData: any;
    singlesubcategoryId: any;
    tabName!: string;
    subtarif: any;
    activeTab: any;
    subTariffForm!: FormGroup;
    updatesubTariffForm!: FormGroup;
    selectedSubTariffId:any;
    updateBillingForm!: FormGroup;
    billingListData: any;
    billTypes: any;
    subbillTypes: any;
    consumercatgryTypes: any;
    billingcycles: any;
    computationData: any;
    subtariffType: any;
    consumerSubCategory: any;
    selectedBillingId: any;
    billGroupId: any;
    p2:any = 1;
    selectedDistrict: any;
    selectedDistrictZone: any;
    singleDistrictzoneData: any;
    selectedDistrictSingleZone: any;
    localGovtData: any;
    editdistrictForm!: FormGroup;
    selectedDistt: any
    billTypeValue: any;
    selectedVal: any;
    subCategory: any;
    selectedsubCategoryId:any;
    editSubcategoryForm!: FormGroup;
    createSubcategoryForm!: FormGroup;
    subtarrifId:any
    singlezoneData:any
    selectedZone:any
    updateSubTariffSubmit!: boolean;
    createZoneDistrictForm!: FormGroup;
    tariffName:any;
    submittedZoneDistrict!: boolean;
    selectedDistrictZoneId:any;
    singleZoneData:any;
    editdistId:any;
    editZoneId:any;
    editZoneDistrictForm!: FormGroup;
    submittededitZoneDistrict!: boolean;
    submittededitRound!: boolean;
    createRoundForm!: FormGroup;
    submittedRound!: boolean;
    zoneRound:any;
    edittZoneId:any;
    editRoundId:any;
  
    updteRoundForm!: FormGroup;
  
  
    constructor(private modalService: NgbModal, private httpClient: HttpClient, private router: Router,
      private ngxService: NgxUiLoaderService, private waterService: CommonService, private sess: SessionService,
      private route: ActivatedRoute, private formBuilder: FormBuilder) { }
  
    ngOnInit() {
      this.showOtherTabs = true;
      this.sess.isbillingOfficer();
      this.getTariffTypes();
      this.initialiseForms();
      this.intialiseTableProperties();
      this.initialiseCreateTariffForms();
      this.initialisesubTariffForms();
      this.initialiseUpdatesubTariffForms();
      this.initialiseCreateBillingForms();
      this.initialiseupdateBillingForms();
      this.initialiseDistrictForms();
      this.getBillTypes();
      this.getSubBillType();
      this.getConsumerCategory();
      this.getBillingCycles();
      this.getComputationType();
      this.initialisecreateZoneDistrict();
      this.getConsumerSubCategory();
      this.initialiseupdteRoundForm();
      this.initialiseEditZoneDistrict();
      this.getLocalGovernment();
      this.initialisesubCategoryForms();
      this.initialisecreatesubCategoryForms();
  
      this.userId = localStorage.getItem('niswasec_role_id')
  
      this.getCategory();
      //
      this.activeTab = 'category';
    }
    initialiseForms() {
      this.editTariffForm = this.formBuilder.group({
        name: ["", [
          Validators.required
        ]],
  
      });
    }
    initialisesubTariffForms() {
      this.subTariffForm = this.formBuilder.group({
        name: ["", [
          Validators.required
        ]],
        tariff: ["", [
          Validators.required
        ]],
      });
    }
    
    initialisecreateZoneDistrict() {
      this.createZoneDistrictForm = this.formBuilder.group({
        name: ["", [
          Validators.required
        ]],
        districtId: [""],
      });
    }
  
    initialiseEditZoneDistrict() {
      this.editZoneDistrictForm = this.formBuilder.group({
        name: ["", [
          Validators.required
        ]],
        districtId: [""],
        zoneId:[""],
      });
    }
    initialisecreateRoundtForm() {
      this.createRoundForm = this.formBuilder.group({
        name: ["", [
          Validators.required
        ]],
       
        zoneId:[""],
      });
    }
    initialiseupdteRoundForm() {
      this.updteRoundForm = this.formBuilder.group({
        name: ["", [
          Validators.required
        ]],
       
        zoneId:[""],
        roundId:[""],
      });
    }
    
    
    initialiseUpdatesubTariffForms() {
      this.updatesubTariffForm = this.formBuilder.group({
        name: ["", [
          Validators.required
        ]],
        tariff: ["", [
          Validators.required
        ]],
      });
    }
    initialisesubCategoryForms() {
      this.editSubcategoryForm = this.formBuilder.group({
        name: ["", [
          Validators.required
        ]],
        category: ["", [
          Validators.required
        ]],
      });
    }
    initialisecreatesubCategoryForms() {
      this.createSubcategoryForm = this.formBuilder.group({
        name: ["", [
          Validators.required
        ]],
        category: ["", [
          Validators.required
        ]],
      });
    }
    
    initialiseCreateTariffForms() {
      this.addTariffForm = this.formBuilder.group({
  
        name: ["", [
          Validators.required
        ]],
      });
    }
  
    initialiseDistrictForms() {
      this.districtForm = this.formBuilder.group({
  
        name: ["", [
          Validators.required
        ]],
        localGovt: ["", [
          Validators.required
        ]],
      });
  
      this.editdistrictForm = this.formBuilder.group({
  
        name: ["", [
          Validators.required
        ]],
        localGovt: ["", [
          Validators.required
        ]],
      });
  
    }
    initialiseCreateBillingForms() {
      this.billingGroupForm = this.formBuilder.group({
  
        // type: ["", [
        //   Validators.required
        // ]],
        name: ["", [
          Validators.required
        ]],
        billtype: ["", [Validators.required]],
        subBillTypes: ["", [Validators.required]],
        consumercategory: ["", [Validators.required]],
        consumerSubcategory: ["", [Validators.required]],
        billingCycle: ["", [Validators.required]],
        computationType: ["", [Validators.required]],
        tariffTypes: ["", [Validators.required]],
        subtariffTypes: ["", [Validators.required]],
        rate: ["", [Validators.required]],
      });
    }
    initialiseupdateBillingForms() {
      this.updateBillingForm = this.formBuilder.group({
  
        type: ["", [
          Validators.required
        ]],
        billtype: ["", [Validators.required]],
        subBillTypes: ["", [Validators.required]],
        consumercategory: ["", [Validators.required]],
        consumerSubcategory: ["", [Validators.required]],
        billingCycle: ["", [Validators.required]],
        computationType: ["", [Validators.required]],
        tariffTypes: ["", [Validators.required]],
        subtariffTypes: ["", [Validators.required]],
        rate: ["", [Validators.required]],
      });
    }
    intialiseTableProperties() {
      this.modalOptions = {
        backdrop: true,
        centered: true,
        backdropClass: "customBackdrop",
        size: "lg",
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
      this.dtOptionsPopUpDistZones= {
        paging: false,
        pagingType: "full_numbers",
        responsive: true,
        pageLength: 5,
        lengthMenu: [5, 10, 30, 50, 100],
        lengthChange: false,
        processing: false,
        ordering: false,
        info: false,
        language: { search: "", searchPlaceholder: "Search Records" },
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
      };
    }
    getTariffTypes() {
      this.waterService.getTariffTypes().subscribe((data: any) => { this.tariffTypes = data.response; },);
    }
    getBillTypes() {
      this.waterService.getBillTypes().subscribe((data: any) => { this.billTypes = data.response; },);
    }
    getSubBillType() {
      this.waterService.getSubBillType().subscribe((data: any) => { this.subbillTypes = data.response; },);
    }
    getConsumerCategory() {
      this.waterService.getConsumerCategory().subscribe((data: any) => { this.consumercatgryTypes = data.response; },);
    }
    getBillingCycles() {
      this.waterService.getBillingCycles().subscribe((data: any) => { this.billingcycles = data.response; },);
    }
    getComputationType() {
      this.waterService.getComputationType().subscribe((data: any) => { this.computationData = data.response; },);
    }
    getSubTariffType(tariffID:any) {
      this.waterService.getSubTariffTypeById(tariffID).subscribe((data: any) => { this.subtariffType = data.response; },);
    }
  
    getConsumerSubCategory() {
      this.waterService.getConsumerSubCategory().subscribe((data: any) => { this.consumerSubCategory = data.response; },);
    }
  
    getLocalGovernment() {
      this.waterService.getLocalGovernment().subscribe((data: any) => { this.localGovtData = data.response; },);
    }
  
    category(activeTab: string, $event: MouseEvent): void {
      this.currentPageLength=10;
      this.currentBillingPageLength= 10;
      this.router.navigate(["/billingbillstructure"]);
        this.config = {
          currentPage: 1,
          itemsPerPage: 10,
        };
        
      $event.preventDefault();
      this.activeTab = activeTab;
    }
  
    tariff(activeTab: string, $event: MouseEvent): void {
      this.currentPageLength=10;
      this.currentBillingPageLength= 10;
      this.router.navigate(["/billingbillstructure"]);
        this.config = {
          currentPage: 1,
          itemsPerPage: 10,
        };
      this.getTariff();
      $event.preventDefault();
      this.activeTab = activeTab;
    }
  
    subtariff(activeTab: string, $event: MouseEvent): void {
      this.currentPageLength=10;
      this.currentBillingPageLength= 10;
  
    this.router.navigate(["/billingbillstructure"]);
        this.config = {
          currentPage: 1,
          itemsPerPage: 10,
        };
      this.getTariff();
      this.viewSubtariff(this.subtariff)
      $event.preventDefault();
      this.activeTab = activeTab;
    }
    getCategory() {
      this.ngxService.start();
  
      this.apiUrl = `${environment.AUTHAPIURL}admins/categories/list`;
      const reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
      });
  
      this.httpClient
        .get<any>(this.apiUrl, { headers: reqHeader })
        .subscribe((data) => {
          this.categoryListData = data.response;
        });
      this.ngxService.stop();
    }
    district(activeTab: string, $event: MouseEvent): void {
      this.currentPageLength=10;
      this.currentBillingPageLength= 10;
      this.router.navigate(["/billingbillstructure"]);
     
      this.config = {
        currentPage: 1,
        itemsPerPage: 10,
      };
     
      this.getDistrict(this.config.itemsPerPage, this.config.currentPage);
      $event.preventDefault();
      this.activeTab = activeTab;
    }
    billlingGroup(activeTab: string, $event: MouseEvent): void {
      this.currentPageLength=10;
      this.currentBillingPageLength= 10;
      this.router.navigate(["/billingbillstructure"]);
       this.config = {
        currentPage: 1,
        itemsPerPage: 10,
      };
   
      this.getBillingGroup(this.config.itemsPerPage, this.config.currentPage);
      $event.preventDefault();
      this.activeTab = activeTab;
    }
  
  
    showTariff() {
      this.getTariff();
    }
    getTariff() {
      this.ngxService.start();
  
      this.apiUrl = `${environment.AUTHAPIURL}admins/tariffs/list`;
      const reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
      });
  
      this.httpClient
        .get<any>(this.apiUrl, { headers: reqHeader })
        .subscribe((data) => {
          this.tariffListData = data.response;
        });
      this.ngxService.stop();
    }
  
    viewsubTariff(selectedsubTariff: any) {
      this.subtariff = selectedsubTariff.id
      this.modalService.dismissAll();
      // this.tabName = '';
      // // this.ro
      // this.tabName = 'tab1';
      this.viewSubtariff(this.subtariff)
    }
  
    getTariffByID($event:any){
      this.subtarrifId = $event?.target.value;
      this.getSubTariffType(this.subtarrifId)
     
    }
    getTariffBytarifId(tariffid:any){
     this.tariffName = this.tariffListData.filter((i: any) => i.id == tariffid)[0].name;
      return this.tariffName;
  
    }
    viewSubtariff(subtariff: any) {
  
      this.ngxService.start();
      this.apiUrl = `${environment.AUTHAPIURL}admins/tariffs/sub-tariffs/list`
  
      const reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("niswasec_access_token"),
      });
  
      this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe((data) => {
        this.subtariffData = data.response;
        this.ngxService.stop();
      });
    }
    keyPressNumbersWithDecimal(event: any) {
      var charCode = event.which ? event.which : event.keyCode;
      if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
        return false;
      }
      return true;
    }
  
    viewSubCategory(modal: any, subcategory: any) {
      this.selectedSubcategory = subcategory.id;
      this.viewSubCatgry(this.selectedSubcategory);
      this.showModal(modal);
    }
    viewSubCatgry(selectedSubcategory: any) {
  
      this.subcategoryId = selectedSubcategory;
      this.ngxService.start();
      this.apiUrl = `${environment.AUTHAPIURL}admins/categories/sub-categories/list?category_id=${this.subcategoryId}`
  
      const reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("niswasec_access_token"),
      });
  
      this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe((data) => {
        this.subCategoryData = data.response;
        this.ngxService.stop();
      });
    }
  
  
  
    onEditTariff(modal: any, selectedData: any) {
      this.submitted = false;
      this.selectedTariffId = selectedData.id;
      this.editTariffForm = this.formBuilder.group({
        name: [selectedData.name, [
          Validators.required
        ]],
      });
      this.showModal(modal);
    }
  
    updateAdmin(formAllData: any) {
      this.submitted = true;
      if (this.editTariffForm.invalid) {
        return;
      }
      let requestObj = {
        tariff_id: this.selectedTariffId,
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
          this.getTariff();
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
  
  
    createBilling(modal: any) {
      this.modalOptions.size = 'xl';
      this.submitted3 = false;
      this.initialiseCreateBillingForms();
      this.showModal(modal);
    }
    createTariff(modal: any) {
      this.modalOptions.size = 'xl';
      this.submitted1 = false;
      this.showModal(modal);
      this.initialiseCreateTariffForms();
    }
    createSubTariff(modal: any) {
      this.getTariff();
      this.initialisesubTariffForms();
      this.submitted1 = false;
      this.showModal(modal);
    }
  
    createDistrictZones(modal: any) { 
      this.initialisecreateZoneDistrict();
      this.submittedZoneDistrict = false;
      this.showModal(modal); 
    }
    onAddzoneDistt(formAllData: any) {
        this.submittedZoneDistrict = true;
        if (this.createZoneDistrictForm.invalid) {
          return;
        }
        let requestObj = {
          name: formAllData.name,
          district_id:this.selectedDistrictZoneId
        };
        this.apiUrl = `${environment.AUTHAPIURL}admins/districts/zones/create
        `;
    
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
            this.getTariff();
            this.initialiseCreateTariffForms();
            this.submittedZoneDistrict = false;
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
  
      oneditzoneDistt(formAllData: any) {
        this.submittededitZoneDistrict = true;
        if (this.editZoneDistrictForm.invalid) {
          return;
        }
        let requestObj = {
          name: formAllData.name,
          district_id:this.editdistId,
          zone_id:this.editZoneId
        };
        this.apiUrl = `${environment.AUTHAPIURL}admins/districts/zones/update
        `;
    
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
            this.initialiseEditZoneDistrict();
            this.submittededitZoneDistrict = false;
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
      createRound(modal:any){
        this.showModal(modal);
        this.submittedRound = false;
        this.initialisecreateRoundtForm();
        this.zoneRound = this.selectedZoneId
      }
      onAddRound(formAllData: any) {
        this.submittedRound = true;
        if (this.createRoundForm.invalid) {
          return;
        }
        let requestObj = {
          name: formAllData.name,
          zone_id:this.zoneRound
        };
        this.apiUrl = `${environment.AUTHAPIURL}admins//rounds/create
        `;
    
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
            this.initialisecreateRoundtForm();
            this.submittedRound = false;
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
  
    
    onAddTariff(formAllData: any) {
      this.submitted1 = true;
      if (this.addTariffForm.invalid) {
        return;
      }
      let requestObj = {
        name: formAllData.name,
      };
      this.apiUrl = `${environment.AUTHAPIURL}admins/tariffs/create`;
  
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
          this.getTariff();
          this.initialiseCreateTariffForms();
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
  
  
    onAddDistrict(formAllData: any) {
      this.submitted1 = true;
      if (this.districtForm.invalid) {
        return;
      }
      let requestObj = {
        name: formAllData.name,
        local_government_id: formAllData.localGovt
      };
      this.apiUrl = `${environment.AUTHAPIURL}admins/districts/create`;
  
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
          this.getDistrict(this.config.itemsPerPage, this.config.currentPage);
          this.initialiseDistrictForms();
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
    onAddsubTariff(formAllData: any) {
      this.submitted1 = true;
      if (this.subTariffForm.invalid) {
        return;
      }
      let requestObj = {
        name: formAllData.name,
        tariff_id: formAllData.tariff,
      };
      this.apiUrl = `${environment.AUTHAPIURL}admins/tariffs/sub-tariffs/create`;
  
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
          this.initialisesubTariffForms();
          this.submitted1 = false;
          this.viewSubtariff(this.subtariff);
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
    updateSubTariff(modal:any,selectedSubtariff:any){
      this.modalOptions.size = 'lg';
      this.updateSubTariffSubmit = false;
      this.selectedSubTariffId = selectedSubtariff.id;
 
  
      this.initialiseUpdatesubTariffForms();
      this.updatesubTariffForm = this.formBuilder.group({
        name: [selectedSubtariff.name, [
          Validators.required
        ]],
      });
      this.showModal(modal);
    }
    onEditsubTariff(formAllData: any) {
      this.updateSubTariffSubmit = true;
      if (this.updatesubTariffForm.invalid) {
        return;
      }
      let requestObj = {
        name: formAllData.name,
        sub_tariff_id: this.selectedSubTariffId,
      };
      this.apiUrl = `${environment.AUTHAPIURL}admins/tariffs/sub-tariffs/update`;
  
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
          this.initialiseUpdatesubTariffForms();
          this.updateSubTariffSubmit = false;
          this.viewSubtariff(this.subtariff);
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
    onChangeBill($event: any) {
      this.billTypeValue = this.billTypes.filter((i: any) => i.id == $event.target.value)[0].name;
    }
    onAddBilling(formAllData: any) {
      this.submitted3 = true;
      if (this.billingGroupForm.invalid) {
        return;
      }
      let requestObj = {
        type: this.billTypeValue.toUpperCase(),
        bill_type_id: formAllData.billtype,
        sub_bill_type_id: formAllData.subBillTypes,
        consumer_category_id: formAllData.consumercategory,
        consumer_sub_category_id: formAllData.consumerSubcategory,
        billing_cycle_id: formAllData.billingCycle,
        computation_type_id: formAllData.computationType,
        tariff_type_id: formAllData.tariffTypes,
        sub_tariff_type_id: formAllData.subtariffTypes,
        rate: formAllData.rate,
        name: formAllData.name,
      };
      this.apiUrl = `${environment.AUTHAPIURL}admins/billing/group/create`;
  
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
          this.initialiseCreateBillingForms();
          this.submitted3 = false;
          this.getBillingGroup(this.config.itemsPerPage,
            this.config.currentPage);
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
    onEditsubCategory(modal: any, selectedData: any) {
      this.submitted = false;
      
      this.selectedsubCategoryId = selectedData.id;
      this.editSubcategoryForm = this.formBuilder.group({
        name: [selectedData.name, [
          Validators.required
        ]],
        category: [selectedData.category_id, [
          Validators.required
        ]],
      });
      this.showModal(modal);
    }
    updatesubCategory(formAllData: any) {
      this.submitted = true;
      if (this.editSubcategoryForm.invalid) {
        return;
      }
      let requestObj = {
        category_id: formAllData.category,
        name: formAllData.name,
        id:this.selectedsubCategoryId
      };
      this.apiUrl = `${environment.AUTHAPIURL}admins/categories/sub-categories/update`;
  
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
          this.getCategory();
          this.initialisesubCategoryForms();
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
  
    onAddsubCategory(formAllData: any) {
      this.submitted = true;
      if (this.createSubcategoryForm.invalid) {
        return;
      }
      let requestObj = {
        name: formAllData.name,
        category_id:formAllData.category,
      };
      this.apiUrl = `${environment.AUTHAPIURL}admins/categories/sub-categories/create`;
  
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
          this.getCategory();
          this.initialisecreatesubCategoryForms();
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
  
    createsubCategory(modal: any) {
      this.initialisecreatesubCategoryForms();
      this.modalOptions.size = 'xl';
      this.submitted = false;
      this.showModal(modal);
    }
    viewSubTariff(selectedSubTariff: any) {
      this.subtariffId = selectedSubTariff;
      this.ngxService.start();
  
      this.apiUrl = `${environment.AUTHAPIURL}admins/tariffs/sub-tariffs/list?tariff_id=${this.subtariffId}`;
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
  
    onEditBill(modal: any, selectedData: any) {
      this.submitted = false;
      this.modalOptions.size = 'xl';
   
      this.billGroupId = selectedData.id;
      this.updateBillingForm = this.formBuilder.group({
        name: [selectedData.name,
        ],
        type: [selectedData.type, [
          Validators.required
        ]],
        billtype: [selectedData.bill_type_id, [Validators.required]],
        subBillTypes: [selectedData.sub_bill_type_id, [Validators.required]],
        consumercategory: [selectedData.consumer_category_id, [Validators.required]],
        consumerSubcategory: [selectedData.consumer_sub_category_id, [Validators.required]],
        billingCycle: [selectedData.billing_cycle_id, [Validators.required]],
        computationType: [selectedData.computation_type_id, [Validators.required]],
        tariffTypes: [selectedData.tariff_type_id, [Validators.required]],
        subtariffTypes: [selectedData.sub_tariff_type_id, [Validators.required]],
        rate: [selectedData.rate
          , [Validators.required]],
      });
     
      this.getSubTariffType(selectedData.tariff_type_id);
      
      this.selectedVal = selectedData.consumer_category_id
      if (this.selectedVal == 1) {
        this.subCategory = this.consumerSubCategory.filter((i: any) => i.id == this.selectedVal)
      }
      if (this.selectedVal == 2) {
        this.subCategory = this.consumerSubCategory.filter((i: any) => i.id !== 1)
      }
      this.showModal(modal);
    }
  
    updateBill(formAllData: any) {
      this.submitted3 = true;
  
      if (this.updateBillingForm.invalid) {
        return;
      }
      let requestObj = {
        bill_group_id: this.billGroupId,
        type: formAllData.type,
        bill_type_id: formAllData.billtype,
        sub_bill_type_id: formAllData.subBillTypes,
        consumer_category_id: formAllData.consumercategory,
        consumer_sub_category_id: formAllData.consumerSubcategory,
        billing_cycle_id: formAllData.billingCycle,
        computation_type_id: formAllData.computationType,
        tariff_type_id: formAllData.tariffTypes,
        sub_tariff_type_id: formAllData.subtariffTypes,
        rate: formAllData.rate,
  
      };
      this.apiUrl = `${environment.AUTHAPIURL}admins/billing/group/update`;
  
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
          this.getBillingGroup(this.config.itemsPerPage,
            this.config.currentPage);
          this.initialiseupdateBillingForms();
          this.submitted3 = false;
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
    showDistrict() {
      this.config = {
        currentPage: 1,
        itemsPerPage: 10,
      };
      this.getDistrict(this.config.itemsPerPage, this.config.currentPage);
    }
    getDistrict(perpage: any, pageno: any) {
      this.ngxService.start();
  
      this.apiUrl = `${environment.AUTHAPIURL}admins/districts/list?per_page=${perpage}&page=${pageno}`;
      const reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
      });
  
      this.httpClient
        .get<any>(this.apiUrl, { headers: reqHeader })
        .subscribe((data) => {
          this.districtListData = data.response.items;
          this.config.totalItems = data.response?.totalItems;
          this.config.currentPage = data.response?.currentPage
        });
      this.ngxService.stop();
    }
    public setItemsPerPageDistrict($event: any) {
      this.config.itemsPerPage = $event;
      this.config.currentPage = 1;
      this.currentPageLength = this.config.itemsPerPage;
      this.router.navigate(["/billingbillstructure"]);
      this.getDistrict(this.config.itemsPerPage, 1);
    }
    pageChange(newPage: number) {
    
      if(this.activeTab == 'district'  && !this.singlezoneData){
        this.router.navigate(["/billingbillstructure"], {
          queryParams: { page: newPage },
        });
        this.getDistrict(this.config.itemsPerPage, newPage);
      }  
      if(this.singleDistrictzoneData && document.getElementById('districtZones')) {
        this.router.navigate(["/billingbillstructure"], {
        });
        this.viewDistrictZone(this.selectedDistrictZone, this.configDistZone.itemsPerPage, newPage)
      }
      if(this.singlezoneData) {
        this.router.navigate(["/billingbillstructure"], {
        });
        this.viewSingleDistrictZone(this.selectedZone,this.configZone.itemsPerPage,newPage);
      }
      if (this.activeTab == 'billlingGroup'){
        this.router.navigate(["/billingbillstructure"], {
          queryParams: { page: newPage },
        });
        this.getBillingGroup(this.config.itemsPerPage, newPage);
      }
    }
    clearPAge(){
     
    }
    
    getBillingGroup(perpage: any, pageno: any) {
      this.ngxService.start();
  
      this.apiUrl = `${environment.AUTHAPIURL}admins/billing/group/list?per_page=${perpage}&page=${pageno}`;
      const reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
      });
  
      this.httpClient
        .get<any>(this.apiUrl, { headers: reqHeader })
        .subscribe((data) => {
          this.billingListData = data.response.items;
          this.config.totalItems = data.response?.totalItems;
          this.config.currentPage = data.response?.currentPage
        });
      this.ngxService.stop();
    }
  
    viewDistZones(modal: any, selected: any) {
      this.selectedDistrictZone = selected.id;
      
      this.configDistZone = {
        currentPage: 1,
        itemsPerPage: 10,
        id: 'distZonePaging',
      };
      this.viewDistrictZone(this.selectedDistrictZone, this.configDistZone.itemsPerPage, this.configDistZone.currentPage);
      this.showModal(modal);
    }
  
    viewDistrictZone(selectedDistZoneId: any, perpage: any, pageno: any) {
      this.selectedDistrictZoneId  = selectedDistZoneId
      this.ngxService.start();
      this.apiUrl = `${environment.AUTHAPIURL}admins/districts/zones?district_id=${selectedDistZoneId}&per_page=${perpage}&page=${pageno}`
  
      const reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("niswasec_access_token"),
      });
  
      this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe((data) => {
        this.singleDistrictzoneData = data.response.items;
        this.configDistZone.totalItems = data.response.totalItems;
        this.configDistZone.currentPage = data.response?.currentPage;
    
        this.ngxService.stop();
      });
    }
    viewSingleZone(modal: any, selectedZoneId: any) {
      this.selectedZone = selectedZoneId.id;
  
      this.configZone = {
        currentPage: 1,
        itemsPerPage: 10,
        id: 'zonePaging',
      };
      this.viewSingleDistrictZone(this.selectedZone,this.configZone.itemsPerPage,this.configZone.currentPage);
      this.viewSingleDistZone(this.selectedZone);
      this.showModal(modal);
    }
    viewSingleDistZone(selectedZoneId: any) {
      this.ngxService.start();
      this.apiUrl = `${environment.AUTHAPIURL}admins/districts/zones/single?zone_id=${selectedZoneId}`
  
      const reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("niswasec_access_token"),
      });
  
      this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe((data) => {
        this.singleZoneData = data.response;
       
        this.ngxService.stop();
      });
    }
    viewSingleDistrictZone(selectedZoneId: any,perpage:any,pageno:any) {
      this.ngxService.start();
      this.selectedZoneId = selectedZoneId ;
      this.apiUrl = `${environment.AUTHAPIURL}admins/rounds/list?per_page=${perpage}&page=${pageno}&zone_id=${selectedZoneId}`
  
      const reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("niswasec_access_token"),
      });
  
      this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe((data) => {
        this.singlezoneData = data.response.items;
        this.configZone.totalItems = data.response.totalItems;
        this.configZone.currentPage = data.response?.currentPage
        this.ngxService.stop();
      });
    }
    viewEditSingleZone(modal:any,data:any){
 
     this.editZoneId = data.id;
     this.editdistId = data.district_id;
     this.submittededitZoneDistrict = false
     this.editZoneDistrictForm = this.formBuilder.group({
      name: [data.name, [
        Validators.required
      ]],
      districtId: [""],
      zoneId:[""],
    });
    this.showModal(modal);
    }
  
    viewEditRound(modal:any,data:any){
     
     this.edittZoneId = data.zone_id;
     this.editRoundId = data.id;
     this.submittededitRound = false
     this.updteRoundForm = this.formBuilder.group({
      name: [data.name, [
        Validators.required
      ]],
      districtId: [""],
      zoneId:[""],
    });
    this.showModal(modal);
    }
  
    
    
  
    updateRound(formAllData: any) {
      this.submittededitRound = true;
      if (this.updteRoundForm.invalid) {
        return;
      }
      let requestObj = {
        name: formAllData.name,
        round_id:this.editRoundId,
        zone_id:this.edittZoneId
      };
      this.apiUrl = `${environment.AUTHAPIURL}admins/rounds/update
      `;
  
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
          this.initialiseupdteRoundForm();
          this.submittededitRound = false;
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
    createDistrict(modal: any) {
      this.initialiseDistrictForms();
      this.showModal(modal);
    }
  
    onEditDistrict(modal: any, selectedData: any) {
      this.submitted1 = false;
      
  
      this.selectedDistt = selectedData.id;
      this.editdistrictForm = this.formBuilder.group({
        name: [selectedData.name, [
          Validators.required
        ]],
        localGovt: [selectedData.local_government.id, [
          Validators.required
        ]],
      });
      this.showModal(modal);
    }
    onChange($event: any) {
      this.selectedVal = $event?.target.value
      if (this.selectedVal == 1) {
        this.subCategory = this.consumerSubCategory.filter((i: any) => i.id == this.selectedVal)
      }
      if (this.selectedVal == 2) {
        this.subCategory = this.consumerSubCategory.filter((i: any) => i.id !== 1)
      }
    }
  
    updateDistt(formAllData: any) {
      this.submitted = true;
      if (this.editdistrictForm.invalid) {
        return;
      }
      let requestObj = {
        district_id: this.selectedDistt,
        local_government_id: formAllData.localGovt,
        name: formAllData.name
      };
      this.apiUrl = `${environment.AUTHAPIURL}admins/districts/update`;
  
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
          this.getDistrict(this.config.itemsPerPage, this.config.currentPage);
          this.initialiseDistrictForms();
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
  
    
    onDeleteItem(selectedData: any) {
      this.selectedsubCategoryId = selectedData.id;
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Delete Sub Category!",
      }).then((result) => {
        if (result.value) {
          this.deleteItemList(this.selectedsubCategoryId);
        }
      });
  
    }
    deleteItemList(subCategory: any) {
  
      var reqObj = {
        id: subCategory,
      }
      this.apiUrl = `${environment.AUTHAPIURL}admins/categories/sub-categories/delete`;
  
      const reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("niswasec_access_token"),
      });
  
      this.ngxService.start();
      this.httpClient.post<any>(this.apiUrl, reqObj, { headers: reqHeader }).subscribe((data) => {
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
          this.subCategoryData = "";
          this.categoryListData = "";
          
          this.getCategory();
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
    public setItemsPerPageBilling($event: any) {
      this.config.itemsPerPage = $event;
      this.config.currentPage = 1;
      this.currentBillingPageLength = this.config.itemsPerPage;
      this.router.navigate(["/billingbillstructure"]);
      this.getBillingGroup(this.config.itemsPerPage, 1);
    }
    pageChangeBilling(newPage: number) {
      this.router.navigate(["/billingbillstructure"], {
        queryParams: { page: newPage },
      });
      this.getBillingGroup(this.config.itemsPerPage, newPage);
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
  
  
  
  
  
  
  