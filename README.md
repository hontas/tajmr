tajmr
=====
> Record time sometime [tajmr](https://hontas.github.io/tajmr/)

1. Press play to start recording time.
2. Then pause it.
3. Add a note if you want.
4. Get paid (tajmr won't help with this)

![Tajmr](tajmr.png)

## dev
```shell
npm run dev
```

## deploy
Deployed to GitHub Pages (source: GitHub Actions) by the **Build and Deploy** workflow. Run it manually
from the Actions tab; it only runs on `main`. The `build` job lints, tests and builds (in the
`production` environment, which holds `SENTRY_AUTH_TOKEN`), then the `deploy` job publishes the
artifact to the `github-pages` environment.
