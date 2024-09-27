import { Component, OnInit, ViewChild } from '@angular/core';
import { StockService } from '../stock.service';
import { ConfirmationModalComponent } from '../shared/component/confirmation-modal/confirmation-modal.component';
import { Stock } from '../models/stock.model';

/**
 * StockListComponent displays the list of stocks
 * Functionality: Tag wise filter and Delete any stock
 *
 * @author: Amol Kumbhar
 */

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css'],
})
export class StockListComponent implements OnInit {
  selectedTag: string = 'All';
  tags: string[] = ['All', 'Energy', 'Tech', 'Banking', 'Telecom', 'Consumer', 'Infrastructure', 'Pharma'];
  selectedStock: Stock | null = null;
  filteredStocks: Stock[] = [];
  @ViewChild('confirmationModal')
  confirmationModal!: ConfirmationModalComponent;
  stockToDelete: string = '';

  constructor(private stockService: StockService) {}

  ngOnInit(): void {
    this.getStocks(this.selectedTag);
  }

  /** Adds dummy/default stocks and refresh stock list on the basis of selected tag. */
  addDummyStock(): void {
    this.stockService.addDefaultStocksList().subscribe(() => {
      this.getStocks(this.selectedTag);
    });
  }

  /** Get the list of stocks based on the selected tag and updates the filteredStocks array.
   *  @param selectedTag - pass the selectedTag as string to get the stock list
   */
  getStocks(selectedTag: string): void {
    this.stockService.getStocks(selectedTag).subscribe((stocks: Stock[]) => {
      this.filteredStocks = stocks;
    });
  }

  /** Change the Tag then fetch the stock based on selected tag */
  onTagChange(): void {
    this.stockService
      .getStocks(this.selectedTag)
      .subscribe((stocks: Stock[]) => {
        this.filteredStocks = stocks;
      });
  }

  /**
   * View details of the selected stock
   * @param stock - pass the stock as object stored int selectedStock
   */
  viewDetails(stock: Stock): void {
    this.selectedStock = stock;
  }

  /**
   * Opens a confirmation modal for deleting the selected stock.
   * @param symbol - The symbol of the stock to be deleted
   */
  openDeleteConfirmation(symbol: string): void {
    this.stockToDelete = symbol;
    this.confirmationModal.openModal(symbol);
  }

  /**
   * Deletes the selected stock and get the updated stock list.
   * @param stock - pass the stock as string for deleting from stock list
   */
  deleteStock(stock: string): void {
    this.stockService.deleteStock(stock).subscribe(() => {
      this.selectedStock = null;
      this.getStocks(this.selectedTag);
    });
  }
}
