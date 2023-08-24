export interface IWalletData {
  offlineMode: boolean;
  daemonHeight: number | null;
  syncHeight: number | null;
  isMultisig: boolean;
  address: string;
  keyHex: string;
  base64Key: string;
  balance: string;
  multisigSeed: string;
}

export type WalletConfig = {
  path?: string;
  password: string;
  networkType: "mainnet" | "testnet" | "stagenet";
  seedOffset?: string;
  primaryAddress?: string;
  privateViewKey?: string;
  privateSpendKey?: string;
  restoreHeight?: number;
  language?: string;
  serverUri?: string;
  serverUsername?: string;
  serverPassword?: string;
  rejectUnauthorized?: boolean;
  server?: any;
  proxyToWorker?: boolean;
  keysData?: Uint8Array;
  cacheData?: Uint8Array;
};

export type ExchangeMultisigKeysResult = {
  state: {
    address?: string;
    multisigHex: string;
  };
};

export type TransactionConfig = {
  address?: string;
  amount?: string;
  fee?: number;
};

export type WalletRaw = {
  isConnected: () => boolean;
  getBalance: (a: number, b: number) => Promise<number>;
  getUnlockedBalance: (a: number, b: number) => Promise<number>;
  getDaemonHeight: () => Promise<number>;
  getHeight: () => Promise<number>;
  getMultisigInfo: () => Promise<{ isMultisig: () => boolean }>;
  isMultisig: () => boolean;
  getAddress: (a: number, b: number) => Promise<string>;
  prepareMultisig: () => Promise<string>;
  makeMultisig: (
    peerMultisigHexes: string[],
    numberOfParticipants: number,
    walletPassword: string,
  ) => Promise<string>;
  exchangeMultisigKeys: (
    multisigHexes: string[],
    walletPassword: string,
  ) => Promise<ExchangeMultisigKeysResult>;
  close: () => Promise<any>;
  getData: () => Promise<Array<Uint8Array>>;
  importOutputs: (outputsHex: string) => Promise<any>;
  exportMultisigHex: () => Promise<string>;
  importMultisigHex: (multisigHexes: string[]) => Promise<number>;
  getOutputs: (query: Record<string, number | string>) => Promise<number[]>;
  reconstructValidateTx: (
    txHex: string,
    config: TransactionConfig,
  ) => Promise<WalletTx[]>;
  loadMultisigTx: (txHex: string) => Promise<{ state: TransactionConfig }>;
  getMultisigSeed: (passphrase: string) => Promise<string>;
  getSubaddresses: (
    accountIdx: number,
    subaddressIndices: number,
  ) => Promise<MoneroSubaddress[]>;
};

export type WalletTx = {
  getTxSet: () => WalletTxSet;
};

export type WalletTxSet = {
  getMultisigTxHex: () => string;
};

export interface MoneroSubaddress {
  state: {
    accountIndex: number;
    index: number;
    balance: BigInteger;
    unlockedBalance: BigInteger;
    numUnspentOutputs: number;
    numBlocksToUnlock: number;
    address: string;
    label?: string;
    isUsed: boolean;
  };
}
