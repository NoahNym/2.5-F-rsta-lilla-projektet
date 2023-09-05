const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userData = await fs.readFile(path.join(__dirname, 'data', 'users.json'), 'utf-8');
    const users = JSON.parse(userData);

    // Check if the username already exists
    const userExists = users.some(user => user.username === username);

    if (userExists) {
      res.status(400).send('Username already exists');
      return;
    }

    const newUser = { username, password };
    users.push(newUser);

    await fs.writeFile(path.join(__dirname, 'data', 'users.json'), JSON.stringify(users, null, 2));
    res.redirect('/login.html');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error signing up');
  }
});




app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userData = await fs.readFile(path.join(__dirname, 'data', 'users.json'), 'utf-8');
    const users = JSON.parse(userData);

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
      res.redirect('/home.html');
    } else {
      res.redirect('/login.html');
    }
  } catch (error) {
    console.error(error);
    res.redirect('/login.html');
  }
});

// Server Start
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
