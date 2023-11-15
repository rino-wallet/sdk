import { WalletRemovedSpenderEntity } from "../entities";
import { Page } from "../types";

export const walletRemovedSpendersMock: Page<WalletRemovedSpenderEntity> = {
  count: 1,
  next: "",
  previous: "",
  results: [
    {
      user: "ronye+4@cryptosphere-systems.com",
      deleted_at: "2023-06-01T14:16:44.774923Z",
    },
  ],
};
