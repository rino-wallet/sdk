// TODO: use type parameter to avoid 'any'
export interface TaskResponseEntity<R = any, P = any> {
  id: string;
  status: TaskStatus;
  type: TaskType;
  created_at: string;
  started_at: string;
  updated_at: string;
  completed_at: string;
  wallet_id: string;
  result: R;
  params: P;
}

export type TaskStatus = "COMPLETED" | "FAILED" | "CREATED";

export type TaskType = "EXPORT_OUTPUTS" | "CREATE_TX";

export interface ExportOutputsResult {
  outputs_hex: string;
}

export interface CreateTxResult {
  multisig_hex: string;
}
