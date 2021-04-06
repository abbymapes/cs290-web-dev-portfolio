The PeopleSection component represents the display to display a list of users' friends in the
User Page, based on the current user's friends.

@author Abby Mapes
<template>
    <div >
        <b-overlay :show="loading" no-center class="overlay">
            <h1>Friends</h1>
            <vue-horizontal-list v-if="friends.length > 0" :items="friends" :options="options">
                <template v-slot:default="{ item }">
                <div class="item">
                    <user
                        class="user"
                        :user="item"
                        @selected="goToUserPage"
                    >
                    </user>
                </div>
                </template>
            </vue-horizontal-list>
            <div v-else class="empty">
                <b-card
                    bg-variant="dark"
                    class="empty"
                >
                    <b-card-body class="no-classes">
                        No Friends
                    </b-card-body>
                </b-card>
            </div>
        </b-overlay>
    </div>
</template>

<script>
/* eslint-disable */
import User from './User';
import VueHorizontalList from "vue-horizontal-list";
import userState from '../main';

export default {
  name: "PeopleSection",
  components: {
      User,
      VueHorizontalList
  },
  props: {
      requestedUid: String
  },
  data() {
    return {
        loading: false,
        friends: [],
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
        }
    }
  },
  methods: {
      goToUserPage(uid) {
          this.$emit('user-page', uid);
      },
      async getUserFriends(requestedUid) {
          // TODO: fetch list of friends names from Database "follows" collection (via server)
          // from requestedUid
          let response = await fetch(userState.SERVER_URL + `/bluebook/getFriends?uid=` + requestedUid);
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
      }

  },
  computed: {

  }, 
  watch : {

  },
  async mounted () {
    this.loading = true;
    this.friends = await this.getUserFriends(this.requestedUid);
    this.loading = false;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.people-section {
    width: 90%;
    margin: auto;
}

.item {
    display: inline-block;
}

.empty {
    height: 100px;
}

.no-classes {
    font-size: 16pt;
    color: white;
}
</style>
