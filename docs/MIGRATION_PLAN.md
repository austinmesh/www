# Austin Mesh to Astro Migration Plan

## Overview
This plan outlines migrating the Austin Mesh static HTML website to Astro with a modular, configurable architecture that other mesh groups can easily adopt and customize.

## Phase 1: Project Setup & Configuration System

### 1.1 Initialize Astro Project
```bash
# Create new Astro project
npm create astro@latest mesh-website -- --template minimal --typescript

# Install required dependencies
npm install @astrojs/tailwind @astrojs/sitemap @astrojs/rss
npm install @iconify/json @iconify-json/mdi @iconify-json/simple-icons
npm install astro-icon date-fns
```

### 1.2 Create Configuration System
Create a centralized configuration file for easy customization:

**`src/config/site.ts`**
```typescript
export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  logo: string;
  social: {
    github?: string;
    discord?: string;
    youtube?: string;
    instagram?: string;
    mastodon?: string;
  };
  grafana?: {
    enabled: boolean;
    baseUrl: string;
    dashboards: {
      coverage: string;
      nodes: string;
    };
  };
  theme: {
    primaryColor: string;
    accentColor: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Austin Mesh",
  description: "Community mesh network for Austin, Texas",
  url: "https://austinmesh.org",
  logo: "/assets/logo.svg",
  social: {
    github: "https://github.com/austinmesh",
    discord: "https://discord.gg/austinmesh",
    youtube: "https://youtube.com/@austinmesh",
    instagram: "https://instagram.com/austinmesh"
  },
  grafana: {
    enabled: true,
    baseUrl: "https://grafana.austinmesh.org",
    dashboards: {
      coverage: "d/coverage-map/coverage",
      nodes: "d/node-status/nodes"
    }
  },
  theme: {
    primaryColor: "#3b82f6",
    accentColor: "#06b6d4"
  }
};
```

## Phase 2: Content Collections Setup

### 2.1 Define Collections Schema
**`src/content/config.ts`**
```typescript
import { defineCollection, z } from 'astro:content';

const sponsorsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    tier: z.enum(['platinum', 'gold', 'silver', 'bronze']),
    logo: z.string(),
    website: z.string().url().optional(),
    description: z.string(),
    featured: z.boolean().default(false),
    order: z.number().default(0),
    active: z.boolean().default(true)
  })
});

const eventsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    startDate: z.date(),
    endDate: z.date().optional(),
    location: z.string().optional(),
    registrationUrl: z.string().url().optional(),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    showBanner: z.boolean().default(true),
    bannerText: z.string().optional(),
    tags: z.array(z.string()).default([])
  })
});

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    layout: z.string().default('default'),
    showInNav: z.boolean().default(true),
    navOrder: z.number().default(0),
    lastModified: z.date().optional()
  })
});

export const collections = {
  'sponsors': sponsorsCollection,
  'events': eventsCollection,
  'pages': pagesCollection
};
```

### 2.2 Create Content Structure
```
src/content/
├── sponsors/
│   ├── sponsor-1.md
│   ├── sponsor-2.md
│   └── ...
├── events/
│   ├── mesh-meetup-2024.md
│   └── ...
└── pages/
    ├── about.md
    ├── get-involved.md
    └── ...
```

## Phase 3: Component Architecture

### 3.1 Base Layout Components
**`src/layouts/BaseLayout.astro`**
```astro
---
import { siteConfig } from '../config/site';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import EventBanner from '../components/EventBanner.astro';
import '../styles/global.css';

export interface Props {
  title?: string;
  description?: string;
  showEventBanner?: boolean;
}

const {
  title = siteConfig.name,
  description = siteConfig.description,
  showEventBanner = true
} = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title}</title>
  <meta name="description" content={description}>
  <link rel="icon" type="image/svg+xml" href="/favicon.svg">
</head>
<body>
  {showEventBanner && <EventBanner />}
  <Header />
  <main>
    <slot />
  </main>
  <Footer />
</body>
</html>
```

### 3.2 Event Banner Component
**`src/components/EventBanner.astro`**
```astro
---
import { getCollection } from 'astro:content';
import { Icon } from 'astro-icon/components';

// Get active events
const events = await getCollection('events', (event) => {
  const now = new Date();
  const eventStart = new Date(event.data.startDate);
  const eventEnd = event.data.endDate ? new Date(event.data.endDate) : eventStart;

  return event.data.showBanner &&
         eventStart <= now &&
         eventEnd >= now;
});

// Sort by priority and date
const activeEvent = events
  .sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.data.priority] - priorityOrder[a.data.priority];
  })[0];
---

{activeEvent && (
  <div class="event-banner bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <Icon name="mdi:calendar-star" class="w-5 h-5" />
        <div>
          <span class="font-semibold">
            {activeEvent.data.bannerText || activeEvent.data.title}
          </span>
          {activeEvent.data.location && (
            <span class="ml-2 text-sm opacity-90">
              @ {activeEvent.data.location}
            </span>
          )}
        </div>
      </div>

      {activeEvent.data.registrationUrl && (
        <a
          href={activeEvent.data.registrationUrl}
          class="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Register
        </a>
      )}
    </div>
  </div>
)}

<style>
  .event-banner {
    position: relative;
    z-index: 50;
  }
</style>
```

### 3.3 Sponsors Component
**`src/components/SponsorsSection.astro`**
```astro
---
import { getCollection } from 'astro:content';

export interface Props {
  tier?: 'platinum' | 'gold' | 'silver' | 'bronze';
  featured?: boolean;
  limit?: number;
}

const { tier, featured, limit } = Astro.props;

let sponsors = await getCollection('sponsors', (sponsor) => {
  if (!sponsor.data.active) return false;
  if (tier && sponsor.data.tier !== tier) return false;
  if (featured !== undefined && sponsor.data.featured !== featured) return false;
  return true;
});

// Sort by order, then by name
sponsors = sponsors
  .sort((a, b) => {
    if (a.data.order !== b.data.order) {
      return a.data.order - b.data.order;
    }
    return a.data.name.localeCompare(b.data.name);
  })
  .slice(0, limit || sponsors.length);
---

<section class="sponsors-section py-12">
  <div class="container mx-auto px-4">
    <h2 class="text-3xl font-bold text-center mb-8">
      {tier ? `${tier.charAt(0).toUpperCase() + tier.slice(1)} Sponsors` : 'Our Sponsors'}
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {sponsors.map((sponsor) => (
        <div class="sponsor-card bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div class="flex items-center justify-center mb-4">
            <img
              src={sponsor.data.logo}
              alt={`${sponsor.data.name} logo`}
              class="max-h-16 max-w-full object-contain"
            />
          </div>

          <h3 class="text-xl font-semibold text-center mb-2">
            {sponsor.data.website ? (
              <a href={sponsor.data.website} class="hover:text-blue-600 transition-colors">
                {sponsor.data.name}
              </a>
            ) : (
              sponsor.data.name
            )}
          </h3>

          <p class="text-gray-600 text-center text-sm">
            {sponsor.data.description}
          </p>

          <div class="mt-4 text-center">
            <span class={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
              sponsor.data.tier === 'platinum' ? 'bg-gray-100 text-gray-800' :
              sponsor.data.tier === 'gold' ? 'bg-yellow-100 text-yellow-800' :
              sponsor.data.tier === 'silver' ? 'bg-gray-100 text-gray-600' :
              'bg-orange-100 text-orange-800'
            }`}>
              {sponsor.data.tier}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

### 3.4 Grafana Metrics Component
**`src/components/GrafanaMetrics.astro`**
```astro
---
import { siteConfig } from '../config/site';
import { Icon } from 'astro-icon/components';

export interface Props {
  dashboard: 'coverage' | 'nodes';
  title?: string;
  height?: string;
  showFullscreenLink?: boolean;
}

const {
  dashboard,
  title = dashboard === 'coverage' ? 'Network Coverage' : 'Node Status',
  height = '400px',
  showFullscreenLink = true
} = Astro.props;

const grafanaConfig = siteConfig.grafana;

if (!grafanaConfig?.enabled) {
  return null;
}

const dashboardUrl = grafanaConfig.dashboards[dashboard];
const embedUrl = `${grafanaConfig.baseUrl}/${dashboardUrl}?orgId=1&kiosk&theme=light`;
const fullUrl = `${grafanaConfig.baseUrl}/${dashboardUrl}`;
---

{grafanaConfig.enabled && (
  <div class="grafana-metrics bg-white rounded-lg shadow-lg p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-semibold flex items-center">
        <Icon name="mdi:chart-line" class="w-5 h-5 mr-2" />
        {title}
      </h3>

      {showFullscreenLink && (
        <a
          href={fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 hover:text-blue-800 flex items-center text-sm"
        >
          <Icon name="mdi:open-in-new" class="w-4 h-4 mr-1" />
          View Full Dashboard
        </a>
      )}
    </div>

    <div class="grafana-embed" style={`height: ${height}`}>
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        frameborder="0"
        title={title}
        class="rounded border"
      ></iframe>
    </div>
  </div>
)}

<style>
  .grafana-embed iframe {
    border: 1px solid #e5e7eb;
  }
</style>
```

### 3.5 Social Media Component
**`src/components/SocialLinks.astro`**
```astro
---
import { siteConfig } from '../config/site';
import { Icon } from 'astro-icon/components';

export interface Props {
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
}

const { size = 'md', orientation = 'horizontal' } = Astro.props;

const social = siteConfig.social;

const iconMap = {
  github: 'simple-icons:github',
  discord: 'simple-icons:discord',
  youtube: 'simple-icons:youtube',
  instagram: 'simple-icons:instagram',
  mastodon: 'simple-icons:mastodon'
};

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8'
};

const socialEntries = Object.entries(social).filter(([_, url]) => url);
---

<div class={`social-links ${orientation === 'vertical' ? 'flex flex-col space-y-2' : 'flex space-x-4'}`}>
  {socialEntries.map(([platform, url]) => (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      class="text-gray-600 hover:text-blue-600 transition-colors"
      aria-label={`Follow us on ${platform}`}
    >
      <Icon name={iconMap[platform]} class={sizeClasses[size]} />
    </a>
  ))}
</div>
```

## Phase 4: Migration Strategy

### 4.1 Content Migration Process
1. **Audit existing HTML pages** and identify reusable components
2. **Extract content** from HTML into Markdown files
3. **Convert HTML components** to Astro components
4. **Map existing assets** and update paths
5. **Create content collection entries** for sponsors and events

### 4.2 Page Templates
Create page templates that other mesh groups can easily customize:

**`src/pages/index.astro`**
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SponsorsSection from '../components/SponsorsSection.astro';
import GrafanaMetrics from '../components/GrafanaMetrics.astro';
import { siteConfig } from '../config/site';
---

<BaseLayout title={siteConfig.name} description={siteConfig.description}>
  <div class="hero-section bg-gradient-to-br from-blue-50 to-cyan-50 py-20">
    <div class="container mx-auto px-4 text-center">
      <img src={siteConfig.logo} alt={siteConfig.name} class="mx-auto mb-6 h-24">
      <h1 class="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
        {siteConfig.name}
      </h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        {siteConfig.description}
      </p>
    </div>
  </div>

  <GrafanaMetrics dashboard="coverage" />

  <SponsorsSection featured={true} limit={6} />
</BaseLayout>
```

### 4.3 Configuration for Other Mesh Groups
Create a setup guide and template configuration:

**`MESH_SETUP.md`**
```markdown
# Setting Up Your Mesh Website

## Quick Start
1. Fork this repository
2. Update `src/config/site.ts` with your mesh information
3. Replace logo and assets in `public/assets/`
4. Add your sponsors to `src/content/sponsors/`
5. Deploy to your preferred hosting service

## Configuration Options
- Site name, description, and branding
- Social media links
- Grafana dashboard integration
- Theme colors
- Sponsor tiers and information
- Event management
```

## Phase 5: Implementation Steps

### 5.1 Development Phases
1. **Phase 1**: Set up basic Astro project with configuration system
2. **Phase 2**: Create content collections and basic components
3. **Phase 3**: Migrate existing pages and content
4. **Phase 4**: Add advanced features (events, Grafana integration)
5. **Phase 5**: Testing and optimization
6. **Phase 6**: Documentation and deployment

### 5.2 Commands for Claude Code
```bash
# Initialize and setup
mesh-migrate init

# Content migration
mesh-migrate content --source ./existing-site --target ./src/content

# Component generation
mesh-migrate components --create sponsors,events,metrics

# Configuration setup
mesh-migrate config --template austinmesh

# Build and deploy
mesh-migrate build --env production
mesh-migrate deploy --platform netlify
```

## Phase 6: Benefits for Other Mesh Groups

### 6.1 Easy Customization
- Single configuration file for all site settings
- Modular component system
- Pre-built templates for common mesh website needs
- Automated event management with expiration

### 6.2 Maintainability
- Type-safe configuration with TypeScript
- Content collections for structured data
- Automated builds and deployments
- SEO optimization built-in

### 6.3 Scalability
- Static site generation for fast loading
- Modern build tools and optimization
- Easy integration with external services
- Responsive design out of the box

This plan provides a comprehensive framework for migrating to Astro while creating a reusable template that other mesh groups can easily adopt and customize for their own needs.
