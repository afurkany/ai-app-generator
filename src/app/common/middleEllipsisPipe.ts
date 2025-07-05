import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'middleEllipsis',
  standalone: true,
})
export class MiddleEllipsisPipe implements PipeTransform {
  transform(value: string, maxLength: number = 40): string {
    if (!value || value.length <= maxLength) {
      return value;
    }

    const half = Math.floor((maxLength - 3) / 2); // reserve 3 chars for '...'
    const start = value.substring(0, half);
    const end = value.substring(value.length - half);

    return `${start} ... ${end}`;
  }
}
