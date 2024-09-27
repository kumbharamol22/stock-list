import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Stock } from './models/stock.model';

/**
 * StockService - Get Default Stock, Fetch Stock based on Tag and Delete Stock API
 *
 * @author: Amol Kumbhar
 */

@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(private http: HttpClient) {}

  /** Get the default stock list from the API. */
  addDefaultStocksList(): Observable<Stock[]> {
    return this.http
      .get<Stock[]>(`${environment.addDefaultStock}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get stocks based on tag.
   * @param tag - The tag is a string which is used to filter stocks
   */
  getStocks(tag: string): Observable<Stock[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http
      .post<Stock[]>(`${environment.getStocks}`, { tag }, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes a stock.
   * @param stock - The stock as string to be deleted.
   */
  deleteStock(stock: string): Observable<void> {
    return this.http
      .delete<void>(`${environment.deleteStock}${stock}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Handle errors locally.
   * @param error - The error response
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
