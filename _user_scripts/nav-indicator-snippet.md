# ナビ・スクロールインジケーター（保留中）

スクロール位置に応じてナビの現在地リンク（HOME/ABOUT/PRODUCTS/CONTACT）の下に
アクセントカラーのバーが滑らかに移動する機能。2026-06-15に実装したが、
今回は不要として無効化。メインページが長くなって再度欲しくなったら以下を復元する。

## `_includes/nav.html`

`<ul class="nav-links">...</ul>` の直後に追加:

```html
<span class="nav-indicator"></span>
```

## `assets/css/style.css`

`.nav-inner` に `position: relative;` を追加し、以下を追加:

```css
.nav-indicator {
  position: absolute;
  bottom: -1px;
  height: 2px;
  background: var(--accent);
  opacity: 0;
  transition: left 0.3s ease, width 0.3s ease, opacity 0.3s ease;
}
```

`@media (max-width: 900px)` 内に追加:

```css
.nav-indicator {
  display: none;
}
```

## `assets/js/nav.js`

`DOMContentLoaded` 内、ライトボックス処理の前に追加:

```js
var indicator = document.querySelector(".nav-indicator");
var navInner = document.querySelector(".nav-inner");
if (indicator && navInner) {
	var sectionLinks = {};
	document.querySelectorAll(".nav-links > li > a").forEach((a) => {
		var hash = a.getAttribute("href").split("#")[1];
		if (hash) sectionLinks[hash] = a;
	});

	var moveIndicator = (link) => {
		var linkRect = link.getBoundingClientRect();
		var innerRect = navInner.getBoundingClientRect();
		indicator.style.left = linkRect.left - innerRect.left + "px";
		indicator.style.width = linkRect.width + "px";
		indicator.style.opacity = "1";
	};

	var sections = Object.keys(sectionLinks)
		.map((id) => document.getElementById(id))
		.filter(Boolean);

	if (sections.length) {
		var observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						moveIndicator(sectionLinks[entry.target.id]);
					}
				});
			},
			{ rootMargin: "-50% 0px -50% 0px" },
		);

		sections.forEach((section) => observer.observe(section));

		window.addEventListener("resize", () => {
			var current = window.location.hash.slice(1) || sections[0].id;
			if (sectionLinks[current]) moveIndicator(sectionLinks[current]);
		});
	}
}
```
