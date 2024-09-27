import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { By } from '@angular/platform-browser';

describe('ConfirmationModalComponent', () => {
  let component: ConfirmationModalComponent;
  let fixture: ComponentFixture<ConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmationModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should open the modal and set the stock symbol', () => {
    const symbol = 'TITAN';
    component.openModal(symbol);
    expect(component.isVisible).toBeTrue();
    expect(component.stockSymbol).toBe(symbol);
  });

  it('should close the modal', () => {
    component.openModal('TITAN');
    component.closeModal();
    expect(component.isVisible).toBeFalse();
  });

  it('should emit deleteConfirmed when confirmDelete is called', () => {
    spyOn(component.deleteConfirmed, 'emit');
    component.confirmDelete();
    expect(component.deleteConfirmed.emit).toHaveBeenCalled();
    expect(component.isVisible).toBeFalse();
  });
});
