# Meeti - Find Nearby Events and Build a Community

**Meeti** is a community-focused platform inspired by the Meetup website. Users can create an account, publish Meetis (events), and share relevant information like event details and locations via maps. The platform integrates both front-end and back-end technologies, offering a complete experience for users looking to organize or find events.

## Key Features

- **User Registration**: Users can sign up and manage their profiles.
- **Meeti Creation**: Registered users can create and publish their own events (Meetis).
- **Map Integration**: Events are linked with maps using **Leaflet** and **OpenStreetMap** for easy location tracking.
- **Find Nearby Meetis**: With the help of **PostGIS**, users can search for events close to their current location.
- **Technological Stack**: The project includes various technologies on the front-end and back-end such as **Webpack**, **Axios**, **SweetAlert**, **MomentJS**, and more.
  
## Technologies Used

- **PostgreSQL**: The primary database used for storing all user and event data.
- **Sequelize**: ORM (Object Relational Mapper) used to interact with the PostgreSQL database.
- **EJS**: Embedded JavaScript templating engine for dynamic HTML generation.
- **PostGIS**: Extension to PostgreSQL that allows for geographic location queries (used to find nearby events).
- **Leaflet**: Open-source JavaScript library for mobile-friendly interactive maps.
- **OpenStreetMap**: Used in conjunction with Leaflet for map data and visuals.
- **MomentJS**: Date manipulation library for handling event times and dates.
- **Multer**: Middleware for handling multipart/form-data, used for uploading files like user profile images.
- **Passport**: Authentication middleware used for managing user sessions and logins.
- **Nodemailer**: Used to send email notifications for actions like event confirmations or reminders.
- **SweetAlert**: Provides beautiful, responsive alerts and confirmation dialogs.
- **Axios**: Promise-based HTTP client used to interact with APIs.

## Installation
Database Setup
Ensure you have PostgreSQL installed along with PostGIS extension.

Create a new PostgreSQL database.
Enable PostGIS extension for geographic queries.
sql

CREATE EXTENSION postgis;

## Project Structure
controllers/: Contains all the controller logic for handling routes.
models/: Sequelize models representing database tables.
routes/: Defines the API and web routes for the application.
views/: EJS templates used to generate HTML for the front-end.
public/: Contains static assets like JavaScript, CSS, and images.
Features in Development
Notifications for event updates or reminders.
Advanced search features to filter events by categories or keywords.
Event RSVPs and comment sections for event discussions.