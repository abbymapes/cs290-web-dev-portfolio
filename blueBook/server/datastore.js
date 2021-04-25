/*
 * This represents the script that reads and writes to BlueBook's
 * database in Firebase Firestore.
 *
 * @author Abby Mapes
 */

const admin = require('firebase-admin');
const serviceAccount = require('./secrets/bluebook-153fe-firebase-adminsdk-slbd7-d46ac8681d.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

/*
 * Robustness validation: ensures that data loaded from Firestore
 * and sent to front-end has the necessary information so that the app doesn't crash
 */

function isValidCourseDocument(data) {
    if (data.courseId !== null
        && data.title !== null
        && data.catalogNumber !== null
        && data.subjectCode !== null
        && data.courseCodes !== null
        && data.description !== null
        && data.subjectName !== null) {
        return true;
    }
    console.log('BAD JSON DATA: Unable to load course document due to invalid JSON data loaded from Firestore.');
    return false;
}

function isValidUserDocument(data) {
    if (data.isAdmin && data.userId !== null
            && data.displayName !== null
            && data.picture !== null) {
        return true;
    }
    if (data.userId !== null
        && data.displayName !== null
        && !data.isAdmin && data.majors !== null
        && data.minors !== null
        && data.certificates !== null
        && data.subjects !== null
        && data.visits !== null
        && data.picture !== null) {
        return true;
    }
    console.log('BAD JSON DATA: Unable to load user document due to invalid JSON data loaded from Firestore.');
    return false;
}

function isValidSubjectDocument(data) {
    if (data.name !== null && data.code !== null) {
        return true;
    }
    console.log('BAD JSON DATA: Unable to load subject document due to invalid JSON data loaded from Firestore.');
    return false;
}

function isValidAttributeDocument(data) {
    if (data.name !== null) {
        return true;
    }
    console.log('BAD JSON DATA: Unable to load attribute document due to invalid JSON data loaded from Firestore.');
    return false;
}

function isValidCommentDocument(data) {
    if (data.commentText !== null
        && data.date !== null
        && (data.reactionId !== null || data.courseId !== null)
        && data.userId !== null) {
        return true;
    }
    console.log('BAD JSON DATA: Unable to load comment document due to invalid JSON data loaded from Firestore.');
    return false;
}

function isValidRatingDocument(data) {
    if (data.courseId !== null
        && data.difficulty !== null
        && data.interesting !== null
        && data.userId !== null) {
        return true;
    }
    console.log('BAD JSON DATA: Unable to load rating document due to invalid JSON data loaded from Firestore.');
    return false;
}

function isValidReactionDocument(data) {
    if (data.courseId !== null
        && data.date !== null
        && data.dislike !== null
        && data.like !== null
        && data.wishlist !== null
        && data.reactionId !== null
        && data.userId !== null
        && !(data.like && data.dislike)
        && !(data.like && data.wishlist)
        && !(data.dislike && data.wishlist)) {
        return true;
    }
    console.log('BAD JSON DATA: Unable to load reaction document due to invalid JSON data loaded from Firestore.');
    return false;
}

/*
 * Increases visit count by 1 for 'users' document with ID: userId
 */
async function increaseVisit(userId) {
    const doc = await db.collection('users').doc(userId).get();
    if (doc.exists) {
        await db.collection('users').doc(userId).update({
            visits: admin.firestore.FieldValue.increment(1),
        }).then(() => {
            console.log('Visit count successfully updated for user: ', userId);
        })
            .catch((error) => {
                console.error('Error updating visit count for user: ', userId, error);
            });
    }
}

/*
 * Stores a document in the 'users' collection with the fields stored
 * in the user object parameter
 *
 * Note: user object is validated in the front end to have all necessary properties
 * in order to create a user document, including empty strings / arrays for all fields
 * which the user doesn't specify (such as major / minor subjects)
 */
async function createUserDocument(user) {
    const { userId } = user;
    const newUser = user;
    if (!newUser.visits) {
        const doc = await db.collection('users').doc(userId).get();
        if (!doc.exists) {
            newUser.visits = 0;
        } else {
            newUser.visits = doc.data().visits;
        }
    }
    await db.collection('users').doc(userId).set(newUser).then(() => {
        console.log(`User document successfully written for user: ${userId}`);
    })
        .catch((error) => {
            throw new Error(`Error writing document for ${userId}: ${error}.`);
        });
    return userId;
}

/*
 * Gets courses for subject specified by subjectCode starting at the
 * subjectCode specified by start (retrieves 'limit' number of courses)
 */
async function getCoursesForSubject(subjectCode, start, limit) {
    const courses = [];
    let lastCourse = '';
    let totalCourses = 0;
    await db.collection('courses').where('subjectCode', '==', subjectCode).orderBy('title').startAfter(start)
        .limit(limit)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (isValidCourseDocument(doc.data())) {
                    const course = {
                        courseId: doc.data().courseId,
                        title: doc.data().title,
                        catalogNumber: doc.data().catalogNumber,
                        subjectCode: doc.data().subjectCode,
                    };
                    courses.push(course);
                    lastCourse = doc.data().title;
                }
            });
        })
        .catch((error) => {
            throw new Error(`Error retrieving courses for ${subjectCode}: ${error}.`);
        });
    await db.collection('courses').where('subjectCode', '==', subjectCode).get().then((snap) => {
        totalCourses = snap.size;
    });
    return {
        results: courses,
        totalResults: totalCourses,
        lastValue: lastCourse,
    };
}

/*
 * Gets courses for attribute specified by attribute starting at the
 * attribute specified by start (retrieves 'limit' number of courses)
 */
async function getCoursesForAttribute(attribute, start, limit) {
    const courses = [];
    let lastCourse = '';
    let totalCourses = 0;
    await db.collection('courses').where('courseCodes', 'array-contains', attribute).orderBy('title').startAfter(start)
        .limit(limit)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (isValidCourseDocument(doc.data())) {
                    const course = {
                        courseId: doc.data().courseId,
                        title: doc.data().title,
                        catalogNumber: doc.data().catalogNumber,
                        subjectCode: doc.data().subjectCode,
                    };
                    courses.push(course);
                    lastCourse = doc.data().title;
                }
            });
        })
        .catch((error) => {
            throw new Error(`Error retrieving courses for ${attribute}: ${error}.`);
        });
    await db.collection('courses').where('courseCodes', 'array-contains', attribute).get().then((snap) => {
        totalCourses = snap.size;
    });
    return {
        results: courses,
        totalResults: totalCourses,
        lastValue: lastCourse,
    };
}

/*
 * Retrieves the average ratings (difficulty and interesting) for the courseId
 * and returns a ratings object with properties difficulty and interesting
 */
async function getAverageRatings(courseId) {
    let difficultyCount = 0;
    let difficultySum = 0;
    let interestingCount = 0;
    let interestingSum = 0;
    await db.collection('ratings').where('courseId', '==', courseId).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const interestingRating = (doc.data().interesting ? doc.data().interesting : 0);
                const difficultyRating = (doc.data().difficulty ? doc.data().difficulty : 0);
                if (interestingRating !== 0) {
                    interestingSum += interestingRating;
                    interestingCount += 1;
                }
                if (difficultyRating !== 0) {
                    difficultySum += difficultyRating;
                    difficultyCount += 1;
                }
            });
        })
        .catch((error) => {
            throw new Error(`Error retrieving ratings for ${courseId}: ${error}`);
        });
    const ratings = {
        interesting: (interestingCount === 0 ? 0 : interestingSum / interestingCount),
        difficulty: (difficultyCount === 0 ? 0 : difficultySum / difficultyCount),
    };
    return ratings;
}

/*
 * Retrieves course information for the course specified by
 * courseId
 */
async function getCourseInformation(courseId) {
    let course = {};
    await db.collection('courses').doc(courseId).get().then(async (doc) => {
        if (doc.exists && isValidCourseDocument(doc.data())) {
            course = doc.data();
            const ratings = await getAverageRatings(courseId);
            course.interesting = ratings.interesting;
            course.difficulty = ratings.difficulty;
        } else if (!doc.exists) {
            throw new Error(`No such document in courses with ID: ${courseId}`);
        } else {
            throw new Error(`BAD JSON DATA: Unable to load course document ${doc.id} due to invalid JSON data.`);
        }
    });
    return course;
}

/*
 * Retrieves the user's reaciton to the course specified by courseId
 */
async function getUserInteraction(userId, courseId) {
    const interaction = {};
    const docId = userId + courseId;
    await db.collection('reactions').doc(docId).get().then((doc) => {
        if (doc.exists && isValidReactionDocument(doc.data())) {
            interaction.reaction = {
                like: doc.data().like,
                dislike: doc.data().dislike,
                wishlist: doc.data().wishlist,
            };
        } else if (!doc.exists) {
            interaction.reaction = {
                like: false,
                dislike: false,
                wishlist: false,
            };
        } else {
            throw new Error(`Invalid reaction document ${docId} for ${userId} and course ${courseId}.`);
        }
    })
        .catch((error) => {
            throw new Error(`Error retrieving reaction document for user ${userId} and course ${courseId}: ${error}`);
        });
    await db.collection('ratings').doc(docId).get().then((doc) => {
        if (doc.exists && isValidRatingDocument(doc.data())) {
            interaction.rating = {
                interesting: doc.data().interesting,
                difficulty: doc.data().difficulty,
            };
        } else if (!doc.exists) {
            interaction.rating = {
                interesting: 0,
                difficulty: 0,
            };
        } else {
            throw new Error(`Invalid rating document ${docId} for ${userId} and course ${courseId}.`);
        }
    })
        .catch((error) => {
            throw new Error(`Error retrieving rating documents for user ${userId} and course ${courseId}: ${error}`);
        });
    return interaction;
}

/*
 * Deletes all comments for reaction document with the appropriate reactionId
 */
async function deleteAllCommentsForReaction(reactionId) {
    try {
        const deletePromises = await db.collection('comments').where('reactionId', '==', reactionId).get()
            .then(async (querySnapshot) => {
                const promises = [];
                querySnapshot.forEach(async (doc) => {
                    promises.push(db.collection('comments').doc(doc.id).delete());
                });
                return Promise.all(promises);
            })
            .catch((error) => {
                throw new Error(`Error deleting comments for reaction ${reactionId}: ${error}`);
            });
        return deletePromises;
    } catch (error) {
        throw new Error(error);
    }
}

/*
 * Updates the reaction for the user and course based on the reaction object
 *
 * Front-end ensures that the reaction object, userId, and courseId are not empty
 */
async function updateReaction(reaction, userId, courseId) {
    const docId = userId + courseId;
    if (reaction.like || reaction.dislike || reaction.wishlist) {
        await db.collection('reactions').doc(docId).set({
            userId,
            courseId,
            like: reaction.like,
            dislike: reaction.dislike,
            wishlist: reaction.wishlist,
            reactionId: docId,
            date: admin.firestore.Timestamp.now(),
        })
            .then(() => {
                console.log('Reaction document successfully written!');
            })
            .catch((error) => {
                throw new Error(`Unable to update reaction for user ${userId} and course ${courseId}: ${error}.`);
            });
        await deleteAllCommentsForReaction(docId);
    } else {
        await db.collection('reactions').doc(docId).delete().then(async () => {
            await deleteAllCommentsForReaction(docId);
        })
            .catch((error) => {
                throw new Error(`Unable to delete reaction ${docId}: ${error}.`);
            });
    }
}

/*
 * Updates the rating for the user and course based on the rating object
 * Front-end ensures that the reaction object, userId, and courseId are not empty
 * Front-end ensures that the userId and courseId are not empty
 */
async function updateRating(rating, userId, courseId) {
    const docId = userId + courseId;
    if (rating.difficulty === 0 && rating.interesting === 0) {
        await db.collection('ratings').doc(docId).delete().then(() => {
            console.log('Rating successfully deleted!');
        })
            .catch((error) => {
                throw new Error(`Unable to delete rating document ${docId} for user ${userId} and course ${courseId}: ${error}.`);
            });
    } else {
        await db.collection('ratings').doc(docId).set({
            userId,
            courseId,
            difficulty: (rating.difficulty ? rating.difficulty : 0),
            interesting: (rating.interesting ? rating.interesting : 0),
        })
            .then(() => {
                console.log('Document successfully written!');
            })
            .catch((error) => {
                throw new Error(`Unable to update rating for course ${courseId} and user ${userId}: ${error}.`);
            });
    }
}

/*
 * Adds user information for userId to comment object
 */
async function getCommentWithUser(comment, userId) {
    const newComment = comment;
    await db.collection('users').doc(userId).get().then(async (doc) => {
        if (doc.exists && isValidUserDocument(doc.data())) {
            newComment.user = {
                userId,
                displayName: doc.data().displayName,
                picture: (doc.data().picture ? doc.data().picture : ''),
            };
        } else {
            throw new Error(`Error retrieving document for user ${userId}.`);
        }
    });
    return newComment;
}

/*
 * Retrieves comment documents for specified reactionId
 */
async function getCommentsForReaction(reactionId) {
    const userPromises = await db.collection('comments').where('reactionId', '==', reactionId).orderBy('date', 'desc').get()
        .then(async (querySnapshot) => {
            const promises = [];
            querySnapshot.forEach(async (doc) => {
                if (isValidCommentDocument(doc.data())) {
                    const comment = {
                        commentId: doc.id,
                        commentText: doc.data().commentText,
                    };
                    promises.push(getCommentWithUser(comment, doc.data().userId));
                }
            });
            return Promise.all(promises);
        })
        .catch((error) => {
            throw new Error(`Error retrieving comments for reaction ${reactionId}: ${error}`);
        });
    return userPromises;
}

/*
 * Retrieves comment documents for specified courseId
 */
async function getCommentsForCourse(courseId) {
    const userPromises = await db.collection('comments').where('courseId', '==', courseId).orderBy('date', 'desc').get()
        .then(async (querySnapshot) => {
            const promises = [];
            querySnapshot.forEach(async (doc) => {
                if (isValidCommentDocument(doc.data())) {
                    const comment = {
                        commentId: doc.id,
                        commentText: doc.data().commentText,
                    };
                    promises.push(getCommentWithUser(comment, doc.data().userId));
                }
            });
            return Promise.all(promises);
        })
        .catch((error) => {
            throw new Error(`Error retrieving comments for course ${courseId}: ${error}`);
        });
    return userPromises;
}

/*
 * Adds new comment to course with ID = typeId if type is 'course'.
 * Otherwise, adds new comment to reaction with ID = typeId
 */
async function addNewComment(type, typeId, userId, commentText) {
    const data = {
        userId,
        commentText,
        date: admin.firestore.Timestamp.now(),
    };
    if (type === 'course') {
        data.courseId = typeId;
    } else {
        data.reactionId = typeId;
    }
    await db.collection('comments').doc().set(data)
        .then(() => {
            console.log('Comment document successfully written!');
        })
        .catch((error) => {
            throw new Error(`Unable to post ${type} comment for ${typeId}: ${error}.`);
        });
}

/*
 * Deletes comment document with commentId
 */
async function deleteComment(commentId) {
    await db.collection('comments').doc(commentId).delete().then(() => {
        console.log('Comment successfully deleted!');
    })
        .catch((error) => {
            throw new Error(`Unable to delete comment ${commentId}: ${error}.`);
        });
}

/*
 * Retrieves subjects for specified userId
 */
async function getUserSubjects(userId) {
    let subjects = {};
    await db.collection('users').doc(userId).get().then(async (doc) => {
        if (doc.exists && isValidUserDocument(doc.data())) {
            subjects = {
                majors: doc.data().majors,
                minors: doc.data().minors,
                certificates: doc.data().certificates,
                subjects: doc.data().subjects,
            };
        } else {
            throw new Error(`Error retrieving subjects for user ${userId}.`);
        }
    });
    return subjects;
}

/*
 * Updates subjects for specified userId
 */
async function updateUserSubjects(userId, newSubjects) {
    const userRef = db.collection('users').doc(userId);
    // Set the 'capital' field of the city
    await userRef.update({
        subjects: newSubjects,
    }).then(() => {
        console.log('User subjects successfully updated!');
    })
        .catch((error) => {
            throw new Error(`Unable to update user subjects for user ${userId}: ${error}.`);
        });
}

/*
 * Retrieves user object for specified userId
 */
async function getUser(userId) {
    let user = {};
    await db.collection('users').doc(userId).get().then(async (doc) => {
        if (doc.exists && isValidUserDocument(doc.data())) {
            user = {
                userId: doc.data().userId,
                displayName: doc.data().displayName,
                picture: (doc.data().picture ? doc.data().picture : ''),
                majors: doc.data().majors,
                minors: doc.data().minors,
                certificates: doc.data().certificates,
                subjects: doc.data().subjects,
                isAdmin: doc.data().isAdmin,
            };
        } else {
            throw new Error(`Cannot find requested user ${userId}.`);
        }
    });
    return user;
}

/*
 * Adds course information for courseId to the reaction object
 */
async function getCourseForReaction(reaction, courseId) {
    const newReaction = reaction;
    await db.collection('courses').doc(courseId).get().then((doc) => {
        if (doc.exists && isValidCourseDocument(doc.data())) {
            newReaction.title = doc.data().title;
            newReaction.catalogNumber = doc.data().catalogNumber;
            newReaction.subjectCode = doc.data().subjectCode;
        } else if (!doc.exists) {
            throw new Error(`Error retrieving document for course ${courseId} for reaction ${newReaction.reactionId}.`);
        } else {
            throw new Error(`BAD JSON DATA: Unable to load course document ${doc.id} due to invalid JSON data.`);
        }
    });
    return newReaction;
}

/*
 * Comparator for reaction documents to sort by descending date
 */
function compareReactions(reaction1, reaction2) {
    if (reaction1.date > reaction2.date) {
        return -1;
    } if (reaction1.date < reaction2.date) {
        return 1;
    }
    return 0;
}

/*
 * Replaces reaction date property with String of its date
 */
function getReactionWithDateString(reaction) {
    const newReaction = reaction;
    const dateString = `${reaction.date.toDateString()} at ${reaction.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    newReaction.date = dateString;
    return newReaction;
}

/*
 * Retrieves course reactions for specified userId
 */
async function getReactions(userId) {
    try {
        let liked = [];
        let disliked = [];
        let wishlist = [];
        const reactions = await db.collection('reactions').where('userId', '==', userId).get()
            .then(async (querySnapshot) => {
                const likedPromises = [];
                const dislikedPromises = [];
                const wishlistPromises = [];
                querySnapshot.forEach(async (doc) => {
                    if (isValidReactionDocument(doc.data())) {
                        if (doc.data().like || doc.data().dislike || doc.data().wishlist) {
                            const dateInMillis = doc.data().date.seconds * 1000;
                            const date = new Date(dateInMillis);
                            const reaction = {
                                reactionId: doc.id,
                                courseId: doc.data().courseId,
                                date,
                            };
                            if (doc.data().like) {
                                reaction.type = 'like';
                                likedPromises.push(
                                    getCourseForReaction(reaction, doc.data().courseId),
                                );
                            } else if (doc.data().dislike) {
                                reaction.type = 'dislike';
                                dislikedPromises.push(
                                    getCourseForReaction(reaction, doc.data().courseId),
                                );
                            } else {
                                reaction.type = 'wishlist';
                                wishlistPromises.push(
                                    getCourseForReaction(reaction, doc.data().courseId),
                                );
                            }
                        }
                    }
                });
                liked = await Promise.all(likedPromises);
                disliked = await Promise.all(dislikedPromises);
                wishlist = await Promise.all(wishlistPromises);
                liked.sort(compareReactions);
                disliked.sort(compareReactions);
                wishlist.sort(compareReactions);
                return {
                    liked: liked.map((reaction) => getReactionWithDateString(reaction)),
                    disliked: disliked.map((reaction) => getReactionWithDateString(reaction)),
                    wishlist: wishlist.map((reaction) => getReactionWithDateString(reaction)),
                };
            });
        return reactions;
    } catch (error) {
        throw new Error(`Error retrieving reactions for user ${userId}: ${error}`);
    }
}

/*
 * Adds appropriate name for specified subject, based on subject.code
 */
async function addNameToSubject(subject) {
    const newSubject = subject;
    await db.collection('subjects').doc(subject.code).get().then(async (doc) => {
        if (doc.exists && isValidSubjectDocument(doc.data())) {
            newSubject.name = doc.data().name;
        } else {
            throw new Error(`Error retrieving document for subject ${newSubject.code}.`);
        }
    });
    return newSubject;
}

/*
 * Retrieves appropriate names for specified subjects
 */
async function getSubjectNames(subjects) {
    const promises = [];
    await subjects.forEach(async (subject) => {
        promises.push(addNameToSubject(subject));
    });
    const subjectNames = await Promise.all(promises);
    return subjectNames;
}

/*
 * Adds user information, including name and picture, to object parameter
 */
async function addFriendDisplayInformation(object, userId) {
    const newObject = object;
    await db.collection('users').doc(userId).get().then(async (doc) => {
        if (doc.exists && isValidUserDocument(doc.data())) {
            newObject.displayName = doc.data().displayName;
            newObject.picture = (doc.data().picture ? doc.data().picture : '');
        } else {
            throw new Error(`Error retrieving document for user ${userId}.`);
        }
    });
    return newObject;
}

/*
 * Retrieves friends for specified userId
 */
async function getFriends(userId) {
    const friendPromises = await db.collection('follows').where('followerId', '==', userId).get()
        .then(async (querySnapshot) => {
            const promises = [];
            querySnapshot.forEach(async (doc) => {
                const friendId = doc.data().followingId;
                const friend = {
                    userId: friendId,
                };
                promises.push(addFriendDisplayInformation(friend, friendId));
            });
            return Promise.all(promises);
        })
        .catch((error) => {
            throw new Error(`Error retrieving friends for user ${userId}: ${error}`);
        });
    return friendPromises;
}

/*
 * Retrieves following status for currentUser and otherUser
 */
async function getFollowingStatus(currentUser, otherUser) {
    let followStatus = {
        isFollowing: false,
    };
    await db.collection('follows').where('followerId', '==', currentUser).where('followingId', '==', otherUser).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                followStatus = {
                    isFollowing: true,
                    followId: doc.id,
                };
            });
        })
        .catch((error) => {
            throw new Error(`Error retrieving following relationship for user ${currentUser} and ${otherUser}: ${error}`);
        });
    return followStatus;
}

/*
 * Removes following document with specified followingId
 */
async function removeFollow(followId) {
    await db.collection('follows').doc(followId).delete().then(() => {
        console.log('Follow successfully deleted!');
    })
        .catch((error) => {
            throw new Error(`Unable to unadd the user as a friend at this time: ${error}.`);
        });
}

/*
 * Adds a following document with followerId = currentUser and
 * followingId = otherUser
 */
async function addFollow(currentUser, otherUser) {
    let followId = '';
    await db.collection('follows').add({
        followingId: otherUser,
        followerId: currentUser,
    })
        .then((docRef) => {
            followId = docRef.id;
        })
        .catch((error) => {
            throw new Error(`Unable to add user as a friend at this time: ${error}.`);
        });
    return followId;
}

/*
 * Adds course information for courseId to reaction object
 */
async function addCourseToReaction(reaction, courseId) {
    const newReaction = reaction;
    await db.collection('courses').doc(courseId).get().then(async (doc) => {
        if (doc.exists && isValidCourseDocument(doc.data())) {
            newReaction.course = {
                title: doc.data().title,
                catalogNumber: doc.data().catalogNumber,
                subjectCode: doc.data().subjectCode,
                courseId,
            };
        } else if (!doc.exists) {
            throw new Error(`Error retrieving document for course ${courseId} for reaction ${reaction.reactionId}.`);
        } else {
            throw new Error(`BAD JSON DATA: Unable to load course document ${doc.id} due to invalid JSON data.`);
        }
    });
    return newReaction;
}

/*
 * Retrieves map of friends with userId as the key and user object as the value
 */
async function getFriendsMap(userId) {
    const friends = {};
    await db.collection('follows').where('followerId', '==', userId).get()
        .then(async (querySnapshot) => {
            const promises = [];
            querySnapshot.forEach(async (doc) => {
                const friendId = doc.data().followingId;
                const friend = {
                    userId: friendId,
                };
                const friendPromise = addFriendDisplayInformation(friend, friendId);
                promises.push(friendPromise);
                friends[friendId] = await friendPromise;
            });
            return Promise.all(promises);
        })
        .catch((error) => {
            throw new Error(`Error retrieving friends for user ${userId}: ${error}`);
        });
    return friends;
}

/*
 * Retrieves reactions for userId
 */
async function getFriendsReactions(userId) {
    const friends = await getFriendsMap(userId);
    const friendUserIds = Object.getOwnPropertyNames(friends);
    let allReactions = [];
    if (friendUserIds.length > 0) {
        for await (const friendId of friendUserIds) {
            const reactions = await db.collection('reactions').where('userId', '==', friendId).get()
                .then(async (querySnapshot) => {
                    const promises = [];
                    querySnapshot.forEach((doc) => {
                        if (isValidReactionDocument(doc.data())) {
                            if (doc.data().like || doc.data().dislike || doc.data().wishlist) {
                                const user = friends[doc.data().userId];
                                const dateInMillis = doc.data().date.seconds * 1000;
                                const date = new Date(dateInMillis);
                                const reaction = {
                                    reactionId: doc.id,
                                    date,
                                    user,
                                };
                                if (doc.data().like) {
                                    reaction.type = 'like';
                                } else if (doc.data().dislike) {
                                    reaction.type = 'dislike';
                                } else {
                                    reaction.type = 'wishlist';
                                }
                                promises.push(addCourseToReaction(reaction, doc.data().courseId));
                            }
                        }
                    });
                    const ret = await Promise.all(promises);
                    return ret;
                })
                .catch((error) => {
                    throw new Error(`Error retrieving reaction friends of ${userId}: ${error}`);
                });
            allReactions = allReactions.concat(reactions);
        }
    }
    allReactions.sort(compareReactions);
    const formattedReactions = allReactions.map((reaction) => getReactionWithDateString(reaction));
    return formattedReactions;
}

/*
 * Retrieves numResults courses starting at title specified by start
 */
async function getCourses(start, numResults) {
    const courses = [];
    let totalCourses = 0;
    let lastValue = '';
    await db.collection('courses').orderBy('title').startAfter(start).limit(numResults)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (isValidCourseDocument(doc.data())) {
                    const course = {
                        courseId: doc.data().courseId,
                        title: doc.data().title,
                        catalogNumber: doc.data().catalogNumber,
                        subjectCode: doc.data().subjectCode,
                    };
                    courses.push(course);
                    lastValue = doc.data().title;
                }
            });
        })
        .catch((error) => {
            throw new Error(`Error retrieving courses starting at index ${start}: ${error}`);
        });
    await db.collection('courses').get().then((snap) => {
        totalCourses = snap.size;
    });
    return {
        results: courses,
        totalResults: totalCourses,
        lastValue,
    };
}

/*
 * Retrieves numResults subjects starting at subjectName specified by start
 */
async function getSubjects(start, numResults) {
    const subjects = [];
    let totalSubjects = 0;
    let lastValue = '';
    await db.collection('subjects').orderBy('name').startAfter(start).limit(numResults)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (isValidSubjectDocument(doc.data())) {
                    const subject = {
                        code: doc.data().code,
                        name: doc.data().name,
                    };
                    subjects.push(subject);
                    lastValue = doc.data().name;
                }
            });
        })
        .catch((error) => {
            throw new Error(`Error retrieving subjects starting at index ${start}: ${error}`);
        });
    await db.collection('subjects').get().then((snap) => {
        totalSubjects = snap.size;
    });
    return {
        results: subjects,
        totalResults: totalSubjects,
        lastValue,
    };
}

/*
 * Retrieves numResults users starting at displayName specified by start
 */
async function getUsers(start, numResults) {
    const users = [];
    let totalUsers = 0;
    let lastValue = '';
    await db.collection('users').orderBy('displayName').startAfter(start).limit(numResults)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (isValidUserDocument(doc.data()) && !doc.data().isAdmin) {
                    const user = {
                        userId: doc.data().userId,
                        displayName: doc.data().displayName,
                        picture: doc.data().picture,
                    };
                    users.push(user);
                    lastValue = doc.data().displayName;
                }
            });
        })
        .catch((error) => {
            throw new Error(`Error retrieving users starting at index ${start}: ${error}`);
        });
    await db.collection('users').where('isAdmin', '!=', true).get().then((snap) => {
        totalUsers = snap.size;
    });
    return {
        results: users,
        totalResults: totalUsers,
        lastValue,
    };
}

/*
 * Retrieves all user documents, with visits property
 */
async function getUsersForAdmin() {
    const users = [];
    let totalUsers = 0;
    await db.collection('users').orderBy('visits', 'desc').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (isValidUserDocument(doc.data()) && !doc.data().isAdmin) {
                    const user = {
                        userId: doc.data().userId,
                        displayName: doc.data().displayName,
                        picture: (doc.data().picture ? doc.data().picture : ''),
                        visits: doc.data().visits,
                    };
                    users.push(user);
                    totalUsers += 1;
                }
            });
        })
        .catch((error) => {
            throw new Error(`Error retrieving users for admin: ${error}`);
        });
    return {
        results: users,
        totalResults: totalUsers,
    };
}

/*
 * Retrieves all attributes
 */
async function getAttributes() {
    const attributes = [];
    let totalAttributes = 0;
    await db.collection('attributes').orderBy('name').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (isValidAttributeDocument(doc.data())) {
                    const attribute = {
                        name: doc.data().name,
                    };
                    attributes.push(attribute);
                    totalAttributes += 1;
                }
            });
        })
        .catch((error) => {
            throw new Error(`Error retrieving attributes: ${error}`);
        });
    return {
        results: attributes,
        totalResults: totalAttributes,
    };
}

/*
 * Retrieves courses for subject subjectCode with title containing search term
 */
async function getFilteredCoursesForSubject(subjectCode, search) {
    const courses = [];
    let lastCourse = '';
    let totalCourses = 0;
    await db.collection('courses').where('subjectCode', '==', subjectCode).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const { title } = doc.data();
                if (isValidCourseDocument(doc.data())
                    && title.toLowerCase().includes(
                        search.toLowerCase(),
                    )) {
                    const course = {
                        courseId: doc.data().courseId,
                        title,
                        catalogNumber: doc.data().catalogNumber,
                        subjectCode: doc.data().subjectCode,
                    };
                    courses.push(course);
                    totalCourses += 1;
                    lastCourse = title;
                }
            });
        })
        .catch((error) => {
            throw new Error(`Error retrieving courses for ${subjectCode} with search term '${search}': ${error}`);
        });
    return {
        results: courses,
        totalResults: totalCourses,
        lastValue: lastCourse,
    };
}

/*
 * Retrieves courses for attribute with title containing search term
 */
async function getFilteredCoursesForAttribute(attribute, search) {
    const courses = [];
    let lastCourse = '';
    let totalCourses = 0;
    await db.collection('courses').where('courseCodes', 'array-contains', attribute).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const { title } = doc.data();
                if (isValidCourseDocument(doc.data())
                && title.toLowerCase().includes(search.toLowerCase())) {
                    const course = {
                        courseId: doc.data().courseId,
                        title,
                        catalogNumber: doc.data().catalogNumber,
                        subjectCode: doc.data().subjectCode,
                    };
                    courses.push(course);
                    totalCourses += 1;
                    lastCourse = title;
                }
            });
        })
        .catch((error) => {
            throw new Error(`Error retrieving courses for ${attribute} with search term '${search}': ${error}.`);
        });
    return {
        results: courses,
        totalResults: totalCourses,
        lastValue: lastCourse,
    };
}

/*
 * Retrieves subjects with name containing search term
 */
async function getFilteredSubjects(search) {
    const subjects = [];
    let lastValue = '';
    await db.collection('subjects').orderBy('name').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const { name } = doc.data();
                if (isValidSubjectDocument(doc.data())
                && name.toLowerCase().includes(search.toLowerCase())) {
                    const subject = {
                        code: doc.data().code,
                        name: doc.data().name,
                    };
                    subjects.push(subject);
                    lastValue = doc.data().name;
                }
            });
        })
        .catch((error) => {
            throw new Error(
                `Error retrieving subjects matching search term '${search}': ${error}`,
            );
        });
    return {
        results: subjects,
        totalResults: subjects.length,
        lastValue,
    };
}

/*
 * Retrieves users with name containing search term
 */
async function getFilteredUsers(search) {
    const users = [];
    let lastValue = '';
    await db.collection('users').orderBy('displayName').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const name = doc.data().displayName;
                if (isValidUserDocument(doc.data())
                && !doc.data().isAdmin
                && name.toLowerCase().includes(search.toLowerCase())) {
                    const user = {
                        userId: doc.data().userId,
                        displayName: name,
                        picture: doc.data().picture,
                    };
                    users.push(user);
                    lastValue = name;
                }
            });
        })
        .catch((error) => {
            throw new Error(`Error retrieving users matching search term '${search}': ${error}`);
        });
    return {
        results: users,
        totalResults: users.length,
        lastValue,
    };
}

/*
 * Retrieves attributes with name containing search term
 */
async function getFilteredAttributes(search) {
    const attributes = [];
    let totalAttributes = 0;
    await db.collection('attributes').orderBy('name').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const attrName = doc.data().name;
                if (isValidAttributeDocument(doc.data())
                && (attrName.toLowerCase()).includes(search.toLowerCase())) {
                    const attribute = {
                        name: attrName,
                    };
                    attributes.push(attribute);
                    totalAttributes += 1;
                }
            });
        })
        .catch((error) => {
            throw new Error(`Error retrieving attributes matching search term '${search}': ${error}`);
        });
    return {
        results: attributes,
        totalResults: totalAttributes,
    };
}

/*
 * Retrieves all subject documents
 */
async function getAllSubjects() {
    const subjects = [];
    await db.collection('subjects').orderBy('name').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if (isValidSubjectDocument(doc.data())) {
                    const subject = {
                        code: doc.data().code,
                        name: doc.data().name,
                    };
                    subjects.push(subject);
                }
            });
        })
        .catch((error) => {
            throw new Error(`Error retrieving all subjects from Firebase: ${error}`);
        });
    return subjects;
}

/*
 * Retrieves all documents in collection specified
 */
async function getCollection(name) {
    const documents = [];
    await db.collection(name).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                documents.push(doc.data());
            });
        })
        .catch((error) => {
            throw new Error(`Error retrieving all documents from collection ${name}: ${error}`);
        });
    return documents;
}

// Functions to preload the database with synthetic data
/*
async function preloadUsersCollection() {
    const users = [
        {
            userId: 'exFollowingID3',
            displayName: 'Mack Riley',
            picture: 'https://st3.depositphotos.com/3591429/19002/i/1600/depositphotos_190024836-stock-photo-illustrated-mature-man-casual-wear.jpg',
            email: 'mack@duke.edu',
            majors: ['AEROSCI'],
            minors: ['ARTSVIS'],
            certificates: ['BRAINSOC'],
            subjects: ['CEE', 'BME', 'BIOCHEM', 'VMS'],
        },
        {
            userId: 'exFollowingID4',
            displayName: 'Billy Joe',
            picture: 'https://st.depositphotos.com/2218212/2938/i/950/depositphotos_29387653-stock-photo-facebook-profile.jpg',
            email: 'billy@duke.edu',
            majors: ['ARTS&SCI'],
            minors: ['MUSIC'],
            certificates: ['DECSCI'],
            subjects: ['RELIGION', 'SUSTAIN', 'ROMST', 'SANSKIRT'],
        },
        {
            userId: 'exFollowingID5',
            displayName: 'Lily S.',
            picture: 'https://st.depositphotos.com/2208320/1871/v/950/depositphotos_18717899-stock-illustration-cute-green-face-vector-illustration.jpg',
            email: 'lily@duke.edu',
            majors: ['GLHLTH'],
            minors: ['IMMUNOL'],
            certificates: ['I&E'],
            subjects: ['EVANTH', 'ENGLISH', 'ETHICS'],
        },
        {
            userId: 'exFollowingID6',
            displayName: 'J.J Rowlings',
            picture: 'https://st.depositphotos.com/2218212/2938/i/950/depositphotos_29387653-stock-photo-facebook-profile.jpg',
            email: 'jj@duke.edu',
            majors: ['CHEM'],
            minors: ['CREOLE'],
            certificates: [],
            subjects: ['DANCE', 'ECE', 'DECSCI'],
        },
    ];
    users.forEach(async (user) => {
        await db.collection('users').doc(user.userId).set(user).then(() => {
            console.log('Document successfully written!');
        })
            .catch((error) => {
                console.log(`${error}for${user.userId}`);
            });
    });
}

async function preloadFollowsCollection() {
    const follows = [
        {
            followerId: 'testId',
            followingId: 'exFollowingID1',
        },
        {
            followerId: 'testId',
            followingId: 'exFollowingID2',
        },
        {
            followerId: 'testId',
            followingId: 'exFollowingID3',
        },
        {
            followerId: 'testId',
            followingId: 'exFollowingID4',
        },
        {
            followerId: 'testId',
            followingId: 'exFollowingID5',
        },
        {
            followerId: 'testId',
            followingId: 'exFollowingID6',
        },
        {
            followerId: 'exFollowingID1',
            followingId: 'testId',
        },
        {
            followerId: 'exFollowingID2',
            followingId: 'testId',
        },
        {
            followerId: 'exFollowingID3',
            followingId: 'testId',
        },
        {
            followerId: 'exFollowingID4',
            followingId: 'testId',
        },
        {
            followerId: 'exFollowingID5',
            followingId: 'testId',
        },
        {
            followerId: 'exFollowingID6',
            followingId: 'testId',
        },
        {
            followerId: 'exFollowingID1',
            followingId: 'exFollowingID16',
        },
        {
            followerId: 'exFollowingID2',
            followingId: 'exFollowingID1',
        },
        {
            followerId: 'exFollowingID3',
            followingId: 'exFollowingID2',
        },
        {
            followerId: 'exFollowingID4',
            followingId: 'exFollowingID3',
        },
        {
            followerId: 'exFollowingID5',
            followingId: 'exFollowingID4',
        },
        {
            followerId: 'exFollowingID6',
            followingId: 'exFollowingID5',
        },
    ];
    follows.forEach(async (follow) => {
        await db.collection('follows').doc().set(follow).then(() => {
            console.log('Document successfully written!');
        })
            .catch((error) => {
                console.log(`${error}for${follow}`);
            });
    });
}
*/

exports.getUser = getUser;
exports.getFriends = getFriends;
exports.getReactions = getReactions;
exports.getCommentsForReaction = getCommentsForReaction;
exports.deleteComment = deleteComment;
exports.getFriendsReactions = getFriendsReactions;
exports.getCoursesForSubject = getCoursesForSubject;
exports.getCoursesForAttribute = getCoursesForAttribute;
exports.getCourseInformation = getCourseInformation;
exports.getUserInteraction = getUserInteraction;
exports.updateReaction = updateReaction;
exports.updateRating = updateRating;
exports.getCommentsForCourse = getCommentsForCourse;
exports.addNewComment = addNewComment;
exports.getUserSubjects = getUserSubjects;
exports.updateUserSubjects = updateUserSubjects;
exports.getSubjectNames = getSubjectNames;
exports.getFollowingStatus = getFollowingStatus;
exports.removeFollow = removeFollow;
exports.addFollow = addFollow;
exports.getCourses = getCourses;
exports.getSubjects = getSubjects;
exports.getAttributes = getAttributes;
exports.getUsers = getUsers;
exports.getFilteredCoursesForSubject = getFilteredCoursesForSubject;
exports.getFilteredCoursesForAttribute = getFilteredCoursesForAttribute;
exports.getFilteredSubjects = getFilteredSubjects;
exports.getFilteredAttributes = getFilteredAttributes;
exports.getFilteredUsers = getFilteredUsers;
exports.getAllSubjects = getAllSubjects;
exports.createUserDocument = createUserDocument;
exports.increaseVisit = increaseVisit;
exports.getUsersForAdmin = getUsersForAdmin;
exports.getCollection = getCollection;
