TECH STACK USED : 
ReactJs, NodeJs, Sequelize ORM/PostgreSQL

HOW TO RUN :

Root Folder -> npm i

client -> npm i

server -> npm i

USE COMMAND IN THE ROOT FOLDER : npm run dev

Need to create database in PgAdmin - (DB name : justo_assessment). Tables will be created automatically based on schema.

Users and Admin Login Entries will be automatically inserted for the first time. 

ADMIN - Username : justo / Password : 12345

USER - Username : user1 / Password : 12345

USER - Username : user2 / Password : 12345

USER - Username : user3 / Password : 12345

USER - Username : user4 / Password : 12345


Authentication Using Username/Password Done. 
Get One Time Link Done. 
Get Current Server Time Done.
Kickout Done. Once Kicked Out User cannot be able to get time using getTimeAPI.

After 5 incorrect password entries - account will be locked.
After 3 minutes one time link will expire and also the link will work only one time.
All db details are stored in config folder inside server folder.
