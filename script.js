document.addEventListener("DOMContentLoaded", function () {
  console.log("Script is loaded and running");

  const indicator = document.querySelector(".active-indicator");
  const navLinks = document.querySelectorAll(".nav-link");

  function updateIndicator(link) {
    const linkRect = link.getBoundingClientRect();
    const navRect = link.closest(".navbar").getBoundingClientRect();
    // Calculate left offset so the indicator is centered under the link (assuming triangle width of 40px)
    const leftPos = linkRect.left - navRect.left + (linkRect.width / 2) - 20;
    indicator.style.left = leftPos + "px";
  }

  // On page load, position the indicator under the active link
  const activeLink = document.querySelector(".nav-link.active");
  if (activeLink) {
    updateIndicator(activeLink);
  }

  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent immediate navigation
      
      // Update active class on nav links
      navLinks.forEach(l => l.classList.remove("active"));
      this.classList.add("active");
      
      // Update the indicator's position (the CSS transition will animate it)
      updateIndicator(this);
      
      // Delay navigation to allow the transition to complete
      const href = this.getAttribute("href");
      setTimeout(() => {
        window.location.href = href;
      }, 300); // 300ms delay matches the transition duration in your CSS
    });
  });

  // Hamburger menu
  const hamburger = document.querySelector('.hamburger');
  const navLinksContainer = document.querySelector('.nav-links');
  
  if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinksContainer.classList.toggle('active');
      
      this.setAttribute('aria-expanded', this.classList.contains('active'));
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      const isClickInside = navLinksContainer.contains(event.target) || hamburger.contains(event.target);
      
      if (!isClickInside && navLinksContainer.classList.contains('active')) {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const recipeCards = document.querySelectorAll('.recipe-card');

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
    let lastInterjection = ''; // Track the last used interjection

    // Get random interjection that's different from the last one
    function getNextInterjection() {
        let availableInterjections = interjections.filter(i => i !== lastInterjection);
        let nextInterjection = availableInterjections[Math.floor(Math.random() * availableInterjections.length)];
        lastInterjection = nextInterjection;
        return nextInterjection;
    }

    // Function to preserve capitalization
    function preserveCase(original, translated) {
        if (original === original.toUpperCase()) {
            return translated.toUpperCase();
        }
        if (original[0] === original[0].toUpperCase()) {
            return translated.charAt(0).toUpperCase() + translated.slice(1);
        }
        return translated;
    }

    // Function to add randomness to unknown words
    function swedifyWord(word) {
        if (!word.match(/[a-zA-Z]/)) return word;
        
        let vowels = "aeiou";
        let result = word
            .toLowerCase()
            .split("")
            .map(char => (vowels.includes(char) && Math.random() < 0.3 ? char + char : char))
            .join("");
        
        return preserveCase(word, result);
    }

    // Split text into sentences, but keep track of their punctuation
    let sentences = text.split(/([.!?]+)/).filter(Boolean); // Filter removes empty strings

    return sentences.map((part, i) => {
        // If it's just punctuation, skip it (we'll handle it with the previous sentence)
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
        
        // Get the punctuation that follows this sentence
        let punctuation = sentences[i + 1] || '';
        if (!/^[.!?]+$/.test(punctuation)) {
            punctuation = '.'; // Default to period if no punctuation found
        }
        
        // Add interjection with 30% chance
        if (Math.random() < 0.3) {
            // Use the interjection's punctuation instead
            return translatedSentence + " " + getNextInterjection();
        }

        return translatedSentence + punctuation;
    }).join(" ").trim(); // Join with spaces and trim any extra whitespace
  }

  recipeCards.forEach(card => {
    const expandButton = card.querySelector('.expand-button');
    const collapseButton = card.querySelector('.collapse-button');
    const languageBtns = card.querySelectorAll('.language-btn');
    const instructions = card.querySelectorAll('ol li');
    let originalText = [];
    let translatedText = []; // Store the translated version

    // Check if this card is translatable
    if (card.dataset.translatable === 'true') {
        instructions.forEach(li => {
            originalText.push(li.textContent);
        });

        // Generate ChefSpeak translation immediately since it's the default
        instructions.forEach((li, i) => {
            translatedText[i] = swedishChefTranslate(originalText[i]);
            li.textContent = translatedText[i]; // Set initial text to ChefSpeak
        });

        languageBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Toggle active state
                languageBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update text
                if (btn.dataset.lang === 'chef') {
                    // Use stored translation
                    instructions.forEach((li, i) => {
                        li.textContent = translatedText[i];
                    });
                } else {
                    // Restore original text
                    instructions.forEach((li, i) => {
                        li.textContent = originalText[i];
                    });
                }
            });
        });
    } else {
        // Hide language buttons for non-translatable recipes
        card.querySelector('.language-buttons').style.display = 'none';
    }

    expandButton.addEventListener('click', () => {
        card.classList.add('expanded');
        document.body.style.overflow = 'hidden';
    });

    collapseButton.addEventListener('click', () => {
        card.classList.remove('expanded');
        document.body.style.overflow = '';
        
        // Reset to default language when closing
        const defaultInput = card.querySelector('.language-switch input[value="default"]');
        if (defaultInput && !defaultInput.checked) {
            defaultInput.checked = true;
            defaultInput.dispatchEvent(new Event('change'));
        }
    });
  });

  const practicalNotes = document.querySelectorAll('.practical-note');
  
  practicalNotes.forEach(note => {
    const toggle = note.querySelector('.practical-toggle');
    const toggleText = toggle.querySelector('.toggle-text');
    
    toggle.addEventListener('click', () => {
      note.classList.toggle('expanded');
      toggleText.textContent = note.classList.contains('expanded') 
        ? 'Hide practical steps' 
        : 'Show practical steps';
    });
  });
});
