const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port =  3003;

// Connect to PostgreSQL database
const sequelize = new Sequelize(
  "postgres://trem:4NhGRItwGoJrXXg8mtJGEvgcGrJgmf2e@dpg-coi5rjtjm4es739j10ag-a.oregon-postgres.render.com/rehoboth2024"
);

// Define a model for form_data table
const FormData = sequelize.define('form_data', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  referralSource: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

// Middleware to parse JSON request body
app.use(bodyParser.json());

// Route to handle form submission
app.post('/submit-form', async (req, res) => {
  try {
    const { name, email, phoneNumber, referralSource, message } = req.body;

    // Insert form data into form_data table
    await FormData.create({
      name,
      email,
      phoneNumber,
      referralSource,
      message,
    });

    res.status(200).send('Form data submitted successfully!');
  } catch (error) {
    console.error('Error submitting form data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
