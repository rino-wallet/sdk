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
  ApiParam,
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
  WalletTransactionSubmitPayload,
  WalletTransactionSubmitResultResponse,
  WalletTransactionSupportedExportTypes,
} from "../entities";
import { Page } from "../types";
import { ApiPaginatedResponse } from "../decorators/api.paginated.response";

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
  @ApiPaginatedResponse(WalletActivityEntity, {
    status: 200,
    description: "The requested page with the wallet activity data",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Number of results to return per page",
  })
  @ApiQuery({
    name: "offset",
    required: false,
    type: Number,
    description: "The initial index from which to return the results",
  })
  getActivity(
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
  ): Observable<Page<WalletActivityEntity>> {
    return this.walletService.getActivity(limit, offset);
  }

  @Get("/members")
  @ApiOperation({ summary: "Gets the service wallet members" })
  @ApiPaginatedResponse(WalletMemberEntity, {
    status: 200,
    description: "The requested page with the wallet members data",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Number of results to return per page",
  })
  @ApiQuery({
    name: "offset",
    required: false,
    type: Number,
    description: "The initial index from which to return the results",
  })
  getMembers(
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
  ): Observable<Page<WalletMemberEntity>> {
    return this.walletService.getMembers(limit, offset);
  }

  @Get("/removed_spenders")
  @ApiOperation({ summary: "Gets the service wallet removed spenders" })
  @ApiPaginatedResponse(WalletRemovedSpenderEntity, {
    status: 200,
    description: "The requested page with the wallet removed spenders data",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Number of results to return per page",
  })
  @ApiQuery({
    name: "offset",
    required: false,
    type: Number,
    description: "The initial index from which to return the results",
  })
  getRemovedSpenders(
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
  ): Observable<Page<WalletRemovedSpenderEntity>> {
    return this.walletService.getRemovedSpenders(limit, offset);
  }

  @Get("/pending_transfers")
  @ApiOperation({ summary: "Gets the service wallet pending transfers" })
  @ApiPaginatedResponse(WalletPendingTransferEntity, {
    status: 200,
    description: "The requested page with the wallet pending transfers data",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Number of results to return per page",
  })
  @ApiQuery({
    name: "offset",
    required: false,
    type: Number,
    description: "The initial index from which to return the results",
  })
  getPendingTransfers(
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
  ): Observable<Page<WalletPendingTransferEntity>> {
    return this.walletService.getPendingTransfers(limit, offset);
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
  @ApiParam({
    name: "pendingTransferId",
    description: "Id of the pending transfer to get",
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
  @ApiParam({
    name: "pendingTransferId",
    description: "Id of the pending transfer to approve",
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
  @ApiParam({
    name: "pendingTransferId",
    description: "Id of the pending transfer to cancel",
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
  @ApiParam({
    name: "pendingTransferId",
    description: "Id of the pending transfer to reject",
  })
  rejectPendingTransfer(
    @Param("pendingTransferId") pendingTransferId: string,
  ): Observable<void> {
    return this.walletService.rejectPendingTransfer(pendingTransferId);
  }

  @Get("/subaddresses")
  @ApiOperation({ summary: "Gets the service wallet subaddresses" })
  @ApiPaginatedResponse(WalletSubaddressEntity, {
    status: 200,
    description: "The requested page with the wallet subaddresses data",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Number of results to return per page",
  })
  @ApiQuery({
    name: "offset",
    required: false,
    type: Number,
    description: "The initial index from which to return the results",
  })
  getSubaddresses(
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
  ): Promise<Page<WalletSubaddressEntity>> {
    return this.walletService.getSubaddresses(limit, offset);
  }

  @Get("/subaddresses/:address")
  @ApiOperation({ summary: "Gets a service wallet subaddress" })
  @ApiResponse({
    status: 200,
    description: "The wallet subaddress data",
    type: WalletSubaddressEntity,
  })
  @ApiParam({
    name: "address",
    description: "Address of the subaddress data to get",
  })
  getSubaddress(
    @Param("address") address: string,
  ): Promise<WalletSubaddressEntity> {
    return this.walletService.getSubaddress(address);
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
  @ApiParam({
    name: "address",
    description: "Address of the subaddress data to update",
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
  @ApiParam({
    name: "address",
    description: "Address of the subaddress data to update partially",
  })
  partiallyUpdateSubaddress(
    @Param("address") address: string,
    @Body() payload: WalletSubaddressPartialUpdatePayload,
  ) {
    return this.walletService.partialUpdateSubaddress(address, payload);
  }

  @Get("/transactions")
  @ApiOperation({ summary: "Gets the service wallet transactions" })
  @ApiPaginatedResponse(WalletTransactionEntity, {
    status: 200,
    description: "The requested page with the wallet transactions data",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Number of results to return per page",
  })
  @ApiQuery({
    name: "offset",
    required: false,
    type: Number,
    description: "The initial index from which to return the results",
  })
  getTransactions(
    @Query("limit") limit?: number,
    @Query("offset") offset?: number,
  ): Observable<Page<WalletTransactionEntity>> {
    return this.walletService.getTransactions(limit, offset);
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
    description: "Output file format",
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
  @ApiParam({
    name: "transactionId",
    description: "Id of the transaction to get",
  })
  getTransaction(
    @Param("transactionId") transactionId: string,
  ): Observable<WalletTransactionEntity> {
    return this.walletService.getTransaction(transactionId);
  }

  @Post("/send")
  @ApiOperation({
    summary: "Sends a service wallet transaction",
    description:
      "If the response HTTP Code is `201`, the content will be the submitted transaction data. If the response HTTP code is `202` the content will be the pending transaction data.",
  })
  @ApiResponse({
    status: 201,
    description: "The submitted transaction data",
    type: WalletTransactionSubmitResultResponse,
  })
  @ApiResponse({
    status: 202,
    description: "The pending transaction data",
    type: WalletPendingTransferEntity,
  })
  async sendTransaction(
    @Body() payload: WalletTransactionSendPayload,
    @Res() response,
  ): Promise<
    WalletTransactionSubmitResultResponse | WalletPendingTransferEntity
  > {
    const { requiresApproval, result } =
      await this.walletService.sendTransaction(payload);
    return response.status(requiresApproval ? 202 : 201).send(result);
  }

  @Post("/transactions/create")
  @ApiOperation({ summary: "Creates a service wallet unsigned transaction" })
  @ApiResponse({
    status: 201,
    description: "The transaction is created",
    type: WalletTransactionCreateResponse,
  })
  createUnsignedTransaction(
    @Body() payload: WalletTransactionCreatePayload,
  ): Promise<WalletTransactionCreateResponse> {
    return this.walletService.createUnsignedTransaction(payload);
  }

  @Post("/transactions/submit")
  @ApiOperation({
    summary: "Submits a service wallet transaction",
    description:
      "If the response HTTP Code is `201`, the content will be the submitted transaction data. If the response HTTP code is `202` the content will be the pending transaction data.",
  })
  @ApiResponse({
    status: 201,
    description: "The submitted transaction data",
    type: WalletTransactionSubmitResultResponse,
  })
  @ApiResponse({
    status: 202,
    description: "The pending transaction data",
    type: WalletPendingTransferEntity,
  })
  async submitTransaction(
    @Body() payload: WalletTransactionSubmitPayload,
    @Res() response,
  ): Promise<
    WalletTransactionSubmitResultResponse | WalletPendingTransferEntity
  > {
    const { requiresApproval, result } =
      await this.walletService.submitTransaction(payload);

    return response.status(requiresApproval ? 202 : 201).send(result);
  }
}
