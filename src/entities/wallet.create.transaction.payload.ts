import { Destination } from "./destination.entity";
import { WalletTransactionPriority } from "./wallet.transaction.priority";

export interface WalletCreateTransactionPayload {
  destinations: Array<Destination>;
  multisig_hex: string;
  priority: WalletTransactionPriority;
}
