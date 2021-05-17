class NotificationTooltip {
    constructor(containerID) {
        this.containerID = containerID;
        this.data = [{
            title: 'WO-20200517-FFFF',
            subtitle: '解鎖請求',
            message: 'Kevin 向您提出解鎖的請求',
            actionUrl: 'https://www.google.com/'
        },{
            title: 'WO-20200517-EEEE',
            subtitle: '解鎖請求',
            message: 'Le 向您提出解鎖的請求',
            actionUrl: 'https://www.google.com/'
        },{
            title: 'WO-20200517-EEEE',
            subtitle: '解鎖請求',
            message: 'Le 向您提出解鎖的請求',
            actionUrl: 'https://www.google.com/'
        },{
            title: 'WO-20200517-EEEE',
            subtitle: '解鎖請求',
            message: 'Le 向您提出解鎖的請求',
            actionUrl: 'https://www.google.com/'
        }];

        this._generate();
        this._update();
    }

    setData(data) {
        this.data = data;
        this._update();
    }

    _generate() {
        generateContainer(this);
        if (!this.container) {
            return;
        }

        generateExpandButton(this);
        generateBadge(this);
        generateTooltip(this);

        function generateContainer(self) {
            if (!self.containerID) {
                return;
            }

            self.container = $(`#${self.containerID}`);
            self.container.html("");
            self.container.css({ position: "relative", display: "inline-block"});
        }

        function generateExpandButton(self) {
            self.container.append(`<div id="notification-tooltip-expand-button" class="material-icons-outlined">notifications_none</div>`)
            self.expandButton = $('#notification-tooltip-expand-button');

            self.expandButton.click(function(e) {
                e.stopPropagation();
                self.tooltip.toggleClass('active');
            })
        }

        function generateBadge(self) {
            self.container.append(`<div id="notification-tooltip-expand-button-badge"></div>`);
            self.expandButtonBadge = $('#notification-tooltip-expand-button-badge');
        }
    
        function generateTooltip(self) {
            self.container.append(
                `<div id="notification-tooltip" class="active">
                    <div id="notification-tooltip-title"></div>
                    <div id="notification-tooltip-tableview"></div>
                </div>`
            );

            self.tooltip = $('#notification-tooltip');
            self.tooltipTitle = $('#notification-tooltip-title');
            self.tableView = $('#notification-tooltip-tableview');

            self.tooltip.click(function(event) {
                event.stopPropagation();
            })
    
            $('html').click(function(event) {
                self.tooltip.removeClass('active');
            })
        }
    }

    _update() {
        if (!this.container) {
            return;
        }

        updateExpandButtonBadge(this);
        updateTooltipTitle(this);
        updateTableView(this);

        function updateExpandButtonBadge(self) {
            if (!self.data || self.data.length == 0) {
                self.expandButtonBadge.removeClass('active');
            } else {
                self.expandButtonBadge.addClass('active');
            }
        }

        function updateTooltipTitle(self) {
            if (!self.data || self.data.length == 0) {
                self.tooltipTitle.html('沒有更早的通知');
            } else {
                self.tooltipTitle.html(`${self.data.length} 則未讀通知`);
            }
        }

        function updateTableView(self) {
            if (!self.data || self.data.length == 0) {
                self.tableView.html('');
            } else {
                for (var i = 0; i < self.data.length; i++) {
                    generateTableViewItem(self, self.data[i]);
                }
            }

            function generateTableViewItem(self, data) {
                var html = `
                <div class="notification-tooltip-tableview-item">
                    <div class="notification-tooltip-tableview-item-subtitle">${data.subtitle}</div>
                    <div class="notification-tooltip-tableview-item-title">${data.title}</div>
                    <div class="notification-tooltip-tableview-item-message">${data.message}</div>
                    <a href="${data.actionUrl}" target="_blank"></a>
                </div>`;

                self.tableView.append(html);
            }
        }
    }
}