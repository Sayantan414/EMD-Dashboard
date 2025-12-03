import { Injectable } from '@angular/core';
import { CommonService } from './common.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, retry, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrendService {

  private baseUrl: string;
  private authorization: string;

  constructor(private http: HttpClient, private commonService: CommonService) {
    this.baseUrl = this.commonService.getBaseUrl();
    this.authorization = this.commonService.getAuthorization();
  }



  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        Authorization: this.authorization,
      }),
    };
  }


  cob_trend(emd: any): Observable<any> {

    return this.http
      .get<any>(
        `${this.baseUrl}/emd/cob_trend`,
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
            Authorization: this.authorization,
          }),
          params: emd    // 👈 send emd values as query params
        }
      )
      .pipe(retry(1), catchError(this.errorHandler));
  }

  private errorHandler(error: HttpErrorResponse) {
    console.error(error);
    const message =
      error.error?.error ||
      error.message ||
      "Remote server unreachable. Please check your Internet connection.";
    return throwError(() => message);
  }



}





