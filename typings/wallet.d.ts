interface Wallet{
	_id?: string;
	title: string;
	eth_address: string;
	owner: Account;
	balance: number;
	contributors: Array<Account>;
}