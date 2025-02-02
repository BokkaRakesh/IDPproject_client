import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTooltipStatus]'
})
export class TooltipStatusDirective {
  @Input('appTooltipStatus') statusMetrics!: { [key: string]: number };
  private tooltip: HTMLElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (this.tooltip || !this.statusMetrics || Object.keys(this.statusMetrics).length === 0) {
      return;
    }

    const tooltipText = this.generateTooltipText();
    if (!tooltipText) {
      return;
    }

    this.tooltip = this.renderer.createElement('div');
    this.renderer.addClass(this.tooltip, 'custom-tooltip');
    this.renderer.setProperty(this.tooltip, 'innerHTML', tooltipText);
    this.renderer.appendChild(document.body, this.tooltip);

    const rect = this.el.nativeElement.getBoundingClientRect();
    this.renderer.setStyle(this.tooltip, 'top', `${rect.top + window.scrollY - 40}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${rect.left + window.scrollX}px`);
    this.renderer.setStyle(this.tooltip, 'position', 'absolute');
    this.renderer.setStyle(this.tooltip, 'transform', 'translateY(-100%)');
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltip) {
      this.renderer.removeChild(document.body, this.tooltip);
      this.tooltip = null;
    }
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
      'notApplicable': 'bi bi-ban text-danger',
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
