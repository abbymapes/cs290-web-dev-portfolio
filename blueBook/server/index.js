/*
 * This represents a server that provides JSON data when asked and 
 * reads and writes to BlueBook's Firestore.
 *
 *
 * @author Abby Mapes
 */

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const { fetchCoursesForSubjects } = require('./dukeAPI');
const datastore = require('./datastore');

//---------------------------------------------------------------------
// set up middleware apps that manage "all" URL requests
// log all requests made to the server
// Log all requests made to the server
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// setup CORS options for maximum security
const whitelist = ['https://compsci290_2021spring.dukecs.io'];
/*const corsOptions = {
  origin: (origin, callback) => {
    // only allow sites listed above or dev-server proxies to access server data
    if (whitelist.indexOf(origin) !== -1 || !origin || origin == "http://localhost:8080") {
      callback(null, true);
    } else {
      const err = new Error('CORS Error: This site is not authorized to access this resource.');
      err.status = 401;
      callback(err);
    }
  },
};*/
// Allow connections from anywhere
app.use(cors());
app.use(express.json());

// provide some response to visiting the server directly (i.e., its homepage)
app.get('/',
    async (req, res) => {
        res.status(200);
        res.send(`
        The following data outlines the structure for:
        <br><br>
        User data, (which represents a documents that will 
          be stored in the Firestore "users" collection)
        <br>
        <a href="/api/user.json">Get User Data</a>
        <br><br>
        Following data (which represents the documents from the 
          "follows" collection in Firestore that will be 
          fetched for the current user id, and displayed in their
          user page.
        <br>
        <a href="/api/friends.json">Get Following Data!</a>
        <br><br>
        Class Reaction data data (which represents the documents from the 
          "reactions" collection in Firestore that will be 
          fetched for the current user id, and displayed in their
          user page. 
        <br>
        <a href="/api/reactions.json">Get Class Reaction Data!</a>`);
    }
);

app.get('/bluebook/getUser', async (req, res) => {
  let userId = req.query.uid;
  let user = await datastore.getUser(userId);
  res.status(200);
  res.json(user);
});

app.get('/bluebook/getReactions', async (req, res) => {
  let userId = req.query.uid;
  let reactions = await datastore.getReactions(userId);
  res.status(200);
  console.log(reactions);
  res.json(reactions);
});

app.get('/bluebook/getFriends', async (req, res) => {
  let userId = req.query.uid;
  let friendList = await datastore.getFriends(userId);
  res.status(200);
  res.json(friendList);
});

// loads course information into Firebase
app.post('/bluebook/loadCourses', (req, res) => {
  let subjects = req.body;
  fetchCoursesForSubjects(subjects, datastore.db);
});

app.get('/bluebook/user.json',
    async (req, res) => {
      res.status(200);
      let user = await datastore.getUser('testId');
      res.json(user);
    }
);

app.get('/bluebook/friends.json',
  async (req, res) => {
      res.status(200);
      let friendList = await datastore.getFriends('testId');
      res.json(friendList);
    }
);

app.get('/bluebook/reactions.json',
  async (req, res) => {
      res.status(200);
      let reactions = await datastore.getReactions('testId');
      res.json(reactions);
    }
);

const PORT = 3000;
app.listen(PORT, () => console.log('App listening on port ' + PORT));