import { Component } from '@angular/core';

@Component({
  selector: "app-main-footer",
  templateUrl: "./main-footer.component.html",
  styleUrls: ["./main-footer.component.css"],
})
export class MainFooterComponent {
  currentYear = new Date().getFullYear()
}
