The UserPage component represents the display for viewing a User Page, whether it be
the current user's profile, or a different user's page.

@author Abby Mapes
<template>
  <div>
    <b-overlay :show="pageLoading" no-center class="overlay">
        <h1>{{this.user.displayName}}</h1>
        <img
            :src="this.user.picture"
            :alt="this.user.displayName + 'Profile Picture'"
            @load="pageLoading = false"
         >
         <br>
         <br>
        <b-button
            v-if="!isViewingProfile && !isFollowing"
            variant="outline-dark"
            @click="addFriend"
            class="button"
            >Add Friend</b-button
        >
        <b-button
            v-if="!isViewingProfile && isFollowing"
            variant="outline-dark"
            @click="removeFriend"
            class="button"
            >Remove Friend</b-button
        >
        <div v-if="isViewingProfile">
            <b-button
                variant="outline-dark"
                @click="editProfile"
                class="button"
                >Edit Profile</b-button
            >
            <br>
            <b-button
                variant="outline-dark"
                @click="signOut"
                class="button"
                >Sign Out</b-button
            >
        </div>
        <nav-bar
            :sections="sectionTitles"
            :currentPage="currentSection"
            :isCentered="true"
            @change-page="changeSection"
        ></nav-bar>
        <user-reaction-section
            v-if="currentSection=='classes'"
            :requestedUid="requestedUid"
            @course-page="goToCoursePage"
        >
        </user-reaction-section>
        <subjects-section
            v-if="currentSection=='subjects'"
            :subjectList="fullSubjectList
        "></subjects-section>
        <people-section
            v-if="currentSection=='friends'"
            :requestedUid="requestedUid"
            @user-page="goToUserPage"
        ></people-section>
    </b-overlay>
  </div>
</template>

<script>
/* eslint-disable */
import NavBar from './NavBar.vue';
import UserReactionSection from './UserReactionSection.vue';
import SubjectsSection from './SubjectsSection.vue';
import PeopleSection from './PeopleSection.vue';
import userState from '../main';

export default {
  name: "UserPage",
  components: {
    NavBar,
    UserReactionSection,
    SubjectsSection,
    PeopleSection
  },
  props: {
      requestedUid: String
  },
  data() {
    return {
        pageLoading: false,
        user: {},
        currentSection: 'classes',
        sectionTitles: [
        {
          name: 'Classes',
          value: 'classes'
        },
        {
          name: 'Subjects',
          value: 'subjects'
        },
        {
          name: 'Friends',
          value: 'friends'
        }
      ]
    }
  },
  methods: {
      goToCoursePage(course) {
        this.$emit("course-page", course);
      },
      async getRequestedUserProfile(userId) {
          // TODO: fetch user information for uid from Firebase
          console.log(userState.SERVER_URL + `/bluebook/getUser?uid=` + userId);
          let response = await fetch(userState.SERVER_URL + `/bluebook/getUser?uid=` + userId);
          let result = await response.json();
          // ensure valid response (HTTP-status is 200-299)
          // and expected data (not error JSON object)
          if (response.ok) {
            // convert server data into Vue data or update existing Vue data
            return(result);
          } else {
            // TODO: take care of errors
            //this.errorMessage = result.message;
            //this.showError = true;
            return {};
          }
      },
      addFriend() {
        // TODO: add friend (add doc to Firebase)
      },
      removeFriend() {
        // TODO: remove friend (add doc to Firebase)
      },
      editProfile() {
        // TODO: edit profile 
        // change name, majors, subjects, email, picture
      },
      signOut() {
        // TODO: log user out 
      },
      changeSection(newSection) {
          this.pageLoading = true;
          this.currentSection = newSection;
          this.pageLoading = false;
      },
      goToUserPage(uid) {
          this.$emit('user-page', uid);
      }
  },
  computed: {
      isViewingProfile() {
          return (userState.currentUid == this.requestedUid);
      },
      isFollowing() {
        if (this.isViewingProfile) {
            return false;
        } else {
            // TODO: check if current user is following requestedUid in database
        }
      },
      fullSubjectList() {
          let userSubjects = [];
          this.user.majors.forEach(subject => {
              userSubjects.push({
                  code: subject,
                  type: "major"
              });
          });
          this.user.minors.forEach(subject => {
              userSubjects.push({
                  code: subject,
                  type: "minor"
              });
          });
          this.user.certificates.forEach(subject => {
              userSubjects.push({
                  code: subject,
                  type: "certificate"
              });
          });
          this.user.subjects.forEach(subject => {
              userSubjects.push({
                  code: subject,
                  type: "other"
              });
          });
          return userSubjects;
      }
  }, 
  watch : {
      async requestedUid () {
        this.pageLoading = true;
        this.user = {};
        this.user = await this.getRequestedUserProfile(this.requestedUid);
        this.currentSection= 'classes';
        this.pageLoading = false;
      }
  },
  async mounted () {
    this.pageLoading = true;
    this.user = {};
    if (this.requestedUid != "") {
      this.user = await this.getRequestedUserProfile(this.requestedUid);
    }
    this.pageLoading = false;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content {
    text-align: center;
}
img {
    height: 300px;
    width: 300px;
    border-radius: 50%;
    border: black;
    border-width: 1px;
    border-style: solid;
}
</style>
