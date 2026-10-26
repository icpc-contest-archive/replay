// AARGH
// mMenu doet vervelend, dus maar zo.
$(function() {
    $("#loginform-mobile input").on("keydown", function (event) {
        var keyCode = event.keyCode || event.which
        var target = null
        switch (event.target.id) {
            case "email-mobile":
                target = "password-mobile"
                break
            case "password-mobile":
                target = "submit-mobile"
        }
        // 9 is tab
        if (keyCode == 9 && target != null) {
            event.preventDefault()
            $("#" + target).trigger("focus")
        }
    })
})
