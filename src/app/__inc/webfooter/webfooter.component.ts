import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-webfooter',
  templateUrl: './webfooter.component.html',
  styleUrls: ['./webfooter.component.css']
})
export class WebfooterComponent {

  input1: any;
  currYear: any;
  today= new Date();

  constructor() { }

  ngOnInit(): void {
  this.currYear = formatDate(this.today, 'YYYY', 'en-US');
  }
  onSubmit(){
   
    this.input1 = document.getElementById('myForm');
   
    if(document.querySelector('input')!.value){
    Swal.fire({
      icon: "success",
      title: "Success",
      text: "Your request has been sent successfully!",
      showConfirmButton: true,
      timer: 5000,
    });
    
    this.input1.value = "";
  }
  else{
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text:"Please enter email address",
      showConfirmButton: true,
      timer: 5000,
    });
  }
  }
}