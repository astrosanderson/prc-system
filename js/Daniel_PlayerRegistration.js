// Pre-fill form from URL query params (when coming from edit icon)
window.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    if (params.toString()) {
        // Fill fields
        if (params.get('first')) document.getElementById('firstName').value = params.get('first');
        if (params.get('middle')) document.getElementById('middleName').value = params.get('middle');
        if (params.get('last')) document.getElementById('lastName').value = params.get('last');
        if (params.get('dob')) document.getElementById('dob').value = params.get('dob');
        if (params.get('academy')) document.getElementById('academy').value = params.get('academy');

        // Set age group dropdown
        if (params.get('age')) {
            const sel = document.getElementById('ageGroup');
            const ageVal = params.get('age');
            for (let i = 0; i < sel.options.length; i++) {
                if (sel.options[i].text === ageVal) {
                    sel.selectedIndex = i;
                    break;
                }
            }
        }

        // Change button text to "UPDATE"
        const label = document.getElementById('submitLabel');
        if (label) label.textContent = 'UPDATE PLAYER';

        // Update banner subtitle
        const sub = document.querySelector('.lead.mb-0');
        if (sub) sub.textContent = 'Editing: ' + (params.get('first') || '') + ' ' + (params.get('last') || '');
    }
});
