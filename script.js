document.addEventListener('DOMContentLoaded', () => {
    // First, ensure navigation exists, especially for index.html
    const header = document.querySelector('header');
    if (header && !header.querySelector('nav')) {
        console.log("Navigation doesn't exist! Creating it now...");
        
        // Create navigation element
        const nav = document.createElement('nav');
        nav.setAttribute('aria-label', 'Main Navigation');
        
        // Create navigation links
        const navList = document.createElement('ul');
        
        // Home link with chef icon
        navList.innerHTML = `
            <li>
                <a href="index.html">
                    <img src="images/chef-icon-white.svg" alt="Chef Icon" width="24" height="24">
                    <span class="sr-only">Home</span>
                </a>
            </li>
            <li><a href="recipes.html">Recipes</a></li>
            <li><a href="shop.html">Shop</a></li>
            <li><a href="bakers.html">The Bakers</a></li>
            <li><a href="about.html">About</a></li>
        `;
        
        nav.appendChild(navList);
        header.appendChild(nav);
        
        console.log("Navigation has been created and added to the header");
    }

    // Load random recipes on homepage
    function loadRecipePreviews() {
        // Check if we're on the homepage and recipes-grid exists
        const recipesGrid = document.querySelector('main section:nth-of-type(2) #recipes-grid');
        
        if (recipesGrid) {
            // Fetch recipes page
            fetch('recipes.html')
                .then(response => response.text())
                .then(html => {
                    // Parse the HTML
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');
                    
                    // Get all recipe cards
                    const recipes = Array.from(doc.querySelectorAll('#recipes-grid > a'));
                    
                    if (recipes.length) {
                        // Shuffle the recipes
                        const shuffled = recipes.sort(() => Math.random() - 0.5);
                        
                        // Get 3 recipes (or fewer if not enough)
                        const selectedRecipes = shuffled.slice(0, 3);
                        
                        // Clear any existing recipes
                        recipesGrid.innerHTML = '';
                        
                        // Add the selected recipes
                        selectedRecipes.forEach(recipe => {
                            // Clone the recipe element
                            const recipeClone = recipe.cloneNode(true);
                            
                            // Only show category label for Swedish Chef Originals
                            const categorySpan = recipeClone.querySelector('div > span');
                            if (categorySpan && !categorySpan.textContent.includes('Swedish Chef Original')) {
                                categorySpan.remove();
                            }
                            
                            // Add to the grid
                            recipesGrid.appendChild(recipeClone);
                        });
                    }
                })
                .catch(err => {
                    console.error('Could not load recipes:', err);
                });
        }
    }
    
    // Run the recipe loader
    loadRecipePreviews();

    // Create modal and overlay elements for baker profiles
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    const modal = document.createElement('div');
    modal.className = 'baker-modal';
    document.body.appendChild(modal);

    // Handle article clicks
    const articles = document.querySelectorAll('#bakers-grid article');
    articles.forEach(article => {
        article.addEventListener('click', (e) => {
            const aside = article.querySelector('aside');
            if (!aside) return;

            let modalContent = '';
            const contentContainer = aside.querySelector('div:last-child');

            // Handle first bio (directly in the container)
            const firstFigure = contentContainer.querySelector(':scope > figure');
            const firstText = contentContainer.querySelector(':scope > div');
            if (firstFigure && firstText) {
                modalContent += `
                    <div class="bio-section">
                        <div class="bio-image">
                            ${firstFigure.outerHTML}
                        </div>
                        <div class="bio-text">
                            ${firstText.innerHTML}
                        </div>
                    </div>
                `;
            }

            // Handle second bio (in the nested div)
            const secondBioContainer = contentContainer.querySelector(':scope > div:last-child');
            if (secondBioContainer) {
                const secondFigure = secondBioContainer.querySelector('figure');
                const secondText = secondBioContainer.querySelector('div');
                if (secondFigure && secondText) {
                    modalContent += `
                        <div class="bio-section">
                            <div class="bio-image">
                                ${secondFigure.outerHTML}
                            </div>
                            <div class="bio-text">
                                ${secondText.innerHTML}
                            </div>
                        </div>
                    `;
                }
            }

            modal.innerHTML = `
                <div class="modal-header">
                    ${aside.querySelector('div:first-child').innerHTML}
                    <button class="close-button" aria-label="Close profile">×</button>
                </div>
                <div class="modal-content">
                    ${modalContent}
                </div>
            `;

            openModal();

            // Add close button event listener
            modal.querySelector('.close-button').addEventListener('click', closeModal);
        });
    });

    // Close modal when clicking overlay
    overlay.addEventListener('click', closeModal);

    // Close modal when pressing Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    function openModal() {
        modal.classList.add('active');
        overlay.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
        overlay.classList.remove('active');
    }

    // Simple function to check if an element exists
    function elementExists(selector) {
        return document.querySelector(selector) !== null;
    }

    // Mobile Menu Setup - CRUCIAL PART
    function setupMobileMenu() {
        // Only set up mobile menu if viewport width is 480px or less
        if (window.innerWidth > 480) {
            // Remove mobile menu elements if they exist and we're on desktop
            const existingToggle = document.querySelector('.nav-toggle');
            const existingMobileMenu = document.querySelector('.mobile-menu-overlay');
            
            if (existingToggle) {
                existingToggle.remove();
            }
            
            if (existingMobileMenu) {
                existingMobileMenu.remove();
            }
            
            return;
        }
        
        console.log("Setting up mobile menu");
        const nav = document.querySelector('nav');
        
        if (!nav) {
            console.error("Navigation element not found");
            return;
        }
        
        console.log("Nav found:", nav);
        
        // Create toggle button if not exists
        if (!elementExists('.nav-toggle')) {
            console.log("Creating nav toggle");
            const menuToggle = document.createElement('button');
            menuToggle.className = 'nav-toggle';
            menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
            menuToggle.innerHTML = `
                <span></span>
                <span></span>
                <span></span>
            `;
            
            // Insert at beginning of nav
            nav.insertBefore(menuToggle, nav.firstChild);
            console.log("Toggle button created and inserted");
        }
        
        // Create mobile menu overlay if not exists
        if (!elementExists('.mobile-menu-overlay')) {
            console.log("Creating mobile menu overlay");
            const mobileMenuOverlay = document.createElement('div');
            mobileMenuOverlay.className = 'mobile-menu-overlay';
            
            // Clone the navigation links if they exist
            const navUl = nav.querySelector('ul');
            if (navUl) {
                const navLinks = navUl.cloneNode(true);
                mobileMenuOverlay.appendChild(navLinks);
                console.log("Navigation links cloned");
            } else {
                console.error("Navigation list not found");
            }
            
            // Add the overlay to the nav
            nav.appendChild(mobileMenuOverlay);
            console.log("Mobile menu overlay created and appended");
        }
        
        // Now get references to our elements
        const menuToggle = document.querySelector('.nav-toggle');
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
        
        if (!menuToggle || !mobileMenuOverlay) {
            console.error("Toggle or overlay not found after creation");
            return;
        }
        
        // Remove old listeners first to prevent duplicates
        const newMenuToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
        
        // Toggle menu when button is clicked
        newMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Toggle clicked");
            this.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        mobileMenuOverlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                console.log("Link clicked, closing menu");
                mobileMenuOverlay.classList.remove('active');
                newMenuToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && mobileMenuOverlay.classList.contains('active')) {
                console.log("Outside click, closing menu");
                mobileMenuOverlay.classList.remove('active');
                newMenuToggle.classList.remove('active');
            }
        });
        
        console.log("Mobile menu setup complete");
    }
    
    // Initialize mobile menu only on mobile screens
    console.log("Initializing mobile menu...");
    setupMobileMenu();
    
    // Listen for window resize and re-initialize menu when needed
    window.addEventListener('resize', () => {
        setupMobileMenu();
    });
    
    // ChefSpeak Translation Setup
    const recipeArticles = document.querySelectorAll('#recipe-body article');
    recipeArticles.forEach(article => {
        setupChefTranslation(article);
    });

    function setupChefTranslation(container) {
        const toggleSwitch = container.querySelector('#translateToggle');
        const instructions = container.querySelectorAll('ol li');
        
        if (!toggleSwitch || !instructions.length) return;

        let originalText = [];
        let translatedText = [];

        // Store original text
        instructions.forEach(li => {
            originalText.push(li.textContent);
            translatedText.push(swedishChefTranslate(li.textContent));
        });

        // Add event listener for toggle switch
        toggleSwitch.addEventListener('change', () => {
            instructions.forEach((li, i) => {
                li.textContent = toggleSwitch.checked ? translatedText[i] : originalText[i];
            });
        });

        // Set initial state (ChefSpeak by default)
        toggleSwitch.checked = true;
        instructions.forEach((li, i) => {
            li.textContent = translatedText[i];
        });
    }

    function swedishChefTranslate(text) {
        const replacements = {
            "the": "de",
            "this": "dis",
            "that": "dat",
            "with": "wit",
            "butter": "bootér",
            "milk": "melk",
            "heat": "hët hët hët",
            "mix": "stîiirën",
            "flour": "flööör",
            "egg": "eeggy wîîggly-wîîggly",
            "sugar": "shöödlee shöödlee",
            "salt": "sälty",
            "dough": "døgghén",
            "bread": "brööd",
            "oven": "øøven",
            "bake": "stîickéé in de øøven",
            "cook": "börk börk!",
            "pan": "pööt",
            "hot": "höt höt höt",
            "stir": "stîiirën",
            "knead": "knøøden",
            "cut": "chøøp! chøøp!",
            "roll": "røøllen",
            "shape": "twîîstéé twîîstéé",
            "put": "plööppen",
            "cover": "køøvøørén",
            "rest": "reeeestéén",
            "brush": "brüüüüshéé brüüüüshéé",
            "brown": "brøøwnéé",
            "minutes": "meenoootéés",
            "golden": "göööldén",
            "rise": "reeeestéén",
            "cheese": "cheeesy-wheeesy",
            "shrimp": "shrîîmpéé",
            "popcorn": "pöpcørn!",
            "microwave": "mîcrøøwaveeevöövêê!",
            "boil": "bøïllïnn ån bürndê",
            "whisk": "wîîskéé wîîskéé!",
            "pour": "flüüüüüp!",
            "melt": "mëlten",
            "add": "addën",
            "until": "üntîîl",
            "lukewarm": "lüüükvørm",
            "into": "een-tu",
            "bowl": "boool",
            "mixture": "mîîxüre",
            "gradually": "grææædually",
            "away": "awey",
            "surface": "süüürfæææs",
            "needed": "nëëëëdéd",
            "divide": "dîîvîîden",
            "cylinder": "sîîlîîndér",
            "strip": "strîîppéés",
            "decoration": "dekoråååshun",
            "lined": "lîîîned",
            "preheat": "prêêhëëtën",
            "whisked": "wîîîîîîskéd",
            "egg wash": "eeggy-wîîggly-wîîggly brüüüüshéé",
            "let": "lëët",
            "lightly": "lîîghtly",
            "place": "plöööppen",
            "baking": "bâââkin",
            "sheet": "shëëtën",
            "parchment": "pârchmënt",
            "golden brown": "göööldén brøøwnéé",
            "slice": "slîîsëën",
            "fill": "fîîllën",
            "spread": "sprëëëdën",
            "jam": "jâââmën",
            "cream": "crêêêméé",
            "sauce": "sööösa",
            "layer": "lâââyër",
            "frosting": "fröööstîîng",
            "topping": "tøøøppîîng"
        };

        const interjections = ["BÖRK!", "HÖÖHÖHÖ!", "YOOORGEN FLÖÖR!", "FLEEB FLÖÖB!", "SMÖRGA SMÖRGA!"];
        let lastInterjection = '';

        function getNextInterjection() {
            let available = interjections.filter(i => i !== lastInterjection);
            let next = available[Math.floor(Math.random() * available.length)];
            lastInterjection = next;
            return next;
        }

        function preserveCase(original, translated) {
            if (original === original.toUpperCase()) {
                return translated.toUpperCase();
            }
            if (original[0] === original[0].toUpperCase()) {
                return translated.charAt(0).toUpperCase() + translated.slice(1);
            }
            return translated;
        }

        function swedifyWord(word) {
            if (!word.match(/[a-zA-Z]/)) return word;
            
            // Common Swedish Chef phonetic patterns
            const patterns = {
                // Word beginnings
                '^th': 'd',
                '^ch': 'sh',
                '^c': 'k',
                '^ph': 'f',

                // Word endings
                'ing$': 'een',
                'ed$': 'ëd',
                'er$': 'ür',
                'or$': 'ør',
                'ar$': 'år',
                'ly$': 'lee',
                'le$': 'el',
                'tion$': 'shün',
                'sion$': 'shün',

                // Internal consonant sounds
                'ck': 'k',
                'ch': 'sh',
                'sh': 'sh',
                'ph': 'f',
                'th': 'd',

                // Vowel combinations (ordered by length to prevent overlap)
                'oo': 'øø',
                'ou': 'øø',
                'oa': 'øø',
                'ow': 'øø',
                'ee': 'ëë',
                'ea': 'ëë',
                'ei': 'ëë',
                'ey': 'ëë',

                // Single vowels (applied last)
                'u': 'ü',
                'o': 'ø',
                'a': 'å',
                'i': 'î',
                'y': 'ë'
            };

            let result = word.toLowerCase();
            
            // Apply phonetic replacements in order
            Object.entries(patterns).forEach(([sound, replacement]) => {
                const regex = new RegExp(sound, 'g');
                if (regex.test(result)) {
                    result = result.replace(regex, replacement);
                }
            });

            // Add common Swedish Chef word structures
            if (result.length > 3) {
                // Add prefixes
                if (Math.random() < 0.3) {
                    const prefixes = ['dü ', 'dê ', 'yî '];
                    result = prefixes[Math.floor(Math.random() * prefixes.length)] + result;
                }
                
                // Add suffixes
                if (Math.random() < 0.3 && !result.endsWith('a')) {
                    const suffixes = ['-a', '-ën', '-ür'];
                    result = result + suffixes[Math.floor(Math.random() * suffixes.length)];
                }
            }

            // Sometimes split words with hyphens for emphasis
            if (result.length > 5 && Math.random() < 0.2) {
                const syllables = result.match(/[bcdfghjklmnpqrstvwxz]*[åäëéøöüûîï]+(?:[bcdfghjklmnpqrstvwxz]*e?|[bcdfghjklmnpqrstvwxz]*[åäëéøöüûîï]+[bcdfghjklmnpqrstvwxz]*)*/gi) || [result];
                if (syllables.length > 1) {
                    result = syllables.join('-');
                }
            }

            return preserveCase(word, result);
        }

        let sentences = text.split(/([.!?]+)/).filter(Boolean);
        return sentences.map((part, i) => {
            if (/^[.!?]+$/.test(part)) {
                return '';
            }
            let words = part.split(/(\b|\s|[^a-zA-Z])/);
            let translatedWords = words.map(word => {
                let lowerWord = word.toLowerCase();
                let translated = replacements[lowerWord] || swedifyWord(word);
                return preserveCase(word, translated);
            });
            let translatedSentence = translatedWords.join("");
            let punctuation = sentences[i + 1] || '';
            if (!/^[.!?]+$/.test(punctuation)) {
                punctuation = '.';
            }
            if (Math.random() < 0.3) {
                return translatedSentence + " " + getNextInterjection();
            }
            return translatedSentence + punctuation;
        }).join(" ").trim();
    }
});
