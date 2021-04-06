The UserReactionSection component represents the display for User's class section on their
User Page. The component displays three categories of classes, liked, disliked, and wishlist classes
based on the user's reactions.

@author Abby Mapes
<template>
    <div class="reaction-section">
        <b-overlay :show="classesLoading" no-center class="overlay">
            <h2>Liked Classes</h2>
            <vue-horizontal-list v-if="liked.length > 0" :items="liked" :options="options">
                <template v-slot:default="{ item }">
                <div class="item">
                    <class type="like" :course="item" @selected="goToCoursePage"></class>
                </div>
                </template>
            </vue-horizontal-list>
            <div v-else class="empty">
                <b-card
                    bg-variant="dark"
                    class="empty"
                >
                    <b-card-body class="no-classes">
                        No Liked Classes
                    </b-card-body>
                </b-card>
            </div>
            <br>
            <h2>Disliked Classes</h2>
            <vue-horizontal-list v-if="disliked.length > 0" :items="disliked" :options="options">
                <template v-slot:default="{ item }">
                <div class="item">
                    <class type="dislike" :course="item" @selected="goToCoursePage"></class>
                </div>
                </template>
            </vue-horizontal-list>
            <div v-else class="empty">
                <b-card
                    bg-variant="dark"
                    class="empty"
                >
                    <b-card-body class="no-classes">
                        No Disliked Classes
                    </b-card-body>
                </b-card>
            </div>
            <br>

            <h2>Class Wishlist</h2>
            <vue-horizontal-list v-if="wishlist.length > 0" :items="wishlist" :options="options">
                <template v-slot:default="{ item }">
                <div class="item">
                    <class type="wishlist" :course="item" @selected="goToCoursePage"></class>
                </div>
                </template>
            </vue-horizontal-list>
            <div v-else class="empty">
                <b-card
                    bg-variant="dark"
                    class="empty"
                >
                    <b-card-body class="no-classes">
                        No Classes in Wishlist
                    </b-card-body>
                </b-card>
            </div>
            <br><br>
            </b-overlay>
    </div>
</template>

<script>
/* eslint-disable */
import Class from "./Class";
import VueHorizontalList from "vue-horizontal-list";
import userState from '../main';

export default {
  name: "UserReactionSection",
  components: {
      Class,
      VueHorizontalList
  },
  props: {
    requestedUid: String
  },
  data() {
    return {
        classesLoading: false,
        options: {
            responsive: [
                { end: 576, size: 1 },
                { start: 576, end: 768, size: 2 },
                { start: 768, end: 992, size: 3 },
                { size: 4 },
            ],
            position: {
                start: -1,
            }
        },
        liked: [],
        disliked: [],
        wishlist: []
    }
  },
  methods: {
      goToCoursePage(course) {
        this.$emit("course-page", course);
      },

      async getReactions(uid) {
        let response = await fetch(userState.SERVER_URL + `/bluebook/getReactions?uid=` + uid);
        let result = await response.json();
        // ensure valid response (HTTP-status is 200-299)
        // and expected data (not error JSON object)
        if (response.ok) {
            // convert server data into Vue data or update existing Vue data
            return result
        } else {
            // TODO: take care of errors
            //this.errorMessage = result.message;
            //this.showError = true;
            return {};
        }
      }
  },
  computed: {

  }, 
  watch : {
    async requestedUid () {
        let reactions = await this.getReactions(this.requestedUid);
        this.liked = reactions.liked;
        this.disliked = reactions.disliked;
        this.wishlist = reactions.wishlist;
        this.classesLoading = false;
    }
  },
  async mounted () {
    this.classesLoading = true;
    // TODO: fetch user reactions from database (returns course codes)
    // will return a object of 3 lists as followed:
    let reactions = await this.getReactions(this.requestedUid);
    this.liked = reactions.liked;
    this.disliked = reactions.disliked;
    this.wishlist = reactions.wishlist;
    this.classesLoading = false;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.reaction-section {
    width: 90%;
    margin: auto;
}

.empty {
    height: 100px;
}

.no-classes {
    font-size: 16pt;
    color: white;
}
</style>
