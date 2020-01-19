import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbLayoutModule, NbChatModule, NbSidebarModule } from '@nebular/theme';
import { ChatComponent } from './chat/chat.component';
import { ChatRoutingModule } from './chat-routing.module';

@NgModule({
  declarations: [ChatComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    NbLayoutModule,
    NbSidebarModule,
    NbChatModule
  ]
})
export class ChatModule { }
