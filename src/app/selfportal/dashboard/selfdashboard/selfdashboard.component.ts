import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";
import { ChartData } from 'chart.js';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { environment } from 'src/environments/environment';
import { SessionService } from 'src/app/session.service';

@Component({
  selector: 'app-selfdashboard',
  templateUrl: './selfdashboard.component.html',
  styleUrls: ['./selfdashboard.component.css']
})
export class SelfdashboardComponent implements OnInit {
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
          text: 'Consumer statistics',
        },
      },
    };

    constructor(private httpClient: HttpClient,
      private router: Router, private sess: SessionService,
      private ngxService: NgxUiLoaderService) { }

    ngOnInit(): void {
      this.sess.isCustomer();
      this.roleID = localStorage.getItem("niswasec_role_id");
      this.isRun = localStorage.getItem("niswasec_is_reload");
      if (this.isRun != "true") {
        this.refresh();
      }
      this.intialiseTableProperties();
    }

    intialiseTableProperties() {
      this.dtOptions = {
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
      localStorage.setItem("niswasec_is_reload", "true"); 3
      window.location.reload();
    }

    public barChartData: ChartData<'line'> = {
      labels: [ 'Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct' ],
        datasets: [{
          label: 'Transactions',
          data: [1000, 1200, 1050, 2000, 500, 700, 800, 1000, 900], tension: 0.5 ,
          backgroundColor : 'rgb(36 127 197)',
        hoverBackgroundColor: '#4892f4',
        borderColor : '#36A2EB',
        pointBackgroundColor: '#36A2EB',
        fill: true
      },]
    };

    salesData: ChartData<'line'> = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [
        {
          label: 'Metered Tariff',
          data: [1000, 1200, 1050, 2000, 500], tension: 0.5,
          backgroundColor: 'rgb(146 192 237 / 33%)',
          hoverBackgroundColor: '#6189e5f5',
          borderColor: 'rgb(146 192 237 / 100%)',
          pointBackgroundColor: '#36A2EB',
          fill: true
        },
        {
          label: 'UnMetered Tariff',
          data: [500, 800, 350, 450, 650],
          tension: 0.5,
          backgroundColor: 'rgb(36 127 197 / 20%)',
          hoverBackgroundColor: '#6189e5f5',
          borderColor: '#36A2EB',
          pointBackgroundColor: '#36A2EB',
          fill: true
        },
      ],
    };
  }
