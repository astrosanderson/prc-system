/**
 * Sign In / Google Auth Validation Script
 * Implements a clean frontend simulation of Google Authentication for Member & Admin sign-ins.
 * Uses only pure Vanilla Javascript.
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Target the Google Sign-In buttons via DOM selectors
    const memberGoogleBtn = document.querySelector('.card-member .google-btn');
    const adminGoogleBtn  = document.querySelector('.card-admin .google-btn');

    /**
     * Simulates Google Authentication Flow
     * @param {HTMLElement} btn - The clicked button element
     * @param {string} role - 'Member' or 'Admin'
     * @param {string} redirectUrl - Expected URL after successful sign in
     */
    function simulateGoogleAuth(btn, role, redirectUrl) {
        if (!btn) return;

        // Save original inside context for restoration
        const originalContent = btn.innerHTML;
        
        // Step 1: Initial Loading/Validating State
        // Add a spinner from Bootstrap (which is already loaded)
        btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" style="color: currentColor;"></span> Authenticating...`;
        btn.classList.add('disabled', 'opacity-75'); // Visual cue for disabled state
        btn.style.pointerEvents = 'none';            // Prevent double-clicking

        // Simulate network delay for reaching auth validation endpoints
        setTimeout(() => {
            
            // Restore button baseline for the prompt
            btn.innerHTML = originalContent;
            btn.classList.remove('disabled', 'opacity-75');
            btn.style.pointerEvents = 'auto';

            // Step 2: Validation check
            // Because there's no backend framework running our Google APIs, we simulate the validation callback result via confirm.
            const authSuccess = confirm(`(Mock) Google Authentication completed for ${role}.\n\nClick OK to simulate SUCCESSFUL validation.\nClick Cancel to simulate FAILED validation.`);

            if (authSuccess) {
                // Trigger smooth Validation Success UI
                btn.classList.remove('google-btn');
                btn.style.backgroundColor = '#198754'; // Bootstrap success green
                btn.style.color = 'white';
                btn.style.borderColor = '#198754';
                btn.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> ${role} Verified`;

                // Alert and navigate smoothly
                setTimeout(() => {
                    alert(`✅ Validation successful! Welcome, ${role}!\n\n(This would normally redirect to: ${redirectUrl})`);
                    // In a live backend model, you would execute:
                    // window.location.href = redirectUrl;
                    
                    // Reset styling just so you can retry the mock easily
                    btn.removeAttribute('style');
                    btn.classList.add('google-btn');
                    btn.innerHTML = originalContent;
                }, 800);

            } else {
                // Trigger Validation Failed UI
                btn.style.backgroundColor = '#dc3545'; // Bootstrap danger red
                btn.style.color = 'white';
                btn.style.borderColor = '#dc3545';
                btn.innerHTML = `<i class="bi bi-exclamation-circle-fill me-2"></i> Auth Failed`;
                
                setTimeout(() => {
                    alert(`❌ Google Validation Failed for ${role}.\nPlease check your credentials and try again.`);
                    
                    // Revert button to normal state so they can try again
                    btn.removeAttribute('style');
                    btn.classList.add('google-btn');
                    btn.innerHTML = originalContent;
                }, 800);
            }
        }, 1500); // Wait 1.5 seconds simulating network latency
    }

    // 2. Attach Event Handlers checking valid clicks and executing preventing defaults
    if (memberGoogleBtn) {
        memberGoogleBtn.addEventListener('click', (event) => {
            event.preventDefault(); // Don't snap to top or refresh
            simulateGoogleAuth(memberGoogleBtn, 'Member', 'Emmanuel_MemberDashboard.html');
        });
    }

    if (adminGoogleBtn) {
        adminGoogleBtn.addEventListener('click', (event) => {
            event.preventDefault();
            simulateGoogleAuth(adminGoogleBtn, 'Admin', 'Emmanuel_AdminDasboard.html');
        });
    }
});
