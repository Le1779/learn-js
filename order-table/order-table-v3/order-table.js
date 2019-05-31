var OrderTable = function (builder) {
    let container = builder.container;
    let labels = builder.labels;
    let columnWidth = builder.columnWidth;
    let body;

    if (labels == null || labels.length == 0) {
        return;
    }

    initTable();

    function initTable() {
        makeHeader();
        makeBody();

        function makeHeader() {
            makeContainer();
            putLabel();

            function makeContainer() {
                let html = '<div class="order-table-header"></div>';
                container.append(html);
            }

            function putLabel() {
                let header = $('.order-table-header');
                for (let i = 0; i < labels.length; i++) {
                    header.append(getLabelHtml(labels[i]));
                }

                function getLabelHtml(label) {
                    let html = '<div class="order-table-label">';
                    html += label;
                    html += '</div>';
                    return html;
                }
            }
        }

        function makeBody() {
            makeContainer();

            function makeContainer() {
                let html = '<div class="order-table-body"></div>';
                container.append(html);
                body = $('.order-table-body');
            }
        }
    }

    this.addRow = function (data) {
        let html = '<div class="order-table-row">';
        html += '<div class="order-table-collapse-button"></div>'
        for(let i = 0; i < data.length; i++){
            html += getColumn(data[i]);
        }
        html += '</div>';
        body.append(html);

        function getColumn(text) {
            let html = '<div class="order-table-column">';
            html += text;
            html += '</div>';
            return html;
        }
    }
}

var OrderTableBuilder = function (container) {

    this.container = container;

    this.setLabels = function (labels) {
        this.labels = labels;
        return this;
    }

    this.setColumnWidth = function (columnWidth) {
        this.columnWidth = columnWidth;
        return this;
    }

    this.build = function () {
        return new OrderTable(this);
    }
}
