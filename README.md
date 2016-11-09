# API Blueprint boilerplate
Note that this project is still under development.

## What does it do?
Bundle markdown files, build them into static HTML documentations, starts a mock server according to the blueprint, and runs a live reload server.

## To use
- Start writing your docs in `src/api.md.`
- Docs will be located in `docs/api.html.`
- Doc server is on `localhost:3000` and mock is on `localhost:8000`.

## Commands
```
gulp  # bundle + mock + doc server
gulp docs  # bundle + doc generation
```

## Based on
- [Drakov](https://github.com/Aconex/drakov)
- [aglio](https://github.com/danielgtaylor/aglio)
- [gulp](https://github.com/gulpjs/gulp)
- [hercule](https://github.com/jamesramsay/hercule)
