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
  selector: 'app-billingprofile',
  templateUrl: './billingprofile.component.html',
  styleUrls: ['./billingprofile.component.css']
})
export class BillingprofileComponent{

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
  tariffTypes: any;
  searchForm!: FormGroup
  viewDetailsform!: FormGroup
  userId: any;
  tariffListData: any;
  perpage: any;
  searchObject: any;
  keywords: any
  fields: any
  consumerCategory: any
  consumerData: any
  pageno: any
  selectedConsumer: any
  submittedEditConsumer!: boolean
  submitted1!: boolean
  submittedsearchRas!: boolean
  submittedOnboard!: boolean
  submittedSelect!: boolean
  submittedonboardConsumerForm!: boolean
  submittedDetails!: boolean
  singleConsumerData: any
  searchedConsumerData: any
  searchConsumerForm!: FormGroup
  linkAssetForm!: FormGroup
  onboardConsumerForm!: FormGroup
  titlesData: any;
  occupationData: any;
  countriesData: any;
  maritalStatusData: any;
  genderData: any;
  minDate: any;
  date: any;
  consumercatgryTypes: any;
  consumerSubCategory: any;
  stateData: any;
  localGovtData: any;
  taxOfficeData: any;
  companyTypeData: any;
  selectForm!: FormGroup
  onboardCorporateForm!: FormGroup
  industrySector: any;
  selectedVal: any;
  activeTab: any;
  consumerDetailsForm!: FormGroup
  niswacdetails: any;
  niswasecDetailsData: any;
  billingCycle: any;
  bill: any
  submittedCreate!: boolean
  connectionStatus: any;
  distData: any;
  assetData: any;
  zoneData: any;
  subtariffTypes: any;
  roundData: any;
  approvalstatus: any;
  billType: any;
  billGroup: any;
  searchAssetForm!: FormGroup
  submittedSearchAsset!: boolean
  subCategory: any;
  buildingData: any;
  searchedAssetData: any;
  landOwnershipData: any;
  tariffTypeId: any
  submittedAsseets!: boolean;
  flag: any
  flagType: any
  genderId: any
  maritalId: any
  nationalityId: any
  occupationId: any
  splitedName: any
  submittedLinkAsset!: boolean
  enabled: boolean = true;
  townData: any;
  buildingPurpose: any;
  buildingOccupancy: any;
  buildingOwnership: any;
  buildingCompletion: any;
  selectedConsumerId: any;
  assetNiswasecData: any
  lgaData: any
  wardData: any
  townModified: any
  mod: any
  RasZones: any
  townsData: any
  modifiedDate: any
  modifiedMin: any;
  selectedAsset: any
  selectedAssetId: any;
  searchAsseetsForm: any;
  editNiswasecId: any
  landPurpose: any
  landOccupancy: any
  landAllocationData: any
  isRASonboarding!: boolean
  submittedNewAsset!: boolean
  linkNewAssetForm!: FormGroup
  selectedAssetName: any;
  selectedLgaName: any
  editNiswasecDetailform!: FormGroup
  createNiswasecProfileform!: FormGroup
  submittedonboardCorporateForm!: boolean
  subtarrifId: any;
  subtariffType: any;
  approvalstatusId: any;
  profilingStatus: any;
  selectedApproval: any;
  statesData: any;
  localGovermntData: any;
  localeGovtData: any;
  currentPageRasLength: any = 10;
  currentPageConsumerLength: any = 10;

  constructor(private modalService: NgbModal,
    private httpClient: HttpClient, public datepipe: DatePipe,
    private router: Router, private sess: SessionService,
    private ngxService: NgxUiLoaderService, private waterService: CommonService,
    private route: ActivatedRoute, private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.sess.isbillingOfficer();
    this.getbuildingPurposes();
    this.getLandPurposes();
    this.getbuildingOwnerships();
    this.getbuildingOccupancy();
    this.getbuildingCompletions();
    this.getBillingCycles();
    this.initialiseForms();
    this.getLandOwnership();
    this.initialiseSearchForms();
    this.getTariffTypes();
    this.intialiseTableProperties();
    this.getCountries();
    this.getOccupations();
    this.getMaritalStatus();
    this.getGender();
    this.getTitle();
    this.getConsumerCategory();
    this.getConsumerSubCategory();
    this.initialiseOnboardConsumerForms();
    this.getLocalGovernment();
    this.getTaxOffices();
    this.getState();
    this.getCompanyType();
    this.initialiseSelectForms();
    this.initialiseSearchAssetForms();
    this.getIndustrySectors();
    this.initialiseConsumerdetailsForms();
    this.initialiseNiswasecDetailsForms();
    this.getConnectionStatus();
    this.getAssetTypes();
    this.getApprovalStatus();
    this.getApprovalStatusbyid();
    this.initialiseCreateNiswasecForms();
    this.getBillTypes();
    this.getBuildingTypes();
    this.getSubTariffType();
    this.getLandOccupancy();
    this.initialiselinkAssetForm();
    this.getLandAllocations();
    this.getRasZones();
    this.initialiseAssetsSeachForms();
    this.initialiseCreateAssetForm();
    this.getprofilingStatus();

    this.activeTab = 'consumerDetails';

    this.userId = localStorage.getItem('niswasec_role_id')
    this.config = {
      currentPage: 1,
      itemsPerPage: 10,
    };

    this.route.queryParams.subscribe(
      (params) =>
        (this.config.currentPage = params["page"] ? params["page"] : 1)
    );
    this.getConsumer(this.config.itemsPerPage, this.config.currentPage);

    let dte = new Date();
    this.modifiedDate = dte.setFullYear(dte.getFullYear() - 15);
    this.date = this.datepipe.transform(this.modifiedDate, "yyyy-MM-dd");
    this.modifiedMin = dte.setFullYear(1900, 1, 1),
      this.minDate = this.datepipe.transform(this.modifiedMin, "yyyy-MM-dd");
  }
  initialiseForms() {
    this.searchForm = this.formBuilder.group({
      keyword: ["", [
        Validators.required
      ]],
    });
  }
  initialiseAssetsSeachForms() {
    this.searchAsseetsForm = this.formBuilder.group({
      keyword: ["", [
        Validators.required
      ]],
    });
  }
  initialiseSelectForms() {
    this.selectForm = this.formBuilder.group({
      consumercategory: ["", [
        Validators.required
      ]],
    });
  }
  initialiseSearchAssetForms() {
    this.searchAssetForm = this.formBuilder.group({
      keyword: ["", [
        Validators.required
      ]],
      assetType: ["", [
        Validators.required
      ]],
    });
  }
  initialiseSearchForms() {
    this.searchConsumerForm = this.formBuilder.group({
      field: ["", [
        Validators.required
      ]],
      keyword: ["", [
        Validators.required
      ]],
      category: ["", [
        Validators.required
      ]],
    });
  }
  initialiselinkAssetForm() {
    this.linkAssetForm = this.formBuilder.group({
      assetType: ["", [
        Validators.required
      ]],
      assetName: ["", [
        Validators.required
      ]],
      assetReference: ["", [
        Validators.required
      ]],
      houseNumber: ["", [
        Validators.required
      ]],
      streetName: ["", [
        Validators.required
      ]],
      offStreetName: ["", [
        Validators.required
      ]],
      ward: ["", [
        Validators.required
      ]],
      town: ["", [
        Validators.required
      ]],
      lga: ["", [
        Validators.required
      ]],
      buildingcompletion: ["", [
        Validators.required
      ]],
      buildingPurpose: ["", [
        Validators.required
      ]],
      buildingOccupancy: ["", [
        Validators.required
      ]],
      buildingOwnership: ["", [
        Validators.required
      ]],

      landPurpose: ["", [
        Validators.required
      ]],
      landOccupancy: ["", [
        Validators.required
      ]],
      landOwnership: ["", [
        Validators.required
      ]],
      landAllocation: ["", [
        Validators.required
      ]],
      buildingType: ["", [
        Validators.required
      ]],
      zone: ["", [
        Validators.required
      ]],
      mode: ["", [
        Validators.required
      ]],
    });
  }
  initialiseCreateAssetForm() {
    this.linkNewAssetForm = this.formBuilder.group({
      assetType: ["", [
        Validators.required
      ]],
      assetName: ["", [
        Validators.required
      ]],
      houseNumber: ["", [
        Validators.required
      ]],
      streetName: ["", [
        Validators.required
      ]],
      offStreetName: ["", [
        Validators.required
      ]],
      ward: ["", [
        Validators.required
      ]],
      town: ["", [
        Validators.required
      ]],
      lga: ["", [
        Validators.required
      ]],
      buildingcompletion: ["", [
        Validators.required
      ]],
      buildingPurpose: ["", [
        Validators.required
      ]],
      buildingOccupancy: ["", [
        Validators.required
      ]],
      buildingOwnership: ["", [
        Validators.required
      ]],

      landPurpose: ["", [
        Validators.required
      ]],
      landOccupancy: ["", [
        Validators.required
      ]],
      landOwnership: ["", [
        Validators.required
      ]],
      landAllocation: ["", [
        Validators.required
      ]],
      buildingType: ["", [
        Validators.required
      ]],
      zone: ["", [
        Validators.required
      ]],
      mode: ["", [
        Validators.required
      ]],
    });
  }

  initialiseNiswasecDetailsForms() {
    this.editNiswasecDetailform = this.formBuilder.group({
      localGovtId: ["", [
        Validators.required
      ]],
      district: ["", [
        Validators.required
      ]],
      zone: ["", [
        Validators.required
      ]],
      round: ["", [
        Validators.required
      ]],
      tariff: ["", [
        Validators.required
      ]],
      subtariff: ["", [
        Validators.required
      ]],
      billingGroup: ["", [
        Validators.required
      ]],
      lastbill: ["", [
        Validators.required
      ]],
      meterNumber: ["", [
        Validators.required,
        Validators.maxLength(11),
      ]],
      address: [
        "",
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.minLength(6),
        ],
      ],
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
  initialiseCreateNiswasecForms() {
    this.createNiswasecProfileform = this.formBuilder.group({
      consumerReference: new FormControl({ value: "", disabled: true }, [
        Validators.required
      ]),
      meterNumber: ["", [
        Validators.required,
        Validators.maxLength(11),
      ]],
      connectionStatus: ["", [
        Validators.required
      ]],
      localGovtId: ["", [
        Validators.required
      ]],
      district: ["", [
        Validators.required
      ]],
      asset: ["", [
        Validators.required
      ]],
      zone: ["", [
        Validators.required
      ]],
      consumercategory: ["", [
        Validators.required
      ]],
      consumerSubcategory: ["", [
        Validators.required
      ]],
      tariff: ["", [
        Validators.required
      ]],
      subtariff: ["", [
        Validators.required
      ]],
      billingGroup: ["", [
        Validators.required
      ]],
      round: ["", [
        Validators.required
      ]],
      address: [
        "",
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.minLength(6),
        ],
      ],
      billType: [""],
    });
  }
  initialiseOnboardConsumerForms() {
    this.onboardConsumerForm = this.formBuilder.group({
      bvn: ["", [
        Validators.minLength(11),
        Validators.maxLength(11),
      ]],
      tin: ["", [
        Validators.minLength(11),
        Validators.maxLength(11),
      ]],
      nin: ["", [
        Validators.minLength(11),
        Validators.maxLength(11),
      ]],
      taxpayerId: [""],
      emailAddress: ["", [
        Validators.required,
        Validators.maxLength(40),
        Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
      ]],
      title: ["", [
        Validators.required
      ]],
      firstName: ["", [
        Validators.required,
        Validators.pattern("^[A-Za-z]+[A-Za-z ]*$"),
        Validators.maxLength(30),
      ]],
      middleName: ["",
        [
          Validators.pattern("^[A-Za-z]+[A-Za-z ]*$"),
          Validators.maxLength(30),
        ],
      ],
      lastName: ["",
        [
          Validators.required,
          Validators.pattern("^[A-Za-z]+[A-Za-z ]*$"),
          Validators.maxLength(30),
        ],
      ],
      dateOfBirth: ["", [
        Validators.required
      ]],
      occupation: ["", [
        Validators.required
      ]],
      gender: ["", [
        Validators.required
      ]],
      maritalStatus: ["", [
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
      countryId: ["", [Validators.required]],
      stateId: ["", [Validators.required]],
      localGovtId: ["", [Validators.required]],
      taxoffc: ["", [Validators.required]],
      mode: ["", [Validators.required]],
      consumercategory: ["", [Validators.required]],
      consumerSubcategory: ["", [Validators.required]],
      address: [
        "",
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.minLength(6),
        ],
      ],
    });


    this.onboardCorporateForm = this.formBuilder.group({

      tin: ["", [
        Validators.minLength(11),
        Validators.maxLength(11),
      ]],

      taxpayerId: [""],
      emailAddress: ["", [
        Validators.required,
        Validators.maxLength(40),
        Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
      ]],
      title: ["", [
        Validators.required
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
      dateOfBirth: ["", [
        Validators.required
      ]],
      occupation: ["", [
        Validators.required
      ]],
      gender: ["", [
        Validators.required
      ]],
      maritalStatus: ["", [
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
      countryId: ["", [Validators.required]],
      stateId: ["", [Validators.required]],
      localGovtId: ["", [Validators.required]],
      taxoffc: ["", [Validators.required]],
      mode: ["", [Validators.required]],
      consumercategory: ["", [Validators.required]],
      consumerSubcategory: ["", [Validators.required]],
      address: [
        "",
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.minLength(6),
        ],
      ],
      cacNumber: ["", [Validators.required,
      Validators.maxLength(8),
      Validators.pattern("^[A-Za-z]{2}[0-9]{6}"),]],
      companyType: ["", [Validators.required]],
      industrySector: ["", [Validators.required]],
      companyName: ["", [Validators.required]],
      companyAddress: [
        "",
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.minLength(6),
        ],
      ],
    });
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
      companyType:[""]
    });


    this.onboardCorporateForm = this.formBuilder.group({

      tin: ["", [
        Validators.minLength(11),
        Validators.maxLength(11),
      ]],

      emailAddress: ["", [
        Validators.required,
        Validators.maxLength(40),
        Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
      ]],
      title: ["", [
        Validators.required
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
      dateOfBirth: ["", [
        Validators.required
      ]],

      occupation: ["", [
        Validators.required
      ]],


      gender: ["", [
        Validators.required
      ]],

      maritalStatus: ["", [
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
      countryId: ["", [Validators.required]],
      stateId: ["", [Validators.required]],
      localGovtId: ["", [Validators.required]],
      taxoffc: ["", [Validators.required]],
      mode: ["", [Validators.required]],
      consumercategory: ["", [Validators.required]],
      consumerSubcategory: ["", [Validators.required]],
      address: [
        "",
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.minLength(6),
        ],
      ],
      cacNumber: ["", [Validators.required,
      Validators.maxLength(8),
      Validators.pattern("^[A-Za-z]{2}[0-9]{6}"),]],
      companyType: ["", [Validators.required]],
      industrySector: ["", [Validators.required]],
      companyName: ["", [Validators.required]],
      companyAddress: [
        "",
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.minLength(6),
        ],
      ],
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
      //  language: { search: "", searchPlaceholder: "Search Records" },
      dom:
        "<'row'<'col-sm-4'l><'col-sm-4 text-center'B><'col-sm-4'f>>" +
        "<'row'<'col-sm-12 table-responsive'tr>>" +
        "<'row'<'col-sm-5'i><'col-sm-7'p>>",
      buttons: [
        {
          extend: "csv",
          className: "btn btn-success font-12 export-btn mb-4",
          text: '<i class="fas fa-file-csv"> CSV</i>',
          exportOptions: { columns: [0, 1, 2, 3, 4, 5] },
        },
        {
          extend: "excel",
          className: "btn btn-success font-12 export-btn mb-4",
          text: '<i class="fas fa-file-excel"> Excel</i>',
          exportOptions: { columns: [0, 1, 2, 3, 4, 5] },
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
          className: "btn btn-success font-12 export-btn mb-4",
          text: '<i class="fas fa-file-csv"> CSV</i>',
          exportOptions: { columns: [0, 1, 2, 3, 4] },
        },
        {
          extend: "excel",
          className: "btn btn-success font-12 export-btn mb-4",
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
  getBillingCycles() {
    this.waterService.getBillingCycles().subscribe((data: any) => { this.billingCycle = data.response; },);
  }
  getBillTypes() {
    this.waterService.getBillTypes().subscribe((data: any) => { this.billType = data.response; },);
  }
  getLandOwnership() {
    this.waterService.getLandOwnership().subscribe((data: any) => { this.landOwnershipData = data.response; },);
  }
  getLandAllocations() {
    this.waterService.getLandAllocations().subscribe((data: any) => { this.landAllocationData = data.response; },);
  }
  getGender() {
    this.waterService.getGender().subscribe((data: any) => { this.genderData = data.response; },);
  }
  getBuildingTypes() {
    this.waterService.getBuildingTypes().subscribe((data: any) => { this.buildingData = data.response; },);
  }
  getbuildingPurposes() {
    this.waterService.getbuildingPurposes().subscribe((data: any) => { this.buildingPurpose = data.response; },);
  }
  getLandPurposes() {
    this.waterService.getLandPurposes().subscribe((data: any) => { this.landPurpose = data.response; },);
  }
  getbuildingOccupancy() {
    this.waterService.getbuildingOccupancy().subscribe((data: any) => { this.buildingOccupancy = data.response; },);
  }
  getLandOccupancy() {
    this.waterService.getLandOccupancy().subscribe((data: any) => { this.landOccupancy = data.response; },);
  }
  getbuildingOwnerships() {
    this.waterService.getbuildingOwnerships().subscribe((data: any) => { this.buildingOwnership = data.response; },);
  }
  getRasZones() {
    this.waterService.getRasZones().subscribe((data: any) => { this.RasZones = data.response; },);
  }
  getbuildingCompletions() {
    this.waterService.getbuildingCompletions().subscribe((data: any) => { this.buildingCompletion = data.response; },);
  }
  getMaritalStatus() {
    this.waterService.getMaritalStatus().subscribe((data: any) => { this.maritalStatusData = data.response; },);
  }
  getOccupations() {
    this.waterService.getOccupations().subscribe((data: any) => { this.occupationData = data.response; },);
  }
  getCountries() {
    this.waterService.getCountries().subscribe((data: any) => { this.countriesData = data.response; },);
  }
  getStates() {
    let countryId = this.onboardCorporateForm.get('countryId')!.value;
    this.waterService.getStatesByID(countryId).subscribe((data: any) => { this.stateData = data.response; },);
  }
  getStatesByID() {
    let countryId = this.onboardConsumerForm.get('countryId')!.value;
    this.waterService.getStatesByID(countryId).subscribe((data: any) => { this.stateData = data.response; },);
  }

  getState(){
    this.waterService.getState().subscribe((data: any) => { this.statesData = data.response; },);
  }
  getLocalGovtByID() {
    let countryId = this.onboardCorporateForm.get('stateId')!.value;
    this.waterService.getLocalGovtByID(countryId).subscribe((data: any) => { this.localGovermntData = data.response; },);
  }
  getLocalGovermnttByID() {
    let countryId = this.onboardConsumerForm.get('stateId')!.value;
    this.waterService.getLocalGovtByID(countryId).subscribe((data: any) => { this.localeGovtData = data.response; },);
  }

  getAssetTypes() {
    this.waterService.getAssetTypes().subscribe((data: any) => { this.assetData = data.response.filter((i: any) => i.id != 1); },);
  }
  getLocalGovernment() {
    this.waterService.getLocalGovernment().subscribe((data: any) => { this.localGovtData = data.response; },);
  }
  getDistricts() {
    let localGovernmentId = this.createNiswasecProfileform.get('localGovtId')!.value;
    this.waterService.getDistricts(localGovernmentId).subscribe((data: any) => { this.distData = data.response; },);
  }
  getRASTowns(lgaId: any) {
    this.waterService.getRASTowns(lgaId).subscribe((data: any) => { this.townData = data.response.filter((i: any) => i.id == this.townModified); },);
  }
  getRASTownsById(lgaId: any) {
    this.waterService.getRASTowns(lgaId).subscribe((data: any) => {
      this.townsData = data.response
    },);
  }
  getRASWards(townId: any) {
    this.waterService.getRASWards(townId).subscribe((data: any) => { this.wardData = data.response; },);
  }
  getZone() {
    let district = this.createNiswasecProfileform.get('district')!.value;
    this.waterService.getZone(district).subscribe((data: any) => { this.zoneData = data.response; },);
  }
  getRound() {
    let zone = this.createNiswasecProfileform.get('zone')!.value;
    this.waterService.getRound(zone).subscribe((data: any) => { this.roundData = data.response; },);
  }
  getRoundData() {
    let zone = this.viewDetailsform.get('zone')!.value;
    this.waterService.getRound(zone).subscribe((data: any) => { this.roundData = data.response; },);
  }
  getRoundDataById() {
    let zone = this.editNiswasecDetailform.get('zone')!.value;
    this.waterService.getRound(zone).subscribe((data: any) => { this.roundData = data.response; },);
  }
  getDistrictsData() {
    let localGovernmentId = this.viewDetailsform.get('localGovtId')!.value;
    this.waterService.getDistricts(localGovernmentId).subscribe((data: any) => { this.distData = data.response; },);
  }
  getDistrictsDataById() {
    let localGovernmentId = this.editNiswasecDetailform.get('localGovtId')!.value;
    this.waterService.getDistricts(localGovernmentId).subscribe((data: any) => { this.distData = data.response; },);
  }
  getZoneData() {
    let district = this.viewDetailsform.get('district')!.value;
    this.waterService.getZone(district).subscribe((data: any) => { this.zoneData = data.response; },);
  }
  getZoneDatabyId() {
    let district = this.editNiswasecDetailform.get('district')!.value;
    this.waterService.getZone(district).subscribe((data: any) => { this.zoneData = data.response; },);
  }
  getprofilingStatus() {
    this.waterService.getprofilingStatus().subscribe((data: any) => { this.profilingStatus = data.response; },);
  }

  getTaxOffices() {
    this.waterService.getTaxOffices().subscribe((data: any) => { this.taxOfficeData = data.response; },);
  }

  getCompanyType() {
    this.waterService.getCompanyType().subscribe((data: any) => { this.companyTypeData = data.response; },);
  }
  getConsumerCategory() {
    this.waterService.getConsumerCategory().subscribe((data: any) => { this.consumercatgryTypes = data.response; },);
  }
  getConsumerSubCategory() {
    this.waterService.getConsumerSubCategory().subscribe((data: any) => { this.consumerSubCategory = data.response; },);
  }
  getIndustrySectors() {
    this.waterService.getIndustrySectors().subscribe((data: any) => { this.industrySector = data.response; },);
  }
  getConnectionStatus() {
    this.waterService.getConnectionStatus().subscribe((data: any) => { this.connectionStatus = data.response; },);
  }
  getTariffTypes() {
    this.waterService.getTariffTypes().subscribe((data: any) => { this.tariffTypes = data.response; },);
  }

  getSubTariffType() {
    this.waterService.getSubTariffType().subscribe((data: any) => { this.subtariffTypes = data.response; },);
  }
  getSubTariffTypeById(tariffID: any) {
    this.waterService.getSubTariffTypeById(tariffID).subscribe((data: any) => { this.subtariffType = data.response; },);
  }

  getbillgroups() {
    this.tariffTypeId = this.createNiswasecProfileform.get('tariff')!.value;
    let subTariffTypeId = this.createNiswasecProfileform.get('subtariff')!.value;
    let billType = this.createNiswasecProfileform.get('billType')!.value;
    this.waterService.getbillgroups(this.tariffTypeId, subTariffTypeId, billType).subscribe((data: any) => { this.billGroup = data.response; },);

    if (this.tariffTypeId == 1) {
      this.createNiswasecProfileform.controls['meterNumber'].setValidators([Validators.required]);
    } else {
      this.createNiswasecProfileform.controls['meterNumber'].clearValidators();
    }
    this.createNiswasecProfileform.controls['meterNumber'].updateValueAndValidity();
  }
  getbillgroup() {
    this.tariffTypeId = this.editNiswasecDetailform.get('tariff')!.value;
    let subTariffTypeId = this.editNiswasecDetailform.get('subtariff')!.value;
    let billType = this.editNiswasecDetailform.get('billType')!.value;
    this.waterService.getbillgroups(this.tariffTypeId, subTariffTypeId, billType).subscribe((data: any) => { this.billGroup = data.response; },);

    if (this.tariffTypeId == 1) {
      this.createNiswasecProfileform.controls['meterNumber'].setValidators([Validators.required]);
    } else {
      this.createNiswasecProfileform.controls['meterNumber'].clearValidators();
    }
    this.createNiswasecProfileform.controls['meterNumber'].updateValueAndValidity();
  }
  getbillgroupsbyId(tariffTypeId:any,subTariffTypeId:any,billType:any) {
 
    this.waterService.getbillgroups(tariffTypeId, subTariffTypeId, billType).subscribe((data: any) => { this.billGroup = data.response; },);

    if (tariffTypeId == 1) {
      this.editNiswasecDetailform.controls['meterNumber'].setValidators([Validators.required]);
    } else {
      this.editNiswasecDetailform.controls['meterNumber'].clearValidators();
    }
    this.editNiswasecDetailform.controls['meterNumber'].updateValueAndValidity();
  }

  getApprovalStatus() {
    this.waterService.getApprovalStatus().subscribe((data: any) => { this.approvalstatus = data.response; },);
  }

  getApprovalStatusbyid() {
    this.waterService.getApprovalStatus().subscribe((data: any) => { this.approvalstatusId = data.response.filter((i: any) => i.id != 3); },);
  }
  consumerDetails(activeTab: string, $event: MouseEvent): void {
    $event.preventDefault();
    this.activeTab = activeTab;
  }
  getTariffByID($event: any) {
    this.subtarrifId = $event?.target.value;
    this.getSubTariffTypeById(this.subtarrifId)

  }
  niswasecDetails(activeTab: string, $event: MouseEvent): void {
    $event.preventDefault();
    this.activeTab = activeTab;
  }
  consumerAsset(activeTab: string, $event: MouseEvent): void {
    $event.preventDefault();
    this.activeTab = activeTab;
  }
  getConsumer(perpage: any, pageno: any) {
    this.ngxService.start();

    this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/list?per_page=${perpage}&page=${pageno}&keywords=${''}`;
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });

    this.httpClient
      .get<any>(this.apiUrl, { headers: reqHeader })
      .subscribe((data) => {
        this.consumerData = data.response.items;
        this.config.totalItems = data.response?.totalItems;
      });
    this.ngxService.stop();
  }
  public setItemsPerPageRas($event: any) {
    this.config.itemsPerPage = $event;
    this.config.currentPage = 1;
    this.currentPageRasLength = this.config.itemsPerPage;
    this.router.navigate(["/billingprofile"]);
    this.onSubmitAssetSearch(this.config.itemsPerPage, 1);
  }
  public setItemsPerPage($event: any) {
    this.config.itemsPerPage = $event;
    this.config.currentPage = 1;
    this.currentPageLength = this.config.itemsPerPage;
    this.router.navigate(["/billingprofile"]);
    this.getConsumer(this.config.itemsPerPage, 1);
  }
  keyPressNumbersWithDecimal(event: any) {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  disableDate() {
    return false;
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

  onSubmitSearch(formAllData: any) {
    this.submitted = true;
    if (this.searchForm.invalid) {
      return;
    }
    this.config = {
      currentPage: 1,
      itemsPerPage: 10,
    };
    this.keywords = formAllData.keyword;
    this.perpage = this.config.itemsPerPage,
      this.pageno = this.config.currentPage,
      this.ngxService.start();

    this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/list?per_page=${this.perpage}&page=${this.pageno}&keywords=${this.keywords}`;
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });

    this.httpClient
      .get<any>(this.apiUrl, { headers: reqHeader })
      .subscribe((data) => {
        this.consumerData = data.response.items;
        this.config.totalItems = data.response?.totalItems;
      });
    this.ngxService.stop();
  }



  viewSingleConsumer(modal: any, selected: any) {
    this.activeTab = 'consumerDetails';
    this.selectedConsumer = selected.reference;
    this.selectedConsumerId = selected.consumer_category_id;
    
    this.viewSingleConsumerList(this.selectedConsumer);
    this.onSubmitAsseetsSearch();
    this.showModal(modal);
  }
  viewSingleConsumerList(selectedConsumer: any) {
    this.niswacdetails = "";
    this.ngxService.start();
    this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/single?consumer_reference=${selectedConsumer}`

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("niswasec_access_token"),
    });

    this.httpClient.get<any>(this.apiUrl, { headers: reqHeader }).subscribe((data) => {
      this.singleConsumerData = data.response.consumer_details;
      this.consumerDetailsForm = this.formBuilder.group({
        taxpayerReference: new FormControl({ value: this.singleConsumerData.taxpayer_reference, disabled: true }, [
          Validators.required
        ]),
        title: new FormControl({ value: this.singleConsumerData.title_id, disabled: true }, [
          Validators.required
        ]),
        firstName: new FormControl({ value: this.singleConsumerData.first_name, disabled: true }, [
          Validators.required
        ]),
        middleName: new FormControl({ value: this.singleConsumerData.middle_name, disabled: true }, [
          Validators.required
        ]),
        lastName: new FormControl({ value: this.singleConsumerData.last_name, disabled: true }, [
          Validators.required
        ]),
        emailAddress: new FormControl({ value: this.singleConsumerData.email, disabled: true }, [
          Validators.required
        ]),
        phoneNumber: new FormControl({ value: this.singleConsumerData.phone, disabled: true }, [
          Validators.required
        ]),
        gender: new FormControl({ value: this.singleConsumerData.gender_id, disabled: true }, [
          Validators.required
        ]),
        countryId: new FormControl({ value: this.singleConsumerData.nationality_id, disabled: true }, [
          Validators.required
        ]),
        stateId: new FormControl({ value: this.singleConsumerData.state_id, disabled: true }, [
          Validators.required
        ]),
        localGovtId: new FormControl({ value: this.singleConsumerData.local_government_id, disabled: true }, [
          Validators.required
        ]),
        dateOfBirth: new FormControl({
          value: this.datepipe.transform(
            this.singleConsumerData.date_of_birth,
            "yyyy-MM-dd"), disabled: true
        }, [Validators.required]),
        maritalStatus: new FormControl({ value: this.singleConsumerData.marital_status_id, disabled: true }, [
          Validators.required
        ]),
        occupation: new FormControl({ value: this.singleConsumerData.occupation_id, disabled: true }, [
          Validators.required
        ]),
        consumercategory: new FormControl({ value: this.singleConsumerData.consumer_category_id, disabled: true }, [
          Validators.required
        ]),
        consumerSubcategory: new FormControl({ value: this.singleConsumerData.consumer_sub_category_name, disabled: true }, [
          Validators.required
        ]),
        companyName: new FormControl({ value: this.singleConsumerData.company_name, disabled: true }, [
          Validators.required
        ]),
        companyAddress: new FormControl({ value: this.singleConsumerData.company_address, disabled: true }, [
          Validators.required
        ]),
        address: new FormControl({ value: this.singleConsumerData.address, disabled: true }, [
          Validators.required
        ]),
        industrySector: new FormControl({ value: this.singleConsumerData.industry_sector_id, disabled: true }, [
          Validators.required
        ]),
       
        companyType: new FormControl({ value: this.singleConsumerData?.company_type_id, disabled: true }),
        cac: new FormControl({ value: this.singleConsumerData.cac_number, disabled: true }),
        bvn: new FormControl({ value: this.singleConsumerData.bvn, disabled: true }),
        tin: new FormControl({ value: this.singleConsumerData.tin, disabled: true }),
        nin: new FormControl({ value: this.singleConsumerData.nin, disabled: true }),
      });

      this.niswacdetails = data.response.consumer_profiles;
      this.approvalstatusId = this.niswacdetails.approval_status_id;
      this.ngxService.stop();
    });
  }

  clearAsseetsSearch() {
    this.searchObject = {};
    this.searchAsseetsForm.reset();
    this.submittedAsseets = false;
    this.initialiseAssetsSeachForms();

  }
  clearSearch() {
    this.searchObject = {};
    this.searchForm.reset();
    this.submitted = false;
    this.initialiseForms();
    this.consumerData = "";
    this.getConsumer(this.config.itemsPerPage, this.config.currentPage);
  }
  getBill(billCycle: any) {
    this.bill = this.billingCycle.filter((i: any) => i.id == billCycle)[0].name;

    return this.bill;
  }
  viewNISWADetails(modal: any, selectedData: any) {
    this.showModal(modal)
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
      billGroup:new FormControl({ value: selectedData.bill_group_id , disabled: true }, [
        Validators.required
      ]),
    });
    this.getbillgroupsbyId(selectedData.tariff_type_id,selectedData.sub_tariff_type_id,selectedData.bill_type_id)
   
    this.getDistrictsData();
    this.getZoneData();
    this.getRoundData();
  }
  onEdit(modal: any, selectedData: any) {
    this.initialiseNiswasecDetailsForms();
    this.submittedEditConsumer = false;
    this.editNiswasecId = selectedData.id;
    this.showModal(modal)
    this.niswasecDetailsData = selectedData;
    this.editNiswasecDetailform = this.formBuilder.group({
      billingCycle: new FormControl({ value: selectedData.billing_cycle_id, disabled: true }, [
        Validators.required
      ]),
      meterNumber: [selectedData.meter_number, [
        Validators.required
      ]],
      address: [selectedData.connection_address,
      [
        Validators.required,
        Validators.maxLength(200),
        Validators.minLength(6),
      ]],
      localGovtId: [selectedData.local_government_id, [
        Validators.required
      ]],
      district: [selectedData.district_id, [
        Validators.required
      ]],
      zone: [selectedData.zone_id, [
        Validators.required
      ]],
      round: [selectedData.round_id, [
        Validators.required
      ]],
      tariff: [selectedData.tariff_type_id, [
        Validators.required
      ]],
      subtariff: [selectedData.sub_tariff_type_id, [
        Validators.required
      ]],
      billingGroup: [selectedData.bill_group_id, [
        Validators.required
      ]],
      billType: [selectedData.bill_type_id, [
       
      ]],
      lastbill: [
        this.datepipe.transform(
          selectedData.last_billed_at,
          "yyyy-MM-dd"
        ),
       [
        Validators.required
      ]],
    });
    this.getbillgroupsbyId(selectedData.tariff_type_id,selectedData.sub_tariff_type_id,selectedData.bill_type_id)
    this.getSubTariffTypeById(selectedData.tariff_type_id)
    this.getLocalGovernment();
    this.getDistrictsDataById();
    this.getZoneDatabyId();
    this.getRoundDataById();
  }
  oneditNiswasecDetail(formAllData: any) {
    this.submittedEditConsumer = true;
    if (this.editNiswasecDetailform.invalid) {
      return;
    }
    let requestObj = {
      consumer_profile_id: this.editNiswasecId,
      meter_number: formAllData.meterNumber,
    //  billing_cycle_id: formAllData.billingCycle,
      connection_address: formAllData.address,
  
      local_government_id: formAllData.localGovtId,
      district_id: formAllData.district,
      zone_id: formAllData.zone,
      round_id: formAllData.round,
      bill_group_id: formAllData.billingGroup,
      last_billed_at: formAllData.lastbill
    };
    this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/update-profile`;

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
        this.initialiseNiswasecDetailsForms();
        this.submittedEditConsumer = false;
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
  addtNiswasecProfile(formAllData: any) {
    this.submittedCreate = true;
    if (this.createNiswasecProfileform.invalid) {
      return;
    }
    let requestObj = {

      consumer_reference: this.selectedConsumer,
      consumer_asset_id: formAllData.asset,
      meter_number: formAllData.meterNumber,
      connection_address: formAllData.address,
      local_government_id: formAllData.localGovtId,
      district_id: formAllData.district,
      zone_id: formAllData.zone,
      round_id: formAllData.round,
      consumer_category_id: formAllData.consumercategory,
      consumer_sub_category_id: formAllData.consumerSubcategory,
      tariff_type_id: formAllData.tariff,
      sub_tariff_type_id: formAllData.subtariff,
      bill_group_id: formAllData.billingGroup,
      connection_status_id: formAllData.connectionStatus,

    };
    this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/create-profile`;

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
        this.initialiseCreateNiswasecForms();
        this.submittedCreate = false;
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
  onboardConsumer(modal: any) {
    this.submittedsearchRas = false;
    this.searchObject = {};
    this.searchConsumerForm.reset();
    this.submitted1 = false;
    this.searchedConsumerData = "";
    this.initialiseSearchForms();
    this.initialiseOnboardConsumerForms();
    this.currentPageConsumerLength = 10;
    this.showModal(modal);
  }
  

  onSubmitRASConsumerSearch(){
    this.onSubmitConsumerSearch(this.config.itemsPerPage, this.config.currentPage);
  }

  onSubmitConsumerSearch(perpage: any, pageno: any) {
    this.searchedConsumerData = "";
    this.submittedsearchRas = true;
    if (this.searchConsumerForm.invalid) {
      return;
    }

    this.ngxService.start();

    this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/search?keywords=${this.searchConsumerForm.get('keyword')!.value}&consumer_category=${this.searchConsumerForm.get('category')!.value}&field=${this.searchConsumerForm.get('field')!.value}&per_page=${perpage}&page=${pageno}`;
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });

    this.httpClient
      .get<any>(this.apiUrl, { headers: reqHeader })
      .subscribe((data) => {
        this.ngxService.stop();
        if (data.status == true && data.response != null) {
          this.searchedConsumerData = data.response.data;
          this.config.totalItems = data.response?.total;
          this.config.currentPage = data.response?.current_page;
          this.submittedsearchRas = false;
        }
        else if (data.response == null) {
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
        else if (data.status == false) {
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


  clearSearch1() {
    this.searchObject = {};
    this.searchConsumerForm.reset();
    this.submitted1 = false;
    this.searchedConsumerData = "";
    this.initialiseSearchForms();
  }
  onboardingConsumer(modal: any) {
    this.isRASonboarding = false;
    this.submittedonboardConsumerForm = false;
    this.initialiseSelectForms();
    //  this.initialiseSearchForms();
    this.showModal(modal);
  }
  removeCheckedValues() {
    this.initialiseOnboardConsumerForms();
  }
  onChange($event: any) {
    this.initialiseOnboardConsumerForms();

    this.selectedVal = $event?.target.value
    if (this.selectedVal == 1) {
      this.subCategory = this.consumerSubCategory.filter((i: any) => i.id == this.selectedVal)
    }
    if (this.selectedVal == 2) {
      this.subCategory = this.consumerSubCategory.filter((i: any) => i.id !== 1)
    }
  }
  createProfile(modal: any) {
    this.initialiseCreateNiswasecForms();
    this.submittedCreate = false;
    this.showModal(modal);
  }
  consumerOnboard(formData: any) {
    this.submittedonboardConsumerForm = true;

    this.onboardConsumerForm.get('mode')!.setValue("EXISTING");
    this.onboardConsumerForm.get('consumercategory')!.setValue(this.selectedVal);
    if (this.onboardConsumerForm.invalid) {
      return;
    }
    if (this.isRASonboarding == true && this.selectForm.controls['consumercategory'].value == 1) {

      let requestObj = {
        bvn: formData.bvn,
        tin: formData.tin,
        nin: formData.nin,
        taxpayer_id: formData.taxpayerId,
        title_id: formData.title,
        gender_id: formData.gender,
        nationality_id: formData.countryId,
        state_id: formData.stateId,
        consumer_category_id: this.selectedVal,
        consumer_sub_category_id: formData.consumerSubcategory,
        local_government_id: formData.localGovtId,
        marital_status_id: formData.maritalStatus,
        occupation_id: formData.occupation,
        tax_office_id: formData.taxoffc,
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        email: formData.emailAddress,
        phone: formData.phoneNumber,
        date_of_birth: formData.dateOfBirth,
        address: formData.address,
        mode: "EXISTING",
        taxpayer_type_id: formData.consumercategory,
      };

      this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/onboard`;

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
          this.initialiseOnboardConsumerForms();
          this.submittedonboardConsumerForm = false;
          this.modalService.dismissAll();
          this.consumerData = '';
          this.getConsumer(this.config.itemsPerPage, this.config.currentPage);

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

    if (this.isRASonboarding == false && this.selectForm.controls['consumercategory'].value == 1) {

      let requestObj = {
        bvn: formData.bvn,
        tin: formData.tin,
        nin: formData.nin,
        title_id: formData.title,
        gender_id: formData.gender,
        nationality_id: formData.countryId,
        state_id: formData.stateId,
        consumer_category_id: this.selectedVal,
        consumer_sub_category_id: formData.consumerSubcategory,
        local_government_id: formData.localGovtId,
        marital_status_id: formData.maritalStatus,
        occupation_id: formData.occupation,
        tax_office_id: formData.taxoffc,
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        email: formData.emailAddress,
        phone: formData.phoneNumber,
        date_of_birth: formData.dateOfBirth,
        address: formData.address,
        mode: "NEW",

      };

      this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/onboard`;

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
          this.initialiseOnboardConsumerForms();
          this.submittedonboardConsumerForm = false;
          this.modalService.dismissAll();
          this.consumerData = '';
          this.getConsumer(this.config.itemsPerPage, this.config.currentPage);

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
  }


  corporateOnboard(formData: any) {
    this.submittedonboardCorporateForm = true;
    this.onboardCorporateForm.get('mode')!.setValue("EXISTING");
    this.onboardCorporateForm.get('consumercategory')!.setValue(this.selectedVal);
    if (this.onboardCorporateForm.invalid) {
      return;
    }
    if (this.isRASonboarding == true && this.selectForm.controls['consumercategory'].value == 2) {
      let requestObj = {
        taxpayer_id: formData.taxpayerId,

        tin: formData.tin,

        title_id: formData.title,
        gender_id: formData.gender,
        nationality_id: formData.countryId,
        state_id: formData.stateId,
        consumer_category_id: this.selectedVal,
        consumer_sub_category_id: formData.consumerSubcategory,
        local_government_id: formData.localGovtId,
        marital_status_id: formData.maritalStatus,
        occupation_id: formData.occupation,
        tax_office_id: formData.taxoffc,
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        email: formData.emailAddress,
        phone: formData.phoneNumber,
        date_of_birth: formData.dateOfBirth,
        address: formData.address,
        mode: "EXISTING",
        cac_number: formData.cacNumber,
        company_type_id: formData.companyType,
        company_name: formData.companyName,
        company_address: formData.companyAddress,
        industry_sector_id: formData.industrySector,
        taxpayer_type_id: formData.consumercategory,
      };

      this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/onboard`;

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
          this.initialiseOnboardConsumerForms();
          this.submittedonboardCorporateForm = false;
          this.consumerData = '';
          this.modalService.dismissAll();
          this.getConsumer(this.config.itemsPerPage, this.config.currentPage);

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
    if (this.isRASonboarding == false && this.selectForm.controls['consumercategory'].value == 2) {
      let requestObj = {

        tin: formData.tin,

        title_id: formData.title,
        gender_id: formData.gender,
        nationality_id: formData.countryId,
        state_id: formData.stateId,
        consumer_category_id: this.selectedVal,
        consumer_sub_category_id: formData.consumerSubcategory,
        local_government_id: formData.localGovtId,
        marital_status_id: formData.maritalStatus,
        occupation_id: formData.occupation,
        tax_office_id: formData.taxoffc,
        first_name: formData.firstName,
        middle_name: formData.middleName,
        last_name: formData.lastName,
        email: formData.emailAddress,
        phone: formData.phoneNumber,
        date_of_birth: formData.dateOfBirth,
        address: formData.address,
        mode: "NEW",
        cac_number: formData.cacNumber,
        company_type_id: formData.companyType,
        company_name: formData.companyName,
        company_address: formData.companyAddress,
        industry_sector_id: formData.industrySector,

      };

      this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/onboard`;

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
          this.initialiseOnboardConsumerForms();
          this.submittedonboardCorporateForm = false;
          this.modalService.dismissAll();
          this.consumerData = '';
          this.getConsumer(this.config.itemsPerPage, this.config.currentPage);

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
  }

  changeStatus(selectedId: any, status: any) {
    if (status == '4') {
      this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/approve-profile`;
    }
    if (status == '5') {
      this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/profile`;
    }
    else {
      this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/disapprove-profile`;
    }

    let requestObj = {
      consumer_profile_id: selectedId
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

        //   this.getAdmissionSessions(this.config.itemsPerPage, this.config.currentPage);
        this.viewSingleConsumerList(this.selectedConsumer);
        this.modalService.dismissAll();
        this.ngxService.stop();
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

  addAsset(modal: any) {
    this.getAssetTypes();
    this.initialiseSearchAssetForms();
    this.initialiseAssetsSeachForms();
    this.submittedSearchAsset = false;
    this.currentPageRasLength = 10;
    // this.searchAssetForm.reset();
    this.searchedAssetData = "";
    this.showModal(modal);
    this.config = {
      currentPage: 1,
      itemsPerPage: 10,
    };
  }
  onSubmitAsstSearch(){
    this.onSubmitAssetSearch(this.config.itemsPerPage, this.config.currentPage);
  }
  onSubmitAssetSearch(perpage: any, pageno: any) {
    this.submittedSearchAsset = true;
    if (this.searchAssetForm.invalid) {
      return;
    }
    this.keywords = this.searchAssetForm.get('keyword')!.value;
    this.ngxService.start();

    this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/search-assets?asset_type=${this.searchAssetForm.get('assetType')!.value.toLowerCase()}&name=${this.keywords}&per_page=${perpage}&page=${pageno}`;
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });

    this.httpClient
      .get<any>(this.apiUrl, { headers: reqHeader })
      .subscribe((data) => {
        this.ngxService.stop();
        if (data.status == true && data.response != null) {
          this.searchedAssetData = data.response.assets.data;
          this.config.totalItems = data.response?.assets.total;
          this.config.currentPage = data.response?.assets.current_page;
          this.submittedSearchAsset = false;

        }
        else if (data.response == null) {
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
          this.searchedAssetData = "";
          this.submittedSearchAsset = false;

        }
        else if (data.status == false) {
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
          this.submittedSearchAsset = false;
          this.searchedAssetData = "";
        }
      });
  }
 
  pageChange(newPage: number) {
    
    if(this.activeTab == 'consumerAsset'){
      this.router.navigate(["/billingprofile"], {
      });
      this.onSubmitAssetSearch(this.config.itemsPerPage, newPage);
    }  
    if(this.searchedConsumerData) {
      this.router.navigate(["/billingprofile"], {
      });
      this.onSubmitAssetSearch(this.config.itemsPerPage, this.config.currentPage);
    }
    else{
      this.router.navigate(["/billingprofile"], {
        queryParams: { page: newPage },
      });
      this.getConsumer(this.config.itemsPerPage, newPage);
    }
  }
 
  clearSAssetearch() {
    this.searchObject = {};
    this.searchAssetForm.reset();
    this.submittedSearchAsset = false;
    this.initialiseSearchAssetForms();

  }
  getBuilding(building: any) {
    this.bill = this.buildingData.filter((i: any) => i.id == building)[0].name;

    return this.bill;
  }

  onSubmitAsseetsSearch() {
    this.assetNiswasecData = "";
    this.ngxService.start();

    this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/assets?consumer_reference=${this.selectedConsumer}`;
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    this.httpClient
      .get<any>(this.apiUrl, { headers: reqHeader })
      .subscribe((data) => {
        this.ngxService.stop();
        if (data.status == true && data.response != null) {
          this.assetNiswasecData = data.response;
        }
        else if (data.response == null) {
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
          this.submittedAsseets = false;
        }
        else if (data.status == false) {
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
          this.submittedAsseets = false;
        }

      });
  }


  viewOnboardRas(modal: any, selectedData: any) {
    this.showModal(modal);
    this.submittedonboardConsumerForm = false;
    this.submittedonboardCorporateForm = false;
    this.initialiseOnboardConsumerForms();

    this.isRASonboarding = true;
    this.flag = selectedData.flag;
    this.flagType = this.consumercatgryTypes.filter((i: any) => i.name.toUpperCase() == this.flag)[0].id;
    this.selectForm.get('consumercategory')!.setValue(this.flagType);
    this.selectedVal = this.flagType;

    if (this.selectedVal == 1) {
      this.subCategory = this.consumerSubCategory.filter((i: any) => i.id == this.flagType)
      this.onboardConsumerForm = this.formBuilder.group({
        taxpayerId: [selectedData.taxpayer_id],
        bvn: [selectedData.bvn, [
          Validators.minLength(11),
          Validators.maxLength(11),
        ]],
        nin: [selectedData.nin, [
          Validators.minLength(11),
          Validators.maxLength(11),
        ]],
        tin: [selectedData.tin, [
          Validators.minLength(11),
          Validators.maxLength(11),
        ]],
        emailAddress: [selectedData.email, [
          Validators.required,
          Validators.maxLength(40),
          Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ]],
        // title: [this.getTitleId(selectedData.title), [
        //   Validators.required
        // ]],
        title: ["", [
          Validators.required
        ]],
        firstName: [selectedData.first_name, [
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
          selectedData.surname,
          [
            Validators.required,
            Validators.pattern("^[A-Za-z]+[A-Za-z ]*$"),
            Validators.maxLength(30),
          ],
        ],
        dateOfBirth: ["", [
          Validators.required
        ]],
        occupation: ["", [
          Validators.required
        ]],

        gender: [selectedData.gender == null ? "" : this.getGenderId(selectedData.gender), [
          Validators.required
        ]],

        maritalStatus: [selectedData.marital_status == null ? "" : this.getMaritalStatusId(selectedData.marital_status), [
          Validators.required
        ]],
        phoneNumber: [
          selectedData.phone,
          [
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(11),
            Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/),
          ],
        ],

        countryId: ["", [Validators.required]],
        stateId: ["", [Validators.required]],
        localGovtId: ["", [Validators.required]],
        taxoffc: [selectedData.tax_office_id, [Validators.required]],
        mode: ['EXISTING', [Validators.required]],
        consumercategory:
          new FormControl({ value: this.selectedVal, disabled: true }, [
            Validators.required
          ]),

        consumerSubcategory: ["", [Validators.required]],
        address: [
          selectedData.address,
          [
            Validators.required,
            Validators.maxLength(200),
            Validators.minLength(6),
          ],
        ],
      });
    }
    if (this.selectedVal == 2) {
      this.subCategory = this.consumerSubCategory.filter((i: any) => i.id !== 1)
      this.splitedName = selectedData.name.split(" ");

      this.onboardCorporateForm = this.formBuilder.group({

        tin: ["", [
          Validators.minLength(11),
          Validators.maxLength(11),
        ]],

        taxpayerId: [selectedData.taxpayer_id],

        taxpayerType: [selectedData.taxpayer_type_id],
        emailAddress: [selectedData.email, [
          Validators.required,
          Validators.maxLength(40),
          Validators.pattern("^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ]],
        title: ["", [
          Validators.required
        ]],

        firstName: [this.splitedName[0], [
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
          this.splitedName[1],
          [
            Validators.required,
            Validators.pattern("^[A-Za-z]+[A-Za-z ]*$"),
            Validators.maxLength(30),
          ],
        ],
        dateOfBirth: ["", [
          Validators.required
        ]],
        occupation: ["", [
          Validators.required
        ]],
        gender: ["", [
          Validators.required
        ]],
        maritalStatus: ["", [
          Validators.required
        ]],
        phoneNumber: [
          selectedData.phone,
          [
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(11),
            Validators.pattern(/^[0][1-9]\d{9}$|^[1-9]\d{9}$/),
          ],
        ],
        countryId: ["", [Validators.required]],
        stateId: ["", [Validators.required]],
        localGovtId: ["", [Validators.required]],
        taxoffc: [selectedData.tax_office_id, [Validators.required]],
        mode: ["", [Validators.required]],
        consumercategory:
          new FormControl({ value: this.selectedVal, disabled: true }, [
            Validators.required
          ]),
        consumerSubcategory: ["", [Validators.required]],
        address: [
          "",
          [
            Validators.required,
            Validators.maxLength(200),
            Validators.minLength(6),
          ],
        ],
        // cacNumber: [selectedData.cac_number, [Validators.required,
        //   Validators.maxLength(8),
        //   Validators.pattern("^[A-Za-z]{2}[0-9]{6}"),]],
        cacNumber: ["", [Validators.required,
        Validators.maxLength(8),
        Validators.pattern("^[A-Za-z]{2}[0-9]{6}"),]],
        companyType: ["", [Validators.required]],
        industrySector: ["", [Validators.required]],
        companyName: [selectedData.company_name, [Validators.required]],
        companyAddress: [
          "",
          [
            Validators.required,
            Validators.maxLength(200),
            Validators.minLength(6),
          ],
        ],
      });
    }

  }

  getGenderId(genderId: any) {
    this.genderId = this.genderData.filter((i: any) => i.name == genderId.toUpperCase())[0].id;
    return this.genderId;
  }

  getMaritalStatusId(maritalStatus: any) {
    this.maritalId = this.maritalStatusData.filter((i: any) => i.name == maritalStatus)[0].id;
    return this.maritalId;
  }
  // getNationality(nationality:any){
  //   this.nationalityId = this.countriesData.filter((i: any) => i.name == nationality)[0].id;
  //    return this.nationalityId;
  // }
  // getOccupation(occupation:any){
  //   this.occupationId = this.occupationData.filter((i: any) => i.name == occupation)[0].id;
  //    return this.occupationId;
  // }
  getTitleId(title: any) {
    this.title = this.titlesData.filter((i: any) => i.name == title)[0]?.id;
    return this.title;
  }
  onSelectLinkAsset(modal: any, selected: any) {
    this.showModal(modal);
    this.townModified = selected.town_id;
    this.selectedAsset = selected.asset_type;
    this.getRASTowns(selected.lga_id);
    this.getLocalGovernment();
    this.linkAssetForm = this.formBuilder.group({

      assetType: [selected.asset_type, [
        Validators.required
      ]],
      assetName: [selected.asset_name, [
        Validators.required
      ]],
      assetReference: [selected.asset_reference, [
        Validators.required
      ]],
      houseNumber: [selected.house_number, [
        Validators.required
      ]],
      streetName: [selected.street_name, [
        Validators.required
      ]],
      offStreetName: [selected.off_street_name, [
        Validators.required
      ]],
      ward: [this.getRASWards(selected.town_id), [
        Validators.required
      ]],
      town: [this.townModified, [
        Validators.required
      ]],
      lga: [selected.lga_id, [
        Validators.required
      ]],
      buildingcompletion: [selected.building_completion_id, [
        Validators.required
      ]],
      buildingPurpose: [selected.building_purpose_id, [
        Validators.required
      ]],
      buildingOccupancy: [selected.building_occupancy_id
        , [
        Validators.required
      ]],
      buildingOwnership: [selected.building_ownership_id, [
        Validators.required
      ]],
      buildingType: [selected.building_type_id, [
        Validators.required
      ]],
      landPurpose: [selected.land_purpose_id, [
        Validators.required
      ]],
      landOccupancy: [selected.land_occupancy_type_id, [
        Validators.required
      ]],
      landOwnership: [selected.land_ownership_id, [
        Validators.required
      ]],
      landAllocation: [selected.land_allocation_type_id, [
        Validators.required
      ]],
      zone: ["", [
        Validators.required
      ]],
      mode: ["EXISTING", [
        Validators.required
      ]],
    });
    this.getAssetId();
  }

  getAssetId() {
    this.selectedAssetId = this.assetData.filter((i: any) => i.name.toUpperCase() == this.selectedAsset.toUpperCase())[0].id;
    return this.selectedAssetId;
  }
  linkAsset(formAllData: any) {
    this.submittedLinkAsset = true;

    if (this.selectedAssetId == 2) {
      this.linkAssetForm.controls['landPurpose'].setValidators([Validators.required]);
      this.linkAssetForm.controls['landOccupancy'].setValidators([Validators.required]);
      this.linkAssetForm.controls['landOwnership'].setValidators([Validators.required]);
      this.linkAssetForm.controls['landAllocation'].setValidators([Validators.required]);
      this.linkAssetForm.controls['zone'].setValidators([Validators.required]);


    } else {
      this.linkAssetForm.controls['landPurpose'].clearValidators();
      this.linkAssetForm.controls['landOccupancy'].clearValidators();
      this.linkAssetForm.controls['landOwnership'].clearValidators();

      this.linkAssetForm.controls['landAllocation'].clearValidators();
      this.linkAssetForm.controls['zone'].clearValidators();
    }
    this.linkAssetForm.controls['landPurpose'].updateValueAndValidity();
    this.linkAssetForm.controls['landOccupancy'].updateValueAndValidity();
    this.linkAssetForm.controls['landOwnership'].updateValueAndValidity();

    this.linkAssetForm.controls['landAllocation'].updateValueAndValidity();
    this.linkAssetForm.controls['zone'].updateValueAndValidity();

    if (this.selectedAssetId == 3) {
      this.linkAssetForm.controls['buildingcompletion'].setValidators([Validators.required]);
      this.linkAssetForm.controls['buildingPurpose'].setValidators([Validators.required]);
      this.linkAssetForm.controls['buildingOccupancy'].setValidators([Validators.required]);
      this.linkAssetForm.controls['buildingOwnership'].setValidators([Validators.required]);
      this.linkAssetForm.controls['buildingType'].setValidators([Validators.required]);

    }
    else {
      this.linkAssetForm.controls['buildingcompletion'].clearValidators();
      this.linkAssetForm.controls['buildingPurpose'].clearValidators();
      this.linkAssetForm.controls['buildingOccupancy'].clearValidators();
      this.linkAssetForm.controls['buildingOwnership'].clearValidators();
      this.linkAssetForm.controls['buildingType'].clearValidators();

    }
    this.linkAssetForm.controls['buildingcompletion'].updateValueAndValidity();
    this.linkAssetForm.controls['buildingPurpose'].updateValueAndValidity();
    this.linkAssetForm.controls['buildingOccupancy'].updateValueAndValidity();

    this.linkAssetForm.controls['buildingOwnership'].updateValueAndValidity();
    this.linkAssetForm.controls['buildingType'].updateValueAndValidity();

    if (this.linkAssetForm.invalid) {
      return;
    }
    if (formAllData.assetType == "building") {

      let requestExistbuildingObj = {
        consumer_reference: this.selectedConsumer,
        asset_type_id: this.selectedAssetId,
        asset_name: formAllData.assetName,
        asset_reference: formAllData.assetReference,

        house_number: formAllData.houseNumber,
        street_name: formAllData.streetName,
        off_street_name: formAllData.offStreetName,
        ward_id: formAllData.ward,
        town_id: formAllData.town,
        lga_id: formAllData.lga,
        building_completion_id: formAllData.buildingcompletion,
        building_purpose_id: formAllData.buildingPurpose,
        building_occupancy_id: formAllData.buildingOccupancy,
        building_ownership_id: formAllData.buildingOwnership,
        building_type_id: formAllData.buildingType,
        mode: formAllData.mode
      }
      this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/link-asset`;

      const reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("niswasec_access_token"),
      });

      this.ngxService.start();
      this.httpClient.post<any>(this.apiUrl, requestExistbuildingObj, { headers: reqHeader }).subscribe((data) => {
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
          this.initialiselinkAssetForm();
          this.submittedLinkAsset = false;
          this.getConsumer(this.config.itemsPerPage, this.config.currentPage);
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
    if (formAllData.assetType == "land") {

      let requestLandExistObj = {
        consumer_reference: this.selectedConsumer,
        asset_type_id: this.selectedAssetId,
        asset_name: formAllData.assetName,
        asset_reference: formAllData.assetReference,

        house_number: formAllData.houseNumber,
        street_name: formAllData.streetName,
        off_street_name: formAllData.offStreetName,
        ward_id: formAllData.ward,
        town_id: formAllData.town,
        lga_id: formAllData.lga,
        zone_id: formAllData.zone,
        land_purpose_id: formAllData.landPurpose,
        land_occupancy_id: formAllData.landOccupancy,
        land_ownership_id: formAllData.landOwnership,
        land_allocation_id: formAllData.landAllocation,
        mode: formAllData.mode
      }
      this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/link-asset`;

      const reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("niswasec_access_token"),
      });

      this.ngxService.start();
      this.httpClient.post<any>(this.apiUrl, requestLandExistObj, { headers: reqHeader }).subscribe((data) => {
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
          this.initialiselinkAssetForm();
          this.submittedLinkAsset = false;
          this.getConsumer(this.config.itemsPerPage, this.config.currentPage);
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
  }


  getLgaOnChange($event: any) {
    this.selectedLgaName = $event?.target.value;
    this.getRASTownsById(this.selectedLgaName)
  }
  getTownOnChange($event: any) {
    this.selectedLgaName = $event?.target.value;
    this.getRASWards(this.selectedLgaName);
  }
  addNewAsset(modal: any) {
    this.showModal(modal);
  }
  createAsset(formAllData: any) {
    this.submittedNewAsset = true;
    this.linkNewAssetForm.get('mode')!.setValue("NEW");

    if (formAllData.assetType == "2") {
      this.linkNewAssetForm.controls['landPurpose'].setValidators([Validators.required]);
      this.linkNewAssetForm.controls['landOccupancy'].setValidators([Validators.required]);
      this.linkNewAssetForm.controls['landOwnership'].setValidators([Validators.required]);
      this.linkNewAssetForm.controls['landAllocation'].setValidators([Validators.required]);
      this.linkNewAssetForm.controls['zone'].setValidators([Validators.required]);


    } else {
      this.linkNewAssetForm.controls['landPurpose'].clearValidators();
      this.linkNewAssetForm.controls['landOccupancy'].clearValidators();
      this.linkNewAssetForm.controls['landOwnership'].clearValidators();
      this.linkNewAssetForm.controls['landAllocation'].clearValidators();
      this.linkNewAssetForm.controls['zone'].clearValidators();
    }
    this.linkNewAssetForm.controls['landPurpose'].updateValueAndValidity();
    this.linkNewAssetForm.controls['landOccupancy'].updateValueAndValidity();
    this.linkNewAssetForm.controls['landOwnership'].updateValueAndValidity();

    this.linkNewAssetForm.controls['landAllocation'].updateValueAndValidity();
    this.linkNewAssetForm.controls['zone'].updateValueAndValidity();

    if (formAllData.assetType == "3") {
      this.linkNewAssetForm.controls['buildingcompletion'].setValidators([Validators.required]);
      this.linkNewAssetForm.controls['buildingPurpose'].setValidators([Validators.required]);
      this.linkNewAssetForm.controls['buildingOccupancy'].setValidators([Validators.required]);
      this.linkNewAssetForm.controls['buildingOwnership'].setValidators([Validators.required]);
      this.linkNewAssetForm.controls['buildingType'].setValidators([Validators.required]);


    }
    else {
      this.linkNewAssetForm.controls['buildingcompletion'].clearValidators();
      this.linkNewAssetForm.controls['buildingPurpose'].clearValidators();
      this.linkNewAssetForm.controls['buildingOccupancy'].clearValidators();
      this.linkNewAssetForm.controls['buildingOwnership'].clearValidators();
      this.linkNewAssetForm.controls['buildingType'].clearValidators();

    }
    this.linkNewAssetForm.controls['buildingcompletion'].updateValueAndValidity();
    this.linkNewAssetForm.controls['buildingPurpose'].updateValueAndValidity();
    this.linkNewAssetForm.controls['buildingOccupancy'].updateValueAndValidity();

    this.linkNewAssetForm.controls['buildingOwnership'].updateValueAndValidity();
    this.linkNewAssetForm.controls['buildingType'].updateValueAndValidity();


    if (this.linkNewAssetForm.invalid) {
      return;
    }
    if (formAllData.assetType == "3") {

      let requestExistbuildingObj = {
        consumer_reference: this.selectedConsumer,
        asset_type_id: formAllData.assetType,
        asset_name: formAllData.assetName,
        house_number: formAllData.houseNumber,
        street_name: formAllData.streetName,
        off_street_name: formAllData.offStreetName,
        ward_id: formAllData.ward,
        town_id: formAllData.town,
        lga_id: formAllData.lga,
        building_completion_id: formAllData.buildingcompletion,
        building_purpose_id: formAllData.buildingPurpose,
        building_occupancy_id: formAllData.buildingOccupancy,
        building_ownership_id: formAllData.buildingOwnership,
        building_type_id: formAllData.buildingType,
        mode: "NEW"
      }
      this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/link-asset`;

      const reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("niswasec_access_token"),
      });

      this.ngxService.start();
      this.httpClient.post<any>(this.apiUrl, requestExistbuildingObj, { headers: reqHeader }).subscribe((data) => {
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
          this.initialiseCreateAssetForm();
          this.submittedNewAsset = false;
          this.getConsumer(this.config.itemsPerPage, this.config.currentPage);
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
    if (formAllData.assetType == "2") {

      let requestLandExistObj = {
        consumer_reference: this.selectedConsumer,
        asset_type_id: formAllData.assetType,
        asset_name: formAllData.assetName,
        house_number: formAllData.houseNumber,
        street_name: formAllData.streetName,
        off_street_name: formAllData.offStreetName,
        ward_id: formAllData.ward,
        town_id: formAllData.town,
        lga_id: formAllData.lga,
        zone_id: formAllData.zone,
        land_purpose_id: formAllData.landPurpose,
        land_occupancy_id: formAllData.landOccupancy,
        land_ownership_id: formAllData.landOwnership,
        land_allocation_id: formAllData.landAllocation,
        mode: "NEW"
      }
      this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/link-asset`;

      const reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("niswasec_access_token"),
      });

      this.ngxService.start();
      this.httpClient.post<any>(this.apiUrl, requestLandExistObj, { headers: reqHeader }).subscribe((data) => {
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
          this.initialiseCreateAssetForm();
          this.submittedNewAsset = false;
          this.getConsumer(this.config.itemsPerPage, this.config.currentPage);
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
  }
  onSelectApproval($event: any, data: any) {
    this.selectedApproval = $event.target.value;
    if (this.selectedApproval == '1') {
      this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/approve-profile`;

      let requestObj = {
        consumer_profile_id: data.id
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

          this.viewSingleConsumerList(this.selectedConsumer);
          this.modalService.dismissAll();
          this.ngxService.stop();
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

    if (this.selectedApproval == '2') {

      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Disapproved!",
      }).then((result) => {
        if (result.value) {
          this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/disapprove-profile`;


          let requestObj = {
            consumer_profile_id: data.id
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

              this.viewSingleConsumerList(this.selectedConsumer);
              this.modalService.dismissAll();
              this.ngxService.stop();
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
      });
    }
  }
  onSelectProfile(profileData: any) {
    this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/toggle-profile`;
    let requestObj = {
      consumer_profile_id: profileData.id,
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
        this.viewSingleConsumerList(this.selectedConsumer);
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
  clearRasAssetSearch(){
    this.searchAssetForm.reset();
    this.submittedSearchAsset = false;
    this.initialiseSearchAssetForms();
    this.searchedAssetData = "";
  }

  onSelectconnection(profileData: any) {
    this.apiUrl = `${environment.AUTHAPIURL}admins/consumer/toggle-connection-status`;
    let requestObj = {
      consumer_profile_id: profileData.id,
      connection_status_id: profileData.connection_status_id,
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
        this.viewSingleConsumerList(this.selectedConsumer);
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
  clickExistingAssets() {
    this.route.queryParams.subscribe(
      (params) =>
        (this.config.currentPage = params["page"] ? params["page"] : 1)
    );
    this.getConsumer(this.config.itemsPerPage, this.config.currentPage);
  }

  public setItemsPerPageCons($event: any) {
    this.config.itemsPerPage = $event;
    this.config.currentPage = 1;
    this.currentPageConsumerLength = this.config.itemsPerPage;
    this.router.navigate(["/billingprofile"]);
    this.onSubmitConsumerSearch(this.config.itemsPerPage, 1);
  }
}

