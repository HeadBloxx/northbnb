import { svg } from "../chrome.mjs";

const main = `
<section class="notfound">
  <div class="wrap center stack">
    <p class="code">404</p>
    <h1>We can't find that page</h1>
    <p class="lede measure center">The link may be old or mistyped, but Montenegro is still right where you left it. Let's get you back on track.</p>
    <div style="display:flex;flex-wrap:wrap;gap:var(--s-4);justify-content:center;margin-top:var(--s-4)">
      <a class="btn btn--primary btn--lg" href="/search/">${svg("search")} Find a stay</a>
      <a class="btn btn--ghost btn--lg" href="/">Back to home</a>
    </div>
    <p style="margin-top:var(--s-4)">Or <a href="/contact/" style="color:var(--sky-600);text-decoration:underline;text-underline-offset:2px">tell us what you were looking for</a>.</p>
  </div>
</section>
`;

export const notfound = {
  title: "Page not found (404) | NorthB&B",
  desc: "The page you were looking for could not be found. Search stays across Montenegro or head back to the NorthB&B home page.",
  slug: "404",
  file: "404.html",
  noindex: true,
  active: "",
  main,
};
