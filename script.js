document.addEventListener("DOMContentLoaded", () => {
    // Load random recipes on homepage
    function loadRecipePreviews() {
        const recipesGrid = document.querySelector(
            "main section:nth-of-type(2) #recipes-grid"
        );
        if (recipesGrid) {
            console.log("Found recipes grid, attempting to load recipes...");
            const isLocalFile = window.location.protocol === "file:";
            if (isLocalFile) {
                const sampleRecipes = [
                    {
                        href: "recipes/lussekatter.html",
                        imgSrc: "images/food/lussekatter_380x360.jpg",
                        title: "Classic St Lucia Buns",
                        subtitle: "Lussekatter",
                        description: "Traditional saffron-flavored sweet rolls"
                            + " for St. Lucia Day"
                    },
                    {
                        href: "recipes/kanelbullar.html",
                        imgSrc: "images/food/kanelbullar_380x360.jpg",
                        title: "Swedish Cinnamon Buns",
                        subtitle: "Kanelbullar",
                        description: "Classic Swedish cinnamon buns with"
                            + " pearl sugar topping"
                    },
                    {
                        href: "recipes/souffle.html",
                        imgSrc: "images/food/souffle_380x360.jpg",
                        title: "Lighter-than-Air Soufflé",
                        description: "A gravity-defying masterpiece that may"
                            + " require archery skills.",
                        isChefOriginal: true
                    }
                ];

                const shuffled = sampleRecipes.sort(() => Math.random() - 0.5);
                recipesGrid.innerHTML = "";
                shuffled.forEach(recipe => {
                    const recipeHTML = `
                        <a href="${recipe.href}"
                           aria-label="View full recipe for ${recipe.title}">
                            <figure>
                                <img src="${recipe.imgSrc}"
                                     alt="${recipe.title}">
                            </figure>
                            <div>
                                ${recipe.isChefOriginal ?
                                    "<span>Swedish Chef Original!</span>" : ""}
                                <h2>${recipe.title}</h2>
                                ${recipe.subtitle && recipe.subtitle.trim() ?
                                    `<h4>${recipe.subtitle}</h4>` : ""}
                                <p>${recipe.description}</p>
                            </div>
                        </a>
                    `;
                    recipesGrid.insertAdjacentHTML("beforeend", recipeHTML);
                });
                
                console.log("Successfully added sample recipes for local file viewing");
                
            } else {
                const currentPath = window.location.pathname;
                const recipesPath = currentPath.endsWith('index.html') || currentPath.endsWith('/') 
                    ? 'recipes.html' 
                    : './recipes.html';
                
                console.log('Fetching recipes from:', recipesPath);
                
                fetch(recipesPath, {
                    method: 'GET',
                    headers: {
                        'Accept': 'text/html'
                    }
                })
                    .then(function(response) {
                        console.log('Fetch response status:', response.status);
                        if (!response.ok) {
                            throw new Error('Network response was not ok: ' + response.status);
                        }
                        return response.text();
                    })
                    .then(function(html) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        
                        const recipes = Array.from(doc.querySelectorAll('#recipes-grid > a'));
                        console.log('Found recipes:', recipes.length);
                        
                        if (recipes.length) {
                            const shuffled = recipes.sort(() => Math.random() - 0.5);
                            const selectedRecipes = shuffled.slice(0, 3);
                            
                            recipesGrid.innerHTML = '';
                            selectedRecipes.forEach(recipe => {
                                const recipeClone = recipe.cloneNode(true);
                                const categorySpan = recipeClone.querySelector('div > span');
                                if (categorySpan && !categorySpan.textContent.includes('Swedish Chef Original')) {
                                    categorySpan.remove();
                                }
                                recipesGrid.appendChild(recipeClone);
                            });
                            
                            console.log('Successfully added recipes to the grid');
                        } else {
                            throw new Error('No recipes found in the parsed HTML');
                        }
                    })
                    .catch(function(err) {
                        console.error('Could not load recipes. Details:', err);
                        if (recipesGrid) {
                            recipesGrid.innerHTML = '<p>Sorry, recipes are temporarily unavailable. Please try again later.</p>';
                            console.error('Full error details:', {
                                message: err.message,
                                stack: err.stack,
                                location: window.location.href
                            });
                        }
                    });
            }
        } else {
            console.log('Recipes grid not found on this page');
        }
    }
    
    loadRecipePreviews();

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    const modal = document.createElement('div');
    modal.className = 'baker-modal';
    document.body.appendChild(modal);

    const articles = document.querySelectorAll('#bakers-grid article');
    articles.forEach(article => {
        article.addEventListener('click', (e) => {
            const aside = article.querySelector('aside');
            if (!aside) return;

            let modalContent = '';
            const contentContainer = aside.querySelector('div:last-child');

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

            modal.querySelector('.close-button').addEventListener('click', closeModal);
        });
    });

    overlay.addEventListener('click', closeModal);

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

    function elementExists(selector) {
        return document.querySelector(selector) !== null;
    }

    function setupMobileMenu() {
        if (window.innerWidth > 480) {
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
            
            nav.insertBefore(menuToggle, nav.firstChild);
            console.log("Toggle button created and inserted");
        }
        
        if (!elementExists('.mobile-menu-overlay')) {
            console.log("Creating mobile menu overlay");
            const mobileMenuOverlay = document.createElement('div');
            mobileMenuOverlay.className = 'mobile-menu-overlay';
            
            const navUl = nav.querySelector('ul');
            if (navUl) {
                const navLinks = navUl.cloneNode(true);
                mobileMenuOverlay.appendChild(navLinks);
                console.log("Navigation links cloned");
            } else {
                console.error("Navigation list not found");
            }
            
            nav.appendChild(mobileMenuOverlay);
            console.log("Mobile menu overlay created and appended");
        }
        
        const menuToggle = document.querySelector('.nav-toggle');
        const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
        
        if (!menuToggle || !mobileMenuOverlay) {
            console.error("Toggle or overlay not found after creation");
            return;
        }
        
        const newMenuToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
        
        newMenuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("Toggle clicked");
            this.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
        });
        
        mobileMenuOverlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                console.log("Link clicked, closing menu");
                mobileMenuOverlay.classList.remove('active');
                newMenuToggle.classList.remove('active');
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && mobileMenuOverlay.classList.contains('active')) {
                console.log("Outside click, closing menu");
                mobileMenuOverlay.classList.remove('active');
                newMenuToggle.classList.remove('active');
            }
        });
        
        console.log("Mobile menu setup complete");
    }
    
    console.log("Initializing mobile menu...");
    setupMobileMenu();
    
    window.addEventListener('resize', () => {
        setupMobileMenu();
    });
    
    // ChefSpeak Translation Setup
    console.log("Setting up ChefSpeak translations...");
    const recipeArticles = document.querySelectorAll('#recipe-body article');
    console.log("Found recipe articles:", recipeArticles.length);
    
    recipeArticles.forEach((article, index) => {
        console.log(`Setting up translation for article ${index + 1}`);
        setupChefTranslation(article);
    });

    function setupChefTranslation(container) {
        const toggleSwitch = container.querySelector('#translateToggle');
        const instructions = container.querySelectorAll('ol li');
        
        console.log("Toggle switch found:", !!toggleSwitch);
        console.log("Number of instruction items:", instructions.length);
        
        if (!toggleSwitch || !instructions.length) {
            console.log("Missing required elements, skipping setup");
            return;
        }

        let originalText = [];
        let translatedText = [];

        instructions.forEach((li, index) => {
            originalText.push(li.textContent);
            translatedText.push(swedishChefTranslate(li.textContent));
            console.log(`Instruction ${index + 1} translated`);
        });

        toggleSwitch.addEventListener('change', (e) => {
            console.log("Toggle changed:", e.target.checked);
            instructions.forEach((li, i) => {
                li.textContent = e.target.checked ? translatedText[i] : originalText[i];
            });
        });

        toggleSwitch.checked = true;
        instructions.forEach((li, i) => {
            li.textContent = translatedText[i];
        });
        console.log("Initial translation complete");
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
            
            const patterns = {
                '^th': 'd',
                '^ch': 'sh',
                '^c': 'k',
                '^ph': 'f',
                'ing$': 'een',
                'ed$': 'ëd',
                'er$': 'ür',
                'or$': 'ør',
                'ar$': 'år',
                'ly$': 'lee',
                'le$': 'el',
                'tion$': 'shün',
                'sion$': 'shün',
                'ck': 'k',
                'ch': 'sh',
                'sh': 'sh',
                'ph': 'f',
                'th': 'd',
                'oo': 'øø',
                'ou': 'øø',
                'oa': 'øø',
                'ow': 'øø',
                'ee': 'ëë',
                'ea': 'ëë',
                'ei': 'ëë',
                'ey': 'ëë',
                'u': 'ü',
                'o': 'ø',
                'a': 'å',
                'i': 'î',
                'y': 'ë'
            };

            let result = word.toLowerCase();
            
            Object.entries(patterns).forEach(([sound, replacement]) => {
                const regex = new RegExp(sound, 'g');
                if (regex.test(result)) {
                    result = result.replace(regex, replacement);
                }
            });

            if (result.length > 3) {
                if (Math.random() < 0.3) {
                    const prefixes = ['dü ', 'dê ', 'yî '];
                    result = prefixes[Math.floor(Math.random() * prefixes.length)] + result;
                }
                
                if (Math.random() < 0.3 && !result.endsWith('a')) {
                    const suffixes = ['-a', '-ën', '-ür'];
                    result = result + suffixes[Math.floor(Math.random() * suffixes.length)];
                }
            }

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
