// TOGGLE BUTTON
(function () {
  // Get all elements with the "toggle-button" class
    const toggleButtons = document.querySelectorAll(".toggle-button");

    // Collect all target elements referenced by toggle buttons
    function getAllTargets() {
        const targets = new Set();
        toggleButtons.forEach((btn) => {
            const dataTarget = btn.getAttribute('data-target');
            if (!dataTarget) return;
            dataTarget.split(/\s+/).forEach((id) => {
                const el = document.getElementById(id);
                if (el) targets.add(el);
            });
        });
        return Array.from(targets);
    }

    // Function to hide all toggle targets except the provided one
    function hideAllExcept(targetElement) {
        const allTargets = getAllTargets();
        allTargets.forEach((element) => {
            if (element && element !== targetElement) {
                element.classList.add('hidden'); // Hide the element on small screens
                element.classList.remove('block'); // Remove block display
            }
        });
    }

    // Function to toggle the state of an element (open/close)
    function toggleElement(targetElement) {
        const isHidden = targetElement.classList.contains('hidden');
        hideAllExcept(targetElement);
        targetElement.classList.toggle('hidden', !isHidden);
        targetElement.classList.toggle('block', isHidden);
    }

    toggleButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const dataTarget = this.getAttribute("data-target");
            if (!dataTarget) return;
            const targetIds = dataTarget.split(" ");
            targetIds.forEach((targetId) => {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    toggleElement(targetElement);
                }
            });
        });
    });

    // Add event listener to the document to close elements when a click occurs outside of open elements
    document.addEventListener('click', function (event) {
        const openTargets = getAllTargets().filter((el) => el && !el.classList.contains('hidden'));
        if (openTargets.length === 0) return;
        const clickedOutsideAllTargets = openTargets.every((element) => {
            return !element.contains(event.target) && !event.target.closest('.toggle-button');
        });

        if (clickedOutsideAllTargets) {
            openTargets.forEach((element) => {
                element.classList.add('hidden');
                element.classList.remove('block');
            });
        }
    });

})();
