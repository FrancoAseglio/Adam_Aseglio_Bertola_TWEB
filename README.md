# Full Stack Anime Application

A comprehensive web application for browsing, managing, and tracking anime content.
Supported by user profiles, favorites, ratings, and personalized recommendations.

## Project Overview

This application provides a complete anime discovery and tracking experience with multiple microservices handling different aspects of the system.
Users can search for anime and characters, manage their profiles, mark favorites and receive personalized recommendations based on their viewing history.

### Features

*Anime Discovery & Global Insights*

This section allows users to tap into a vast database of anime information, providing both high-level trends and granular details for every series.

- **Multi-Criteria Search:** Search for anime by specific titles, browse by genres, or dive into character-specific data.
- **Intelligent Recommendations:** Identify similar titles triggering personalised recommendations for related series.
- **Global Community Stats:** Live data distributions for any anime, including user-specific classifications and a detailed percentage-based score.
- **Top-Rated Archives:** A quick-access tool to pull the top N rated anime to help users discover high-quality content.
- **Characters Management:** Built-in functionality to easily add a new character to the pool and even remove an exisiting one.

*User Management & Personal Analytics*

The application serves as a comprehensive dashboard for tracking personal viewing habits and maintaining a digital anime library.

- **Personalized Profile Dashboard:** A visual summary of a user's journey to quantify their anime history.
- **Dynamic List Tracking:** This includes updating episode counts and categorizing shows into real time.
- **Library CRUD Operations:** Built-in tools to easily add or remove titles from a "Favorites" list and manage a personal preferences.
- **Visual Status Breakdown:** An automated statistical summary as of a user's watch status distribution.

*Logs and Forensic*

Application logs are auto-generated and stored in the `solution/logs/` directory so to enable proper forencis analysis if needed.


## Project Structure

```
Adam_Aseglio_Bertola_TWEB/
  ├── README.md
  ├── SelfAssessmentForm-TWEB.xlsx
  ├── report
  │    └── report.pdf                   # Documentation
  └── solution
       ├── Makefile                     # Automation
       │
       ├── scripts/                     # Data processing and orchestration
       │    ├── data_load_mongo.py
       │    ├── data_load_pgsql.py
       │    ├── start_all.sh
       │    └── stop_all.sh
       │
       ├── servers/
       │    ├── backend/
       │    │    ├── express_gateway/   # API Gateway
       │    │    ├── express_mongo/     # MongoDB Service
       │    │    └── springboot_pgsql/  # Spring Boot Service
       │    │
       │    └── frontend/
       │         └── express_ui/        # Frontend UI
       │
       └── logs/                        # Application logs
```

## Architecture

The application follows a **server constellation** with clear separation of concerns:

```
                    ┌─────────────────────────────────────────┐
                    │         Express UI (Port 3000)          │
                    │         Frontend / View Layer           │
                    │         Handlebars Templates            │
                    └───────────────────┬─────────────────────┘
                                        ▼
                    ┌─────────────────────────────────────────┐
                    │       Express Gateway (Port 3001)       │
                    │           API Gateway Layer             │
                    │   Routes requests to backend services   │
                    └───────────────────┬─────────────────────┘
                             ┌──────────┴──────────┐
                             ▼                     ▼
                    ┌────────────────┐  ┌─────────────────────┐
                    │  Spring Boot   │  │   Express MongoDB   │
                    │  (Port 8080)   │  │   (Port 3002)       │
                    │                │  │                     │
                    │  - Anime API   │  │  - Profiles         │
                    │  - Characters  │  │  - Favorites        │
                    │  - People      │  │  - Ratings          │
                    │                │  │  - Recommendations  │
                    │  PostgreSQL    │  │  - User Stats       │
                    └────────┬───────┘  └──────────┬──────────┘
                             ▼                     ▼
                      ┌────────────┐         ┌───────────┐
                      │ PostgreSQL │         │  MongoDB  │
                      │------------│         │-----------│
                      │ Anime Data │         │ User Data │
                      └────────────┘         └───────────┘
```

### Component Responsibilities

- **Express UI**: Server-side rendered frontend using Handlebars, handles user interface and routing
- **Express Gateway**: API Gateway that aggregates and routes requests to appropriate backend services
- **Spring Boot (PostgreSQL)**: Handles anime catalog data, characters, and people information
- **Express (MongoDB)**: Manages user-specific data including profiles, favorites, ratings, and recommendations
- **Data Scripts**: Python scripts for ETL processes (Extract, Transform, Load) to populate databases

## Prerequisites

Before running the application, ensure you have the following installed and properly configured:

### Development Environment

- **Python 3.8+** - Required for data cleaning and ETL scripts
- **Jupyter Notebook or JupyterLab** - For running data cleaning notebook
- **MAL datasets** - Update the `INPUT_DIR_PATH` variable in notebooks (default: `~/datasets/`)

### Runtime Dependencies

#### Node.js Stack
- **Node.js** v16.x or higher
- **npm** v8.x or higher
- Required for: Frontend UI, Express Gateway, and MongoDB Service

#### Java Stack
- **Java Development Kit (JDK) 17** or higher
- **Gradle** 7.x or higher (or use the included Gradle wrapper `./gradlew`)

### Database Systems

#### MongoDB
- **MongoDB** v5.0 or higher
- **MongoDB Service** must be running and accessible
- Default connection: `mongodb://localhost:27017`

#### PostgreSQL
- **PostgreSQL** v13 or higher
- **PostgreSQL Service** must be running and accessible
- Default connection: `localhost:5432` via user `postgres`
- Required database: `anime_db`

## Set Up
> ⚠️ **IMPORTANT**: This application requires running a data cleaning pipeline from an external repository.

## PART 1: the data cleaning pipeline
### 1 Clone the Data Cleaning Related Repository

```bash
git clone git@github.com:FrancoAseglio/Adam_Aseglio_Bertola_HCI.git
cd Adam_Aseglio_Bertola_HCI
```

### 2. Install Python Dependencies

```bash
cd solution/
pip install -r requirements.txt
```

### 3. Run the data_cleaning.ipynb

You'll find the necessary notebook in the namesake dir.  
Once done, a new dir with the cleand dataset will be found self contained at: `~/datasets/cleaned/`  
This will be the source reference for the anime app data loading scripts.

## PART 2: the anime app setting

### 4. Install the AnimeApp Python Dependencies

```bash
cd solution/scripts
pip install -r requirements.txt
```

### 5. Data Loading

> ⚠️ **REQUIRED**: Databases connections needs to be active in order to allow the scripts to properly operate the loading.  
Ensure both PostgreSQL and MongoDB to be available.

```bash
# run the PostgreSQL load
python data_load_pgsql.py

# run the MongoDB load: it may take a while (15~20 min circa)
python data_load_mongo.py
```

## Running the Application

### 6.a Automated CLI command

The project includes automation scripts for managing all services via Makefile.   
_Remember to leave databases connections active._  
Navigate back into the solution dir and fireup the app accordingly:  

```bash
make start   # starts all services
make stop    # stops all services
make restart # stops then starts
make status  # shows which ports are active
make install # installs npm dependencies
make clean   # removes builds and logs
make help    # shows available commands
```

### 6.b IDE startup (Optional)

**NOTE:** This step is only required if you plan to run services individually from an IDE.  
The automated start scripts handles dependencies automatically.  

```bash
cd servers/frontend/express_ui && npm install
cd ../../backend/express_gateway && npm install
cd ../express_mongo && npm install
```

## API Documentation

Once the services are running, access the interactive API documentation:  
- **Frontend UI Swagger**: http://localhost:3000/api-docs  
- **API Gateway Swagger**: http://localhost:3001/api-docs  
- **MongoDB Service Swagger**: http://localhost:3002/api-docs  
- **Spring Boot OpenAPI**: http://localhost:8080/api-docs  

## References

- Course materials: TWEB (University of Turin 2025/2026)
- External resources: data cleaning and analytics at `git@github.com:FrancoAseglio/Adam_Aseglio_Bertola_HCI.git`

## License

Academic project developed for educational purposes at the University of Turin (January 2026).
