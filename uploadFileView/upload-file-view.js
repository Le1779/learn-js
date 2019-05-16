var UploadFileView = function (callback) {
    let uploadFileView = $('.upload-file-view');
    let inputContainer = uploadFileView.find('.upload-file-view-input');
    let inputContainerText = inputContainer.find('span');
    let input = inputContainer.find('input');
    let button = uploadFileView.find('.upload-file-view-button');

    setText();
    setButtonClickEvent();
    setFileInputChangeEvent();

    this.endLoad = function () {
        button.removeClass('load');
    }

    function setText() {
        button.html('批量新增');
        inputContainerText.html('選擇檔案');
    }

    function setButtonClickEvent() {
        button.click(function (event) {
            let inputFile = $('.input-file');
            if (button.hasClass('expand')) {
                button.removeClass('expand');
                inputContainer.removeClass('expand');
                if (typeof callback === 'function') {
                    load();
                }
            } else {
                button.addClass('expand');
                inputContainer.addClass('expand');
            }
        });

        function load() {
            let files = input.get(0).files;
            if (files.length != 0) {
                button.toggleClass('load');
                callback();
            }
        }
    }

    function setFileInputChangeEvent() {
        input.change(function (event) {
            let files = event.target.files;
            if (files.length == 0) {
                inputContainerText.html("選擇檔案");
            } else {
                let fileName = event.target.files[0].name;
                inputContainerText.html(fileName);
            }

        });
    }
}
