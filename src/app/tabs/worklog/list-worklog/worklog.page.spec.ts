import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorklogPage } from './worklog.page';

describe('WorklogPage', () => {
  let component: WorklogPage;
  let fixture: ComponentFixture<WorklogPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WorklogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
