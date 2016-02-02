# pivotal-ui
[![Build Status](https://travis-ci.org/pivotal-cf/pivotal-ui.svg)](https://travis-ci.org/pivotal-cf/pivotal-ui)

Pivotal UI is a collection of branded, ready-for-use UI components. Built on
top of Bootstrap and React, this library contains everything you need to get
started building UI at Pivotal.

To contribute, see the [contributing readme](CONTRIBUTING.md).

# Table of Contents

- [Check it out!](#check-it-out)
- [Using Pivotal UI on your project](#using-pivotal-ui-on-your-project)
  - [Customizing your PUI build](#customizing-your-pui-build)
- [Including SCSS variables and mixins (optional, beta)](#including-scss-variables-and-mixins-optional-beta)
- [Contributing](#contributing)
- [Copyright Notice](#copyright-notice)

# Check it out!

[Visit the live styleguide](http://styleguide.pivotal.io)  


# Using Pivotal UI on your project

The prefered way to consume Pivotal UI is through npm. Using npm to install PUI
will ensure proper dependency management on your project.

1. Run `npm init` if you don't have a package.json file already.

1. Install [Dr. Frankenstyle](http://github.com/pivotal-cf/dr-frankenstyle).
   This tool looks at your dependencies (those added with --save, **NOT** 
   --save-dev), and compiles the CSS required by these packages.
   
   ```
   npm install --save-dev dr-frankenstyle
   ```

1. Install the Pivotal UI CSS modules

   ```
   npm install --save pui-css-all
   ```

   If you only want to include a few PUI components in your project, see the
   instructions below on [customizing your PUI build](#customizing-your-pui-build).

1. Install jQuery and bootstrap.js

   ```
   npm install --save-dev jquery
   npm install --save-dev bootstrap
   ```

   These installs must happen **after** you've installed the PUI module. This
   ensures you'll get the correct version of bootstrap js.

   **NB** - It's important that you install these modules with `--save-dev`,
   because we don't want Dr. Frankenstyle to pick up any CSS from these
   packages.

1. Run Dr. Frankenstyle to compile your CSS to a folder (we use `./build/` but you can choose whatever makes sense for your project)

   ```
   dr-frankenstyle <path-to-your-asset-build-folder>
   # writes the compiled css to <path-to-your-asset-build-folder>/components.css
   ```

1. Add the css and javascript files to your html template

   ```html
   <!doctype html>
   <html>
     <head>
       <title>...</title>
       <link rel="stylesheet" href="<path-to-your-asset-build-folder>/components.css">
       <script src="<path-to-your-project's-root-folder>/node-modules/jquery/dist/jquery.js"></script>
       <script src="<path-to-your-project's-root-folder>/node-modules/bootstrap/dist/js/bootstrap.js"></script>
     </head>
     <body>
       <!-- ... -->
     </body>
   </html>
   ```

1. Write some CSS/HTML and enjoy!

   ```html
   <!-- ... -->
   <body>
     <div class="container">
       <h1 class="type-brand-1 em-high">Hello world!</h1>
     </div>
   </body>
   <!-- ... -->
   ```

1. Upgrade PUI frequently

   ```
   npm update pui-css-all
   dr-frankenstyle <path-to-your-asset-build-folder>
   ```

   **NB** - You must rerun Dr. Frankenstyle after you update PUI (or add any
   additional CSS module).

## Customizing your PUI build

If you don't want all of Pivotal UI, you can install only the modules you will
need. This will make your resultant CSS smaller! Let's say you're building an
app that only has typography and buttons.

1. Remove the `pui-css-all` module from your project.

   ```
   npm uninstall --save pui-css-all
   ```

1. Add the necessary PUI CSS modules. For this example

   ```
   npm install --save pui-css-typography
   npm install --save pui-css-buttons
   ```

   Use the styleguide to determine which modules you need to install. Each
   component contains module information at the beginning of its docs:

   ![Example of styleguide installation instructions](https://cloud.githubusercontent.com/assets/824157/8711815/22853a7a-2b0a-11e5-862a-a76488de81e8.png)

1. Rerun Dr. Frankenstyle

   ```
   dr-frankenstyle <path-to-your-asset-build-folder>
   ```

1. Every time you install a new PUI CSS package, you will need to rerun
   Dr. Frankenstyle.

   If you're using gulp or grunt or some other task runner,
   look at the [Dr. Frankenstyle docs](http://github.com/pivotal-cf/dr-frankenstyle)
   for how to make this step part of your task workflow.

# Including SCSS variables and mixins (optional, beta)

If you are building CSS using Sass, you can get pivotal-ui variables and mixins
from the [pui-css-variables-and-mixins](https://www.npmjs.com/package/pui-css-variables-and-mixins)
node module.

```
npm install --save pui-css-variables-and-mixins
```

Import the file and use the variables:

```scss
@import '<path-to-your-projects-node-modules>/pui-css-variables-and-mixins/pui-variables.scss';
@import '<path-to-your-projects-node-modules>/pui-css-variables-and-mixins/mixins.scss';

.bg-special {
  background-color: $brand-1;
}
```

# Contributing

If you want a feature added to Pivotal UI, or you've found a bug that needs
fixing, please refer to our [contribution
guidelines](https://github.com/pivotal-cf/pivotal-ui/blob/master/CONTRIBUTING.md).

## Highlights

When creating a pull request, make sure you rebase your branch against our code
base (upstream).  Read our [Commit
guidelines](https://github.com/pivotal-cf/pivotal-ui/blob/master/CONTRIBUTING.md#commit-guidelines)!
We have a very specific syntax for our messages.

# Copyright Notice

Copyright 2015 Pivotal Software, Inc. All Rights Reserved.
