/**
 * Signin Form Validation Script
 * Applies basic Vanilla JS DOM validation to ensure the page runs smoothly
 */

document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signinForm');
    
    if (signinForm) {
        // Handle form submission
        signinForm.addEventListener('submit', function(event) {
            let isValid = true;

            const emailInput = document.getElementById('emailInput');
            const passwordInput = document.getElementById('passwordInput');
            
            const emailError = document.getElementById('emailError');
            const passwordError = document.getElementById('passwordError');

            // Reset field states before validation
            emailInput.classList.remove('is-invalid');
            passwordInput.classList.remove('is-invalid');
            emailError.textContent = '';
            passwordError.textContent = '';

            // 1. Validate Email
            const emailValue = emailInput.value.trim();
            // Basic email regex pattern
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (emailValue === '') {
                isValid = false;
                emailInput.classList.add('is-invalid');
                emailError.textContent = 'Email address is required.';
            } else if (!emailRegex.test(emailValue)) {
                isValid = false;
                emailInput.classList.add('is-invalid');
                emailError.textContent = 'Please enter a valid email address.';
            }

            // 2. Validate Password
            const passwordValue = passwordInput.value;
            if (passwordValue === '') {
                isValid = false;
                passwordInput.classList.add('is-invalid');
                passwordError.textContent = 'Password is required.';
            } else if (passwordValue.length < 6) {
                isValid = false;
                passwordInput.classList.add('is-invalid');
                passwordError.textContent = 'Password must be at least 6 characters.';
            }

            // If validation fails, prevent the form from submitting
            if (!isValid) {
                event.preventDefault();
                event.stopPropagation();
            }
            // If valid, form normally proceeds to the action URL ('admin.html')
        });

        // Clear error styling dynamically when the user starts typing
        const inputs = signinForm.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid')) {
                    input.classList.remove('is-invalid');
                }
            });
        });
    }
});
