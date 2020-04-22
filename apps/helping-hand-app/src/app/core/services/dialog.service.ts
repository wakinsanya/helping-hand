import { Injectable } from '@angular/core';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { ConfirmComponent } from '../confirm/confirm.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService extends NbDialogService {

  confirm(): Observable<{ confirmed: boolean }> {
    return this.open(ConfirmComponent).onClose;
  }
}
