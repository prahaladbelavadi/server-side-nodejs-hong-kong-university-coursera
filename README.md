# server-side-nodejs-hong-kong-university-coursera
server-side-nodejs-hong-kong-university-coursera mooc course content, examples, excercises

Stat:
https://www.coursera.org/learn/server-side-nodejs/lecture/jvt4y/assignment-3-requirements-video-user-authentication
I wokr and update changes directly to master branch. To view snapshots of stages of the course, you'd have to  approach the repo with day wise commits (IST) or can use bramches or can look for milestone quote references in commit log. There will be mistakes. I correct them as I come aceoss them. Feel free to correct a mistake that you find and open a PR

Often I find that I learn best among people, but remote learning culture makes it increadibly hard. I also prefer sharing notes and homeones once an honest attempt is made trying to solve the problem for it saves time compared to breaking one's head over inconsistensis or minor mistakes. The reason i host this here is to act as a source of reference among the many to compare and debug as a group. By no means do I intend for you to cheat, but if looking at someone else's code can help you understand better, by all means use this. After all we are not the code we write. 

dependencies:
- nodejs
- express
- body-parser
- morgan
- express-generator
passport@0.4.0 passport-local@1.0.0 passport-local-mongoose@5.0.1

there exists a local mongodb file in the repository that isn't being staged; because of a permissions; sudo doesn't work on windows.

Local database store isn't exported. While cloning the repo you might have to add new path local db and instantate a new data store.

/mongodb/data
Set path:`mongod --dbpath=data ``--bind_ip 127.0.0.1`
instructions:https://www.coursera.org/learn/server-side-nodejs/supplement/kQAYt/exercise-instructions-introduction-to-mongodb
mongod datastore is ignored in gitignore


Setting admin: `db.users.update({"username":""admin},{$set:{"admin":"true"}})`

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
- throw new TypeError('JwtStrategy requires a secret or key')
--- 

promoters and dishes connect to the same database, different collections each named: Dishes, Promotions and Leaders
