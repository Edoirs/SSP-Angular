import { Component } from '@angular/core';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent {
  constructor() { }
  
  ngOnInit(): void {
    $(".mobile-menu").css("display", "none");
  }

}
