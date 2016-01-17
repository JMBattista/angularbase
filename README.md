# Angular Base
Baseline AngularJS application based on John Papa's HotTowel example.
https://github.com/johnpapa/generator-hottowel

This is a modified version of the output from generator-hottowel aimed at enabling easy bootstrapping of an Angular Project. 

## Versions
This repository is for Angular 1.x bootstraping. Once Angular 2 reaches Beta, I'll create a parallel project.

I have chosen to implement the rather small server side example in Koa to minimize the number of languages involved and because the project already uses nodejs for the build system. This can easily be swapped out for other server technologies, so enjoy!

All other dependencies will be updated when it makes sense to do so to keep this starting point as relevant as possible.

# Getting Started
Download a zip of the code and place it into your repository.

Update the description files:
* bower.json
* package.json
* README.md 

Make sure you have nodejs installed 

Run the setup script via npm

```shell
npm run-script setup
```

Start the app!
```shell
gulp serve-dev
```

Now you're ready to rock and roll! See the workflow section to see more about how to leverage the gulp workflow.

# Gulp Workflow
[Gulp](http://gulpjs.com/) is an amazing tool for authoring build systems by chaining large numbers of plugins together.

The core commands of the gulp workflow used in this project are: clean, build, test, autotest, watch and serve-dev. These commands can be triggered from the command line directly or from a number of editors/IDEs that feature gulp integration. If you want to know how to integrate gulp with your editor/IDE of choice please check their documentation.

### Clean/Build/Test 
These are your standard build system commands and aren't terribly exciting.

To remove all files generated by the build process
```shell
    gulp clean
```

To run the build process
```shell
    gulp build
```

To run Tests and Style validation
```shell
    gulp test
```

### Autotest
Now we're getting into more exciting territory courtesy of the *watch* concept. Watches monitor a set of files and can be used to trigger a command when the files are changed.

To start the autotest process
```shell
    gulp autotest
```
    
This will automatically run the test command described above any time you modify a file in your code base. I like to turn this on and keep it up on a second monitor.

### Watch
Building directly on the use of watch in the Autotest command we have a watch command that monitors your files to ensure the build in the dist folder is constantly up to date.

To kick this off run
```shell
    gulp watch
```

As you might expect running the *entire* build process for every file edit would be costly, see the **Speed** sub section for more information.

### Serve Dev
 This builds on what is a common theme for gulp: the power of the watch. Using gulp to start the web server, in this example koa, and then restarting it whenever changes are made to it. 
```shell
    gulp serve-dev
```    

This command also starts the [BrowserSync](https://www.browsersync.io/) plugin, which proxies the website out so that you can connect with an arbitrary number of browsers (within the same WiFi network) and they will be kept in sync with each other and the contents of your dist folder, which are being constantly updated by watch!

Now every time a file is modified and the build process will be re-run to update the .dist folder BrowserSync will automatically push it to all the Browsers you are developing with. Updates to CSS files are pushed without reloading the page allowing for an amazing development experience as you tweak the settings to get them just right. Javascript and HTML changes force the browser to reload the page, but for any reasonable site this will be a very fast operation.

The result of using *autotest* and *serve-dev* together is a fast and fluid workflow process where changes made by the developer are immediately vetted by tests and pushed to their local test instance without any more thought than pressing save. This allows the build tool to get out of the developer's way and speed up the process dramatically.

## Speed
If you read the **watch** sub section above and got worried about the idea that every time you save a file the build system runs on what is potentially thousands of files and images you're quite right: that would be a performance nightmare. 

Instead we intelligently watch for different kinds of changes and only re-run the necessary parts of the build system. This is similar to incremental compilation, and uses three main techniques described below.

###### Only consider relevant files / types
Instead of creating a single large watch \*\*/\*.\* and then kicking off build we instead watch more reasonable components. We don't care about re-building javascript or html when a font changes, or even about our javascript library bundle when changing our own application's javascript code. This helps to quickly limit the scope of a rebuild based on what has changed.

###### Only rebuild the changed files
While limiting the changes to a 'type' is a powerful concept we still don't want to re-drop a hundred images if one changes, so we use this [Recipe](https://github.com/gulpjs/gulp/blob/master/docs/recipes/rebuild-only-files-that-change.md) to ensure that only the modified files are dropped to further streamline the process.

###### Only pass through what is necessary
While only dropping modified files is great for static assets like images and fonts, it doesn't work very well for our html or javascript code where we want it to be bundled before it is dropped. Thats where this [Recipe](https://github.com/gulpjs/gulp/blob/master/docs/recipes/only-pass-through-changed-files.md) comes in. Instead of only passing changed files we cache the outputs of time intensive tasks such as the typescript or babel transpilers and only run them for the modified files before passing them, along with the cached values, into subsequent steps in the pipeline such as concatenation.

## Continuous Integration
Easily add Continuous Integration Support with [Codeship](http://codeship.io). 

Once you're created a project configure the setup as
```shell
nvm install 4.0
npm run-script setup
```

And then configure the test execution ass
```shell
npm test
```

## Enjoy!
I hope this project can be helpful to you in getting started building real AngularJS applications with a fast and fluid workflow.

[ ![Codeship Status for JMBattista/angularbase](https://codeship.com/projects/0dbec4d0-9f6d-0133-d435-46b7f2ce8cb8/status?branch=master)](https://codeship.com/projects/127888)
