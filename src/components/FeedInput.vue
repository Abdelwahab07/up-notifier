<template>
    <v-container>
        <v-row justify="center">
            <v-col col="12" md="8" lg="7">
                <v-text-field
                    label="Jobs RSS feed URL"
                    solo
                    flat
                    dense
                    outlined
                    clearable
                    color="primary"
                    class="custom-input"
                    hide-details="auto"
                    v-model="rss_url"
                    :disabled="loading"
                    :loading="loading"
                    :error-messages="errorMessage"
                >
                    <template v-slot:append v-if="!loading">
                        <v-btn
                            color="primary"
                            class="ma-0 elevation-0 button-group"
                            @click="sendUrl"
                        >
                            <v-icon>
                                {{ icons.rss }}
                            </v-icon>
                        </v-btn>
                    </template>
                </v-text-field>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mdiRss } from '@mdi/js';

export default {
    name: 'FeedInput',
    props: {
        loading: {
            type: Boolean,
            default: false,
        },
        errorMsg: String,
    },
    data: () => ({
        rss_url: null,
        icons: {
            rss: mdiRss,
        },
        errorMessage: null,
    }),
    methods: {
        sendUrl() {
            if (this.rss_url === '' || this.rss_url === null) {
                this.errorMessage = 'This field is required';
            } else {
                try {
                    new URL(this.rss_url);
                    this.errorMessage = '';
                    this.$emit('send-link', this.rss_url);
                } catch (error) {
                    this.errorMessage = `Link not valid, Error: ${error}`;
                }
            }
        },
    },
    watch: {
        errorMsg: function(newValue) {
            this.errorMessage = newValue;
        },
    },
};
</script>

<style>
.custom-input {
    font-size: 14px !important;
}

.custom-input .v-input__slot {
    padding-right: 0 !important;
}

.custom-input .button-group {
    height: 40px !important;
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
}

.v-text-field--outlined fieldset {
    border: 1px solid #e0e0e0 !important;
}

.v-text-field--outlined.v-input--is-focused fieldset,
.v-text-field--outlined.v-input--has-state fieldset {
    border: none;
}
</style>
