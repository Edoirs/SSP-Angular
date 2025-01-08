import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: "app-whatsupchat",
  templateUrl: "./whatsupchat.component.html",
  styleUrls: ["./whatsupchat.component.css"],
})
export class WhatsupchatComponent {
  today: number = Date.now()
  whatsAppNo = environment.WHATSAPP_PHONE_NO
  constructor() {
    setInterval(() => {
      this.today = Date.now()
    }, 1)
  }

  waClick() {
    $(".wa-box-outer-1").toggle()
  }
}

