# EtherWallet
EtherWallet is money transfer and wallet management application which uses Ethereum to transfer money. This application is developed using [Meteor](https://www.meteor.com/) and [Angular2](https://angular.io).

## Quick Start
Run this application by following these steps:

1. **Clone from GitHub**

    ```sh
    $ git clone https://github.com/coin-worx/ether-wallet.git
    $ cd ether-wallet
    ```

2. **Run Dockerized**
    1. **Build Image**
    ```sh
    sudo docker run -i --rm -p 3000:3000 etherwallet
    ```
  
    2. **Run Container**
    ```sh
    sudo docker run -i --rm -p 3000:3000 etherwallet
    ```

3. **Run non-Dockerized**
    1. **Resolve dependencies**
    ```sh
    $ npm install
    ```

    2. **Run the application**
    ```sh
    $ meteor
    ```

## Screenshots
#### Home
![Home](/screenshots/home.png?raw=true)

#### Transfer Funds
![Transfer Funds](/screenshots/transfer-funds.png?raw=true)

#### Select Currency Unit
![Select Currency Unit](/screenshots/select-currency-unit.png?raw=true)

#### Wallets List
![Wallets List](/screenshots/wallets.png?raw=true)

#### Wallet Details
![Wallet Details](/screenshots/wallet-details.png?raw=true)

#### Add Wallet Contributor
![Add Wallet Contributor](/screenshots/add-wallet-contributor.png?raw=true)

#### Wallet Contributor Permissions
![Wallet Contributor Permissions](/screenshots/contributor-permissions.png?raw=true)

#### Wallet Deposit
![Wallet Deposit](/screenshots/wallet-transaction-deposit.png?raw=true)

#### Wallet Withdraw
![Wallet Withdraw](/screenshots/wallet-transaction-withdraw.png?raw=true)
