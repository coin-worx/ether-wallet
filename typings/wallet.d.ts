interface Wallet{
	_id?: string;
	title: string;
	eth_address: string;
	eth_password: string;
	owner: Account;
	balance: number;
	contributors: Array<Account>;
	created_at: Date;
}