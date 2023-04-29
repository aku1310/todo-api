const Todo = {
    create: function (data, callback) {
      db.insert(data, callback);
    },
    update: function (id, data, callback) {
      db.update({ _id: id }, { $set: data }, {}, callback);
    },
    delete: function (id, callback) {
      db.remove({ _id: id }, {}, callback);
    },
    getById: function (id, callback) {
      db.findOne({ _id: id }, callback);
    },
    getAll: function (callback) {
      db.find({}, callback);
    },
  };
  
  const User = {
    create: function (data, callback) {
      db.insert(data, callback);
    },
    getByEmail: function (email, callback) {
      db.findOne({ email: email }, callback);
    },
  };
