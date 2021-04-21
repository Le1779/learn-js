class LockTooltip {
    constructor(builder) {
        this.builder = builder;
        this.container = null;
        this.button = null;
        this.title = null;
        this.subtitle = null;
        this.loadingText = null;
    }

    generateContainer(containerID) {
        this.container = $(`#${containerID}`);
        this.container.html("");
        this.container.css({ position: "relative", display: "inline-block"});
    }

    generateButton(isLocked) {
        if (!this.container) {
            return;
        }

        this.container.append(`<div id="lock-tooltip-button" class="material-icons-outlined">${isLocked ? 'lock' : 'lock_open'}</div>`)
        this.button = $('#lock-tooltip-button');

        this.button.click(function(e) {
            console.log("button is click.")
        })
    }

    generateTooltip(title, subtitle, buttonText) {
        var buttonHtml = buttonText == "" ? "" : `<div id="lock-tooltip-action">${buttonText}</div>`;
        this.container.append(
            `<div id="lock-tooltip">
                <div id="lock-tooltip-title">${title}</div>
                <div id="lock-tooltip-subtitle">${subtitle}</div>
                ${buttonHtml}
                <div id="lock-tooltip-load-container">
                    <div id="lock-tooltip-load-text">${"處理中..."}</div>
                    <div id="lock-tooltip-load"></div>
                </div>
            </div>`
        );

        this.title = $('#lock-tooltip-title');
        this.subtitle = $('#lock-tooltip-subtitle');
        this.loadingText = $('#lock-tooltip-load-text');

        var self = this;
        $('#lock-tooltip-action').click(function() {
            console.log(self.builder.isLocked)
        })
    }   
}

class LockTooltipBuilder {
    constructor(containerID) {
        this.containerID = containerID;

        this.isLocked = false;
        this.isPM = false;
        this.locker = null;
        this.visitor = null;
        this.host = null;

        this.title = "";
        this.subtitle = "";
        this.buttonText = "";
        this.loadingText = "";
    }

    setLocked(isLocked) {
        this.isLocked = isLocked;
        return this;
    }

    setPM(isPM) {
        this.isPM = isPM;
        return this;
    }

    setLocker(locker) {
        this.locker = locker;
        return this;
    }

    setVisitor(visitor) {
        this.visitor = visitor;
        return this;
    }

    setHost(host) {
        this.host = host;
        return this;
    }

    build() {
        var instance = new LockTooltip(this);
        instance.generateContainer(this.containerID);
        instance.generateButton(this.isLocked);

        if (this.isPM || this.locker.id != this.visitor.id) {
            this.title = this.isLocked ? "工單已被鎖定" : "工單未鎖定";
            this.subtitle = this.isLocked ? `這是由${this.locker.name}提出的鎖定` : "";
        } else {
            this.title = this.isLocked ? "工單已被鎖定" : "鎖定工單";
            this.subtitle = this.isLocked ? `解除鎖定讓PM可以更新工單檔案` : "此動作會造成PM無法更新工單檔案";
            this.buttonText = this.isLocked ? "解鎖" : "鎖定"
        }

        instance.generateTooltip(this.title, this.subtitle, this.buttonText)
        return instance;
    }
}
