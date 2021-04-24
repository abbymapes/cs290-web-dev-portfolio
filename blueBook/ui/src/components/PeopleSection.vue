The PeopleSection component represents the display to display a list of users' friends in the
User Page, based on the current user's friends.

@author Abby Mapes
<template>
    <div >
        <b-overlay :show="loading" no-center class="overlay">
            <h1 id='section-title'>Friends</h1>
            <vue-horizontal-list
                v-if="friends.length > 0"
                :items="friends"
                :options="options"
            >
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
                    bg-variant="light"
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
import VueHorizontalList from 'vue-horizontal-list';
import User from './User.vue';
import userState from '../userState';

export default {
    name: 'PeopleSection',
    components: {
        User,
        VueHorizontalList,
    },
    props: {
        requestedUid: String,
    },
    data() {
        return {
            loading: false,
            friends: [],
            options: {
                list: {
                    class: 'slider',
                    windowed: 1200,
                    padding: 0,
                },
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
        goToUserPage(userId) {
            this.$emit('user-page', userId);
        },
        async getUserFriends(requestedUid) {
            const response = await fetch(`${userState.SERVER_URL}/bluebook/getFriends?userId=${requestedUid}`);
            const result = await response.json();
            if (response.ok) {
                this.friends = result;
            } else {
                this.$emit('show-error', result.message);
            }
        },
    },
    computed: {

    },
    watch: {

    },
    async mounted() {
        this.loading = true;
        await this.getUserFriends(this.requestedUid);
        this.loading = false;
    },
};
</script>

<style scoped>
.people-section {
    width: 90%;
    margin: auto;
}

.item {
    display: inline-block;
}

.empty {
    height: 100%;
}

.no-classes {
    font-size: 16pt;
}

.slider {
    margin-left: 0px;
    margin-right: 0px;
}
</style>
