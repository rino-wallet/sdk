import { WalletEntity } from "../entities";

export const walletMock: WalletEntity = {
  id: "testwalletid",
  name: "Enterprise Main",
  max_daily_amount: 0,
  max_amount: 0,
  min_approvals: 0,
  requires_2fa: false,
  members: [
    {
      id: "91c7f0ba-eae4-40ab-bf46-ceae7ab3850b",
      user: "owner@test.com",
      access_level: "Owner",
      encrypted_keys:
        '{"version":1,"method":"asymmetric","enc_content":"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"}',
      created_at: "2023-05-08T19:08:28.302387Z",
      updated_at: "2023-05-08T19:10:39.761093Z",
    },
    {
      id: "e6c97ae9-6546-44c4-97e4-b6c57cde8cfe",
      user: "approver@test.com",
      access_level: "Approver",
      encrypted_keys: "",
      created_at: "2023-05-09T08:05:10.844166Z",
      updated_at: "2023-05-09T08:05:10.844187Z",
    },
  ],
  created_at: "2023-05-08T19:08:28.299748Z",
  updated_at: "2023-05-19T15:49:54.605962Z",
  height: 1364095,
  address:
    "53hEcBaTN2X2ygkosudTLcYVsp52M7zWi4KvwcvbZpQTe1L3Tgtpn7UErAWpWeggv3AaDpvbVMV5aLX1hSiMsTiFDvjYbPF",
  balance: "8756869120000",
  unlocked_balance: "8756869120000",
  status: "FINALIZED",
  locked_amounts: [],
  is_public: false,
  public_slug: null,
};
