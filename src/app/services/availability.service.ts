import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable()
export class AvailabilityService {

public constructor(
  private http: Http
) {}

  public getAvailabilities(firstMonth: number, secondMonth: number, year: string): Observable<any> {
    return this.http.get('https://myfixerapi.db2dev.com/api/availability/?month_start=' + firstMonth + '&month_end=' + secondMonth + '&year=' + year)
      .map( (res: any) => {
        return res.json();
      })
      .catch((err: Error) => {
        return Observable.of(err || 'Cannot get user profile');
      });
  }

  public sendAvailabilities(dates): Observable<any> {
    return this.http.post(
      'https://myfixerapi.db2dev.com/api/availability/',
      dates
    )
      .map( (res: any) => {

        return res.json();
      })
      .catch((err: Error) => {
        return Observable.of(err || 'Cannot get user profile');
      });
  }
}
