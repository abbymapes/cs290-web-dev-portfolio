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
                    <class type="like"
                    :course="item"
                    :reaction-id="item.reactionId"
                    :date="item.date"
                    @selected-reaction="displayReactionModal"></class>
                </div>
                </template>
            </vue-horizontal-list>
            <div v-else class="empty">
                <b-card
                    bg-variant="light"
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
                    <class type="dislike" :course="item"
                    :reaction-id="item.reactionId"
                    :date="item.date"
                    @selected-reaction="displayReactionModal"></class>
                </div>
                </template>
            </vue-horizontal-list>
            <div v-else class="empty">
                <b-card
                    bg-variant="light"
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
                    <class type="wishlist" :course="item"
                    :reaction-id="item.reactionId"
                    :date="item.date"
                    @selected-reaction="displayReactionModal"></class>
                </div>
                </template>
            </vue-horizontal-list>
            <div v-else class="empty">
                <b-card
                    bg-variant="light"
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
import VueHorizontalList from 'vue-horizontal-list';
import Class from './Class.vue';
import userState from '../userState';

export default {
    name: 'UserReactionSection',
    components: {
        Class,
        VueHorizontalList,
    },
    props: {
        requestedUid: String,
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
                },
            },
            liked: [],
            disliked: [],
            wishlist: [],
        };
    },
    methods: {
        displayReactionModal(type, course, reactionId, date) {
            this.$emit('show-reaction', type, course, reactionId, date);
        },

        goToCoursePage(course) {
            this.$emit('course-page', course);
        },

        async getReactions(userId) {
            const response = await fetch(`${userState.SERVER_URL}/bluebook/getReactions?userId=${userId}`);
            const result = await response.json();
            if (response.ok) {
                this.liked = result.liked;
                this.disliked = result.disliked;
                this.wishlist = result.wishlist;
            } else {
                this.$emit('show-error', result.message);
            }
        },
    },
    computed: {

    },
    watch: {
        async requestedUid() {
            this.classesLoading = true;
            if (this.requestedUid !== '') {
                await this.getReactions(this.requestedUid);
            }
            this.classesLoading = false;
        },
    },
    async mounted() {
        this.classesLoading = true;
        if (this.requestedUid !== '') {
            await this.getReactions(this.requestedUid);
        }
        this.classesLoading = false;
    },
};
</script>

<style scoped>
.reaction-section {
    width: 90%;
    margin: auto;
}

.empty {
    height: 100%;
}

.no-classes {
    font-size: 16pt;
}
</style>
