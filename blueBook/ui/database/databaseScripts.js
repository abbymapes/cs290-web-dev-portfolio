/*
 * This represents the code to load firebase with data from Duke's API.
 *
 * @author Abby Mapes
 */

import userState from '../src/userState';

const fetch = require('node-fetch');
const { subjects } = require('../src/assets/subjects');

async function addCoursesToFirestore() {
    const subjectCodes = [];
    subjects.forEach((subject) => {
        const subjectId = subject.split(' - ')[0];
        subjectCodes.push(subjectId);
    });
    await fetch(`${userState.SERVER_URL}/bluebook/loadCourses`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(subjectCodes),
    });
}

exports.classesCollection = addCoursesToFirestore;
