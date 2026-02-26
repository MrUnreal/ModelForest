// app.js — Main application entry point
// Loads data, initializes all components

import { TreeView } from './tree-view.js';
import { SearchComponent } from './search.js';
import { SidebarComponent } from './sidebar.js';
import { FiltersComponent } from './filters.js';

class App {
    constructor() {
        this.models = [];
        this.relationships = [];
        this.companies = [];
        this.treeData = null;
        this.companyColorMap = {};
        this.currentView = 'tree';
        this.selectedModel = null;
        this.activeFilters = { companies: [], modalities: [], licenses: [], yearMin: 2017 };
    }

    async init() {
        try {
            await this.loadData();
            this.buildCompanyColorMap();
            this.treeData = this.buildTreeStructure();

            // Initialize components
            this.treeView = new TreeView(this);
            this.search = new SearchComponent(this);
            this.sidebar = new SidebarComponent(this);
            this.filters = new FiltersComponent(this);

            this.treeView.render(this.treeData);
            this.updateHeaderMeta();
            this.bindGlobalEvents();
        } catch (err) {
            console.error('Failed to initialize app:', err);
        }
    }

    async loadData() {
        const basePath = this.getBasePath();
        const files = ['openai', 'meta', 'google', 'anthropic', 'mistral', 'deepseek', 'microsoft', 'alibaba', 'stability'];

        const results = await Promise.all([
            ...files.map(f => fetch(`${basePath}data/curated/${f}.json`).then(r => r.json())),
            fetch(`${basePath}data/companies.json`).then(r => r.json())
        ]);

        const companiesData = results[results.length - 1];
        this.companies = companiesData.companies;

        for (let i = 0; i < files.length; i++) {
            const data = results[i];
            if (data.models) this.models.push(...data.models);
            if (data.relationships) this.relationships.push(...data.relationships);
        }

        console.log(`Loaded ${this.models.length} models, ${this.relationships.length} relationships`);
    }

    getBasePath() {
        const path = window.location.pathname;
        if (path.includes('/ModelForest/')) {
            return path.substring(0, path.indexOf('/ModelForest/') + '/ModelForest/'.length);
        }
        if (path.includes('/src/')) {
            return path.substring(0, path.indexOf('/src/')) + '/';
        }
        // Local dev — go up one dir from src/
        return '../';
    }

    buildCompanyColorMap() {
        this.companies.forEach(c => {
            this.companyColorMap[c.name] = c.color;
        });
        // Add aliases matching model company fields
        const aliases = {
            'OpenAI': '#10A37F', 'Meta': '#0668E1', 'Google': '#FBBC04',
            'Google DeepMind': '#FBBC04', 'Anthropic': '#D4A574',
            'Mistral': '#F7931A', 'Mistral AI': '#F7931A',
            'Microsoft': '#00BCF2', 'Alibaba': '#FF6A00',
            'DeepSeek': '#4A90D9', 'Stability AI': '#A855F7',
            'Hugging Face': '#FFD21E', 'Stanford': '#8C1515',
            'LMSYS': '#6366F1', 'UC Berkeley': '#003262',
            'CompVis': '#009CDE', 'Runway': '#FF4081',
            'Black Forest Labs': '#2D5016', 'Answer.AI': '#22C55E'
        };
        Object.assign(this.companyColorMap, aliases);
    }

    getCompanyColor(company) {
        return this.companyColorMap[company] || '#8b949e';
    }

    buildTreeStructure() {
        // Build adjacency: parent -> children
        const childrenMap = {};
        const hasParent = new Set();

        this.relationships.forEach(rel => {
            if (!childrenMap[rel.parent]) childrenMap[rel.parent] = [];
            childrenMap[rel.parent].push({ childId: rel.child, type: rel.type });
            hasParent.add(rel.child);
        });

        // Find root nodes (models with no parent)
        const modelMap = {};
        this.models.forEach(m => { modelMap[m.id] = m; });

        const roots = this.models.filter(m => !hasParent.has(m.id));

        // Build tree recursively
        const buildNode = (modelId, depth = 0) => {
            const model = modelMap[modelId];
            if (!model) return null;

            const children = (childrenMap[modelId] || [])
                .map(c => {
                    const node = buildNode(c.childId, depth + 1);
                    if (node) node._relType = c.type;
                    return node;
                })
                .filter(Boolean);

            return {
                id: model.id,
                name: model.shortName || model.name,
                data: model,
                children: children.length > 0 ? children : undefined,
                _depth: depth
            };
        };

        // Build forest with a virtual root
        const rootNodes = roots.map(r => buildNode(r.id)).filter(Boolean);

        return {
            id: '__root__',
            name: 'AI Models',
            data: { company: 'root' },
            children: rootNodes
        };
    }

    selectModel(modelId) {
        const model = this.models.find(m => m.id === modelId);
        if (!model) return;
        this.selectedModel = model;
        this.sidebar.show(model);
        this.treeView.highlightModel(modelId);
    }

    navigateToModel(modelId) {
        this.selectModel(modelId);
        this.treeView.centerOnModel(modelId);
    }

    getModelRelations(modelId) {
        const parents = this.relationships
            .filter(r => r.child === modelId)
            .map(r => ({ model: this.models.find(m => m.id === r.parent), type: r.type }))
            .filter(r => r.model);

        const children = this.relationships
            .filter(r => r.parent === modelId)
            .map(r => ({ model: this.models.find(m => m.id === r.child), type: r.type }))
            .filter(r => r.model);

        return { parents, children };
    }

    applyFilters(filters) {
        this.activeFilters = { ...this.activeFilters, ...filters };
        this.treeView.applyFilters(this.activeFilters);
    }

    updateHeaderMeta() {
        const el = document.getElementById('header-meta');
        const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        el.textContent = `${this.models.length} models · ${this.relationships.length} relationships · ${now}`;
    }

    bindGlobalEvents() {
        // Keyboard shortcut for search
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('search-input').focus();
            }
            if (e.key === 'Escape') {
                this.sidebar.hide();
                this.search.close();
            }
        });

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentView = btn.dataset.view;
                this.treeView.switchView(this.currentView);
            });
        });

        // Legend toggle
        const legendToggle = document.getElementById('legend-toggle');
        const legendBody = document.getElementById('legend-body');
        legendToggle.addEventListener('click', () => {
            legendToggle.classList.toggle('collapsed');
            legendBody.classList.toggle('collapsed');
        });

        // Zoom controls
        document.getElementById('zoom-in').addEventListener('click', () => this.treeView.zoomIn());
        document.getElementById('zoom-out').addEventListener('click', () => this.treeView.zoomOut());
        document.getElementById('zoom-fit').addEventListener('click', () => this.treeView.zoomFit());
        document.getElementById('expand-all').addEventListener('click', () => this.treeView.expandAll());
        document.getElementById('collapse-all').addEventListener('click', () => this.treeView.collapseAll());
    }
}

// Initialize
const app = new App();
app.init();
