class LockTooltip {
    constructor(containerID, isPM, locker, visitor, require, action) {
        this.containerID = containerID;
        this.isPM = isPM;
        this.locker = locker;
        this.visitor = visitor;
        this.require = require;
        this.action = action;

        this.title = "";
        this.subtitle = "";
        this.buttonText = "";
        this.loadingText = "";

        this._generateContainer();
        this._generateExpandButton();
        this._generateTooltip();
        this._updateTooltipText();
    }

    setPM(isPM) {
        this.isPM = isPM;
        this._updateTooltipText();
    }

    setLocker(locker) {
        this.locker = locker;
        this._updateTooltipText();
    }

    setVisitor(visitor) {
        this.visitor = visitor;
        this._updateTooltipText();
    }

    setRequire(require) {
        this.require = require;
        this._updateTooltipText();
    }

    setAction(action) {
        this.action = action;
    }

    _generateContainer() {
        this.container = $(`#${this.containerID}`);
        this.container.html("");
        this.container.css({ position: "relative", display: "inline-block"});
    }

    _generateExpandButton() {
        if (!this.container) {
            return;
        }

        this.container.append(`<div id="lock-tooltip-button" class="material-icons-outlined">${this.locker ? 'lock' : 'lock_open'}</div>`)
        this.expandButton = $('#lock-tooltip-button');

        this.expandButton.click(function(e) {
            e.stopPropagation();
            $('#lock-tooltip').toggleClass('active');
        })
    }

    _generateTooltip() {
        this.container.append(
            `<div id="lock-tooltip" class="active">
                <div id="lock-tooltip-title"></div>
                <div id="lock-tooltip-subtitle"></div>
                <div id="lock-tooltip-action"></div>
                <div id="lock-tooltip-load-container">
                    <div id="lock-tooltip-load-text">${"處理中..."}</div>
                    <div id="lock-tooltip-load"></div>
                </div>
            </div>`
        );

        this.title = $('#lock-tooltip-title');
        this.subtitle = $('#lock-tooltip-subtitle');
        this.tooltipButton = $('#lock-tooltip-action');

        var self = this;
        $('#lock-tooltip-action').click(function(event) {
            event.stopPropagation();
            self.action();
        })

        $('#lock-tooltip').click(function(event) {
            event.stopPropagation();
        })

        $('html').click(function(event) {
            $('#lock-tooltip').removeClass('active');
        })
    }   

    _updateTooltipText() {
        if (this.locker) {
            this.title.html("工單已被鎖定");
            if (this._isLocker()) {
                if (this.require == null) {
                    this.subtitle.html("你已經鎖定此工單");
                } else {
                    this.subtitle.html(`${this.require.name} 向你提出解鎖的請求`);
                }
                
                this.tooltipButton.html("解鎖");
            } else {
                this.subtitle.html(`此工單已由 ${this.locker.name} 鎖定`);
                if (this.isPM) {
                    this.tooltipButton.html("請求解鎖");
                } else {
                    this.tooltipButton.html("確認");
                }
            }
        } else {
            this.title.html("工單未鎖定");

            if (this.isPM) {
                this.subtitle.html("如果其他人鎖定此工單，你將無法編輯工單");
                this.tooltipButton.html("確認");
            } else {
                this.subtitle.html("此動作會造成PM無法更新工單檔案");
                this.tooltipButton.html("鎖定");
            }
        }
    }

    _isLocker() {
        return this.locker.id == this.visitor.id
    }
}
