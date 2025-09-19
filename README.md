<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->

<a id="readme-top"></a>

<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![project_license][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/tonkatommy/MRHQ-L5-Mission-5-Phase-1-CLI-Tool">
    <img src="readme-images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">MongoDB CLI Tool</h3>

  <p align="center">
    Professional command-line interface for MongoDB operations with search functionality and web interface
    <br />
    <a href="#usage"><strong>Explore the usage guide »</strong></a>
    <br />
    <br />
    <a href="#getting-started">Get Started</a>
    &middot;
    <a href="https://github.com/missionreadyhq/mongo-cli-tool/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/missionreadyhq/mongo-cli-tool/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

The MongoDB CLI Tool is a comprehensive command-line interface designed for efficient MongoDB database operations. It provides both a powerful CLI for direct database management and a modern React-based web interface for intuitive data searching and visualization.

**Key Features:**

- 🔧 Full CRUD operations (Create, Read, Update, Delete)
- 🔍 Advanced search capabilities with AI-enhanced natural language queries
- 📊 Database statistics and collection management
- 🌐 Modern React web interface with dark/light theme support
- 📁 Bulk data import from JSON files
- 🔒 Secure connection handling with graceful shutdown
- 📝 Comprehensive logging and debugging tools

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
- [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
- [![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
- [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
- [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
- [![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

Follow these steps to set up the MongoDB CLI Tool on your local machine.

### Prerequisites

Before installing, ensure you have the following software installed:

- **Node.js** (v16.0 or higher)

  ```sh
  # Check your Node.js version
  node --version

  # Install Node.js from https://nodejs.org/ if not installed
  ```

- **MongoDB** (v5.0 or higher)

  ```sh
  # Check your MongoDB version
  mongod --version

  # Install MongoDB Community Edition from https://mongodb.com/try/download/community
  # Or use MongoDB Atlas (cloud) for a managed solution
  ```

- **npm** (comes with Node.js) or **yarn**

  ```sh
  # Check npm version
  npm --version

  # Update npm to latest version
  npm install -g npm@latest
  ```

### Installation

1. **Clone the repository**

   ```sh
   git clone https://github.com/missionreadyhq/mongo-cli-tool.git
   cd mongo-cli-tool
   ```

2. **Install CLI dependencies**

   ```sh
   # Navigate to CLI tool directory
   cd src
   npm install
   ```

3. **Install API server dependencies**

   ```sh
   # Navigate to API server directory
   cd ../mongo-api-tool/server
   npm install
   ```

4. **Install web interface dependencies**

   ```sh
   # Navigate to React frontend directory
   cd ../
   npm install
   ```

5. **Configure environment variables**

   ```sh
   # Create .env file in the project root
   cp .env.example .env

   # Edit .env with your MongoDB connection details
   nano .env
   ```

   **Example .env configuration:**

   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/mission-5
   DB_NAME=mission-5

   # CLI Configuration
   DEFAULT_COLLECTION=auction_items
   LOG_LEVEL=info

   # API Server Configuration
   PORT=3001
   FRONTEND_URL=http://localhost:5173
   ```

6. **Start MongoDB service**

   ```sh
   # For local MongoDB installation
   mongod

   # Or ensure MongoDB Atlas connection string is correct in .env
   ```

7. **Test the installation**

   ```sh
   # Test CLI tool
   cd src
   node app.js test

   # Should show: ✅ Connected to MongoDB successfully
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

The MongoDB CLI Tool provides three ways to interact with your database:

### 1. Command Line Interface (CLI)

#### Basic Commands

**List all collections:**

```sh
node app.js collections
# or
node app.js ls
```

**Add documents:**

```sh
# Interactive mode
node app.js add users

# With JSON data
node app.js add users -d '{"name":"John Doe","age":30,"email":"john@example.com"}'

# From JSON file
node app.js add auction_items -f ../models/example.json

# Dry run (preview without saving)
node app.js add users -d '{"name":"Test"}' --dry-run
```

**Search and find documents:**

```sh
# Find all documents (limited to 10)
node app.js find users

# Find with query
node app.js find users -q '{"age":{"$gte":18}}'

# Find with limit and sorting
node app.js find users -q '{"status":"active"}' -l 5 -s '{"createdAt":-1}'

# Skip documents (pagination)
node app.js find users --skip 10 -l 5
```

**Count documents:**

```sh
# Count all documents
node app.js count users

# Count with query
node app.js count users -q '{"status":"active"}'
```

**Update documents:**

```sh
# Interactive mode
node app.js update users

# With query and data
node app.js update users -q '{"name":"John"}' -d '{"age":31}'

# Dry run
node app.js update users -q '{"name":"John"}' -d '{"age":31}' --dry-run
```

**Delete documents:**

```sh
# Interactive mode (with confirmation)
node app.js delete users

# With query
node app.js delete users -q '{"status":"inactive"}'

# Force delete (skip confirmations - DANGEROUS!)
node app.js delete users -q '{"status":"test"}' --force

# Dry run
node app.js delete users -q '{"status":"test"}' --dry-run
```

**View statistics:**

```sh
node app.js stats
```

**Test database connection:**

```sh
node app.js test
```

#### Advanced Usage

**Bulk import from JSON file:**

```sh
# Import array of documents
node app.js add products -f ./data/products.json

# Import with dry run
node app.js add products -f ./data/products.json --dry-run
```

**Complex queries:**

```sh
# Range queries
node app.js find auction_items -q '{"start_price":{"$gte":100,"$lte":500}}'

# Text search
node app.js find auction_items -q '{"title":{"$regex":"iPhone","$options":"i"}}'

# Multiple conditions
node app.js find users -q '{"$and":[{"age":{"$gte":18}},{"status":"active"}]}'
```

### 2. Web API Server

Start the Express.js API server for the web interface:

```sh
# Navigate to server directory
cd mongo-api-tool/server

# Start the server
npm start

# Server will run on http://localhost:3001
```

**API Endpoints:**

- `GET /api/health` - Health check
- `GET /api/collections` - List all collections
- `POST /api/search` - Search documents with MongoDB queries
- `POST /api/search/ai` - AI-enhanced natural language search
- `POST /api/count` - Count documents
- `POST /api/add` - Add new documents

**Example API usage:**

```sh
# Search for iPhone products
curl -X POST http://localhost:3001/api/search \
  -H "Content-Type: application/json" \
  -d '{"collection":"auction_items","query":{"title":{"$regex":"iPhone","$options":"i"}}}'

# AI-enhanced search
curl -X POST http://localhost:3001/api/search/ai \
  -H "Content-Type: application/json" \
  -d '{"collection":"auction_items","query":"iPhone under $500"}'
```

### 3. React Web Interface

Start the modern React web interface:

```sh
# Navigate to frontend directory
cd mongo-api-tool

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

**Web Interface Features:**

- 🔍 **Smart Search**: Both keyword and AI-enhanced natural language search
- 🌓 **Theme Toggle**: Switch between light and dark modes
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile
- 📊 **Rich Results**: Beautiful card-based display of search results
- 🎯 **Collection Selection**: Easy dropdown to switch between collections
- ⚡ **Real-time Search**: Instant results as you type

**Example searches in web interface:**

- `iPhone` (keyword search)
- `gaming console under $400` (AI search)
- `Apple products over $800` (AI search)
- `laptops between $1000 and $2000` (AI search)

### Example Workflows

**1. Setting up auction data:**

```sh
# Import sample auction items
node app.js add auction_items -f ./models/example.json

# Verify import
node app.js count auction_items

# Search for specific items
node app.js find auction_items -q '{"title":{"$regex":"iPhone","$options":"i"}}'
```

**2. Data analysis workflow:**

```sh
# Get database statistics
node app.js stats

# Count items by price range
node app.js count auction_items -q '{"start_price":{"$lt":100}}'
node app.js count auction_items -q '{"start_price":{"$gte":100,"$lt":500}}'
node app.js count auction_items -q '{"start_price":{"$gte":500}}'

# Find expensive items
node app.js find auction_items -q '{"start_price":{"$gte":1000}}' -s '{"start_price":-1}'
```

**3. Using the web interface:**

1. Start the API server: `cd mongo-api-tool/server && npm start`
2. Start the web interface: `cd mongo-api-tool && npm run dev`
3. Open http://localhost:5173
4. Try searches like:
   - "iPhone" (keyword)
   - "gaming console under $400" (AI)
   - "Apple products over $800" (AI)

_For more examples and advanced usage, please refer to the individual command help: `node app.js <command> --help`_

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Roadmap

**Project Completed!!**

See the [open issues](https://github.com/tonkatommy/MRHQ-L5-Mission-5-Phase-1-CLI-Tool/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/tonkatommy/MRHQ-L5-Mission-5-Phase-1-CLI-Tool/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=tonkatommy/MRHQ-L5-Mission-5-Phase-1-CLI-Tool" alt="contrib.rocks image" />
</a>

<!-- LICENSE -->

## License

Distributed under the project_license. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Tommy Goodman - [@tonkatommy](https://github.com/tonkatommy) - GitHub

Project Link: [https://github.com/tonkatommy/MRHQ-L5-Mission-5-Phase-1-CLI-Tool](https://github.com/tonkatommy/MRHQ-L5-Mission-5-Phase-1-CLI-Tool)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/tonkatommy/MRHQ-L5-Mission-5-Phase-1-CLI-Tool.svg?style=for-the-badge
[contributors-url]: https://github.com/tonkatommy/MRHQ-L5-Mission-5-Phase-1-CLI-Tool/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/tonkatommy/MRHQ-L5-Mission-5-Phase-1-CLI-Tool.svg?style=for-the-badge
[forks-url]: https://github.com/tonkatommy/MRHQ-L5-Mission-5-Phase-1-CLI-Tool/network/members
[stars-shield]: https://img.shields.io/github/stars/tonkatommy/MRHQ-L5-Mission-5-Phase-1-CLI-Tool.svg?style=for-the-badge
[stars-url]: https://github.com/tonkatommy/MRHQ-L5-Mission-5-Phase-1-CLI-Tool/stargazers
[issues-shield]: https://img.shields.io/github/issues/tonkatommy/MRHQ-L5-Mission-5-Phase-1-CLI-Tool.svg?style=for-the-badge
[issues-url]: https://github.com/tonkatommy/MRHQ-L5-Mission-5-Phase-1-CLI-Tool/issues
[license-shield]: https://img.shields.io/github/license/tonkatommy/MRHQ-L5-Mission-5-Phase-1-CLI-Tool.svg?style=for-the-badge
[license-url]: https://github.com/tonkatommy/MRHQ-L5-Mission-5-Phase-1-CLI-Tool/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: readme-images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com
