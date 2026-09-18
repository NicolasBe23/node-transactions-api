export async function up(knex) {
    await knex.schema.alterTable("transactions", (table) => {
        table.text("type").notNullable();
    });
}
export async function down(knex) {
    await knex.schema.alterTable("transactions", (table) => {
        table.dropColumn("type");
    });
}
//# sourceMappingURL=20260821190549_add-type-to-transactions.js.map