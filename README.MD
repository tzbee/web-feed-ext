# crawler-ext

A configurable web feed chrome extension using [React](https://reactjs.org/) and [Redux](https://redux.js.org/). The extension provides customizable web feeds. Each feed retrieves data by using a plugin.
Plugins are hardcoded at the moment, maybe looking for a way to load them dynamically in the future.
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