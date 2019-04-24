function initSearchDialog() {


    let clickButton;
    let searchDialog;

    initClickButton();
    initDialog();

    function initClickButton() {
        clickButton = $('#dialog-search-expand-button');
        clickButton.click(function (event) {
            event.stopPropagation();
            if (searchDialog.hasClass("show")) {
                dismiss();
            } else {
                let windowWidth = $(window).width();
                let clickButtonPosition = clickButton.position();
                let y = clickButtonPosition.top;
                let x = clickButtonPosition.left;
                let width = clickButton.width();
                if (x >= windowWidth / 2) {
                    searchDialog.css({
                        top: y + width * 0.9,
                        left: x - windowWidth * 0.4 + width * 0.9
                    });
                } else {
                    searchDialog.css({
                        top: y + width * 0.9,
                        left: x + width * 0.1
                    });
                }

                searchDialog.addClass("show");
            }
        });
    }

    function initDialog() {
        searchDialog = $('#dialog-search');

        $('html').click(function (event) {
            dismiss();
        });

        searchDialog.click(function (event) {
            event.stopPropagation();
        });

        initSearchButton();
        initResetButton();

        function initSearchButton() {
            let searchButton = $('#dialog-search .bottom-bar .button-search');

            searchButton.mousedown(function (event) {
                searchButton.addClass("click");
            });

            searchButton.mouseup(function (event) {
                searchButton.removeClass("click");
            });
        }


        function initResetButton() {
            let resetButton = $('#dialog-search .bottom-bar .button-reset');

            resetButton.mousedown(function (event) {
                resetButton.addClass("click");
            });

            resetButton.mouseup(function (event) {
                resetButton.removeClass("click");
                cleanAllInput();
            });
        }
    }

    function cleanAllInput() {
        let inputs = $('#dialog-search input');
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].value = "";
        }
        
        let selects = $('#dialog-search select');
        for (var i = 0; i < selects.length; i++) {
            selects[i].value = "";
        }
    }

    function dismiss() {
        searchDialog.removeClass("show");        
        cleanAllInput();
    }
}
