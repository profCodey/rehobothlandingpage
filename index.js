const express = require("express");
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");
const cors = require("cors");

const app = express();
const port = 3003;

// Connect to PostgreSQL database
const sequelize = new Sequelize(
  "postgres://trem:4NhGRItwGoJrXXg8mtJGEvgcGrJgmf2e@dpg-coi5rjtjm4es739j10ag-a.oregon-postgres.render.com/rehoboth2024",
  {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

// Define a model for form_data table
const FormData = sequelize.define("form_data", {
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
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is working!");
});

// Route to handle form submission
app.post("/submit-form", async (req, res) => {
  try {
    const { name, email, phoneNumber, referralSource, message } = req.body;
    console.log("it hit here");
    // Insert form data into form_data table
    await FormData.create({
      name,
      email,
      phoneNumber,
      referralSource,
      message,
    });

    res.status(200).send("Form data submitted successfully!");
  } catch (error) {
    console.error("Error submitting form data:", error);
    res.status(500).send("Internal Server Error", error);
  }
});

app.get("/emails", async (req, res) => {
  try {
    // Fetch all emails from the database
    const emails = await FormData.findAll();

    res.json(emails);
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(port, async () => {
  await sequelize.sync({
    // force: true
  });
  console.log(`Server is running on port ${port}`);
});
