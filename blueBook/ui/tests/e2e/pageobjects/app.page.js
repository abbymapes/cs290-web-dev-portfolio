/*
 *  The JavaScript file containing helper methods for testing.
 *
 * @author Abby Mapes
 */

module.exports = {
    get pageName() {
        return $('#page-name');
    },
    get sectionName() {
        return $('#section-title');
    },
    get explore() {
        return $('a=Explore');
    },
    get feed() {
        return $('a=Feed');
    },
    get profile() {
        return $('a=Profile');
    },
    get admin() {
        return $('a=Admin');
    },
    get logIn() {
        return $('a=Log In');
    },
    get signUp() {
        return $('a=Sign Up');
    },
    get subjectsSection() {
        return $('a=Subjects');
    },
    get attributeLink() {
        return $('a=Attributes');
    },
    get userSection() {
        return $('a=Users');
    },
    get signOutButton() {
        return $('button[aria-label=\'Sign Out\']');
    },
    get waterFall() {
        return $('div.waterfall');
    },
    get waterFallItem() {
        return $('div.waterfall-item');
    },
    get catalogName() {
        return $('h2');
    },
    get reactionSection() {
        return $('div.reactions');
    },
    get interestingLabel() {
        return $('label=Average Interesting Rating:');
    },
    get difficultyLabel() {
        return $('label=Average Difficulty Rating:');
    },
    get descriptionHeader() {
        return $('h3=Description');
    },
    get description() {
        return $('div.description');
    },
    get attributeHeader() {
        return $('h3=Course Attributes');
    },
    get emptyAttributeSection() {
        return $('div.no-attributes');
    },
    get ratingSection() {
        return $('div.rating');
    },
    get commentHeader() {
        return $('h3=Comments');
    },
    get commentSection() {
        return $('div.comment-section');
    },
    open(path = '/') {
        browser.url(path);
    },
    clickLoginPage() {
        const link = $('a=Log In');
        link.click();
    },
    clickSignUpPage() {
        const link = $('a=Sign Up');
        link.click();
    },
    clickExplorePage() {
        const link = $('a=Explore');
        link.click();
    },
    clickFeedPage() {
        const link = $('a=Feed');
        link.click();
    },
    clickProfilePage() {
        const link = $('a=Profile');
        link.click();
    },
    clickLogInButton() {
        const button = $('button[data-v-46fa31b8]');
        button.click();
    },
    async clickSignOutButton() {
        const button = $('button[aria-label=\'Sign Out\']');
        button.click();
    },
    async clickAttributesSection() {
        const link = $('a=Attributes');
        link.click();
    },
    async clickFirstWaterfallItem() {
        const firstItem = $('div.waterfall-item');
        firstItem.click();
    },
};
