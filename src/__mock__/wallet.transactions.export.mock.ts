import { FileResponseEntity, MimeTypes } from "../entities";

export const exportFileCSV: FileResponseEntity = {
  filename: "testwalletid.csv",
  mimeType: MimeTypes.csv,
  data: Buffer.from("csv file data"),
};

export const exportFileXLS: FileResponseEntity = {
  filename: "testwalletid.xls",
  mimeType: MimeTypes.xls,
  data: Buffer.from("xls file data"),
};
