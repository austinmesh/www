---
layout: layouts/page.html
title: Community Partners
description: Learn how we partner with AISD, UT Austin, and LASA today, or reach out to become a partner.
eleventyNavigation:
  key: Partners
  order: 6
---

<hgroup>
    <h1>Our community partners</h1>
    <p>To partner with Austin Mesh and support your community, <a href="mailto:info@austinmesh.org">reach out to us via email at info@austinmesh.org!</a></p>
    <p>For property owners or facilities teams considering partnering with us, you can find <a href="/join/property-owner-faq-hosting-a-node/">Frequently Asked Questions about hosting Mesh network nodes here</a>.</p>
</hgroup>

<section>
{% for partner in collections.partners %}
    <article>
        <h2 class="partner-heading">{{ partner.data.title }}</h2>
        {% if partner.data.logos %}
        <div class="partner-logos">
            {% for logo in partner.data.logos %}
            <div>
                <img src="{{ logo }}" width="240" alt="Logo of {{ partner.data.title }}" loading="lazy" class="white-bg" />
            </div>
            {% endfor %}
        </div>
        {% endif %}
        {{ partner.content }}
    </article>
{% endfor %}
</section>
