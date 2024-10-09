import {Component} from "@angular/core"

@Component({
  selector: "app-coming-soon",
  standalone: true,
  template: `<div class="coming-soon">
    <p>Coming soon<span class="dot">.</span></p>
  </div>`,
  styles: `

  .coming-soon{
    display: flex;
    width: 100%;
    height: 100%;
    min-height: 40vh;
    background-color: #c4c4c4;
    color: #fff;
  }
  .coming-soon p{
    margin: auto;
    color: #000;
    font-size: 26px;
    font-weight: 300;
    text-transform: capitalize;
    -webkit-animation: slideup .5s linear both;
	animation: fade .5s linear both;
  }

  p .dot{
    color: green;
    font-weight: 900;
    font-size: 30px;
  }

  
@keyframes fade {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
  
  `,
  imports: [],
})
export class ComingSoonComponent {}
