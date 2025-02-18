import { ElementRef, Renderer2 } from '@angular/core';
import { TooltipStatusDirective } from './tooltip-status.directive';

describe('TooltipStatusDirective', () => {
  it('should create an instance', () => {
    const elementRef = {} as ElementRef;
    const renderer = {} as Renderer2;
    const directive = new TooltipStatusDirective(elementRef, renderer);
    expect(directive).toBeTruthy();
  });
});
