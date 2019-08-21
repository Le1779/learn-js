let HistoryDialog = function () {
    let dialog = $('.dialog_history');
    let historyData;
    init();

    this.setHistoryData = function (data) {
        historyData = data;
        updateList();
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
        let count = historyData.length;
        let list = $('.history_list');
        list.html('');
        $.each(historyData, function (i, item) {
            console.log(item);
            addRow(item);
        });

        function addRow(wo) {
            let type = getType(wo.WorkingOrderType);
            let fromID = wo.WorkingOrderType.substring(wo.WorkingOrderType.indexOf("-") + 1);
            let html = `<div id="${wo.AppInstanceID}" class="row_history" >
                        <div class="row_history_tag">
                            <div class="tag"></div>
                        </div>
                        <a href="~/Home/RunningListMessageBoard?appInstanceID=${fromID}" target="_blank" class="row_history_wo_link"></a>
                        <div class="row_history_wo_type hide_overflow_text"><div>${type} ${fromID}</div></div>
                        <div class="row_history_wo_id hide_overflow_text">${wo.AppInstanceID}</div>
                        <div class="row_history_wo_name hide_overflow_text">${wo.ProjectName}</div>
                        <div class="row_history_wo_date hide_overflow_text">${stringToDate(wo.AppliedDate)}</div>
                    </div>`;
            $('.history_list').append(html);

            function getType(woType) {
                let keyword = woType.substring(0, 3);
                switch (keyword) {
                    case "New":
                        return "新建自";
                    case "Co-":
                        return "延續自";
                    case "Br-":
                        return "分支自";
                }
            }
        }
    }



    function stringToDate(str) {
        let milli = parseInt(stringToMilli(str));
        let date = new Date(milli);
        return formatDate(date);

        function stringToMilli(str) {
            let leftParentheses = str.indexOf('(');
            let rightParentheses = str.lastIndexOf(')');
            return str.substring(leftParentheses + 1, rightParentheses);
        }

        function formatDate(date) {
            let d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;

            let t = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
            return [year, month, day].join('/') + ' ' + t;
        }
    }


}