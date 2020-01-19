import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbLayoutModule, NbChatModule } from '@nebular/theme';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    NbLayoutModule,
    NbChatModule
  ]
})
export class ChatModule { }
