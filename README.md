# server-side-nodejs-hong-kong-university-coursera
server-side-nodejs-hong-kong-university-coursera mooc course content, examples, excercises

Continue from https://www.coursera.org/learn/server-side-nodejs/lecture/WNkuW/exercise-video-node-and-the-http-module


dependencies:
- nodejs
- express
- body-parser
- morgan
- express-generator


there exists a local mongodb file in the repository that isn't being staged; because of a permissions; sudo doesn't work on windows.

Local database store isn't exported. While cloning the repo you might have to add new path local db and instantate a new data store.

mongod datastore is ignored in gitignore