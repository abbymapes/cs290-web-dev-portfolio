/*
 * This represents a server that provides JSON data when asked and
 * reads and writes to BlueBook's Firestore.
 *
 *
 * @author Abby Mapes
 */

const express = require('express');
const morgan = require('morgan');
const morganBody = require('morgan-body');
const cors = require('cors');

const app = express();
// const { fetchCoursesForSubjects } = require('./dukeAPI');
const datastore = require('./datastore');

//---------------------------------------------------------------------
// set up middleware apps that manage "all" URL requests
// log all requests made to the server
// Log all requests made to the server
app.use(morgan('\n\n:method :url :status :res[content-length] - :response-time ms'));
app.use(express.json());
morganBody(app, {
    logRequestBody: true,
    logAllReqHeader: true,
    logResponseBody: true,
    logAllResHeader: true,
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

// setup CORS options for maximum security
const whitelist = ['https://compsci290_2021spring.dukecs.io'];
const corsOptions = {
    origin: (origin, callback) => {
    // only allow sites listed above or dev-server proxies to access server data
        if (whitelist.indexOf(origin) !== -1 || !origin || origin === 'http://localhost:8080') {
            callback(null, true);
        } else {
            const err = new Error(
                'CORS Error: This site is not authorized to access this resource.',
            );
            err.status = 401;
            callback(err);
        }
    },
};
// Allow connections from anywhere
app.use(cors(corsOptions));
app.use(express.json());

// provide some response to visiting the server directly (i.e., its homepage)
app.get('/',
    async (req, res) => {
        res.status(200);
        res.send(`
        <h1>Welcome to the Bluebook Server</h1> Below are links to the JSON
        data that the server pulls, proccesses, and aggregates from Firestore and
        sends to Bluebook's Vue pages.
        
        <br><br>
        <h2>User data</h2>
        This data contains information about a user that is used to 
        create the user profile page. Note, the link below provides
        the data for the user with userId = 'testId'.
        <br>
        <a href="/bluebook/getUser?userId=testId">Get User Data</a>

        <br><br>
        This data contains all the "friends" of the current user, which is used 
        to create the user profile page. Note, the link below provides
        the list of friends for the user with userId = 'testId'.
        <br>
        <a href="/bluebook/getFriends?userId=testId">Get Friends Data</a>

        <br><br>
        This data contains all users in Bluebook, which is used 
        to create the explore page.
        <br>
        <a href="/bluebook/getFilteredDocuments?collection=users&searchTerm=">Get Users</a>

        <br><br>
        This data contains all users in Bluebook, including their count of visits to the site, which is used 
        to create the admin page for administrators.
        <br>
        <a href="/bluebook/getUsersForAdmin">Get Users for Admin</a>

        <h2>Subject Data</h2>
        This data contains all subjects in Bluebook, which is used 
        to create the explore page.
        <br>
        <a href="/bluebook/getAllSubjects">Get Subjects</a>

        <h2>Attribute Data</h2>
        This data contains all course attributes in Bluebook, which is used 
        to create the explore page.
        <br>
        <a href="/bluebook/getFilteredDocuments?collection=attributes&searchTerm=">Get Attributes</a>

        <h2>Course Data</h2>
        This is the data that includes courses for a specified subject code, which 
        is used to create the subject page. Note, the link below provides the data for
        the first 50 courses for the subject with subjectCode = COMPSCI.
        <br>
        <a href="/bluebook/getCoursesForSubject?subjectCode=COMPSCI&start=&limit=50">Get Courses for Subject</a>

        <br><br>
        This is the data that includes courses for a specified course attribute, which 
        is used to create the course attribute page. Note, the link below provides the data for
        the first 50 courses for the attribute with name = (NS) Natural Sciences.
        <br>
        <a href="/bluebook/getCoursesForAttribute?attribute=(NS)%20Natural%20Sciences&start=&limit=50">Get Courses for Attribute</a>

        <br><br>
        This is the data that includes information about a course, which is used to create the
        course page. Note, the link below provides the data for the course with courseId = 000028.
        <br>
        <a href="/bluebook/getCourseInformation?courseId=000028">Get Course Information</a>

        <br><br>
        This is the data that contains the appropriate state of a course page for a user 
        who is logged in, i.e. the reaction that the user has given the course (if any) and 
        the appropriate ratings that the user has previously rated the course. Note, the link below provides the data for
        the course with courseId = 000028 and the user with userId = 'testId'.
        <br>
        <a href="/bluebook/getUserInteractions?userId=testId&courseId=000028">Get User Interactions</a>

        <h2>Reaction Data</h2>
        This is the data that contains the reaction information for a user, which is 
        used to create the reaction section in their profile (i.e. which courses they've liked, 
        disliked, and added to their wishlist). Note: the link below provides the data for the reactions
        made by the user with userId = 'testId'.
        <br>
        <a href="/bluebook/getReactions?userId=testId">Get Reaction Data</a>

        <br><br>
        This is the data that contains the reaction comments for a reaction, which is 
        used to create the reaction which is shown in the user profile and the feed page.
        Note: the link below provides the data for the reaction
        made by the user with userId = 'testId' for course with courseId = '000028'.
        <br>
        <a href="/bluebook/getReactionComments?reactionId=testId000028">Get Comments for Reaction</a>
        
        <br><br>
        This is the data that contains the reactions for all friends of a user, which is 
        used to create the user's feed page. Note: the link below provides the reaction data for the
        feed page of the user with userId = 'testId'.
        <br>
        <a href="/bluebook/getFriendsReactions?userId=testId">Get Friends' Reaction Data</a>
        <br><br>
        <h1>Collections</h1>
        Below are links to the current JSON data for all documents in each collection of Bluebook's Firestore database.
        <br><br>
        <a href="/bluebook/attributesCollection.json">Attributes Collection</a>
        <br><br>
        <a href="/bluebook/commentsCollection.json">Comments Collection</a>
        <br><br>
        <a href="/bluebook/coursesCollection.json">Courses Collection</a>
        <br><br>
        <a href="/bluebook/followsCollection.json">Follows Collection</a>
        <br><br>
        <a href="/bluebook/ratingsCollection.json">Ratings Collection</a>
        <br><br>
        <a href="/bluebook/reactionsCollection.json">Reactions Collection</a>
        <br><br>
        <a href="/bluebook/subjectsCollection.json">Subjects Collection</a>
        <br><br>
        <a href="/bluebook/usersCollection.json">Users Collection</a>
        <br><br>
        `);
    });

app.get('/bluebook/getCoursesForSubject', async (req, res, next) => {
    try {
        const { subjectCode, start, limit } = req.query;
        const number = Number(limit);
        const courses = await datastore.getCoursesForSubject(subjectCode, start, number);
        res.status(200);
        res.json(courses);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Check server`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.get('/bluebook/getCoursesForAttribute', async (req, res, next) => {
    try {
        const { attribute, start, limit } = req.query;
        const number = Number(limit);
        const courses = await datastore.getCoursesForAttribute(attribute, start, number);
        res.status(200);
        res.json(courses);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Check server`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.get('/bluebook/getCourseInformation', async (req, res, next) => {
    try {
        const { courseId } = req.query;
        const course = await datastore.getCourseInformation(courseId);
        const comments = await datastore.getCommentsForCourse(courseId);
        const ret = {
            course,
            comments,
        };
        res.status(200);
        res.json(ret);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Check server`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.get('/bluebook/getReactionComments', async (req, res, next) => {
    try {
        const { reactionId } = req.query;
        const comments = await datastore.getCommentsForReaction(reactionId);
        res.status(200);
        res.json(comments);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Please try again`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.get('/bluebook/getUserInteractions', async (req, res, next) => {
    try {
        const { userId } = req.query;
        const { courseId } = req.query;
        const interaction = await datastore.getUserInteraction(userId, courseId);
        res.status(200);
        res.json(interaction);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Check server`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.post('/bluebook/updateUserReaction', async (req, res, next) => {
    try {
        const { userId } = req.query;
        const { courseId } = req.query;
        const reaction = req.body;
        await datastore.updateReaction(reaction, userId, courseId);
        const course = await datastore.getCourseInformation(courseId);
        const interaction = await datastore.getUserInteraction(userId, courseId);
        const result = {
            courseInfo: course,
            reaction: interaction.reaction,
            rating: interaction.rating,
        };
        res.status(200);
        res.json(result);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Please refresh and try again`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.post('/bluebook/updateUserRating', async (req, res, next) => {
    try {
        const { userId } = req.query;
        const { courseId } = req.query;
        const rating = req.body;
        await datastore.updateRating(rating, userId, courseId);
        const course = await datastore.getCourseInformation(courseId);
        const interaction = await datastore.getUserInteraction(userId, courseId);
        const result = {
            courseInfo: course,
            reaction: interaction.reaction,
            rating: interaction.rating,
        };
        res.status(200);
        res.json(result);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Please refresh and try again`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.post('/bluebook/postCourseComment', async (req, res, next) => {
    try {
        const { courseId } = req.body;
        const { userId } = req.body;
        const { commentText } = req.body;
        await datastore.addNewComment('course', courseId, userId, commentText);
        const comments = await datastore.getCommentsForCourse(courseId);
        res.status(200);
        res.json(comments);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Please try again`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.get('/bluebook/deleteCourseComment', async (req, res, next) => {
    try {
        const { courseId } = req.query;
        const { commentId } = req.query;
        await datastore.deleteComment(commentId);
        const comments = await datastore.getCommentsForCourse(courseId);
        res.status(200);
        res.json(comments);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Please try again`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.post('/bluebook/postReactionComment', async (req, res, next) => {
    try {
        const { reactionId } = req.body;
        const { userId } = req.body;
        const { commentText } = req.body;
        await datastore.addNewComment('reaction', reactionId, userId, commentText);
        const comments = await datastore.getCommentsForReaction(reactionId);
        res.status(200);
        res.json(comments);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Please try again.`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.get('/bluebook/deleteReactionComment', async (req, res, next) => {
    try {
        const { reactionId } = req.query;
        const { commentId } = req.query;
        await datastore.deleteComment(commentId);
        const comments = await datastore.getCommentsForReaction(reactionId);
        res.status(200);
        res.json(comments);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Please try again.`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.get('/bluebook/getUserSubjects', async (req, res, next) => {
    try {
        const { userId } = req.query;
        const subjects = await datastore.getUserSubjects(userId);
        res.status(200);
        res.json(subjects);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Check the server and please try again.`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.post('/bluebook/updateUserSubjects', async (req, res, next) => {
    try {
        const { userId } = req.query;
        const newSubjects = req.body;
        await datastore.updateUserSubjects(userId, newSubjects);
        const allSubjects = await datastore.getUserSubjects(userId);
        res.status(200);
        res.json(allSubjects.subjects);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Please try again`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.get('/bluebook/getUser', async (req, res, next) => {
    try {
        const { userId } = req.query;
        const user = await datastore.getUser(userId);
        res.status(200);
        res.json(user);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Check server`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.get('/bluebook/getReactions', async (req, res, next) => {
    try {
        const { userId } = req.query;
        const reactions = await datastore.getReactions(userId);
        res.status(200);
        res.json(reactions);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Check server`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.get('/bluebook/getFriends', async (req, res, next) => {
    try {
        const { userId } = req.query;
        const friendList = await datastore.getFriends(userId);
        res.status(200);
        res.json(friendList);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Check server`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.post('/bluebook/getSubjectNames', async (req, res, next) => {
    try {
        const subjects = req.body;
        const subjectNames = await datastore.getSubjectNames(subjects);
        res.status(200);
        res.json(subjectNames);
    } catch (error) {
        const err = new Error(`${error} --- Please try again`);
        err.status = 503;
        next(err);
    }
});

app.get('/bluebook/getFollowingStatus', async (req, res, next) => {
    try {
        const { currentUserId } = req.query;
        const otherUserId = req.query.userId;
        const followStatus = await datastore.getFollowingStatus(currentUserId, otherUserId);
        res.status(200);
        res.json(followStatus);
    } catch (error) {
        const err = new Error(`${error}--- Please try again`);
        err.status = 503;
        next(err);
    }
});

app.get('/bluebook/addFollow', async (req, res, next) => {
    try {
        const { currentUserId } = req.query;
        const otherUserId = req.query.userId;
        const followId = await datastore.addFollow(currentUserId, otherUserId);
        res.status(200);
        res.json(followId);
    } catch (error) {
        const err = new Error(`${error}--- Please refresh the page and try again.`);
        err.status = 503;
        next(err);
    }
});

app.get('/bluebook/removeFollow', async (req, res, next) => {
    try {
        const { followId } = req.query;
        await datastore.removeFollow(followId);
        res.status(200);
        res.json(false);
    } catch (error) {
        const err = new Error(`${error}--- Please refresh the page and try again.`);
        err.status = 503;
        next(err);
    }
});

app.get('/bluebook/getFriendsReactions', async (req, res, next) => {
    try {
        const { userId } = req.query;
        const reactions = await datastore.getFriendsReactions(userId);
        res.status(200);
        res.json(reactions);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Check server`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.get('/bluebook/getDocuments', async (req, res, next) => {
    try {
        const { collection, start, numResults } = req.query;
        const limit = Number(numResults);
        let results = {};
        if (collection === 'courses') {
            results = await datastore.getCourses(start, limit);
        } else if (collection === 'subjects') {
            results = await datastore.getSubjects(start, limit);
        } else if (collection === 'attributes') {
            results = await datastore.getAttributes();
        } else if (collection === 'users') {
            results = await datastore.getUsers(start, limit);
        }
        res.status(200);
        res.json(results);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Please try again`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.get('/bluebook/getFilteredDocuments', async (req, res, next) => {
    try {
        const { collection, searchTerm } = req.query;
        let results = {};
        if (collection === 'subjects') {
            results = await datastore.getFilteredSubjects(searchTerm);
        } else if (collection === 'attributes') {
            results = await datastore.getFilteredAttributes(searchTerm);
        } else if (collection === 'users') {
            results = await datastore.getFilteredUsers(searchTerm);
        }
        res.status(200);
        res.json(results);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Please try again`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.get('/bluebook/getFilteredCoursesForSubject', async (req, res, next) => {
    try {
        const { subjectCode, searchTerm } = req.query;
        const results = await datastore.getFilteredCoursesForSubject(subjectCode, searchTerm);
        res.status(200);
        res.json(results);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Please try again`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.get('/bluebook/getFilteredCoursesForAttribute', async (req, res, next) => {
    try {
        const { attribute, searchTerm } = req.query;
        const results = await datastore.getFilteredCoursesForAttribute(attribute, searchTerm);
        res.status(200);
        res.json(results);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Please try again`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.get('/bluebook/getAllSubjects', async (req, res, next) => {
    try {
        const subjects = await datastore.getAllSubjects();
        res.status(200);
        res.json(subjects);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Please try again`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.post('/bluebook/createUserDocument', async (req, res, next) => {
    try {
        const user = req.body;
        const userId = await datastore.createUserDocument(user);
        res.status(200);
        res.json(userId);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Please try again`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.get('/bluebook/updateUserVisits', async (req, res, next) => {
    try {
        const { userId } = req.query;
        await datastore.increaseVisit(userId);
        res.status(200);
        res.send('Updated user successfully.');
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Please try again`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

app.get('/bluebook/getUsersForAdmin', async (req, res, next) => {
    try {
        const results = await datastore.getUsersForAdmin();
        res.status(200);
        res.json(results);
    } catch (error) {
        console.log(error);
        // create error object with useful message
        const err = new Error(`${error} --- Please try again`);
        // set status code to return with response
        err.status = 503;
        // forward error on to next middleware handler (the error handler defined below)
        next(err);
    }
});

// loads course information into Firebase
app.post('/bluebook/loadCourses', (req, res) => {
    // const subjects = req.body;
    // fetchCoursesForSubjects(subjects, datastore.db);
    res.status(200);
    res.send('Complete');
});

// Retrieves all data in Firestore collections
app.get('/bluebook/attributesCollection.json',
    async (req, res) => {
        res.status(200);
        const collections = await datastore.getCollection('attributes');
        res.json(collections);
    });

app.get('/bluebook/commentsCollection.json',
    async (req, res) => {
        res.status(200);
        const collections = await datastore.getCollection('comments');
        res.json(collections);
    });

app.get('/bluebook/coursesCollection.json',
    async (req, res) => {
        res.status(200);
        const collections = await datastore.getCollection('courses');
        res.json(collections);
    });

app.get('/bluebook/followsCollection.json',
    async (req, res) => {
        res.status(200);
        const collections = await datastore.getCollection('follows');
        res.json(collections);
    });

app.get('/bluebook/ratingsCollection.json',
    async (req, res) => {
        res.status(200);
        const collections = await datastore.getCollection('ratings');
        res.json(collections);
    });

app.get('/bluebook/reactionsCollection.json',
    async (req, res) => {
        res.status(200);
        const collections = await datastore.getCollection('reactions');
        res.json(collections);
    });

app.get('/bluebook/subjectsCollection.json',
    async (req, res) => {
        res.status(200);
        const collections = await datastore.getCollection('subjects');
        res.json(collections);
    });

app.get('/bluebook/usersCollection.json',
    async (req, res) => {
        res.status(200);
        const collections = await datastore.getCollection('users');
        res.json(collections);
    });

// Retrieves json data for project demos
app.get('/bluebook/user.json',
    async (req, res) => {
        res.status(200);
        const user = await datastore.getUser('testId');
        res.json(user);
    });

app.get('/bluebook/friends.json',
    async (req, res) => {
        res.status(200);
        const friendList = await datastore.getFriends('testId');
        res.json(friendList);
    });

app.get('/bluebook/reactions.json',
    async (req, res) => {
        res.status(200);
        const reactions = await datastore.getReactions('testId');
        res.json(reactions);
    });

app.get('/bluebook/courseInfo.json',
    async (req, res) => {
        res.status(200);
        const courseInformaiton = await datastore.getCourseInformation('000028');
        res.json(courseInformaiton);
    });

// handle errors thrown by the application code
// NOTE, this actually must be defined LAST in order to catch any errors from others
app.use((err, req, res, next) => {
    console.log(err);
    // delegate to default Express error handler if HTTP header info has already been sent back
    if (res.headersSent) {
        next(err);
        return;
    }
    // set error status and return error message as JSON
    // since that is what the frontend is expecting
    res.status(err.status || 500).json({ message: err.message });
});
