import { Route } from '@angular/router';
import { HomeComponent } from './home/home';
import { LoginComponent } from './login/login';
import { TransferFundsComponent } from './transfer-funds/transfer-funds';
import { WalletDetailsComponent } from './wallets/wallet-details/wallet-details';
import { WalletsComponent } from './wallets/wallets';

export const appRoutes: Route[] = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'transfer-funds', component: TransferFundsComponent},
  {path: 'wallets', component: WalletsComponent},
  {path: 'wallet/:walletId', component: WalletDetailsComponent}
];