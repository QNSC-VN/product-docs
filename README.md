# product-docs

Central repository for **Business Analysis & Product Design** artifacts across QNSC-VN projects — business requirements, functional specs, mockups, diagrams, and development tracking.

This repo is the single source of truth for *what* we're building and *why*, kept separate from the code repos that implement it.

## Structure

```
product-docs/
├── projects/          # One folder per project
│   └── mini-rally/    # BA design for the Mini Rally project
├── templates/         # Reusable BRD / SRS / user-story templates
└── shared/            # Cross-project assets (brand, design system, references)
```

## Projects

| Project | Description | Folder |
|---------|-------------|--------|
| Mini Rally | Agile project-management tool (backlog, work items, iterations, tracking) | [`projects/mini-rally/`](projects/mini-rally/) |

## Conventions

- **Write docs in Markdown** — versions cleanly, diffs are readable, renders on GitHub.
- **Diagrams as code** where possible — [Mermaid](https://mermaid.js.org/) (renders inline on GitHub) or `.drawio` files.
- **Mockups**: commit *exports* (PNG/PDF) for a point-in-time record; keep the editable source in Figma/Canva and link to it. Prototype apps (e.g. Vite/React mockups) may be committed as source, but their build artifacts (`node_modules/`, `dist/`) are git-ignored.
- **Start new projects from `templates/`** to keep documentation consistent.

## Adding a new project

1. Copy `templates/` docs into `projects/<project-name>/`.
2. Add a `README.md` in the project folder describing scope, stakeholders, and status.
3. Add a row to the **Projects** table above.
