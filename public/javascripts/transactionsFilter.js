$(document).ready(function() {
    $("[data-toggle-action]").each(function () {
        $(this).click(function () {
            addActive(this);
            toggleTransactions(this.dataset.toggleAction);
        })
    })
});

function toggleTransactions(action) {
    $("[data-action]").each(function () {
        $(this).removeClass("is-hidden");
        if (action !== 'all' && this.dataset.action !== action) {
            $(this).addClass("is-hidden");
        }
    })
}

function addActive(button) {
    $("[data-toggle-action].selected").removeClass("selected");
    $(button).addClass("selected");
}