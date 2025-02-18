import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyDetailsComponent } from './study-details.component';

describe('StudyDetailsComponent', () => {
  let component: StudyDetailsComponent;
  let fixture: ComponentFixture<StudyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudyDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
