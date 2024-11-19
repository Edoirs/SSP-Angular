import {NgStyle} from "@angular/common"
import {Component, output, signal} from "@angular/core"
import {MatMenuModule} from "@angular/material/menu"

@Component({
  standalone: true,
  selector: "app-action-btn",
  template: `
    <div class="action-card">
      <button type="button" (click)="toggleMenu()">
        <span>Action</span>
        <span>
          <i class="fa fa-angle-down" aria-hidden="true"></i>
        </span>
      </button>

      <section
        class="action-menu"
        [ngStyle]="{display: openMenu() ? 'block' : 'none'}">
        <div (click)="buttonEvent.emit(); toggleMenu()">start pulling data</div>
      </section>

      <section
        class="action"
        [ngStyle]="{display: openMenu() ? 'block' : 'none'}"
        (click)="toggleMenu()"></section>
    </div>
  `,
  styles: `

  .action{
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  .action-card{
    position: relative;
  }

  button{
    display: flex;
    justify-content: space-between;
    align-items: center;
    column-gap: 12px;
  }

  .action-menu {
    display: none;
    position: absolute;
    top: 50px;
    background-color: #fff;
    padding: 16px 24px;
    border-radius: 8px;
    z-index: 10;
    box-shadow: 8px 12px 14px 2px #eee;
  }

  .action-menu div{
    cursor: pointer;
  }

  `,
  imports: [MatMenuModule, NgStyle],
})
export class ActionButtonComponent {
  buttonEvent = output()
  openMenu = signal(false)

  toggleMenu = () => this.openMenu.set(!this.openMenu())
}
