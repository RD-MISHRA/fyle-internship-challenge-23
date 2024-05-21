import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginationComponent],
      imports: [FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component.totalItems = 100;
    component.itemsPerPage = 10;
    component.currentPage = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate total pages correctly', () => {
    expect(component.totalPages).toBe(10);
  });

  it('should emit pageChange event when changePage is called', () => {
    spyOn(component.pageChange, 'emit');
    component.changePage(2);
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  it('should not emit pageChange event if page is out of range', () => {
    spyOn(component.pageChange, 'emit');
    component.changePage(0);
    expect(component.pageChange.emit).not.toHaveBeenCalled();
    component.changePage(11);
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should emit itemsPerPageChange event when onItemsPerPageChange is called', () => {
    spyOn(component.itemsPerPageChange, 'emit');
    const event = { target: { value: 20 } };
    component.onItemsPerPageChange(event);
    expect(component.itemsPerPageChange.emit).toHaveBeenCalledWith(20);
  });

  it('should generate correct pages array', () => {
    expect(component.pages).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('should disable previous button on first page', () => {
    const prevButton = debugElement.query(By.css('button[disabled]'));
    expect(prevButton.nativeElement.textContent.trim()).toBe('Previous');
  });

  it('should disable next button on last page', () => {
    component.currentPage = 10;
    fixture.detectChanges();
    const nextButton = debugElement.query(By.css('button[disabled]'));
    expect(nextButton.nativeElement.textContent.trim()).toBe('Next');
  });

  it('should highlight the current page button', () => {
    const currentPageButton = debugElement.query(By.css('.bg-blue-500.text-white'));
    expect(currentPageButton.nativeElement.textContent.trim()).toBe('1');
  });

  it('should update itemsPerPage when select option is changed', () => {
    const select = debugElement.query(By.css('select')).nativeElement;
    select.value = select.options[2].value; // 20
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.itemsPerPage).toBe(20);
  });
});