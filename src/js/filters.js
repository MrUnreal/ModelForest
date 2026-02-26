// filters.js — Filter panel component

export class FiltersComponent {
    constructor(app) {
        this.app = app;
        this.activeFilters = {
            companies: [],
            modalities: [],
            licenses: [],
            yearMin: 2017
        };

        this.buildCompanyFilters();
        this.buildModalityFilters();
        this.buildLicenseFilters();
        this.bindYearFilter();
        this.bindReset();
    }

    buildCompanyFilters() {
        const container = document.getElementById('company-filters');
        if (!container) return;

        // Count models per company
        const counts = {};
        this.app.models.forEach(m => {
            counts[m.company] = (counts[m.company] || 0) + 1;
        });

        // Sort by count
        const companies = Object.entries(counts)
            .sort((a, b) => b[1] - a[1]);

        container.innerHTML = companies.map(([company, count]) => {
            const color = this.app.getCompanyColor(company);
            return `
                <label class="filter-option">
                    <input type="checkbox" value="${company}" class="company-filter-cb">
                    <span class="color-dot" style="background: ${color}"></span>
                    <label>${company}</label>
                    <span class="count">${count}</span>
                </label>
            `;
        }).join('');

        container.querySelectorAll('.company-filter-cb').forEach(cb => {
            cb.addEventListener('change', () => this.onFilterChange());
        });
    }

    buildModalityFilters() {
        const container = document.getElementById('modality-filters');
        if (!container) return;

        const modalities = ['text', 'code', 'vision', 'image', 'audio'];

        container.innerHTML = modalities.map(mod => `
            <label class="filter-option">
                <input type="checkbox" value="${mod}" class="modality-filter-cb">
                <label>${mod.charAt(0).toUpperCase() + mod.slice(1)}</label>
            </label>
        `).join('');

        container.querySelectorAll('.modality-filter-cb').forEach(cb => {
            cb.addEventListener('change', () => this.onFilterChange());
        });
    }

    buildLicenseFilters() {
        const container = document.getElementById('license-filters');
        if (!container) return;

        const licenses = [
            { value: 'open-source', label: 'Open Source' },
            { value: 'open-weight', label: 'Open Weight' },
            { value: 'closed-source', label: 'Closed Source' }
        ];

        container.innerHTML = licenses.map(l => `
            <label class="filter-option">
                <input type="checkbox" value="${l.value}" class="license-filter-cb">
                <label>${l.label}</label>
            </label>
        `).join('');

        container.querySelectorAll('.license-filter-cb').forEach(cb => {
            cb.addEventListener('change', () => this.onFilterChange());
        });
    }

    bindYearFilter() {
        const slider = document.getElementById('year-min');
        const label = document.getElementById('year-min-label');
        if (!slider || !label) return;

        slider.addEventListener('input', () => {
            label.textContent = slider.value;
            this.activeFilters.yearMin = parseInt(slider.value);
            this.app.applyFilters(this.activeFilters);
        });
    }

    bindReset() {
        const resetBtn = document.getElementById('filter-reset');
        if (!resetBtn) return;

        resetBtn.addEventListener('click', () => {
            document.querySelectorAll('.company-filter-cb, .modality-filter-cb, .license-filter-cb').forEach(cb => {
                cb.checked = false;
            });
            const slider = document.getElementById('year-min');
            if (slider) {
                slider.value = 2017;
                document.getElementById('year-min-label').textContent = '2017';
            }
            this.activeFilters = { companies: [], modalities: [], licenses: [], yearMin: 2017 };
            this.app.applyFilters(this.activeFilters);
        });
    }

    onFilterChange() {
        this.activeFilters.companies = Array.from(document.querySelectorAll('.company-filter-cb:checked')).map(cb => cb.value);
        this.activeFilters.modalities = Array.from(document.querySelectorAll('.modality-filter-cb:checked')).map(cb => cb.value);
        this.activeFilters.licenses = Array.from(document.querySelectorAll('.license-filter-cb:checked')).map(cb => cb.value);
        this.app.applyFilters(this.activeFilters);
    }
}
