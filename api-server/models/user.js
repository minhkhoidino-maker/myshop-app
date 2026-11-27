const { query } = require('./db');
const format = require('pg-format');

// Calls the public.login() function in the database
const login = async (username, password) => {
  const r = await query(format(
    "select json_agg(public.login(%L, %L))", username, password));
  return r.rows[0].json_agg[0]; // { success, error_code, message, data }
};

module.exports = { login };
