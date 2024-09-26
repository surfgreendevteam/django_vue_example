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
                rules : rules, // we are passing the rules from the template
                apiOptions: null,
                rulesListApiUrl: '/api/rules/',
                newRule: {
                    protocol: '',
                    source: '',
                    destination: '',
                    destination_port: ''
                    },
                editMode: false, // Add a flag to track if we are in edit mode
                editingRuleId: null, // Store the rule id we are editing
            }
        },

        methods: {
            getCsrfToken() {
                const csrfInput = document.querySelector('input[name="csrfmiddlewaretoken"]');
                return csrfInput ? csrfInput.value : null;
            },
            fetchRulesApiOptions() {
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
                            'X-CSRFToken': this.getCsrfToken(),
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
            this.fetchRulesApiOptions();
        }
    }).mount('#vue-app');
    });