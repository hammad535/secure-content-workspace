require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT;

if (!PORT) {
  console.error('ERROR: PORT environment variable is required');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
