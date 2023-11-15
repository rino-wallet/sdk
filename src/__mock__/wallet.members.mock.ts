import { WalletMemberEntity } from "../entities";
import { Page } from "../types";

export const walletMembersMock: Page<WalletMemberEntity> = {
  count: 2,
  next: "",
  previous: "",
  results: [
    {
      id: "91c7f0ba-eae4-40ab-bf46-ceae7ab3850b",
      access_level: "Owner",
      created_at: "2023-05-08T19:08:28.302387Z",
      user: {
        email: "ronye+3@cryptosphere-systems.com",
        name: " ",
      },
      wallet: {
        id: "57de9693-cda3-4248-9841-85fd23ee0748",
        name: "Enterprise Main",
      },
    },
    {
      id: "e6c97ae9-6546-44c4-97e4-b6c57cde8cfe",
      access_level: "Approver",
      created_at: "2023-05-09T08:05:10.844166Z",
      user: {
        email: "ronye+4@cryptosphere-systems.com",
        name: " ",
      },
      wallet: {
        id: "57de9693-cda3-4248-9841-85fd23ee0748",
        name: "Enterprise Main",
      },
    },
  ],
};
