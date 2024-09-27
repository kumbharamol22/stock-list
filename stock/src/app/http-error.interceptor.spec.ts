import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HTTP_INTERCEPTORS, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorInterceptor } from './http-error.interceptor';

describe('HttpErrorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Create a mock for the Router
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: routerSpy }, // Inject the Router mock
        { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding requests
  });

  it('should handle client-side error', () => {
    // Simulate a client-side error
    const errorMessage = 'Client-side error';
    const mockError = new ErrorEvent('Network error', {
      message: errorMessage,
    });

    httpClient.get('/dummy-endpoint').subscribe({
      next: () => fail('Should have failed with the client-side error'),
      error: (error: Error) => {
        expect(error.message).toContain(errorMessage); // Assert the error message
      },
    });

    const req = httpMock.expectOne('/dummy-endpoint');
    req.error(mockError);
  });

  it('should handle 404 server-side error and redirect to /page-not-found', () => {
    // Simulate a 404 server-side error
    const errorMessage = '404 error';
    const mockErrorResponse = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
    });

    httpClient.get('/dummy-endpoint').subscribe({
      next: () => fail('Should have failed with the 404 error'),
      error: (error: Error) => {
        expect(error.message).toContain('Error Code: 404'); // Check error status
      },
    });

    const req = httpMock.expectOne('/dummy-endpoint');
    req.flush(errorMessage, { status: 404, statusText: 'Not Found' });

    // Check if the Router.navigate was called with ['/page-not-found']
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/page-not-found']);
  });

  it('should handle 500 server-side error without redirection', () => {
    // Simulate a 500 server-side error
    const errorMessage = '500 error';
    const mockErrorResponse = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
    });

    httpClient.get('/dummy-endpoint').subscribe({
      next: () => fail('Should have failed with the 500 error'),
      error: (error: Error) => {
        expect(error.message).toContain('Error Code: 500'); // Check error status
      },
    });

    const req = httpMock.expectOne('/dummy-endpoint');
    req.flush(errorMessage, { status: 500, statusText: 'Internal Server Error' });

    // Ensure the router was not called for 500 errors
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
