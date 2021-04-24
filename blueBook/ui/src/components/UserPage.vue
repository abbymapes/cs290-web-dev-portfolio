The UserPage component represents the display for viewing a User Page, whether it be
the current user's profile, or a different user's page.

@author Abby Mapes
<template>
  <div>
    <b-overlay :show="pageLoading" no-center class="overlay">
      <span v-if="validUser">
        <b-avatar
          size="10rem"
          :src="user.picture"
          :alt="user.displayName + 'Profile Picture'"
        ></b-avatar>
        <h1 id='page-name'>{{ user.displayName }}</h1>
        <span v-if="loggedIn">
          <span v-if="validFollowStatus">
            <b-button
              v-if="!isViewingProfile && !isFollowing"
              variant="outline-success"
              @click="addFriend"
              class="button"
              aria-label='Add Friend'
              >Add Friend</b-button
            >
            <b-button
              v-if="!isViewingProfile && isFollowing"
              variant="outline-danger"
              @click="removeFriend"
              class="button"
              aria-label='Remove Friend'
              >Remove Friend</b-button
            >
            <div v-if="isViewingProfile">
              <b-button
                variant="outline-primary"
                @click="editProfile"
                class="button"
                aria-label='Edit Profile'
                >Edit Profile</b-button
              >
              <b-button
                variant="outline-primary"
                @click="signOut"
                class="button"
                aria-label='Sign Out'
                >Sign Out</b-button
              >
            </div>
          </span>
          <span v-else>
            We couldn't retrieve your relationship with this user. Please
            refresh the page and try again.
          </span>
        </span>
        <b-modal
            v-model="editingProfile"
            hide-footer
            scrollable
            lazy
            size="lg"
        >
          <edit-profile
            :user="user"
            @show-error="showEditError"
            @cancel-edit="cancelEdit"
            @refresh-user="refreshUser">
          </edit-profile>
        </b-modal>
        <nav-bar
          :sections="sectionTitles"
          :currentPage="currentSection"
          :isCentered="true"
          @change-page="changeSection"
        ></nav-bar>
        <user-reaction-section
          v-if="currentSection == 'classes' && validReactions"
          :requestedUid="requestedUid"
          @show-reaction="displayReactionModal"
          @show-error="showReactionError"
        >
        </user-reaction-section>
        <span v-else-if="currentSection == 'classes' && !validReactions">
          We couldn't load reactions for this user. Please refresh the page and
          try again.
        </span>
        <subjects-section
          v-if="currentSection == 'subjects' && validSubjects"
          :subjectList="fullSubjectList"
          @subject-page="goToSubjectPage"
          @show-error="showSubjectError"
        >
        </subjects-section>
        <span v-else-if="currentSection == 'subjects' && !validSubjects">
          We couldn't load the subjects for this user. Please refresh the page
          and try again.
        </span>
        <people-section
          v-if="currentSection == 'friends' && validFriends"
          :requestedUid="requestedUid"
          @user-page="goToUserPage"
          @show-error="showPeopleError"
        ></people-section>
        <span v-else-if="currentSection == 'friends' && !validFriends">
          We couldn't load the friends for this user. Please refresh the page
          and try again.
        </span>
        <reaction-modal
          :show="showReaction"
          :reactionId="selectedReactionId"
          :type="selectedReactionType"
          :date="selectedReactionDate"
          :course="selectedReactionCourse"
          :user="user"
          :isAdmin="isAdmin"
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
    <b-modal v-model="showError" class="my-4">
      <div class="modal-body">
        {{ errorMessage }}
      </div>
    </b-modal>
  </div>
</template>

<script>
import EditProfile from './EditProfile.vue';
import NavBar from './NavBar.vue';
import UserReactionSection from './UserReactionSection.vue';
import SubjectsSection from './SubjectsSection.vue';
import PeopleSection from './PeopleSection.vue';
import ReactionModal from './ReactionModal.vue';
import userState from '../userState';

export default {
    name: 'UserPage',
    components: {
        EditProfile,
        NavBar,
        UserReactionSection,
        SubjectsSection,
        PeopleSection,
        ReactionModal,
    },
    props: {
        requestedUid: String,
        isAdmin: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return {
            pageLoading: false,
            currentUid: userState.currentUser.userId,
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
            selectedReactionDate: '',
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
            editingProfile: false,
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

        displayReactionModal(type, course, reactionId, date) {
            this.showReaction = true;
            this.selectedReactionId = reactionId;
            this.selectedReactionDate = date;
            this.selectedReactionType = type;
            this.selectedReactionCourse = course;
        },

        async getRequestedUserProfile(userId) {
            const response = await fetch(
                `${userState.SERVER_URL}/bluebook/getUser?userId=${userId}`,
            );
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
                const response = await fetch(
                    `${userState.SERVER_URL}/bluebook/getFollowingStatus?currentUserId=${this.currentUid}&userId=${this.requestedUid}`,
                );
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
            if (this.isValidFollow) {
                const response = await fetch(
                    `${userState.SERVER_URL}/bluebook/addFollow?currentUserId=${this.currentUid}&userId=${this.requestedUid}`,
                );
                const result = await response.json();
                if (response.ok) {
                    this.validFollowStatus = true;
                    this.isFollowing = true;
                    this.followId = result;
                } else {
                    this.errorMessage = result.message;
                    this.showError = true;
                }
            } else {
                console.log('BAD USER INPUT: Unable to add follow due to invalid input.');
                this.errorMessage = 'Invalid follow: cannot add follow document with empty followingId or followerId. Please try again.';
                this.showError = true;
            }
            this.pageLoading = false;
        },
        async removeFriend() {
            this.pageLoading = true;
            const response = await fetch(
                `${userState.SERVER_URL}/bluebook/removeFollow?followId=${this.followId}`,
            );
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
            this.editingProfile = true;
        },
        async refreshUser() {
            this.editingProfile = false;
            this.pageLoading = true;
            if (this.requestedUid !== '') {
                this.resetReactionData();
                this.resetUserData();
                await this.getRequestedUserProfile(this.requestedUid);
                await this.getFollowingStatus();
            }
            this.pageLoading = false;
        },
        signOut() {
            this.pageLoading = true;
            userState.auth
                .signOut()
                .then(() => {
                    this.$emit('sign-out');
                })
                .catch((error) => {
                    this.errorMessage = `An error occurred while signing out: ${error}.`;
                    this.showError = true;
                });
            this.pageLoading = false;
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
            this.selectedReactionDate = '';
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
        showEditError(message) {
            this.editingProfile = false;
            this.showError = true;
            this.errorMessage = message;
        },
        cancelEdit() {
            this.editingProfile = false;
        },
    },
    computed: {
        loggedIn() {
            if (this.isAdmin) {
                return false;
            }
            return this.currentUid.length > 0;
        },
        isViewingProfile() {
            return this.currentUid === this.requestedUid;
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
        isValidFollow() {
            return (this.currentUid !== '' && this.requestedUid !== '');
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

.button {
  margin: 10px;
}
.modal {
    text-align: center;
    font-family: 'Montserrat';
}
</style>
