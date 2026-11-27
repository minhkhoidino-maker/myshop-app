const Router = require('restify-router').Router;
const router = new Router();
const Room = require('../models/room');
const { authenticated, requireRole } = require('./authenticate');

const validId = (id) => /^\d+$/.test(String(id));
const canEdit = [authenticated, requireRole('admin', 'manager')];

// GET /room — everyone
router.get('/room', async (req, res) => {
  res.send({ rooms: await Room.all() });
});

// GET /room/:id — everyone
router.get('/room/:id', async (req, res) => {
  const id = req.params.id;
  const { found, data } = validId(id) ? await Room.byId(id) : { found: false };
  if (found) res.send({ success: true, code: 200, message: "", data });
  else res.send({ success: false, code: 404, message: "Cannot find room with id: " + id });
});

// POST /room — admin or manager only
router.post('/room', ...canEdit, async (req, res) => {
  const { name = "", price = 0 } = req.params;
  if (name.length == 0) {
    res.send({ success: false, code: 403, message: "Invalid parameters" });
    return;
  }
  const room = await Room.add(name, price);
  res.send({ success: true, code: 200, message: "Room added successfully", data: room, info: req.user });
});

// PATCH /room/:id — admin or manager only
router.patch('/room/:id', ...canEdit, async (req, res) => {
  const id = req.params.id;
  const { name = "", price = 0 } = req.params;
  const found = validId(id) && await Room.update(id, name, price);
  if (found) res.send({ success: true, code: 200, message: "Room updated" });
  else res.send({ success: false, code: 404, message: "Cannot update room with id " + id + ". Does not exist." });
});

// DELETE /room/:id — admin or manager only
router.del('/room/:id', ...canEdit, async (req, res) => {
  const id = req.params.id;
  const found = validId(id) && await Room.remove(id);
  if (found) res.send({ success: true, code: 200, message: "Room deleted" });
  else res.send({ success: false, code: 404, message: "Cannot delete room with id " + id + ". Does not exist." });
});

module.exports = router;
