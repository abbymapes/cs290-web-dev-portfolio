/*
 *  The JavaScript file containing the testing for Bluebook.
 *
 * @author Abby Mapes
 */

const fetch = require('node-fetch');
const App = require('../pageobjects/app.page');

describe('Vue.js app', () => {
    /*
     * Generic test for opening and rendering
     */
    it('Should open and Render', () => {
        App.open();
        if (App.signOutButton.isExisting()) {
            App.clickSignOutButton();
        }
        // Check that App opens to Explore page
        expect(App.pageName).toHaveTextContaining('Explore');
    });

    /*
     * 1 Front-End Display Test: Verifies my code displays the backend's course JSON data
     * correctly by checking the appropriate HTML elements are displayed when a Guest account
     * clicks on the first class for subject 'Aerospace Studies-AFROTC'
     */
    it('Should display proper course page for a guest user', () => {
        App.open();
        if (App.signOutButton.isExisting()) {
            App.clickSignOutButton();
        }
        // Wait for explore page to load
        browser.waitUntil(
            () => App.waterFall.isExisting(),
            {
                timeout: 5000,
                timeoutMsg: 'expected page to load within 5 seconds',
            },
        );
        // Click first subject, 'Aerospace Studies-AFROTC'
        App.clickFirstWaterfallItem();

        // Wait for subject page to load
        browser.waitUntil(
            () => App.pageName.isExisting() && App.waterFall.isExisting(),
            {
                timeout: 5000,
                timeoutMsg: 'expected page to load within 5 seconds',
            },
        );
        expect(App.pageName).toHaveTextContaining('Aerospace Studies-AFROTC');

        // Click first course, 'Heritage and Values of the United States Air Force'
        App.clickFirstWaterfallItem();
        browser.waitUntil(
            () => App.pageName.isExisting(),
            {
                timeout: 5000,
                timeoutMsg: 'expected page to load within 5 seconds',
            },
        );
        // Check that correct course page is displayed
        expect(App.pageName === 'Heritage and Values of the United States Air Force');
        expect(App.catalogName === 'AEROSCI 102');

        // Ensure that no reaction section is displayed for a guest, since
        // they can't like, dislike, or add courses to their wishlist
        expect(!App.reactionSection.isExisting());

        // Check that interesting and difficulty labels exist
        expect(App.interestingLabel.isExisting());
        expect(App.difficultyLabel.isExisting());

        // Check that description displayed is correct for the course
        expect(App.descriptionHeader.isExisting());
        expect(App.description === 'Continuation of Aerospace Studies 101. A survey course designed to introduce students to the United States Air Force and provides an overview of the basic characteristics, missions, and organization of the Air Force. Leadership Laboratory mandatory for AFROTC cadets. Instructor consent required. Instructor: Staff');

        // Check that course attribute section is present and
        // is empty, since the course has no attributes in it
        expect(App.attributeHeader.isExisting());
        expect(App.emptyAttributeSection.isExisting());

        // Ensure that no rating section is displayed for a guest, since
        // they rate courses
        expect(!App.ratingSection.isExisting());

        // Check that comments section is displayed
        expect(App.commentHeader.isExisting());
        expect(App.commentSection.isExisting());
    });

    /*
     * 4 Front-End Tests to verify my code works as intended by simulating common
     * user "actions" and testing that the GUI responds appropriately
     */

    /*
     * User Action Test 1: Test that when a guest changes the page via the navigation bar,
     * that the appropriate pages are displayed: including, explore, sign up, and log in.
     */
    it('Should update pages for guest when clicking on pages in the nav bar', () => {
        App.open();
        expect(App.pageName).toHaveTextContaining('Explore', { wait: 5000 });

        // Click Sign Up Page
        App.clickSignUpPage();
        expect(App.pageName).toHaveTextContaining('Sign Up', { wait: 5000 });

        // Click Log In Page
        App.clickLoginPage();
        expect(App.pageName).toHaveTextContaining('Log In', { wait: 5000 });

        // Click Explore Page
        App.clickExplorePage();
        expect(App.pageName).toHaveTextContaining('Explore', { wait: 5000 });
    });

    /*
     * User Action Test 2: Tests whether selecting an attribute item under
     * the attribute section of the explore page takes the user to the correct
     * attribute page, in this case: whether clicking the first attribute
     * takes the user to the '(ALP) Arts, Literature & Performance' page
     */
    it('Should select proper attribute page', () => {
        App.open();
        if (App.signOutButton.isExisting()) {
            App.clickSignOutButton();
        }
        browser.waitUntil(
            () => App.attributeLink.isExisting(),
            {
                timeout: 5000,
                timeoutMsg: 'expected page to load within 5 seconds',
            },
        );
        App.clickAttributesSection();
        browser.waitUntil(
            () => App.waterFall.isExisting(),
            {
                timeout: 5000,
                timeoutMsg: 'expected page to load within 5 seconds',
            },
        );
        App.clickFirstWaterfallItem();
        expect(App.pageName).toHaveTextContaining('(ALP) Arts, Literature & Performance', {
            wait: 5000,
        });
    });

    /*
     * User Action Test 3: Test that admin user Joe Smith can log into
     * account successfully. When an admin logs in, test that GUI takes user
     * to the admin page and updates the Nav Bar to reflect a 'Admin Nav Bar.'
     * Ensure that on the admin page, the 'Sign Out' button is displayed.
     */
    it('Should take admin user Joe Smith to the admin page', () => {
        App.open();
        if (App.signOutButton.isExisting()) {
            App.clickSignOutButton();
        }

        App.clickLoginPage();
        App.clickLogInButton();

        browser.waitUntil(
            () => App.signOutButton.isExisting(),
            {
                timeout: 20000,
                timeoutMsg: 'expected user to log in within 20s',
            },
        );
        // Wait for admin Joe Smith to log in
        // NOTE: this part has to be achieved manually, since we don't want to save
        // usernames and passwords in source code
        expect(App.pageName).toHaveTextContaining('Joe Smith');
        expect(!App.explore.isExisting());
        expect(!App.logIn.isExisting());
        expect(!App.signUp.isExisting());
        expect(!App.feed.isExisting());
        expect(!App.profile.isExisting());
        expect(App.admin.isExisting());
        // Check that user is on their own profile
        App.clickSignOutButton();

        browser.waitUntil(
            () => App.pageName.isExisting(),
            {
                timeout: 5000,
                timeoutMsg: 'expected page to sign user out within 5s',
            },
        );
        // verify that the user is taken to Explore page when logging out
        expect(App.pageName === 'Explore');
        // Check that the nav bar is a 'Guest Nav Bar'
        expect(App.explore.isExisting());
        expect(App.logIn.isExisting());
        expect(App.signUp.isExisting());
        expect(!App.feed.isExisting());
        expect(!App.profile.isExisting());
        expect(!App.admin.isExisting());
    });

    /*
     * User Action Test 4: Test that existing user Abby Mapes can log into
     * account successfully. When a user logs in, test that GUI takes user
     * to their user page and updates the Nav Bar to reflect a 'User Nav Bar.'
     * Ensure that on their own user page, the 'Sign Out' button is displayed.
     * Test that when logging out, the user is taken back to the Explore page
     * and the Nav Bar reflects a 'Guest Nav Bar'.
     */
    it('Should allow user Abby Mapes to log in', () => {
        App.open();
        if (App.signOutButton.isExisting()) {
            App.clickSignOutButton();
        }
        // Check that the nav bar is a 'Guest Nav Bar'
        expect(App.explore.isExisting());
        expect(App.logIn.isExisting());
        expect(App.signUp.isExisting());
        expect(!App.feed.isExisting());
        expect(!App.profile.isExisting());
        expect(!App.admin.isExisting());

        App.clickLoginPage();
        // Wait for user to log in as Abby Mapes
        // NOTE: this part has to be achieved manually, since we don't want to save
        // usernames and passwords in source code
        App.clickLogInButton();

        browser.waitUntil(
            () => App.signOutButton.isExisting(),
            {
                timeout: 20000,
                timeoutMsg: 'expected user to log in within 20s',
            },
        );

        expect(App.pageName).toHaveTextContaining('Abby Mapes');
        // Check that user is on their own profile
        App.signOutButton.waitForExist({ timeout: 5000 });
        expect(App.explore.isExisting());
        expect(!App.logIn.isExisting());
        expect(!App.signUp.isExisting());
        expect(App.feed.isExisting());
        expect(App.profile.isExisting());
        expect(!App.admin.isExisting());

        App.clickSignOutButton();
        browser.waitUntil(
            () => App.pageName.isExisting(),
            {
                timeout: 5000,
                timeoutMsg: 'expected page to sign user out within 5s',
            },
        );
        // verify that the user is taken to Explore page when logging out
        expect(App.pageName === 'Explore');
        // Check that the nav bar is a 'Guest Nav Bar'
        expect(App.explore.isExisting());
        expect(App.logIn.isExisting());
        expect(App.signUp.isExisting());
        expect(!App.feed.isExisting());
        expect(!App.profile.isExisting());
        expect(!App.admin.isExisting());
    });

    /*
     * 1 Back-End Computed Values Test: Tests that retrieving course information provided at
     * endpoint '/bluebook/courseInfo.json' for the known courseID: 000028 returns the JSON
     * data with the appropriate fields for course 000028.
     */
    it('Should return correct JSON for course with known courseId.', async () => {
        // use fetch to call the backend API directly
        const result = await fetch(`${browser.options.baseUrl}/bluebook/courseInfo.json`);
        const json = await result.json();
        expect(result.status === 200);
        expect(json.catalogNumber === '151');
        expect(json.courseCodes.length === 4);
        expect(json.courseCodes[0] === '(CCI) Cross Cultural Inquiry');
        expect(json.courseCodes[1] === '(R) Research');
        expect(json.courseCodes[2] === '(ALP) Arts, Literature & Performance');
        expect(json.courseCodes[3] === '(CZ) Civilizations');
        expect(json.courseId === '000028');
        expect(json.description === 'Sources of vitality in twentieth-century Indian cinema. The resilience of popular cinema in the face of Hollywood. Narrative and non-narrative expressive forms in folk and high culture in India. The work of Guru Dutt, Satyajit Ray, G. Aravindan, and Mani Kaul. Instructor: Khanna');
        expect(json.subjectCode === 'AMES');
        expect(json.subjectName === 'Asian & Middle Eastern Studies');
        expect(json.title === 'Indian Cinema');
    });

    /*
     * 4 back-end tests to verify the JSON data returned the expected values
     * (including two that produce expected error results)
     */

    /*
     * Back-End Verify Test 1: Tests that filtering the database collection
     * subjects to retrieve subjects that match a search term: 'computer' will return
     * the known computed list of subjects that contain the search term.
     */
    it('Back-end should return correct computed list of subjects based on the search term and collection.', async () => {
        // use fetch to call the backend API directly
        const searchTerm = 'computer';
        const collection = 'subjects';
        const result = await fetch(`${browser.options.baseUrl}/bluebook/getFilteredDocuments?collection=${collection}&searchTerm=${searchTerm}`);
        const json = await result.json();
        expect(result.status === 200);
        expect(json.totalResults === 2);
        expect(json.results[0].code === 'COMPSCI');
        expect(json.results[0].name === 'Computer Science');
        expect(json.results[1].code === 'ECE');
        expect(json.results[1].name === 'Electrical & Computer Egr');
    });

    /*
     * Back-End Verify Test 2: Tests that retrieving user information for the example
     * userID: exFollowingID1 returns the JSON object with the appropriate fields for user
     * exFollowingID1.
     */
    it('Should return correct JSON for user with known userId.', async () => {
        // use fetch to call the backend API directly
        const knownUserId = 'exFollowingID1';
        const result = await fetch(`${browser.options.baseUrl}/bluebook/getUser?userId=${knownUserId}`);
        const json = await result.json();
        expect(result.status === 200);
        expect(json.userId === 'exFollowingID1');
        expect(json.isAdmin === false);
        expect(json.picture === 'https://st.depositphotos.com/2208320/1827/v/950/depositphotos_18271601-stock-illustration-vector-portrait-girl.jpg');
        expect(json.email === 'csw@duke.edu');
        expect(json.displayName === 'Claire Rainey');
        expect(json.visits === 1);
        expect(json.subjects.length === 4);
        expect(json.subjects[0] === 'SOCIOL');
        expect(json.subjects[1] === 'STA');
        expect(json.subjects[2] === 'LIT');
        expect(json.subjects[3] === 'AAAS');
        expect(json.majors.length === 2);
        expect(json.majors[0] === 'PSY');
        expect(json.majors[1] === 'ITALIAN');
        expect(json.minors.length === 1);
        expect(json.minors[0] === 'FRENCH');
        expect(json.certificates.length === 1);
        expect(json.certificates[0] === 'MMS');
    });

    /*
     * Back-End Error Test 3: Tests that retrieving course information for an
     * invalid course ID returns a JSON object with the appropriate error message.
     */
    it('Should return error message for requesting course information for a invalid courseId.', async () => {
        // use fetch to call the backend API directly
        const invalidCourseId = 'invalidID';
        const result = await fetch(`${browser.options.baseUrl}/bluebook/getCourseInformation?courseId=${invalidCourseId}`);
        const json = await result.json();
        expect(result.status !== 200);
        expect(json.message).toHaveTextContaining(`No such document in courses with ID: ${invalidCourseId}`);
    });

    /*
     * Back-End Error Test 4: Tests that retrieving user information for an
     * invalid userID returns a JSON object with the appropriate error message.
     */
    it('Should return error message for requesting user information for a invalid userId.', async () => {
        // use fetch to call the backend API directly
        const invalidUserId = 'invalidID';
        const result = await fetch(`${browser.options.baseUrl}/bluebook/getUser?userId=${invalidUserId}`);
        const json = await result.json();
        expect(result.status !== 200);
        expect(json.message).toHaveTextContaining(`Cannot find requested user ${invalidUserId}.`);
    });
});
