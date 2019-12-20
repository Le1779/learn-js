//let renameActionUrl = "@Url.Action("RenameFile", "Home")";
//let downloadActionUrl = "@Url.Action("DownloadFile", "Home")";
//let deleteFileActionUrl = "@Url.Action("DeleteFile", "Home")";
//let deleteFolderActionUrl = "@Url.Action("DeleteFolder", "Home")";
//let getDirectoryActionUrl = "@Url.Action("GetDirectory", "Home")";
//let completeDownloadActionUrl = "@Url.Action("DeleteDownloadFile", "Home")";

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
    let selectFiles = builder.selectFiles;

    function initView() {
        setStyle();
        setTitle();
        setContent();
        setButton();
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
                switch (type) {
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
                switch (type) {
                    case "delete":
                        return '<span>確認要刪除 ' + selectFiles.length + '個檔案?</span>';
                    case "downloadFile":
                        return '<span>準備下載 ' + selectFiles.length + '個檔案或資料夾</span><div><span style="color:red;">注意:</span><div> 一次下載500MB以上的檔案會出現錯誤。</div></div>';
                    case "rename":
                        return '<input type="text" id="dialogInput" style="width: 100%;">';
                }
            }
        }

        function setButton() {
            $('#dialogConfirmButton').prop('disabled', false);
            switch (type) {
                case "delete":
                case "downloadFile":
                    break;
                case "rename":
                    $('#dialogConfirmButton').prop('disabled', true);
                    setInput();
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
                return downloadFile(function (result) {
                    console.log('downloadFile');
                    $('.table-item-checkbox.head input').prop('checked', false);
                    console.log(result.downloadUrl);
                    startDownloadFile(result.downloadUrl); //window.location = result.downloadUrl;
                    success();
                }, fail);
            case "rename":
                let newName = $("#dialogInput").val();
                return renameFile(path, newName, success, fail);
        }

        function renameFile(fullPath, newName, success, fail) {
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
                    success(result);
                } else {
                    fail(result.message);
                }
            }).fail(function (a, b, c) {
                console.log(a, b, c);
            });
        }

        function deleteFile(success, fail) {
            let tasks = [];
            for (let i = 0; i < selectFiles.length; i++) {
                let type = selectFiles[i].name;
                tasks.push(deleteFolderOrFile(type !== 'folder', selectFiles[i].value));
            }
            $.when.apply($, tasks).done(function () {
                success();
            });
            $.when.apply($, tasks).fail(function (a, b, c) {
                console.log(a, b, c);
                fail(a);
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
                    url: actionUrl,
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

        function downloadFile(success, fail) {
            let data = new FormData();
            for (var i = 0; i < selectFiles.length; i++) {
                data.append('paths[]', selectFiles[i].value);
            }
            data.append('orderID', orderID);
            $.ajax({
                url: downloadActionUrl,
                processData: false,
                contentType: false,
                async: true,
                data: data,
                type: 'POST'
            }).done(function (result) {
                if (result.success) {
                    success(result);
                } else {
                    fail(result.message);
                }
            }).fail(function (a, b, c) {
                console.log(a, b, c);
            });
        }

        function success() {
            $('.toolbar-directory .content').removeClass('show');
            refreshDirectory();
            dialog.dismiss();
        }

        function fail(message) {
            $('#dialogConfirmButton').prop('disabled', false);
            $('.dialog-loader').removeClass('show');
            console.log(message);
            dialog.showErrorMessage(message);
        }
    }

    this.show = function () {
        $('#dialog').addClass('show');
        initView();
    }

    this.dismiss = function () {
        $('.dialog-loader').removeClass('show');
        $('#dialog .error-message').removeClass('show');
        $('#dialog').removeClass('show');
    }

    this.showErrorMessage = function (errorMessage) {
        $('#dialog .error-message').html(errorMessage);
        $('#dialog .error-message').addClass('show');
    }
}

var currentPath = '/';
let currentFolder;
let scroll = 0;
let inTempDirectory = false;

let sortColumn = 3;
let sortDir = true;
let directory;

let disabledRenameAndDeleteButton = false;

function getDirectory(path) {
    if (path != '/') {
        currentPath = path + '/';
    }

    let parentFolder = path.indexOf('/', 1) == -1 ? path.substring(1) : path.substring(1, path.indexOf('/', 1))
    console.log(parentFolder);
    disabledRenameAndDeleteButton = path == '/' || path == '' || parentFolder != department;

    //let data = new FormData();
    //data.append('path', path);
    //data.append('orderID', orderID);
    //data.append('isCreate', false);
    //data.append('inTempDirectory', false);
    //$.ajax({
    //    url: getDirectoryActionUrl,
    //    processData: false,
    //    contentType: false,
    //    async: true,
    //    data: data,
    //    type: 'POST'
    //}).done(function (result) {
    //    setDirectoryNav(path);
    //    directory = result;
    //    showDirectoryTree();
    //    $('.toolbar-directory .content').removeClass('show');
    //    $('.table-item-checkbox.head input').prop('checked', false);
    //}).fail(function (a, b, c) {
    //    console.log(a, b, c);
    //});
    
    setDirectoryNav(path);
    directory = getFakeDirectory();
    showDirectoryTree();
    $('.toolbar-directory .content').removeClass('show');
    $('.table-item-checkbox.head input').prop('checked', false);
}

function setDirectoryNav(path) {
    if (path == "/") {
        path = path.substring(path.indexOf('/') + 1);
    }
    var directory = path.split('/');
    removeAllChildView('nav-directory');
    let completeDirectory = "";
    for (let i = 0; i < directory.length; i++) {
        let html = '<span ';
        if (i != directory.length - 1) {
            if (i != 0) {
                completeDirectory += "/" + directory[i];
            }
            html += 'onclick="getDirectory(\'' + completeDirectory + '\')" '
        }
        html += 'class="nav-directory-item';
        if (i == 0) {
            currentFolder = '最新的檔案';
            html += '-first not-in-temp">' + currentFolder + '</span>';
        } else {
            currentFolder = directory[i];
            html += '"><span>' + directory[i] + '</span></span>';
        }
        $('.nav-directory').append(html);
    }
}

function showDirectoryTree() {
    showFileCount(directory.Folders.length + directory.Files.length);
    removeAllChildView('table-directory-body');
    $('.table-item-checkbox.head label').css('display', 'none');
    if (directory == null || directory.Folders.length + directory.Files.length == 0) {
        let html = '';
        html += '<td colspan="4" style="width:100%; padding: 10%;">';
        html += '空資料夾';
        html += '</td >';
        $('.table-directory-body').append(html);
        return;
    }
    $('.table-item-checkbox.head label').css('display', '');

    sort();
    addFolderRow();
    addFileRow();
    initCheckBox();

    function sort() {
        for (let i = 0; i < directory.Folders.length - 1; i++) {
            for (let j = 0; j < directory.Folders.length - i - 1; j++) {
                if (getCondition(directory.Folders[j], directory.Folders[j + 1])) {
                    let temp = directory.Folders[j];
                    directory.Folders[j] = directory.Folders[j + 1];
                    directory.Folders[j + 1] = temp;
                }
            }
        }

        for (let i = 0; i < directory.Files.length - 1; i++) {
            for (let j = 0; j < directory.Files.length - i - 1; j++) {
                if (getCondition(directory.Files[j], directory.Files[j + 1])) {
                    let temp = directory.Files[j];
                    directory.Files[j] = directory.Files[j + 1];
                    directory.Files[j + 1] = temp;
                }
            }
        }

        function getCondition(o1, o2) {
            if (sortColumn == 2) {
                if (sortDir) {
                    return o1.Name.toUpperCase() < o2.Name.toUpperCase();
                } else {
                    return o1.Name.toUpperCase() > o2.Name.toUpperCase();
                }
            } else {
                if (sortDir) {
                    return o1.LastWriteTime < o2.LastWriteTime;
                } else {
                    return o1.LastWriteTime > o2.LastWriteTime;
                }
            }
        }
    }

    function addFolderRow() {
        for (let i = 0; i < directory.Folders.length; i++) {
            let html = '';
            html += '<tr id="' + directory.Folders[i].Name + '" name="' + directory.Folders[i].Name + '" class="table-item" onclick="clickFolderItem(\'' + directory.Folders[i].Name + '\')">';
            html += '<td class="table-item-checkbox"><input id="checkbox-folder' + i + '" type="checkbox" name="folder" value="' + currentPath + directory.Folders[i].Name + '">';
            html += '<label for="checkbox-folder' + i + '"></label>';
            html += '</td>';
            html += '<td class="table-item-icon">';
            html += '<span class="fa fa-folder"></span>';
            html += '</td >';
            html += '<td class="table-item-filename">';
            html += directory.Folders[i].Name;
            html += '</td >';
            html += '<td class="table-item-last-write-time">';
            html += directory.Folders[i].LastWriteTime;
            html += '</td >';
            html += '<td class="table-item-file-size">';
            html += directory.Folders[i].FileSize;
            html += '</td >';
            html += '</tr >';
            $('.table-directory-body').append(html);
        }
    }

    function addFileRow() {
        for (let i = 0; i < directory.Files.length; i++) {
            let filePath = currentPath + directory.Files[i].Name;
            filePath.replace(" ", "&nbsp;");
            let html = '';
            html += '<tr class="table-item" onclick="clickFileItem(this)">';
            html += '<td class="table-item-checkbox"><input id="checkbox-file' + i + '"  type="checkbox" name="file" value="' + filePath + '">';
            html += '<label for="checkbox-file' + i + '"></label>';
            html += '</td>';
            html += '<td class="table-item-icon">';
            html += '<span class="fa fa-file"></span>';
            html += '</td >';
            html += '<td class="table-item-filename">';
            html += directory.Files[i].Name;
            html += '</td >';
            html += '<td class="table-item-last-write-time">';
            html += directory.Files[i].LastWriteTime;
            html += '</td >';
            html += '<td class="table-item-file-size">';
            html += directory.Files[i].FileSize;
            html += '</td >';
            html += '</tr >';
            $('.table-directory-body').append(html);
        }
    }

    function initCheckBox() {
        $('.table-item-checkbox label').click(function (event) {
            event.stopPropagation();
        });
        $('.table-item-checkbox input').click(function (event) {
            if ($(this).parent().hasClass('head')) {
                if ($(this).prop('checked')) {
                    $('.table-item-checkbox input').prop('checked', true);
                } else {
                    $('.table-item-checkbox input').prop('checked', false);
                }
            } else {
                $('.table-item-checkbox.head input').prop('checked', false);
            }

            if ($('.table-item-checkbox input').is(':checked')) {
                let checked = $('.table-item-checkbox input:checked:not(.table-item-checkbox.head input)');

                $('#rename-file').attr('disabled', disabledRenameAndDeleteButton || checked.length > 1);
                $('.toolbar-directory .content').addClass('show');
            } else {
                $('.toolbar-directory .content').removeClass('show');
            }
            event.stopPropagation();
        });

        $('#delete-file').attr('disabled', disabledRenameAndDeleteButton);
    }

    function showFileCount(count) {
        $('.file-count').html(count + "筆項目");
    }
}

function clickFolderItem(path) {
    if ($('.table-item-checkbox input').is(':checked')) {
        let checkbox = $('#' + path).find('input[type="checkbox"]');
        checkbox.click();
    } else {
        getDirectory(currentPath + path);
    }
}

function clickFileItem(element) {
    let checkbox = $(element).find('input[type="checkbox"]');
    checkbox.click();
}

function removeAllChildView(childID) {
    var childView = document.getElementById(childID);
    while (childView.firstChild) {
        childView.removeChild(childView.firstChild);
    }
}

function refreshDirectory() {
    currentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
    getDirectory(currentPath);
}

function initToolBar() {
    initDeleteButton();
    initRenameButton();
    initDownloadButton();

    function initDeleteButton() {
        $('#delete-file').click(function () {
            let selectFiles = $('.table-item-checkbox input:checked:not(.table-item-checkbox.head input)');
            new DialogBuilder("delete").setSelectFiles(selectFiles).build().show();
        });
    }

    function initRenameButton() {
        $('#rename-file').click(function () {
            let selectFiles = $('.table-item-checkbox input:checked:not(.table-item-checkbox.head input)');
            new DialogBuilder("rename").setPath(selectFiles[0].value).build().show();
        });
    }

    function initDownloadButton() {
        $('#download-file').click(function () {
            let selectFiles = $('.table-item-checkbox input:checked:not(.table-item-checkbox.head input)');
            let dialog = new DialogBuilder("downloadFile").setSelectFiles(selectFiles).build();
            console.log(dialog);
            dialog.show();
        });
    }
}

function initCopyFTPUrlButton() {
    $('#ftp').attr('title', ftpUrl);
    $('#ftp').click(function (event) {
        copyToClipboard(ftpUrl);
        showHint();
    });
    $('#ftp').hover(function (event) {
        $('#icon_help').toggleClass('parent_hover');
    });
    $('#help').click(function (event) {
        event.stopPropagation();
    });
    $('#help').hover(function (event) {
        $('#icon_help').toggleClass('parent_hover');
    });

    function showHint() {
        $('#ftp').animate({
            'opacity': 0
        }, 300, function () {
            $('#ftp').attr("name", "已複製");
        }).animate({
            'opacity': 1
        }, 300);

        let second = 1;
        let timer = setInterval(function () {
            second -= 1;
            if (second == 0) {
                $('#ftp').animate({
                    'opacity': 0
                }, 300, function () {
                    $('#ftp').attr("name", "複製FTP網址");
                }).animate({
                    'opacity': 1
                }, 300);
                clearInterval(timer);
            }
        }, 1000);
    }

    function copyToClipboard(str) {
        var clip_area = document.createElement('textarea');
        clip_area.textContent = str;

        document.body.appendChild(clip_area);
        clip_area.select();

        document.execCommand('copy');
        clip_area.remove();
    }
}

function setDragAndDropEvent() {
    let element = document.getElementsByTagName("BODY")[0];
    element.addEventListener('dragover', function (event) {
        dragHover(event, element);
    });
    element.addEventListener('dragleave', function (event) {
        dragHover(event, element);
    });
    element.addEventListener('drop', function (event) {
        dropDirectory(event, "");
    });

    function dragHover(e, element) {
        e.stopPropagation();
        e.preventDefault();
        if (e.type === 'dragover') {
            makeLayerMask(element);
            let folderName = element.getAttribute("name");
            if (folderName == null) {
                folderName = currentFolder;
                makeLayerMask(element, false);
            } else {
                makeLayerMask(element, true);
            }
            showHint(true);
        } else {
            $('#layer-mask').css({
                "opacity": 0
            });
            showHint(false);
        }

        function makeLayerMask(view, isFolder) {
            if (isFolder) {
                let rect = view.getBoundingClientRect();
                $('#layer-mask').css({
                    "position": "absolute",
                    "top": rect.top + scroll,
                    "left": rect.left,
                    "height": view.offsetHeight + "px",
                    "width": view.offsetWidth + "px",
                    "opacity": 1
                });
            } else {
                $('#layer-mask').css({
                    "position": "fixed",
                    "top": 0,
                    "left": 0,
                    "height": view.offsetHeight + "px",
                    "width": view.offsetWidth + "px",
                    "opacity": 1
                });
            }
        }
    }

    function dropDirectory(e) {
        e.stopPropagation();
        e.preventDefault();

        showHint(false);
        $('#layer-mask').css({
            "opacity": 0
        });
    }

    function showHint(show) {
        removeAllChildView("snackbar");
        let snackbar = document.getElementById("snackbar");
        if (show) {
            let html = '<div>你無法於此目錄新增檔案</div>';
            snackbar.className = "show";
            $('#snackbar').append(html);
        } else {
            snackbar.className = snackbar.className.replace("show", "");
        }
    }
}

function startDownloadFile(downloadUrl) {
    let filename = downloadUrl.substring(downloadUrl.lastIndexOf('/') + 1);
    let req = new XMLHttpRequest();
    req.open("GET", downloadUrl + '?_=' + new Date().getTime(), true);
    setProgressListener();
    setReadyStateListener();
    req.send();
    downloadFileProgress.show(filename)

    function setProgressListener() {
        req.addEventListener("progress", function (evt) {
            if (evt.lengthComputable) {
                let percentComplete = evt.loaded / evt.total;
                downloadFileProgress.setProgress(percentComplete * 100);
                console.log(percentComplete + "% file size: " + evt.total);
                if (percentComplete === 1) {
                    downloadTaskComplete();
                }
            }
        }, false);
    }

    function setReadyStateListener() {
        req.responseType = "blob";
        req.onreadystatechange = function () {
            if (req.readyState === 4 && req.status === 200) {
                if (typeof window.chrome !== 'undefined') {
                    // Chrome version
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(req.response);
                    link.download = filename;
                    link.click();
                } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
                    // IE version
                    var blob = new Blob([req.response], {
                        type: 'application/force-download'
                    });
                    window.navigator.msSaveBlob(blob, filename);
                } else {
                    // Firefox version
                    var file = new File([req.response], filename, {
                        type: 'application/force-download'
                    });
                    window.open(URL.createObjectURL(file));
                }
            }
        };
    }

    function downloadTaskComplete() {
        let data = new FormData();
        data.append('orderID', orderID);
        $.ajax({
            url: completeDownloadActionUrl,
            processData: false,
            contentType: false,
            async: true,
            data: data,
            type: 'POST'
        }).done(function (result) {
            if (!result.success) {
                console.log("delete download file fail");
            }
        }).fail(function (a, b, c) {
            console.log(a, b, c);
        });
    }
}

let DownloadFileProgress = function () {

    this.show = function (fileName) {
        $('.download-file-name').html(fileName);
        $('.download-progress-view').show();
    }

    this.hide = function () {
        $('.download-progress-view').hide();
    }

    this.setProgress = function (progress) {
        $('.current').css({
            width: progress + '%'
        });
        $('.download-progress-percent').html(Math.round(progress * 10) / 10 + '%');
    }
}

var orderID = '@ViewBag.WorkingOrderID';
var ftpUrl = "@ViewBag.FTPUrl";
var department = "@ViewBag.DepartmentName";
var downloadFileProgress = new DownloadFileProgress();
document.addEventListener('DOMContentLoaded', function (event) {
    console.log(orderID);
    if (orderID == null || orderID == "") {
        return;
    }

    downloadFileProgress.hide();
    setDragAndDropEvent();
    initToolBar();
    initCopyFTPUrlButton();
    getDirectory('/');
});

function setSortColumn(column) {
    if (column == sortColumn) {
        sortDir = !sortDir;
    } else {
        sortColumn = column;
        sortDir = true;
    }
    console.log("column: " + sortColumn + "dir: " + sortDir);
    showDirectoryTree();

    if (column == 2) {
        $('.sort-button-filename').html(sortDir ? "↓" : "↑");
        $('.sort-button-last-write-time').html("");
    } else {
        $('.sort-button-filename').html("");
        $('.sort-button-last-write-time').html(sortDir ? "↓" : "↑");
    }
}