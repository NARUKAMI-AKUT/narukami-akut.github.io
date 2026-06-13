---
layout: default
title: NARUKAMI AKUT
---

<div class="hero" id="home">
  <img src="{{ '/assets/images/brand/feature.png' | relative_url }}" alt="NARUKAMI AKUT">
</div>

<div class="container">

<section class="section" id="about">

## ABOUT

アプリ開発者。使いやすさを大切に、自分が欲しいアプリを作ってます。ユーザーの皆さんの声を大切にしながら、少しずつ成長中📱

NARUKAMI AKUT（ナルカミ アクト）のTakと申します。使いやすさにこだわった、生活をちょっと便利にするアプリをリリースしていきます。

</section>

<section class="section" id="products">

## PRODUCTS

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

## CONTACT

- X: <a href="https://x.com/NARUKAMI_AKUT" target="_blank" rel="noopener">@NARUKAMI_AKUT</a>
- Mail: narukami.dev [at] gmail.com

</section>

</div>
