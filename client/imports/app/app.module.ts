import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { HomeComponent } from './home/home';
import { LoginComponent } from './login/login';
import { AccountsService } from './services/accounts.service';
import { NavigationService } from './services/navigation.service';
import { TransferFundsComponent } from './transfer-funds/transfer-funds';
import { DisplayTransactionComponent } from './wallets/directives/display-transaction';
import { WalletDetailsComponent } from './wallets/wallet-details/wallet-details';
import { WalletsComponent } from './wallets/wallets';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    TransferFundsComponent,
    WalletsComponent,
    WalletDetailsComponent,
    DisplayTransactionComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    AccountsService,
    NavigationService
  ]
})
export class AppModule {
}