$(document).ready(function() {
    $("[data-toggle]").click(function () {
        toggleModal(this.dataset.toggle);
    });
});

function toggleModal(modal) {
    $("#" + modal).toggleClass("is-active");
    $("body").toggleClass("is-clipped");
}