import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  apiUrl!: string;
  
  constructor(private httpClient: HttpClient, private ngxService: NgxUiLoaderService,) { }

  getTitles() {
    this.apiUrl = environment.AUTHAPIURL + "common/titles";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  }
  getRoles() {
    this.apiUrl = environment.AUTHAPIURL + "common/roles";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  }
  getReligions() {
    this.apiUrl = environment.AUTHAPIURL + "common/religions";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  }
  getBillTypes() {
    this.apiUrl = environment.AUTHAPIURL + "common/bill-types";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  }
  getTariffTypes() {
    this.apiUrl = environment.AUTHAPIURL + "common/tariff-types";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  }
  
  getGender() {
    this.apiUrl = environment.AUTHAPIURL + "common/genders";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
      return data;
    }));
  }

  getMaritalStatus() {
    this.apiUrl = environment.AUTHAPIURL + "common/marital-statuses";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  }
  getOccupations() {
    this.apiUrl = environment.AUTHAPIURL + "common/occupations";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
      return data;
    }));
  }
  getRelationships() {
    this.apiUrl = environment.AUTHAPIURL + "common/relationships";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
      return data;
    }));
  }
  getBillingCycles() {
    this.apiUrl = environment.AUTHAPIURL + "common/billing-cycles";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
      return data;
    }));
  }
  getSubBillType() {
    this.apiUrl = environment.AUTHAPIURL + "common/sub-bill-types";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
      return data;
    }));
  }
  getRevenueType() {
    this.apiUrl = environment.AUTHAPIURL + "common/revenue-types";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
      return data;
    }));
  }
  getSubTariffType() {
    this.apiUrl = environment.AUTHAPIURL + "common/sub-tariff-types";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
      return data;
    }));
  }
  getSubTariffTypeById(tariffTypeID:any) {
    this.apiUrl = `${environment.AUTHAPIURL}common/sub-tariff-types?tariff_type_id=${tariffTypeID}`;


    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
      return data;
    }));
  }
  
  getApprovalStatus() {
    this.apiUrl = environment.AUTHAPIURL + "common/approval-statuses";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
      return data;
    }));
  }

  getprofilingStatus() {
    this.apiUrl = environment.AUTHAPIURL + "common/profiling-statuses";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
      return data;
    }));
  }
  getComputationType() {
    this.apiUrl = environment.AUTHAPIURL + "common/computation-types";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
      return data;
    }));
  }
  getLocalGovernment() {
    this.apiUrl = environment.AUTHAPIURL + "common/local-governments";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
      return data;
    }));
  }

  getTaxOffices(){
    this.apiUrl = environment.AUTHAPIURL + "common/tax-offices";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
      return data;
    }));
  }
  getCompanyType(){
    this.apiUrl = environment.AUTHAPIURL + "common/company-types";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
      return data;
    }));
  }


  getIndustrySectors(){
    this.apiUrl = environment.AUTHAPIURL + "common/industry-sectors";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
      return data;
    }));
  }
 
  getSettlementStatus() {
    this.apiUrl = environment.AUTHAPIURL + "common/settlement-statuses";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
      return data;
    }));
  }
  getConnectionStatus() {
    this.apiUrl = environment.AUTHAPIURL + "common/connection-statuses";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
      return data;
    }));
  }
  getConsumerCategory() {
    this.apiUrl = environment.AUTHAPIURL + "common/consumer-categories";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
      return data;
    }));
  }
  getConsumerSubCategory() {
    this.apiUrl = environment.AUTHAPIURL + "common/consumer-sub-categories";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
      return data;
    }));
  }

  getCities(localGovernmenID:any) {
    this.apiUrl = `${environment.AUTHAPIURL}common/cities?local_government_id==${localGovernmenID}`;

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl , { headers: reqHeader } ).pipe(map(data => {
      return data;
     })
    );
  }
  getZones(districtId:any) {
    this.apiUrl = `${environment.AUTHAPIURL}common/zones?district_id=${districtId}`;

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl , { headers: reqHeader } ).pipe(map(data => {
      return data;
     })
    );
  }

  getState() {
    this.apiUrl = environment.AUTHAPIURL + "common/states";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  } 
  getStatesByID(countryId? : number) {
    this.apiUrl = environment.AUTHAPIURL + "common/states";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    let params = {
      'country_id' : countryId ?? ''
    };
    return this.httpClient.get(this.apiUrl, { headers: reqHeader, params: params}).pipe(map(data => {
          return data;
        })
    );
  }
  getLocalGovtByID(stateId? : number) {
    this.apiUrl = environment.AUTHAPIURL + "common/local-governments";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    let params = {
      'state_id' : stateId ?? ''
    };
    return this.httpClient.get(this.apiUrl, { headers: reqHeader, params: params}).pipe(map(data => {
          return data;
        })
    );
  }
  getDistricts(localGovernmentId:any) {
    this.apiUrl = `${environment.AUTHAPIURL}common/districts?local_government_id=${localGovernmentId}`;

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  } 
  getZone(districtId:any) {
    this.apiUrl = `${environment.AUTHAPIURL}common/zones?districts_id=${districtId}`;

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  }
  
  getRound(zoneId:any) {
    this.apiUrl = `${environment.AUTHAPIURL}common/rounds?zone_id=${zoneId}`;

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  }

  getRASTowns(lgaId:any) {
    this.apiUrl = `${environment.AUTHAPIURL}common/ras-towns?lga_id=${lgaId}`;

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  }
  
  getRASWards(townId:any) {
    this.apiUrl = `${environment.AUTHAPIURL}common/ras-wards?town_id=${townId}`;

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  }

  getCountries() {
    this.apiUrl = environment.AUTHAPIURL + "common/countries";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  } 
  getAssetTypes() {
    this.apiUrl = environment.AUTHAPIURL + "common/asset-types";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  }
  getbuildingCompletions() {
    this.apiUrl = environment.AUTHAPIURL + "common/building-completions";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  }
  getbuildingOwnerships() {
    this.apiUrl = environment.AUTHAPIURL + "common/building-ownerships";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  }
  
  getbuildingOccupancy() {
    this.apiUrl = environment.AUTHAPIURL + "common/building-occupancies";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  }
  getLandOccupancy() {
    this.apiUrl = environment.AUTHAPIURL + "common/land-occupancies";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  }
  getbuildingPurposes() {
    this.apiUrl = environment.AUTHAPIURL + "common/building-purposes";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  }

  getLandPurposes() {
    this.apiUrl = environment.AUTHAPIURL + "common/land-purposes";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  }
  getBuildingTypes() {
    this.apiUrl = environment.AUTHAPIURL + "common/building-types";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  }
  
  getLandAllocations() {
    this.apiUrl = environment.AUTHAPIURL + "common/land-allocations";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  
  }
  getRasZones(){
    this.apiUrl = environment.AUTHAPIURL + "common/ras-zones";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  
  }
  getLandOwnership() {
    this.apiUrl = environment.AUTHAPIURL + "common/land-ownerships";

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    return this.httpClient.get(this.apiUrl, { headers: reqHeader }).pipe(map(data => {
          return data;
        })
    );
  }
  getbillgroups(tariffTypeId:any,subTariffTypeId:any,billType:any) {
    
      this.apiUrl = `${environment.AUTHAPIURL}common/bill-groups`;

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });
    let params = {
      'tariff_type_id' : tariffTypeId ?? '',
      'sub_tariff_type_id': subTariffTypeId ?? '',
      'bill_type_id': billType ?? '',
    };
    return this.httpClient.get(this.apiUrl, { headers: reqHeader , params: params }).pipe(map(data => {
          return data;
        })
    );
  }

  makePaymentOtherBill(invoice:any) {
    this.ngxService.start();
    this.apiUrl = `${environment.AUTHAPIURL}admins/pay/bill-others`;

    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });

    var req = {
      'invoice_number' : invoice ?? '',
    };
    return this.httpClient.post(this.apiUrl, req, { headers: reqHeader }).pipe(map(data => {
      this.ngxService.stop();
      return data;

    })
);
}
makePaymentFlatBill(invoice:any,amountToPay:any) {
  this.ngxService.start();

  this.apiUrl = `${environment.AUTHAPIURL}admins/pay/bill-fixed`;

  const reqHeader = new HttpHeaders({
    "Content-Type": "application/json",
    "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
  });

 
  var req = {
    'invoice_number' : invoice ?? '',
    'amount': amountToPay
  };
  return this.httpClient.post(this.apiUrl, req, { headers: reqHeader }).pipe(map(data => {
    this.ngxService.stop();
    return data;

  })
);
}
}
