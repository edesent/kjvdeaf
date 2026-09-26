// Vercel "Ignored Build Step": exit 0 skips the build, exit 1 builds.
// The editor commits once per verse, often every 1-2s. Each commit queues a
// full build, and the pile-up trips Vercel's storage/concurrency limits. If
// this commit is no longer the branch tip, a newer build will ship it anyway,
// so skip. Any doubt (non-prod, no token, API error) -> build.
const { VERCEL_ENV, VERCEL_GIT_COMMIT_SHA, VERCEL_GIT_COMMIT_REF,
  VERCEL_GIT_REPO_OWNER, VERCEL_GIT_REPO_SLUG, GITHUB_TOKEN } = process.env;

const build = (why) => { console.log(`Building: ${why}`); process.exit(1); };

if (VERCEL_ENV !== "production") build("not production");
if (!GITHUB_TOKEN || !VERCEL_GIT_COMMIT_SHA) build("missing token or sha");

try {
  const res = await fetch(
    `https://api.github.com/repos/${VERCEL_GIT_REPO_OWNER}/${VERCEL_GIT_REPO_SLUG}/commits/${VERCEL_GIT_COMMIT_REF}`,
    { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: "application/vnd.github.sha" },
      signal: AbortSignal.timeout(10000) },
  );
  if (!res.ok) build(`GitHub API ${res.status}`);
  const tip = (await res.text()).trim();
  if (tip && tip !== VERCEL_GIT_COMMIT_SHA) {
    console.log(`Skipping: ${VERCEL_GIT_COMMIT_SHA.slice(0, 7)} superseded by ${tip.slice(0, 7)}`);
    process.exit(0);
  }
  build("this commit is the branch tip");
} catch (e) {
  build(`check failed (${e.message})`);
}
