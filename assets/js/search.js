document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const suggestionsBox = document.getElementById('search-suggestions');

    const siteContent = {
        about: document.getElementById('about'),
        blog: document.getElementById('blog'),
        contact: document.getElementById('contact'),
        engagement: document.getElementById('engagement'),
        features: document.getElementById('features'),
        footer: document.getElementById('site-footer'),
        gallery: document.getElementById('gallery'),
        how_we_work: document.getElementById('how-we-work'),
        mission_philosophy: document.getElementById('mission-philosophy'),
        recent_projects: document.getElementById('recent-projects'),
        services: document.getElementById('services'),
        technology: document.getElementById('technology'),
        testimonials: document.getElementById('testimonials'),
        why_choose_us: document.getElementById('why-choose-us'),
        work: document.getElementById('work-together'),
    };

    // ===== TRIE STRUCTURE =====

    class TrieNode {
        constructor() {
            this.children = {};
            this.sections = new Set();
        }
    }

    class Trie {
        constructor() {
            this.root = new TrieNode();
        }

        insert(word, section) {
            let node = this.root;
            for (const char of word) {
                if (!node.children[char]) {
                    node.children[char] = new TrieNode();
                }
                node = node.children[char];
            }
            node.sections.add(section);
        }

        search(prefix) {
            let node = this.root;
            for (const char of prefix) {
                if (!node.children[char]) return [];
                node = node.children[char];
            }
            return this._collectSections(node);
        }

        _collectSections(node) {
            const results = new Set(node.sections);
            for (const child in node.children) {
                for (const section of this._collectSections(node.children[child])) {
                    results.add(section);
                }
            }
            return Array.from(results);
        }
    }

    const trie = new Trie();

    // Populate the Trie with words from each section
    for (const [section, element] of Object.entries(siteContent)) {
        if (element && element.textContent) {
            const words = element.textContent.toLowerCase().split(/\W+/);
            words.forEach(word => {
                if (word.length > 1) {
                    trie.insert(word, section);
                }
            });
        }
    }

    // ===== UTILITIES =====

    const debounce = (func, delay = 200) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    };

    const createSuggestionItem = (section, snippet, query) => {
        const div = document.createElement('div');
        const highlighted = snippet.replace(
            new RegExp(`(${query})`, 'i'),
            '<mark>$1</mark>'
        );

        div.innerHTML = highlighted + '...';
        div.className = 'suggestion-item';
        div.tabIndex = 0;
        div.setAttribute('role', 'button');
        div.addEventListener('click', () => {
            window.location.href = `#${section}`;
            searchInput.value = '';
            suggestionsBox.style.display = 'none';
        });

        return div;
    };

    const showSuggestions = (suggestions, query) => {
        suggestionsBox.innerHTML = '';
        if (!suggestions.length) {
            suggestionsBox.style.display = 'none';
            return;
        }

        suggestionsBox.style.display = 'block';
        suggestions.forEach(section => {
            const content = siteContent[section]?.textContent?.trim().substring(0, 100) || '';
            if (content) {
                const item = createSuggestionItem(section, content, query);
                suggestionsBox.appendChild(item);
            }
        });
    };

    // ===== EVENTS =====

    searchInput.addEventListener('input', debounce(() => {
        const query = searchInput.value.trim().toLowerCase();
        if (query.length > 0) {
            const matches = trie.search(query);
            showSuggestions(matches, query);
        } else {
            suggestionsBox.style.display = 'none';
        }
    }, 250));

    document.addEventListener('click', (e) => {
        if (!suggestionsBox.contains(e.target) && e.target !== searchInput) {
            suggestionsBox.style.display = 'none';
        }
    });
});
