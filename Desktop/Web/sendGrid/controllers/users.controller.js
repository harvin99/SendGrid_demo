const bcrypt = require('bcrypt')
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const shortid = require("shortid");
//for db
const adapter = new FileSync("db.json");
const db = low(adapter);

module.exports.getUser = (req, res) => {
  const user = db
    .get("users")
    .find({ id: req.signedCookies.userId })
    .value();
  if (user.isAdmin) {
    res.render("users", {
      users: db.get("users").value(),
      countUser: db.get("users").value().length,
      isAdmin: true
    });
  }
  else{
    res.render("users", {
      users: user,
      countUser: 1
    })
  }
};
module.exports.createUser = (req, res) => {
  res.render("create_user");
};
module.exports.postCreateUser = async (req, res) => {
  const existEmailUser = db
    .get("users")
    .find({ email: req.body.email })
    .value();
  if (existEmailUser) {
    res.render("create_user", {
      values: req.body,
      errors: ["Email was exist !"]
    });
    return;
  }
  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(req.body.password, salt)
  
  const user = {
    id: shortid.generate(),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: hashedPassword,
    isAdmin: false
  };
  db.get("users")
    .push(user)
    .write();
  res.redirect("/users");
};

module.exports.getUserId = (req, res) => {
  const user = db
    .get("users")
    .find({ id: req.params.id })
    .value();
  res.render("edit_user", { user: user });
};

module.exports.postUserId = (req, res) => {
  db.get("users")
    .find({ id: req.params.id })
    .assign({ name: req.body.name, phone: req.body.phone })
    .write();
  res.redirect("/users");
};
module.exports.getUserIdToDelete = (req, res) => {
  db.get("users")
    .remove({ id: req.params.id })
    .write();
  res.redirect("/users");
};
