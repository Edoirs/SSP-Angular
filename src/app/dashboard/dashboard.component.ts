import { formatDate } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  apiUrl: string | undefined;
  dashboardData: any;
  latestCustomersData: any;
  dtOptions: any = {};
  barChartPastData: any;
  chart: any;
  roleID: any;

  barChartOptions = {
    responsive: true,
    scaleShowValues: true,
    scaleValuePaddingX: 10,
    scaleValuePaddingY: 10,
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 5000,
      easing: 'easeInOutElastic',
      numSteps: 80,
    }

  };



  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';


  isRun: any;

  chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        // text: 'Invoice statistics',
      },
    },

  };

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private ngxService: NgxUiLoaderService,
  ) {
  }

  ngOnInit(): void {
    //this.comm.checkLogin();
    this.roleID = localStorage.getItem("niswasec_role_id");
    this.isRun = localStorage.getItem("niswasec_is_reload");
    if (this.isRun != "true") {
      this.refresh();
    }
    this.getDashboardData();
    this.intialiseTableProperties();
  }
  intialiseTableProperties() {
    this.dtOptions = {
      // pagingType: 'full_numbers',
      // pageLength: 5,
      // processing: true,
      // paging: false,
      // responsive: true,
      // lengthChange: false,
      // ordering: false,
      // info: false,
      // searching: false,

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
  refresh() {
    //alert('innn');
    localStorage.setItem("niswasec_is_reload", "true"); 3
    window.location.reload();
  }
  getDashboardData() {
    this.ngxService.start();

    this.apiUrl = `${environment.AUTHAPIURL}admins/dashboard`;
    const reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("niswasec_access_token"),
    });

    this.httpClient
      .get<any>(this.apiUrl, { headers: reqHeader })
      .subscribe((data) => {
        this.dashboardData = data.response;
        this.latestCustomersData = this.dashboardData.latest_consumers;
        this.chart = data.response.chart.consumers_by_year;
      });
    this.ngxService.stop();
  }
  public barChartData: ChartData<'line'> = {
    labels: [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Aug', 'Sep', 'Oct' ],
      datasets: [{ 
        label: 'Monthly Tax Paid', 
        data: [1.00, 1.20, 1.05, 2.00, 0.50, 0.70, 0.80, 1.00, 0.90], tension: 0.5 ,
        backgroundColor : 'rgb(36 127 197)',
      hoverBackgroundColor: '#4892f4',
      borderColor : '#36A2EB',
      pointBackgroundColor: '#36A2EB',
      fill: true
    },
    ]
  };

  salesData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Paid Invoice',
        data: [1000, 1200, 1050, 2000, 500], tension: 0.5,
        backgroundColor: 'rgb(146 192 237 / 33%)',
        hoverBackgroundColor: '#6189e5f5',
        borderColor: 'rgb(146 192 237 / 100%)',
        pointBackgroundColor: '#36A2EB',
        fill: true
      },
      // { label: 'old Students', data: [200, 100, 400, 50, 90], tension: 0.5 },
      {
        label: 'Unpaid Invoice',
        data: [500, 800, 350, 450, 650],
        tension: 0.5,
        backgroundColor: 'rgb(36 127 197 / 20%)',
        hoverBackgroundColor: '#6189e5f5',
        borderColor: '#36A2EB',
        pointBackgroundColor: '#36A2EB',
        fill: true
      },
      //  { label: 'Passout Students', data: [1200, 1500, 1020, 1600, 900], tension: 0.5 },


    ],
  };

}
