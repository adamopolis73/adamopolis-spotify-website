// Gate the whole site behind a username + password (HTTP Basic Auth),
// then serve the normal static files (index.html, styles.css, etc.).
//
// The password is NOT stored here (repo is public). It is read from a
// Cloudflare secret named SITE_PASSWORD, set in the dashboard:
//   Worker → Settings → Variables and Secrets → add Secret "SITE_PASSWORD".
//
// Username is not secret, so it lives here. Change it if you like.

const USERNAME = "music";

export default {
  async fetch(request, env) {
    const password = env.SITE_PASSWORD;
    const header = request.headers.get("Authorization") || "";
    const expected = "Basic " + btoa(USERNAME + ":" + (password || ""));

    // Fail closed: if no password is configured, nobody gets in.
    if (!password || header !== expected) {
      return new Response("Authentication required.", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Adam\'s Playlists", charset="UTF-8"',
          "content-type": "text/plain; charset=utf-8",
        },
      });
    }

    // Authenticated — hand off to the static assets.
    return env.ASSETS.fetch(request);
  },
};
