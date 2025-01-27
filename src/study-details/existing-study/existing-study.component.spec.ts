import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingStudyComponent } from './existing-study.component';

describe('ExistingStudyComponent', () => {
  let component: ExistingStudyComponent;
  let fixture: ComponentFixture<ExistingStudyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExistingStudyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExistingStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
