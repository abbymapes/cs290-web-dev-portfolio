The User component represents the display for a user's name and profile picture,
which is shown in the Friends section or the search section.

@author Abby Mapes
<template>
    <b-card
        @click="goToUserPage"
        border-variant="light"
    >
        <b-avatar size="10rem"
            :src="user.picture"
            :alt="user.displayName + 'Profile Picture'"
        ></b-avatar>
        <b-card-title class="title">
            {{user.displayName}}
        </b-card-title>
        <b-card-body v-if="user.visits != null">
            Times Visiting Site: {{user.visits}}
        </b-card-body>

    </b-card>
</template>

<script>

export default {
    name: 'User',
    components: {
    },
    props: {
        user: Object,
    },
    data() {
        return {
        };
    },
    methods: {
        goToUserPage() {
            this.$emit('selected', this.user.userId);
        },
    },
    computed: {
    },
    watch: {

    },
};
</script>

<style scoped>
    b-card {
        height: 100%;
        margin: 1%;
    }
    title {
        margin-top: 10px;
    }
</style>
