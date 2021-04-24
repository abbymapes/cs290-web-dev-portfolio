The FeedPage component represents the display for the feed page, where users can view their freinds'
reactions to different classes.

@author Abby Mapes
<template>
  <div>
    <h1 id='page-name'>Feed</h1>
    <b-overlay :show="loading" rounded="sm">
      <span v-if="!disablePage && reactions.length > 0">
        <b-card
          v-for="reaction in reactions"
          :key="reaction.reactionId"
          class="reaction-feed"
        >
          <reaction
            :reactionId="reaction.reactionId"
            :type="reaction.type"
            :date="reaction.date"
            :course="reaction.course"
            :user="reaction.user"
            @course-page="goToCoursePage"
            @user-page="goToUserPage"
          >
          </reaction>
        </b-card>
      </span>
      <span v-else-if="!disablePage">
          Your friends haven't reacted to any classes yet!
      </span>
      <span v-else>
          Couldn't load your feed. Please refresh the page and try again.
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
import Reaction from './Reaction.vue';
import userState from '../userState';

export default {
    name: 'FeedPage',
    components: {
        Reaction,
    },
    props: {
    },
    data() {
        return {
            loading: false,
            showError: false,
            reactions: [],
            errorMessage: '',
            options: {
                itemMargin: 10,
                containerWidth: 10,
                itemClassName: 'item',
                gridWidth: 100,
                transitionDuration: '.5',
            },
            disablePage: false,
            currentUid: userState.currentUser.userId,
        };
    },
    methods: {
        reactionVerb(type) {
            if (['like', 'dislike'].includes(type)) {
                return `${type}s`;
            }
            return 'wants to take';
        },
        goToCoursePage(course) {
            this.$emit('course-page', course);
        },
        goToUserPage(userId) {
            this.$emit('user-page', userId);
        },
        async getFeedReaction() {
            const response = await fetch(`${userState.SERVER_URL}/bluebook/getFriendsReactions?userId=${this.currentUid}`);
            const result = await response.json();
            if (response.ok) {
                this.reactions = result;
            } else {
                this.errorMessage = result.message;
                this.showError = true;
                this.disablePage = true;
            }
        },
    },
    computed: {

    },
    watch: {

    },
    async mounted() {
        this.loading = true;
        await this.getFeedReaction();
        this.loading = false;
    },
};
</script>

<style scoped>
.class {
  width: 100%;
  margin: auto;
}
</style>
