import {Injectable, signal} from "@angular/core"

@Injectable({providedIn: "root"})
export class MenuItemService {
  readonly activeIndex = signal<number>(0)
  readonly selected = signal(false)

  updateActiveIndex(index: number) {
    this.activeIndex.set(index)
    if (this.activeIndex() === index) {
      if (!this.selected()) {
        this.selected.set(!this.selected())
      }
    } else {
      this.selected.set(true)
    }

    // console.log(
    //   `check: (${
    //     this.activeIndex() === index
    //   }) \n index: ${index} \n selected: ${this.selected()}`
    // )
  }
}
