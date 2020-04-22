import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customShortDate' })
export class CustomShortDatePipe implements PipeTransform {
  shortMonths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  transform(date: Date): string {
    return `${this.shortMonths[date.getMonth()]} ${date.getDate()} ${date.getFullYear()}`;
  }
}
