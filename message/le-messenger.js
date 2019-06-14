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

$(document).ready(function () {
    initView();
});

function initView() {
    leMessenger = getContainer();
    makeExpandButton();

    function getContainer() {
        return $('.le-messenger');
    }

    function makeExpandButton() {
        let html = '<div class="le-expand-button"></div>';
        leMessenger.append(html);
        let expandButton = $('.le-expand-button');
        addIcon();
        makeExpandMenu();
        makeChatroomList();

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

        function makeChatroomList() {
            let html = '<div class="le-chatroom-list"></div>';
            expandButton.append(html);
        }

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

let chartroom = [];

function showChatroom(name) {
    console.log(name);
    let chatroomList = $('.le-chatroom-list');
    if ($.inArray(name, chartroom) == -1) {
console.log(name);
    } else {
        makeChatroom();
    }

    function makeChatroom() {
        let html = '<div class="le-chatroom">';
        html += '<div class="le-chatroom-title">';
        html += '<div class="le-chatroom-title-icon"></div>';
        html += '<div class="le-chatroom-title-text">XXX</div>';
        html += '<div class="le-chatroom-title-close-button"></div>';
        html += '</div>';
        html += '<div class="le-chatroom-content"></div>';
        html += '</div>';
        chatroomList.append(html);
    }
}
