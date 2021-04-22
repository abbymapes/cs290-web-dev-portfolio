The AdminPage component represents the display for an admin account.

@author Abby Mapes
<template>
  <div>
    <b-overlay :show="pageLoading" no-center class="overlay">
        <b-avatar
          size="10rem"
          :src="user.picture"
          :alt="user.displayName + 'Profile Picture'"
        ></b-avatar>
        <h1>{{ user.displayName }}</h1>

        <div>
            <b-button
            variant="outline-primary"
            @click="signOut"
            class="button"
            >Sign Out</b-button
            >
        </div>
        <user-section
          v-if="validResults"
          :userList="results"
          @user-page="goToUserPage"
        >
        </user-section>
        <span v-else-if="currentSection == 'users' && !validFriends">
          We couldn't load the users for BlueBook. Please refresh the page
          and try again.
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
import UserSection from './UserSection.vue';
import userState from '../userState';

export default {
    name: 'AdminPage',
    components: {
        UserSection,
    },
    props: {
        user: Object,
    },
    data() {
        return {
            pageLoading: false,
            currentUid: this.user.userId,
            showError: false,
            errorMessage: '',
            editingProfile: false,
            results: [],
            validResults: true,
            loggedIn: false,
        };
    },
    methods: {
        async getAllUsers() {
            const response = await fetch(`${userState.SERVER_URL}/bluebook/getUsersForAdmin`);
            const result = await response.json();
            if (response.ok) {
                this.results = result.results;
                this.totalResults = result.totalResults;
                this.validResults = true;
            } else {
                this.validSubjects = false;
                this.errorMessage = result.message;
                this.showError = true;
            }
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
        goToUserPage(userId) {
            this.$emit('user-page', userId);
        },
    },
    computed: {

    },
    watch: {

    },
    async mounted() {
        this.pageLoading = true;
        await this.getAllUsers();
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
