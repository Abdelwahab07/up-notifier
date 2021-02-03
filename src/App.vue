<template>
    <v-app>
        <v-main>
            <div class="main--section" :class="{ 'center-content': isEmpty }">
                <app-header />
                <feed-input :loading="loading" @send-link="validLink" :errorMsg="errorMsg" />
            </div>
            <jobs-list v-if="Object.keys(jobs).length" :jobs="jobs" />
        </v-main>
    </v-app>
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import FeedInput from './components/FeedInput.vue';
import JobsList from './components/JobsList.vue';
import toJson from 'xml-js';
import axios from 'axios';

export default {
    name: 'App',
    components: {
        AppHeader,
        FeedInput,
        JobsList,
    },
    data: () => ({
        loading: false,
        isEmpty: true,
        static_rss: null,
        errorMsg: null,
        jobs: {},
    }),
    methods: {
        validLink(rss_url) {
            this.loading = true;
            axios
                .get(`https://cors-allow.herokuapp.com/${rss_url}`)
                .then((resp) => {
                    console.log(resp);
                    const jobsData = JSON.parse(toJson.xml2json(resp.data, { compact: true }));
                    if (jobsData.rss.channel !== undefined) {
                        this.isEmpty = false;
                        /**
                         * Waiting for header transition to complete
                         */
                        setTimeout(() => {
                            this.static_rss = rss_url;
                        }, 450);
                    } else {
                        this.errorMsg = "Couldn't fetch data from this link";
                    }
                    this.loading = false;
                })
                .catch((error) => {
                    this.errorMsg = `${error}`;
                    this.loading = false;
                });
        },
        autoFetch() {
            axios
                .get(`https://cors-allow.herokuapp.com/${this.static_rss}`)
                .then((resp) => {
                    const jobsData = JSON.parse(toJson.xml2json(resp.data, { compact: true }));
                    const { item, description } = jobsData.rss.channel;
                    this.jobs = { item, description };
                })
                .catch((error) => (this.errorMsg = `${error}`));
        },
    },
    watch: {
        static_rss: function() {
            this.autoFetch();
            setInterval(() => {
                this.autoFetch();
            }, 40000);
        },
    },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap');
.v-application {
    background-color: #f1f2f4 !important;
}

.main--section {
    transition: all 0.5s ease;
    width: 100%;
    position: absolute;
    top: 0%;
    transform: translate(0px, 0px);
}

.center-content {
    top: 45%;
    transform: translate(0, -50%);
}
</style>
