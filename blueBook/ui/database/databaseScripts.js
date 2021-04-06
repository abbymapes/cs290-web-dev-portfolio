/* eslint-disable */
/*
 * This represents the code to load firebase with data from Duke's API.
 *
 * @author Abby Mapes
 */

//const firebase = require('firebase');
const firebase = require('firebase/app');
require('firebase/firestore');
const fetch = require('node-fetch');
const { subjects } = require('./subjects');
const { DUKE_API } = require('../src/secrets/secrets');

exports.subjectsCollection = addSubjectsToFirestore;
exports.classesCollection = addCoursesToFirestore;

async function addCoursesToFirestore () {
    let subjectCodes = [];
    subjects.forEach((subject) => {
        const subjectId = subject.split(' - ')[0];
        subjectCodes.push(subjectId);
    });
    await fetch(`http://localhost:3000/api/loadCourses`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subjectCodes)
    });
}

/*
 * Adds each subject in subjects array to Firestore
 */
async function addSubjectsToFirestore() {
    subjects.forEach(async (subject) => {
        const subjectName = subject.split(' - ')[1];
        const subjectId = subject.split(' - ')[0];
        const data = {
            name: subjectName,
            code: subjectId,
        };
        console.log(data);
        const res = await dataBase.collection('subjects').doc(subjectId).set(data);
    });
}
