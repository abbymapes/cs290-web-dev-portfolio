The UserPage component represents the display for viewing a User Page, whether it be
the current user's profile, or a different user's page.

@author Abby Mapes
<template>
  <div>
    <b-overlay :show="pageLoading" no-center class="overlay">
      <span v-if="validUser">
        <h1>{{this.user.displayName}}</h1>
        <div class="avatar">
          <img
              :src="this.user.picture"
              :alt="this.user.displayName + 'Profile Picture'"
              @load="pageLoading = false"
          >
        </div>
        <br>
        <span v-if='validFollowStatus'>
            <b-button
                v-if="!isViewingProfile && !isFollowing"
                variant="outline-success"
                @click="addFriend"
                class="button"
                >Add Friend</b-button
            >
            <b-button
                v-if="!isViewingProfile && isFollowing"
                variant="outline-danger"
                @click="removeFriend"
                class="button"
                >Remove Friend</b-button
            >
            <div v-if="isViewingProfile">
                <b-button
                    variant="outline-primary"
                    @click="editProfile"
                    class="button"
                    >Edit Profile</b-button
                >
                <b-button
                    variant="outline-primary"
                    @click="signOut"
                    class="button"
                    >Sign Out</b-button
                >
            </div>
        </span>
        <span v-else>
            We couldn't retrieve your relationship with this user.
             Please refresh the page and try again.
        </span>
        <nav-bar
            :sections="sectionTitles"
            :currentPage="currentSection"
            :isCentered="true"
            @change-page="changeSection"
        ></nav-bar>
        <user-reaction-section
            v-if="currentSection=='classes' && validReactions"
            :requestedUid="requestedUid"
            @show-reaction="displayReactionModal"
            @show-error="showReactionError"
        >
        </user-reaction-section>
        <span v-else-if="currentSection=='classes' && !validReactions">
          We couldn't load reactions for this user. Please refresh the page and try again.
        </span>
        <subjects-section
            v-if="currentSection=='subjects' && validSubjects"
            :subjectList="fullSubjectList"
            @subject-page="goToSubjectPage"
            @show-error="showSubjectError"
        ></subjects-section>
        <span v-else-if="currentSection=='subjects' && !validSubjects">
          We couldn't load the subjects for this user. Please refresh the page and try again.
        </span>
        <people-section
            v-if="currentSection=='friends' && validFriends"
            :requestedUid="requestedUid"
            @user-page="goToUserPage"
            @show-error="showPeopleError"
        ></people-section>
        <span v-else-if="currentSection=='friends' && !validFriends">
          We couldn't load the friends for this user. Please refresh the page and try again.
        </span>
      <reaction-modal
        :show="showReaction"
        :reactionId="selectedReactionId"
        :type="selectedReactionType"
        :course="selectedReactionCourse"
        :user="user"
        @close-reaction="closeReaction"
        @course-page="goToCoursePage"
        @user-page="goToUserPage"
      >
      </reaction-modal>
    </span>
    <span v-else>
      We couldn't find this user. Please refresh the page and try again.
    </span>
  </b-overlay>
  <b-modal v-model="showError">
    <div class="modal-body">
      {{ errorMessage }}
    </div>
  </b-modal>
  </div>
</template>

<script>
import NavBar from './NavBar.vue';
import UserReactionSection from './UserReactionSection.vue';
import SubjectsSection from './SubjectsSection.vue';
import PeopleSection from './PeopleSection.vue';
import ReactionModal from './ReactionModal.vue';
import userState from '../userState';

export default {
    name: 'UserPage',
    components: {
        NavBar,
        UserReactionSection,
        SubjectsSection,
        PeopleSection,
        ReactionModal,
    },
    props: {
        requestedUid: String,
    },
    data() {
        return {
            pageLoading: false,
            user: {},
            currentSection: 'classes',
            sectionTitles: [
                {
                    name: 'Classes',
                    value: 'classes',
                },
                {
                    name: 'Subjects',
                    value: 'subjects',
                },
                {
                    name: 'Friends',
                    value: 'friends',
                },
            ],
            showReaction: false,
            selectedReactionId: '',
            selectedReactionType: '',
            selectedReactionCourse: {},
            showError: false,
            errorMessage: '',
            validUser: false,
            validReactions: true,
            validSubjects: true,
            validFriends: true,
            isFollowing: false,
            validFollowStatus: true,
            followId: '',
        };
    },
    methods: {
        goToCoursePage(course) {
            this.resetReactionData();
            this.resetUserData();
            this.$emit('course-page', course);
        },

        closeReaction() {
            this.resetReactionData();
        },

        goToSubjectPage(code, name) {
            this.$emit('subject-page', code, name);
        },

        displayReactionModal(type, course, reactionId) {
            this.showReaction = true;
            this.selectedReactionId = reactionId;
            this.selectedReactionType = type;
            this.selectedReactionCourse = course;
        },

        async getRequestedUserProfile(userId) {
            const response = await fetch(`${userState.SERVER_URL}/bluebook/getUser?userId=${userId}`);
            const result = await response.json();
            if (response.ok) {
                this.user = result;
                this.validUser = true;
            } else {
                this.validUser = false;
                this.errorMessage = result.message;
                this.showError = true;
            }
        },
        async getFollowingStatus() {
            if (this.isViewingProfile) {
                this.isFollowing = false;
            } else {
                const response = await fetch(`${userState.SERVER_URL}/bluebook/getFollowingStatus?currentUserId=${userState.currentUid}&userId=${this.requestedUid}`);
                const result = await response.json();
                if (response.ok) {
                    this.validFollowStatus = true;
                    this.isFollowing = result.isFollowing;
                    if (this.isFollowing) {
                        this.followId = result.followId;
                    } else {
                        this.followId = '';
                    }
                } else {
                    this.validFollowStatus = false;
                    this.errorMessage = result.message;
                    this.showError = true;
                }
            }
        },
        async addFriend() {
            this.pageLoading = true;
            const response = await fetch(`${userState.SERVER_URL}/bluebook/addFollow?currentUserId=${userState.currentUid}&userId=${this.requestedUid}`);
            const result = await response.json();
            if (response.ok) {
                this.validFollowStatus = true;
                this.isFollowing = true;
                this.followId = result;
            } else {
                this.errorMessage = result.message;
                this.showError = true;
            }
            this.pageLoading = false;
        },
        async removeFriend() {
            this.pageLoading = true;
            const response = await fetch(`${userState.SERVER_URL}/bluebook/removeFollow?followId=${this.followId}`);
            const result = await response.json();
            if (response.ok) {
                this.validFollowStatus = true;
                this.isFollowing = result;
                this.followId = '';
            } else {
                this.errorMessage = result.message;
                this.showError = true;
            }
            this.pageLoading = false;
        },
        editProfile() {
            // TODO: edit profile, allow user to change name, majors, subjects, email, picture
        },
        signOut() {
            // TODO: sign out button logs current user out
        },
        changeSection(newSection) {
            this.pageLoading = true;
            this.currentSection = newSection;
            this.pageLoading = false;
        },
        goToUserPage(userId) {
            this.resetReactionData();
            if (this.user.userId !== userId) {
                this.resetUserData();
                this.$emit('user-page', userId);
            }
        },
        resetReactionData() {
            this.showReaction = false;
            this.selectedReactionId = '';
            this.selectedReactionType = '';
            this.selectedReactionCourse = {};
        },
        resetUserData() {
            this.user = {};
            this.currentSection = 'classes';
        },
        showReactionError(message) {
            this.validReactions = false;
            this.showError = true;
            this.errorMessage = message;
        },
        showSubjectError(message) {
            this.validSubjects = false;
            this.showError = true;
            this.errorMessage = message;
        },
        showPeopleError(message) {
            this.validFriends = false;
            this.showError = true;
            this.errorMessage = message;
        },
    },
    computed: {
        isViewingProfile() {
            return (userState.currentUid === this.requestedUid);
        },
        fullSubjectList() {
            const userSubjects = [];
            this.user.majors.forEach((subject) => {
                userSubjects.push({
                    code: subject,
                    type: 'major',
                });
            });
            this.user.minors.forEach((subject) => {
                userSubjects.push({
                    code: subject,
                    type: 'minor',
                });
            });
            this.user.certificates.forEach((subject) => {
                userSubjects.push({
                    code: subject,
                    type: 'certificate',
                });
            });
            this.user.subjects.forEach((subject) => {
                userSubjects.push({
                    code: subject,
                    type: 'other',
                });
            });
            return userSubjects;
        },
    },
    watch: {
        async requestedUid() {
            this.pageLoading = true;
            if (this.requestedUid !== '') {
                this.resetReactionData();
                this.resetUserData();
                await this.getRequestedUserProfile(this.requestedUid);
                await this.getFollowingStatus();
            }
            this.pageLoading = false;
        },
    },
    async mounted() {
        this.pageLoading = true;
        this.resetReactionData();
        this.resetUserData();
        if (this.requestedUid !== '') {
            await this.getRequestedUserProfile(this.requestedUid);
            await this.getFollowingStatus();
        }
        this.pageLoading = false;
    },
};
</script>

<style scoped>
.content {
    text-align: center;
}

.avatar {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  text-align: center;
  margin: auto;
}

img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: black;
  border-width: 1px;
  border-style: solid;
}

.button {
  margin: 10px;
}
</style>
