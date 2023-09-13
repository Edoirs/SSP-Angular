import { Component } from '@angular/core';

@Component({
  selector: 'app-webheader',
  templateUrl: './webheader.component.html',
  styleUrls: ['./webheader.component.css']
})
export class WebheaderComponent {

    constructor() { }
  
    ngOnInit(): void {
    }
    btnMobilemenu(){
      $(".mobile-menu").toggle();
    }
  
  
    btnMobilemenu_2(){
      $(".mobile-menu-custom").slideToggle(300);
    }
  
  
  }
  
  