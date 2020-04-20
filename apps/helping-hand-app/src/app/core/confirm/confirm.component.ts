import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'helping-hand-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent {

  constructor(protected dialogRef: NbDialogRef<any>) { }

  respond(confirmed: boolean) {
    this.dialogRef.close({ confirmed });
  }
}
