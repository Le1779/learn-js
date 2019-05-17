var UploadFileView = function (callback) {
    let uploadFileView = $('.upload-file-view');
    let inputContainer = uploadFileView.find('.upload-file-view-input');
    let inputContainerText = inputContainer.find('span');
    let input = inputContainer.find('input');
    let button = uploadFileView.find('.upload-file-view-button');
    let example = uploadFileView.find('.example');
    let errorMessage = uploadFileView.find('.upload-file-view-error');
    let isLoading = false;

    setText();
    setButtonClickEvent();
    setFileInputChangeEvent();

    this.endLoad = function (result, successCallback) {
        console.log(result);
        isLoading = false;
        button.removeClass('load');
        if (result.success) {  
            button.addClass('success');
            setTimeout(function () {                               
                collapse();
                cleanFileInput();
            }, 2000);
            if (typeof successCallback === 'function') {
                successCallback();
            }
        } else {
            button.addClass('fail');
            setTimeout(function () {
                button.removeClass('fail');
            }, 2000);
            showErrorMessage(result.responseText);
            expand();
        }
    }

    function setText() {
        button.html('批量新增');
        inputContainerText.html('選擇檔案');
    }

    function setButtonClickEvent() {
        button.click(function (event) {
            let inputFile = $('.input-file');
            if (button.hasClass('expand')) {
                if (typeof callback === 'function' && !isLoading) {
                    load();
                }
            } else {
                expand();
            }
        });

        function load() {
            let files = input.get(0).files;
            if (files.length != 0) {
                isLoading = true;
                button.toggleClass('load');
                callback(files);
            }else{
                collapse();
            }
        }
    }

    function setFileInputChangeEvent() {
        input.change(function (event) {
            let files = event.target.files;
            if (files.length == 0) {
                cleanFileInput();
            } else {
                let fileName = event.target.files[0].name;
                inputContainerText.html(fileName);
            }

        });
    }

    function cleanFileInput() {
        input.val('');
        inputContainerText.html('選擇檔案');
    }

    function expand() {
        button.addClass('expand');
        inputContainer.addClass('expand');
        example.addClass('expand');
    }

    function collapse() {        
        button.removeClass('success');
        button.removeClass('fail');
        button.removeClass('expand');
        inputContainer.removeClass('expand');
        example.removeClass('expand');
        dismissErrorMessage(); 
    }

    function showErrorMessage(message) {
        errorMessage.html(message);
        errorMessage.addClass('show');
    }

    function dismissErrorMessage() {
        errorMessage.html("");
        errorMessage.removeClass('show');
    }
}
