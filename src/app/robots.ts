import type { MetadataRoute } from "next";

/**
 * Not publicly launched yet - block all indexing.
 * Remove this file (or flip to `allow`) at launch.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", disallow: "/" }],
  };
}
