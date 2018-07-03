import { Routes } from '@angular/router';
import { CalendarComponent } from './calendar/calendar.component';
import { CurrencyComponent } from './currency/currency.component';

export const routes: Routes = [
  { path: 'calendar', component: CalendarComponent},
  { path: 'currency', component: CurrencyComponent},
  { path: '', component: CalendarComponent}
];
