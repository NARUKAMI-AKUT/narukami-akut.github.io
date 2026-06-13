document.addEventListener("DOMContentLoaded", () => {
	var toggle = document.querySelector(".nav-toggle");
	var navLinks = document.querySelector(".nav-links");
	if (toggle && navLinks) {
		toggle.addEventListener("click", () => {
			navLinks.classList.toggle("open");
		});
	}

	var dropdown = document.querySelector(".nav-dropdown");
	if (dropdown) {
		var dropdownLink = dropdown.querySelector("a");
		dropdownLink.addEventListener("click", (event) => {
			if (window.matchMedia("(max-width: 900px)").matches) {
				event.preventDefault();
				dropdown.classList.toggle("open");
			}
		});
	}
});
