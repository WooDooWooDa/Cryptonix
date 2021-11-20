$(document).ready(function() {
    $(".side-bar-menu").children().each(function() {
        if (window.location.href.startsWith(this.href)) {
            $(this).addClass("selected");
        }
    });
});