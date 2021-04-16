class LockTooltip {
    constructor(containerID, isLocked, isLoading, title, subtitle, buttonText, action) {

        this.isLocked = isLocked;
        this.isLoading = isLoading;
        this.title = title;
        this.subtitle = subtitle;
        this.buttonText = buttonText;
        this.action = action;
        
        var container = $(`#${containerID}`)
        container.css({ position: "relative", display: "inline-block"})
        var button;

        initButton();
        updateButton();
        initTooltip();

        function initButton() {
            container.append(`<div id="lock-tooltip-button" class="material-icons-outlined">lock</div>`)
            button = $('#lock-tooltip-button');
        }

        function updateButton() {
            button.html(isLocked ? 'lock' : 'lock_open');
        }

        function initTooltip() {
            container.append(
                `<div id="lock-tooltip">
                    <div id="lock-tooltip-title">${title}</div>
                    <div id="lock-tooltip-subtitle">${subtitle}</div>
                    <div id="lock-tooltip-action">${buttonText}</div>
                </div>`
            );

            $('#lock-tooltip-action').click(function() {
                action()
                isLoading = true;
            })
        }
    }
}

