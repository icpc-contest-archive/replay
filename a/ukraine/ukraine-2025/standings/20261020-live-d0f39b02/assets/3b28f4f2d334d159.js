$(document).ready(function () {
    var culture = $("html").attr("lang");
    moment.locale(culture);
    $("div.custom-text-" + culture).show();
    $("select").select2();
    $("input.custom-date").datetimepicker({ format: app.datetime.format.date, showTodayButton: true, locale: culture });
    $("input.custom-datetime").datetimepicker({ format: app.datetime.format.datetime, showTodayButton: true, locale: culture });
    $(".form-more-fields").click();
    app.initAceEditors()
    $("#CompilerId").on("select2:select", function(e) {
        var $editors = $("div.ace-editor");
        if (typeof editorModeByCompilerId !== 'undefined' && typeof fileExtensionByCompilerId !== 'undefined') {
            var aceMode = editorModeByCompilerId[e.params.data.id];
            var languageExtension = fileExtensionByCompilerId[e.params.data.id];
            if ($("#FileName").length) {
                // There is filed with id=FileName, updating the file extension
                var filename = $("#FileName").val();
                var pos = filename.lastIndexOf(".");
                filename = filename.substr(0, pos < 0 ? filename.length : pos) + "." + languageExtension;
                $("#FileName").val(filename);
            }
            if ($editors.length > 0) {
                // There is ace editor on the page, updating mode
                var editor = $editors[0];
                var aceEditor = ace.edit(editor);
                aceEditor.getSession().setMode("ace/mode/" + aceMode);
            }
        }
    });
    $("input.ace-editor").each(function (index, value) {
        var input = $(this);
        var div = $("<div>", { "class": input.attr("class") }).insertBefore(input);
        var editor = ace.edit(div[0]);
        editor.setShowPrintMargin(false);
        var aceMode = input.data("ace-mode");
        if (aceMode) editor.getSession().setMode("ace/mode/" + aceMode);
        editor.getSession().setValue(input.val());
        input.closest("form").submit(function() {
            input.val(editor.getSession().getValue());
        });
    });
    $(".contest-timer").each(function (index, value) {
        app.datetime.countdown($(value));
    });
    $(".date-from-now").each(function (index, value) {
        app.datetime.fromNow($(value));
    });
    $('form').submit(function (e) {
        if (!e.defaultPrevented && (e.originalEvent == null || !e.originalEvent.defaultPrevented)) $(this).find(':submit').attr('disabled', 'disabled');
    });
    $('input#liqpay-button').click(function() {
        if($('form#data-form').valid()) {
            $('form#data-form').submit();
        }
        else {
            return false;
        }
    });
    $('form#data-form').on("submit", function(event) {
        event.preventDefault();
        $('input#liqpay-button').attr('disabled', 'disabled');
        $.post($(this).attr('action'), $(this).serialize())
            .done(function(data){ 
                $('form#liqpay-form input[name="data"]').val(data['data']);
                $('form#liqpay-form input[name="signature"]').val(data['signature']);
                $('form#liqpay-form').submit();
            })
            .fail(function(data) { 
                $('form#data-form').validate().showErrors(data.responseJSON.errors);
            })
            .always(function() { 
                $('input#liqpay-button').removeAttr('disabled'); 
            });
    });
    $('form#data-form button.lucky-number-button').click(function() {
        $('form#data-form input#Amount').val($(this).text());
    });
    $('input#test-run-button').click(function() {
        if($('form#solution-submission-form').valid() && $('form#test-run-form').valid()) {
            $('form#test-run-form').submit();
        }
        else {
            return false;
        }
    });
    $('form#test-run-form').on("submit", function(event) {
        event.preventDefault();
        $('input#test-run-button').attr('disabled', 'disabled');
        $('span#test-run-spinner').css("visibility", "visible");
        $('form#solution-submission-form input#File').prev().each(function(){
            $('form#solution-submission-form input#File').val(ace.edit(this).getSession().getValue());
        });
        $.post($(this).attr('action'), $('form#solution-submission-form, form#test-run-form').serialize())
            .done(function(data){
                $('form#test-run-form div[name="CompilerOutput"]').each(function(){
                    ace.edit(this).getSession().setValue(data.compilerOutput);
                });
                $('form#test-run-form div[name="Output"]').each(function(){
                    ace.edit(this).getSession().setValue(data.output);
                });
                $('form#test-run-form div[name="Error"]').each(function(){
                    ace.edit(this).getSession().setValue(data.error);
                });
                $('form#test-run-form dd#test-run-verdict').text(data.verdict);
                $('form#test-run-form dd#test-run-time').text(data.time);
                $('form#test-run-form dd#test-run-memory').text(data.memory);
                $('form#test-run-form div#test-run-result').css("visibility", "visible");
            })
            .fail(function(data) { 
                $('form#solution-submission-form').validate().showErrors(data.responseJSON.errors);;
            })
            .always(function() { 
                $('span#test-run-spinner').css("visibility", "hidden");
                $('input#test-run-button').removeAttr('disabled'); 
            });
    });
    $('form#test-run-form a[data-toggle="tab"]').on('shown.bs.tab', function(e){
        $('form#test-run-form .tab-pane.active div.ace-editor').each(function(){
            ace.edit(this).resize();
        });
    });
    if ($.isArray(app.notice.data)) {
        app.notice.data.forEach(app.notice.alert);
    }

    if (window.contestresulturl != null) {
        $.getJSON(decodeURIComponent(window.contestresulturl), function (response) {
            app.contestresult = response;
        });
        app.current = {};
        $('.content').click(app.table.onaction);
        $(window).keypress(function(e) {
            if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                app.table.onaction();
            }
        });

        $('#Contest-ListInteractiveScoreboard').bootstrapTable('refreshOptions', {
            rowStyle: function (row, index) {
                var type = row["RowHighlightType"];
                if (type == null) return { classes: 'default'}; 
                return { classes: type };
            }
        });
    }

    if (window.location.hash.length > 0)
    {
        $('a[href="' + window.location.hash + '"]').trigger("click");
    }

    function copyToClipboard(item_id, success_val) {
        const copyText = document.getElementById(item_id).innerHTML;
        const textArea = document.createElement('textarea');
        textArea.style.display = 'hidden';
        textArea.textContent = copyText;
        document.body.append(textArea);
        textArea.select();
        document.execCommand("copy");
        const old_val = document.getElementById('cp_' + item_id).innerHTML;
        if (success_val !== undefined) {
            document.getElementById('cp_' + item_id).innerHTML = success_val;
            setTimeout(function() {
                document.getElementById('cp_' + item_id).innerHTML = old_val;
            }, 1000);
        }
        document.body.removeChild(textArea);
    }

    $('body').on('click', '.btn-copy', function(el) {
        var $el = $(el.currentTarget);
        target_id = $el.data('target');
        copyToClipboard(target_id, $el.data('success'));
    });

    $('input[type=radio][name=statement]').change(function() {
        let checked = $(this).prop('checked')
        let cur_tab = $(this).prop('value')
        let id = $(this).data('id')
        if (checked) {
            if (id == null) {
                $('#block-pdf').hide();
                $('#block-html').hide();
                $('#block-' + cur_tab).show()
            } else {
                $(`#block-pdf-${id}`).hide();
                $(`#block-html-${id}`).hide();
                $(`#block-${cur_tab}-${id}`).show()
            }
        }
    });

    $('input[type=radio][name=editor]').change(function(e) {
        if ($(this).data().href != null) {
            window.location.href = $(this).data().href
        }
    });

    $('.sidebar-toggle').click(function(event) {
        event.preventDefault();
        var body = $('body');
        var collapsed = !body.hasClass('sidebar-collapse')

        Cookies.set('sidebarCollapsed', collapsed.toString());
    });

    $('.bootstrap-table .fixed-table-body table').each(function(i, t) {
        var table = $(t);
        
        var tabPane = table.parents('.tab-content .tab-pane')
        var isInTab = table.parents('.tab-content .tab-pane').length > 0
        var isInActiveTab = table.parents('.tab-content .tab-pane.active').length > 0
        var url = table.bootstrapTable('getOptions').urlCopy

        table.on('refresh.bs.table', function(e) {
            var refreshButton = $(this).parents('.bootstrap-table').find("button[name='refresh']")

            refreshButton.attr('disabled', true);
            setTimeout(function() {
                refreshButton.removeAttr('disabled'); 
            }, 2000);
        })

        if (isInTab && MutationObserver != null) {
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function(mutation) {
                    if ((mutation.attributeName === 'style' || mutation.attributeName === 'class') && window.getComputedStyle(tabPane[0]).getPropertyValue('display') !== 'none') {
                        if (table.bootstrapTable('getOptions').url == null) {
                            table.bootstrapTable('refreshOptions', {
                                url: url
                            })
                        }
                    }
                });
            });
    
            observer.observe(tabPane[0], { attributes: true })
        }

        if (!isInTab || isInActiveTab || MutationObserver == null) {
            table.bootstrapTable('refreshOptions', {
                url: url
            })
        }
    })

    $('[data-utcdate]').each(function () {
        var d = moment.utc($(this).data('utcdate'));
        $(this).html(app.table.formatter.date.withTime(d.local()));
    });

    $('.custom-datetime').each(function () {
        if ($(this).val() == '') return
        var d = moment.utc($(this).val());
        $(this).val(d.local().format());
    });

    $('#toggleProblemTags').change(function() {
        Cookies.set('hideProblemTags', (this.checked == true).toString());
        window.location.reload();
    })

    //----//

    const connection = new signalR.HubConnectionBuilder()
        .withUrl("/notificationhub")
        .configureLogging(signalR.LogLevel.Error)
        .build();

    async function start() {
        try {
            await connection.start();
            // console.log("SignalR Connected.");
        } catch (err) {
            console.log(err);
            setTimeout(start, 5000);
        }
    };

    // connection.onclose(async () => await start());

    connection.on("clarification", function (x) {
        x = JSON.parse(x)
        app.notice.notifyClarification(x)
    });

    connection.on("closeNotice", function(x) {
        app.notice.closeNotice(x)
    });

    connection.on("viewNotice", function(x) {
        app.notice.alert(JSON.parse(x))
    });

    connection.on("statusUpdate", function(x) {
        app.notice.notifyStatusUpdate(JSON.parse(x))
    });

    connection.on("refreshTable", function(x) {
        x = JSON.parse(x)
        if (($("#" + x.Text)).length > 0)
        {
            $("button[name='refresh']").click();
        }
    });

    // Check if there are any Ace editors with the class 'confirmation-required-editor'
    if ($("div.confirmation-required-editor").length > 0) {
        var editorStates = {}; // Track unsaved changes for each editor
        // Initialize editors only if there are any to track
        $("div.confirmation-required-editor").each(function() {
            var editor = ace.edit(this); // Get the initialized Ace editor instance
            var editorId = $(this).attr('id') || 'editor_' + Math.random().toString(36).substr(2, 9); // Generate an ID if none exists
            $(this).attr('id', editorId); // Assign ID if not present

            // Set initial state as saved
            editorStates[editorId] = true;

            // Mark as unsaved when content changes
            editor.session.on('change', function() {
                editorStates[editorId] = false;
            });
        });

        // Handle the submit button (save all data)
        $("form input[type='submit']").on("click", function(event) {
            // Mark all editors as saved before submitting
            Object.keys(editorStates).forEach(id => editorStates[id] = true);
        });

        // Warn user before leaving if there are unsaved changes
        $(window).on("beforeunload", function(event) {
            if (Object.values(editorStates).includes(false)) {
                event.preventDefault();
                return "You have unsaved changes. Are you sure you want to leave?";
            }
        });
    }


    // Start the connection.
    start();

});

var supported_locales = ["en", "uk"];

function getLang()
{
    var url = new URL(document.location.href).pathname.split('/');
    // It could be either /{locale}/... or /{event}/{locale}
    for (var url_index = 1; url_index <= 2; ++url_index) {
        var locale = url[url_index];
        if (supported_locales.includes(locale))
            return locale;
    }
    return supported_locales[0];
}

$('form').submit(function() {
    $('.custom-datetime').each(function () {
        if ($(this).val().replace(/\s/g, '').length == 0) return
        var d = moment($(this).val());
        $(this).val(d.utc().format());
    });
    return true;
  });
// Submissions chart
$(document).ready(function () {
  if ($("#submissions-chart").length == 0) {
    return
  }

  var defaultStart = moment().add(-90, 'days')
  var defaultEnd = moment()

  var submissionsChart = new SubmissionsChart($("#submissions-chart"))
  submissionsChart.show(defaultStart, defaultEnd)

  $("#submissions-chart-date-picker").daterangepicker({
    startDate: defaultStart,
    endDate: defaultEnd,
    ranges: {
      'Last Week': [moment().subtract(7, 'days'), moment()],
      'Last 30 Days': [moment().subtract(30, 'days'), moment()],
      'Last 90 Days': [moment().subtract(90, 'days'), moment()],
      'Last 180 Days': [moment().subtract(180, 'days'), moment()],
      'Last Year': [moment().subtract(1, 'year'), moment()],
      'Last 4 Years': [moment().subtract(4, 'year'), moment()],
      'Last 7 Years': [moment().subtract(7, 'year'), moment()]
    }
  }, function (start, end) {
    submissionsChart.show(moment(start), moment(end))
  });
})
// Contests chart
$(document).ready(function () {
  if ($("#contests-chart").length == 0) {
    return
  }

  var defaultStart = moment().add(-1, 'year')
  var defaultEnd = moment()

  var contestsChart = new ContestsChart($("#contests-chart"))
  contestsChart.show(defaultStart, defaultEnd)

  $("#contests-chart-date-picker").daterangepicker({
    startDate: defaultStart,
    endDate: defaultEnd,
    ranges: {
      'Last Year': [moment().subtract(1, 'year'), moment()],
      'Last 4 Years': [moment().subtract(4, 'year'), moment()],
      'Last 7 Years': [moment().subtract(7, 'year'), moment()]
    }
  }, function(start, end) {
    contestsChart.show(moment(start), moment(end))
  });
})
var app = {
    initAceEditors: function()
    {
        ace.config.set("basePath", "/js/ace/");
        $("div.ace-editor").each(function(index, value) {
            var editor = ace.edit(this);
            editor.setReadOnly(true);
            editor.setShowPrintMargin(false);
            var aceMode = $(this).data("ace-mode");
            if(aceMode) editor.getSession().setMode("ace/mode/" + aceMode);
        });
    },
    rebuildProblemOnPage: function(title, postAction, id)
    {
        app.notice.confirm({ Title: title, Text:""}, function () {
            app.ajax(postAction, JSON.stringify([id]), function (response) {
                if (response) {
                    app.notice.alertMany(response.Notices);
                }

                function displayStatus(state, type, text)
                {
                    if (text === undefined) text = '';

                    var status;
                    if (state === undefined || tests === undefined)
                    {
                        status = '';
                        state = '';
                    }
                    else status = state  + '\n\n' + text;

                    $('#result').html(`<div class="ace-editor embed-responsive-16by9">${status}</div>`)
                    app.initAceEditors();

                    $('#problem-status').html(state);
                    $('#problem-status').attr('class', `text-${type}`);
                }

                $("#results").trigger("click");
                app.displayProblemRebuildStatus = displayStatus;
            });
        })
    },
    rebuildArticleOnPage: function (title, postAction, id)
    {
        app.notice.confirm({ Title: title, Text:""}, function () {
            app.ajax(postAction, JSON.stringify([id]), function (response) {
                if (response) {
                    app.notice.alertMany(response.Notices);
                }
            });
        });
    },
    ajax: function (url, data, func) {
        $.ajax({
            url: url,
            data: data,
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: func
        });
    },
    notice: {
        stack_topright: { "dir1": "down", "dir2": "left" },
        stack_bottomright: { "dir1": "up", "dir2": "left" },
        stack_bottomleft: { "dir1": "up", "dir2": "right" },
        notices: {},
        closeNotice: function(noticeKey) {
            if (app.notice.notices[noticeKey] != null)
            {
                app.notice.notices[noticeKey].options.after_close = null;
                app.notice.notices[noticeKey].remove();
                delete app.notice.notices[noticeKey];
            }
        },
        expireNotice: function(n, noticeKey, expirationDate) {
            if (expirationDate != null)
            {
                setTimeout(function() {
                    if (n != null)
                    {
                        n.options.after_close = null;
                        n.remove();
                        if (app.notice.notices[noticeKey] == n) delete app.notice.notices[noticeKey];
                    }
                }, moment(expirationDate).local().diff(moment()));
            }
        },
        options: function (notice) {
            return {
                title: notice.Title,
                text: notice.Text,
                type: notice.Type,
                auto_display: false,
                styling: "fontawesome",
                addclass: "stack-bottomright",
                stack: app.notice.stack_bottomright,
                history: {
                    history: false
                },
                buttons: {
                    sticker: false,
                    labels: false
                }
            };
        },
        alert: function (notice) {
            var alert = new PNotify(app.notice.options(notice));
            alert.open();
        },
        notifyClarification: function (notice) {
            if (notice.Key in app.notice.notices) app.notice.closeNotice(notice.Key);
            options = app.notice.options(notice);
            options.title = '<a href="/' + getLang() + notice.Url + '" onclick="app.notice.notices[\'' + notice.Key + '\'].options.after_close()">' + options.title + '</a>'
            options.text = '<a href="/' + getLang()  + notice.Url + '" onclick="app.notice.notices[\'' + notice.Key + '\'].options.after_close()">' + options.text + '</a>'
            options.hide = false;
            options.stack = app.notice.stack_bottomleft
            options.addclass = 'stack-bottomleft'
            options.width = '500px'
            options.icon = false
            options.styling = "brighttheme";
            options.type = 'notice'
            options.confirm = {
                confirm: true,
                buttons: [
                    {
                        text: 'OK',
                        click: function(n, v) {
                            n.remove()
                        }
                    },
                    null
                ]
            }
            options.after_close = function(n) {
                app.ajax(
                    '/en/Notifications/CloseNotice?noticeKey=' + notice.Key,
                    null, 
                    null
                )
            }
            var n = new PNotify(options);
            n.open();
            app.notice.notices[notice.Key] = n;
        },
        notifyStatusUpdate: function(notice) {
            if (!(notice.Key in app.notice.notices))
            {
                options = app.notice.options(notice);
                options.hide = false;
                options.width = '500px'
                options.icon = false
                options.styling = "brighttheme";
                options.type = 'notice'
                options.title = options.title
                options.text = '<span class="notice-inner-text"></span><span class="glyphicon glyphicon-refresh spinner"></span>'
                
                options.after_close = function(n) {
                    app.ajax(
                        '/en/Notifications/CloseNotice?noticeKey=' + notice.Key,
                        null, 
                        null
                    )
                }

                var n = new PNotify(options);
                n.open();
                app.notice.notices[notice.Key] = n;
            }

            var n = app.notice.notices[notice.Key];
            var text = JSON.parse(notice.Text)
            if (text.IsCompleted == false)
            {
                n.text_container.find('.notice-inner-text').html("<strong class='text-" + text.ElementType + "'>" + text.Text + "</strong> ");
            }
            else
            {
                n.text_container.html("<a href = '" + text.Link + "'><strong class='text-" + text.ElementType + "'>" + text.Text + "</strong></a>");
                $("button[name='refresh']").click();
            }
            
            if (app.displayProblemRebuildStatus != null && text.ProblemResult != null)
            {
                app.displayProblemRebuildStatus(text.Text, text.ElementType, text.ProblemResult);
            }
            
            this.expireNotice(n, notice.Key, notice.ExpirationDate);
        },
        alertMany: function (notices) {
            if (notices && $.isArray(notices)) {
                notices.forEach(this.alert);
            }
        },
        confirm: function (notice, func) {
            var options = this.options(notice);
            options.hide = false;
            options.styling = "brighttheme";
            options.addclass = "stack-topright";
            options.stack = app.notice.stack_topright;
            options.confirm = {
                confirm: true,
                buttons: [
                {
                    text: null,
                    addClass: "fa fa-check"
                },
                {
                    text: null,
                    addClass: "fa fa-close"
                }]
            };
            var dialog = new PNotify(options);
            dialog.get().on("pnotify.confirm", func);
            dialog.open();
        }
    },
    datetime: {
        sleep: function(time) {
            return new Promise(function(resolve) { setTimeout(resolve, time) });
        },
        format: {
            date: "YYYY-MM-DD",
            datetime: "YYYY-MM-DDTHH:mm"
        },
        toTwoLetterString: function (value) {
            if (value < 10) return "0" + value;
            return "" + value;
        },
        msToString: function (value, showSeconds) {
            var duration = moment.duration(value);
            var result = Math.floor(duration.asHours())
                + ":" + this.toTwoLetterString(duration.minutes());
            if(showSeconds)
                result += ":" + this.toTwoLetterString(duration.seconds());
            return result;
        },
        countdown: function (value) {
            var durationMs = JSON.parse(value.data("milliseconds"));
            var duration = moment.duration(durationMs);
            var now = moment();
            var time = moment().add(duration);
            if (time.isSameOrBefore(now) || duration.asDays() > 2) return null;
            var timer = setInterval(function () {
                now = moment();
                if (now.isSameOrAfter(time)) {
                    clearInterval(timer);
                } else {
                    value.html(app.datetime.msToString(time.diff(now), true));
                }
            }, 500);
            return null;
        },
        fromNow: function (value) {
            var durationMs = JSON.parse(value.data("milliseconds"));
            var duration = moment.duration(durationMs);
            var time = moment().add(duration);
            value.html(time.fromNow());
            value.attr('title', app.table.formatter.date.withTime(time));
            return null;
        }
},
    table: {
        formatter: {
            empty: function (value, row, index) {
                return "";
            },
            scoreboard: {
                icpc: function (row, id) {
                    var data = row["Results"][id];
                    if (!data) return "";
                    if (!data.IsAccepted && data.Attempts === 0 && data.PendingAttempts === 0) return "";
                    var type = data.ElementType;
                    var isPending = data.PendingAttempts !== 0;
                    var result = type == null ? "<div class='text-" + (data.IsAccepted ? "success" : (isPending ? "primary" : "danger")) + "'>" : "<div>";
                    result += "<div class='no-wrap-text'>"
                    result += "<span class='fa fa-lg " + (data.IsAccepted ? "fa-check" : (isPending ? "fa-question" : "fa-times")) + "'></span>";
                    if (isPending)
                    {
                            result += "<br/><strong><small>" + data.Attempts + "&nbsp;+&nbsp;" + data.PendingAttempts + "</small></strong>";
                    }
                    else if (data.Attempts !== 0) result += "&nbsp;<strong>" + data.Attempts + "</strong>";
                    result += "</div>"
                    result += "</div><div><small>";
                    result += isPending ? "" : app.datetime.msToString(data.LastImprovementMs, false);
                    result += "</small></div>";
                    if(type != null) result = "<div class='" + type + "'>" + result + "</div>";
                    return result;
                },
                general: function (row, id) {
                    var data = row["Results"][id];
                    if (!data) return "";
                    if (!data.IsAccepted && data.Attempts === 0 && data.PendingAttempts === 0) return "";
                    var result = "<div class='text-" + (data.IsAccepted ? "success" : (data.PendingAttempts !== 0 ? "primary" : "danger")) + "'><strong><big>";
                    result += data.Score;
                    result += "</big></strong></div><div><small>";
                    result += app.datetime.msToString(data.LastImprovementMs, false);
                    result += "</small></div>";
                    return result;
                },
                generalIcpc: function(row, id) {
                    var data = row["Results"][id];
                    if (!data) return "";
                    if (!data.IsAccepted && data.Attempts === 0 && data.PendingAttempts === 0) return "";
                    var type = data.ElementType;
                    var isPending = data.PendingAttempts !== 0;
                    var result = type == null ? "<div class='text-" + (data.IsAccepted ? "success" : (isPending ? "primary" : "danger")) + "'>" : "<div>";
                    result += "<div class='no-wrap-text'>"
                    if (data.IsAccepted) result += '<strong><big>' + data.Score + '</big></strong>'
                    else result += "<span class='fa fa-lg " + (isPending ? "fa-question" : "fa-times") + "'></span>";
                    if (isPending)
                    {
                        result += "<br/><strong><small>" + data.Attempts + "&nbsp;+&nbsp;" + data.PendingAttempts + "</small></strong>";
                    }
                    else if (data.Attempts !== 0 && !data.IsAccepted) result += "&nbsp;<strong>" + data.Attempts + "</strong>";
                    result += "</div>"
                    result += "</div><div><small>";
                    result += isPending ? "" : app.datetime.msToString(data.LastImprovementMs, false);
                    if (data.IsAccepted && data.Attempts > 0) result += '&nbsp;(' + data.Attempts + ')';
                    result += "</small></div>";
                    if(type != null) result = "<div class='" + type + "'>" + result + "</div>";
                    return result;
                },
                penalty: function(value, row, index) {
                    return app.datetime.msToString(value, true);
                },
                contestant: function (value, row, index) {
                    if (value == null) return null;
                    var type = row["ElementType"];
                    if (type == null) type = "primary";
                    var span = $("<span>");
                    span.append($("<a>", {
                        href: value.Url == null ? "#" : value.Url,
                        class: "text-bold text-" + type,
                        text: value.Text
                    }));
                    var group = row["Group"];
                    if (group != null && group.Url != null) span.append($("<img>", {
                        class: "pull-right",
                        width: 20,
                        src: group.Url
                    }));
                    group = row["GroupEx"];
                    if (group != null && group.Url != null) span.append($("<img>", {
                        class: "pull-right",
                        width: 20,
                        src: group.Url
                    }));
                    return span.html();
                },
                contestantGroup: function (value, row, index) {
                    if (value == null) return null;
                    if (value.ChildLink != null)
                        return "<a href='" + value.ChildLink.Url + "'>" + value.Text + "</a>";
                    return value.Text;
                },
                row: function (row, index) {
                    if (row["IsCurrentUser"] && row["IsUnofficial"]) return {
                        classes: "selected unofficial-opacity"
                    }
                    if (row["IsCurrentUser"]) return {
                        classes: "selected"
                    }
                    if (row["IsUnofficial"]) return {
                        classes: "unofficial-opacity"
                    };
                    return {};
                },
                summaryFooter: function(data, value) {
                    if (value == undefined || value.AcceptedCount == undefined || value.SubmitsCount == undefined) return "";
                    return "" + value.AcceptedCount + "/" + value.SubmitsCount;
                },
                cellStyle: function(row, id) {
                    var data = row["Results"][id];
                    if (!data) return {};
                    if (data.IsFirstAccepted) return { classes: 'first-accepted' }
                    return {}
                }
            },
            contest: {
                contestantGroup: function (value, row, index) {
                    if (value == null) return null;
                    var span = $("<span>");
                    span.append($("<span>", {
                        text: value.Text
                    }));
                    if (value.Url != null) span.append($("<img>", {
                        class: "pull-right",
                        width: 20,
                        src: value.Url
                    }));
                    return span.html();
                }
            },
            action: {
                dropdown: function (value, row, index) {
                    var actions = row["Actions"];
                    if (!actions || !$.isArray(actions) || actions.length <= 0)
                        return value;
                    if (actions.length === 1) {
                        return "<a href='" + actions[0].Url + "'>" + value + "</a>";
                    }
                    var res = "<div class='dropdown'>"
                        + "<a data-target='#' href='#' data-toggle='dropdown' role='button'>"
                        + value
                        + "</a>"
                        + "<ul class='dropdown-menu'>";

                    actions.forEach(function(action) {
                        res += "<li><a href='" + action.Url + "'>" + action.Text + "</a></li>";
                    });

                    res += "</ul>"
                        + "</div>";

                    return res;
                },
                list: function(value, row, index) {
                    var actions = value;
                    if (!actions || !$.isArray(actions) || actions.length <= 0)
                        return "";
                    var res = "";
                    actions.forEach(function (action) {
                        if (res !== "") {
                            res += "<span> | </span>";
                        }
                        res += "<a href='" + action.Url + "'>" + action.Text + "</a>";
                    });
                    return res;
                }
            },
            boolean: {
                icon: function (value, row, index) {
                    if (value === true) return "<span class='fa fa-lg fa-check text-success'><span>";
                    if (value === false) return "<span class='fa fa-lg fa-times text-danger'><span>";
                    return null;
                }
            },
            double: {
                fixed2: function (value, row, index) {
                    if (value == null) return value;
                    return Number(value).toFixed(2);
                },
                fixed3: function (value, row, index) {
                    if (value == null) return value;
                    return Number(value).toFixed(3);
                }
            },
            integer: {
                localeString: function(value, row, index) {
                    if (value == null) return value;
                    return Number(value).toLocaleString();
                },
                thousands: function(value, row, index) {
                    if (value == null) return value;
                    value += '';
                    var rgx = /(\d+)(\d{3})/;
                    while (rgx.test(value)) value = value.replace(rgx, '$1' + '&nbsp;&nbsp;' + '$2');
                    return "<strong>" + value + "</strong>";
                }
            },
            url: function (value, row, index) {
                if (value == null) return null;
                if (value.ChildLink == null) return value.Url == null ? value.Text 
                    : ("<a href='" + value.Url + (value.OpenInNewTab === true ? "' target='_blank'>" : "'>") + value.Text + "</a>");
                var link = value.ChildLink;
                var res = app.table.formatter.elementtype(value.Text, row, index);
                if(link.Url != null) res += "<a href='" + link.Url + "' class='pull-right' target='_blank'><span class='" + link.Text + "'></span></a>";
                return res;
            },
            strong: function(value, row, index) {
                return ("<strong>" + value + "</strong>");
            },
            date: {
                fromNow: function(value, row, index) {
                    return "<span title='" + app.table.formatter.date.withTime(value) +"'>" +  moment(value).fromNow() + "</span>";
                },
                calendar: function (value, row, index) {
                    return value ? moment(value).calendar() : value;
                },
                regular: function (value, row, index) {
                    return value ? moment(value).format("L") : value;
                },
                withMonthName: function (value, row, index) {
                    return value ? moment(value).format("LL") : value;
                },
                withTime: function (value, row, index) {
                    return value ? moment(value).format("LLL") : value;
                },
                countdown: function(value, row, index) {
                    var when = moment(value);
                    var now = moment(row["Now"]);
                    var duration = moment.duration(when.diff(now));
                    if (when.isSameOrBefore(now) || duration.asDays() > 2) return app.table.formatter.date.fromNow(value, row, index);
                    var id = "timer-" + Math.floor(Math.random() * 1e9);
                    when = moment().add(duration);
                    var timer = setInterval(function() {
                        now = moment();
                        if (now.isSameOrAfter(when)) {
                            clearInterval(timer);
                        } else {
                            $("#" + id).html(app.datetime.msToString(when.diff(now), true));
                        }
                    }, 500);
                    return "<span id='" + id + "'></span>";
                }
            },
            nameWithTags: function (value) {
                if (value == null) {
                    return null;
                }

                return `<span><a href="${value.Name.Url}">${value.Name.Text}</a> ${ Cookies.get('hideProblemTags') == 'true' ? '' :  `<span class="pull-right">${value.Tags.map(t => {
                    return `<a href="${t.Link}"><span title="${t.Tooltip || ''}" class="problem-tag label label-${t.Category == null ? 'default' : t.Category.ElementType}">${t.Name}</span></a>`
                }).join('')}</span></span>`}`;
            },
            elementtype: function(value, row, index) {
                if (value == null) return null;
                var type = row["ElementType"];
                if (type == null) return value;
                return "<strong class='text-" + type + "'>" + value + "</strong>";
            }
        },
        getTable: function(id) {
            return $("#" + id);
        },
        getSelection: function (id) {
            return $.map(this.getTable(id).bootstrapTable("getSelections"), function(row) {
                return parseInt(row.Id);
            });
        },
        action: function (id, url, title, text) {
            var ids = this.getSelection(id);
            if ($.isArray(ids) && ids.length > 0) {
                app.notice.confirm({ Title: title + "?", Text: text + ": " + ids.length }, function () {
                    app.ajax(url, JSON.stringify(ids), function (response) {
                        if (response) {
                            app.notice.alertMany(response.Notices);
                            if (response.Success === true) {
                                app.table.getTable(id).bootstrapTable("refresh");
                            }
                        }
                    });
                });
            }
        },
        checkRowsAt: function (data, a, b) {
            if (a < 0 || data.length <= a) return false;
            if (b < 0 || data.length <= b) return false;
            if (data[a].Score < data[b].Score || (data[a].Score === data[b].Score && data[a].PenaltyMs >= data[b].PenaltyMs)) return false;
            return true;
        },
        updateRow: function (current, data, btable, timeout) {
            if (current.index === 0 || app.table.checkRowsAt(data, current.index, current.index - 1) === false) {
                current.lock = false;
                return;
            };
            app.datetime.sleep(timeout).then(function() {
                var tmp = data[current.index].Rank;
                data[current.index].Rank = data[current.index - 1].Rank;
                data[current.index - 1].Rank = tmp;
                tmp = data[current.index];
                data[current.index] = data[current.index - 1];
                data[current.index - 1] = tmp;
                btable.bootstrapTable('updateRow', { index: current.index, row: data[current.index] });
                btable.bootstrapTable('updateRow', { index: current.index - 1, row: data[current.index - 1] });
                --current.index;
                app.table.updateRow(current, data, btable, timeout * 0.74);
            });
        },
        updateKey: function (current, data) {
            current.key = null;
            if (current.index === -1) return;
            var row = data[current.index];
            $.each(row.Results, function (key, result) {
                if (result.PendingAttempts > 0)
                    if (current.key == null || result.Final.LastEffectiveSubmissionMs < row.Results[current.key].Final.LastEffectiveSubmissionMs)
                        current.key = key;
            });
        },
        updateCurrent: function (current, data, btable) {
            if (current.index === -1) return false;
            var prev = JSON.parse(JSON.stringify(current));
            var row;
            if (prev.key == null) {
                current.index = data.length - 1;
                while (current.index !== -1 && data[current.index].final === true)--current.index;
                app.table.updateKey(current, data);
                if (current.key != null) 
                {
                    data[current.index].Results[current.key].ElementType = 'bg-black';
                    data[current.index].RowHighlightType = 'scoreboard-animated-row-pending';
                }
                else if(current.index !== -1)
                {
                    data[current.index].final = true;
                    data[current.index].RowHighlightType = 'scoreboard-animated-row-final';
                }
                if (prev.index !== current.index && prev.index !== data.length) {
                    row = data[prev.index];
                    row.RowHighlightType = row.final === true ? 'bg-success' : null;
                    btable.bootstrapTable('updateRow', { index: prev.index, row: row });
                }
                if (current.index !== -1) btable.bootstrapTable('updateRow', { index: current.index, row: data[current.index] });
                return false;
            }

            row = data[prev.index];
            var r = row.Results[prev.key];
            var hasImprovement = r.Final.Score !== r.Score || r.Final.PenaltyMs !== r.PenaltyMs;
            row.Score = row.Score + r.Final.Score - r.Score;
            row.PenaltyMs = row.PenaltyMs + r.Final.PenaltyMs - r.PenaltyMs;
            row.Results[prev.key] = r.Final;
            current.key = null;
            if (app.table.checkRowsAt(data, prev.index, prev.index - 1) === false) {
                if (current.key) data[current.index].Results[current.key].ElementType = 'bg-black';
                row.RowHighlightType = hasImprovement ? 'scoreboard-animated-row-success' : 'scoreboard-animated-row-danger';
                btable.bootstrapTable('updateRow', { index: current.index, row: data[current.index] });
                return false;
            }

            row.RowHighlightType = 'scoreboard-animated-row-success';
            btable.bootstrapTable('updateRow', { index: current.index, row: row });
            app.table.updateRow(current, data, btable, 474);
            return true;
        },
        onaction: function () {
            if (app.current.lock === true) return;
            app.current.lock = true;
            var btable = $('#Contest-ListInteractiveScoreboard');
            var data = btable.bootstrapTable('getData');
            var rowsToUpdate = []
            if (app.current.index == null) {
                $.each(data, function(index, item){
                    $.each(item.Results, function (k, value) {
                        value.Final = null;
                        $.each(app.contestresult.rows, function (j, innerItem) {
                            if (item.Id === innerItem.Id) value.Final = innerItem.Results[k];
                        });
                    });
                    item.Rank = index + 1;
                    item.RowHighlightType = null;
                    rowsToUpdate.push({ index: index, row: item })
                });
                btable.bootstrapTable('updateRow', rowsToUpdate);
                app.current.index = data.length;
                app.current.key = null;
            }
            app.current.lock = app.table.updateCurrent(app.current, data, btable);
        }
    }
}
