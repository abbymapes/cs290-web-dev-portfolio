/*
 * This represents a server that provides JSON data when asked.
 *
 * @author Abby Mapes
 */
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dukeCourses = require('./dukeCourses.js');
const { reset } = require('nodemon');
const app = express();

// All courses that match specified subjects
let currentCourses = [];
// Courses from all courses that match specified subjects filtered by current filter / sorted by current sort selection
let filteredResults = [];
// Boolean indicating if current list being shown is filtered/sorted
let showingFilter = false;

// Static sorting options
const sortingOptions = [
  "Course Name (A-Z) - name-asc",
  "Course Name (Z-A) - name-desc",
  "Catalog Number (ascending) - num-asc",
  "Catalog Number (descending) - num-desc"
]

// Log all requests made to the server
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));

// Allow connections from anywhere
app.use(cors());
app.use(express.json());

/*
 * Fetches classes for specified subjects in request's body and sends back list of
 * class objects to display to the front end, or a JSON error object otherwise
 */
app.post('/api/getSubjects', async (req, res, next) => {
  try {
    let requestedSubjects = req.body;
    showingFilter = false;
    currentCourses = await dukeCourses.fetchCoursesForSubjects(requestedSubjects);
    let dataToSend = {
      classes: currentCourses.slice(0, 20),
      classCount: currentCourses.length
    }
    res.status(200);
    res.json(dataToSend);
  } catch (error) {
    console.log(error);
    // create error object with useful message
    const err = new Error('Error: Check server --- Duke Catalog API is currently unavailable to fetch courses for the selected subject.');
    // set status code to return with response
    err.status = 503;
    // forward error on to next middleware handler (the error handler defined below)
    next(err);
  }
});

/*
 * Apply requested filters and/or sorting criteria on currently displayed results 
 * (filters in body of post request). When doing so, we show filtered results, rather 
 * than all results
 */
app.post('/api/filterClasses', (req, res, next) => {
  if (!(req.body.filterBy || req.body.sortBy)) {
    // create error object with useful message
    const err = new Error('Error retrieving the requested filtered results. Please try again.');
    // set status code to return with response
    err.status = 400;
    // forward error on to next middleware handler (the error handler defined below)
    next(err);
    return;
  } else {
    let requestedFilters = req.body.filterBy;
    let sortBy = req.body.sortBy;
    showingFilter = true;
    filteredResults = [];
    // Note, by design of frontend, we only ever make this call if either a filter is 
    // selected or a sort by category is selected
    if (requestedFilters.length > 0) {
      // If a filter is selected, filter results by specified filtered
      for (course of currentCourses) {
        for (filter of requestedFilters) {
          let startRange = filter.split("-")[0];
          let catNum = (course.catalogNumber.split("-")[0].match(/\d/g)).join("");
          let courseNumber = Math.floor(catNum / 100) * 100;
          if (startRange == courseNumber) {
            filteredResults.push(course);
          }
        }
      }
    } else {
      // Appropriate results to filter are all classes (meaning, we must sort all classes)
      filteredResults = currentCourses;
    }
    if (sortBy.length > 0) {
      sortClasses(sortBy);
    }
    let dataToSend = {
      classes: filteredResults.slice(0, 20),
      classCount: filteredResults.length
    }
    res.status(200);
    res.json(dataToSend);
  }
});

/*
 * Clears filtered results and sends original data
 */
app.get('/api/clearFilter', async (req, res) => {
  filteredResults = [];
  showingFilter = false;
  let dataToSend = {
    classes: currentCourses.slice(0, 20),
    classCount: currentCourses.length
  }
  res.status(200);
  res.json(dataToSend);
});

/*
 * Clear classes results, including state: currentCourses, filteredResults, and showingFilter
 */
app.get('/api/clearClasses', async (req, res) => {
  currentCourses = [];
  filteredResults = [];
  showingFilter = false;
  res.status(200);
  res.json(currentCourses);
});

/*
 * Fetches classes to show in new page of results, based on the start index specified in body of 
 * Post request. If showingFilter is true, it shows new page of filteredResults. Otherwise, 
 * it shows new page of currentClasses
 */
app.get('/api/newResultPage', async (req, res, next) => {
  if (!(req.query.index)) {
    // create error object with useful message
    const err = new Error('Error retrieving the requested page of class results. Please try again.');
    // set status code to return with response
    err.status = 400;
    // forward error on to next middleware handler (the error handler defined below)
    next(err);
    return;
  } else {
    let startIndex = Number(req.query.index);
    let endIndex = startIndex + 20;
    let coursesToSend = (showingFilter ? filteredResults.slice(startIndex, endIndex) : currentCourses.slice(startIndex, endIndex));
    res.status(200);
    res.json(coursesToSend);
  }
});

/*
 * Fetches course information from Duke catalog API for the requested course in body of post request
 */
app.post('/api/getCourseInfo', async (req, res, next) => {
  try {
    let requestedCourse = req.body;
    let course = await dukeCourses.fetchCourseInfo(requestedCourse);
    res.status(200);
    res.json(course);
  } catch (error) {
    console.log(error);
    // create error object with useful message
    const err = new Error('Error: Check server --- Duke Catalog API is currently unavailable to fetch the details for the requested course:');
    // set status code to return with response
    err.status = 503;
    // forward error on to next middleware handler (the error handler defined below)
    next(err);
  }
});

/*
 * Fetches all Duke subjects to display in sidebar, so users can select them
 */
app.get('/api/subjects.json', (req, res) => {
  res.status(200);
  res.json(dukeCourses.fetchSubjects());
});

/*
 * Fetches categories to filter by based on the classes in the current list being displayed
 *
 * Returns list of relevant range categories based on the catalog numbers of the current course
 *    ex. if AAS 89S is a current course, then the categroy 0-99 will be an option to filter by
 *        if BIOLOGY 423S-01 is a current course, then cateogry 400-499 will be an option to filter by
 */
app.get('/api/getFilterCategories.json', (req, res) => {
  let filteringOptions = [];
  let numbers = [];
  currentCourses.forEach(course => {
    let catNum = (course.catalogNumber.split("-")[0].match(/\d/g)).join("");
    let courseNumber = Math.floor(catNum / 100) * 100;
    if (!numbers.includes(courseNumber)) {
      let option = {
        text: courseNumber + "-" + (courseNumber + 99),
        value: courseNumber + "-" + (courseNumber + 99)
      };
      filteringOptions.push(option);
      numbers.push(courseNumber);
    }
  });
  res.status(200);
  res.json(
    filteringOptions.sort((a, b) => {
      return a.value < b.value;
    })
  );
});

/*
 * Fetches options to sort list by, a constant variable
 */
app.get('/api/sortingOptions.json', (req, res) => {
  let options = [];
  sortingOptions.forEach(option => {
    options.push({
      text: option.split(" - ")[0],
      value: option.split(" - ")[1]
    });
  });
  res.status(200);
  res.json(options);
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

/*
 * Sorts classes based on sortBy parameter
 */
function sortClasses(sortBy) {
  if (sortBy == "name-asc") {
    filteredResults.sort(sortByNameAsc);
  } else if (sortBy == "name-desc") {
    filteredResults.sort(sortByNameDesc);
  } else if (sortBy == "num-asc") {
    filteredResults.sort(sortByNumAsc);
  } else {
    filteredResults.sort(sortByNumDesc);
  }
}

/*
 * Sorts class objects a and b by their title, in ascending order
 */
function sortByNameAsc(a, b) {
  var nameA = a.title.toUpperCase();
  var nameB = b.title.toUpperCase()
  return (nameA > nameB ? 1 : (nameA < nameB ? -1 : 0));
}

/*
 * Sorts class objects a and b by their title, in descending order
 */
function sortByNameDesc(a, b) {
  var nameA = a.title.toUpperCase();
  var nameB = b.title.toUpperCase()
  return (nameA < nameB ? 1 : (nameA > nameB ? -1 : 0));
}

/*
 * Sorts class objects a and b by their catalog number, in ascending order
 */
function sortByNumAsc(a, b) {
  var numA = a.catalogNumber.toUpperCase();
  var numB = b.catalogNumber.toUpperCase()
  return (numA > numB ? 1 : (numA < numB ? -1 : 0));
}

/*
 * Sorts class objects a and b by their catalog number, in descending order
 */
function sortByNumDesc(a, b) {
  var numA = a.catalogNumber.toUpperCase();
  var numB = b.catalogNumber.toUpperCase()
  return (numA < numB ? 1 : (numA > numB ? -1 : 0));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('App listening on port ' + PORT));



