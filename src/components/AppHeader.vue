<template>
    <header class="pt-6 pb-5">
        <v-row no-gutters justify="center">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 35 30"
                role="img"
                aria-hidden="true"
            >
                <path
                    fill="#6fda44"
                    d="M27.6 6.9c-3.8 0-6.7 2.5-7.9 6.5-1.8-2.7-3.1-5.7-4-8.8h-4.1v10.6c0 2.1-1.7 3.8-3.8 3.8S4 17.3 4 15.2V4.7H0v10.6c0 4.3 3.5 7.9 7.9 7.9s7.9-3.5 7.9-7.9v-1.8c.8 1.7 1.8 3.3 2.9 4.8L16.2 30h4.2l1.8-8.5c1.6 1.1 3.5 1.7 5.5 1.7 4.5 0 8.1-3.6 8.1-8.1-.1-4.5-3.7-8.2-8.2-8.2zm0 12.2c-1.7-.1-3.3-.7-4.6-1.8l.3-1.6v-.1c.3-1.7 1.3-4.6 4.2-4.6 2.2-.1 4 1.7 4.1 3.9.1 2.2-1.7 4-3.9 4.1l-.1.1z"
                ></path>
            </svg>
            <span>notifier</span>
        </v-row>
    </header>
</template>

<script>
export default {
    name: 'AppHeader',
};
</script>

<style>
header svg {
    width: 55px;
    height: 44px;
    align-self: center;
}

header {
    font-size: 40px;
    font-weight: 600;
    color: #494949;
    line-height: 1;
}
</style>
