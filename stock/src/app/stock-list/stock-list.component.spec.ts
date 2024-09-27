import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockListComponent } from './stock-list.component';
import { StockService } from '../stock.service';
import { EMPTY, of } from 'rxjs';
import { ConfirmationModalComponent } from '../shared/component/confirmation-modal/confirmation-modal.component';
import { Stock } from '../models/stock.model';

class MockStockService {
  getStocks(tag: string) {
    return of([]);
  }

  addDefaultStocksList() {
    return of(null);
  }

  deleteStock(stock: string) {
    return of(null);
  }
}
describe('StockListComponent', () => {
  let component: StockListComponent;
  let fixture: ComponentFixture<StockListComponent>;
  let stockService: StockService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockListComponent, ConfirmationModalComponent],
      providers: [{ provide: StockService, useClass: MockStockService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockListComponent);
    component = fixture.componentInstance;
    stockService = TestBed.inject(StockService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.selectedTag).toBe('All');
    expect(component.tags).toEqual(['All', 'Tech', 'Auto', 'Healthcare']);
    expect(component.selectedStock).toBeNull();
    expect(component.filteredStocks).toEqual([]);
  });

  it('should call getStocks on initialization', () => {
    spyOn(stockService, 'getStocks').and.returnValue(of([]));
    component.ngOnInit();
    expect(stockService.getStocks).toHaveBeenCalledWith('All');
  });

  it('should filter stocks by selected tag', () => {
    const mockStocks = [
      {
        "symbol": "HINDUNILVR",
        "name": "Hindustan Unilever Limited",
        "last_price": 2500.00,
        "market_cap": 580000.00,
        "tag": "consumer"
      },
      {
        "symbol": "TITAN",
        "name": "Titan Company Limited",
        "last_price": 1800.00,
        "market_cap": 160000.00,
        "tag": "consumer"
      }
    ];
    spyOn(stockService, 'getStocks').and.returnValue(of(mockStocks));
    component.selectedTag = 'consumer';
    component.onTagChange();
    expect(stockService.getStocks).toHaveBeenCalledWith('consumer');
    expect(component.filteredStocks).toEqual(mockStocks);
  });

  it('should view stock details', () => {
    const stock ={
      "symbol": "TITAN",
      "name": "Titan Company Limited",
      "last_price": 1800.00,
      "market_cap": 160000.00,
      "tag": "consumer"
    };
    component.viewDetails(stock);
    expect(component.selectedStock).toEqual(stock);
  });

  it('should open delete confirmation modal', () => {
    component.openDeleteConfirmation('TITAN');
    expect(component.stockToDelete).toBe('TITAN');
    expect(component.confirmationModal.openModal).toBeTruthy();
  });

  it('should delete a stock and refresh the list', () => {
    spyOn(stockService, 'deleteStock').and.returnValue(of(undefined));
    spyOn(component, 'getStocks').and.callThrough();

    component.deleteStock('TITAN');

    expect(stockService.deleteStock).toHaveBeenCalledWith('TITAN');
    expect(component.getStocks).toHaveBeenCalled();
  });

  it('should add dummy stocks', () => {
    spyOn(stockService, 'addDefaultStocksList').and.returnValue(of([]));
    spyOn(component, 'getStocks').and.callThrough();
    component.addDummyStock();
    expect(stockService.addDefaultStocksList).toHaveBeenCalled();
    expect(component.getStocks).toHaveBeenCalled();
  });
});
