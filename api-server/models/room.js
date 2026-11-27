const { query } = require('./db');
const format = require('pg-format');

const all = async () =>
  (await query("select * from room order by room_id")).rows;

const byId = async (id) => {
  const r = await query(format("select * from room where room_id=%L", id));
  return { found: r.rows.length > 0, data: r.rows[0] };
};

const add = async (name, price) => {
  const r = await query(format(
    "insert into room(name, price) values(%L, %L) returning *", name, price));
  return r.rows[0];
};

const update = async (id, name, price) =>
  (await query(format(
    "update room set name=%L, price=%L where room_id=%L", name, price, id))).rowCount > 0;

const remove = async (id) =>
  (await query(format("delete from room where room_id=%L", id))).rowCount > 0;

module.exports = { all, byId, add, update, remove };
