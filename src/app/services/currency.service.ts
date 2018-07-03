import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class CurrencyService {
  public constructor(private http: Http) {
  }

  public getCurrencies(page): Observable<any> {
    return this.http.get('https://myfixerapi.db2dev.com/api/currency/' + '/?page=' + page + '&page_size=' + 60)
      .map((res: any) => {
        return res.json();
      })
      .catch((err: Error) => {
        return Observable.of(err || 'Cannot get user profile');
      });
  }

  public deleteCurrency(id: number): Observable<any> {
    return this.http.delete('https://myfixerapi.db2dev.com/api/currency/' + id, id)
      .map( (res: any) => {
        return res.json();
      })
      .catch((err: Error) => {
        return Observable.of(err || 'Cannot get user profile');
      });
  }

  public addCurrency(currency): Observable<any>{
    return this.http.post('https://myfixerapi.db2dev.com/api/currency/', currency)
      .map( (res: any) => {
        return res.json();
      })
      .catch((err: Error) => {
        return Observable.of(err || 'Cannot get user profile');
      });
  }

  public updateCurrency(id, value): Observable<any> {
    return this.http.patch('https://myfixerapi.db2dev.com/api/currency/' + id + '/', value)
      .map( (res: any) => {
        return res.json();
      })
      .catch((err: Error) => {
        return Observable.of(err || 'Cannot get user profile');
      });
  }

  public updateRates(): Observable<any> {
    return this.http.get('https://myfixerapi.db2dev.com/api/currency/?update=all')
      .map( (res: any) => {
        return res.json();
      })
      .catch((err: Error) => {
        return Observable.of(err || 'Cannot get user profile');
      });
  }
}

