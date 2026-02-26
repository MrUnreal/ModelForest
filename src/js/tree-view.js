// tree-view.js — D3.js collapsible tree visualization

export class TreeView {
    constructor(app) {
        this.app = app;
        this.svg = d3.select('#tree-svg');
        this.container = document.getElementById('viz-container');
        this.tooltip = document.getElementById('tooltip');
        this.root = null;
        this.treeLayout = null;
        this.g = null;
        this.zoom = null;
        this.nodeMap = new Map();
        this.currentView = 'tree';

        this.nodeRadius = 8;
        this.duration = 500;

        this.setupSVG();
    }

    setupSVG() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.svg.attr('viewBox', null);

        // Zoom behavior
        this.zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
            });

        this.svg.call(this.zoom);

        // Main group
        this.g = this.svg.append('g')
            .attr('class', 'tree-group');

        // Arrow marker for links
        this.svg.append('defs').append('marker')
            .attr('id', 'arrow')
            .attr('viewBox', '0 -5 10 10')
            .attr('refX', 20)
            .attr('refY', 0)
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .attr('orient', 'auto')
            .append('path')
            .attr('d', 'M0,-5L10,0L0,5')
            .attr('fill', '#6e7681');
    }

    render(treeData) {
        this.root = d3.hierarchy(treeData);

        // Collapse children beyond depth 2 initially
        this.root.descendants().forEach(d => {
            if (d.depth > 1 && d.children) {
                d._children = d.children;
                d.children = null;
            }
        });

        // Build node map for lookup
        this.root.descendants().forEach(d => {
            this.nodeMap.set(d.data.id, d);
        });

        this.update(this.root);

        // Initial zoom to fit
        setTimeout(() => this.zoomFit(), 100);
    }

    update(source) {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        // Count visible nodes to calculate spacing
        const nodes = this.root.descendants();
        const leaves = this.root.leaves();
        const treeHeight = Math.max(400, leaves.length * 28);
        const treeWidth = Math.max(600, (this.root.height + 1) * 220);

        // Tree layout
        this.treeLayout = d3.tree().size([treeHeight, treeWidth]);
        this.treeLayout(this.root);

        const allNodes = this.root.descendants();
        const allLinks = this.root.links();

        // ===== LINKS =====
        const linkSelection = this.g.selectAll('.link')
            .data(allLinks, d => d.target.data.id);

        const linkEnter = linkSelection.enter()
            .insert('path', 'g')
            .attr('class', d => `link ${d.target.data._relType || 'base'}`)
            .attr('d', () => {
                const o = { x: source.x0 || source.x, y: source.y0 || source.y };
                return this.diagonal({ x: o.x, y: o.y }, { x: o.x, y: o.y });
            });

        const linkUpdate = linkEnter.merge(linkSelection);
        linkUpdate.transition().duration(this.duration)
            .attr('d', d => this.diagonal(d.source, d.target))
            .attr('class', d => `link ${d.target.data._relType || 'base'}`);

        linkSelection.exit().transition().duration(this.duration)
            .attr('d', () => {
                const o = { x: source.x, y: source.y };
                return this.diagonal({ x: o.x, y: o.y }, { x: o.x, y: o.y });
            })
            .remove();

        // ===== NODES =====
        const nodeSelection = this.g.selectAll('.node')
            .data(allNodes, d => d.data.id);

        const nodeEnter = nodeSelection.enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', () => `translate(${source.y0 || source.y},${source.x0 || source.x})`)
            .on('click', (event, d) => {
                if (d.data.id === '__root__') return;
                event.stopPropagation();
                if (event.detail === 2) {
                    // Double click: toggle children
                    this.toggleNode(d);
                } else {
                    // Single click: select
                    this.app.selectModel(d.data.id);
                }
            })
            .on('mouseover', (event, d) => {
                if (d.data.id === '__root__') return;
                this.showTooltip(event, d);
            })
            .on('mouseout', () => this.hideTooltip());

        // Node circle
        nodeEnter.append('circle')
            .attr('r', 0)
            .attr('fill', d => this.getNodeColor(d))
            .attr('stroke', d => this.getNodeStroke(d))
            .attr('stroke-width', d => d.data.id === '__root__' ? 0 : 2)
            .attr('stroke-dasharray', d => this.getStrokeDash(d));

        // Node label
        nodeEnter.append('text')
            .attr('dy', '0.31em')
            .attr('x', d => (d.children || d._children) ? -14 : 14)
            .attr('text-anchor', d => (d.children || d._children) ? 'end' : 'start')
            .text(d => d.data.id === '__root__' ? '' : d.data.name)
            .style('font-size', d => d.depth === 0 ? '0px' : '11px');

        // Expand/collapse indicator
        nodeEnter.append('text')
            .attr('class', 'node-badge')
            .attr('dy', '0.31em')
            .attr('x', 0)
            .attr('text-anchor', 'middle')
            .style('font-size', '8px')
            .style('fill', '#fff')
            .style('pointer-events', 'none')
            .text(d => {
                if (d.data.id === '__root__') return '';
                return d._children ? `+${d._children.length}` : '';
            });

        // Update
        const nodeUpdate = nodeEnter.merge(nodeSelection);
        nodeUpdate.transition().duration(this.duration)
            .attr('transform', d => `translate(${d.y},${d.x})`);

        nodeUpdate.select('circle')
            .attr('r', d => d.data.id === '__root__' ? 0 : this.getNodeRadius(d))
            .attr('fill', d => this.getNodeColor(d))
            .attr('stroke', d => this.getNodeStroke(d))
            .attr('stroke-dasharray', d => this.getStrokeDash(d));

        nodeUpdate.select('text:not(.node-badge)')
            .attr('x', d => (d.children || d._children) ? -14 : 14)
            .attr('text-anchor', d => (d.children || d._children) ? 'end' : 'start');

        nodeUpdate.select('.node-badge')
            .text(d => {
                if (d.data.id === '__root__') return '';
                return d._children ? `+${d._children.length}` : '';
            });

        // Exit
        const nodeExit = nodeSelection.exit().transition().duration(this.duration)
            .attr('transform', () => `translate(${source.y},${source.x})`)
            .remove();
        nodeExit.select('circle').attr('r', 0);
        nodeExit.select('text').style('fill-opacity', 0);

        // Store positions for transitions
        allNodes.forEach(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    diagonal(s, d) {
        return `M ${s.y} ${s.x}
                C ${(s.y + d.y) / 2} ${s.x},
                  ${(s.y + d.y) / 2} ${d.x},
                  ${d.y} ${d.x}`;
    }

    getNodeColor(d) {
        if (d.data.id === '__root__') return 'transparent';
        const company = d.data.data?.company || '';
        return this.app.getCompanyColor(company);
    }

    getNodeStroke(d) {
        if (d.data.id === '__root__') return 'none';
        const lt = d.data.data?.licenseType;
        if (lt === 'open-source') return this.getNodeColor(d);
        if (lt === 'open-weight') return this.getNodeColor(d);
        return this.getNodeColor(d);
    }

    getStrokeDash(d) {
        const lt = d.data.data?.licenseType;
        if (lt === 'closed-source') return '3 2';
        if (lt === 'open-weight') return '5 3';
        return 'none';
    }

    getNodeRadius(d) {
        const params = d.data.data?.parametersRaw;
        if (!params) return this.nodeRadius;
        const logSize = Math.log10(params);
        return Math.max(5, Math.min(16, logSize * 1.2));
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
        // Remove previous highlights
        this.g.selectAll('.node').classed('selected', false).classed('dimmed', false);
        this.g.selectAll('.link').classed('dimmed', false);

        if (!modelId) return;

        // Get the ancestors and descendants of selected node
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

        // Dim unrelated
        this.g.selectAll('.node')
            .classed('dimmed', d => !relatedIds.has(d.data.id))
            .classed('selected', d => d.data.id === modelId);

        this.g.selectAll('.link')
            .classed('dimmed', d => !relatedIds.has(d.source.data.id) || !relatedIds.has(d.target.data.id));
    }

    centerOnModel(modelId) {
        // First ensure the node is visible (expand parents)
        const node = this.nodeMap.get(modelId);
        if (!node) return;

        // Expand ancestors
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

        // Center after update
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

        this.tooltip.innerHTML = `
            <div class="tooltip-name">${model.shortName || model.name}</div>
            <div class="tooltip-company" style="color: ${this.app.getCompanyColor(model.company)}">${model.company}</div>
            <div class="tooltip-meta">${model.parameters || ''} · ${model.releaseDate || ''}</div>
        `;

        const rect = this.container.getBoundingClientRect();
        const x = event.clientX - rect.left + 12;
        const y = event.clientY - rect.top - 10;

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
        const padding = 60;

        const scale = Math.min(
            (width - padding * 2) / bounds.width,
            (height - padding * 2) / bounds.height,
            1.5
        );

        const tx = width / 2 - (bounds.x + bounds.width / 2) * scale;
        const ty = height / 2 - (bounds.y + bounds.height / 2) * scale;

        this.svg.transition().duration(this.duration)
            .call(this.zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(scale));
    }

    switchView(view) {
        this.currentView = view;
        // For MVP, we just re-render the same tree; radial can be added later
        this.g.selectAll('*').remove();
        this.nodeMap.clear();

        if (view === 'radial') {
            this.renderRadial();
        } else {
            this.root = d3.hierarchy(this.app.treeData);
            this.root.descendants().forEach(d => {
                if (d.depth > 1 && d.children) {
                    d._children = d.children;
                    d.children = null;
                }
            });
            this.root.descendants().forEach(d => this.nodeMap.set(d.data.id, d));
            this.update(this.root);
            setTimeout(() => this.zoomFit(), 100);
        }
    }

    renderRadial() {
        this.root = d3.hierarchy(this.app.treeData);
        this.root.descendants().forEach(d => this.nodeMap.set(d.data.id, d));

        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        const radius = Math.min(width, height) / 2 - 80;

        const tree = d3.tree()
            .size([2 * Math.PI, radius])
            .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

        tree(this.root);

        // Links
        this.g.selectAll('.link')
            .data(this.root.links())
            .enter()
            .append('path')
            .attr('class', d => `link ${d.target.data._relType || 'base'}`)
            .attr('d', d3.linkRadial()
                .angle(d => d.x)
                .radius(d => d.y));

        // Nodes
        const nodes = this.g.selectAll('.node')
            .data(this.root.descendants())
            .enter()
            .append('g')
            .attr('class', 'node')
            .attr('transform', d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
            .on('click', (event, d) => {
                if (d.data.id === '__root__') return;
                this.app.selectModel(d.data.id);
            })
            .on('mouseover', (event, d) => {
                if (d.data.id === '__root__') return;
                this.showTooltip(event, d);
            })
            .on('mouseout', () => this.hideTooltip());

        nodes.append('circle')
            .attr('r', d => d.data.id === '__root__' ? 0 : this.getNodeRadius(d))
            .attr('fill', d => this.getNodeColor(d))
            .attr('stroke', d => this.getNodeStroke(d))
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', d => this.getStrokeDash(d));

        nodes.append('text')
            .attr('dy', '0.31em')
            .attr('x', d => d.x < Math.PI === !d.children ? 10 : -10)
            .attr('text-anchor', d => d.x < Math.PI === !d.children ? 'start' : 'end')
            .attr('transform', d => d.x >= Math.PI ? 'rotate(180)' : null)
            .text(d => d.data.id === '__root__' ? '' : d.data.name)
            .style('font-size', '10px');

        // Center the radial tree
        const transform = d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(0.8);
        this.svg.call(this.zoom.transform, transform);
    }

    applyFilters(filters) {
        this.g.selectAll('.node').each(function(d) {
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

        this.g.selectAll('.link').each(function(d) {
            const sourceVisible = !d3.select(`.node[data-id="${d.source.data.id}"]`).classed('dimmed');
            const targetVisible = !d3.select(`.node[data-id="${d.target.data.id}"]`).classed('dimmed');
            d3.select(this).classed('dimmed', !sourceVisible || !targetVisible);
        });
    }
}
