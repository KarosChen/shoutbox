const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://karos:0000@nodejs.njmvw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const test = client.db("nodejs").collection("test");

class Entry {
  constructor(obj) {
    for (let key in obj) {
      this[key] = obj[key];
    }
  }

  save(cb) {
    const entryJSON = JSON.parse(JSON.stringify(this));
    test
      .insertOne(entryJSON)
      .then(cb())
      .catch((err) => {
        if (err) return cb(err);
      });
  }

  static getAll(cb) {
    const entries = [];
    test
      .find({})
      .toArray()
      .then((data) => {
        data.forEach((item) => {
          entries.push(item);
        });
        cb(null, entries);
      });
  }
}

module.exports = Entry;
