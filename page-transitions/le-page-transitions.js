let current_page = 1
let max_page;

function initPageView() {
    let container = $('.view_page_container');
    max_page = container.find('.page').length;
    initPageTag();

    function initPageTag() {
        let container = $('.page_tag');

    }
}

function nextPage() {
    $('#tag' + (current_page - 1)).addClass('hide');

    $('#page' + current_page).removeClass('show');
    $('#page' + current_page).addClass('left');

    $('#tag' + current_page).removeClass('show');
    $('#tag' + current_page).addClass('left');
    $('#tag' + current_page + ' .step_bar_cover').addClass('show');

    $('#page' + ++current_page).removeClass('right');
    $('#page' + current_page).addClass('show');

    $('#tag' + current_page).removeClass('right');
    $('#tag' + current_page).addClass('show');
}

function backPage() {
    $('#page' + current_page).removeClass('show');
    $('#page' + current_page).addClass('right');

    $('#tag' + current_page).removeClass('show');
    $('#tag' + current_page).addClass('right');

    $('#page' + --current_page).removeClass('left');
    $('#page' + current_page).addClass('show');

    $('#tag' + current_page).removeClass('left');
    $('#tag' + current_page).addClass('show');
    $('#tag' + current_page + ' .step_bar_cover').removeClass('show');

    $('#tag' + (current_page - 1)).removeClass('hide');
}
