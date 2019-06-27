let renameActionUrl = "@Url.Action("RenameFile", "Home")";
let downloadActionUrl = "@Url.Action("DownloadFile", "Home")";
let deleteFileActionUrl = "@Url.Action("DeleteFile", "Home")";
let deleteFolderActionUrl = "@Url.Action("DeleteFolder", "Home")";

let DialogBuilder = function (type) {

    this.type = type;

    this.setPath = function (path) {
        this.path = path;
        return this;
    }

    this.setSelectFiles = function (files) {
        this.selectFiles = files;
        return this;
    }

    this.build = function build() {
        return new Dialog(this);
    }
}

let Dialog = function (builder) {
    if (builder === null) {
        return;
    }
    let dialog = this;
    let type = builder.type;
    let path = builder.path;
    initView();

    function initView() {
        setStyle();
        setTitle();
        setContent();
        setButton();
        setInput();
        addButtonEvent();

        function setStyle() {
            $('#dialog .dialogContainer').css(getStyle(type));

            function getStyle() {
                switch (type) {
                    case "delete":
                    case "downloadFile":
                    case "rename":
                        return {
                            "width": "30%"
                        };
                }
            }
        }

        function setTitle() {
            $('#dialog .title').html(getTitle());

            function getTitle() {
                switch (this.type) {
                    case "downloadFile":
                        return "下載檔案";
                    case "delete":
                        return "確認刪除?";
                    case "rename":
                        return "重新命名";
                }
            }
        }

        function setContent() {
            $('#dialog .content').html(getContent());

            function getContent() {
                let checkAmount = selectFiles.length;
                switch (this.type) {
                    case "delete":
                        return '<span>確認要刪除 ' + checkAmount + '個檔案?</span>';
                    case "downloadFile":
                        return '<span>準備下載 ' + checkAmount + '個檔案</span>';
                    case "rename":
                        return '<input type="text" id="dialogInput" style="width: 100%;">';
                }
            }
        }

        function setButton() {
            switch (type) {
                case "delete":
                case "downloadFile":
                    break;
                case "rename":
                    $('#dialogConfirmButton').prop('disabled', true);
                    initInput();
                    break;
            }
        }

        function setInput() {
            let fileName = path.substring(currentPath.lastIndexOf('/') + 1);
            $("#dialogInput").val(fileName);
            $("#dialogInput").unbind('change paste keyup').on("change paste keyup", function () {
                if ($(this).val().length == 0) {
                    $('#dialogConfirmButton').prop('disabled', true);
                } else {
                    $('#dialogConfirmButton').prop('disabled', false);
                }
            });
        }

        function addButtonEvent() {
            $('#dialogCancelButton').unbind('click').click(function () {
                dialog.dismiss();
            });
            $('#dialogConfirmButton').unbind('click').click(function () {
                $('.dialog-loader').addClass('show');
                $('#dialogConfirmButton').prop('disabled', true);
                setAction();
            });
        }
    }

    function setAction() {
        switch (type) {
            case "delete":
                return deleteFile(function () {
                    console.log('delete');
                    $('.table-item-checkbox.head input').prop('checked', false);
                    success();
                }, fail);
            case "downloadFile":
                return downloadFile(function () {
                    console.log('downloadFile');
                    $('.table-item-checkbox.head input').prop('checked', false);
                    success();
                }, fail);
            case "rename":
                let newName = $("#dialogInput").val();
                return renameFile(path, newName, success, fail);
        }

        let renameFile = function (fullPath, newName, success, fail) {
            let data = new FormData();
            data.append('fullPath', fullPath);
            data.append('newName', newName);
            data.append('orderID', orderID);
            data.append('isCreate', false);
            data.append('inTempDirectory', false);
            $.ajax({
                url: renameActionUrl,
                processData: false,
                contentType: false,
                async: true,
                data: data,
                type: 'POST'
            }).done(function (result) {
                if (result.success) {
                    success();
                } else {
                    fail();
                }
            }).fail(function (a, b, c) {
                console.log(a, b, c);
            });
        }

        let deleteFile = function (success, fail) {
            let tasks = [];
            for (let i = 0; i < selectFiles.length; i++) {
                let type = selectFiles[i].name;
                tasks.push(deleteFolderOrFile(type === 'folder', selectFiles[i].value));
            }
            $.when.apply($, tasks).done(function () {
                success();
            });
            $.when.apply($, tasks).fail(function (a, b, c) {
                console.log(a, b, c);
                fail();
            });

            function deleteFolderOrFile(isFile, path) {
                let actionUrl;
                let data = new FormData();
                if (isFile) {
                    data.append('path', path);
                    actionUrl = deleteFileActionUrl;
                } else {
                    data.append('folderPath', path);
                    actionUrl = deleteFolderActionUrl;
                }
                data.append('isCreate', false);
                data.append('inTempDirectory', false);
                data.append('orderID', orderID);
                return $.ajax({
                    url: deleteFolderActionUrl,
                    processData: false,
                    contentType: false,
                    async: true,
                    data: data,
                    type: 'POST'
                }).done(function (result) {}).fail(function (a, b, c) {
                    console.log(a, b, c);
                });
            }
        }

        let downloadFile = function (success, fail) {
            let data = new FormData();
            data.append('orderID', orderID);
            data.append('isCreate', false);
            data.append('inTempDirectory', false);
            $.ajax({
                url: renameActionUrl,
                processData: false,
                contentType: false,
                async: true,
                data: data,
                type: 'POST'
            }).done(function (result) {
                if (result.success) {
                    success();
                } else {
                    fail();
                }
            }).fail(function (a, b, c) {
                console.log(a, b, c);
            });
        }

        let success = function () {
            $('.toolbar-directory .content').removeClass('show');
            refreshDirectory();
            dialog.dismiss();
        }

        let fail = function (message) {
            dialog.showErrorMessage(message);
        }
    }

    function show() {
        $('#dialog').addClass('show');
        this.initContent();
    }

    function dismiss() {
        $('.dialog-loader').removeClass('show');
        $('#dialog .error-message').removeClass('show');
        $('#dialog').removeClass('show');
    }

    function showErrorMessage(errorMessage) {
        $('#dialog .error-message').html(errorMessage);
        $('#dialog .error-message').addClass('show');
    }
}
