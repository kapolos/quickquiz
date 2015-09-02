# Quick Quiz

A responsive survey app for multiple choice questions as an SPA

Technologies used: 

* Ember.js
* Node.js
* Express
* SequelizeJS
* MySQL & Sqlite

### Description

An admin enters survey questions with multiple choice answers. Full CRUD is supported (with inline editing).
 
When a guest visits the app in a browser it should present a random survey
question to the guest and allow them to answer.

It records answers and displays the survey results in an admin interface.

It will never show a previously answered question to the same guest.

The UI is mobile browser friendly.


### Compatibility

It uses Flexbox as a CSS model. This means that supported browsers are:

* IE11+
* FF 38+
* Chrome 31+
* Safari 7.1+ 
* Opera 30+ 
* iOS Safari 7.1+ 
* Android 4.4+


### Conceptual notes

There are 2 parts that compose this project. The front-end is an `Ember.js` SPA and sits inside the `ember` directory.
The backend server is an `Express` based app and sits inside the `express` directory.

The `Express` server handles both the API and the serving of the `Ember.js` site.  

### Installation

It is assumed that you have a working MySQL setup. For this project, simply create an empty database and it will
setup the rest.

First, you need Node/Io.js installed alnong with `npm`. This project has been tested with io.js __2.x__.

```bash
cd express
npm install
```

This will install all dependencies and that's it.

### Configuration

Adjust `express/config/default.json` to match your MySQL setup, set a password
for the administration pages and the port for the express server (default: 4200)

### Execution

```bash
npm start
```

### Tests

To run the test suit, you will need `mocha`

```bash
npm install -g mocha
```

Then in the `express` directory:

```bash
npm test
```

The tests are run with SQLite3 as a persistence layer.

````
Resetting DB...
Webserver started on port 4201
  Question/Answer
    Associations
      ✓ should create a new answer, associate it with the question and return the instance
      ✓ should return all the answers along with the question
      ✓ should have removed the answers when removing the question

  API
    Public
      ✓ should return a single question for an unidentified user (in JSON)
      ✓ should return a single question for an identified user (in JSON)
      ✓ should store a response for the previously identified user
    Admin
      ✓ should return 403 if not authenticated
      ✓ auth should return true with the right credential
      ✓ should create a new question
      ✓ should update the previous question
      ✓ should create a new answer associated with the previous question
      ✓ should update the previous answer
      ✓ should remove the previous answer
      ✓ should remove the previous question
      ✓ should get the list of the results


  15 passing (317ms)

````

### Development

The `Ember.js` SPA is delivered pre-built. To be able to make changes, you have to follow the directions bellow
(it is assumed that the command bellow are given inside the `ember` folder as a working directory).

You will need to have the common build tools installed in your machine (like python).

Install `ember-cli`

```bash
npm install -g ember-cli
```

Install the project dependencies but read the caveats at the end of this document.

```bash
npm install
bower install
```

Now you are ready to make changes to the Ember code. To have the changes reflected to the actual site:
```
cd app
ember build 
```

Alternatively, consider `ember build -w` so that it continually re-builds once it detects changes. This way,
you will not have to manually do the builds every time.

The changes will be reflected to the site once the build completes, since the `express` app is configured to serve
the files from the build directory.

For a production build, also add the `--environment=production` option.

#### Caveats

If you are installing as root (which you shouldn't but perhaps you are installing inside a VM or container), then
you should know that the `bower` part ofthe installation will fail because it blocks execution from `root` by default.
To fix this, create `/root/.bowerrc` with `{"allow_root": true}` as content.

io.js 3.x will fail to install the dependencies because `libsass` does not support it. 3.x has broken a lot of native
 modules and the authors have not updated them yet. So make sure to use 2.x
