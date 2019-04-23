function initMultiSearch(options) {
    if (options == null || options.length == 0) {
        return;
    }
    console.log("initMultiSearch");
    
    let conditionList = [];

    let container = $("#multi-search-container");

    let select;
    initSelect();

    function initSelect() {
        console.log("initSelect");

        html = '<div class="select">';
        html += '<div class="content">';
        html += '<div class="word">新增查詢條件</div>';
        html += '<div class="icon">&#xf078</div>';
        html += '</div>';
        html += '<ul>';
        options.forEach(function (element) {
            html += '<li data-value="' + element + '">';
            html += element;
            html += '</li>';
        });
        html += '</ul>';
        html += '</div>';
        container.append(html);

        select = $("#multi-search-container .select");
        select.click(function (event) {
            console.log("select click");
            select.toggleClass("open");
        })

        $("#multi-search-container .select ul li").click(function (event) {
            let target = $(this).attr("data-value");
            if($.inArray(target, conditionList) == -1){
                addInputBar(target);
            }else{
                $("#inputBar-" + target + " .tag").click();
            }
        });
    }    

    function addInputBar(tag) {
        let html = '<div id="inputBar-' + tag + '" class="inputBar">';
        html += getTagHtml(tag);

        html += getInputHtml();
        html += getConditionHtml();
        html += getCtrlHtml();
        html += '</div>';
        container.append(html);
        conditionList.push(tag);

        let inputBar = $("#inputBar-" + tag);

        let inputBarTag = $("#inputBar-" + tag + " .tag");
        inputBarTag.click(inputBarClickListener);

        let inputBarCondition = $("#inputBar-" + tag + " .condition");
        inputBarCondition.click(inputBarClickListener);

        let inputBarCtrl = $("#inputBar-" + tag + " .ctrl");
        inputBarCtrl.click(function (event) {
            let input = $("#inputBar-" + tag + " input");
            if (!input.hasClass("show")) {
                remove();
            }
        });

        let inputBarInput = $("#inputBar-" + tag + " input");
        inputBarInput.focusout(inputBarClickListener);

        inputBarTag.click();

        function inputBarClickListener(event) {
            switch (event.type) {
                case "click":
                    inputBarInput.toggleClass("show");
                    inputBarInput.focus();
                    break;
                case "focusout":
                    inputBarInput.removeClass("show");
                    if (inputBarInput.val() == null || "" == inputBarInput.val()) {
                        remove();
                    }
                    $("#inputBar-" + tag + " .condition").html(inputBarInput.val());
                    break;
            }
        }

        function getTagHtml(tag) {
            let html = '<div class="tag">';
            html += tag;
            html += '</div>';
            return html;
        }

        function getConditionHtml() {
            let html = '<div class="condition"></div>';
            return html;
        }

        function getInputHtml() {
            let html = '<input type="text" class="input" value="">';
            return html;
        }

        function getCtrlHtml() {
            let html = '<div class="ctrl">';
            html += '</div>';
            return html;
        }
        
        function remove(){
            conditionList.splice($.inArray(tag, conditionList), 1);
            inputBar.remove();
        }
    }
}
