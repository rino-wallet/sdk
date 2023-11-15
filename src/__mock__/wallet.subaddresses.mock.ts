import { WalletSubaddressEntity } from "../entities";
import { Page } from "../types";

export const walletSubaddressesMock: Page<WalletSubaddressEntity> = {
  count: 3,
  next: "",
  previous: "",
  results: [
    {
      address:
        "76uezxqTYhV4bKaHAs75cZVGBDubdBuqjdMhxQnAHL3mPPKG49ifGZf4XShHX8jWfg6UAGP6LsRJ7awAVGREV1nfJG6XzWX",
      index: 2,
      is_used: false,
      created_at: "2023-05-12T17:25:15.551Z",
      label: "",
      signature:
        "QWA8/vvuwHSe04V5lIGFRgQ+NTNjLNuAaLPkRWK9TwntTijSXPon4AuUJQFf2eIgWRthqFK/yPygn8jE4u+LDA==",
    },
    {
      address:
        "72wCuVF5ZcA9Rcq1mT7vi9GZ252JcXGWRMyAf8t2Dh7PfdFdWm7mKhjGyrnn8vLYxMeHaTd2wJ2DZQAghATtTmXMSu5kHGX",
      index: 1,
      is_used: false,
      created_at: "2023-05-12T17:25:15.551Z",
      label: "",
      signature:
        "zIGsR2gt+lA18rjN4dm32eRfgpgqVwwL5QxES7xow+gPEOX24BieZrFvXUmdAphOFT3vbumxYOI20a5IEl0UBg==",
    },
    {
      address:
        "79TA6cCbmfJbh5Bezm8yoKQxM1MYAtGtuBtqSp6nMNqFZJcUxYFHrc7icqecrksyHqBWcC4cFbJ9KS9ENvNVMWX47vLjuU7",
      index: 0,
      is_used: false,
      created_at: "2023-05-12T17:25:15.551Z",
      label: "",
      signature:
        "RCc3h2eTRVlfgEmGVhH0PAhonOPS66Fugz8ScQlSiQ+AjcYTVhMgIAE8/CEoN3wBgJVCYuHyQl5LTY+fmTFgDQ==",
    },
  ],
};
