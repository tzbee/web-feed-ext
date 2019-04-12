# web-feed-ext

A configurable web feed chrome extension using [React](https://reactjs.org/) and [Redux](https://redux.js.org/). The extension provides customizable web feeds. Each feed retrieves data from the web by using a plugin.
Local plugins are hardcoded at the moment(src/background/local-plugins directory). They only serve as examples, due to the chrome API limits.
Native plugins solve that problem and are accessible through native messaging with the [web-feed](https://github.com/tzbee/web-feed) app. They take the form of a npm package and are installed through the [web-feed CLI API](https://github.com/tzbee/web-feed#cli-api). (See repository for more information)
This repository is mostly meant as a concept to improve upon rather than an actual production application.

## Building

Clone the repository

Install the dependencies

`npm install`

Build the app

`npm run dev`

or

`npm run prod`

## Installation

Load the unpacked extension into chrome or pack it yourself first.

## Usage

Create a new feed.

Choose the command(2 available plugins for now) and options.

Follow/Unfollow the feed to activate or deactivate auto updates.

The first example feed retrieves all links from the wikipedia homepage.

The second example feed retrieves the movies opening this week on IMDB.