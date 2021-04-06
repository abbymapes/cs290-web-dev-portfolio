The CoursePage component represents the display page for a course. Within this page, users can
view more details about courses, as well as interact with it if they are logged in. The CoursePage
component displays information for the course provided as a prop.

@author Abby Mapes
<template>
  <div>
    <b-overlay :show="loading" no-center class="overlay">
        <h1>{{course.title}}</h1>
        <h2> {{course.subjectCode + ' ' + course.catalogNumber}} </h2>
    </b-overlay>
  </div>
</template>

<script>
/* eslint-disable */
import userState from '../main';

export default {
  name: "CoursePage",
  components: {
  },
  props: {
    requestedCourseId: String,
    course: Object
  },
  data() {
    return {
        loading: false,
        loggedIn: false
    }
  },
  methods: {
      getRequestedCourse(courseId) {
          // TODO: fetch course information from Firebase
      },
      addLike() {
        // TODO: add like for course
      },
      removeLike() {
        // TODO: remove like for course
      },
      addDislike() {
        // TODO: add dislike to course
      },
      removeDislike() {
        // TODO: remove dislike to course
      },
      addToWishlist() {
        // TODO: add course to wishlist
      },
      removeFromWishlist() {
        // TODO: remove course from wishlist
      },
      goToUserPage(uid) {
          this.$emit('user-page', uid);
      }
  },
  computed: {
  }, 
  watch : {
    requestedCourseId () {
        this.loading = true;
        // TO DO: get course from server
        //this.course = this.getRequestedCourse(this.requestedCourseId);
        this.loading = false;
    }
  },
  async mounted () {
    this.loading = true;
    //this.course = this.getRequestedCourse(this.requestedCourseId);
    this.loggedIn = userState.loggedIn;
    this.loading = false;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
