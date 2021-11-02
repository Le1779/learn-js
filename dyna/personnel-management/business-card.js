class BusinessCard {
    constructor(containerID, isEditing = false) {
        this.containerID = containerID;
        this.isEditing = isEditing;

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
        this.emailCountrySelector = ""

        this._initContainer();
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
        this._updateData();
    }

    /**
     * 建立內容
     */
    _generateContent() {
        if (this.isEditing) {
            this._generateEditingContent();
            this.emailCountrySelector = $(`#${this.containerID}-business-card-email-country`)
        } else {
            this._generateDetailContent();
            this.userId = $(`#${this.containerID}-business-card-user-id`);
        }

        this.userName = $(`#${this.containerID}-business-card-user-name`);
        this.userEngName = $(`#${this.containerID}-business-card-user-eng-name`);
        this.userDepartment = $(`#${this.containerID}-business-card-user-department`);
        this.userRole = $(`#${this.containerID}-business-card-user-role`);
        this.userEmail = $(`#${this.containerID}-business-card-user-email`);
        this.countrySelector = new CountrySelector(`${this.containerID}-country-selector`, this.isEditing);
    }

    /**
     * 更新資料
     */
    _updateData() {
        if (this.isEditing) {
            this.userName.val(this.userData.name);
            this.userEngName.val(this.userData.engName);

            let emailDomainIndex = this.userData.email.search('@dynacw');
            let email = this.userData.email.substring(0, emailDomainIndex);
            let emailCountry = this.userData.email.substring(emailDomainIndex + '@dynacw'.length + 1);
            this.userEmail.val(email);
            this.emailCountrySelector.val(emailCountry);
        } else {
            this.userId.html(`No.${this.userData.id}`);
            this.userName.html(this.userData.name);
            this.userEngName.html(this.userData.engName);
            this.userRole.html(this.userData.role);
            this.userEmail.html(this.userData.email);
            this.countrySelector.setCountry(this.userData.country);
        }

        this.userDepartment.html(this.userData.department);
    }

    /**
     * 建立內容
     */
     _generateDetailContent() {
        this.container.append(
            `<div class="field-container">
                <div id="${this.containerID}-business-card-user-id" class="business-card-text caption"></div>
                <div id="${this.containerID}-business-card-user-name" class="business-card-text title"></div>
                <div id="${this.containerID}-business-card-user-eng-name" class="business-card-text subtitle"></div>
                <div>
                    <div id="${this.containerID}-business-card-user-department" class="business-card-text subtitle inline"></div>
                    <div id="${this.containerID}-business-card-user-role" class="business-card-text subtitle inline" style="margin-left: 8px;"></div>
                </div>
                <div id="${this.containerID}-business-card-user-email" class="business-card-text subtitle"></div>
            </div>
            <div class="right-block"></div>
            <div class="bottom-block">
            <div class="color-block"></div>
            <div id="${this.containerID}-country-selector"></div>
            </div>`
        );
    }

    /**
     * 建立編輯內容
     */
     _generateEditingContent() {
        this.container.append(
            `<div class="field-container editing">
                <div id="${this.containerID}-business-card-user-id" class="business-card-text caption"></div>
                <div>
                    <input id="${this.containerID}-business-card-user-name" type="text" class="business-card-text title" placeholder="Name" aria-label="Name" />
                </div>
                <div>
                    <input id="${this.containerID}-business-card-user-eng-name" type="text" class="business-card-text subtitle" placeholder="English Name" aria-label="English Name" />
                </div>
                <div class="department-row">
                    <div id="${this.containerID}-business-card-user-department" class="business-card-text subtitle inline"></div>
                    <div class="inline" style="margin-left: 8px;">
                        <select id="${this.containerID}-business-card-user-role" class="business-card-text subtitle">
                            <option disabled="" selected="" value="">選擇職位</option>
                        </select>
                    </div>
                    <div class="inline" style="margin-left: 10px">
                        <input type="checkbox" :checked="value.isAtWork" />
                        <span style="margin-left: 2px">在職</span>
                    </div>
                </div>
                <div class="email-row">
                    <input id="${this.containerID}-business-card-user-email" type="text" class="business-card-text subtitle" placeholder="Email" aria-label="Email" />
                    <span class="business-card-text subtitle">@dynacw</span>
                    <select id="${this.containerID}-business-card-email-country" class="employee-email-country business-card-text subtitle">
                        <option value="com">.com</option>
                        <option value="co.jp">.co.jp</option>
                        <option value="cn">.cn</option>
                    </select>
                </div>
            </div>
            <div class="right-block"></div>
            <div class="bottom-block">
            <div class="color-block"></div>
            <div id="${this.containerID}-country-selector"></div>
            </div>`
        );
    }
}