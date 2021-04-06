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
        <feed-page v-if="currentPage=='feed'"></feed-page>
        <explore-page v-if="currentPage=='explore'"></explore-page>
        <user-page
          v-if="currentPage=='profile'"
          :requestedUid="currentUid"
          @user-page="goToUserPage"
          @course-page="goToCoursePage"
        ></user-page>
        <log-in-page v-if="currentPage=='login'"></log-in-page>
        <sign-up-page v-if="currentPage=='signup'"></sign-up-page>
        <user-page
          v-if="currentPage=='user'"
          :requestedUid="requestedUid"
          @user-page="goToUserPage"
          @course-page="goToCoursePage"
        ></user-page>
        <course-page
          v-if="currentPage=='course'"
          :requestedCourseId="requestedCourseId"
          :course="requestedCourse"
          @user-page="goToUserPage"
        ></course-page>
      </div>
    </b-overlay>
  </div>
</template>

<script>
/* eslint-disable */
import NavBar from './components/NavBar.vue';
import FeedPage from './components/FeedPage.vue';
import ExplorePage from './components/ExplorePage.vue';
import UserPage from './components/UserPage.vue';
import LogInPage from './components/LogInPage.vue';
import SignUpPage from './components/SignUpPage.vue';
import CoursePage from './components/CoursePage.vue'
import userState from './main'

export default {
  name: 'App',
  components: {
    NavBar,
    FeedPage,
    ExplorePage,
    UserPage,
    LogInPage,
    SignUpPage,
    CoursePage
  },
  data () {
    return {
      loggedIn: false,
      currentUid: "",
      requestedUid: "",
      currentPage: 'profile',
      pageLoading: false,
      requestedCourseId: "",
      requestedCourse: {}
    }
  },
  methods : {
    changePage(pageName) {
      this.pageLoading = true;
      console.log(pageName);

      this.currentPage = pageName;
      this.pageLoading = false;
    },

    goToUserPage(uid) {
      this.pageLoading = true;
      this.requestedUid = uid;
      this.currentPage = 'user';
      this.pageLoading = false;
    },

    goToCoursePage(course) {
      this.pageLoading = true;
      this.requestedCourse = course
      this.requestedCourseId = course.courseId;
      this.currentPage = 'course';
      this.pageLoading = false;
    }
  },
  computed : {
    getNavBarTitles() {
      return (!userState.loggedIn ? [
        {
          name: 'Explore',
          value: 'explore'
        },
        {
          name: 'Log In',
          value: 'login'
        },
        {
          name: 'Sign Up',
          value: 'signup'
        }
      ] :
      [
        {
          name: 'Feed',
          value: 'feed'
        },
        {
          name: 'Explore',
          value: 'explore'
        },
        {
          name: 'Profile',
          value: 'profile'
        }
      ])
    }
  }, 
  async mounted () {
    this.pageLoading = true;
    this.currentUid = userState.currentUid;
    this.loggedIn = userState.loggedIn;
    //const response = await fetch('api/links.json');
    //this.links = await response.json();
    this.pageLoading = false;
  }
}
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
