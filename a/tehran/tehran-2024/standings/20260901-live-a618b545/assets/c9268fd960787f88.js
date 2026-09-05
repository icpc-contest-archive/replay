// Modal Show
// By: Hamid Zarrabi-Zadeh

const imageFormat = "jpg";
const fadeTime = 500;
const teamIDStart = Math.min(...rows.map(row => row[5]));

$(document).ready(function () {

    const guard = $("#guard");
    const modal = $("#modal");
    const img = modal.children("img");

    $("#scoreboard")
        .find("td.team")
        .click(function () {
            const num = +$(this).attr("data");
            img.attr("src", "photos/" + (num - teamIDStart + 1) + "." + imageFormat);
            guard.fadeIn(fadeTime);
            modal.fadeIn(fadeTime);
        });

    guard.click(function () {
        modal.fadeOut(fadeTime);
        guard.fadeOut(fadeTime);
    });

    $(document).keypress(function (e) {
        modal.fadeOut(fadeTime);
        guard.fadeOut(fadeTime);
    });
});