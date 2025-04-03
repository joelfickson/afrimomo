export interface PayChanguCustomization {
	title: string;
	description: string;
}

export interface PayChanguMeta {
	response: string;
	uuid: string;
}

export interface PayChanguInitialPayment {
	meta: PayChanguMeta;
	currency: string;
	amount: string;
	tx_ref: string;
	email: string;
	first_name: string;
	last_name: string;
	callback_url: string;
	return_url: string;
	customization: PayChanguCustomization;
}

export interface PayChanguDirectChargePayment {
	amount: string;
	currency: string;
	payment_method: string;
	charge_id: string;
	email?: string;
	first_name?: string;
	last_name?: string;
}

export interface PayChanguMobileMoneyPayout {
	mobile: string;
	mobile_money_operator_ref_id: string;
	amount: string;
	charge_id: string;
	email?: string;
	first_name?: string;
	last_name?: string;
	transaction_status?: "failed" | "successful";
}

export interface PayChanguBankPayout {
	payout_method: string;
	bank_uuid: string;
	amount: string;
	charge_id: string;
	bank_account_name: string;
	bank_account_number: string;
	email?: string;
	first_name?: string;
	last_name?: string;
}

export interface PayChanguDirectChargeBankTransfer {
	amount: string;
	currency: string;
	charge_id: string;
	bank_uuid: string;
	bank_account_name: string;
	bank_account_number: string;
	payment_method: string;
	email?: string;
	first_name?: string;
	last_name?: string;
}

export interface PaymentDataInfo {
	account_id: string;
	purchase_amount: string;
	purchase_currency: string;
	item_title: string;
	description: string;
	[key: string]: string;
}
