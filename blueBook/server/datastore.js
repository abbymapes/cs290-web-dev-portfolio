/*
 * This represents the script that reads and writes to BlueBook's 
 * database in Firebase Firestore.
 *
 * @author Abby Mapes
 */

const admin = require('firebase-admin');

const serviceAccount = require('../ui/src/secrets/bluebook-153fe-firebase-adminsdk-slbd7-d46ac8681d.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();
exports.db = db;
exports.getUser = getUser;
exports.getFriends = getFriends;
exports.getReactions = getReactions;

async function getUser(uid) {
    let self = {
        uid: 'testId',
        displayName: "Abby Mapes",
        email: "acm103@duke.edu",
        picture: "https://st.depositphotos.com/2218212/2938/i/950/depositphotos_29387653-stock-photo-facebook-profile.jpg",
        majors: ['COMPSCI'],
        minors: [],
        certificates: ['ISS'],
        subjects: ['PSY', 'GSF', 'PHYSEDU', 'MATH']
      }
      let friend = {
          uid: 'exFollowingID1',
          displayName: "Claire Woodruff",
          email: "csw@duke.edu",
          picture: "https://st.depositphotos.com/2208320/1827/v/950/depositphotos_18271601-stock-illustration-vector-portrait-girl.jpg",
          majors: ['PSY', 'ITALIAN'],
          minors: ['FRENCH'],
          certificates: ['MMS'],
          subjects: ['SOC', 'STAT', 'LIT', 'AAS']
      }
    return (uid == self.uid ? self : friend);
}

async function getReactions(uid) {
    let selfReactions = {
        liked: [
            { title: "Duke-Administered Study Abroad: Special Topics in Computer Science", courseId: "002597", catalogNumber: "190A", subjectCode: "COMPSCI"},
            { title: "Indian Cinema", courseId: "000028", catalogNumber: "151", subjectCode: "AMES"},
            { title: "Topics in Modern Art", courseId: "000666", catalogNumber: "590-S", subjectCode: "ARTHIST"},
            { title: "Anatomy of the Limbs", courseId: "001367", catalogNumber: "731", subjectCode: "EVANTH"},
            { title: "Evolutionary Mechamisms", courseId: "001612", catalogNumber: "730", subjectCode: "BIOLOGY"}],
        disliked: [
            { title: "Public Finance", courseId: "003339", catalogNumber: "438", subjectCode: "ECON"},
            { title: "Independent Study", courseId: "002799", catalogNumber: "291", subjectCode: "CLST"},
            { title: "The Aegean Bronze Age", courseId: "002786", catalogNumber: "205", subjectCode: "ARTHIST"},
            { title: "Thermal Physics", courseId: "003637", catalogNumber: "363", subjectCode: "PHYSICS"},
            { title: "Studies in Old English Literature", courseId: "004034", catalogNumber: "730", subjectCode: "ENGLISH"}
        ],
        wishlist: [
            { title: "Plant Systemics Seminar", courseId: "001835", catalogNumber: "712S", subjectCode: "BIOLOGY"},
            { title: "First-Year Chinese II", courseId: "002406", catalogNumber: "102", subjectCode: "CHINESE"}
        ]
    }
    let friendReactions = {
        liked: [
            { title: "Thermal Physics", courseId: "003637", catalogNumber: "363", subjectCode: "PHYSICS"},
            { title: "Studies in Old English Literature", courseId: "004034", catalogNumber: "730", subjectCode: "ENGLISH"},
            { title: "Public Finance", courseId: "003339", catalogNumber: "438", subjectCode: "ECON"},
        ],
        disliked: [
            { title: "First-Year Chinese II", courseId: "002406", catalogNumber: "102", subjectCode: "CHINESE"},
            { title: "The Aegean Bronze Age", courseId: "002786", catalogNumber: "205", subjectCode: "ARTHIST"},
        ],
        wishlist: [
            { title: "Topics in Modern Art", courseId: "000666", catalogNumber: "590-S", subjectCode: "ARTHIST"},
            { title: "Anatomy of the Limbs", courseId: "001367", catalogNumber: "731", subjectCode: "EVANTH"},
            { title: "Evolutionary Mechamisms", courseId: "001612", catalogNumber: "730", subjectCode: "BIOLOGY"}
        ]
    }
    console.log(uid);
    return (uid == "testId" ? selfReactions : friendReactions);
}

async function getFriends(uid) {
    let selfFollowing = [
        {
          uid: "exFollowingID1",
          displayName: "Claire Woodruff",
          picture: "https://st.depositphotos.com/2208320/1827/v/950/depositphotos_18271601-stock-illustration-vector-portrait-girl.jpg"
        },
        {
          uid: "exFollowingID2",
          displayName: "John Smith",
          picture: "https://st.depositphotos.com/1898481/5087/i/950/depositphotos_50878063-stock-photo-people.jpg"
        },
        {
          uid: "exFollowingID3",
          displayName: "Mack Riley",
          picture: "https://st3.depositphotos.com/3591429/19002/i/1600/depositphotos_190024836-stock-photo-illustrated-mature-man-casual-wear.jpg"
        },
        {
          uid: "exFollowingID4",
          displayName: "Billy Joe",
          picture: "https://st.depositphotos.com/2218212/2938/i/950/depositphotos_29387653-stock-photo-facebook-profile.jpg"
        },
        {
          uid: "exFollowingID5",
          displayName: "Lily S.",
          picture: "https://st.depositphotos.com/2208320/1871/v/950/depositphotos_18717899-stock-illustration-cute-green-face-vector-illustration.jpg"
        },
        {
          uid: "exFollowingID6",
          displayName: "J.J Rowlings",
          picture: "https://st.depositphotos.com/2218212/2938/i/950/depositphotos_29387653-stock-photo-facebook-profile.jpg"
        }
    ]
    let friendFollowing = [
        {
          uid: "testId",
          displayName: "Abby Mapes",
          picture: "https://st.depositphotos.com/2218212/2938/i/950/depositphotos_29387653-stock-photo-facebook-profile.jpg",
        }
    ]
    return (uid == 'testId' ? selfFollowing : friendFollowing);
}
