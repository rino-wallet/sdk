export interface WalletSubmitTransactionPayload {
  tx_hex: string;
  memo: string;
  order_id?: string;
  ip_addr?: string;
}
