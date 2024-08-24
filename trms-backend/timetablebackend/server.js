const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/timetable');

const timetableSchema = new mongoose.Schema({
  class: String,
  timetable: Array,
});

const TimetableModel = mongoose.model('Timetable', timetableSchema);

app.post('/api/timetable', async (req, res) => {
  try {
    const { selectedClass, timetableData } = req.body;

    console.log('Received data:');
    console.log('Selected Class:', selectedClass);
    console.log('Timetable Data:', timetableData);

    // Check if a timetable already exists for the selected class
    const existingTimetable = await TimetableModel.findOne({ class: selectedClass });

    if (existingTimetable) {
      console.error(`Timetable already exists for class ${selectedClass}`);
      return res.status(400).json({ error: 'Timetable already exists for this class.' });
    }

    const newTimetable = new TimetableModel({
      class: selectedClass,
      timetable: timetableData.flat(),
    });

    await newTimetable.save();

    console.log(`Timetable for class ${selectedClass} saved successfully!`);
    return res.status(201).json({ message: 'Timetable saved successfully.' });
  } catch (error) {
    console.error('Error saving timetable:', error.message);
    return res.status(500).json({ error: 'Error saving timetable. Please try again.' });
  }
});


// const timetableSchema = new mongoose.Schema({
//   class: String,
//   timetable: Array,
// });

// const TimetableModel = mongoose.model('Timetable', timetableSchema);

// API endpoint to fetch timetable data for a specific class
app.get('/api/timetable/:class', async (req, res) => {
  try {
    const { class: selectedClass } = req.params;
    const timetableData = await TimetableModel.findOne({ class: selectedClass });

    if (!timetableData) {
      return res.status(404).json({ error: 'Timetable data not found for the specified class.' });
    }

    return res.status(200).json(timetableData);
  } catch (error) {
    console.error('Error fetching timetable data:', error.message);
    return res.status(500).json({ error: 'Error fetching timetable data. Please try again.' });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
