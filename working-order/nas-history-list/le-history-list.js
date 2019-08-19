let HistoryDialog = function () {
    let dialog = $('.dialog_history');
    let historyData;
    let department;
    init();

    this.setHistoryData = function (data) {
        historyData = data;
        updateList();
    }

    this.setDepartment = function (dept) {
        department = dept;
    }

    this.setNasHistory = function (data) {
        makeNasHistyoryTable(data);
    }

    this.show = function () {
        dialog.addClass('show');
    }

    function dismiss() {
        dialog.removeClass('show');
    }

    function init() {
        initCloseButton();

        function initCloseButton() {
            $('.dialog_close').click(function () {
                dismiss();
            })
        }
    }

    function updateList() {
        console.log(department);
        let count = historyData.length;
        let list = $('.history_list');
        list.html('');
        $.each(historyData, function (i, item) {
            addRow(item);
        });

        function addRow(wo) {
            let html = `<div id="${wo.AppInstanceID}" class="row_history" >
                        <div class="row_history_tag">
                            <div class="tag"></div>
                        </div>
                        <div class="row_history_wo_id hide_overflow_text">${wo.AppInstanceID}</div>
                        <div class="row_history_wo_name hide_overflow_text">${wo.ProjectName}</div>
                        <div class="row_history_wo_handler hide_overflow_text">${wo.PM}</div>
                    </div>`;
            $('.history_list').append(html);
        }
    }

    function makeNasHistyoryTable(history) {
        let list = $('.history_list');
        let body = $('.dialog_body');
        let container = $('.dialog_container');
        container.removeClass('PM');
        container.removeClass('RD');
        
        container.addClass(department);
        
        body.html('');
        $.each(history, function (i, item) {
            console.log(i);
            console.log(item);
            makeTable(i);
            makeItem(i, item);
        });

        function makeTable(id) {
            let html = `<div id="${id}" class="history_list">`;
            body.append(html);
        }

        function makeItem(id, item) {
            $.each(item, function (i, item) {
                addRow(item);
            });
            
            function addRow(wo) {
            let html = `<div id="${wo.AppInstanceID}" class="row_history" >
                        <div class="row_history_tag">
                            <div class="tag"></div>
                        </div>
                        <div class="row_history_wo_id hide_overflow_text">${wo.AppInstanceID}</div>
                        <div class="row_history_wo_name hide_overflow_text">${wo.ProjectName}</div>
                        <div class="row_history_wo_handler hide_overflow_text">${wo.PM}</div>
                    </div>`;
            $('#' + id + '.history_list').append(html);
        }
        }
    }
}