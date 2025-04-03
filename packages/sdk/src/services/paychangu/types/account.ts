/**
 * Account and customer information types for PayChangu service
 */

/**
 * Customer account information
 * 
 * Contains essential customer details used for payment processing and 
 * transaction notifications.
 */
export interface AccountInfo {
	/** Customer's email address where notifications will be sent */
	email: string;
	
	/** Customer's first name */
	first_name: string;
	
	/** Customer's last name */
	last_name: string;
}
