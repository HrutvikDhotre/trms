// mongoUtils.js
const MongoClient = require('mongodb').MongoClient;

const uri = 'mongodb://localhost:27017'; // Update with your MongoDB connection string
const dbName = 'attendanceDB'; // Update with your database name

const connectToMongo = async () => {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  return client;
};

const getValidAttendance = async ({ academicYear, subject, teacherName, date }) => {
  const client = await connectToMongo();
  const db = client.db(dbName);
  const collection = db.collection('ValidAttendance');

  // Check if there's a match in the ValidAttendance collection
  const match = await collection.findOne({
    academicYear,
    subject,
    teacherName,
    date,
  });

  client.close();
  return match;
};

module.exports = { getValidAttendance };
