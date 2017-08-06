import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { AccountsService } from './core/services/accounts.service';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { TransferFundsComponent } from './transfer-funds/transfer-funds.component';
import { DisplayTransactionComponent } from './wallets/directives/display-transaction.component';
import { WalletDetailsComponent } from './wallets/wallet-details/wallet-details.component';
import { WalletsComponent } from './wallets/wallets.component';

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
    AccountsService
  ]
})
export class AppModule {
}