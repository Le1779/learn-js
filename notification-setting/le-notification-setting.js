var startDate;
var endDate;
var notifications = [{
    "ID": 2,
    "Title": "Test Notify2",
    "Message": "Test Message",
    "StartDate": "\/Date(1560930639000)\/",
    "EndDate": "\/Date(1561103439000)\/"
    }, {
    "ID": 3,
    "Title": "Test Notify",
    "Message": "Test Message",
    "StartDate": "\/Date(1561189839000)\/",
    "EndDate": "\/Date(1561881039000)\/"
    }];

$(document).ready(function () {
    initView();
});

function initView() {
    $('#notification_title').val('');
    $('#notification_message').val('');
    $('#notification_date').val('');
    startDate = null;
    endDate = null;
    initList();
    initDatePicker();
}

function initDatePicker() {
    $('.dateRangePicker').daterangepicker({
        "minDate": new Date(),
        isInvalidDate: function (date) {
            let flag = false;
            $.each(notifications, function (index) {
                flag = flag | moment(date).isBetween(moment(notifications[index].StartDate).subtract(1, 'second'), moment(notifications[index].EndDate).add(0, 'days'));
            });
            return flag;
        },
        locale: {
            format: "YYYY/MM/DD",
            applyLabel: '確認',
            cancelLabel: '取消',
            fromLabel: '從',
            toLabel: '到',
            weekLabel: 'W',
            customRangeLabel: 'Custom Range',
            daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
            monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        }
    }, function (start, end, label) {
        startDate = start.format("YYYY-MM-DD HH:mm:ss").toString();
        endDate = end.format("YYYY-MM-DD HH:mm:ss").toString();
    });
}

function initList() {
    let container = $('.notification_list_content');
    notifications.forEach(function (item, index) {
        addItem(item);
        addEvent(item);
    });

    function addItem(item) {
        let html = '<div class="notification_list_item" id="notification_' + item.ID + '">';
        html += '<div class="notification_remove"></div>';
        html += '<div class="notification_title">' + item.Title + '</div>';
        html += '<div class="notification_time">' + getDateText(item) + '</div>';
        html += '<div class="notification_message">' + item.Message + '</div>';
        html += '</div>';
        container.append(html);
    }

    function getDateText(item) {
        let start = moment(item.StartDate);
        let end = moment(item.EndDate);
        let startText = '';
        let endText = '';

        startText += start.year();
        if (start.year() != end.year()) {
            endText += end.year();
        }
        startText += '/';

        startText += start.format('MM');
        if (start.format('MM') != end.format('MM')) {
            endText += end.format('MM');
        }
        startText += '/';

        startText += start.format('DD');
        if (start.format('DD') != end.format('DD')) {
            endText += end.format('DD');
        }

        return startText + ' - ' + endText;
    }

    function addEvent(item) {
        $('#notification_' + item.ID + ' .notification_remove').click(function (event) {
            removeNotification(item.ID);
        });
    }
}

function createNotification() {
    console.log("create");
    if (!checkInput()) {
        return;
    }

    $('.notification_setting_button .loader').addClass('show');

    let form = new FormData();
    form.append('title', $('#notification_title').val());
    form.append('message', $('#notification_message').val());
    form.append('startDate', moment(startDate).format('YYYY/MM/DD'));
    form.append('endDate', moment(endDate).format('YYYY/MM/DD'));
    $.ajax({
        url: "/Home/s",
        type: "POST",
        data: form,
        async: true,
        processData: false,
        contentType: false,
    }).done(function (result) {
        if (result.success) {
            createSuccess();
        } else {
            createFail(result);
        }
    }).fail(function (a, b, c) {
        console.log(a, b, c);
        createFail(a);
    });

    function checkInput() {
        let title = $('#notification_title');
        let message = $('#notification_message');
        let date = $('#notification_date');

        return check(title) && check(message) && checkDatePicker(date);


        function check(element) {
            if (isNullAndEmpty(element.val())) {
                element.addClass('error');
                element.focus();
                return false;
            } else {
                element.removeClass('error');
                return true;
            }
        }

        function checkDatePicker(element) {
            if (startDate == null || endDate == null) {
                element.addClass('error');
                element.focus();
                return false;
            }
            element.removeClass('error');
            return true;
        }

        function isNullAndEmpty(val) {
            return flag = val == null || val == "";
        }
    }

    function createSuccess() {
        $('.notification_setting_button .loader').removeClass('show');
        initView();
    }

    function createFail(message) {
        $('.notification_setting_button .loader').removeClass('show');
        $('.notification_setting_error_message').html(message);
    };
}

function removeNotification(id) {
    console.log("remove " + id);
    initDialog();

    function initDialog() {
        let dialog = $('.notification_reomve_dialog');
        dialog.addClass('show');

        let button_cancel = $('.dialog_button_cancel');
        button_cancel.click(function (event) {
            dialog.removeClass('show');
        });

        let button_remove = $('.dialog_button_remove');
        button_remove.click(function (event) {
            removeAction(id);
        });
    }

    function removeAction(id) {
        $('.dialog_button_remove .loader').addClass('show');
        let form = new FormData();
        form.append('id', id);
        $.ajax({
            url: "/Home/d",
            type: "POST",
            data: form,
            async: true,
            processData: false,
            contentType: false,
        }).done(function (result) {
            if (result.success) {
                removeSuccess();
            } else {
                removeFail(result);
            }
        }).fail(function (a, b, c) {
            console.log(a, b, c);
            removeFail(a);
        });

        function removeSuccess() {
            $('.dialog_button_remove .loader').removeClass('show');
            initView();
        }

        function removeFail(message) {
            $('.dialog_button_remove .loader').removeClass('show');
            $('.dialog_error_message').html(message);
        };
    }
}
