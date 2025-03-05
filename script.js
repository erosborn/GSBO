document.addEventListener('DOMContentLoaded', () => {
    // Create modal and overlay elements
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
}); 