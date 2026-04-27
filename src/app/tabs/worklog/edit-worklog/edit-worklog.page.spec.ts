import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditWorklogPage } from './edit-worklog.page';

describe('EditWorklogPage', () => {
  let component: EditWorklogPage;
  let fixture: ComponentFixture<EditWorklogPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWorklogPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
