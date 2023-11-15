import {
  TaskResponseCreateTxResult,
  TaskResponseEntity,
  WalletTransactionSubmitResultResponse,
} from "../entities";

export const taskResponseMock: TaskResponseEntity = {
  id: "taskid",
  status: "COMPLETED",
  type: "EXPORT_OUTPUTS",
  created_at: "timestamp",
  started_at: "timestamp",
  updated_at: "timestamp",
  completed_at: "timestamp",
  wallet_id: "walletid",
  result: {
    outputs_hex: "",
    multisig_hex: "",
    txs_hex: "",
  },
  params: undefined,
};

export const taskResponseCreateTxResultMock: TaskResponseCreateTxResult = {
  txs_hex: "string",
  multisig_hex: "string",
};

export const submitResultMock: WalletTransactionSubmitResultResponse = {
  created_at: "string",
  updated_at: "string",
  wallet_id: "string",
  txid: "string",
  amount: "string",
  timestamp: "string",
  direction: "string",
  fee: "string",
  confirmations: 0,
  created_on_platform: true,
  tx_to_self: false,
  memo: "string",
  order_id: "string",
  ip_addr: "string",
  euro_amount: "string",
  destinations: [],
  wallet: {
    created_at: "string",
    updated_at: "string",
    id: "string",
    balance: "string",
    unlocked_balance: "string",
    creation_height: 0,
    height: "string",
    last_interaction_at: "string",
    last_sync_at: "string",
    address: "string",
    status: "string",
  },
};
