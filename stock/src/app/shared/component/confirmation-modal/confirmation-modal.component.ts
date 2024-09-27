import { Component, EventEmitter, Output } from '@angular/core';

/**
 * ConfirmationModalComponent - Open the Modal for Confirmation
 *
 * @author: Amol Kumbhar
 */

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css'],
})
export class ConfirmationModalComponent {
  isVisible = false;
  stockSymbol: string = '';

  @Output() deleteConfirmed = new EventEmitter<void>();

  /** Open Modal to pass the symbol
   * @param symbol - pass symbol as string
   */
  openModal(symbol: string) {
    this.stockSymbol = symbol;
    this.isVisible = true;
  }

  /** Close the modal with isVisible false */
  closeModal() {
    this.isVisible = false;
  }

  /** confirmDelete : user Confirm the delete action  */
  confirmDelete() {
    this.deleteConfirmed.emit();
    this.closeModal();
  }
}
