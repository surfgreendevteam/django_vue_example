// VueJS  app in a separate file

function domReady(fn) {
    // If we're early to the party
    document.addEventListener("DOMContentLoaded", fn);
    // If late; I mean on time.
    if (document.readyState === "interactive" || document.readyState === "complete") {
        fn();
    }
}


domReady(() => {
    const { createApp } = Vue;
    // initialize the vue app
    createApp({
        delimiters: ['[[', ']]'],

        data() {
            return {
                rules : rules // we are passing the rules from the template
            }
        },

        methods: {
        },
    }).mount('#vue-app');
    });