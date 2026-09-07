$(document).ready(function () {
    var culture = $("html").attr("lang");
    moment.locale(culture);

    $("select").select2();
    $("input.custom-date").datetimepicker({ format: app.datetime.format.date, showTodayButton: true, locale: culture });
    $("input.custom-datetime").datetimepicker({ format: app.datetime.format.datetime, showTodayButton: true, locale: culture });
    $("div.ace-editor").each(function(index, value) {
        var editor = ace.edit(this);
        editor.setReadOnly(true);
        editor.setShowPrintMargin(false);
        var aceMode = $(this).data("ace-mode");
        if(aceMode) editor.getSession().setMode("ace/mode/" + aceMode);
    });
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
    $("button[name='refresh']").click(function(){
        var btn = $(this);
        btn.attr('disabled', true);
        setTimeout(function(){ 
            btn.removeAttr('disabled'); 
        },2000);
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

        $('#Contest-ListScoreboard').bootstrapTable('refreshOptions', {
          rowStyle: function (row, index) {
              var type = row["ElementType"];
              if (type == null) return { classes: 'default'}; 
              return { classes: type };
          }
        });
    }
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
  }, (start, end) => {
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
  }, (start, end) => {
    contestsChart.show(moment(start), moment(end))
  });
})
var app = {
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
            return new Promise((resolve) => setTimeout(resolve, time));
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
                    result += "<span class='fa fa-lg " + (data.IsAccepted ? "fa-check" : (isPending ? "fa-question" : "fa-times")) + "'></span>";
                    if (isPending) result += "<strong>&nbsp;" + data.PendingAttempts + "</strong>";
                    else if (data.Attempts !== 0) result += "<strong>&nbsp;" + data.Attempts + "</strong>";
                    result += "</div><div><small>";
                    result += isPending ? "--:--" : app.datetime.msToString(data.LastImprovementMs, false);
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
                penalty: function(value, row, index) {
                    return app.datetime.msToString(value, true);
                },
                contestant: function (value, row, index) {
                    if (value == null) return null;
                    var type = row["ElementType"];
                    if (type == null) type = "primary";
                    if (value.Url == null) return "<strong class='text-" + type + "'>" + value.Text + "</strong>";
                    return "<a href='" + value.Url + "' class='text-bold text-" + type + "'>" + value.Text + "<a>";
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
                return value == null ? null : (value.Url == null ? value.Text : ("<a href='" + value.Url + "'>" + value.Text + "</a>"));
            },
            strong: function(value, row, index) {
                return ("<strong>" + value + "</strong>");
            },
            date: {
                fromNow: function(value, row, index) {
                    return moment(value).fromNow();
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
            app.datetime.sleep(timeout).then(() => {
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
                    data[current.index].ElementType = 'scoreboard-animated-row-pending';
                }
                else if(current.index !== -1)
                {
                    data[current.index].final = true;
                    data[current.index].ElementType = 'scoreboard-animated-row-final';
                }
                if (prev.index !== current.index && prev.index !== data.length) {
                    row = data[prev.index];
                    row.ElementType = row.final === true ? 'bg-success' : null;
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
                row.ElementType = hasImprovement ? 'scoreboard-animated-row-success' : 'scoreboard-animated-row-danger';
                btable.bootstrapTable('updateRow', { index: current.index, row: data[current.index] });
                return false;
            }

            row.ElementType = 'scoreboard-animated-row-success';
            btable.bootstrapTable('updateRow', { index: current.index, row: row });
            app.table.updateRow(current, data, btable, 474);
            return true;
        },
        onaction: function () {
            if (app.current.lock === true) return;
            app.current.lock = true;
            var btable = $('#Contest-ListScoreboard');
            var data = btable.bootstrapTable('getData');
            if (app.current.index == null) {
                $.each(data, function(index, item){
                    $.each(item.Results, function (k, value) {
                        value.Final = null;
                        $.each(app.contestresult.rows, function (j, innerItem) {
                            if (item.Id === innerItem.Id) value.Final = innerItem.Results[k];
                        });
                    });
                    item.Rank = index + 1;
                    item.ElementType = null;
                    btable.bootstrapTable('updateRow', { index: index, row: item });
                });
                app.current.index = data.length;
                app.current.key = null;
            }
            app.current.lock = app.table.updateCurrent(app.current, data, btable);
        }
    }
}
