var GradualTable = function () {
    console.log("init table");
    let table = $('#gradual-table');
    let body = $('#gradual-table-body');
    let toolbar = $('#gradual-table-toolbar');

    let minColor = 255;
    let maxColor = 190;


    this.setData = function (data) {
        let aliquots = (minColor - maxColor) / (data.length + 6 - 2);
        console.log("aliquots: " + aliquots);
        data.forEach(function (item, index) {
            let startColor = minColor - (minColor - maxColor) / data.length * index;
            let nextColor = minColor - (minColor - maxColor) / data.length * (index + 1);

            addRow(item, index, aliquots);
        });
        reflashToolbar(data.length, 1, 4)
    }

    function addRow(data, index, aliquots) {
        let html = '<div class="gradual-table-item">';
        html += makeProjectNameAndId();
        html += makePMBlock(data.PM, minColor - aliquots * index);
        html += makeFDBlock(data.FD, minColor - aliquots * (index + 1));
        html += makeRetailBlock(data.Retail, minColor - aliquots * (index + 2));
        html += makeIABlock(data.IA, minColor - aliquots * (index + 3));
        html += makeGaijiBlock(data.Gaiji, minColor - aliquots * (index + 4));
        html += makeQABlock(data.QA, minColor - aliquots * (index + 5));
        html += makeAction();
        html += '</div>';
        body.append(html);

        function makeProjectNameAndId() {
            let html = '<div class="gradual-table-columns project-name-and-id">';
            html += '<div class="project-name">' + data.ProjectName + '</div>';
            html += '<div class="project-id">' + data.AppInstanceID + '</div>';
            html += '</div>';
            return html;
        }

        function makePMBlock(principal, color) {
            let html = '';
            if (principal === null || principal.length === 0) {
                html += '<div class="gradual-table-columns PM" style="background-color: rgb(' + color + ', ' + color + ', ' + color + ')"></div>';
            } else {
                html += '<div class="gradual-table-columns PM active" style="background-color: rgb(' + color + ', ' + color + ', ' + color + ')">';
                html += '<div class="icon">';
                html += '<svg id="text-svg" height="42" width="42"><filter id="blurPM"><feGaussianBlur stdDeviation="2" /></filter>';
                html += '<circle cx="21" cy="21" r="18" fill="#008FB5" opacity="0.5" filter="url(#blurPM)"></circle>';
                html += '<circle cx="21" cy="21" r="16" fill="#008FB5"></circle>';
                html += '<text x="21" y="21" fill="white" text-anchor="middle" alignment-baseline="central" style="font-size:16px;font-family:unset;">PM</text>';
                html += '</svg>';
                html += '</div>';
                html += '<div class="principal">' + principal.join('<br>') + '</div>';
                html += '</div>';
            }
            return html;
        }

        function makeFDBlock(principal, color) {
            let html = '';
            if (principal === null || principal.length === 0) {
                html += '<div class="gradual-table-columns FD" style="background-color: rgb(' + color + ', ' + color + ', ' + color + ')"></div>';
            } else {
                html += '<div class="gradual-table-columns FD active" style="background-color: rgb(' + color + ', ' + color + ', ' + color + ')">';
                html += '<div class="icon">';
                html += '<svg id="text-svg" height="42" width="42"><filter id="blurFD"><feGaussianBlur stdDeviation="2" /></filter>';
                html += '<circle cx="21" cy="21" r="18" fill="#F1C109" opacity="0.5" filter="url(#blurFD)"></circle>';
                html += '<circle cx="21" cy="21" r="16" fill="#F1C109"></circle>';
                html += '<text x="21" y="21" fill="white" text-anchor="middle" alignment-baseline="central" style="font-size:16px;font-family:unset;">FD</text>';
                html += '</svg>';
                html += '</div>';
                html += '<div class="principal">' + principal.join('<br>') + '</div>';
                html += '</div>';
            }
            return html;
        }

        function makeRetailBlock(principal, color) {
            let html = '';
            if (principal === null || principal.length === 0) {
                html += '<div class="gradual-table-columns Retail" style="background-color: rgb(' + color + ', ' + color + ', ' + color + ')"></div>';
            } else {
                html += '<div class="gradual-table-columns Retail active" style="background-color: rgb(' + color + ', ' + color + ', ' + color + ')">';
                html += '<div class="icon">';
                html += '<svg id="text-svg" height="42" width="42"><filter id="blurRetail"><feGaussianBlur stdDeviation="2" /></filter>';
                html += '<circle cx="21" cy="21" r="18" fill="#67AB49" opacity="0.5" filter="url(#blurRetail)"></circle>';
                html += '<circle cx="21" cy="21" r="16" fill="#67AB49"></circle>';
                html += '<text x="21" y="21" fill="white" text-anchor="middle" alignment-baseline="central" style="font-size:16px;font-family:unset;">Re</text>';
                html += '</svg>';
                html += '</div>';
                html += '<div class="principal">' + principal.join('<br>') + '</div>';
                html += '</div>';
            }
            return html;
        }

        function makeIABlock(principal, color) {
            let html = '';
            if (principal === null || principal.length === 0) {
                html += '<div class="gradual-table-columns IA" style="background-color: rgb(' + color + ', ' + color + ', ' + color + ')"></div>';
            } else {
                html += '<div class="gradual-table-columns IA active" style="background-color: rgb(' + color + ', ' + color + ', ' + color + ')">';
                html += '<div class="icon">';
                html += '<svg id="text-svg" height="42" width="42"><filter id="blurIA"><feGaussianBlur stdDeviation="2" /></filter>';
                html += '<circle cx="21" cy="21" r="18" fill="#EF9736" opacity="0.5" filter="url(#blurIA)"></circle>';
                html += '<circle cx="21" cy="21" r="16" fill="#EF9736"></circle>';
                html += '<text x="21" y="21" fill="white" text-anchor="middle" alignment-baseline="central" style="font-size:16px;font-family:unset;">IA</text>';
                html += '</svg>';
                html += '</div>';
                html += '<div class="principal">' + principal.join('<br>') + '</div>';
                html += '</div>';
            }
            return html;
        }

        function makeGaijiBlock(principal, color) {
            let html = '';
            if (principal === null || principal.length === 0) {
                html += '<div class="gradual-table-columns Gaiji" style="background-color: rgb(' + color + ', ' + color + ', ' + color + ')"></div>';
            } else {
                html += '<div class="gradual-table-columns Gaiji active" style="background-color: rgb(' + color + ', ' + color + ', ' + color + ')">';
                html += '<div class="icon">';
                html += '<svg id="text-svg" height="42" width="42"><filter id="blurGaiji"><feGaussianBlur stdDeviation="2" /></filter>';
                html += '<circle cx="21" cy="21" r="18" fill="#FF6384" opacity="0.5" filter="url(#blurGaiji)"></circle>';
                html += '<circle cx="21" cy="21" r="16" fill="#FF6384"></circle>';
                html += '<text x="21" y="21" fill="white" text-anchor="middle" alignment-baseline="central" style="font-size:16px;font-family:unset;">Ga</text>';
                html += '</svg>';
                html += '</div>';
                html += '<div class="principal">' + principal.join('<br>') + '</div>';
                html += '</div>';
            }
            return html;
        }

        function makeQABlock(principal, color) {
            let html = '';
            if (principal === null || principal.length === 0) {
                html += '<div class="gradual-table-columns QA" style="background-color: rgb(' + color + ', ' + color + ', ' + color + ')"></div>';
            } else {
                html += '<div class="gradual-table-columns QA active" style="background-color: rgb(' + color + ', ' + color + ', ' + color + ')">';
                html += '<div class="icon">';
                html += '<svg id="text-svg" height="42" width="42"><filter id="blurQA"><feGaussianBlur stdDeviation="2" /></filter>';
                html += '<circle cx="21" cy="21" r="18" fill="#654982" opacity="0.5" filter="url(#blurQA)"></circle>';
                html += '<circle cx="21" cy="21" r="16" fill="#654982"></circle>';
                html += '<text x="21" y="21" fill="white" text-anchor="middle" alignment-baseline="central" style="font-size:16px;font-family:unset;">QA</text>';
                html += '</svg>';
                html += '</div>';
                html += '<div class="principal">' + principal.join('<br>') + '</div>';
                html += '</div>';
            }
            return html;
        }

        function makeAction() {
            let html = '<div class="gradual-table-columns action">';
            html += '<div class="edit-button">';
            html += '<svg viewBox="0 0 528.899 528.899" height="20" width="20">';
            html += '<path fill="white" d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069 L27.473,390.597L0.3,512.69z" />';
            html += '</svg>';
            html += '</div>';
            html += '<div class="info-button">';
            html += '<svg viewBox="0 0 492.004 492.004" height="20" width="20">';
            html += '<path fill="white" d="M484.14,226.886L306.46,49.202c-5.072-5.072-11.832-7.856-19.04-7.856c-7.216,0-13.972,2.788-19.044,7.856l-16.132,16.136c-5.068,5.064-7.86,11.828-7.86,19.04c0,7.208,2.792,14.2,7.86,19.264L355.9,207.526H26.58C11.732,207.526,0,219.15,0,234.002v22.812c0,14.852,11.732,27.648,26.58,27.648h330.496L252.248,388.926c-5.068,5.072-7.86,11.652-7.86,18.864c0,7.204,2.792,13.88,7.86,18.948l16.132,16.084c5.072,5.072,11.828,7.836,19.044,7.836c7.208,0,13.968-2.8,19.04-7.872l177.68-177.68c5.084-5.088,7.88-11.88,7.86-19.1C492.02,238.762,489.228,231.966,484.14,226.886z" />';
            html += '</svg>';
            html += '</div>';
            html += '</div>';
            return html;
        }
    }

    function reflashToolbar(length, start, end) {
        toolbar.html('');
        if (length === 0) {
            return;
        }

        toolbar.append(makePreviousButton());

        for (let i = start; i <= end; i++) {
            toolbar.append(makeNumberButton(i));
        }

        toolbar.append(makeNextButton());

        function makePreviousButton() {
            let html = '<div id="previous-button" >上一頁</div>';
            return html;
        }

        function makeNextButton() {
            let html = '<div id="next-button">下一頁</div>';
            return html;
        }

        function makeNumberButton(num) {
            let html = '<div id="number-button-' + num + '">' + num + '</div>';
            return html;
        }
    }
}
