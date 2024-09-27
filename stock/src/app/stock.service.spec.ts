import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { StockService } from './stock.service';
import { environment } from 'src/environments/environment';

describe('StockService', () => {
  let service: StockService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StockService],
    });

    service = TestBed.inject(StockService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch the default stocks list', () => {
    const dummyStocks = [
      {
        "symbol": "RELIANCE",
        "name": "Reliance Industries Limited",
        "last_price": 2500.00,
        "market_cap": 1600000.00,
        "tag": "energy"
      },
      {
        "symbol": "TCS",
        "name": "Tata Consultancy Services",
        "last_price": 3600.00,
        "market_cap": 1300000.00,
        "tag": "tech"
      },
      {
        "symbol": "INFY",
        "name": "Infosys Limited",
        "last_price": 1700.00,
        "market_cap": 700000.00,
        "tag": "tech"
      },
      {
        "symbol": "HDFC",
        "name": "HDFC Bank Limited",
        "last_price": 1500.00,
        "market_cap": 900000.00,
        "tag": "banking"
      },
      {
        "symbol": "ICICI",
        "name": "ICICI Bank Limited",
        "last_price": 800.00,
        "market_cap": 600000.00,
        "tag": "banking"
      },
      {
        "symbol": "BHARTIARTL",
        "name": "Bharti Airtel Limited",
        "last_price": 700.00,
        "market_cap": 450000.00,
        "tag": "telecom"
      },
      {
        "symbol": "HINDUNILVR",
        "name": "Hindustan Unilever Limited",
        "last_price": 2500.00,
        "market_cap": 580000.00,
        "tag": "consumer"
      },
      {
        "symbol": "LT",
        "name": "Larsen & Toubro Limited",
        "last_price": 2000.00,
        "market_cap": 300000.00,
        "tag": "infrastructure"
      },
      {
        "symbol": "SUNPHARMA",
        "name": "Sun Pharmaceutical Industries",
        "last_price": 900.00,
        "market_cap": 200000.00,
        "tag": "pharma"
      },
      {
        "symbol": "TITAN",
        "name": "Titan Company Limited",
        "last_price": 1800.00,
        "market_cap": 160000.00,
        "tag": "consumer"
      }
    ];

    service.addDefaultStocksList().subscribe((stocks) => {
      expect(stocks).toEqual(dummyStocks);
    });

    const req = httpMock.expectOne(environment.addDefaultStock);
    expect(req.request.method).toBe('GET');
    req.flush(dummyStocks);
  });

  it('should fetch stocks based on tag', () => {
    const tag = 'consumer';
    const dummyStocks = [
      {
        "symbol": "HINDUNILVR",
        "name": "Hindustan Unilever Limited",
        "last_price": 2500.00,
        "market_cap": 580000.00,
        "tag": "consumer"
      },
      {
        "symbol": "LT",
        "name": "Larsen & Toubro Limited",
        "last_price": 2000.00,
        "market_cap": 300000.00,
        "tag": "infrastructure"
      },
      {
        "symbol": "TITAN",
        "name": "Titan Company Limited",
        "last_price": 1800.00,
        "market_cap": 160000.00,
        "tag": "consumer"
      }
    ];

    service.getStocks(tag).subscribe((stocks) => {
      expect(stocks).toEqual(dummyStocks);
    });

    const req = httpMock.expectOne(environment.getStocks);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ tag });
    req.flush(dummyStocks);
  });
  it('should delete a stock', () => {
    const stockSymbol = 'TITAN';

    service.deleteStock(stockSymbol).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.deleteStock}${stockSymbol}`);
    expect(req.request.method).toBe('DELETE');

    req.flush({});
  });


  it('should handle ErrorEvent correctly', () => {
    const errorEvent = new ErrorEvent('Network error', {
      message: 'Unable to connect',
    });

    spyOn(console, 'error');

    const result = service['handleError']({ error: errorEvent });

    result.subscribe({
      error: (error) => {
        expect(error.message).toBe('Error: Unable to connect');
        expect(console.error).toHaveBeenCalledWith('Error: Unable to connect');
      },
    });
  });

  it('should handle HTTP error correctly', () => {
    const httpError = {
      status: 404,
      message: 'Not Found',
      error: { message: 'Resource not found' },
    };

    spyOn(console, 'error');

    const result = service['handleError'](httpError);

    result.subscribe({
      error: (error) => {
        expect(error.message).toBe('Error Code: 404\nMessage: Not Found');
        expect(console.error).toHaveBeenCalledWith('Error Code: 404\nMessage: Not Found');
      },
    });
  });

  it('should handle generic error correctly', () => {
    const genericError = {};
    spyOn(console, 'error');

    const result = service['handleError'](genericError);

    result.subscribe({
      error: (error) => {
        expect(error.message).toBeTruthy();
        expect(console.error).toBeTruthy();
      },
    });
  });
});
