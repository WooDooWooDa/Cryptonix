$(document).ready(function() {
    $(".tabs-a").each(function () {
        let tab = (this.href).substr((this.href).indexOf('#') + 1, (this.href).length - 1);
        if (window.location.href.endsWith(this.href)) {
            $(".tabs-a").parent().removeClass('is-active');
            $(".tabs-a").parent().removeClass('is-bold');
            $(this).parent().addClass('is-active');
            $(this).parent().addClass('is-bold');
            $('.tab').addClass("is-hidden");
            $('#' + tab).removeClass("is-hidden")
        }
        $(this).click(function () {
            $(".tabs-a").parent().removeClass('is-active');
            $(".tabs-a").parent().removeClass('is-bold');
            $(this).parent().addClass('is-active');
            $(this).parent().addClass('is-bold');
            $('.tab').addClass("is-hidden");

            $('#' + tab).removeClass("is-hidden")
        })
    });
});
