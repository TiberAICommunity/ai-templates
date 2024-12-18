document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('modelSearch');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const tags = document.querySelectorAll('.tag');
    const activeTagsContainer = document.querySelector('.active-tags');
    
    let activeCategory = 'all';
    let activeTags = new Set();

    function filterCards() {
        const searchTerm = searchInput.value.toLowerCase();
        const modelCards = document.querySelectorAll('.model-card');

        modelCards.forEach(card => {
            const modelName = card.querySelector('h3').textContent.toLowerCase();
            const cardTags = Array.from(card.querySelectorAll('.tag'))
                .map(tag => tag.textContent.toLowerCase());
            const category = card.dataset.category.toLowerCase();
            const matchesSearch = modelName.includes(searchTerm);
            const matchesCategory = activeCategory === 'all' || 
                                  category === activeCategory.toLowerCase();
            const matchesTags = activeTags.size === 0 || 
                              cardTags.some(tag => activeTags.has(tag.toLowerCase()));
            card.style.display = (matchesSearch && matchesCategory && matchesTags) ? 'block' : 'none';
        });
    }

    function updateActiveTags() {
        activeTagsContainer.innerHTML = '';
        activeTags.forEach(tag => {
            const tagEl = document.createElement('div');
            tagEl.className = 'active-tag';
            tagEl.innerHTML = `
                ${tag}
                <button class="remove-tag" onclick="removeTag('${tag}')">&times;</button>
            `;
            tagEl.addEventListener('click', () => removeTag(tag));
            activeTagsContainer.appendChild(tagEl);
        });
    }

    window.removeTag = function(tag) {
        activeTags.delete(tag.toLowerCase());
        updateActiveTags();
        filterCards();
        document.querySelectorAll('.tag').forEach(tagBtn => {
            if (tagBtn.textContent.toLowerCase() === tag.toLowerCase()) {
                tagBtn.classList.remove('active');
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterCards);
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeCategory = btn.dataset.category;
            filterCards();
        });
    });

    tags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.preventDefault();
            const tagText = tag.textContent.toLowerCase();
            if (activeTags.has(tagText)) {
                activeTags.delete(tagText);
                tag.classList.remove('active');
            } else {
                activeTags.add(tagText);
                tag.classList.add('active');
            }
            updateActiveTags();
            filterCards();
        });
    });
}); 