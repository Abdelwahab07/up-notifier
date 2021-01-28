<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8" lg="7">
                <div class="feed-list-wrapper">
                    <h2 class="font-weight-bold text-h6 list-header">
                        {{ jobs.description._cdata }}
                    </h2>
                    <job-item v-for="job in jobs.item" :key="job.link._text" :job="job"></job-item>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import JobItem from './JobItem.vue';

export default {
    components: { JobItem },
    name: 'JobsList',
    props: {
        jobs: {
            type: Object,
        },
    },
};
</script>

<style>
.feed-list-wrapper {
    background: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    margin-top: 155px;
}

.list-header {
    padding: 25px 30px;
}

@media (max-width: 600px) {
    .list-header {
        padding: 25px 15px;
    }
}
</style>
