# AutoSuggest Engine & Bootcamp Hub 🚀

A premium, interactive single-page dashboard implementing the five core bootcamp goals, integrated with a search-based auto-suggest engine. 

---

## 🎨 Implemented Features (The 5 Goals)

### 1. Goal-1: Navigation Bar & Search AutoSuggest
- **Responsive Navigation**: A clean navbar featuring options: `Home`, `Card`, `Toggle`, and `Random user`.
- **Theme Matching Color**: The navbar background is styled with a light purple/lavender tone matching the dashboard theme.
- **Micro-Animations & Hover Effects**: Default link text color is black, which transitions smoothly to white on a dark purple/indigo block upon hover.
- **Smart Auto-suggest**:
  - Displays suggestions matching typed letters for **user profiles** (e.g., searching "John" suggests "John Doe").
  - Displays executable **action commands** (e.g., typing "generate" suggests "Generate Next User", typing "toggle" suggests "Toggle Theme"). Selecting an action directly runs it.

### 2. Goal-2: Interactive Flipping ID Card
- A 3D-flippable ID badge displaying a profile photo, gender, verified status, and Member ID on the front.
- Clicking or pressing `Enter`/`Space` on the card rotates it 180° to reveal detailed contact information (Email, Phone, Location, Member Since) and a custom scannable CSS-drawn barcode.

### 3. Goal-3: Theme Toggler
- Integrated Dark/Light mode theme switch.
- Saves the active setting inside `localStorage` to persist selection across page reloads.
- Accessible directly by clicking the `Toggle` option in the navbar.

### 4. Goal-4: Next Random User Engine
- Connected to the **Random User API** (`https://randomuser.me/api/`).
- Clicking `Random user` in the navbar or `Generate Next User` on the card fetches real-world user details, updates the ID card with smooth transition states, and dynamically adds the profile to the search pool.
- Includes a robust mock fallback engine for offline or rate-limited testing.

### 5. Goal-5: Git Pulse Dashboard
- Integrates a Node.js backend route `/api/git-pulse` that executes a local `git log` command to fetch the repository commit log.
- Displays a real-time chronological commit history list and a GitHub-style green contribution grid with detailed tooltips.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5 (Semantic Structure), CSS3 (Variables, 3D Transforms, Glassmorphism), Vanilla JavaScript (DOM manipulation, Fetch API, State preservation).
- **Backend**: Node.js & Express.js.
- **Assets**: Dynamic SVGs and profile images.

---

## 💻 Running the Project Locally

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your computer.

### 2. Installation
Clone the repository, navigate into the project directory, and install dependencies:
```bash
# Clone the repository
git clone https://github.com/ESpoorthy/AutoSuggest-BootCamp.git

# Navigate into the project folder
cd AutoSuggest-BootCamp

# Install Express.js dependency
npm install
```

### 3. Start the Server
Run the local Express server:
```bash
# Launch the application
node Server.js/Server.js
```
The server will start up on **port 3000**. 

### 4. Access the Application
Open your web browser and navigate to:
```
http://localhost:3000
```

---

## 📂 Project Structure

```
├── Server.js/
│   └── Server.js          # Node/Express backend serving static files & Git logs
├── frontend/
│   ├── css/
│   │   └── frontend.css   # Theme variables, responsive layout, 3D transforms
│   ├── images/
│   │   └── john.svg       # Default avatar SVG asset
│   ├── js/
│   │   └── frontend.js    # Interactive logic, search suggestions, API fetch, theme state
│   └── index.html         # Main dashboard markup
├── package.json           # App dependencies and configuration
└── README.md              # Project documentation
```
