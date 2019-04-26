function initOrderTable(data) {
    let table = $('#order-table');
    let body;
    initTableView();
    analysisData();

    function initTableView() {
        initTableBody();

        function initTableBody() {
            let html = '<div class="order-table-body"></div>';
            table.append(html);
            body = $('#order-table .order-table-body');
        }
    }


    function analysisData() {
        if (data == null || data.length == 0) {
            return;
        }
        for (let i = 0; i < 3; i++) {
            addRow(data[i]);
            console.log(data[i].AppInstanceID);
        }
    }

    function addRow(rowData) {
        body.append(getRowHtml());
        initCollapseButton();

        function initCollapseButton() {
            let button = $('#order-table-row-' + rowData.AppInstanceID + ' .order-collapse-button');
            button.click(function (event) {
                button.toggleClass("collapse");
            });
        }

        function getRowHtml() {
            let html = '<div id="order-table-row-' + rowData.AppInstanceID + '" class="order-table-row">';
            html += getHeadHtml();
            html += getChildHtml();
            html += '</div>';
            return html;

            function getHeadHtml() {
                let html = '<div class="order-table-row-head">';
                html += getCollapseButtonHtml();
                html += getTitleHtml();
                html += getContentHtml();
                html += '</div>';
                return html;

                function getCollapseButtonHtml() {
                    let html = '<div class="order-collapse-button">';
                    html += '</div>';
                    return html;
                }

                function getTitleHtml() {
                    let html = '<div class="order-title">';
                    html += '<div class="order-column">';
                    html += '<div class="order-project-name">' + rowData.ProjectName + '</div>';
                    html += '<div class="order-id">' + rowData.AppInstanceID + '</div>';
                    html += '</div>';
                    html += '</div>';
                    return html;
                }

                function getContentHtml() {
                    let html = '<div class="order-content">';
                    html += '<div class="order-column">';
                    html += '<div class="order-staff-name">' + rowData.Staff + '</div>';
                    html += '</div>';
                    html += '<div class="order-column">';
                    html += '<div class="order-staff-name">' + rowData.CustomerName + '</div>';
                    html += '</div>';
                    html += '<div class="order-column">';
                    html += '<div class="order-staff-name">' + "2019/01/01" + '</div>';
                    html += '</div>';
                    html += '<div class="order-column">';
                    html += '<div class="order-staff-name">' + "2019/08/01" + '</div>';
                    html += '</div>';
                    html += '<div class="order-column">';
                    html += '<div class="order-status">' + "已結案" + '</div>';
                    html += '</div>';
                    html += '</div>';
                    return html;
                }
            }

            function getChildHtml() {
                let html = '<div class="order-table-row-child">';
                html += '<div class="order-column">';
                html += '<div class="order-staff-name">' + rowData.Staff + '</div>';
                html += '</div>';
                html += '</div>';
                return html;
            }
        }
    }
}
