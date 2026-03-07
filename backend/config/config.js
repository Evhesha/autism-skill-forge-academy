require("dotenv").config();

const username = process.env.DB_USER || "postgres";
const password = process.env.DB_PASSWORD || "postgres";
const database = process.env.DB_NAME || process.env.DB_DATABASE || "autism_academy";
const host = process.env.DB_HOST || "localhost";
const port = Number(process.env.DB_PORT || 5432);

const base = {
  username,
  password,
  database,
  host,
  port,
  dialect: "postgres",
  define: {
    underscored: true,
    timestamps: false,
  },
};

module.exports = {
  development: { ...base },
  test: { ...base, database: `${database}_test` },
  production: { ...base },
};
