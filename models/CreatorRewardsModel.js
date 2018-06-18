module.exports = {
    fields: {
        id: "uuid",
        reward_id: "int",
        amount: "int",
        price: "int",
        title: "text",
        description: "text",
        img: "text",
        creator_id: "int",
        created_at: "timestamp",
        updated_at: "timestamp"
    },
    key: ["id"]
}