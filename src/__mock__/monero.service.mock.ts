import { createMock } from "@golevelup/ts-jest";

import { MoneroService } from "../monero/monero.service";

import { moneroWalletMock } from "./monero.wallet.mock";

export const moneroServiceMock = createMock<MoneroService>({
  userWallet: moneroWalletMock,
  openWallet: jest.fn(),
  closeWallet: jest.fn(),
});
