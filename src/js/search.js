// search.js — Fuse.js fuzzy search integration

export class SearchComponent {
    constructor(app) {
        this.app = app;
        this.input = document.getElementById('search-input');
        this.resultsEl = document.getElementById('search-results');
        this.fuse = null;
        this.activeIndex = -1;
        this.results = [];

        this.initFuse();
        this.bindEvents();
    }

    initFuse() {
        this.fuse = new Fuse(this.app.models, {
            keys: [
                { name: 'name', weight: 0.4 },
                { name: 'shortName', weight: 0.3 },
                { name: 'company', weight: 0.15 },
                { name: 'id', weight: 0.1 },
                { name: 'tags', weight: 0.05 }
            ],
            threshold: 0.35,
            distance: 100,
            includeScore: true,
            minMatchCharLength: 1
        });
    }

    bindEvents() {
        this.input.addEventListener('input', () => this.onInput());
        this.input.addEventListener('focus', () => {
            if (this.input.value.length > 0) this.onInput();
        });
        this.input.addEventListener('keydown', (e) => this.onKeydown(e));

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.close();
            }
        });
    }

    onInput() {
        const query = this.input.value.trim();
        if (query.length === 0) {
            this.close();
            return;
        }

        this.results = this.fuse.search(query).slice(0, 10);
        this.activeIndex = -1;
        this.renderResults();
    }

    onKeydown(e) {
        if (!this.resultsEl.classList.contains('active')) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.activeIndex = Math.min(this.activeIndex + 1, this.results.length - 1);
            this.updateActive();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.activeIndex = Math.max(this.activeIndex - 1, -1);
            this.updateActive();
        } else if (e.key === 'Enter' && this.activeIndex >= 0) {
            e.preventDefault();
            const result = this.results[this.activeIndex];
            if (result) {
                this.selectResult(result.item);
            }
        }
    }

    renderResults() {
        if (this.results.length === 0) {
            this.resultsEl.innerHTML = '<div class="search-result-item"><span style="color: var(--text-muted)">No results found</span></div>';
            this.resultsEl.classList.add('active');
            return;
        }

        this.resultsEl.innerHTML = this.results.map((r, i) => {
            const model = r.item;
            const color = this.app.getCompanyColor(model.company);
            return `
                <div class="search-result-item ${i === this.activeIndex ? 'active' : ''}" data-index="${i}">
                    <span class="search-result-dot" style="background: ${color}"></span>
                    <span class="search-result-name">${model.shortName || model.name}</span>
                    <span class="search-result-company">${model.company}</span>
                </div>
            `;
        }).join('');

        this.resultsEl.classList.add('active');

        // Bind click
        this.resultsEl.querySelectorAll('.search-result-item').forEach(el => {
            el.addEventListener('click', () => {
                const idx = parseInt(el.dataset.index);
                const result = this.results[idx];
                if (result) this.selectResult(result.item);
            });
        });
    }

    updateActive() {
        this.resultsEl.querySelectorAll('.search-result-item').forEach((el, i) => {
            el.classList.toggle('active', i === this.activeIndex);
        });
    }

    selectResult(model) {
        this.app.navigateToModel(model.id);
        this.close();
        this.input.value = model.shortName || model.name;
        this.input.blur();
    }

    close() {
        this.resultsEl.classList.remove('active');
        this.resultsEl.innerHTML = '';
        this.activeIndex = -1;
        this.results = [];
    }
}
