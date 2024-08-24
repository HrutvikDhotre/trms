const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// MongoDB connection string for the local instance
const mongoURI = 'mongodb://localhost:27017';
const dbName = 'attendanceDB';
const originalCollectionName = 'Students_TY_BCA';
const newCollectionName = 'ValidAttendance';

app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Endpoint to handle roll numbers
app.post('/submitRollNumbers', async (req, res) => {
  try {
    const rollNumbers = req.body.rollNumbers;
    const academicYear = req.body.academicYear;
    const subject = req.body.subject;
    const teacherName = req.body.teacherName;
    const date = req.body.date;

    // Check if attendance is already marked for the given lecture
    const isAttendanceMarked = await checkAttendanceMarked(academicYear, subject, teacherName, date);

    if (isAttendanceMarked) {
      return res.status(400).json({ success: false, error: 'Attendance already marked for this lecture.' });
    }

    // Validate roll numbers and accumulate valid ones with names in an array
    const validRollNumbersWithNames = await validateRollNumbers(rollNumbers);

    // Display valid roll numbers and names in the console
    console.log('Valid Roll Numbers with Names:', validRollNumbersWithNames);

    // Save validated roll numbers in the new collection
    await saveValidAttendance(validRollNumbersWithNames.map(entry => entry.rollNumber), academicYear, subject, teacherName, date);

    // Send the response with additional values
    res.json({ success: true, validRollNumbersWithNames, academicYear, subject, teacherName, date });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// New endpoint to retrieve valid roll numbers with names
app.get('/validRollNumbers', async (req, res) => {
  try {
    // Retrieve the data from where it's stored (e.g., a database)
    const validRollNumbersWithNames = await retrieveValidRollNumbers();

    // Send the data as a response
    res.json({ validRollNumbersWithNames });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Function to check if attendance is already marked for a given lecture
async function checkAttendanceMarked(academicYear, subject, teacherName, date) {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(dbName);

    // Check if there is any entry for the given lecture
    const existingEntry = await db.collection(newCollectionName).findOne({
      academicYear,
      subject,
      teacherName,
      date,
    });

    // Close the MongoDB connection
    client.close();

    // Return true if attendance is already marked, false otherwise
    return !!existingEntry;
  } catch (error) {
    throw error;
  }
}

// Function to validate roll numbers and accumulate valid ones with names in an array
async function validateRollNumbers(rollNumbers) {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(dbName);

    const validRollNumbersWithNames = [];

    // Validate each roll number
    for (const rollNumber of rollNumbers) {
      const student = await db.collection(originalCollectionName).findOne({ rollNumber });

      if (student) {
        // Valid roll number, add to the array with corresponding name
        validRollNumbersWithNames.push({
          rollNumber,
          name: student.studentName, // Assuming 'studentName' is the field storing the student's name
        });
      } else {
        // Invalid roll number, you can handle it accordingly
        console.log(`Invalid roll number: ${rollNumber}`);
      }
    }

    // Close the MongoDB connection
    client.close();

    return validRollNumbersWithNames;
  } catch (error) {
    throw error;
  }
}

// Function to save validated roll numbers in the new collection
async function saveValidAttendance(validRollNumbers, academicYear, subject, teacherName, date) {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(dbName);

    // Save the validated roll numbers in the new collection
    await db.collection(newCollectionName).insertOne({
      academicYear,
      rollNumbers: validRollNumbers,
      subject,
      teacherName,
      date,
    });

    // Close the MongoDB connection
    client.close();
  } catch (error) {
    throw error;
  }
}

// Function to retrieve valid attendance data from the database
async function retrieveValidRollNumbers() {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(dbName);

    // Retrieve all documents from the "ValidAttendance" collection
    const validAttendanceData = await db.collection(newCollectionName).find({}).toArray();

    // Close the MongoDB connection
    client.close();

    return validAttendanceData;
  } catch (error) {
    throw error;
  }
}
app.post('/findAttendance', async (req, res) => {
  const { academicYear, subject, teacherName, date } = req.body;
  const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = client.db(dbName);

  try {
    // Check if values exist in the ValidAttendance collection
    const result = await db.collection('ValidAttendance').findOne({
      academicYear,
      subject,
      teacherName,
      date,
    });

    if (result) {
      // Values exist, return the corresponding roll numbers
      const rollNumbers = result.rollNumbers;
      console.log('Roll Numbers:', rollNumbers);

      // You can send the roll numbers back to the client
      res.json({ success: true, rollNumbers });
    } else {
      // Values not found, send an error response
      console.log('Form data not found in MongoDB');
      res.status(404).json({ success: false, message: 'Attendance not marked' });
    }
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  } finally {
    // Always close the MongoDB connection
    client.close();
  }
});





app.post('/api/getAllStudentNames', async (req, res) => {
  try {
    await mongoose.connect('mongodb://localhost/attendanceDB');
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
    db.once('open', () => {
      console.log('Connected to MongoDB');
    });

    const StudentSchema = new mongoose.Schema({
      rollNumber: String,
      studentName: String,
    });

    // const Student = mongoose.model('Student', StudentSchema);
    const { groups } = req.body; // Retrieve groups from the request body
    console.log('Received groups:', groups); // Console the received groups

    let groupData = [];
    for (const group of groups) {
      const rollNumbersInt = group.rollNumbers.map(num => parseInt(num, 10)); // Convert roll numbers to integers

      // Search for students in the database based on the roll numbers
      const students = await db.collection('Students_TY_BCA').find(
        { rollNumber: { $in: rollNumbersInt } },
        { studentName: 1 }
      ).toArray();

      // Extract names from the queried students and construct an array of objects with roll number and name
      const names = rollNumbersInt.map(rollNumber => {
        const student = students.find(student => student.rollNumber === rollNumber);
        return student ? student.studentName : null;
      });

      // Push group data containing group name, roll numbers, and corresponding names
      groupData.push({ groupName: group.groupName, rollNumbers: group.rollNumbers, names });
    }

    console.log('Corresponding group data:', groupData); // Console the corresponding group data
    res.status(200).json({ groupData }); // Send the group data back to the frontend
  } catch (error) {
    console.error('Error fetching student names:', error.message);
    res.status(500).json({ error: 'Failed to fetch student names' });
  }
});






// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
