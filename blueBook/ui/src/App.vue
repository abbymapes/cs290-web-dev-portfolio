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
        <explore-page v-if="currentPage=='explore'"></explore-page>
        <user-page
          v-if="currentPage=='profile'"
          :requestedUid="currentUid"
          @user-page="goToUserPage"
          @course-page="goToCoursePage"
          @subject-page="goToSubjectPage"
        ></user-page>
        <log-in-page v-if="currentPage=='login'"></log-in-page>
        <sign-up-page v-if="currentPage=='signup'"></sign-up-page>
        <user-page
          v-if="currentPage=='user'"
          :requestedUid="requestedUid"
          @user-page="goToUserPage"
          @course-page="goToCoursePage"
          @subject-page="goToSubjectPage"
        ></user-page>
        <course-page
          v-if="currentPage=='course'"
          :requestedCourseId="requestedCourseId"
          :course="requestedCourse"
          @user-page="goToUserPage"
          @attribute-page="goToAttributePage"
        ></course-page>
        <subject-page
          v-if="currentPage=='subject'"
          :subjectCode="requestedSubject.code"
          :subjectName="requestedSubject.name"
          @course-page="goToCoursePage"
        ></subject-page>
        <attribute-page
          v-if="currentPage=='attribute'"
          :attributeName="requestedAttribute"
          @course-page="goToCoursePage"
        ></attribute-page>
      </div>
    </b-overlay>
  </div>
</template>

<script>
/* eslint import/no-cycle: [2, { ignoreExternal: true }] */
import userState from './userState';
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
            loggedIn: false,
            currentUid: '',
            requestedUid: '',
            currentPage: 'profile',
            pageLoading: false,
            requestedCourseId: '',
            requestedCourse: {},
            requestedSubject: {},
            requestedAttribute: '',
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
    },
    computed: {
        getNavBarTitles() {
            return (!userState.loggedIn ? [
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
    },
    async mounted() {
        this.pageLoading = true;
        this.currentUid = userState.currentUid;
        this.loggedIn = userState.loggedIn;
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

</style>
