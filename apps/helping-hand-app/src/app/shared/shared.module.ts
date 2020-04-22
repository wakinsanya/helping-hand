import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { NbIconModule, NbButtonModule } from '@nebular/theme';



@NgModule({
  declarations: [PaginatorComponent],
  imports: [
    CommonModule,
    NbIconModule,
    NbButtonModule
  ],
  exports: [PaginatorComponent]
})
export class SharedModule { }
