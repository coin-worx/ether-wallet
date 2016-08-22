interface Wallet{
	_id?: string;
	title: string;
	description?: string;
	owner: Account;
	balance: number;
	contributors: Array<Account>;
}