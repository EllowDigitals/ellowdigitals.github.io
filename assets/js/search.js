
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const suggestionsBox = document.getElementById('search-suggestions');

    const siteContent = {
        about: document.getElementById('about'),
        services: document.getElementById('services'),
        projects: document.getElementById('projects'),
        contact: document.getElementById('contact'),
        features: document.getElementById('features'),
        technology: document.getElementById('technology'),
        testimonials: document.getElementById('testimonials'),
        blog: document.getElementById('blog'),
    };

    // Trie node definition
    class TrieNode {
        constructor() {
            this.children = {};
            this.sections = new Set();
        }
    }

    // Trie class for fast prefix-based search
    class Trie {
        constructor() {
            this.root = new TrieNode();
        }

        insert(word, section) {
            let node = this.root;
            for (const char of word) {
                if (!node.children[char]) node.children[char] = new TrieNode();
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
            const results = new Set([...node.sections]);
            for (const child in node.children) {
                for (const section of this._collectSections(node.children[child])) {
                    results.add(section);
                }
            }
            return Array.from(results);
        }
    }

    const trie = new Trie();

    // Populate Trie with words from each section
    for (const [section, element] of Object.entries(siteContent)) {
        if (element && element.textContent) {
            const words = element.textContent.toLowerCase().split(/\W+/);
            for (const word of words) {
                if (word.length > 1) {
                    trie.insert(word, section);
                }
            }
        }
    }

    // Debounce function to limit rapid input handling
    const debounce = (func, delay = 200) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // Show suggestions in the suggestion box
    function showSuggestions(suggestions, query) {
        suggestionsBox.innerHTML = '';
        if (suggestions.length === 0) {
            suggestionsBox.style.display = 'none';
            return;
        }

        suggestionsBox.style.display = 'block';
        suggestions.forEach(section => {
            const content = siteContent[section].textContent.trim().substring(0, 100);
            const snippet = content.replace(new RegExp(`(${query})`, 'i'), '<mark>$1</mark>');

            const div = document.createElement('div');
            div.innerHTML = snippet + '...';
            div.className = 'suggestion-item';
            div.tabIndex = 0;
            div.setAttribute('role', 'button');
            div.addEventListener('click', () => {
                window.location.href = `#${section}`;
                searchInput.value = '';
                suggestionsBox.style.display = 'none';
            });

            suggestionsBox.appendChild(div);
        });
    }

    // Handle input event with debounced function
    searchInput.addEventListener('input', debounce(() => {
        const query = searchInput.value.trim().toLowerCase();
        if (query.length > 0) {
            const matches = trie.search(query);
            showSuggestions(matches, query);
        } else {
            suggestionsBox.style.display = 'none';
        }
    }, 250));

    // Hide suggestions on outside click
    document.addEventListener('click', (e) => {
        if (!suggestionsBox.contains(e.target) && e.target !== searchInput) {
            suggestionsBox.style.display = 'none';
        }
    });
});

