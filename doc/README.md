# ARC Management System (Team 28)

## Project Summary
This project aims to build a management system which will provide a comprehensive view of the facilities atthe Activities and Recreation Center at UIUC. The system will have an interactive web User Interfacewhich  will  allow  the  students  to  book  courts  for  sports  and equipment(gym  or otherwise) on  a  slot-wise  basis.  The userscan  also  performactions  like  viewing, updating,and cancelling the bookingsin a hassle-free manner. This process will also optimize the booking of the sportsequipmentas well as the locations (e.g., courts, pools, etc.) so that there isn’t a burden on one sport. Furthermore, the system will also be integrated with other third-partysporting events (for example a football match at the Memorial Stadium) and allowpeople to booktickets for such events.


## Link to Project Presentation
[Video Presentation](https://drive.google.com/file/d/1xQHQJCbAfXUmUguyhuHygJMdyi5nenTr/view?usp=sharing)


## Project Setup

There are 3 steps to initialize the project and running it as a web application (frontend + backend + database connection):
- **Frontend**: In the `Frontend/` directory run npm install. This would install the npm/react packages and compile the frontend code and to start the frontend server execute: `npm start` (this would serve the webpage on port 3000).
- Backend: There’s a requirements.txt file in the `Backend/` directory. This has python-based dependencies that would be required to server the APIs. Install these dependencies using `pip3 install requirements.txt`.
To create the Flask server, execute `python3 -m src.server` from the `Backend/` directory itself. This will spin up the Flask server on port 5000.
- **Database**: Setting up the database is a bit tricky. Although we have database files (*.sql) in the database/ directory, if one needs to create this file, the steps are mentioned in the 4th point. The current point only covers the creation of a database that already has been populated. To do so, go to the `database/` directory and select the latest .sql file (based on date [db-YYYYMMDD.sql]). At this point in time, it is “db-20221125.sql”. Login to mysql shell and execute: `source db-20221125.sql`. This will create the database (called ‘SRKC’ [our team name]) and will create and populate various tables. The schema is present in the `sql/DDL.sql` file in the `database/` directory.
- **Creating the `.sql` file**: Once the database called ‘SRKC’ has been created (manually) navigate to the `database/scripts/` directory, tables needs to be initialized and the static data must be loaded. To do so, navigate to the `database/sql/` directory and execute:
`mysql> source DDL.sql` (in the mysql shell)
`mysql> source static_data.sql` (in the mysql shell).
Now, to populate the synthetic data in other tables, navigate to the `database/scripts/` directory and execute: `python3 main.py`.
This will create, initialize and populate the tables in the ‘SRKC’ database. Once this process is complete, the database can be exported into a “.sql” file using:
`mysqldump -u <DATABASE_USERNAME> -p<DATABASE_PASSWORD> --databases SRKC > db-$(date '+%Y%m%d').sql`. This will create the ‘db.YYYYMMDD.sql’ file that has been referred to in point 3.

## Team Members
|   Info      |        Description     |    Email ID             |
| ----------- | ---------------------- | ----------------------- |
| Captain     |      Chinmay Saraf     | csaraf2@illinois.edu    |
| Member1     |      Kedar Takwane     | takwane2@illinois.edu   |
| Member2     |      Rishabh Garg      | rg18@illinois.edu       |
| Member3     |      Saket Jajoo       | saketsj2@illinois.edu   |