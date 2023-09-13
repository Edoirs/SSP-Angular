import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CommonService } from 'src/app/common.service';
import { SessionService } from 'src/app/session.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-headprofilerequests',
  templateUrl: './headprofilerequests.component.html',
  styleUrls: ['./headprofilerequests.component.css']
})
export class HeadprofilerequestsComponent implements OnInit {
  apiUrl: string | undefined;
  config: any
  currentPageLength: any = 10;
  title = 'angulardatatables';
  dtOptions: any = {};
  consumerCategory:any
  closeResult: string = '';
  submitted!: boolean
  modalOptions!: NgbModalOptions;
  profileReqData:any;
  consumerSubCategory:any
  subCategoryData:any
  singleProfileId:any
  singleProfileReqData:any
  dtOptionsPopUp1: any = {};
  currentProfileData:any
  updatedProfileData:any
  approvalstatus:any
  approvalstatusId:any
  profilingStatus:any
  localGovtData:any
  distData:any
  localGovernmentId:any
  distId:any
  categoryData:any
  billingCycle:any
  billingCycleId:any
  tariffTypes:any
  subtariffTypes:any
  tariffData:any
  subtariffData:any
  billTypeData:any
  billType:any
  profilingStatusId:any
  
  constructor(private modalService: NgbModal,
    private httpClient: HttpClient, public datepipe: DatePipe,
    private router: Router, private sess: SessionService,
    private ngxService: NgxUiLoaderService, private waterService: CommonService,
    private route: ActivatedRoute, ) { }

  ngOnInit(): void {
    this.sess.isHeadOfICTA();
    this.intialiseTableProperties();
    this.getConsumerSubCategory();
    this.getApprovalStatus();
    this.getLocalGovernment();
    this.getprofilingStatus();
    this.getConsumerCategory();
    this.getBillingCycles();
    this.getTariffTypes();
    this.getSubTariffType();
    this.getBillTypes();

    this.config = {
      currentPage: 1,
      itemsPerPage: 10,
    };

    this.route.queryParams.subscribe(
      (params) =>
        (this.config.currentPage = params["page"] ? params["page"] : 1)
    );
    this.getProfilingRequests(this.config.itemsPerPage, this.config.currentPage);
  }
  getConsumerSubCategory() {
    this.waterService.getConsumerSubCategory().subscribe((data: any) => { this.consumerSubCategory = data.response; },);
  }

  getApprovalStatus() {
    this.waterService.getApprovalStatus().subscribe((data: any) => { this.approvalstatus = data.response; },);
  }
  getLocalGovernment() {
    this.waterService.getLocalGovernment().subscribe((data: any) => { this.localGovtData = data.response; },);
  }

  getprofilingStatus() {
    this.waterService.getprofilingStatus().subscribe((data: any) => { this.profilingStatus = data.response; },);
  }
  getBillingCycles() {
    this.waterService.getBillingCycles().subscribe((data: any) => { this.billingCycle = data.response; },);
  }
  getTariffTypes() {
    this.waterService.getTariffTypes().subscribe((data: any) => { this.tariffTypes = data.response; },);
  }
  getSubTariffType() {
    this.waterService.getSubTariffType().subscribe((data: any) => { this.subtariffTypes = data.response; },);
  }
  getBillTypes() {
    this.waterService.getBillTypes().subscribe((data: any) => { this.billType = data.response; },);
  }
  intialiseTableProperties() {
    this.modalOptions = {
      backdrop: true,
      centered: true,
      backdropClass: "customBackdrop",
      size: "xl",
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
          className: 'btn btn-outline-dark',
          text: '<i class="fas fa-file-pdf"> PDF</i>',
          orientation: 'landscape',
          pageSize: 'LEGAL',
        }
      ],
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
  }

  getProfilingRequests(perpage: any, pageno: any) {
    this.profileReqData = '';
    this.ngxService.start();

    this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/profiling-requests?per_page=${perpage}&page=${pageno}`;
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });

    this.httpClient
      .get<any>(this.apiUrl, { headers: reqHeader })
      .subscribe((data) => {
        this.profileReqData = data.response.items;
        this.config.totalItems = data.response?.totalItems;
        this.config.currentPage = data.response?.currentPage;
      });
    this.ngxService.stop();
  }

  getConsumerSubCategoryById(subCategoryId: any) {
    this.subCategoryData = this.consumerSubCategory?.filter((i: any) => i.id == subCategoryId)[0]?.name;
    return this.subCategoryData;
  }

  getbillTypeById(billType: any) {
    this.billTypeData = this.billType?.filter((i: any) => i.id == billType)[0]?.name;
    return this.billTypeData;
  }
  getTariffId(tariff: any) {
    this.tariffData = this.tariffTypes?.filter((i: any) => i.id == tariff)[0]?.name;
    return this.tariffData;
  }

  getSubtariff(subtariff:any){
    this.subtariffData = this.subtariffTypes?.filter((i: any) => i.id == subtariff)[0]?.name;
    return this.subtariffData;
  }
  getbillingCycleById(billCycle: any) {
    this.billingCycleId = this.billingCycle?.filter((i: any) => i.id == billCycle)[0]?.name;  
    return this.billingCycleId;
  }

  getApprovalById(approvalStatusId: any) {
    this.approvalstatusId = this.approvalstatus?.filter((i: any) => i.id == approvalStatusId)[0]?.name;
    return this.approvalstatusId;
  }
  getprofilingStatusById(profilingStatusId: any) {
    this.profilingStatusId = this.profilingStatus.filter((i: any) => i.id == profilingStatusId)[0]?.name;
    return this.profilingStatusId;
  }
  getLocalGovernmentById(localGovt: any) {
    this.localGovernmentId = this.localGovtData?.filter((i: any) => i.id == localGovt)[0]?.name;
    return this.localGovernmentId;

  }
  getDistricts() {
    let localGovernmentId = this.localGovernmentId;
    this.waterService.getDistricts(localGovernmentId).subscribe((data: any) => { this.distData = data.response; },);
  }
  getConsumerCategory(){
    this.waterService.getConsumerCategory().subscribe((data: any) => { this.consumerCategory = data.response; },);
  }
  getDistrictsById(distId:any){
    this.distId = this.distData?.filter((i: any) => i.id == distId)[0]?.name;
    return this.distId;
  }
  getConsumerCategoryById(categoryId: any) {
    this.categoryData = this.consumerCategory?.filter((i: any) => i.id == categoryId)[0]?.name;
    return this.categoryData;
  }
  public setItemsPerPage($event: any) {
    this.config.itemsPerPage = $event;
    this.config.currentPage = 1;
    this.currentPageLength = this.config.itemsPerPage;
    this.router.navigate(["/headprofilerequest"]);
    this.getProfilingRequests(this.config.itemsPerPage, 1);
  }

  pageChange(newPage: number) {
      this.router.navigate(["/headprofilerequest"], {
        queryParams: { page: newPage },
      });
      this.getProfilingRequests(this.config.itemsPerPage, newPage);
    }

    viewSingleProfile(modal:any,profileData:any){
      this.singleProfileId = profileData.id;
      this.getSingleProfilingRequests(this.singleProfileId);
      this.showModal(modal);
    }
    getSingleProfilingRequests(singleProfileId:any) {
      this.ngxService.start();
  
      this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/single-profiling-request?profiling_request_id=${singleProfileId}`;
      const reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
      });
  
      this.httpClient
        .get<any>(this.apiUrl, { headers: reqHeader })
        .subscribe((data) => {
          this.currentProfileData = data.response.current_profile;
          this.updatedProfileData = data.response.proposed_updates;
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

    onSelectProfile(profileData: any) {
      this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/toggle-profiling-request`;
      let requestObj = {
        profiling_request_id: profileData.id,
        profile_status_id: profileData.profile_status_id,
      }
  
      const reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("niswasec_access_token"),
      });
  
      this.ngxService.start();
      this.httpClient.post<any>(this.apiUrl, requestObj, { headers: reqHeader }).subscribe((data) => {
  
        if (data.status == true) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
          });
          this.ngxService.stop();
          this.getProfilingRequests(this.config.itemsPerPage, this.config.currentPage);
        
          this.modalService.dismissAll();
        }
        else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: data.message,
            showConfirmButton: true,
            timer: 5000,
          });
          this.ngxService.stop();
        }
      });
    }
  
}
