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
    discord: "https://discord.gg/6a5Sv2s9bG",
    youtube: "https://youtube.com/channel/UCtFl5gdwv0SdrP8sHlDMKNA",
    instagram: "https://www.instagram.com/p/Cq0jOpYLpZy/"
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
    primaryColor: "#67EA94",
    accentColor: "#2ce26a"
  }
};