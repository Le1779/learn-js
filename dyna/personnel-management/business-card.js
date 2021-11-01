class BusinessCard {
    constructor(containerID) {
        this.containerID = containerID;

        this.userData = {
            id: 0,
            name: "",
            engName: "",
            department: "",
            role: "",
            email: "",
            country: "zh-TW",
        }

        this.userId = "";
        this.userName = "";
        this.userEngName = "";
        this.userDepartment = "";
        this.userRole = "";
        this.userEmail = "";
        this.countrySelector = ""

        this._initContainer();
        this._updateData();
    }

    setUserData(userData) {
        this.userData = userData;
        this._updateData();
    }

    /**
     * 初始化容器
     */
    _initContainer() {
        this.container = $(`#${this.containerID}`);
        this.container.html();
        this.container.addClass("business-card");
        this._generateContent();
    }

    /**
     * 建立內容
     */
    _generateContent() {
        this.container.append(
            `<div class="field-container">
                <div id="business-card-user-id" class="business-card-text caption"></div>
                <div id="business-card-user-name" class="business-card-text title"></div>
                <div id="business-card-user-eng-name" class="business-card-text subtitle"></div>
                <div>
                    <div id="business-card-user-department" class="business-card-text subtitle inline"></div>
                    <div id="business-card-user-role" class="business-card-text subtitle inline" style="margin-left: 8px;"></div>
                </div>
                <div id="business-card-user-email" class="business-card-text subtitle"></div>
            </div>
            <div class="right-block"></div>
            <div class="bottom-block">
            <div class="color-block"></div>
            <div id="country-selector"></div>
            </div>`
        );

        this.userId = $('#business-card-user-id');
        this.userName = $('#business-card-user-name');
        this.userEngName = $('#business-card-user-eng-name');
        this.userDepartment = $('#business-card-user-department');
        this.userRole = $('#business-card-user-role');
        this.userEmail = $('#business-card-user-email');
        this.countrySelector = new CountrySelector("country-selector", false);
    }

    /**
     * 更新資料
     */
    _updateData() {
        this.userId.html(this.userData.id);
        this.userName.html(this.userData.name);
        this.userEngName.html(this.userData.engName);
        this.userDepartment.html(this.userData.department);
        this.userRole.html(this.userData.role);
        this.userEmail.html(this.userData.email);
        this.countrySelector.setCountry(this.userData.country);
    }
}