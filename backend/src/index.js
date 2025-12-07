const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const salesRouter = require('./routes/sales');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/sales', salesRouter);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
