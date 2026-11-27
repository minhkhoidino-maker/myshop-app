const Router = require('restify-router').Router;
const router = new Router();
const User = require('../models/user');
const { sign } = require('./authenticate');

router.post('/login', async (req, res) => {
  const { username = "", password = "" } = req.params;
  if (username.length == 0 || password.length == 0) {
    res.send({ success: false, code: 401, message: "Invalid username or password" });
    return;
  }

  const { success, data } = await User.login(username, password);
  if (success) {
    res.send({ success: true, code: 200, message: "Login successfully", token: sign(username, data.role) });
  } else {
    res.send({ success: false, code: 401, message: "Invalid username or password" });
  }
});

module.exports = router;
