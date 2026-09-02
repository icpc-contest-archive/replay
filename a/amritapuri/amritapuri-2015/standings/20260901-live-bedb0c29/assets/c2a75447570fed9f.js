jQuery(document).ready(function ($) {
  // Event handler for the form submission
  $("#search-h").on("keyup change", function (e) {
    e.preventDefault();

    // Extract dynamic values (if needed)
    var keywords = $(this).val();
    $.ajax({
      type: "POST",
      url: keyup_program_search_obj.ajaxurl,
      data: {
        action: "amrita_keyup_program_search",
        keyword: keywords,
      },
      beforeSend: function () {
        $("#eventpage_archive_events").html(
          '<span class="event_loader"></span>'
        );
      },
      success: function (result) {
        $("#program-search-result").html(result);
        //console.log(result);
      },
      error: function (xhr, status, error) {
        console.log("AJAX request failed: ", status, error); // Log error if AJAX fails
      },
    });
  });
});
