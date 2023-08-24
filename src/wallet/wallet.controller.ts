import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Res,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProduces,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";

import { WalletService } from "./wallet.service";
import { Observable, lastValueFrom } from "rxjs";
import {
  WalletActivityEntity,
  WalletEntity,
  WalletMemberEntity,
  WalletPendingTransferEntity,
  WalletRemovedSpenderEntity,
  WalletSubaddressEntity,
  WalletSubaddressPartialUpdatePayload,
  WalletSubaddressUpdatePayload,
  WalletTransactionCreatePayload,
  WalletTransactionCreateResponse,
  WalletTransactionEntity,
  WalletTransactionSendPayload,
  WalletTransactionSendResponse,
  WalletTransactionSubmitPayload,
  WalletTransactionSupportedExportTypes,
} from "../entities";

ApiBearerAuth();
@Controller({
  version: "1",
  path: "wallet",
})
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  @ApiOperation({ summary: "Gets the service wallet data" })
  @ApiResponse({
    status: 200,
    description: "The wallet data",
    type: WalletEntity,
  })
  getWallet(): Observable<WalletEntity> {
    return this.walletService.getWallet();
  }

  @Get("/activity")
  @ApiOperation({ summary: "Gets the service wallet activity" })
  @ApiResponse({
    status: 200,
    description: "The wallet activity data",
    type: [WalletActivityEntity],
  })
  getActivity(): Observable<WalletActivityEntity[]> {
    return this.walletService.getActivity();
  }

  @Get("/members")
  @ApiOperation({ summary: "Gets the service wallet members" })
  @ApiResponse({
    status: 200,
    description: "The wallet members data",
    type: [WalletMemberEntity],
  })
  getMembers(): Observable<WalletMemberEntity[]> {
    return this.walletService.getMembers();
  }

  @Get("/removed_spenders")
  @ApiOperation({ summary: "Gets the service wallet removed spenders" })
  @ApiResponse({
    status: 200,
    description: "The wallet removed spenders data",
    type: [WalletRemovedSpenderEntity],
  })
  getRemovedSpenders(): Observable<WalletRemovedSpenderEntity[]> {
    return this.walletService.getRemovedSpenders();
  }

  @Get("/pending_transfers")
  @ApiOperation({ summary: "Gets the service wallet pending transfers" })
  @ApiResponse({
    status: 200,
    description: "The wallet pending transfers data",
    type: [WalletPendingTransferEntity],
  })
  getPendingTransfers(): Observable<WalletPendingTransferEntity[]> {
    return this.walletService.getPendingTransfers();
  }

  @Get("/pending_transfers/:pendingTransferId")
  @ApiOperation({ summary: "Gets a service wallet pending transfer" })
  @ApiResponse({
    status: 200,
    description: "The wallet pending transfer data",
    type: WalletPendingTransferEntity,
  })
  @ApiResponse({
    status: 404,
    description: "Wallet pending transfer data not found",
  })
  getPendingTransfer(
    @Param("pendingTransferId") pendingTransferId: string,
  ): Observable<WalletPendingTransferEntity> {
    return this.walletService.getPendingTransfer(pendingTransferId);
  }

  @Post("/pending_transfers/:pendingTransferId/approve")
  @ApiOperation({ summary: "Approves a service wallet pending transfer" })
  @ApiResponse({
    status: 201,
    description: "The pending transfer approval outcome",
    type: Boolean,
  })
  @ApiResponse({
    status: 404,
    description: "Wallet pending transfer data not found",
  })
  approvePendingTransfer(
    @Param("pendingTransferId") pendingTransferId: string,
  ): Promise<boolean> {
    return this.walletService.approvePendingTransfer(pendingTransferId);
  }

  @Post("/pending_transfers/:pendingTransferId/cancel")
  @ApiOperation({ summary: "Cancels a service wallet pending transfer" })
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "No response body",
  })
  @ApiResponse({
    status: 404,
    description: "Wallet pending transfer data not found",
  })
  cancelPendingTransfer(
    @Param("pendingTransferId") pendingTransferId: string,
  ): Observable<void> {
    return this.walletService.cancelPendingTransfer(pendingTransferId);
  }

  @Post("/pending_transfers/:pendingTransferId/reject")
  @ApiOperation({ summary: "Rejects a service wallet pending transfer" })
  @HttpCode(204)
  @ApiResponse({
    status: 204,
    description: "No response body",
  })
  @ApiResponse({
    status: 404,
    description: "Wallet pending transfer data not found",
  })
  rejectPendingTransfer(
    @Param("pendingTransferId") pendingTransferId: string,
  ): Observable<void> {
    return this.walletService.rejectPendingTransfer(pendingTransferId);
  }

  @Get("/subaddresses")
  @ApiOperation({ summary: "Gets the service wallet subaddresses" })
  @ApiResponse({
    status: 200,
    description: "The wallet subaddresses data",
    type: [WalletSubaddressEntity],
  })
  getSubaddresses(): Promise<WalletSubaddressEntity[]> {
    return this.walletService.getSubaddresses();
  }

  @Post("/subaddresses")
  @ApiOperation({ summary: "Creates a service wallet subaddress" })
  @ApiResponse({
    status: 201,
    description: "The created wallet subaddress data",
    type: WalletSubaddressEntity,
  })
  createSubaddress(): Promise<WalletSubaddressEntity> {
    return this.walletService.createSubaddress();
  }

  @Put("/subaddresses/:address")
  @ApiOperation({ summary: "Updates a service wallet subaddress" })
  @ApiResponse({
    status: 200,
    description: "The updated wallet subaddress data",
    type: WalletSubaddressEntity,
  })
  updateSubaddress(
    @Param("address") address: string,
    @Body() payload: WalletSubaddressUpdatePayload,
  ) {
    return this.walletService.updateSubaddress(address, payload);
  }

  @Patch("/subaddresses/:address")
  @ApiOperation({ summary: "Updates a service wallet subaddress partially" })
  @ApiResponse({
    status: 200,
    description: "The partially updated wallet subaddress data",
    type: WalletSubaddressEntity,
  })
  partiallyUpdateSubaddress(
    @Param("address") address: string,
    @Body() payload: WalletSubaddressPartialUpdatePayload,
  ) {
    return this.walletService.partialUpdateSubaddress(address, payload);
  }

  @Get("/transactions")
  @ApiOperation({ summary: "Gets the service wallet transactions" })
  @ApiResponse({
    status: 200,
    description: "The wallet transactions data",
    type: [WalletTransactionEntity],
  })
  getTransactions(): Observable<WalletTransactionEntity[]> {
    return this.walletService.getTransactions();
  }

  @Get("/transactions/export")
  @ApiOperation({
    summary:
      "Gets the service wallet transactions in a file according the format specified",
  })
  @ApiProduces("application/vnd.ms-excel", "text/csv")
  @ApiResponse({
    status: 200,
    description: "The wallet transactions data exported in a file",
  })
  @ApiQuery({
    name: "type",
    required: true,
    enum: WalletTransactionSupportedExportTypes,
    type: String,
  })
  async exportTransactions(
    @Query("type") type: WalletTransactionSupportedExportTypes,
    @Res() response,
  ): Promise<void> {
    const { filename, mimeType, data } = await lastValueFrom(
      this.walletService.exportTransactions(type),
    );
    response.setHeader(
      "Content-Disposition",
      `attachment; filename=${filename}`,
    );
    response.setHeader("Content-Type", mimeType);
    response.send(data);
  }

  @Get("/transactions/:transactionId")
  @ApiOperation({ summary: "Gets a service wallet transaction" })
  @ApiResponse({
    status: 200,
    description: "The wallet transaction data",
    type: WalletTransactionEntity,
  })
  @ApiResponse({
    status: 404,
    description: "Wallet transaction data not found",
  })
  getTransaction(
    @Param("transactionId") transactionId: string,
  ): Observable<WalletTransactionEntity> {
    return this.walletService.getTransaction(transactionId);
  }

  @Post("/send")
  @ApiOperation({ summary: "Sends a service wallet transaction" })
  @ApiResponse({
    status: 201,
    description: "The submitted transaction wallet data",
    type: WalletTransactionSendResponse,
  })
  @ApiResponse({
    status: 202,
    description: "The pending transaction wallet data",
    type: WalletTransactionSendResponse,
  })
  async sendTransaction(
    @Body() payload: WalletTransactionSendPayload,
    @Res() response,
  ): Promise<WalletTransactionSendResponse> {
    const result = await this.walletService.sendTransaction(payload);
    return response.status(result.requiresApproval ? 202 : 201).send(result);
  }

  @Post("/transactions/create")
  @ApiOperation({ summary: "Creates a service wallet unsigned transaction" })
  @ApiResponse({
    status: 201,
    description: "The transaction is created",
    type: WalletTransactionSendResponse,
  })
  createUnsignedTransaction(
    @Body() payload: WalletTransactionCreatePayload,
  ): Promise<WalletTransactionCreateResponse> {
    return this.walletService.createUnsignedTransaction(payload);
  }

  @Post("/transactions/submit")
  @ApiOperation({ summary: "Submits a service wallet transaction" })
  @ApiResponse({
    status: 201,
    description: "The submitted transaction wallet data",
    type: WalletTransactionSendResponse,
  })
  @ApiResponse({
    status: 202,
    description: "The pending transaction wallet data",
    type: WalletTransactionSendResponse,
  })
  async submitTransaction(
    @Body() payload: WalletTransactionSubmitPayload,
    @Res() response,
  ): Promise<WalletTransactionSendResponse> {
    const result = await this.walletService.submitTransaction(payload);
    return response.status(result.requiresApproval ? 202 : 201).send(result);
  }
}
