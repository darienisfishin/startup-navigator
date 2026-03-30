import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/report/"],
    },
    sitemap: "https://www.launch-pilot.com/sitemap.xml",
  };
}
