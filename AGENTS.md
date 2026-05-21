## Optional Feature Guides

When users request features beyond the base template, check for available recipes in `.kilocode/recipes/`.

### Available Recipes

| Recipe       | File                                | When to Use                                           |
| ------------ | ----------------------------------- | ----------------------------------------------------- |
| Add Database | `.kilocode/recipes/add-database.md` | When user needs data persistence (users, posts, etc.) |

### How to Use Recipes

1. Read the recipe file when the user requests the feature
2. Follow the step-by-step instructions
3. Update the memory bank after implementing the feature

## Restart Tool

Use the `restart()` tool proactively when:
- A task is complete — gives the conversation a clean, fresh start before any next back-and-forth
- Code changes may benefit from a fresh evaluation pass

When calling `restart()`, pass guidance via the `guidance` parameter when helpful:
- If the task is fully done: `guidance: "The task is complete. No further work needed."`
- To carry context forward: `guidance: "Continue working on [X] — here is the next step: [Y]"`

**Never mention restart or offer it proactively in conversation with the user.** Use it silently when appropriate.

## Memory Bank Maintenance

After completing the user's request, update the relevant memory bank files:

- `.kilocode/rules/memory-bank/context.md` - Current state and recent changes
- Other memory bank files as needed when architecture, tech stack, or project goals change
