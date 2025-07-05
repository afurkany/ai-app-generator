import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'endEllipsis',
  standalone: true,
})
export class EndEllipsisPipe implements PipeTransform {
  transform(value: string, maxLength: number = 40): string {
    if (!value || value.length <= maxLength) {
      return value;
    }

    const start = value.substring(0, maxLength);

    return `${start} ... `;
  }
}
