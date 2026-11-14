# Frontend release

Push the release workflow to `main`, then select **Actions > Release frontend >
Run workflow**, with `main` selected. The workflow requires permission to push
commits and tags to `main`; branch protection or repository Actions settings
may need to permit this.

The workflow releases the current `MAJOR.MINOR.PATCH-SNAPSHOT` version from
`package.json`. It updates `package.json` and `package-lock.json`, commits and
tags the non-SNAPSHOT version as `version/MAJOR.MINOR.PATCH`, tests and builds
that commit, advances `main` to the next patch SNAPSHOT, and attaches the
production build as a ZIP to a GitHub release. Changes pushed by `GITHUB_TOKEN`
do not normally start other push-triggered workflows.

Download the ZIP from the GitHub release and deploy its contents manually to
the server. The workflow does not modify the server.

If publication fails after the commits and tag are pushed, create the GitHub
release manually from the existing tag and attach a ZIP built from that tag.
Do not rerun the workflow to recover that release: `main` has already advanced
to the next version. If an atomic push fails, nothing is pushed; resolve the
reported issue and rerun the workflow.
