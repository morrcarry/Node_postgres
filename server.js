const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const { PORT } = process.env;

const multer = require('multer');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}`);
  },
});

module.exports.upload = multer({ storage: storage });

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/', (req, res) => {
  res.send('home');
});
app.use('/', require('./app/routes/authRoutes'));
app.use('/super', require('./app/routes/superAdminRoutes'));
app.use('/admin', require('./app/routes/adminRoutes'));
app.use('/self', require('./app/routes/employeeRoutes'));

// db.sequelize.sync();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
