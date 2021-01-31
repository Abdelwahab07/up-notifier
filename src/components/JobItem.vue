<template>
    <div class="job--item">
        <a :href="job.link" target="_blank">
            <h4
                class="text-body-2 text--black font-weight-bold mb-3 job-title"
                v-html="job.title"
            ></h4>
            <span class="d-block job-info mb-2">
                <span v-if="job.jobType.hasType">
                    <span class="font-weight-bold">{{ job.jobType.type }}</span>
                    <span>: {{ job.jobType.value }} - </span>
                </span>
                <span>
                    <span class="font-weight-bold">Posetd</span>
                    <span>: {{ job.postedDate.relative }}</span>
                </span>
                <span>
                    <span class="font-weight-bold">
                        - {{ job.category }}
                        <template v-if="job.country !== null">-</template>
                    </span>
                </span>
                <span v-if="job.country !== null">
                    <v-icon small class="d-inline">{{ icons.location }}</v-icon>
                    <span class="font-weight-bold"> {{ job.country }} </span>
                </span>
            </span>
            <span class="job-description d-block">
                <span
                    v-html="
                        job.description.showMore
                            ? job.description.original
                            : job.description.truncate
                    "
                ></span>
                <a
                    href="javascript:void(0)"
                    @click="toggleDescription"
                    class="toggel-text"
                    v-if="job.description.needTruncated"
                >
                    {{ !job.description.showMore ? 'more' : 'less' }}
                </a>
            </span>
            <span class="d-block job-info mt-2" v-if="job.skills.hasSkills">
                <span class="font-weight-bold"> Skills: </span>
                <span v-for="(skill, index) in job.skills.value" :key="index">
                    {{ skill }}
                    <template v-if="index != job.skills.value.length - 1">-</template>
                </span>
            </span>
        </a>
    </div>
</template>

<script>
import { format } from 'timeago.js';
import { mdiMapMarker } from '@mdi/js';

export default {
    name: 'JobItem',
    props: {
        job: Object,
    },
    data: () => ({
        icons: {
            location: mdiMapMarker,
        },
    }),
    created: function() {
        this.autoUpdateDate();
    },
    methods: {
        autoUpdateDate() {
            setInterval(() => {
                this.job.postedDate.relative = format(this.job.postedDate.absolute);
            }, 60000);
        },
        toggleDescription() {
            this.job.description.showMore = !this.job.description.showMore;
        },
    },
};
</script>

<style>
.job--item {
    padding: 20px 30px;
    border-top: 1px solid #e0e0e0;
    line-height: 1.35;
}
@media (max-width: 600px) {
    .job--item {
        padding: 20px;
    }
}

.job--item:hover {
    background-color: #f9f9f9;
}

.job--item > a {
    color: inherit !important;
    text-decoration: none;
}

.job--item:hover .job-title {
    color: #37a000;
}

.job-description {
    font-size: 13px;
    font-weight: 500;
}

.toggel-text {
    text-decoration: none;
}

.toggel-text:hover {
    text-decoration: underline;
}

.job-info {
    font-size: 12.5px;
    font-weight: 500;
}
</style>
