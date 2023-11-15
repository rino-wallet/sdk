import { ApiProperty } from "@nestjs/swagger";

export class WalletTransactionSubmitResultDestination {
  @ApiProperty()
  transaction_txid: string;

  @ApiProperty()
  transaction_wallet_id: string;

  @ApiProperty()
  index: number;

  @ApiProperty()
  address: string;

  @ApiProperty()
  amount: string;
}

export class WalletTransactionSubmitResultWallet {
  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  id: string;

  @ApiProperty()
  balance: string;

  @ApiProperty()
  unlocked_balance: string;

  @ApiProperty()
  creation_height: number;

  @ApiProperty()
  height: string;

  @ApiProperty()
  last_interaction_at: string;

  @ApiProperty()
  last_sync_at: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  status: string;
}

export class WalletTransactionSubmitResultResponse {
  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  wallet_id: string;

  @ApiProperty()
  txid: string;

  @ApiProperty()
  amount: string;

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  direction: string;

  @ApiProperty()
  fee: string;

  @ApiProperty()
  confirmations: number;

  @ApiProperty()
  created_on_platform: boolean;

  @ApiProperty()
  tx_to_self: boolean;

  @ApiProperty()
  memo: string;

  @ApiProperty()
  order_id: string;

  @ApiProperty()
  ip_addr: string;

  @ApiProperty()
  euro_amount: string;

  @ApiProperty()
  destinations: WalletTransactionSubmitResultDestination[];

  @ApiProperty()
  wallet: WalletTransactionSubmitResultWallet;
}
