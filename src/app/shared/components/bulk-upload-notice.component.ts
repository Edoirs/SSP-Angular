import {Component} from "@angular/core"

@Component({
  selector: "app-bulk-upload-notice",
  standalone: true,
  template: `
    <section class="bulk-notice">
      <h4>Notes:</h4>
      <ol>
        <li>
          <div>Employees mobile number and NIN are compulsory.</div>
        </li>
        <li>
          <div>
            <p>Provide at least one of:</p>
            <ol class="bulk-list">
              <li>Basic salary</li>
              <li>Transport allowance</li>
              <li>Rent/Housing allowance</li>
              <li>
                Other allowance (sum of all income excluding basic,rent, and
                transport)
              </li>
            </ol>
          </div>
        </li>
      </ol>
    </section>
  `,
  styles: `
    ul,ol,p{
        padding: 0;
        margin: 0;
    }

    .bulk-notice, .bulk-notice p, li::marker{
        color: red;
    }

    .bulk-notice h4{
        font-size: 18px;
    }

    .bulk-list{
        margin-left: 10px;
        list-style-type: lower-roman;
    }
  `,
  imports: [],
})
export class BulkUploadNoticeComponent {}
