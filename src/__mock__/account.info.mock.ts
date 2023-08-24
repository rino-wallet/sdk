import { AccountInfoEntity } from "../entities";

export const accountInfoMock: AccountInfoEntity = {
  email: "owner@test.com",
  username: "ronye3",
  is_2fa_enabled: false,
  is_keypair_set: true,
  tx_notifications: true,
  name: " ",
  company_name: "CSS",
  company_website: "css.com",
  keypair: {
    encryption_public_key: "F7jJXs3soZurHChvo9L4LApnDWVT/RuNV+HBPr3bgAg=",
    signing_public_key: "jw8c3PlL6KjQSMF/YOT9Qg6HULm6I6g4NNjO4Rrru98=",
    enc_private_key:
      '{"version":1,"method":"symmetric","enc_content":"a0Jj8yXxJS6Z03Ct5GKx/lpLooElbu9nqPu9X8Uu7IrEraBclSvSz30pyckmGZl3d+uSba+udXIHjPn0RL8YP8RVv69WyY1Ty5EUe06vtxuI/k22eQNrITWMgvn0wAfyD/1vd6ln8qNmnbEPhtywQpGC","nonce":"AktPORW0+J4Mp/ZZgr3Lto67qX8T2tCL"}',
  },
  account_type: "enterprise",
  extra_features: {
    exchange: false,
    public_wallet: false,
    view_only_share: true,
    limits: true,
    approvals: true,
    api_keys: true,
  },
  referral_code: null,
  referral_max: 10,
};
