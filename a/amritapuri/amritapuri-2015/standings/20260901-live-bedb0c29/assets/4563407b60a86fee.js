jQuery(document).ready(function ($) {
  // Event handler for the form submission
  $("#past_event_filter").on("submit", function (e) {
    e.preventDefault();

    // Extract dynamic values (if needed)
    var month = $("#event_month").val();
    var year = $("#event_year").val();
    var event_cat = $("#event_cat").val();
    $.ajax({
      type: "POST",
      url: events_archive_filter_obj.ajaxurl,
      data: {
        action: "past_event_filter",
        month: month,
        year: year,
        category: event_cat,
        // Add nonce here for security (if needed)
        // _wpnonce: your_nonce_variable,
      },
      beforeSend: function () {
        $("#eventpage_archive_events").html(
          '<span class="event_loader"></span>'
        );
      },
      success: function (result) {
        $("#eventpage_archive_events").html(result);
      },
      error: function (xhr, status, error) {
        console.log("AJAX request failed: ", status, error); // Log error if AJAX fails
      },
    });
  });
});
