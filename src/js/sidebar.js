// sidebar.js — Model detail sidebar component

export class SidebarComponent {
    constructor(app) {
        this.app = app;
        this.el = document.getElementById('detail-sidebar');
        this.content = document.getElementById('sidebar-content');
        this.closeBtn = document.getElementById('sidebar-close');

        this.closeBtn.addEventListener('click', () => this.hide());
    }

    show(model) {
        const color = this.app.getCompanyColor(model.company);
        const relations = this.app.getModelRelations(model.id);

        let linksHtml = '';
        if (model.huggingfaceUrl) linksHtml += `<a href="${model.huggingfaceUrl}" target="_blank" class="model-link">🤗 HuggingFace</a>`;
        if (model.paperUrl) linksHtml += `<a href="${model.paperUrl}" target="_blank" class="model-link">📄 Paper</a>`;
        if (model.blogUrl) linksHtml += `<a href="${model.blogUrl}" target="_blank" class="model-link">📝 Blog</a>`;

        let parentsHtml = '';
        if (relations.parents.length > 0) {
            parentsHtml = `
                <div class="model-relations">
                    <div class="relations-title">Parents</div>
                    ${relations.parents.map(r => `
                        <div class="relation-item" data-model-id="${r.model.id}">
                            <span class="relation-dot" style="background: ${this.app.getCompanyColor(r.model.company)}"></span>
                            <span class="relation-name">${r.model.shortName || r.model.name}</span>
                            <span class="relation-type">${r.type}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        let childrenHtml = '';
        if (relations.children.length > 0) {
            childrenHtml = `
                <div class="model-relations">
                    <div class="relations-title">Children (${relations.children.length})</div>
                    ${relations.children.map(r => `
                        <div class="relation-item" data-model-id="${r.model.id}">
                            <span class="relation-dot" style="background: ${this.app.getCompanyColor(r.model.company)}"></span>
                            <span class="relation-name">${r.model.shortName || r.model.name}</span>
                            <span class="relation-type">${r.type}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        this.content.innerHTML = `
            <div class="model-header">
                <div class="model-name" style="color: ${color}">${model.name}</div>
                <div class="model-company-badge" style="background: ${color}22; color: ${color}; border: 1px solid ${color}44">
                    <span class="model-company-dot" style="background: ${color}"></span>
                    ${model.company}
                </div>
            </div>

            <div class="model-meta-grid">
                <div class="meta-item">
                    <div class="meta-label">Parameters</div>
                    <div class="meta-value mono">${model.parameters || 'Unknown'}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Released</div>
                    <div class="meta-value">${this.formatDate(model.releaseDate)}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Architecture</div>
                    <div class="meta-value mono">${model.architectureFamily || model.architecture || 'Unknown'}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Context</div>
                    <div class="meta-value mono">${model.contextWindow ? this.formatNumber(model.contextWindow) : 'N/A'}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">Modality</div>
                    <div class="meta-value">${model.modality || 'text'}</div>
                </div>
                <div class="meta-item">
                    <div class="meta-label">License</div>
                    <div class="meta-value">${model.licenseType || model.license || 'Unknown'}</div>
                </div>
            </div>

            ${model.description ? `<div class="model-description">${model.description}</div>` : ''}
            ${model.significance ? `<div class="model-significance">✨ ${model.significance}</div>` : ''}
            ${linksHtml ? `<div class="model-links">${linksHtml}</div>` : ''}
            ${parentsHtml}
            ${childrenHtml}
        `;

        this.el.classList.add('open');

        // Bind relation clicks
        this.content.querySelectorAll('.relation-item').forEach(el => {
            el.addEventListener('click', () => {
                const id = el.dataset.modelId;
                this.app.navigateToModel(id);
            });
        });
    }

    hide() {
        this.el.classList.remove('open');
        this.app.selectedModel = null;
        if (this.app.treeView) {
            this.app.treeView.highlightModel(null);
        }
    }

    formatDate(dateStr) {
        if (!dateStr) return 'Unknown';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }

    formatNumber(n) {
        if (n >= 1000000) return (n / 1000000).toFixed(0) + 'M';
        if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
        return n.toString();
    }
}
