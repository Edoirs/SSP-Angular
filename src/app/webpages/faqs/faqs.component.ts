import { Component } from '@angular/core';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.css']
})
export class FaqsComponent {

  constructor() { }

  ngOnInit(): void {
    $(".mobile-menu").css("display", "none"); 
  }

}
