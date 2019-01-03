# server-side-nodejs-hong-kong-university-coursera
server-side-nodejs-hong-kong-university-coursera mooc course content, examples, excercises

Continue from https://www.coursera.org/learn/server-side-nodejs/lecture/ceE9r/exercise-video-rest-api-with-express-mongodb-and-mongoose-part-1

Time Stamp:- 23:03


dependencies:
- nodejs
- express
- body-parser
- morgan
- express-generator


there exists a local mongodb file in the repository that isn't being staged; because of a permissions; sudo doesn't work on windows.

Local database store isn't exported. While cloning the repo you might have to add new path local db and instantate a new data store.

/mongodb/data
Set path:`mongod --dbpath=data --bind_ip 127.0.0.1`
instructions:https://www.coursera.org/learn/server-side-nodejs/supplement/kQAYt/exercise-instructions-introduction-to-mongodb
mongod datastore is ignored in gitignore


Mods: replace the mongoose currency schema with plain string since it wasn't complying and the value type is a string.
Was an edge case scenario.

Reference:
https://github.com/zeeshan87/Server-side-Development-with-NodeJS-Express-and-MongoDB
