import { Component, HostListener, ElementRef } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle'; // import it to your component for session checking idle
import { environment } from '../environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'niger-water-sewage-corporation';

  showHead = true;
  sessTimeout: number;


  //template: string =`<img src="http://pa1.narvii.com/5722/2c617cd9674417d272084884b61e4bb7dd5f0b15_hq.gif" />`
  template: string = `<img src="../assets/dist/img/Loader1.gif" />`


  constructor(private router: Router, private bnIdle: BnNgIdleService) {

    // on route change to '/login', set the variable showHead to false
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {

        // tslint:disable-next-line: triple-equals
        if (event.url == '/login'

          || event.url == '/signUp'
          || event.url == '/newlogin'
          || event.url == '/'
          || event.url == ''
          || event.url == '/forgotpassword'
          || event.url == '/selfforgotpassword'
          || event.url == '/verifyotp'
          || event.url == '/resetpassword'
          || event.url == '/selfresetpassword'     
          || event.url == '/signup'
          || event.url == '/faqs'
          || event.url == '/home'
          || event.url == '/contactus'
          || event.url == '/privacypolicy'
          || event.url == '/aboutus'
          || event.url == '/applyadmission'
          || event.url == '/applicationsuccess'
          || event.url == '/verifyadmission'
          || event.url == '/verifysuccess'


        ) {

          this.showHead = false;
        } else {

          this.showHead = true;
        }
      }
    });


    // Session time out  if any activity not present given time(1000 Sec.)

    this.sessTimeout = environment.sessionTimeOut;

    this.bnIdle.startWatching(this.sessTimeout).subscribe((res: any) => {
      if (res) {
        // console.log('session expired');
        //  localStorage.clear();
        Object.keys(localStorage)
          .filter((x) => x.startsWith("niswasec_"))
          .forEach((x) => localStorage.removeItem(x))
        this.router.navigate(["/login"])
      }
    });


  }

  onActivate(event: any) {
    window.scrollTo(0, 0);
  }

  /* scroll top angular code */

  isShow: any;
  topPosToStartShowing = 100;

  @HostListener('window:scroll')
  checkScroll() {
    // window의 scroll top
    // Both window.pageYOffset and document.documentElement.scrollTop returns the same result in all the cases. window.pageYOffset is not supported below IE 9.

    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;


    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  }

  // TODO: Cross browsing
  gotoTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }

}

