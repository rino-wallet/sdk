import {
  TaskResponseCreateTxResult,
  TaskResponseEntity,
  TaskResponseSubmitTxResult,
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

export const taskResponseSubmitTxResultMock: TaskResponseSubmitTxResult = {
  created_at: "string",
  updated_at: "string",
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
  wallet: "wallet",
};
