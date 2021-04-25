/*
 * This represents the code to load firebase with data from Duke's API.
 *
 * @author Abby Mapes
 */

const fetch = require('node-fetch');
const { DUKE_API } = require('./secrets/secrets');

const { URL_BASE } = DUKE_API;
const { API_KEY } = DUKE_API;

const allAttributes = [];
const allAttributeCodes = [];

/*
  * Returns true if the course from Duke Catalog API has the necessary properties to be
  * included in the list
  */
function validCourseInfo(crse) {
    return (crse.crse_id && crse.crse_offer_nbr
        && crse.catalog_nbr
        && crse.subject_lov_descr
        && crse.course_title_long);
}

/*
  * Returns true if the subject results parameter from Duke's Catalog API has a valid class list
  */
function validClassList(results) {
    const res = results.ssr_get_courses_resp;
    return (res
            && res.course_search_result
            && res.course_search_result.subjects
            && res.course_search_result.subjects.subject
            && res.course_search_result.subjects.subject.course_summaries
            && res.course_search_result.subjects.subject.course_summaries.course_summary);
}

/*
  * Returns true if the course from Duke's Catalog API has a valid class attributes
  */
function validCourseAttributes(courseInfo) {
    return (courseInfo.course_attributes && courseInfo.course_attributes.course_attribute);
}

/*
  * Returns true if the course details from Duke Catalog API are valid
  */
function validCourseDetails(result) {
    return (result && result.ssr_get_course_offering_resp
      && result.ssr_get_course_offering_resp.course_offering_result
      && result.ssr_get_course_offering_resp.course_offering_result.course_offering);
}

/*
  * Fetches course details for the specified course object from Duke's Catalog
  * API. Each course object has an offerNumber and a courseID that is used in the
  * fetch request. Returns a course object with description, type, and courseCodes fields
  * and throws an error otherwise.
  */
async function fetchCourseInfo(crse) {
    const course = crse;
    const response = await fetch(
        `${URL_BASE}crse_id/${course.courseId}/crse_offer_nbr/${course.offerNumber}?access_token=${API_KEY}`,
    );
    const jsonData = await response.json();
    const results = jsonData.results || [jsonData];
    let validCourse = false;

    results.forEach(async (result) => {
        if (validCourseDetails(result)) {
            validCourse = true;
            const res = result.ssr_get_course_offering_resp.course_offering_result;
            const courseInfo = res.course_offering;
            // Optional values
            try {
                course.description = (courseInfo.descrlong ? courseInfo.descrlong : '');
                course.type = (courseInfo.acad_career_lov_descr ? courseInfo.acad_career_lov_descr : '');

                const codes = [];
                if (validCourseAttributes(courseInfo)) {
                    const attributes = courseInfo.course_attributes.course_attribute;
                    const numAttributes = attributes.length;
                    if (numAttributes > 0) {
                        attributes.forEach(async (attribute) => {
                            const attributeString = attribute.crse_attr_value_lov_descr;
                            if (attributeString.includes(') ')) {
                                const code = attributeString.split(') ')[0].substring(1);
                                codes.push(attributeString);
                                if (!allAttributeCodes.includes(code)) {
                                    allAttributeCodes.push(code);
                                    allAttributes.push({
                                        id: code,
                                        name: attributeString,
                                    });
                                }
                            }
                        });
                    }
                }
                course.courseCodes = codes;
            } catch (error) {
                console.log(`ERROR FOR: ${course.title}`);
                validCourse = false;
            }
        }
    });
    if (!validCourse) {
        return null;
        // throw new Error(`Duke Catalog API Error: ${jsonData.error}`);
    }
    return course;
}

/*
 * Adds all courses to Firebase.
 */
async function addAllCoursesToFirebase(courses, db) {
    courses.forEach(async (course) => {
        const { courseId } = course;
        db.collection('courses').doc(courseId).set(course).then(() => {
            console.log('Document written with ID: ', courseId);
        })
            .catch(() => {
                console.error('Error adding document: ', courseId);
            });
    });
    allAttributes.forEach(async (attribute) => {
        const { id } = attribute;
        const data = {
            name: attribute.name,
        };
        db.collection('attributes').doc(id).set(data).then(() => {
            console.log('Document written with ID: ', id);
        })
            .catch(() => {
                console.error('Error adding document: ', id);
            });
    });
}

/*
 * Fetches courses from Duke's Catalog API for each subjectCode in parameter subjects.
 * Returns a list of course objects for each course corresponding to the subjectCodes
 * in subjects or throws an error otherwise.
 */
async function fetchCoursesForSubjects(subjects, db) {
    const courses = [];
    const courseIds = [];
    const subjectsNoClasses = [];
    subjects.forEach(async (subjectCode) => {
        try {
            const response = await fetch(`${URL_BASE}subject/${subjectCode}?access_token=${API_KEY}`);
            const jsonData = await response.json();
            const results = jsonData.results || [jsonData];
            results.forEach(async (result) => {
                if (result.error) {
                    throw new Error(`Duke Catalog API Error: ${jsonData.error}`);
                }
                let classes = [];
                if (validClassList(result)) {
                    const res = result.ssr_get_courses_resp.course_search_result;
                    classes = res.subjects.subject.course_summaries.course_summary;
                }
                classes.forEach(async (crse) => {
                    if (validCourseInfo(crse)) {
                        const course = {};
                        course.courseId = crse.crse_id;
                        course.offerNumber = Number(crse.crse_offer_nbr.trim());
                        course.catalogNumber = crse.catalog_nbr.trim();
                        course.title = crse.course_title_long.trim();
                        course.subjectName = crse.subject_lov_descr.trim();
                        course.subjectCode = subjectCode.trim();
                        course.interesting = {
                            ratingCount: 0,
                            ratingSum: 0,
                        };
                        course.difficulty = {
                            ratingCount: 0,
                            ratingSum: 0,
                        };
                        const newCourse = await fetchCourseInfo(course);
                        if (newCourse) {
                            if (!courseIds.includes(newCourse.courseId)) {
                                console.log(newCourse);
                                courses.push(newCourse);
                                courseIds.push(newCourse.courseId);
                            }
                        }
                    }
                });
            });
        } catch (error) {
            subjectsNoClasses.push(subjectCode);
        }
    });
    await addAllCoursesToFirebase(courses, db);
    return courses;
}

exports.fetchCoursesForSubjects = fetchCoursesForSubjects;
