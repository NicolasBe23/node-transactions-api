declare module "knex/types/tables" {
  export interface Tables {
    transactions: {
      id: string;
      title: string;
      amount: number;
      type: "credit" | "debit";
      session_id?: string;
      created_at: string;
    };
  }
}
