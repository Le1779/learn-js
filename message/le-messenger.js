var setMessage = function (messages) {
    console.log(messages);
    let menuItems = [];
    messages.forEach(function (message) {
        menuItems.push(message.from);
        showChatroom(message.from);
    });
    initExpandMenu(menuItems);
}

let leMessenger;
let expandMenu;
let chartroom = [];

$(document).ready(function () {
    initView();
    addWindowEvent();
});

function initView() {
    leMessenger = getContainer();
    makeExpandButton();
    makeChatroomList();

    function getContainer() {
        return $('.le-messenger');
    }

    function makeExpandButton() {
        let html = '<div class="le-expand-button"></div>';
        leMessenger.append(html);
        let expandButton = $('.le-expand-button');
        addIcon();
        makeExpandMenu();

        function addIcon() {
            let html = '<svg class="le-expand-button-icon" viewBox="-21 -47 682.66669 682">';
            html += '<path d="m640 86.65625v283.972656c0 48.511719-39.472656 87.988282-87.988281 87.988282h-279.152344l-185.183594 128.863281v-128.863281c-48.375-.164063-87.675781-39.574219-87.675781-87.988282v-283.972656c0-48.515625 39.472656-87.988281 87.988281-87.988281h464.023438c48.515625 0 87.988281 39.472656 87.988281 87.988281zm0 0" fill="#ffdb2d" />';
            html += '<path d="m640 86.65625v283.972656c0 48.511719-39.472656 87.988282-87.988281 87.988282h-232.109375v-459.949219h232.109375c48.515625 0 87.988281 39.472656 87.988281 87.988281zm0 0" fill="#ffaa20" />';
            html += '<g fill="#fff">';
            html += '<path d="m171.296875 131.167969h297.40625v37.5h-297.40625zm0 0" />';
            html += '<path d="m171.296875 211.167969h297.40625v37.5h-297.40625zm0 0" />';
            html += '<path d="m171.296875 291.167969h297.40625v37.5h-297.40625zm0 0" />';
            html += '</g>';
            html += '<path d="m319.902344 131.167969h148.800781v37.5h-148.800781zm0 0" fill="#e1e1e3" />';
            html += '<path d="m319.902344 211.167969h148.800781v37.5h-148.800781zm0 0" fill="#e1e1e3" />';
            html += '<path d="m319.902344 291.167969h148.800781v37.5h-148.800781zm0 0" fill="#e1e1e3" />';
            html += '</svg>';
            expandButton.append(html);
        }

        function makeExpandMenu() {
            let html = '<div class="le-expand-menu"></div>';
            expandButton.append(html);
        }

    }

    function makeChatroomList() {
        let html = '<div class="le-chatroom-list"></div>';
        leMessenger.append(html);
    }
}

function initExpandMenu(items) {
    expandMenu = $('.le-expand-menu');
    items.forEach(function (item) {
        let html = '<div class="le-expand-menu-item" onclick="showChatroom(';
        html += "'" + item + "'";
        html += ')">';
        html += '<svg class="le-expand-menu-item-icon" height="32" width="32">';
        html += '<circle cx="16" cy="16" r="16" fill="#5E6169" />';
        html += '<text x="16" y="16" fill="white" text-anchor="middle" alignment-baseline="central" style="font-size:16px;font-family:unset;">' + item.substring(item.length - 1) + '</text>'
        html += '</svg>';
        html += '<div class="le-expand-menu-item-title">' + item + '</div>';
        html += '<div class="le-expand-menu-item-hint">2</div>';
        html += '</div>';
        expandMenu.append(html);
    });
}

function showChatroom(name) {
    let chatroomList = $('.le-chatroom-list');
    if ($.inArray(name, chartroom) == -1) {
        chartroom.push(name);
        makeChatroom();
    } else {
        $('#le-chatroom-' + name).toggleClass('expand');
    }
    showMessage('#le-chatroom-' + name);

    function makeChatroom() {
        let html = '<div class="le-chatroom-item">';
        html += '<div id="le-chatroom-' + name + '" class="le-chatroom expand">';
        html += makeTitle();
        html += makeContent();
        html += '</div>';
        html += '</div>';
        chatroomList.append(html);
        addChatroomEvent('#le-chatroom-' + name);

        function makeTitle() {
            let html = '<div class="le-chatroom-title">';
            html += makeIcon();
            html += '<div class="le-chatroom-title-text">' + name + '</div>';
            html += '<div class="le-chatroom-title-close-button"></div>';
            html += '</div>';
            return html;

            function makeIcon() {
                let html = '<div class="le-chatroom-title-icon">';
                html += '<svg class="le-expand-menu-item-icon" height="24" width="24">';
                html += '<circle cx="12" cy="12" r="12" fill="#5E6169" />';
                html += '<text x="12" y="12" fill="white" text-anchor="middle" alignment-baseline="central" style="font-size:12px;font-family:unset;">' + name.substring(name.length - 1) + '</text>'
                html += '</svg>';
                html += '</div>';
                return html;
            }
        }

        function makeContent() {
            let html = '<div class="le-chatroom-content">';
            html += '<div class="le-chatroom-content-message-container"></div>';
            html += makeSendBar();
            html += '</div>';
            return html;

            function makeSendBar() {
                let html = '<div class="le-chatroom-content-send-bar">';
                html += '<textarea onkeyup="textareaAutoGrow(this)" rows="1" placeholder="輸入訊息..." ></textarea>';
                html += makeButtons();
                html += '</div>';
                return html;

                function makeButtons() {
                    let html = '<div class="le-chatroom-content-button">';
                    html += makeSendButton();
                    html += '</div>';
                    return html;

                    function makeSendButton() {
                        let html = '<div class="le-chatroom-content-button-send">';
                        html += '<svg class="svgIcon" height="16px" width="16px" version="1.1" viewBox="0 0 16 16" x="0px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" y="0px"><path d="M11,8.3L2.6,8.8C2.4,8.8,2.3,8.9,2.3,9l-1.2,4.1c-0.2,0.5,0,1.1,0.4,1.5C1.7,14.9,2,15,2.4,15c0.2,0,0.4,0,0.6-0.1l11.2-5.6 C14.8,9,15.1,8.4,15,7.8c-0.1-0.4-0.4-0.8-0.8-1L3,1.1C2.5,0.9,1.9,1,1.5,1.3C1,1.7,0.9,2.3,1.1,2.9L2.3,7c0,0.1,0.2,0.2,0.3,0.2 L11,7.7c0,0,0.3,0,0.3,0.3S11,8.3,11,8.3z"></path></svg>';
                        html += '</div>';
                        return html;
                    }
                }
            }
        }
    }

    function addChatroomEvent(id) {
        $(id + ' .le-chatroom-title-close-button').click(function (event) {
            event.stopPropagation();
            console.log("close");
            hideChatroom(name);
        });

        $(id + ' .le-chatroom-title').click(function (event) {
            $(id).toggleClass('expand');
        });


        $(id + ' .le-chatroom-content-send-bar textarea')
            .focusin(function () {
                $(id + ' .le-chatroom-content-button-send').addClass('focus');
            })
            .focusout(function () {
                $(id + ' .le-chatroom-content-button-send').removeClass('focus');
            })
    }


    function showMessage(id) {
        let messageContainer = $(id + ' .le-chatroom-content-message-container');
        makeMessage(true, "XXXXXX");
        makeMessage(false, "OOOOOOO");
        makeMessage(false, "WWWW");
        makeMessage(false, "AAA");
        makeMessage(true, "ZZZZZZZZZZZZZZZZZZ");
        makeMessage(true, "ZZZZZZZZZZZZZZZZZZ");
        makeMessage(true, "ZZZZZZZZZZZZZZZZZZ");
        makeMessage(true, "ZZZZZZZZZZZZZZZZZZ");
        messageContainer.animate({ scrollTop: messageContainer.height() }, 0);

        function makeMessage(otherSide, message) {
            let html = '';
            if (otherSide) {
                html += '<div class="le-chatroom-content-message otherSide">';
            } else {
                html += '<div class="le-chatroom-content-message">';
            }
            html += '<div class="le-chatroom-content-message-text">';
            html += message;
            html += '</div>';
            html += '</div>';
            messageContainer.append(html);
        }
    }
    
}

function hideChatroom(name) {
        $('#le-chatroom-' + name).remove();
        if ($.inArray(name, chartroom) != -1) {
            delete chartroom[$.inArray(name, chartroom)];
            chartroom.length = chartroom.length - 1;
            console.log(chartroom);
        }
    }

function textareaAutoGrow(textarea) {
    setTimeout(function () {
        textarea.style.cssText = 'height:auto; padding:0';
        if (textarea.clientHeight * 6 > textarea.scrollHeight) {
            textarea.style.cssText = 'height:' + textarea.scrollHeight + 'px';
        } else {
            textarea.style.cssText = 'height:' + textarea.clientHeight * 6 + 'px';
        }
    }, 0);

}


function addWindowEvent(){
    $(window).resize(function() {
        let amount = chartroom.length;
        let windowWdth=$(window).width();
        console.log(amount);
        console.log(windowWdth);
        if(amount * 300 + 80 > windowWdth){
            hideChatroom(chartroom[amount-1]);
        }
    });
}
