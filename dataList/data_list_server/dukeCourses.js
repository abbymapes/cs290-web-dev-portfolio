/*
 * This represents the code to fetch courses from Duke's catalog API.
 *
 * @author Abby Mapes
 */

exports.fetchSubjects = fetchSubjects;
exports.fetchCoursesForSubjects = fetchCoursesForSubjects;
exports.fetchCourseInfo = fetchCourseInfo;

const apiInformation = require('./dukeAPI.js');
const apiSecrets = require('./secrets.js');
const fetch = require("node-fetch");

let subjects = apiInformation.subjects;
let API_BASE = apiInformation.API_BASE;
let accessToken = apiSecrets.accessToken;

/*
 * Fetches courses from Duke's Catalog API for each subjectCode in parameter subjects.
 * Returns a list of course objects for each course corresponding to the subjectCodes 
 * in subjects or throws an error otherwise.
 */
async function fetchCoursesForSubjects(subjects) {
	let courses = [];
	for (var subjectCode of subjects) {
    let response = await fetch (`${API_BASE}subject/${subjectCode}?access_token=${accessToken}`);
    let jsonData = await response.json();
    let results = jsonData.results || [jsonData];
    for (var result of results) {
      if (result.error) {
        throw new Error(`Duke Catalog API Error: ${jsonData.error}`);
      }
      let classes = [];
      if (validClassList(result)) {
          classes = result.ssr_get_courses_resp.course_search_result.subjects.subject.course_summaries.course_summary;
      }
      for (var crse of classes) {
        if (validCourseInfo(crse)) {
          let course = {};
          course.courseId = crse.crse_id;
          course.offerNumber = crse.crse_offer_nbr;
          course.catalogNumber = crse.catalog_nbr;
          course.title = crse.course_title_long;
          course.subjectName = crse.subject_lov_descr;
          course.subjectCode = subjectCode;
          courses.push(course);
        }
      }
    }
  }
  return courses;
}

/*
 * Fetches list of Subject objects for each subject in the list subjects. Each subject 
 * object has property text, which is equal to their subject name, and value, which is 
 * equal to their subject code
 */
function fetchSubjects () {
  let options = [];
  subjects.forEach(subject => {
    options.push({
      text: subject.split(' - ')[1],
      value: subject.split(' - ')[0]
    });
  });
  return options;
}

/*
 * Fetches course details for the specified course object from Duke's Catalog
 * API. Each course object has an offerNumber and a courseID that is used in the 
 * fetch request. Returns a course object with description, type, and courseCodes fields
 * and throws an error otherwise.
 */
async function fetchCourseInfo(course) {
  let response = await fetch(
		`${API_BASE}crse_id/${course.courseId}/crse_offer_nbr/${course.offerNumber}?access_token=${accessToken}`
	);
	let jsonData = await response.json();
	let results = jsonData.results || [jsonData];
  let validCourse = false;

  for (var result of results) {
    if (validCourseDetails(result)) {
      validCourse  = true;
      let courseInfo = result.ssr_get_course_offering_resp.course_offering_result.course_offering;
      // Optional values
      course.description = (courseInfo.descrlong ? courseInfo.descrlong : "");
      course.type = (courseInfo.acad_career_lov_descr ? courseInfo.acad_career_lov_descr : "");
      
      let codes = [];
      if (validCourseAttributes(courseInfo)) {
        let attributes = courseInfo.course_attributes.course_attribute;
        let numAttributes = attributes.length;
        if (numAttributes > 0) {
          codes = [];
          for (var attribute of attributes) {
            codes.push(attribute.crse_attr_value_lov_descr);
          }
        }
      course.courseCodes = codes;
      }
    }
  }
  if (!validCourse) {
    throw new Error(`Duke Catalog API Error: ${jsonData.error}`);
  } 
  return course;
}

/*
 * Returns true if the course from Duke Catalog API has the necessary properties to be 
 * included in the list 
 */
function validCourseInfo(crse) {
    return (crse.crse_id && crse.crse_offer_nbr && 
        crse.catalog_nbr &&
        crse.subject_lov_descr &&
        crse.course_title_long);
}

/*
 * Returns true if the course details from Duke Catalog API are valid
 */
function validCourseDetails(result) {
  return (result && result.ssr_get_course_offering_resp &&
      result.ssr_get_course_offering_resp.course_offering_result &&
      result.ssr_get_course_offering_resp.course_offering_result.course_offering);
}

/*
 * Returns true if the subject results parameter from Duke's Catalog API has a valid class list
 */
function validClassList(results) {
    return (results.ssr_get_courses_resp && 
            results.ssr_get_courses_resp.course_search_result &&
            results.ssr_get_courses_resp.course_search_result.subjects &&
            results.ssr_get_courses_resp.course_search_result.subjects.subject &&
            results.ssr_get_courses_resp.course_search_result.subjects.subject.course_summaries &&
            results.ssr_get_courses_resp.course_search_result.subjects.subject.course_summaries.course_summary);
}

/*
 * Returns true if the course from Duke's Catalog API has a valid class attributes
 */
function validCourseAttributes(courseInfo) {
  return (courseInfo.course_attributes && courseInfo.course_attributes.course_attribute);
}