// Add event listeners to nav links for SPA-like behavior
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault(); // Prevent full page refresh

    // Remove active class from all nav links and add it to the clicked link
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    this.classList.add('active');

    // Update the active indicator triangle's position
    updateActiveIndicator(this);

    // Load new content into the <main> area (simulate dynamic loading)
    loadPageContent(this.dataset.page);
  });
});

function updateActiveIndicator(activeLink) {
  const indicator = document.querySelector('.active-indicator');
  const linkRect = activeLink.getBoundingClientRect();
  const navRect = activeLink.closest('.navbar').getBoundingClientRect();
  // Center the triangle below the active link (triangle width assumed as 20px)
  const leftPos = linkRect.left - navRect.left + linkRect.width / 2 - 10;
  indicator.style.left = leftPos + 'px';
}

function loadPageContent(page) {
  const main = document.querySelector('main');
  let content = '';
  switch (page) {
    case 'home':
      content = `
        <section class="hero">
          <div class="hero-content">
            <h1 id="hero-heading">Welcome to the Kitchen</h1>
            <p>Where all your baking dreams come true</p>
            <button class="hero-button">Get Started</button>
          </div>
        </section>
        <section class="latest-recipes">
          <h2>Latest Recipes</h2>
          <div class="recipe-grid">
            <article class="recipe-card">
              <img src="https://via.placeholder.com/300x200" alt="Recipe 1">
              <h3>Recipe 1</h3>
              <p>A short description of Recipe 1.</p>
            </article>
            <article class="recipe-card">
              <img src="https://via.placeholder.com/300x200" alt="Recipe 2">
              <h3>Recipe 2</h3>
              <p>A short description of Recipe 2.</p>
            </article>
            <article class="recipe-card">
              <img src="https://via.placeholder.com/300x200" alt="Recipe 3">
              <h3>Recipe 3</h3>
              <p>A short description of Recipe 3.</p>
            </article>
          </div>
          <a href="recipes.html" class="cookbook-link">Find more in the cookbook!</a>
        </section>
      `;
      break;
    case 'recipes':
      content = `<section class="content"><h2>Recipes Page</h2><p>Content for recipes.</p></section>`;
      break;
    case 'shop':
      content = `<section class="content"><h2>Shop Page</h2><p>Content for shop.</p></section>`;
      break;
    case 'bakers':
      content = `<section class="content"><h2>The Bakers</h2><p>Content for the bakers.</p></section>`;
      break;
    case 'watch':
      content = `<section class="content"><h2>Watch Page</h2><p>Content for watch.</p></section>`;
      break;
    case 'about':
      content = `<section class="content"><h2>About Page</h2><p>Content for about.</p></section>`;
      break;
    default:
      content = `<section class="content"><h2>Home</h2><p>Default content.</p></section>`;
  }
  main.innerHTML = content;
}

// On page load, position the active indicator under the default active link
window.addEventListener('load', () => {
  const activeLink = document.querySelector('.nav-link.active');
  if (activeLink) updateActiveIndicator(activeLink);
});
