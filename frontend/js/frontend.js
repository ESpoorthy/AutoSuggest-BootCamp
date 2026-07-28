document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // DOM ELEMENTS
    // ==========================================
    const searchInput = document.getElementById("search-input");
    const suggestionsBox = document.getElementById("suggestions-box");
    const clearSearchBtn = document.getElementById("clear-search-btn");
    const gitTimelineList = document.getElementById("git-timeline-list");
    const contributionsGrid = document.getElementById("contributions-grid");
    const pulseSummary = document.getElementById("pulse-summary");
    const refreshPulseBtn = document.getElementById("refresh-pulse-btn");
    const commandChips = document.querySelectorAll(".command-chip");
    const generatedCountStat = document.getElementById("generated-count");
    const currentUserStat = document.getElementById("current-user-stat");
    const activeThemeStat = document.getElementById("active-theme-stat");
    const commitCountStat = document.getElementById("commit-count-stat");
    const appToast = document.getElementById("app-toast");
    
    // Navbar Menu Links
    const navHome = document.getElementById("nav-home");
    const navCard = document.getElementById("nav-card");
    const navToggle = document.getElementById("nav-toggle");
    const navRandom = document.getElementById("nav-random");
    const navGit = document.getElementById("nav-git");

    // Card Elements
    const idCardElement = document.getElementById("id-card-element");
    const cardAvatar = document.getElementById("card-avatar");
    const cardName = document.getElementById("card-name");
    const cardGenderLabel = document.getElementById("card-gender-label");
    const cardUid = document.getElementById("card-uid");
    const cardEmail = document.getElementById("card-email");
    const cardPhone = document.getElementById("card-phone");
    const cardLocation = document.getElementById("card-location");
    const cardDate = document.getElementById("card-date");
    const cardBarcodeText = document.getElementById("card-barcode-text");
    const nextUserBtn = document.getElementById("next-user-btn");
    const copyIdBtn = document.getElementById("copy-id-btn");

    // ==========================================
    // STATE & POOL MANAGEMENT
    // ==========================================
    let activeUser = null;
    let userPool = [];
    let suggestionsMatches = []; 
    let highlightedIndex = -1;
    let generatedCount = 0;
    let toastTimeout = null;

    // Helper to generate dynamic SVG avatar based on name & gender
    function getDynamicAvatar(gender, seed) {
        const bgColors = ['%233b7fa4', '%236366f1', '%23a855f7', '%2310b981', '%23f59e0b', '%23ec4899'];
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = seed.charCodeAt(i) + ((hash << 5) - hash);
        }
        const bgColor = bgColors[Math.abs(hash) % bgColors.length];
        
        if (gender === 'female') {
            return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%"><rect width="500" height="500" fill="${bgColor}"/><path d="M250,110 L390,350 L390,500 L250,500 Z" fill="%23000000" opacity="0.15"/><path d="M100,500 C100,410 160,350 250,350 C340,350 400,410 400,500 Z" fill="%23ff6b6b"/><circle cx="250" cy="350" r="30" fill="%23fddcb4"/><rect x="220" y="270" width="60" height="70" rx="5" fill="%23fddcb4"/><circle cx="250" cy="200" r="80" fill="%23fddcb4"/><circle cx="165" cy="200" r="15" fill="%23fddcb4"/><circle cx="335" cy="200" r="15" fill="%23fddcb4"/><path d="M165,190 C165,110 335,110 335,190 C335,180 320,130 250,130 C180,130 165,180 165,190 Z" fill="%234a3728"/><path d="M160,200 C150,230 160,320 180,330 C180,330 200,260 200,210 Z" fill="%234a3728"/><path d="M340,200 C350,230 340,320 320,330 C320,330 300,260 300,210 Z" fill="%234a3728"/></svg>`;
        } else {
            return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%"><rect width="500" height="500" fill="${bgColor}"/><path d="M250,110 L390,350 L390,500 L250,500 Z" fill="%23000000" opacity="0.15"/><path d="M100,500 C100,400 150,330 250,330 C350,330 400,400 400,500 Z" fill="%234a4a4a"/><path d="M200,330 L300,330 L250,420 Z" fill="%23ffffff"/><path d="M235,400 L265,400 L275,500 L225,500 Z" fill="%239b4dca"/><path d="M235,390 L265,390 L270,415 L230,415 Z" fill="%23803ba8"/><rect x="220" y="270" width="60" height="70" rx="5" fill="%23fddcb4"/><circle cx="250" cy="200" r="80" fill="%23fddcb4"/><circle cx="165" cy="200" r="15" fill="%23fddcb4"/><circle cx="335" cy="200" r="15" fill="%23fddcb4"/><path d="M170,200 C170,110 330,110 330,200 C330,180 320,160 300,150 C280,140 250,145 250,145 C250,145 220,140 200,150 C180,160 170,180 170,200 Z" fill="%232d2d2d"/></svg>`;
        }
    }

    // Default pre-populated users
    const defaultUsers = [
        {
            name: "John Doe",
            gender: "male",
            avatar: "images/john.svg",
            email: "john.doe@example.com",
            phone: "(555) 019-2834",
            location: "New York, USA",
            joined: "June 2026",
            uid: "BC-9284-A1",
            barcode: "928472918471"
        },
        {
            name: "Jane Smith",
            gender: "female",
            avatar: getDynamicAvatar("female", "Jane Smith"),
            email: "jane.smith@example.com",
            phone: "(555) 024-5829",
            location: "London, UK",
            joined: "May 2026",
            uid: "BC-1048-B2",
            barcode: "104872918472"
        },
        {
            name: "Alex Rivers",
            gender: "male",
            avatar: getDynamicAvatar("male", "Alex Rivers"),
            email: "alex.rivers@example.com",
            phone: "(555) 093-1823",
            location: "San Francisco, USA",
            joined: "April 2026",
            uid: "BC-3850-C3",
            barcode: "385072918473"
        },
        {
            name: "Samantha Patel",
            gender: "female",
            avatar: getDynamicAvatar("female", "Samantha Patel"),
            email: "samantha.patel@example.com",
            phone: "(555) 048-3829",
            location: "Mumbai, India",
            joined: "June 2026",
            uid: "BC-4927-D4",
            barcode: "492772918474"
        }
    ];

    userPool = [...defaultUsers];
    activeUser = userPool[0]; // Set default user

    // Dynamic Action Commands for AutoSuggest (satisfying "typing random suggests random user etc.")
    const searchCommands = [
        {
            name: "Generate Next User",
            isCommand: true,
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent);"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>`,
            description: "Action &bull; Create/fetch a random user profile",
            keywords: ["random", "random user", "next", "generate", "profile", "new user"],
            action: () => fetchNextRandomUser()
        },
        {
            name: "Toggle Theme",
            isCommand: true,
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent);"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 7a5 5 0 100 10 5 5 0 000-10z"/></svg>`,
            description: "Action &bull; Switch theme colors (Light/Dark)",
            keywords: ["toggle", "theme", "dark", "light", "mode", "color"],
            action: () => toggleTheme()
        },
        {
            name: "View Git Pulse Timeline",
            isCommand: true,
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent);"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
            description: "Action &bull; Scroll to Git contributions pulse graph",
            keywords: ["git", "pulse", "commit", "timeline", "history", "repo", "repository"],
            action: () => scrollToPulse()
        },
        {
            name: "Refresh Git Pulse",
            isCommand: true,
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent);"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>`,
            description: "Action &bull; Reload latest repository activity",
            keywords: ["refresh", "reload", "git", "pulse", "commits"],
            action: () => loadGitPulse({ announce: true })
        },
        {
            name: "Copy Member ID",
            isCommand: true,
            icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent);"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
            description: "Action &bull; Copy the active ID card number",
            keywords: ["copy", "member", "id", "badge", "card"],
            action: () => copyMemberId()
        }
    ];

    function searchableText(item) {
        return [
            item.name,
            item.description,
            item.gender,
            item.location,
            ...(item.keywords || [])
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
    }

    function showToast(message) {
        if (!appToast) return;
        appToast.textContent = message;
        appToast.classList.add("show");
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            appToast.classList.remove("show");
        }, 2400);
    }

    function updateDashboardStats() {
        if (generatedCountStat) generatedCountStat.textContent = generatedCount.toString();
        if (currentUserStat) currentUserStat.textContent = activeUser?.name || "—";
        if (activeThemeStat) {
            activeThemeStat.textContent = document.documentElement.classList.contains("dark-mode") ? "Dark" : "Light";
        }
    }

    function scrollToPulse() {
        const pulseSection = document.getElementById("pulse-section");
        if (pulseSection) {
            pulseSection.scrollIntoView({ behavior: "smooth" });
        }
    }

    function syncCardFlipState() {
        const isFlipped = idCardElement.classList.contains("flipped");
        idCardElement.setAttribute("aria-pressed", isFlipped.toString());
        idCardElement.setAttribute("aria-label", isFlipped ? "Interactive ID Card. Showing details side." : "Interactive ID Card. Showing profile side.");
    }

    async function copyMemberId() {
        const memberId = cardUid.textContent.trim();
        try {
            if (navigator.clipboard && memberId) {
                await navigator.clipboard.writeText(memberId);
                showToast(`Copied ${memberId}`);
            } else {
                showToast(`Member ID: ${memberId}`);
            }
        } catch (error) {
            showToast(`Member ID: ${memberId}`);
        }
    }

    // ==========================================
    // THEME CONTROLLER (Goal-3: TOGGLE)
    // ==========================================
    function initTheme() {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "dark") {
            document.documentElement.classList.add("dark-mode");
        } else {
            document.documentElement.classList.remove("dark-mode");
        }
        updateDashboardStats();
    }

    function toggleTheme() {
        const isDark = document.documentElement.classList.toggle("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        updateDashboardStats();
        showToast(`${isDark ? "Dark" : "Light"} mode active`);
    }

    // ==========================================
    // NAVBAR MENU LINK BINDINGS (Goal-1)
    // ==========================================
    if (navHome) {
        navHome.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    if (navCard) {
        navCard.addEventListener("click", (e) => {
            e.preventDefault();
            const cardSection = document.querySelector(".card-panel");
            if (cardSection) {
                cardSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    if (navToggle) {
        navToggle.addEventListener("click", (e) => {
            e.preventDefault();
            toggleTheme();
        });
    }

    if (navRandom) {
        navRandom.addEventListener("click", (e) => {
            e.preventDefault();
            fetchNextRandomUser();
        });
    }

    if (navGit) {
        navGit.addEventListener("click", (e) => {
            e.preventDefault();
            scrollToPulse();
        });
    }

    commandChips.forEach((chip) => {
        chip.addEventListener("click", () => {
            const command = chip.dataset.command;
            if (command === "random") fetchNextRandomUser();
            if (command === "theme") toggleTheme();
            if (command === "git") scrollToPulse();
            if (command === "copy") copyMemberId();
        });
    });

    // ==========================================
    // CARD CONTROLLER (Goal-2: CARD)
    // ==========================================
    function renderCard(user) {
        // Toggle updating class which handles scale/opacity in CSS
        idCardElement.classList.add("updating");
        
        setTimeout(() => {
            cardAvatar.src = user.avatar;
            cardName.textContent = user.name;
            cardGenderLabel.textContent = user.gender;
            cardUid.textContent = user.uid;
            
            // Details lists
            cardEmail.textContent = user.email;
            cardPhone.textContent = user.phone;
            cardLocation.textContent = user.location;
            cardDate.textContent = user.joined;
            cardBarcodeText.textContent = user.barcode;

            idCardElement.classList.remove("updating");
            updateDashboardStats();
        }, 150);
    }

    // Toggle card flip on click
    idCardElement.addEventListener("click", () => {
        idCardElement.classList.toggle("flipped");
        syncCardFlipState();
    });

    idCardElement.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            idCardElement.classList.toggle("flipped");
            syncCardFlipState();
        }
    });

    renderCard(activeUser);
    syncCardFlipState();

    // ==========================================
    // NEXT RANDOM USER ENGINE (Goal-4: NEXT RANDOM USER)
    // ==========================================
    async function fetchNextRandomUser() {
        nextUserBtn.disabled = true;
        nextUserBtn.innerHTML = `
            <svg class="loading-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="32" opacity="0.3"/>
            Generating...
        `;

        try {
            const response = await fetch("https://randomuser.me/api/");
            if (!response.ok) throw new Error("API network failure");
            const data = await response.json();
            const rawUser = data.results[0];

            // Parse fetched user data
            const name = `${rawUser.name.first} ${rawUser.name.last}`;
            const gender = rawUser.gender;
            const avatar = rawUser.picture.large;
            const email = rawUser.email;
            const phone = rawUser.phone;
            const location = `${rawUser.location.city}, ${rawUser.location.country}`;
            
            // Format joined date
            const dateObj = new Date(rawUser.registered.date);
            const joined = dateObj.toLocaleDateString("en-US", { month: "long", year: "numeric" });
            
            const uid = `BC-${Math.floor(1000 + Math.random() * 9000)}-${rawUser.nat}`;
            const barcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();

            const parsedUser = { name, gender, avatar, email, phone, location, joined, uid, barcode };

            // Add user to suggestions search pool
            userPool.push(parsedUser);
            activeUser = parsedUser;
            generatedCount += 1;
            showToast(`Generated ${name}`);
            
            if (idCardElement.classList.contains("flipped")) {
                idCardElement.classList.remove("flipped");
                syncCardFlipState();
                setTimeout(() => renderCard(activeUser), 300);
            } else {
                renderCard(activeUser);
            }

        } catch (error) {
            console.error("API error, falling back to mock user:", error);
            const fallbackNames = ["Tyler Vance", "Sofia Rossi", "Kenji Sato", "Amara Diallo", "Chloe Martin"];
            const selectedName = fallbackNames[Math.floor(Math.random() * fallbackNames.length)];
            const selectedGender = Math.random() > 0.5 ? "male" : "female";
            const uid = `BC-${Math.floor(1000 + Math.random() * 9000)}-FB`;
            const barcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
            
            const fallbackUser = {
                name: selectedName,
                gender: selectedGender,
                avatar: getDynamicAvatar(selectedGender, selectedName),
                email: `${selectedName.toLowerCase().replace(" ", ".")}@example.com`,
                phone: `(555) 0${Math.floor(100 + Math.random() * 899)}-${Math.floor(1000 + Math.random() * 8999)}`,
                location: "Tokyo, Japan",
                joined: "June 2026",
                uid,
                barcode
            };

            userPool.push(fallbackUser);
            activeUser = fallbackUser;
            generatedCount += 1;
            showToast(`Generated ${selectedName} from offline fallback`);
            if (idCardElement.classList.contains("flipped")) {
                idCardElement.classList.remove("flipped");
                syncCardFlipState();
                setTimeout(() => renderCard(activeUser), 300);
            } else {
                renderCard(activeUser);
            }
        } finally {
            nextUserBtn.disabled = false;
            nextUserBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 8L15 12H18C18 15.31 15.31 18 12 18C10.97 18 10 17.74 9.13 17.29L7.66 18.76C8.93 19.54 10.41 20 12 20C16.42 20 20 16.42 20 12H23L19 8ZM6 12C6 8.69 8.69 6 12 6C13.03 6 14 6.26 14.87 6.71L16.34 5.24C15.07 4.46 13.59 4 12 4C7.58 4 4 7.58 4 12H1L5 16L9 12H6Z" fill="currentColor"/>
                </svg>
                Generate Next User
            `;
        }
    }

    nextUserBtn.addEventListener("click", fetchNextRandomUser);
    copyIdBtn.addEventListener("click", copyMemberId);

    // ==========================================
    // AUTOSUGGEST ENGINE (Goal-1: NAVBAR AutoSuggest)
    // ==========================================
    function renderSuggestions(matches) {
        suggestionsBox.innerHTML = "";
        suggestionsMatches = matches; 
        
        if (matches.length === 0) {
            const noSug = document.createElement("div");
            noSug.className = "no-suggestions";
            noSug.textContent = "No matched users or commands found";
            suggestionsBox.appendChild(noSug);
            return;
        }

        matches.forEach((item, idx) => {
            const row = document.createElement("div");
            row.className = "suggestion-item";
            row.setAttribute("data-index", idx);
            
            if (item.isCommand) {
                row.innerHTML = `
                    <div class="suggestion-command-icon" style="width:32px; height:32px; background-color:rgba(99,102,241,0.1); border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                        ${item.icon}
                    </div>
                    <div class="suggestion-info">
                        <span class="suggestion-name" style="font-weight:700; color:var(--accent);">${item.name}</span>
                        <span class="suggestion-sub">${item.description}</span>
                    </div>
                `;
            } else {
                const avatar = document.createElement("img");
                avatar.src = item.avatar;
                avatar.alt = item.name;
                avatar.className = "suggestion-avatar";

                const info = document.createElement("div");
                info.className = "suggestion-info";

                const name = document.createElement("span");
                name.className = "suggestion-name";
                name.textContent = item.name;

                const meta = document.createElement("span");
                meta.className = "suggestion-sub";
                meta.textContent = `${item.gender.toUpperCase()} • ${item.location}`;

                info.append(name, meta);
                row.append(avatar, info);
            }

            row.addEventListener("click", () => {
                selectSuggestion(item);
            });

            suggestionsBox.appendChild(row);
        });
    }

    function selectSuggestion(item) {
        if (item.isCommand) {
            item.action();
            searchInput.value = "";
            clearSearchBtn.style.display = "none";
            closeSuggestions();
        } else {
            activeUser = item;
            renderCard(activeUser);
            searchInput.value = item.name;
            clearSearchBtn.style.display = "flex";
            closeSuggestions();
        }
    }

    function closeSuggestions() {
        suggestionsBox.classList.remove("active");
        highlightedIndex = -1;
    }

    function updateSuggestionHighlight(items) {
        Array.from(items).forEach((item, idx) => {
            if (idx === highlightedIndex) {
                item.classList.add("highlighted");
                item.scrollIntoView({ block: "nearest" });
            } else {
                item.classList.remove("highlighted");
            }
        });
    }

    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (!query) {
            clearSearchBtn.style.display = "none";
            closeSuggestions();
            return;
        }

        clearSearchBtn.style.display = "flex";

        const matchedCommands = searchCommands.filter(cmd => searchableText(cmd).includes(query));
        const matchedUsers = userPool.filter(user => searchableText(user).includes(query));

        const matches = [...matchedCommands, ...matchedUsers];
        renderSuggestions(matches);
        suggestionsBox.classList.add("active");
        highlightedIndex = -1;
    });

    searchInput.addEventListener("keydown", (e) => {
        const items = suggestionsBox.querySelectorAll(".suggestion-item");
        if (!suggestionsBox.classList.contains("active") || items.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            highlightedIndex = (highlightedIndex + 1) % items.length;
            updateSuggestionHighlight(items);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            highlightedIndex = (highlightedIndex - 1 + items.length) % items.length;
            updateSuggestionHighlight(items);
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (highlightedIndex >= 0 && highlightedIndex < items.length) {
                selectSuggestion(suggestionsMatches[highlightedIndex]);
            }
        } else if (e.key === "Escape") {
            closeSuggestions();
        }
    });

    clearSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        clearSearchBtn.style.display = "none";
        closeSuggestions();
        searchInput.focus();
    });

    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) {
            closeSuggestions();
        }
    });

    // ==========================================
    // GIT PULSE WIDGET (Goal-5: GIT PULSE)
    // ==========================================
    async function loadGitPulse({ announce = false } = {}) {
        if (refreshPulseBtn) {
            refreshPulseBtn.disabled = true;
            refreshPulseBtn.textContent = "Refreshing...";
        }
        if (gitTimelineList) {
            gitTimelineList.innerHTML = `<div class="loading-spinner">Loading repository commits...</div>`;
        }

        try {
            const response = await fetch("/api/git-pulse");
            if (!response.ok) throw new Error("Git Pulse request failed");
            const commits = await response.json();
            
            renderGitTimeline(commits);
            renderContributionGrid(commits);
            if (commitCountStat) commitCountStat.textContent = commits.length.toString();
            if (pulseSummary) {
                const latest = commits[0];
                pulseSummary.textContent = latest
                    ? `Latest commit #${latest.hash} by ${latest.author}: ${latest.message}`
                    : "No repository activity available yet.";
            }
            if (announce) showToast(`Git Pulse refreshed • ${commits.length} commits`);
        } catch (error) {
            console.error("Pulse API error:", error);
            gitTimelineList.innerHTML = `<div class="timeline-item">Failed to fetch commit history.</div>`;
            if (commitCountStat) commitCountStat.textContent = "0";
            if (pulseSummary) pulseSummary.textContent = "Could not load repository activity right now.";
            if (announce) showToast("Git Pulse refresh failed");
        } finally {
            if (refreshPulseBtn) {
                refreshPulseBtn.disabled = false;
                refreshPulseBtn.textContent = "Refresh";
            }
        }
    }

    function renderGitTimeline(commits) {
        gitTimelineList.innerHTML = "";
        if (commits.length === 0) {
            gitTimelineList.innerHTML = `<div class="timeline-item">No commit logs found in repo.</div>`;
            return;
        }

        commits.forEach(commit => {
            const initials = commit.author
                .split(" ")
                .map(n => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase() || "ME";

            const item = document.createElement("div");
            item.className = "timeline-item";
            item.innerHTML = `
                <div class="commit-avatar">${initials}</div>
                <div class="commit-info">
                    <div class="commit-meta">
                        <span class="commit-hash">#${commit.hash}</span>
                        <span class="commit-time">${commit.time}</span>
                    </div>
                    <div class="commit-msg">${commit.message}</div>
                </div>
            `;
            gitTimelineList.appendChild(item);
        });
    }

    function renderContributionGrid(commits) {
        contributionsGrid.innerHTML = "";
        const commitSignal = commits
            .map(commit => commit.hash)
            .join("")
            .split("")
            .reduce((total, char) => total + char.charCodeAt(0), commits.length);
        
        for (let i = 0; i < 24; i++) {
            const cell = document.createElement("div");
            
            const hasRecentCommit = i >= Math.max(0, 24 - commits.length);
            let level = hasRecentCommit ? ((commitSignal + i * 3) % 4) + 1 : 0;
            if (commits.length > 6 && i % 5 === 0) level = Math.min(4, level + 1);
            
            cell.className = `grid-cell lvl-${level}`;
            
            const date = new Date();
            date.setDate(date.getDate() - (23 - i));
            const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            const contributionMap = {
                0: "No contributions",
                1: "1 contribution",
                2: "3 contributions",
                3: "5 contributions",
                4: "8+ contributions"
            };
            
            cell.title = `${contributionMap[level]} on ${formattedDate}`;
            contributionsGrid.appendChild(cell);
        }
    }

    refreshPulseBtn.addEventListener("click", () => loadGitPulse({ announce: true }));

    // Load initial timeline logs
    loadGitPulse();

    // Load initial colors
    initTheme();
});
