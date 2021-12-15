A collection of things I've learned in the form of code snippets, notes, and mini demo applications. 

Infrastructure wise it's a Quarkus application that serves a static site, and API for some application logic to run demos, all running on Google App Engine. 

The workflow goes something like this:
* I edit and preview Markdown locally
* optionally I can add any application logic for demos since it's a Java app server
* push my changes to GitHub where an Action will
  1. parse the Markdown and generate a static site
  2. publish the static site and application to Google App Engine

