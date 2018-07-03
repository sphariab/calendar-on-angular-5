import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../services/currency.service';


export interface ICurrency {
  id: number;
  code: string;
  name: string;
  base: string;
  rate: number;
}

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})

export class CurrencyComponent implements OnInit {
  public currencies: any = [];
  public addCurrencyToRow: boolean = false;
  public currencyLists: any = [{page: 1, size: 10 }, {page: 1, size: 60}, {page: 2, size: 120}, {page: 2, size: 180}, {page: 2, size: 240}];
  public selectedValue: number;
  private results = [];
  public newCurrency = {
    'code': null,
    'name': null,
    'rate': null
  };
  private required: boolean = false;

  public constructor(private currencyService: CurrencyService) {}

  public ngOnInit(): void {
    this.currencies = this.getCurrencies();
    this.selectedValue = this.currencyLists[0].size;

  };
  public getCurrencies(): void {
    for (let page: number = 1; page < 4; page++) {
      this.currencyService.getCurrencies(page)
        .subscribe(
          res => {
            this.currencies = this.currencies.concat(res.results);
          }
        );
    }

    return this.currencies;
/*    console.log('currencies', this.currencies);*/
  }

  public deleteCurrency(id: number): void {
    this.currencyService.deleteCurrency(id)
     .subscribe(
         res => {
             this.currencies.forEach(function (currency: any, index: number): void {
               currency.id === id ?  this.currencies.splice( index, 1) : null;
             }.bind(this));
         },
     );

  }

  public addRow (): void {
    this.addCurrencyToRow = true;
  }

  public updateCurrency(id, value): void {
    this.currencyService.updateCurrency(id, value)
      .subscribe(
        res => {
          this.currencies.map(function (currency: any) {
            if (currency.id === res.id) {
              currency = res;
            }
          }.bind(this));
        },
      );
  }

  public createCurrency(newCurrency): void {
    for (const value in newCurrency) {
      if (newCurrency[value] === null) {
        this.required = true;
      } else {
        this.required = false;
      }

    }
    if (!this.required && newCurrency.name && newCurrency.rate && newCurrency.code) {
      this.currencyService.addCurrency(newCurrency)
        .subscribe(
          res => {
            this.currencies.unshift(res);
            this.addCurrencyToRow = false;
          },
        );
        this.newCurrency = {
          'name': null,
          'rate': null,
          'code': null
        };
    }
  }

 public updateRates(): void {
    this.currencyService.updateRates()
      .subscribe(
        res => {
          this.currencies = res.results;
        },
      );
 }
}
