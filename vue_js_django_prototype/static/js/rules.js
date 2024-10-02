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
        /**
         * Vue.js uses {{ }} for its templating syntax, which conflicts with Django's template tags.
         * To avoid this conflict, the delimiters in the Vue.js application are changed to [[ ]] using the delimiters property.
         */

        data() {
            return {
                rules : rules, // we are passing the rules from the templates context to the vue app
                rulesFromApi: [],
                apiOptions: null,  // API options for creating/updating rules
                rulesListApiUrl: '/api/rules/',   // URL for the rules API
                newRule: {        // Form data for creating/updating a rule
                    protocol: '',
                    source: '',
                    destination: '',
                    destination_port: ''
                    },
                editMode: false, // Flag to track if we are in edit mode
                editingRuleId: null, // Store the rule id we are editing
            }
        },

        methods: {
            getCsrfToken() {
                // Fetch CSRF token from a hidden input field to use in POST, PUT, DELETE requests
                const csrfInput = document.querySelector('input[name="csrfmiddlewaretoken"]');
                return csrfInput ? csrfInput.value : null;
            },

            fetchRulesApiOptions() {
                // Fetch API options to understand available actions this is useful but optional
                fetch(this.rulesListApiUrl, {
                    method: 'OPTIONS',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    if (data.actions) {
                        this.apiOptions = data.actions;

                    }
                    console.log('API Options:', this.apiOptions)
                })
                .catch(error => {
                    console.error('Error fetching options:', error);
                });
            },

            /**
             * Fetches rules from the API and updates the `rules` data property.
             *
             * This method sends a GET request to the `rulesListApiUrl` to fetch the rules.
             * The fetched rules are then assigned to the `rules` data property.
             *
             * Comparison to getting rules from context through the template:
             * - Context through template: The rules are passed from the Django context to the template and saved to a JavaScript variable.
             *                              This approach is faster as the data is already available when the page loads.
             * - Fetching from API: This method fetches the rules from the API after the page has loaded.
             *                      This approach is more dynamic and can be used to refresh the data without reloading the page.
             *
             * Note: This variable (ruelsFromApi) defined form within this method is not applied at the moment.
             */
            fetchRulesFromApi() {

                fetch(this.rulesListApiUrl, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => response.json())
                .then(data => {
                    this.rulesFromApi = data;
                    console.log('Rules fetched from API:', data);
                })
                .catch(error => {
                    console.error('Error fetching rules:', error);
                });
            },

            createRule() {
                // If in edit mode, update the rule instead of creating it
                if (this.editMode) {
                    this.updateRule();
                } else {
                    // Create a new rule
                    fetch(this.rulesListApiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFToken': this.getCsrfToken(),  // // Include CSRF token
                        },
                        body: JSON.stringify(this.newRule),
                    })
                    .then(response => response.json())
                    .then(data => {
                        this.rules.push(data);
                        this.resetForm();
                        console.log('Rule created:', data);
                    })
                    .catch(error => {
                        console.error('Error creating rule:', error);
                    });
                }
            },

            editRule(rule, index) {
                // Pre-fill the form with the selected rule data
                this.newRule = { ...rule };
                this.editMode = true; // Enable edit mode
                this.editingRuleId = rule.id; // Save the rule ID
            },

            updateRule() {
                // Send a PUT request to update the rule
                fetch(`${this.rulesListApiUrl}${this.editingRuleId}/`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': this.getCsrfToken(),
                    },
                    body: JSON.stringify(this.newRule),
                })
                .then(response => response.json())
                .then(updatedRule => {
                    // Find the rule in the list and update it
                    const index = this.rules.findIndex(rule => rule.id === this.editingRuleId);
                    this.rules.splice(index, 1, updatedRule);
                    this.resetForm();
                    console.log('Rule updated:', updatedRule);
                })
                .catch(error => {
                    console.error('Error updating rule:', error);
                });
            },

            deleteRule(ruleId) {
                console.log('Deleting rule:', ruleId);
                // Send a DELETE request to remove the rule
                fetch(`${this.rulesListApiUrl}${ruleId}/`, {
                    method: 'DELETE',
                    headers: {
                        'X-CSRFToken': this.getCsrfToken(),
                    },
                })
                .then(() => {
                    // Find the rule by ID and remove it from the rules array
                    const ruleIndex = this.rules.findIndex(rule => rule.id === ruleId);
                    if (ruleIndex !== -1) {
                        this.rules.splice(ruleIndex, 1); // Remove the rule from the array
                    }
                    console.log('Rule deleted');
                })
                .catch(error => {
                    console.error('Error deleting rule:', error);
                });
            },

            resetForm() {
                // Reset the form and exit edit mode
                this.newRule = {
                    protocol: '',
                    source: '',
                    destination: '',
                    destination_port: ''
                };
                this.editMode = false;
                this.editingRuleId = null;
            },
        },

        beforeMount() {
            // Fetch available API options before the Vue component is mounted
            this.fetchRulesApiOptions();
            this.fetchRulesFromApi();
        }
    }).mount('#vue-app');
    });
