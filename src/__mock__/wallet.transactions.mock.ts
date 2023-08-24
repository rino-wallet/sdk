import { WalletTransactionEntity } from "../entities";

export const walletTransactionsMock: WalletTransactionEntity[] = [
  {
    id: "transaction_id_0",
    amount: "710000000",
    timestamp: "2023-06-01T10:04:27.000Z",
    direction: "out",
    fee: "136980000",
    confirmations: 101,
    destinations: [
      {
        index: 0,
        address:
          "7AsgQdjExEwieccaBhuBUThTJmJ77o5BeACNGCZRGPJbSGYhBA7aG9NdYbtGAKs4PWFrkkMZGzhPiDpnw5bxL5nQQw7Rq4v",
        address_label: "",
        amount: "710000000",
      },
    ],
    created_at: "2023-06-01T10:02:14.431Z",
    memo: "",
    tx_to_self: false,
  },
  {
    id: "transaction_id_1",
    amount: "7100000000",
    timestamp: "2023-06-01T09:08:17.000Z",
    direction: "out",
    fee: "137070000",
    confirmations: 117,
    destinations: [
      {
        index: 0,
        address:
          "7AsgQdjExEwieccaBhuBUThTJmJ77o5BeACNGCZRGPJbSGYhBA7aG9NdYbtGAKs4PWFrkkMZGzhPiDpnw5bxL5nQQw7Rq4v",
        address_label: "",
        amount: "7100000000",
      },
    ],
    created_at: "2023-06-01T09:06:18.810Z",
    memo: "",
    tx_to_self: false,
  },
  {
    id: "transaction_id_2",
    amount: "7100000000",
    timestamp: "2023-06-01T07:51:06.000Z",
    direction: "out",
    fee: "137340000",
    confirmations: 114,
    destinations: [
      {
        index: 0,
        address:
          "7AsgQdjExEwieccaBhuBUThTJmJ77o5BeACNGCZRGPJbSGYhBA7aG9NdYbtGAKs4PWFrkkMZGzhPiDpnw5bxL5nQQw7Rq4v",
        address_label: "",
        amount: "7100000000",
      },
    ],
    created_at: "2023-06-01T07:50:24.560Z",
    memo: "",
    tx_to_self: false,
  },
  {
    id: "transaction_id_3",
    amount: "7100000000",
    timestamp: "2023-05-26T09:18:54.000Z",
    direction: "out",
    fee: "138510000",
    confirmations: 134,
    destinations: [
      {
        index: 0,
        address:
          "7AsgQdjExEwieccaBhuBUThTJmJ77o5BeACNGCZRGPJbSGYhBA7aG9NdYbtGAKs4PWFrkkMZGzhPiDpnw5bxL5nQQw7Rq4v",
        address_label: "",
        amount: "7100000000",
      },
    ],
    created_at: "2023-05-26T09:14:03.026Z",
    memo: "",
    tx_to_self: false,
  },
  {
    id: "transaction_id_4",
    amount: "7000000000",
    timestamp: "2023-05-26T08:52:15.000Z",
    direction: "out",
    fee: "138690000",
    confirmations: 107,
    destinations: [
      {
        index: 0,
        address:
          "7AsgQdjExEwieccaBhuBUThTJmJ77o5BeACNGCZRGPJbSGYhBA7aG9NdYbtGAKs4PWFrkkMZGzhPiDpnw5bxL5nQQw7Rq4v",
        address_label: "",
        amount: "7000000000",
      },
    ],
    created_at: "2023-05-26T08:48:18.465Z",
    memo: "",
    tx_to_self: false,
  },
];
