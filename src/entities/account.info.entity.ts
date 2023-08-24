export interface AccountInfoEntity {
  email: string;
  username: string;
  is_2fa_enabled: boolean;
  is_keypair_set: boolean;
  tx_notifications: boolean;
  name: string;
  company_name: string;
  company_website: string;
  keypair: {
    encryption_public_key: string;
    signing_public_key: string;
    enc_private_key: string;
  };
  account_type: string;
  extra_features: {
    exchange: boolean;
    public_wallet: boolean;
    view_only_share: boolean;
    limits: boolean;
    approvals: boolean;
    api_keys: boolean;
  };
  referral_code: string;
  referral_max: number;
}

export interface EncPrivateKeyEntity {
  version: number;
  method: string;
  enc_content: string;
  nonce: string;
}
