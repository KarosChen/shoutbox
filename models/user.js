const bcrypt = require("bcrypt");
const { MongoClient, ServerApiVersion } = require("mongodb");
const { connect } = require("../routes");
const uri =
  "mongodb+srv://karos:0000@nodejs.njmvw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const user = client.db("nodejs").collection("user");
const counter = client.db("nodejs").collection("counter");

class User {
  constructor(obj) {
    for (let key in obj) {
      this[key] = obj[key];
    }
  }

  async getNextSequenceValue(sequenceName) {
    try {
      const doc = await counter.findOneAndUpdate(
        { _id: sequenceName },
        { $inc: { sequence_value: 1 } }
      );
      let value = doc.value.sequence_value;
      return value;
    } catch (err) {
      throw err;
    }
  }

  async save(cb) {
    if (this.id) {
      this.update(cb);
    } else {
      this.id = await this.getNextSequenceValue("UserId");
      this.hashPassword((err) => {
        if (err) return err;
        this.insert(cb);
      });
    }
  }

  update(cb) {
    user
      .updateOne({ id: this.id }, JSON.parse(JSON.stringify(this)))
      .then((res) => {})
      .catch((err) => {
        cb(err);
      });
  }

  insert(cb) {
    user
      .insertOne(JSON.parse(JSON.stringify(this)))
      .then((res) => {})
      .catch((err) => {
        cb(err);
      });
  }

  hashPassword(cb) {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) return cb(err);
      this.salt = salt;
      bcrypt.hash(this.pass, salt, (err, hash) => {
        if (err) return cb(err);
        this.pass = hash;
        cb();
      });
    });
  }

  static getByName(name, cb) {
    User.getId(name, (err, id) => {
      if (err) return cb(err, null);
      User.get(id, cb);
    });
  }

  static getId(name, cb) {
    user
      .findOne({ name: name }, { id: 1 })
      .then((res) => {
        // when res is null, should deal it
        if (res) {
          cb(null, res.id);
        } else {
          cb(new Error(), null);
        }
      })
      .catch((err) => {
        console.log(err);
        cb(err, null);
      });
  }

  static get(id, cb) {
    user
      .findOne({ id: id })
      .then((user) => {
        cb(null, new User(user));
      })
      .catch((err) => {
        cb(err, null);
      });
  }

  static authenticate(name, pass, cb) {
    User.getByName(name, (err, user) => {
      if (err) return cb(err);
      if (!user.id) return cb();
      bcrypt.hash(pass, user.salt, (err, hash) => {
        if (err) return cb(err);
        if (hash == user.pass) return cb(null, user);
        cb();
      });
    });
  }
}

module.exports = User;
