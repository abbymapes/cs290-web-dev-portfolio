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

async function getCoursesForSubject(subjectCode) {
    const courses = [];
    await db.collection('courses').where('subjectCode', '==', subjectCode).orderBy('catalogNumber', 'asc').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                const course = {
                    courseId: doc.data().courseId,
                    title: doc.data().title,
                    catalogNumber: doc.data().catalogNumber,
                    subjectCode: doc.data().subjectCode,
                };
                courses.push(course);
            });
        })
        .catch((error) => {
            throw new Error(`Error retrieving courses for ${subjectCode}: ${error}`);
        });
    return courses;
}

async function getCoursesForAttribute(attribute) {
    const courses = [];
    await db.collection('courses').where('courseCodes', 'array-contains', attribute).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                const course = {
                    courseId: doc.data().courseId,
                    title: doc.data().title,
                    catalogNumber: doc.data().catalogNumber,
                    subjectCode: doc.data().subjectCode,
                };
                courses.push(course);
            });
        })
        .catch((error) => {
            throw new Error(`Error retrieving courses for ${attribute}: ${error}.`);
        });
    return courses;
}

async function getAverageRatings(courseId) {
    let difficultyCount = 0;
    let difficultySum = 0;
    let interestingCount = 0;
    let interestingSum = 0;
    await db.collection('ratings').where('courseId', '==', courseId).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                const interestingRating = doc.data().interesting;
                const difficultyRating = doc.data().difficulty;
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

async function getCourseInformation(courseId) {
    let course = {};
    await db.collection('courses').doc(courseId).get().then(async (doc) => {
        if (doc.exists) {
            course = doc.data();
            const ratings = await getAverageRatings(courseId);
            course.interesting = ratings.interesting;
            course.difficulty = ratings.difficulty;
        } else {
            // doc.data() will be undefined in this case
            throw new Error(`No such document in courses with ID: ${courseId}`);
        }
    })
        .catch((error) => {
            throw new Error(`Error retrieving document for course ${courseId}: ${error}`);
        });
    return course;
}

async function getUserInteraction(userId, courseId) {
    const interaction = {};
    const docId = userId + courseId;
    await db.collection('reactions').doc(docId).get().then((doc) => {
        if (doc.exists) {
            interaction.reaction = {
                like: doc.data().like,
                dislike: doc.data().dislike,
                wishlist: doc.data().wishlist,
            };
        } else {
            // doc.data() will be undefined in this case
            interaction.reaction = {
                like: false,
                dislike: false,
                wishlist: false,
            };
        }
    })
        .catch((error) => {
            throw new Error(`Error retrieving document for reaction for user ${userId} and course ${courseId}: ${error}`);
        });
    await db.collection('ratings').doc(docId).get().then((doc) => {
        if (doc.exists) {
            interaction.rating = {
                interesting: doc.data().interesting,
                difficulty: doc.data().difficulty,
            };
        } else {
            // doc.data() will be undefined in this case
            interaction.rating = {
                interesting: 0,
                difficulty: 0,
            };
        }
    })
        .catch((error) => {
            throw new Error(`Error retrieving document for ratings for user ${userId} and course ${courseId}: ${error}`);
        });
    return interaction;
}

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
                console.log('Document successfully written!');
            })
            .catch((error) => {
                throw new Error(`Unable to update reaction for course ${courseId}: ${error}.`);
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

async function updateRating(rating, userId, courseId) {
    const docId = userId + courseId;
    if (rating.difficulty === 0 && rating.interesting === 0) {
        await db.collection('ratings').doc(docId).delete().then(() => {
            console.log('Rating successfully deleted!');
        })
            .catch((error) => {
                throw new Error(`Unable to delete rating ${docId} for user ${userId} and course ${courseId}: ${error}.`);
            });
    } else {
        await db.collection('ratings').doc(docId).set({
            userId,
            courseId,
            difficulty: rating.difficulty,
            interesting: rating.interesting,
        })
            .then(() => {
                console.log('Document successfully written!');
            })
            .catch((error) => {
                throw new Error(`Unable to update rating for course ${courseId}: ${error}.`);
            });
    }
}

async function getCommentWithUser(comment, userId) {
    const newComment = comment;
    await db.collection('users').doc(userId).get().then(async (doc) => {
        if (doc.exists) {
            newComment.user = {
                userId,
                displayName: doc.data().displayName,
                picture: doc.data().picture,
            };
        } else {
            throw new Error(`Error retrieving document for user ${userId}.`);
        }
    })
        .catch((error) => {
            throw new Error(error);
        });
    return newComment;
}

async function getCommentsForReaction(reactionId) {
    try {
        const userPromises = await db.collection('comments').where('reactionId', '==', reactionId).orderBy('date', 'desc').get()
            .then(async (querySnapshot) => {
                const promises = [];
                querySnapshot.forEach(async (doc) => {
                    const comment = {
                        commentId: doc.id,
                        commentText: doc.data().commentText,
                    };
                    promises.push(getCommentWithUser(comment, doc.data().userId));
                });
                return Promise.all(promises);
            })
            .catch((error) => {
                throw new Error(`Error retrieving comments for reaction ${reactionId}: ${error}`);
            });
        return userPromises;
    } catch (error) {
        throw new Error(error);
    }
}

async function getCommentsForCourse(courseId) {
    try {
        const userPromises = await db.collection('comments').where('courseId', '==', courseId).orderBy('date', 'desc').get()
            .then(async (querySnapshot) => {
                const promises = [];
                querySnapshot.forEach(async (doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    const comment = {
                        commentId: doc.id,
                        commentText: doc.data().commentText,
                    };
                    promises.push(getCommentWithUser(comment, doc.data().userId));
                });
                return Promise.all(promises);
            })
            .catch((error) => {
                throw new Error(`Error retrieving comments for course ${courseId}: ${error}`);
            });
        return userPromises;
    } catch (error) {
        throw new Error(error);
    }
}

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
            throw new Error(`Unable to post comment for ${typeId}: ${error}.`);
        });
}

async function deleteComment(commentId) {
    await db.collection('comments').doc(commentId).delete().then(() => {
        console.log('Comment successfully deleted!');
    })
        .catch((error) => {
            throw new Error(`Unable to delete comment ${commentId}: ${error}.`);
        });
}

async function getUserSubjects(userId) {
    let subjects = {};
    await db.collection('users').doc(userId).get().then(async (doc) => {
        if (doc.exists) {
            subjects = {
                majors: doc.data().majors,
                minors: doc.data().minors,
                certificates: doc.data().certificates,
                subjects: doc.data().subjects,
            };
        } else {
            throw new Error(`Error retrieving subjects for user ${userId}.`);
        }
    })
        .catch((error) => {
            throw new Error(`Error retrieving subjects for user ${userId}: ${error}`);
        });
    return subjects;
}

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

async function getUser(userId) {
    let user = {};
    await db.collection('users').doc(userId).get().then(async (doc) => {
        if (doc.exists) {
            user = {
                userId: doc.data().userId,
                displayName: doc.data().displayName,
                picture: doc.data().picture,
                majors: doc.data().majors,
                minors: doc.data().minors,
                certificates: doc.data().certificates,
                subjects: doc.data().subjects,
            };
        } else {
            throw new Error(`Cannot find requested user ${userId}.`);
        }
    })
        .catch((error) => {
            throw new Error(`${error}`);
        });
    return user;
}

async function getCourseForReaction(reaction, courseId) {
    const newReaction = reaction;
    await db.collection('courses').doc(courseId).get().then(async (doc) => {
        if (doc.exists) {
            newReaction.title = doc.data().title;
            newReaction.catalogNumber = doc.data().catalogNumber;
            newReaction.subjectCode = doc.data().subjectCode;
        } else {
            throw new Error(`Error retrieving document for course ${courseId} for reaction ${newReaction.reactionId}.`);
        }
    })
        .catch((error) => {
            throw new Error(`Error retrieving document for course ${courseId}: ${error}`);
        });
    return newReaction;
}

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
                    // doc.data() is never undefined for query doc snapshots
                    if (doc.data().like || doc.data().dislike || doc.data().wishlist) {
                        const reaction = {
                            reactionId: doc.id,
                            courseId: doc.data().courseId,
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
                });
                liked = await Promise.all(likedPromises);
                disliked = await Promise.all(dislikedPromises);
                wishlist = await Promise.all(wishlistPromises);
                return {
                    liked,
                    disliked,
                    wishlist,
                };
            });
        return reactions;
    } catch (error) {
        throw new Error(`Error retrieving reactions for user ${userId}: ${error}`);
    }
}

async function addNameToSubject(subject) {
    const newSubject = subject;
    await db.collection('subjects').doc(subject.code).get().then(async (doc) => {
        if (doc.exists) {
            newSubject.name = doc.data().name;
        } else {
            throw new Error(`Error retrieving document for subject ${newSubject.code}.`);
        }
    })
        .catch((error) => {
            throw new Error(error);
        });
    return newSubject;
}

async function getSubjectNames(subjects) {
    try {
        const promises = [];
        await subjects.forEach(async (subject) => {
            promises.push(addNameToSubject(subject));
        });
        const subjectNames = await Promise.all(promises);
        return subjectNames;
    } catch (error) {
        throw new Error(error);
    }
}

async function addFriendDisplayInformation(object, userId) {
    const newObject = object;
    await db.collection('users').doc(userId).get().then(async (doc) => {
        if (doc.exists) {
            newObject.displayName = doc.data().displayName;
            newObject.picture = doc.data().picture;
        } else {
            throw new Error(`Error retrieving document for user ${userId}.`);
        }
    })
        .catch((error) => {
            throw new Error(error);
        });
    return newObject;
}

async function getFriends(userId) {
    try {
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
    } catch (error) {
        throw new Error(error);
    }
}

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

async function removeFollow(followId) {
    await db.collection('follows').doc(followId).delete().then(() => {
        console.log('Follow successfully deleted!');
    })
        .catch((error) => {
            throw new Error(`Unable to unadd the user as a friend at this time: ${error}.`);
        });
}

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

async function addCourseToReaction(reaction, courseId) {
    const newReaction = reaction;
    await db.collection('courses').doc(courseId).get().then(async (doc) => {
        if (doc.exists) {
            newReaction.course = {
                title: doc.data().title,
                catalogNumber: doc.data().catalogNumber,
                subjectCode: doc.data().subjectCode,
                courseId,
            };
        } else {
            throw new Error(`Error retrieving document for course ${courseId} for reaction ${reaction.reactionId}.`);
        }
    })
        .catch((error) => {
            throw new Error(`Error retrieving document for course ${courseId}: ${error}`);
        });
    return newReaction;
}

async function getFriendsMap(userId) {
    try {
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
    } catch (error) {
        throw new Error(error);
    }
}

async function getFriendsReactions(userId) {
    const friends = await getFriendsMap(userId);
    const friendUserIds = Object.getOwnPropertyNames(friends);
    if (friendUserIds.length > 0) {
        const reactions = await db.collection('reactions').where('userId', 'in', friendUserIds).orderBy('date', 'desc').get()
            .then(async (querySnapshot) => {
                const promises = [];
                querySnapshot.forEach((doc) => {
                    if (doc.data().like || doc.data().dislike || doc.data().wishlist) {
                        const user = friends[doc.data().userId];
                        const reaction = {
                            reactionId: doc.id,
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
                });
                const ret = await Promise.all(promises);
                return ret;
            })
            .catch((error) => {
                throw new Error(`Error retrieving reaction friends of ${userId}: ${error}`);
            });
        return reactions;
    }
    return [];
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

exports.db = db;
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
