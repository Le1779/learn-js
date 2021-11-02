class CountrySelector {
    constructor(containerID, editing) {
        this.containerID = containerID;
        this.editing = editing;

        this.selected = "";

        this.option = [
            {
                value: "zh-TW",
                name: "台灣",
                engName: "Taipei",
            },
            {
                value: "ja-JP",
                name: "日本",
                engName: "Japan",
            },
            {
                value: "zh-CN",
                name: "中國",
                engName: "China",
            },
        ];

        this._initContainer();
        this._updateData();
    }

    setCountry(country) {
        this.selected = country;
        this._updateData();
    }

    /**
     * 初始化容器
     */
    _initContainer() {
        this.container = $(`#${this.containerID}`);
        this.container.html();
        this.container.addClass("country-selector-container");
        this._generateContent();
    }

    /**
     * 建立內容
     */
    _generateContent() {
        for (var i = 0; i < this.option.length; i++) {
            var data = this.option[i];
            this.container.append(
                `<div>
                    <input type="radio" id="#${this.containerID}-country-selector-${data.value}" name="country" value="${data.value}">
                    <label for="${this.containerID}-country-selector-${data.value}">${data.name}</br>${data.engName}</label>
                </div>`
            );
        }
    }

    /**
     * 更新資料
     */
    _updateData() {
        $(`#${this.containerID} input[name=country]`).attr('disabled', !this.editing);
        $(`#${this.containerID} input[name=country]`).attr('checked', false);
        $(`#${this.containerID}-country-selector-${this.selected}`).attr('checked', true);
    }
}