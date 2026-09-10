/**
 * Edge middleware for static assets.
 * Runs before asset lookup so www never serves a 200 with an apex canonical.
 */
export interface Env {
  ASSETS: Fetcher;
}

const CANONICAL_HOST = '480local.com';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Consolidate indexing signals: www is an alternate of the apex canonical.
    // 301 so Google indexes https://480local.com/ instead of listing www as
    // "Alternate page with proper canonical tag".
    if (url.hostname === `www.${CANONICAL_HOST}`) {
      url.hostname = CANONICAL_HOST;
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
