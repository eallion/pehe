# Pehe

**Pehe**: Pehtheme-hugo Enhanced.

> [!WARNING]
> 🚨 **This theme is not ready for out-of-the-box use.**

## Enhanced

- **With originally features.**
- Bugs fixed.
- Features refined.
- Dark mode support.
- Pagefind for search.
- etc...

Pehe is an open-source Hugo theme forked from [Pehtheme Hugo](https://github.com/fauzanmy/pehtheme-hugo).
Inspired by [Material Design v3](https://m3.material.io/), lovingly crafted using [Tailwind CSS v4](https://tailwindcss.com/docs/installation/using-postcss).

## Screenshot

<div align="center">
  <img src="images/screenshot.png?raw=true" width="85%" alt="Pehe"/>
</div>

## Live Demo

Check out the live demo: [https://www.eallion.com](https://www.eallion.com)

## Performance Testing

To assess the performance of your website using Pehtheme Hugo, utilize the PageSpeed Insights tool. Click the button below to run a PageSpeed Insights test:

[PageSpeed Insights Test](https://pagespeed.web.dev/analysis/https-www-eallion-com/et1tnyft0n?form_factor=desktop)

## Features

- Built with Tailwind CSS v4
- Darkmode support
- WCAG compliance
- Selection posts displayed on the homepage
- Horizontal menus, content tags list
- No JavaScript dependencies
- Vanilla JS toggle button (Theme, Toc, Copy.)
- Two-column blog layout
- Sidebar with a table of contents for the current post
- [or] (if no Toc) Sidebar with one recent post
- Sidebar Profile
- Pagefind for search
- Semantic HTML

## Installation

To get started with Pehe, follow these steps:

1. Install Hugo and create a new site. For detailed instructions, refer to [Hugo's Quick Start Guide](https://gohugo.io/getting-started/quick-start/).

2. Add Pehe to your project:

    ```bash
    git submodule add https://github.com/eallion/pehe.git themes/pehe
    # or
    # git clone https://github.com/eallion/pehe.git themes/pehe
    ```

3. Simply copy the following folders and contents from the `exampleSite` directory to the root of your project:

    ```bash
    themes/pehe/exampleSite/
    ├── assets
    │   ├── chroma.css
    │   ├── custom.css
    │   └── input.css
    ├── config
    │   └── _default
    │       ├── hugo.toml
    │       ├── markup.toml
    │       ├── mediaTypes.toml
    │       ├── menus.toml
    │       ├── module.toml
    │       ├── outputs.toml
    │       ├── params.toml
    │       ├── permalinks.toml
    │       ├── related.toml
    │       ├── sitemap.toml
    │       └── taxonomies.toml
    ├── content
    │   ├── _index.md
    │   ├── about.md
    │   └── blog
    │       └── hello-world.md
    ├── package.json
    └── postcss.config.js
    ```

4. Start Hugo:

    ```bash
    pnpm install
    pnpm dev
    # pnpm build
    ```

## Configuration

You can configure Hugo and Pehe in your config file `config/_default/hugo.toml`:

```toml
baseURL = 'https://www.eallion.com/'
defaultContentLanguage = "zh-cn"
languageCode = 'zh-cn'
languageName = "简体中文"
title = "eallion's Blog"
theme = 'pehe'

[pagination]
  pagerSize = 10

[markup]
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true

+++
```

## Custom Theme

1. Ensure you have NodeJS installed on your desktop.

2. Copy the Node.js configuration files from the `exampleSite` directory to the root of your Hugo project:

    ```bash
    themes/pehe/exampleSite/
    ├── assets
    │   ├── chroma.css
    │   ├── custom.css
    │   └── input.css
    ├── config
    │   └── _default
    │       ├── hugo.toml
    │       ├── markup.toml
    │       ├── mediaTypes.toml
    │       ├── menus.toml
    │       ├── module.toml
    │       ├── outputs.toml
    │       ├── params.toml
    │       ├── permalinks.toml
    │       ├── related.toml
    │       ├── sitemap.toml
    │       └── taxonomies.toml
    ├── content
    │   ├── _index.md
    │   ├── about.md
    │   └── blog
    │       └── hello-world.md
    ├── package.json
    └── postcss.config.js
    ```

3. Customizing the Hugo Theme

    After adding the theme, you can start customizing Hugo by leveraging Hugo's [template lookup order](https://gohugo.io/templates/lookup-order/).

    This means you can **override** the theme's files using your local `layouts/` directory.

    **How to Override Files**

    If you wish to override a file, you have two options:

    1. **Create a file** with the same name in your root `layouts/` directory.
    2. **Copy the file** from `themes/pehe/layouts/{*}.html` to your `layouts/{*}.html` directory and then modify it.

    This approach keeps the theme submodule **clean** and **easy to update**, allowing you to keep all your customizations isolated within your project's `layouts/` directory.

4. How they work:

   - `chroma.css` contains Chroma CSS styles for syntax highlighting.
   - `custom.css` contains custom CSS styles for the theme.
   - `input.css` contains the input CSS styles for the theme.
   - `config/_default/*.toml` are the Hugo configuration files.
   - `package.json` contains the dependencies and scripts for building the theme.
   - `postcss.config.js` configures PostCSS to use Tailwind CSS and Autoprefixer for processing CSS files.

5. Run the following command to install necessary dependencies:

    ```bash
    pnpm install
    ```

6. Generate the Chroma syntax highlight CSS file (replace `onedark` with your preferred style):

    ```bash
    hugo gen chromastyles --style=onedark > assets/css/chroma.css
    ```

7. Customize the theme with Tailwind CSS using the following command:

    ```bash
    pnpm dev
    # pnpm dev:css
    # pnpm dev:hugo
    # pnpm dev:pagefind
    ```

8. To build the website, execute the command:

    ```bash
    pnpm build
    # pnpm build:chroma
    # pnpm build:css
    # pnpm build:hugo
    # pnpm build:pagefind
    ```

9. Icons save in `assets/icons`

    Usage:

    ```html
    # Simple:
    {{ partial "icon.html" "github" }}
    # Advanced:
    {{ partial "icon.html" (dict "name" "github" "class" "w-6 h-6 text-red-500") }}
    ```
10. Custom JS

    Put custom js into custom folder:

    ```bash
    assets/js/custom/*.js
    ```

## License

Pehtheme Hugo is MIT Licensed. For more details, see the [LICENSE](https://github.com/eallion/pehe/blob/main/LICENSE) file.

## Logo Icon

Egg fried icon source: [Bootstrap Icons - Egg Fried](https://icons.getbootstrap.com/icons/egg-fried/).

Other icons from  [Simple Icons](https://simpleicons.org/) & [Iconify](https://iconify.design/).

## Photo Credits

Image credits used in the live preview:

    ```
    Default Featured Image:
    - https://unsplash.com/photos/OtXJhYjbKeg
    ```
