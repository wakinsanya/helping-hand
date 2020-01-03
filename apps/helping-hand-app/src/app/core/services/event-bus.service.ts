import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export enum AppEvent {

}

export class EmitEvent {
  name: any;
  value: any;
  constructor(name: AppEvent, value?: any) {
    this.name = name;
    this.value = value;
  }
}

@Injectable()
export class EventBusService {
  private subject: Subject<any> = new Subject<any>();

  constructor() {}

  on(event: AppEvent, action: any): Subscription {
    return this.subject
      .pipe(
        filter((e: EmitEvent) => e.name === event),
        map((e: EmitEvent) => e.value)
      )
      .subscribe(action);
  }

  emit(event: EmitEvent) {
    this.subject.next(event);
  }
}
