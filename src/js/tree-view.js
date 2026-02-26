// tree-view.js — D3.js collapsible tree visualization (enhanced)

export class TreeView {
    constructor(app) {
        this.app = app;
        this.container = document.getElementById('viz-container');
        this.svg = d3.select('#tree-svg');
        this.tooltip = document.getElementById('tooltip');
        this.root = null;
        this.nodeMap = new Map();
        this.duration = 600;
        this.nodeRadius = 14;
        this.currentView = 'tree';
        this.setupSVG();
    }

    setupSVG() {
        const defs = this.svg.append('defs');

        // Glow filter for nodes
        const glow = defs.append('filter')
            .attr('id', 'node-glow')
            .attr('x', '-50%').attr('y', '-50%')
            .attr('width', '200%').attr('height', '200%');
        glow.append('feGaussianBlur')
            .attr('stdDeviation', '4')
            .attr('result', 'blur');
        glow.append('feComposite')
            .attr('in', 'SourceGraphic')
            .attr('in2', 'blur')
            .attr('operator', 'over');

        // Stronger glow for selected nodes
        const glowStrong = defs.append('filter')
            .attr('id', 'node-glow-strong')
            .attr('x', '-80%').attr('y', '-80%')
            .attr('width', '260%').attr('height', '260%');
        glowStrong.append('feGaussianBlur')
            .attr('stdDeviation', '8')
            .attr('result', 'blur');
        glowStrong.append('feComposite')
            .attr('in', 'SourceGraphic')
            .attr('in2', 'blur')
            .attr('operator', 'over');

        // Drop shadow for tooltip etc.
        const shadow = defs.append('filter')
            .attr('id', 'drop-shadow')
            .attr('x', '-30%').attr('y', '-30%')
            .attr('width', '160%').attr('height', '160%');
        shadow.append('feDropShadow')
            .attr('dx', '0').attr('dy', '2')
            .attr('stdDeviation', '3')
            .attr('flood-color', 'rgba(0,0,0,0.5)');

        this.g = this.svg.append('g');
        this.linkGroup = this.g.append('g').attr('class', 'links-layer');
        this.nodeGroup = this.g.append('g').attr('class', 'nodes-layer');

        this.zoom = d3.zoom()
            .scaleExtent([0.05, 5])
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
            });
        this.svg.call(this.zoom);
    }

    render(treeData) {
        this.root = d3.hierarchy(treeData);
        // Show all nodes expanded by default (use Collapse All button to condense)
        this.root.descendants().forEach(d => this.nodeMap.set(d.data.id, d));
        this.update(this.root);
        setTimeout(() => this.zoomFit(), 150);
    }

    update(source) {
        const allNodes = this.root.descendants();
        const allLinks = this.root.links();

        // Better spacing
        const leaves = allNodes.filter(d => !d.children).length;
        const treeHeight = Math.max(500, leaves * 42);
        const treeWidth = Math.max(800, (this.root.height + 1) * 280);

        const treeLayout = d3.tree()
            .size([treeHeight, treeWidth])
            .separation((a, b) => a.parent === b.parent ? 1 : 1.4);
        treeLayout(this.root);

        // ===== Links =====
        const link = this.linkGroup.selectAll('.link')
            .data(allLinks, d => d.target.data.id);

        const linkEnter = link.enter()
            .append('path')
            .attr('class', d => `link ${d.target.data._relType || 'base'}`)
            .attr('fill', 'none')
            .attr('stroke', d => this.getLinkColor(d))
            .attr('stroke-width', d => this.getLinkWidth(d))
            .attr('stroke-opacity', 0.55)
            .attr('d', d => {
                const o = { x: source.x0 || source.x, y: source.y0 || source.y };
                return this.diagonal(o, o);
            });

        link.merge(linkEnter)
            .transition()
            .duration(this.duration)
            .attr('d', d => this.diagonal(d.source, d.target))
            .attr('stroke', d => this.getLinkColor(d))
            .attr('stroke-width', d => this.getLinkWidth(d));

        link.exit()
            .transition()
            .duration(this.duration)
            .attr('stroke-opacity', 0)
            .attr('d', d => {
                const o = { x: source.x, y: source.y };
                return this.diagonal(o, o);
            })
            .remove();

        // ===== Nodes =====
        const node = this.nodeGroup.selectAll('.node')
            .data(allNodes, d => d.data.id);

        const self = this;

        const nodeEnter = node.enter()
            .append('g')
            .attr('class', d => `node ${d.data.id === '__root__' ? 'root-node' : ''}`)
            .attr('data-id', d => d.data.id)
            .attr('transform', d => `translate(${source.y0 || source.y},${source.x0 || source.x})`)
            .style('cursor', d => d.data.id === '__root__' ? 'default' : 'pointer')
            .on('click', (event, d) => {
                if (d.data.id === '__root__') return;
                event.stopPropagation();
                this.app.selectModel(d.data.id);
            })
            .on('dblclick', (event, d) => {
                event.stopPropagation();
                this.toggleNode(d);
            })
            .on('mouseover', function(event, d) {
                if (d.data.id === '__root__') return;
                self.showTooltip(event, d);
                d3.select(this).select('.node-outer')
                    .transition().duration(200)
                    .attr('r', self.getNodeRadius(d) + 4)
                    .attr('stroke-opacity', 1);
                d3.select(this).select('.node-label')
                    .transition().duration(200)
                    .style('fill', '#ffffff');
            })
            .on('mouseout', function(event, d) {
                self.hideTooltip();
                d3.select(this).select('.node-outer')
                    .transition().duration(300)
                    .attr('r', self.getNodeRadius(d))
                    .attr('stroke-opacity', 0.7);
                d3.select(this).select('.node-label')
                    .transition().duration(300)
                    .style('fill', '#c9d1d9');
            });

        // Outer glow ring
        nodeEnter.append('circle')
            .attr('class', 'node-glow')
            .attr('r', 0)
            .attr('fill', d => this.getNodeColor(d))
            .attr('opacity', 0.15)
            .attr('filter', 'url(#node-glow)');

        // Main node circle
        nodeEnter.append('circle')
            .attr('class', 'node-outer')
            .attr('r', 0)
            .attr('fill', d => {
                if (d.data.id === '__root__') return 'transparent';
                return this.darken(this.getNodeColor(d), 0.5);
            })
            .attr('stroke', d => this.getNodeColor(d))
            .attr('stroke-width', d => d.data.id === '__root__' ? 0 : 2.5)
            .attr('stroke-opacity', 0.7)
            .attr('stroke-dasharray', d => this.getStrokeDash(d));

        // Inner bright dot
        nodeEnter.append('circle')
            .attr('class', 'node-inner')
            .attr('r', 0)
            .attr('fill', d => this.getNodeColor(d))
            .attr('opacity', 0.9);

        // Company initial inside larger nodes
        nodeEnter.append('text')
            .attr('class', 'node-icon')
            .attr('dy', '0.35em')
            .attr('text-anchor', 'middle')
            .style('font-size', '0px')
            .style('font-weight', '700')
            .style('fill', '#fff')
            .style('pointer-events', 'none')
            .text(d => {
                if (d.data.id === '__root__' || !d.data.data) return '';
                const r = this.getNodeRadius(d);
                if (r < 12) return '';
                const name = d.data.data.shortName || d.data.data.name || '';
                return name.charAt(0).toUpperCase();
            });

        // Label
        nodeEnter.append('text')
            .attr('class', 'node-label')
            .attr('dy', '0.35em')
            .attr('x', d => d.children || d._children ? -20 : 20)
            .attr('text-anchor', d => d.children || d._children ? 'end' : 'start')
            .text(d => d.data.id === '__root__' ? '' : (d.data.data?.shortName || d.data.name))
            .style('font-size', d => d.depth <= 1 ? '13px' : '12px')
            .style('font-weight', d => d.depth <= 1 ? '600' : '400')
            .style('font-family', "'JetBrains Mono', monospace")
            .style('fill', '#c9d1d9')
            .style('paint-order', 'stroke')
            .style('stroke', '#0d1117')
            .style('stroke-width', '3px')
            .style('pointer-events', 'none');

        // Collapsed-children badge
        nodeEnter.each(function(d) {
            if (d._children && d._children.length > 0) {
                const g = d3.select(this);
                const r = self.getNodeRadius(d);
                g.append('rect')
                    .attr('class', 'badge-bg')
                    .attr('x', r + 2).attr('y', -r - 4)
                    .attr('width', 22).attr('height', 14)
                    .attr('rx', 7)
                    .attr('fill', self.getNodeColor(d))
                    .attr('opacity', 0.85);
                g.append('text')
                    .attr('class', 'badge')
                    .attr('x', r + 13).attr('y', -r + 5)
                    .attr('text-anchor', 'middle')
                    .text(`+${d._children.length}`)
                    .style('font-size', '9px')
                    .style('font-weight', '700')
                    .style('fill', '#fff')
                    .style('pointer-events', 'none');
            }
        });

        // ===== Transition existing nodes =====
        const nodeUpdate = node.merge(nodeEnter)
            .transition()
            .duration(this.duration)
            .attr('transform', d => `translate(${d.y},${d.x})`);

        nodeUpdate.select('.node-glow')
            .attr('r', d => d.data.id === '__root__' ? 0 : this.getNodeRadius(d) + 8);

        nodeUpdate.select('.node-outer')
            .attr('r', d => d.data.id === '__root__' ? 0 : this.getNodeRadius(d))
            .attr('fill', d => {
                if (d.data.id === '__root__') return 'transparent';
                return this.darken(this.getNodeColor(d), 0.5);
            })
            .attr('stroke', d => this.getNodeColor(d));

        nodeUpdate.select('.node-inner')
            .attr('r', d => d.data.id === '__root__' ? 0 : this.getNodeRadius(d) * 0.45);

        nodeUpdate.select('.node-icon')
            .style('font-size', d => {
                const r = this.getNodeRadius(d);
                return r >= 12 ? `${Math.round(r * 0.85)}px` : '0px';
            });

        nodeUpdate.select('.node-label')
            .attr('x', d => d.children || d._children ? -20 : 20)
            .attr('text-anchor', d => d.children || d._children ? 'end' : 'start');

        // Rebuild badges on update
        this.nodeGroup.selectAll('.node').each(function(d) {
            const g = d3.select(this);
            g.selectAll('.badge, .badge-bg').remove();
            if (d._children && d._children.length > 0) {
                const r = self.getNodeRadius(d);
                g.append('rect')
                    .attr('class', 'badge-bg')
                    .attr('x', r + 2).attr('y', -r - 4)
                    .attr('width', 22).attr('height', 14)
                    .attr('rx', 7)
                    .attr('fill', self.getNodeColor(d))
                    .attr('opacity', 0.85);
                g.append('text')
                    .attr('class', 'badge')
                    .attr('x', r + 13).attr('y', -r + 5)
                    .attr('text-anchor', 'middle')
                    .text(`+${d._children.length}`)
                    .style('font-size', '9px')
                    .style('font-weight', '700')
                    .style('fill', '#fff')
                    .style('pointer-events', 'none');
            }
        });

        // ===== Exit =====
        const nodeExit = node.exit()
            .transition()
            .duration(this.duration)
            .attr('transform', d => `translate(${source.y},${source.x})`)
            .style('opacity', 0)
            .remove();

        nodeExit.select('.node-outer').attr('r', 0);
        nodeExit.select('.node-glow').attr('r', 0);
        nodeExit.select('.node-inner').attr('r', 0);

        // Store positions for transitions
        allNodes.forEach(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    diagonal(s, d) {
        const midY = (s.y + d.y) / 2;
        return `M${s.y},${s.x} C${midY},${s.x} ${midY},${d.x} ${d.y},${d.x}`;
    }

    getLinkColor(d) {
        if (d.source.data.id === '__root__') {
            return this.getNodeColor(d.target);
        }
        return this.getNodeColor(d.source);
    }

    getLinkWidth(d) {
        const depth = d.source.depth;
        if (depth === 0) return 3;
        if (depth === 1) return 2.5;
        if (depth === 2) return 2;
        return 1.5;
    }

    getNodeColor(d) {
        if (d.data.id === '__root__') return 'transparent';
        const company = d.data.data?.company || '';
        return this.app.getCompanyColor(company);
    }

    darken(hex, factor) {
        if (!hex || hex === 'transparent') return hex;
        hex = hex.replace('#', '');
        if (hex.length !== 6) return hex;
        const r = Math.round(parseInt(hex.substring(0, 2), 16) * factor);
        const g = Math.round(parseInt(hex.substring(2, 4), 16) * factor);
        const b = Math.round(parseInt(hex.substring(4, 6), 16) * factor);
        return `rgb(${r},${g},${b})`;
    }

    getNodeStroke(d) {
        if (d.data.id === '__root__') return 'none';
        return this.getNodeColor(d);
    }

    getStrokeDash(d) {
        const lt = d.data.data?.licenseType;
        if (lt === 'closed-source') return '4 3';
        if (lt === 'open-weight') return '6 3';
        return 'none';
    }

    getNodeRadius(d) {
        if (d.data.id === '__root__') return 0;
        const params = d.data.data?.parametersRaw;
        if (!params) return this.nodeRadius;
        const logSize = Math.log10(params);
        return Math.max(8, Math.min(22, logSize * 2));
    }

    toggleNode(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else if (d._children) {
            d.children = d._children;
            d._children = null;
        }
        this.update(d);
    }

    expandAll() {
        const expand = (d) => {
            if (d._children) {
                d.children = d._children;
                d._children = null;
            }
            if (d.children) d.children.forEach(expand);
        };
        expand(this.root);
        this.update(this.root);
        setTimeout(() => this.zoomFit(), this.duration + 50);
    }

    collapseAll() {
        const collapse = (d) => {
            if (d.children && d.depth > 0) {
                d._children = d.children;
                d.children = null;
            }
            if (d.children) d.children.forEach(collapse);
        };
        this.root.children?.forEach(collapse);
        this.update(this.root);
        setTimeout(() => this.zoomFit(), this.duration + 50);
    }

    highlightModel(modelId) {
        this.nodeGroup.selectAll('.node').classed('selected', false).classed('dimmed', false);
        this.linkGroup.selectAll('.link').classed('dimmed', false).classed('highlighted', false);

        if (!modelId) return;

        const node = this.nodeMap.get(modelId);
        if (!node) return;

        const relatedIds = new Set();
        relatedIds.add(modelId);

        // Ancestors
        let curr = node;
        while (curr.parent) {
            relatedIds.add(curr.parent.data.id);
            curr = curr.parent;
        }

        // Immediate children
        const addChildren = (n) => {
            if (n.children) n.children.forEach(c => relatedIds.add(c.data.id));
            if (n._children) n._children.forEach(c => relatedIds.add(c.data.id));
        };
        addChildren(node);

        this.nodeGroup.selectAll('.node')
            .classed('dimmed', d => !relatedIds.has(d.data.id))
            .classed('selected', d => d.data.id === modelId);

        // Boost glow on selected
        this.nodeGroup.selectAll('.node.selected .node-glow')
            .attr('opacity', 0.4)
            .attr('filter', 'url(#node-glow-strong)');

        this.linkGroup.selectAll('.link')
            .classed('dimmed', d => !relatedIds.has(d.source.data.id) || !relatedIds.has(d.target.data.id))
            .classed('highlighted', d => relatedIds.has(d.source.data.id) && relatedIds.has(d.target.data.id));
    }

    centerOnModel(modelId) {
        const node = this.nodeMap.get(modelId);
        if (!node) return;

        let curr = node;
        const toExpand = [];
        while (curr.parent) {
            toExpand.unshift(curr.parent);
            curr = curr.parent;
        }
        toExpand.forEach(n => {
            if (n._children) {
                n.children = n._children;
                n._children = null;
            }
        });
        this.update(this.root);

        setTimeout(() => {
            const updatedNode = this.nodeMap.get(modelId);
            if (!updatedNode) return;

            const width = this.container.clientWidth;
            const height = this.container.clientHeight;

            const transform = d3.zoomIdentity
                .translate(width / 2 - updatedNode.y, height / 2 - updatedNode.x)
                .scale(1);

            this.svg.transition().duration(this.duration)
                .call(this.zoom.transform, transform);
        }, this.duration + 50);
    }

    showTooltip(event, d) {
        const model = d.data.data;
        if (!model) return;

        const color = this.app.getCompanyColor(model.company);
        this.tooltip.innerHTML = `
            <div class="tooltip-header" style="border-left: 3px solid ${color}; padding-left: 8px;">
                <div class="tooltip-name">${model.shortName || model.name}</div>
                <div class="tooltip-company" style="color: ${color}">${model.company}</div>
            </div>
            <div class="tooltip-meta">
                ${model.parameters ? `<span class="tooltip-tag">${model.parameters}</span>` : ''}
                ${model.releaseDate ? `<span class="tooltip-tag">${model.releaseDate}</span>` : ''}
                ${model.modality ? `<span class="tooltip-tag">${model.modality}</span>` : ''}
            </div>
        `;

        const rect = this.container.getBoundingClientRect();
        const x = event.clientX - rect.left + 16;
        const y = event.clientY - rect.top - 12;

        this.tooltip.style.left = x + 'px';
        this.tooltip.style.top = y + 'px';
        this.tooltip.classList.add('active');
    }

    hideTooltip() {
        this.tooltip.classList.remove('active');
    }

    zoomIn() {
        this.svg.transition().duration(300).call(this.zoom.scaleBy, 1.3);
    }

    zoomOut() {
        this.svg.transition().duration(300).call(this.zoom.scaleBy, 0.7);
    }

    zoomFit() {
        const bounds = this.g.node().getBBox();
        if (bounds.width === 0 || bounds.height === 0) return;

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        const padding = 80;

        const scale = Math.min(
            (width - padding * 2) / bounds.width,
            (height - padding * 2) / bounds.height,
            1.2
        );

        const tx = width / 2 - (bounds.x + bounds.width / 2) * scale;
        const ty = height / 2 - (bounds.y + bounds.height / 2) * scale;

        this.svg.transition().duration(this.duration)
            .call(this.zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
    }

    switchView(view) {
        this.currentView = view;
        this.linkGroup.selectAll('*').remove();
        this.nodeGroup.selectAll('*').remove();
        this.nodeMap.clear();

        if (view === 'radial') {
            this.renderRadial();
        } else {
            this.root = d3.hierarchy(this.app.treeData);
            this.root.descendants().forEach(d => {
                if (d.depth > 2 && d.children) {
                    d._children = d.children;
                    d.children = null;
                }
            });
            this.root.descendants().forEach(d => this.nodeMap.set(d.data.id, d));
            this.update(this.root);
            setTimeout(() => this.zoomFit(), 150);
        }
    }

    renderRadial() {
        this.root = d3.hierarchy(this.app.treeData);
        this.root.descendants().forEach(d => this.nodeMap.set(d.data.id, d));

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        const radius = Math.min(width, height) / 2 - 100;

        const tree = d3.tree()
            .size([2 * Math.PI, radius])
            .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

        tree(this.root);

        const self = this;

        // Links
        this.linkGroup.selectAll('.link')
            .data(this.root.links())
            .enter()
            .append('path')
            .attr('class', d => `link ${d.target.data._relType || 'base'}`)
            .attr('fill', 'none')
            .attr('stroke', d => this.getLinkColor(d))
            .attr('stroke-width', d => this.getLinkWidth(d))
            .attr('stroke-opacity', 0.5)
            .attr('d', d3.linkRadial()
                .angle(d => d.x)
                .radius(d => d.y));

        // Nodes
        const nodes = this.nodeGroup.selectAll('.node')
            .data(this.root.descendants())
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('data-id', d => d.data.id)
            .attr('transform', d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
            .style('cursor', d => d.data.id === '__root__' ? 'default' : 'pointer')
            .on('click', (event, d) => {
                if (d.data.id === '__root__') return;
                this.app.selectModel(d.data.id);
            })
            .on('mouseover', function(event, d) {
                if (d.data.id === '__root__') return;
                self.showTooltip(event, d);
                d3.select(this).select('.node-outer')
                    .transition().duration(200)
                    .attr('r', self.getNodeRadius(d) + 3);
            })
            .on('mouseout', function(event, d) {
                self.hideTooltip();
                d3.select(this).select('.node-outer')
                    .transition().duration(300)
                    .attr('r', self.getNodeRadius(d));
            });

        nodes.append('circle')
            .attr('class', 'node-glow')
            .attr('r', d => d.data.id === '__root__' ? 0 : this.getNodeRadius(d) + 6)
            .attr('fill', d => this.getNodeColor(d))
            .attr('opacity', 0.12)
            .attr('filter', 'url(#node-glow)');

        nodes.append('circle')
            .attr('class', 'node-outer')
            .attr('r', d => d.data.id === '__root__' ? 0 : this.getNodeRadius(d))
            .attr('fill', d => this.darken(this.getNodeColor(d), 0.5))
            .attr('stroke', d => this.getNodeColor(d))
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', d => this.getStrokeDash(d));

        nodes.append('circle')
            .attr('class', 'node-inner')
            .attr('r', d => d.data.id === '__root__' ? 0 : this.getNodeRadius(d) * 0.45)
            .attr('fill', d => this.getNodeColor(d))
            .attr('opacity', 0.9);

        nodes.append('text')
            .attr('class', 'node-label')
            .attr('dy', '0.35em')
            .attr('x', d => d.x < Math.PI === !d.children ? 16 : -16)
            .attr('text-anchor', d => d.x < Math.PI === !d.children ? 'start' : 'end')
            .attr('transform', d => d.x >= Math.PI ? 'rotate(180)' : null)
            .text(d => d.data.id === '__root__' ? '' : (d.data.data?.shortName || d.data.name))
            .style('font-size', '11px')
            .style('font-family', "'JetBrains Mono', monospace")
            .style('fill', '#c9d1d9')
            .style('paint-order', 'stroke')
            .style('stroke', '#0d1117')
            .style('stroke-width', '3px');

        const transform = d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(0.75);
        this.svg.call(this.zoom.transform, transform);
    }

    applyFilters(filters) {
        this.nodeGroup.selectAll('.node').each(function(d) {
            if (d.data.id === '__root__') return;
            const model = d.data.data;
            if (!model) return;

            let visible = true;

            if (filters.companies.length > 0) {
                visible = visible && filters.companies.includes(model.company);
            }
            if (filters.modalities.length > 0) {
                visible = visible && filters.modalities.some(m => (model.modality || '').includes(m));
            }
            if (filters.licenses.length > 0) {
                visible = visible && filters.licenses.includes(model.licenseType);
            }
            if (filters.yearMin > 2017 && model.releaseDate) {
                const year = parseInt(model.releaseDate.substring(0, 4));
                visible = visible && year >= filters.yearMin;
            }

            d3.select(this).classed('dimmed', !visible);
        });

        this.linkGroup.selectAll('.link').each(function(d) {
            const sourceVisible = !d3.select(`.node[data-id="${d.source.data.id}"]`).classed('dimmed');
            const targetVisible = !d3.select(`.node[data-id="${d.target.data.id}"]`).classed('dimmed');
            d3.select(this).classed('dimmed', !sourceVisible || !targetVisible);
        });
    }
}
