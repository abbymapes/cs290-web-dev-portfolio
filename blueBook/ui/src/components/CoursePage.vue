The CoursePage component represents the display page for a course. Within this page, users can
view more details about courses, as well as interact with it if they are logged in. The CoursePage
component displays information for the course provided as a prop.

@author Abby Mapes
<template>
  <div class="body">
    <b-overlay :show="loading" no-center class="overlay">
      <span v-if="!disablePage">
        <h1 id='page-name'>{{ course.title }}</h1>
        <h2>{{ course.subjectCode + " " + course.catalogNumber }}</h2>

        <div class="reactions" v-if="loggedIn">
          <b-button
            class="reaction"
            variant="success"
            @click="removeReaction"
            v-if="userReaction.like"
          >
            Remove Like
          </b-button>
          <b-button
            class="reaction"
            variant="outline-success"
            @click="addLike"
            v-else
          >
            Like Class
          </b-button>
          <b-button
            class="reaction"
            variant="danger"
            @click="removeReaction"
            v-if="userReaction.dislike"
          >
            Remove Dislike
          </b-button>
          <b-button
            class="reaction"
            variant="outline-danger"
            @click="addDislike"
            v-else
          >
            Dislike Class
          </b-button>
          <b-button
            class="reaction"
            variant="primary"
            @click="removeReaction"
            v-if="userReaction.wishlist"
          >
            Remove from Wishlist
          </b-button>
          <b-button
            class="reaction"
            variant="outline-primary"
            @click="addToWishlist"
            v-else
          >
            Add to Wishlist
          </b-button>
        </div>
        <br />
        <div class="center">
          <label for="avg-rating-interesting">Average Interesting Rating:</label>
          <b-form-rating
            id="avg-rating-interesting"
            :value="courseInfo.interesting"
            size="lg"
            readonly
            no-border
            variant="primary"
            class="mb-2 rating"
          ></b-form-rating>
          <label for="avg-rating-difficulty">Average Difficulty Rating:</label>
          <b-form-rating
            id="avg-rating-difficulty"
            :value="courseInfo.difficulty"
            size="lg"
            readonly
            no-border
            variant="danger"
            class="mb-2 rating"
          ></b-form-rating>
        </div>
        <h3>Description</h3>
        <div class="description">
          {{ courseInfo.description }}
        </div>
        <br />

        <h3>Course Attributes</h3>
        <vue-horizontal-list
          v-if="courseInfo.courseCodes && courseInfo.courseCodes.length > 0"
          :items="courseInfo.courseCodes"
          :options="options"
        >
          <template v-slot:default="{ item }">
            <div class="item attributes">
              <b-card border-variant="primary" @click="goToAttributePage(item)">
                <b-card-body>
                  {{ item }}
                </b-card-body>
              </b-card>
            </div>
          </template>
        </vue-horizontal-list>
        <div v-else class="empty no-attributes">
          <b-card outline-variant="dark" class="empty">
            <b-card-body class="no-classes">No Course Attributes</b-card-body>
          </b-card>
        </div>
        <br />
        <h3 class="center" v-if="loggedIn">Rate:</h3>
        <div class="rating" v-if="loggedIn">
          <label for="rating-interesting" class="mt-3">Interesting</label>
          <b-form-rating
            id="rating-interesting"
            v-model="interestingRating"
            size="lg"
            no-border
            show-clear
            variant="primary"
          ></b-form-rating>
          <br />
          <label for="rating-lg" class="mt-3">Difficulty</label>
          <b-form-rating
            id="rating-difficulty"
            v-model="difficultyRating"
            size="lg"
            no-border
            show-clear
            variant="danger"
          ></b-form-rating>
        </div>
        <h3 class="center">Comments</h3>
          <b-overlay :show="commentsLoading" rounded="sm">
              <div class='comment-section'>
                  <b-input-group
                    v-if='loggedIn'
                    size="sm"
                    class="mb-3"
                  >
                    <b-form-textarea
                        id="comment-textarea"
                        placeholder="Leave a comment here"
                        rows="1"
                        max-rows="8"
                        v-model="newComment"
                        @keyup.enter="postComment"
                    ></b-form-textarea>
                    <b-input-group-append>
                        <b-button
                            size="sm"
                            text="Button"
                            variant="success"
                            :disabled="newComment.trim().length == 0"
                            @click="postComment">
                            Post
                        </b-button>
                    </b-input-group-append>
                  </b-input-group>
              </div>
              <comment-section
                  :comments="displayComments"
                  @user-page="goToUserPage"
                  @delete-comment="deleteComment"
              >
              </comment-section>
              <b-pagination
                  v-model="currentPage"
                  :total-rows="totalComments"
                  :per-page="perPage"
                  aria-controls="comment-section"
                  pills
                  hide-goto-end-buttons
              ></b-pagination>
          </b-overlay>
      </span>
      <span v-else>
        Please refresh page and  try again.
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
import VueHorizontalList from 'vue-horizontal-list';
import userState from '../userState';
import CommentSection from './CommentSection.vue';

export default {
    name: 'CoursePage',
    components: {
        VueHorizontalList,
        CommentSection,
    },
    props: {
        requestedCourseId: String,
        course: Object,
        isAdmin: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return {
            loading: false,
            currentUid: userState.currentUser.userId,
            showError: false,
            disablePage: false,
            errorMessage: '',
            courseInfo: {},
            userReaction: {},
            userRating: {},
            difficultyRating: 0,
            interestingRating: 0,
            comments: [],
            perPage: 5,
            currentPage: 1,
            totalComments: 0,
            newComment: '',
            commentsLoading: false,
            options: {
                responsive: [
                    { end: 576, size: 1 },
                    { start: 576, end: 768, size: 2 },
                    { start: 768, end: 992, size: 3 },
                    { size: 4 },
                ],
                position: {
                    start: -1,
                },
            },
        };
    },
    methods: {
        async getCourseInformation() {
            const response = await fetch(
                `${userState.SERVER_URL
                }/bluebook/getCourseInformation?courseId=${
                    this.requestedCourseId}`,
            );
            const result = await response.json();
            if (response.ok) {
                this.courseInfo = result.course;
                this.comments = result.comments;
            } else {
                this.errorMessage = result.message;
                this.showError = true;
                this.disablePage = true;
            }
        },
        async getUserInteractions(userId, courseId) {
            const response = await fetch(
                `${userState.SERVER_URL
                }/bluebook/getUserInteractions?courseId=${
                    courseId
                }&userId=${
                    userId}`,
            );
            const result = await response.json();
            if (response.ok) {
                this.userReaction = result.reaction;
                this.userRating = result.rating;
                this.difficultyRating = result.rating.difficulty;
                this.interestingRating = result.rating.interesting;
            } else {
                this.errorMessage = result.message;
                this.showError = true;
                this.disablePage = true;
            }
        },
        async updateUserReaction(reaction) {
            this.loading = true;
            if (this.isValidReaction(reaction)) {
                const response = await fetch(
                    `${userState.SERVER_URL
                    }/bluebook/updateUserReaction?courseId=${
                        this.requestedCourseId
                    }&userId=${
                        this.currentUid}`,
                    {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(reaction),
                    },
                );
                const result = await response.json();
                if (response.ok) {
                    this.courseInfo = result.courseInfo;
                    this.userReaction = result.reaction;
                    this.userRating = result.rating;
                    this.difficultyRating = result.rating.difficulty;
                    this.interestingRating = result.rating.interesting;
                } else {
                    this.errorMessage = result.message;
                    this.showError = true;
                    this.disablePage = true;
                }
            } else {
                console.log('BAD USER INPUT: Unable to react to course due to invalid input.');
                this.errorMessage = 'Invalid reaction: cannot write reaction document with empty userId or courseId. Please try again.';
                this.showError = true;
                this.disablePage = true;
            }
            this.loading = false;
        },
        async updateUserRating(rating) {
            this.loading = true;
            if (this.isValidRating) {
                const response = await fetch(
                    `${userState.SERVER_URL
                    }/bluebook/updateUserRating?courseId=${
                        this.requestedCourseId
                    }&userId=${
                        this.currentUid}`,
                    {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(rating),
                    },
                );
                const result = await response.json();
                if (response.ok) {
                    this.courseInfo = result.courseInfo;
                    this.userReaction = result.reaction;
                    this.userRating = result.rating;
                    this.difficultyRating = result.rating.difficulty;
                    this.interestingRating = result.rating.interesting;
                } else {
                    this.errorMessage = result.message;
                    this.showError = true;
                    this.disablePage = true;
                }
            } else {
                console.log('BAD USER INPUT: Unable to rate course due to invalid input.');
                this.errorMessage = 'Invalid rating: cannot write rating document with empty userId or courseId. Please try again.';
                this.showError = true;
                this.disablePage = true;
            }
            this.loading = false;
        },
        async addLike() {
            const reaction = {
                like: true,
                dislike: false,
                wishlist: false,
            };
            await this.updateUserReaction(reaction);
        },
        async removeReaction() {
            const reaction = {
                like: false,
                dislike: false,
                wishlist: false,
            };
            await this.updateUserReaction(reaction);
        },
        async addDislike() {
            const reaction = {
                like: false,
                dislike: true,
                wishlist: false,
            };
            await this.updateUserReaction(reaction);
        },
        async addToWishlist() {
            const reaction = {
                like: false,
                dislike: false,
                wishlist: true,
            };
            await this.updateUserReaction(reaction);
        },
        goToUserPage(userId) {
            this.clearData();
            this.$emit('user-page', userId);
        },
        clearData() {
            this.showError = false;
            this.disablePage = false;
            this.errorMessage = '';
            this.comments = [];
            this.totalComments = 0;
            this.newComment = '';
        },
        async postComment() {
            this.commentsLoading = true;
            if (this.isValidComment) {
                this.errorMessage = '';
                this.comments = [];
                this.totalComments = 0;
                const comment = {
                    courseId: this.requestedCourseId,
                    userId: this.currentUid,
                    commentText: this.newComment,
                };
                const response = await fetch(
                    `${userState.SERVER_URL
                    }/bluebook/postCourseComment`,
                    {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(comment),
                    },
                );
                const result = await response.json();
                this.newComment = '';
                if (response.ok) {
                    this.comments = result;
                    this.totalComments = result.length;
                } else {
                    this.errorMessage = result.message;
                    this.showError = true;
                }
            } else {
                console.log('BAD USER INPUT: Unable to comment on course due to invalid input.');
                this.errorMessage = 'Invalid comment: cannot write comment document with empty userId or courseId. Please try again.';
                this.showError = true;
            }
            this.commentsLoading = false;
        },

        async deleteComment(commentId) {
            this.commentsLoading = true;
            this.errorMessage = '';
            this.comments = [];
            this.newComment = '';
            this.totalComments = 0;
            const response = await fetch(`${userState.SERVER_URL}/bluebook/deleteCourseComment?commentId=${commentId}&courseId=${this.requestedCourseId}`);
            const result = await response.json();
            if (response.ok) {
                this.comments = result;
                this.totalComments = result.length;
            } else {
                this.errorMessage = result.message;
                this.showError = true;
            }
            this.commentsLoading = false;
        },

        goToAttributePage(attribute) {
            this.$emit('attribute-page', attribute);
        },
        isValidRating(rating) {
            return (this.requestedCourseId !== ''
            && this.currentUid !== ''
            && rating.difficulty !== null
            && rating.interesting !== null);
        },
        isValidReaction(reaction) {
            return (this.requestedCourseId !== ''
            && this.currentUid !== ''
            && reaction.like !== null
            && reaction.dislike !== null
            && reaction.wishlist !== null
            && !(reaction.like && reaction.dislike)
            && !(reaction.like && reaction.wishlist)
            && !(reaction.dislike && reaction.wishlist));
        },
    },
    computed: {
        loggedIn() {
            if (this.isAdmin) {
                return false;
            }
            return this.currentUid.length > 0;
        },
        numPages() {
            return (Math.ceil(this.totalComments / this.perPage));
        },
        displayComments() {
            const firstComment = ((this.currentPage - 1) * this.perPage);
            return this.comments.slice(firstComment, firstComment + this.perPage);
        },
        isValidComment() {
            return (this.requestedCourseId !== ''
            && this.currentUid !== ''
            && this.newComment.trim() !== '');
        },
    },
    watch: {
        async difficultyRating() {
            if (!this.loading) {
                const rating = {
                    interesting: this.interestingRating,
                    difficulty: this.difficultyRating,
                };
                await this.updateUserRating(rating);
            }
        },
        async interestingRating() {
            if (!this.loading) {
                const rating = {
                    interesting: this.interestingRating,
                    difficulty: this.difficultyRating,
                };
                await this.updateUserRating(rating);
            }
        },
    },
    async mounted() {
        this.loading = true;
        await this.getCourseInformation();
        if (this.loggedIn) {
            await this.getUserInteractions(
                this.currentUid,
                this.requestedCourseId,
            );
        }
        this.loading = false;
    },
};
</script>

<style scoped>
.body {
  margin: 10px;
  padding: 10px;
}
h3 {
  text-align: left;
  color: inherit;
}
.description {
  text-align: left;
}
.empty {
  height: 100%;
}

.no-classes {
  font-size: 16pt;
}
.center {
  text-align: center;
}
.reaction {
  margin: 20px;
}

.reactions {
  margin: 20px;
  padding: 20px;
}

.rating {
  width: 30%;
  margin: auto;
}

</style>
