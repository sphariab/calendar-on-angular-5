import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AvailabilityService } from './services/availability.service';
import { CurrencyService } from './services/currency.service';
import { CalendarComponent } from './calendar/calendar.component';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CurrencyComponent } from './currency/currency.component';
import { routes } from './routes';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    HeaderComponent,
    SidebarComponent,
    CurrencyComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    HttpModule,
    FormsModule
  ],
  providers: [
    AvailabilityService,
    CurrencyService,
    HttpModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
