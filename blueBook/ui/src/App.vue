The overall BlueBook app that controls the flow and pages of the BlueBook webapp.

@author Abby Mapes

<template>
  <div id="app">
      <div class="main-navbar-section">
        <nav-bar
          :sections="getNavBarTitles"
          :isCentered="false"
          :currentPage="currentPage"
          @change-page="changePage"
        ></nav-bar>
      </div>
      <b-overlay :show="pageLoading" no-center class="overlay">
        <div class="page-content">
          <feed-page
            v-if="currentPage=='feed'"
            @user-page="goToUserPage"
            @course-page="goToCoursePage"
          ></feed-page>
          <explore-page
            v-if="currentPage=='explore'"
            @user-page="goToUserPage"
            @course-page="goToCoursePage"
            @subject-page="goToSubjectPage"
            @attribute-page="goToAttributePage"
          ></explore-page>
          <user-page
            v-if="currentPage=='profile'"
            :requestedUid="currentUid"
            :isAdmin="isAdmin"
            @user-page="goToUserPage"
            @course-page="goToCoursePage"
            @subject-page="goToSubjectPage"
            @sign-out='signOutUser'
          ></user-page>
          <log-in-page
            v-if="currentPage=='login'"
            @update-user="updateUser"
            @sign-up="currentPage = 'signup'"
          ></log-in-page>
          <sign-up-page
            v-if="currentPage=='signup'"
            @update-user="updateUser"
          ></sign-up-page>
          <user-page
            v-if="currentPage=='user'"
            :requestedUid="requestedUid"
            :isAdmin="isAdmin"
            @user-page="goToUserPage"
            @course-page="goToCoursePage"
            @subject-page="goToSubjectPage"
          ></user-page>
          <course-page
            v-if="currentPage=='course'"
            :isAdmin="isAdmin"
            :requestedCourseId="requestedCourseId"
            :course="requestedCourse"
            @user-page="goToUserPage"
            @attribute-page="goToAttributePage"
          ></course-page>
          <subject-page
            v-if="currentPage=='subject'"
            :isAdmin="isAdmin"
            :subjectCode="requestedSubject.code"
            :subjectName="requestedSubject.name"
            @course-page="goToCoursePage"
          ></subject-page>
          <attribute-page
            v-if="currentPage=='attribute'"
            :attributeName="requestedAttribute"
            @course-page="goToCoursePage"
          ></attribute-page>
          <admin-page
            v-if="currentPage=='admin'"
            :user="currentUser"
            @user-page="goToUserPage"
            @sign-out='signOutUser'
          ></admin-page>
        </div>
      </b-overlay>
  </div>
</template>

<script>
import userState from './userState';
import AdminPage from './components/AdminPage.vue';
import NavBar from './components/NavBar.vue';
import FeedPage from './components/FeedPage.vue';
import ExplorePage from './components/ExplorePage.vue';
import UserPage from './components/UserPage.vue';
import LogInPage from './components/LogInPage.vue';
import SignUpPage from './components/SignUpPage.vue';
import CoursePage from './components/CoursePage.vue';
import SubjectPage from './components/SubjectPage.vue';
import AttributePage from './components/AttributePage.vue';

export default {
    name: 'App',
    components: {
        AdminPage,
        NavBar,
        FeedPage,
        ExplorePage,
        UserPage,
        LogInPage,
        SignUpPage,
        CoursePage,
        SubjectPage,
        AttributePage,
    },
    data() {
        return {
            currentUid: userState.currentUser.userId,
            requestedUid: '',
            currentPage: this.startPage,
            pageLoading: false,
            requestedCourseId: '',
            requestedCourse: {},
            requestedSubject: {},
            requestedAttribute: '',
            currentUser: {},
        };
    },
    methods: {
        changePage(pageName) {
            this.pageLoading = true;
            this.currentPage = pageName;
            this.pageLoading = false;
        },

        goToUserPage(uid) {
            this.pageLoading = true;
            this.requestedUid = uid;
            this.currentPage = 'user';
            this.pageLoading = false;
        },

        goToSubjectPage(code, name) {
            this.pageLoading = true;
            this.requestedSubject = {
                code,
                name,
            };
            this.currentPage = 'subject';
            this.pageLoading = false;
        },

        goToAttributePage(attribute) {
            this.pageLoading = true;
            this.requestedAttribute = attribute;
            this.currentPage = 'attribute';
            this.pageLoading = false;
        },

        goToCoursePage(course) {
            this.pageLoading = true;
            this.requestedCourse = course;
            this.requestedCourseId = course.courseId;
            this.currentPage = 'course';
            this.pageLoading = false;
        },

        async updateUser(userId) {
            this.pageLoading = true;
            this.currentUid = userId;
            if (this.loggedIn) {
                await this.getCurrentUser(this.currentUid);
                await this.updateVisits(this.currentUid);
            }
            this.currentPage = this.startPage;
            this.pageLoading = false;
        },

        async updateVisits(userId) {
            const response = await fetch(
                `${userState.SERVER_URL}/bluebook/updateUserVisits?userId=${userId}`,
            );
            if (response.ok) {
                console.log('Updated user visit count.');
            } else {
                console.log('Failed to update user visit count.');
            }
        },

        signOutUser() {
            this.pageLoading = true;
            this.currentUid = '';
            this.currentPage = 'explore';
            this.pageLoading = false;
        },

        async getCurrentUser(userId) {
            const response = await fetch(
                `${userState.SERVER_URL}/bluebook/getUser?userId=${userId}`,
            );
            const result = await response.json();
            if (response.ok) {
                this.currentUser = result;
                this.validUser = true;
            } else {
                this.validUser = false;
                this.errorMessage = result.message;
                this.showError = true;
            }
        },
    },
    computed: {
        loggedIn() {
            return this.currentUid.length > 0;
        },
        getNavBarTitles() {
            if (!this.loggedIn) {
                return [
                    {
                        name: 'Explore',
                        value: 'explore',
                    },
                    {
                        name: 'Log In',
                        value: 'login',
                    },
                    {
                        name: 'Sign Up',
                        value: 'signup',
                    },
                ];
            }
            return (this.isAdmin
                ? [
                    {
                        name: 'Admin',
                        value: 'admin',
                    },
                ]
                : [
                    {
                        name: 'Feed',
                        value: 'feed',
                    },
                    {
                        name: 'Explore',
                        value: 'explore',
                    },
                    {
                        name: 'Profile',
                        value: 'profile',
                    },
                ]);
        },
        isAdmin() {
            return (this.currentUser.isAdmin);
        },
        startPage() {
            if (this.loggedIn) {
                return (this.isAdmin ? 'admin' : 'profile');
            }
            return 'explore';
        },
    },
    async mounted() {
        this.pageLoading = true;
        this.currentUid = userState.currentUser.userId;
        if (this.loggedIn) {
            await this.getCurrentUser(this.currentUid);
            await this.updateVisits(this.currentUid);
        }
        this.currentPage = this.startPage;
        this.pageLoading = false;
    },
};
</script>

<style>

#app {
  all: unset;
}

.main-navbar-section {
  background: #fff;
  display: inline;
}

.page-content {
  text-align: center;
}

img {
  width: 100%;
  height: 100%;
}

.waterfall {
    width: 100%;
}

.waterfall-item {
    width: 100%;
    display: block;
    padding: 10px;
}

.search {
    width: 95%;
    margin: auto;
    padding-top: 10px;
}

.reaction-feed{
  width: 95%;
  margin: auto;
  margin-top: 20px;
  margin-bottom: 20px;
}

@media screen and (min-width: 600px) {
    .waterfall-item {
        width: 50%;
    }
    .reaction-feed{
        width: 80%;
    }
}

@media screen and (min-width: 1000px) {
    .waterfall-item {
        width: 33%;
    }
    .search {
        width: 80%;
    }
    .reaction-feed{
        width: 70%;
    }
}

@media screen and (min-width: 1200px) {
    .reaction-feed{
        width: 60%;
    }
}

@media screen and (min-width: 1500px) {
    .waterfall-item {
        width: 25%;
    }
    .search {
        width: 80%;
    }
    .reaction-feed{
        width: 50%;
    }
}
</style>
