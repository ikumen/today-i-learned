A collection of things I've learned in the form of code snippets, notes, and mini demo applications. 

## Overview 

Infrastructure wise it's a [Quarkus application](https://quarkus.io/) that serves a static site, and API for some application logic to run demos, all running on [Google App Engine](https://cloud.google.com/appengine).

![til-architecture](til-architecture.png)

## Workflow

The workflow goes something like this:

* locally edit and preview Markdown using VS Code
* optionally I can add any application logic for demos since it's just a Java app, again using VS Code
* push my changes to GitHub where an [action](/.github/workflows/build-deploy-appengine.yml) takes the [Markdown and generates](/deploy/static-site/generate.py) the corresponding HTML files 
* finally the GitHub action publishes the newly generated HTML files and application logic to [Google App Engine](https://cloud.google.com/appengine) as a Quarkus application

