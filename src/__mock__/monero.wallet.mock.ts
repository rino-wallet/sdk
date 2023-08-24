import { createMock } from "@golevelup/ts-jest";

import { walletSubaddressesMock } from ".";

import { MoneroWallet } from "../monero/Wallet";
import { MoneroSubaddress } from "../types";

export const moneroWalletMock = createMock<MoneroWallet>({
  getSubaddresses: jest.fn((index: number) => {
    return createMockMoneroSubaddresses(index);
  }),
  getMultisigHex: jest.fn(() => Promise.resolve("")),
  importOutputs: jest.fn(),
  importMultisigHex: jest.fn(() => Promise.resolve(0)),
  loadMultisigTx: jest.fn(() =>
    Promise.resolve({
      state: {},
    }),
  ),
  reconstructAndValidateTransaction: jest.fn(() => Promise.resolve("")),
});

const createMockMoneroSubaddresses = (
  index: number,
): Promise<MoneroSubaddress[]> => {
  return Promise.resolve([
    {
      state: {
        accountIndex: 0,
        index,
        balance: new Uint8Array(0),
        unlockedBalance: new Uint8Array(0),
        numUnspentOutputs: 0,
        numBlocksToUnlock: 0,
        address: walletSubaddressesMock[0].address,
        label: undefined,
        isUsed: false,
      },
    },
  ]);
};
