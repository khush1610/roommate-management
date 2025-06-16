const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const choresRoutes = require('./routes/choresRoutes');
const expensesRoutes = require('./routes/expensesRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json()); 


const matchRoutes = require('./routes/matchRoutes');
const profilesRoutes = require('./routes/profileRoutes');
app.use('/api/profiles', profilesRoutes);
app.use('/api', matchRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/chores', choresRoutes);
app.use('/api/expenses', expensesRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
