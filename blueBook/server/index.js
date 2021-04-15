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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));

// setup CORS options for maximum security
/*
const whitelist = ['https://compsci290_2021spring.dukecs.io'];
const corsOptions = {
    origin: (origin, callback) => {
    // only allow sites listed above or dev-server proxies to access server data
        if (whitelist.indexOf(origin) !== -1 || !origin || origin == 'http://localhost:8080') {
            callback(null, true);
        } else {
            const err = new Error(
              'CORS Error: This site is not authorized to access this resource.'
            );
            err.status = 401;
            callback(err);
        }
    },
};
*/
// Allow connections from anywhere
app.use(cors());
app.use(express.json());

// provide some response to visiting the server directly (i.e., its homepage)
app.get('/',
    async (req, res) => {
        res.status(200);
        res.send(`
        The following data outlines some of data pulled from the 
        collections in Firestore and sent to the front-end of my web app
        for this demo:

        <br><br>
        User data (which is sent to front-end to create the user page)
        <br>
        <a href="/bluebook/getUser?userId=testId">Get User Data</a>

        <br><br>
        Courses for subject COMPSCI (which is sent to front-end to create the 
            subject page)
        <br>
        <a href="/bluebook/getCoursesForSubject?subjectCode=COMPSCI">Get Courses for Subject</a>

        <br><br>
        Courses for attribute (NS) Natural Science (which is sent to front-end to create the 
            subject page)
        <br>
        <a href="/bluebook/getCoursesForAttribute?attribute=(NS)%20Natural%20Sciences">Get Courses for Attribute</a>

        <br><br>
        Course information for the course with courseId 000028 
        (this is sent to front-end to create the course page)
        <br>
        <a href="/bluebook/getCourseInformation?courseId=000028">Get Course Information</a>

        <br><br>
        Reaction comments for the reaction with reactionId 'testId000028'
        (this is sent to front-end to create the reaction component in the feed and user page)
        <br>
        <a href="/bluebook/getReactionComments?reactionId=testId000028">Get Comments for Reaction</a>

        <br><br>
        User interaction information for the user with ID 'testId' and the course with id '000028'
        (this is sent to front-end to create the course page with the appropriate rankings and 
            reactions for the current user)
        <br>
        <a href="/bluebook/getUserInteractions?userId=testId&courseId=000028">Get User Interactions</a>

        <br><br>
        Friends data which represents the friends of the current user in Firestore, 
        (which is displayed in their user page "friends" section)
        <br>
        <a href="/bluebook/getFriends?userId=testId">Get Friends Data!</a>

        <br><br>
        Class Reaction data (which represents the reaction data for 
            the specified user, which will be displayed in their user page) 
        <br>
        <a href="/bluebook/getReactions?userId=testId">Get Reaction Data!</a>
        
        <br><br>
        Friends Reaction data (which represents the reaction data for 
            the specified user's friends, which will be displayed in their feed page) 
        <br>
        <a href="/bluebook/getFriendsReactions?userId=testId">Get Friends' Reaction Data!</a>
        `);
    });

app.get('/bluebook/getCoursesForSubject', async (req, res, next) => {
    try {
        const { subjectCode } = req.query;
        const courses = await datastore.getCoursesForSubject(subjectCode);
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
        const { attribute } = req.query;
        const courses = await datastore.getCoursesForAttribute(attribute);
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
        console.log(reactions);
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

// loads course information into Firebase
app.post('/bluebook/loadCourses', (req, res) => {
    //const subjects = req.body;
    //fetchCoursesForSubjects(subjects, datastore.db);
    res.status(200);
});

// displays json data for project demos
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
