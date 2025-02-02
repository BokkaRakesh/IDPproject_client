import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltipStatus]'
})
export class TooltipStatusDirective {
  @Input('appTooltipStatus') statusMetrics!: { [key: string]: number };
  private tooltip: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    return; // Disabled tooltip on hover
  }

  @HostListener('mouseleave') onMouseLeave() {
    return; // Disabled tooltip on hover
  }

  private generateTooltipText(): string {
    const statuses = Object.entries(this.statusMetrics || {})
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => `<span class='tooltip-status'><i class='status-icon ${this.getStatusIcon(status)}'></i> ${this.getStatusLabel(status)}: ${count}</span>`) 
      .join(' | ');
    
    return `<div class='tooltip-container' style='display: flex; flex-direction: row; gap: 10px; white-space: nowrap;'>${statuses}</div>` || '';
  }

  private getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'inProgress': 'bi bi-arrow-repeat text-primary',
      'complete': 'bi bi-check-circle text-success',
      'notApplicable': 'bi bi-x-circle text-danger',
      'notyetstarted': 'bi bi-exclamation-circle text-warning'
    };
    return icons[status] || 'bi bi-question-circle';
  }

  private getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'inProgress': 'In Progress',
      'complete': 'Completed',
      'notApplicable': 'Not Applicable',
      'notyetstarted': 'Not Yet Started'
    };
    return labels[status] || 'Unknown';
  }
}

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
    const studyList = Object.entries(studyDetails || {})
      .filter(([_, details]) => details.names.length > 0)
      .map(([status, details]) => `<strong>${this.getStatusLabel(status)} (${details.count}):</strong><ul><li>${details.names.join('</li><li>')}</li></ul>`)
      .join('<br>');
    
    this.tooltipContainer = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltipContainer, 'study-tooltip');
    this.renderer.setProperty(this.tooltipContainer, 'innerHTML', studyList);
    
    const parentTd = this.el.nativeElement.closest('td');
    this.renderer.appendChild(parentTd, this.tooltipContainer);
  }

  private computeStatusMetrics(study: any): { [key: string]: { count: number, names: string[] } } {
    const statusCounts: { [key: string]: { count: number, names: string[] } } = {};
    (study.fields?.L || []).forEach((field: any) => {
      const status = field.M?.status?.S || 'unknown';
      const label = field.M?.label?.S || 'Unnamed Study';
      if (!statusCounts[status]) {
        statusCounts[status] = { count: 0, names: [] };
      }
      statusCounts[status].count += 1;
      statusCounts[status].names.push(label);
    });
    return statusCounts;
  }

  private getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'inProgress': 'In Progress',
      'complete': 'Completed',
      'notApplicable': 'Not Applicable',
      'notyetstarted': 'Not Yet Started'
    };
    return labels[status] || 'Unknown';
  }
}