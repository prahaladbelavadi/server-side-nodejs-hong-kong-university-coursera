# server-side-nodejs-hong-kong-university-coursera
server-side-nodejs-hong-kong-university-coursera mooc course content, examples, excercises

Continue from Week 3

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


To learn: how to use a server side debugger;
Bugs/Errors:
- Semicolons
- Returning dishes instead of dish or comments of dish; basically something that wasn't in the function scope
- added colon to the reqest paramenter iteself; the req always failed because the req wasn't sent properly.
- sending irrelevant data in the req; like delete req had body when it wasn't necessary or used on the backend
- cast to object id failed for value; doesn;t work; same rror : Cast to ObjectId failed for value; This likely happened because I was returning something that wasn't even in the scope of the function call or parsing req.body in the server when the request carried no body or misplacing req.body for req.params.dishId
- send request as an invalid type; Like the client sends a reques, it turns out to be in text or xml or some other format and the backend expects json in which case it throws up an error.
- Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they
are sent to the client
- 
--- 

promoters and dishes connect to the same database, different collections each named: Dishes, Promotions and Leaders