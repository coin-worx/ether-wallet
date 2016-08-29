interface Wallet{
	_id?: string;
	title: string;
	eth_address: string;
	eth_password: string;
	owner: Account;
	balance: string;
	contributors: Array<Account>;
	permissions: any;
	created_at: Date;
}