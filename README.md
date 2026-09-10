# Kindr React + Spring Boot

React 19 and Vite frontend connected to the sibling kinder-api Spring Boot
project. Authentication uses the backend's HttpOnly kindr_session cookie.

## Run locally

Start kinder-api in your Java IDE, or from D:\abhilash\kynder\kinder-api run:

    mvn spring-boot:run

The backend requires Java 17+, Maven, and the database configuration defined
in its application.properties. Its default port is 8080.

In this React folder run:

    npm install
    npm run dev

Open http://localhost:5173. npm start is an alias for the Vite dev server.
Vite proxies /api and /uploads to Spring Boot, preserving session cookies.
To change the backend address, copy .env.example to .env.local, set
SPRING_BOOT_URL, and restart Vite.

## Integrated features

Login, registration, session lookup/logout, dashboard, fundraiser creation,
campaign browsing/details/updates, and checkout use Spring Boot endpoints.
Payment availability depends on the backend payment configuration.
The contact widget continues to open WhatsApp/email for review and sending.
The existing Forgot password link is not yet connected to a reset screen.

## Production

    npm run build
    npm run preview

Deploy dist/ with the Spring Boot API reachable under the same origin:
configure your web server to proxy /api and /uploads to Spring Boot, or
serve the build from Spring Boot. Vite proxy settings apply only to local
development and preview, not to the production build.

There is no custom Node.js backend. Node.js 22.16+ is used for frontend
development/build tooling. The legacy data/ folder is unused and is not
included in the build.

Campaign IDs are MySQL-generated BIGINT values (Java Long). Campaign references in payments, donations, and updates use Long too. Restart Spring Boot after this change. The configured MySQL URL can recreate the missing kindr database, and Hibernate creates tables with ddl-auto=update. Database credentials must permit creation. Old string-ID links and saved checkout drafts are no longer valid.

# kindr-ui
