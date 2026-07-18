document.addEventListener("DOMContentLoaded", () => {
	var toggle = document.querySelector(".nav-toggle");
	var navLinks = document.querySelector(".nav-links");
	var dropdown = document.querySelector(".nav-dropdown");
	var dropdownLink = dropdown ? dropdown.querySelector("a") : null;

	if (toggle && navLinks) {
		toggle.addEventListener("click", () => {
			navLinks.classList.toggle("open");
		});

		navLinks.querySelectorAll("a").forEach((link) => {
			if (link === dropdownLink) return;
			link.addEventListener("click", () => {
				navLinks.classList.remove("open");
				if (dropdown) {
					dropdown.classList.remove("open");
				}
			});
		});
	}

	if (dropdown && dropdownLink) {
		dropdownLink.addEventListener("click", (event) => {
			if (window.matchMedia("(max-width: 900px)").matches) {
				event.preventDefault();
				dropdown.classList.toggle("open");
			}
		});
	}

	var mailLink = document.getElementById("contact-mail");
	if (mailLink) {
		var email = mailLink.dataset.mail.split("").reverse().join("");
		mailLink.href = "mailto:" + email;
		mailLink.querySelector("span").textContent = email;
	}

	var lightbox = document.getElementById("lightbox");
	if (lightbox) {
		var lightboxImg = lightbox.querySelector("img");
		document.querySelectorAll(".screenshots img").forEach((img) => {
			img.addEventListener("click", () => {
				lightboxImg.src = img.src;
				lightboxImg.alt = img.alt;
				lightbox.classList.add("open");
			});
		});
		lightbox.addEventListener("click", () => {
			lightbox.classList.remove("open");
		});
	}

	document.querySelectorAll(".screenshots-wrap").forEach((wrap) => {
		var track = wrap.querySelector(".screenshots");
		var prev = wrap.querySelector(".screenshots-nav-prev");
		var next = wrap.querySelector(".screenshots-nav-next");
		if (!track || !prev || !next) return;

		var updateNav = () => {
			var maxScroll = track.scrollWidth - track.clientWidth;
			prev.classList.toggle("is-hidden", track.scrollLeft <= 4);
			next.classList.toggle("is-hidden", track.scrollLeft >= maxScroll - 4);
		};

		prev.addEventListener("click", () => {
			track.scrollBy({ left: -track.clientWidth * 0.8, behavior: "smooth" });
		});
		next.addEventListener("click", () => {
			track.scrollBy({ left: track.clientWidth * 0.8, behavior: "smooth" });
		});
		track.addEventListener("scroll", updateNav);
		window.addEventListener("resize", updateNav);
		updateNav();
	});
});
