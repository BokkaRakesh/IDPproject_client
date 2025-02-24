import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
selector: '[appInfoIcon]'
})
export class InfoIconDirective {
@Input('appInfoIcon') study!: any;
private tooltipContainer: HTMLElement | null = null;

constructor(private el: ElementRef, private renderer: Renderer2) {}

@HostListener('click') onClick() {
if (this.tooltipContainer) {
this.renderer.removeChild(document.body, this.tooltipContainer);
this.tooltipContainer = null;
return;
}

const studyDetails = this.computeStatusMetrics(this.study);
const statusOrder = ['inProgress', 'complete', 'notyetstarted'];

const studyList = statusOrder
  .filter(status => studyDetails[status] && studyDetails[status].count > 0) // Exclude zero-count statuses
  .map(status => 
    `<strong>${this.getStatusLabel(status)} (${studyDetails[status].count}):</strong><ul><li>${studyDetails[status].names.join('</li><li>')}</li></ul>`
  )
  .join('<br>');

this.tooltipContainer = this.renderer.createElement('div');
this.renderer.addClass(this.tooltipContainer, 'study-tooltip');
this.renderer.setProperty(this.tooltipContainer, 'innerHTML', studyList);

const parentTd = this.el.nativeElement.closest('td');
this.renderer.appendChild(parentTd, this.tooltipContainer);
}

private computeStatusMetrics(study: any): { [key: string]: { count: number, names: string[] } } {
  const statusOrder = ['inProgress', 'complete', 'notyetstarted'];
  const statusCounts: { [key: string]: { count: number, names: string[] } } = {};
  
  statusOrder.forEach(status => {
    statusCounts[status] = { count: 0, names: [] };
  });
  
  (study.fields?.L || []).forEach((field: any) => {
    const keyValue = field.M?.key?.S || '';
    const status = field.M?.status?.S || '';
    const label = field.M?.label?.S || '';
    
    if (statusOrder.includes(status) && keyValue !== 'requestNewData') {
      statusCounts[status].count += 1;
      statusCounts[status].names.push(label);
    }
  });
  
  return statusCounts;
}

private getStatusLabel(status: string): string {
  const labels: { [key: string]: string } = {
    'inProgress': 'In Progress',
    'complete': 'Completed',
    'notyetstarted': 'Not Yet Started'
  };
  return labels[status] || '';
}
}

