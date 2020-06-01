const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const shortid = require('shortid')
//for db
const adapter = new FileSync('db.json')
const db = low(adapter)


module.exports.getTransaction = (req, res) => {
  res.render('transactions', {trans: db.get('rents').value()})
}
module.exports.getCreateTransaction = (req, res) => {
  res.render('transactions_create',{
    users: db.get('users').value(),
    books: db.get('books').value()
  })
}

module.exports.postCreateTransaction = (req, res) => {
  const rent = {
    userId: req.body.selectedname,
    bookId: req.body.selectedbook,
    isComplete: false
  }
  db.get('rents').push(rent).write()
  res.redirect('/transactions')
}
module.exports.getIdTransactionToComplete = (req, res) => {
  const rent = db.get('rents').find({id: req.params.id})
  console.log(rent)
  if(rent == null)
    res.render('error')
  else
    {
      db.get('rents')
        .find({ id: req.params.id})
        .assign({ isComplete: true})
        .write()
    res.redirect('/transactions')
    }
}