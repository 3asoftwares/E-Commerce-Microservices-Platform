export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
  CASH_ON_DELIVERY = 'cash_on_delivery',
  BANK_TRANSFER = 'bank_transfer',
  UPI = 'upi',
}

export const PaymentMethodReverse: any = {
  credit_card: 'CREDIT_CARD',
  debit_card: 'DEBIT_CARD',
  paypal: 'PAYPAL',
  stripe: 'STRIPE',
  cash_on_delivery: 'CASH_ON_DELIVERY',
  bank_transfer: 'BANK_TRANSFER',
  upi: 'UPI',
};
