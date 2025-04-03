# Kloack: Authentication and Authorization with Keycloak

![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Keycloak](https://img.shields.io/badge/Keycloak-7B00FF?style=for-the-badge&logo=keycloak&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## Project Overview
Kloack is a modern web application designed to demonstrate the implementation of robust authentication and authorization using Keycloak. The project consists of a Django REST Framework backend and a React frontend, both integrated with Keycloak for secure identity and access management.

### This application showcases:
- Single Sign-On (SSO) capabilities
- Role-based access control
- OAuth 2.0 and OpenID Connect implementation
- Secure API communication between frontend and backend
- Integration with PostgreSQL database

The architecture follows current best practices for web application security, separating concerns between authentication/authorization (handled by Keycloak), backend business logic (Django), frontend presentation (React), and data persistence (PostgreSQL).

## Application Preview
![Application Screenshot 1](static/Screenshot%20from%202025-04-02%2001-29-11.png)
![Application Screenshot 2](static/Screenshot%20from%202025-04-02%2001-29-22.png)

## Prerequisites
- Docker and Docker Compose
- Node.js (v16 or higher)
- Python 3.10+ with pip
- PostgreSQL database

---

# Method 1: Running with Docker Compose
For a quick start with minimal setup, you can use Docker Compose to run all components (Keycloak, PostgreSQL, Django backend, and React frontend) together.

### Setup Environment Variables
First, create a `.env` file in the root directory with the necessary environment variables.

### Start All Services
Run the following command from the project root to start all services:
```sh
docker-compose up --build -d
```
This will:
- Start PostgreSQL on port 5432
- Start Keycloak on port 8080
- Build and start the Django backend on port 8000
- Build and start the React frontend on port 3000

### Accessing the Application
- **Keycloak Admin Console:** [http://localhost:8080/admin/](http://localhost:8080/admin/) (admin/admin)
- **Django Backend:** [http://localhost:8000/](http://localhost:8000/)
- **React Frontend:** [http://localhost:3000/](http://localhost:3000/)

### Initial Keycloak Configuration
You'll still need to configure Keycloak realms and clients the first time:
1. Access the Keycloak Admin Console at [http://localhost:8080/admin/](http://localhost:8080/admin/)
2. Log in with the admin credentials (`admin/admin`)
3. Follow the Keycloak configuration steps mentioned in **Method 2**

### Stopping Services
To stop all services:
```sh
docker-compose down
```
To stop and remove volumes (this will delete all data):
```sh
docker-compose down -v
```

---

# Method 2: Manual Setup
## 1. Setting Up Keycloak
Keycloak is an open-source identity and access management solution that we'll use as our authentication server.

### Start Keycloak with Docker
Run the following command:
```sh
docker run -p 8080:8080 --name keycloak \
-e KEYCLOAK_ADMIN=admin \
-e KEYCLOAK_ADMIN_PASSWORD=admin \
quay.io/keycloak/keycloak:latest start-dev
```
This command:
- Maps Keycloak to port 8080 on your host
- Sets up a default admin user with username `admin` and password `admin`
- Starts Keycloak in development mode

### Configure Keycloak
1. Access the Keycloak Admin Console at [http://localhost:8080/admin/](http://localhost:8080/admin/)
2. Log in with the admin credentials (`admin/admin`)
3. Create a new realm named `kloack` (for backend) and `dev` (for frontend)
4. In each realm, create a new client:
   - **Client ID:** backend-service
   - **Client authentication:** ON
   - **Standard flow:** Enabled
   - **Direct access grants:** Enabled
   - **Service accounts:** Enabled
5. After creating the client, navigate to the **Credentials** tab and note the client secret
6. Create roles and users as needed for your application

---

## 2. Backend Setup
The backend is a Django REST Framework application that communicates with Keycloak for authentication.

### Database Setup
Ensure PostgreSQL is running on your system.

### Backend Configuration
Navigate to the backend directory:
```sh
cd backend
```
Create `.env` file from example (or use the existing one):
```sh
cp .env.example .env
```
Update the environment variables as needed. Ensure the Keycloak client secret matches what you noted from the Keycloak setup.

### Install Dependencies
Install the required dependencies:
```sh
pip install -r requirements.txt
```
The backend uses `python-keycloak==5.3.1` for integration with Keycloak.

### Run Migrations
```sh
python manage.py migrate
```

### Start the Backend Server
```sh
python manage.py runserver 0.0.0.0:8000
```
The Django server will start at [http://localhost:8000/](http://localhost:8000/)

### Backend Integration Details
- Keycloak handles user authentication and generates JWT tokens
- The Django application validates these tokens for protected API endpoints
- Role-based permissions are extracted from the JWT token

---

## 3. Frontend Setup
The frontend is a React application that authenticates users through Keycloak.

### Configure Frontend
Navigate to the frontend directory:
```sh
cd frontend
```
Create or update `.env` file with appropriate Keycloak settings.

### Install Dependencies
```sh
npm install
```

### Start the Development Server
```sh
npm start
```
The React application will be available at [http://localhost:3000/](http://localhost:3000/)

### Frontend Integration Details
- OAuth 2.0 Authorization Code flow for secure authentication
- JWT tokens stored in cookies for maintaining session state
- Axios interceptors to include authentication headers in API requests

---

## Testing the Integration
1. Open your browser and navigate to [http://localhost:3000/](http://localhost:3000/)
2. You should be redirected to the Keycloak login page
3. After successful login, you'll be redirected back to the application
4. The frontend will use the access token to communicate with protected backend endpoints

---

## Additional Resources
- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Django REST Framework Documentation](https://www.django-rest-framework.org/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Python-Keycloak Documentation](https://github.com/marcospereirampj/python-keycloak)

## Troubleshooting
- Ensure all services (Keycloak, PostgreSQL, Django, React) are running on their expected ports
- Check that Keycloak client secrets match between Keycloak and your application configuration
- Verify that the correct Keycloak realm is being used for each component
- Examine browser console and server logs for detailed error messages
