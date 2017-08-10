import { Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { TransferFundsComponent } from './transfer-funds/transfer-funds.component';
import { WalletDetailsComponent } from './wallets/wallet-details/wallet-details.component';
import { WalletsComponent } from './wallets/wallets.component';

export const appRoutes: Route[] = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'transfer-funds', component: TransferFundsComponent},
  {path: 'wallets', component: WalletsComponent},
  {path: 'wallet/:walletId', component: WalletDetailsComponent}
];