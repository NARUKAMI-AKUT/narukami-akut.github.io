---
layout: default
title: NARUKAMI AKUT
---

<div class="hero home-hero" id="home">
  <img src="{{ '/assets/images/brand/feature.png' | relative_url }}" alt="NARUKAMI AKUT">
</div>

<div class="container">

<section class="section" id="about">

<img class="section-heading" src="{{ '/assets/images/brand/headings/about.png' | relative_url }}" alt="ABOUT">

個人開発者のNARUKAMI AKUT（ナルカミ アクト）のホームページです。<br>
使いやすさにこだわった、生活をちょっと便利にするアプリを開発しています。<br>


</section>

<section class="section" id="products">

<img class="section-heading" src="{{ '/assets/images/brand/headings/roadmap.png' | relative_url }}" alt="ROADMAP">

<div class="timeline-item">
  <div class="timeline-marker">
    <div class="timeline-dot"></div>
    <div class="timeline-line"></div>
  </div>
  <div class="timeline-content">
    <div class="timeline-date">2026-04-21</div>
    <div class="timeline-title">活動開始</div>
    <p>NARUKAMI AKUTとして個人開発活動をスタート。</p>
  </div>
</div>

<div class="timeline-item">
  <div class="timeline-marker">
    <div class="timeline-dot"></div>
    <div class="timeline-line"></div>
  </div>
  <div class="timeline-content">
    <div class="timeline-date">2026-05-14</div>
    <div class="timeline-title">X利用開始</div>
    <p><a href="https://x.com/NARUKAMI_AKUT" target="_blank" rel="noopener">@NARUKAMI_AKUT</a> でX（旧Twitter）の運用を開始。</p>
  </div>
</div>

{% assign apps = site.apps | sort: "order" %}
{% for app in apps %}
<div class="timeline-item">
  <div class="timeline-marker">
    <div class="timeline-dot{% if app.status == 'developing' %} outline{% endif %}"></div>
    {% unless forloop.last %}<div class="timeline-line"></div>{% endunless %}
  </div>
  <div class="timeline-content">
    <div class="timeline-date">{{ app.release_date | default: "開発中" }}</div>
    <div class="timeline-title">
      <a href="{{ app.url | relative_url }}">{{ app.name }}</a>
      <span class="badge badge-{{ app.status }}">{% case app.status %}{% when 'released' %}リリース済み{% when 'internal' %}社内配布{% when 'developing' %}開発中{% endcase %}</span>
    </div>
    <p>{{ app.tagline }}</p>
  </div>
</div>
{% endfor %}

</section>

<section class="section" id="contact">

<img class="section-heading" src="{{ '/assets/images/brand/headings/contact.png' | relative_url }}" alt="CONTACT">

<div class="contact-links">
  <a class="contact-link" href="https://x.com/NARUKAMI_AKUT" target="_blank" rel="noopener">
    <svg class="contact-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"></path>
    </svg>
    <span>@NARUKAMI_AKUT</span>
  </a>
  <a class="contact-link" id="contact-mail" href="#" data-mail="moc.liamg@ved.imakuran">
    <svg class="contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2"></rect>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
    </svg>
    <span>narukami.dev [at] gmail.com</span>
  </a>
</div>

</section>

</div>
