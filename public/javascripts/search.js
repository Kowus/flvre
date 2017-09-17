$(function () {
    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (!results) return null;
        else return results[1];

    };
    var pg = $.urlParam("page") || 1;
    $("#page"+pg).click(function () {return false;});
    $("#search-bar").autocomplete({
        classes: {
            "ui-autocomplete": "highlight text-capitalize"
        },
        source: function (request, response) {
            $.ajax({
                url: "/search_member",
                type: "GET",
                data: request,  // request is the value of search input
                success: function (data) {
                    // Map response values to fiedl label and value
                    response($.map(data, function (el) {
                        return {
                            label: el.name,
                            value: el._id
                        };
                    }));
                }
            });
        },

        // The minimum number of characters a user must type before a search is performed.
        minLength: 1,

        // set an onFocus event to show the result on input field when result is focused
        focus: function (event, ui) {
            this.value = ui.item.label;
            // Prevent other event from not being execute
            event.preventDefault();
        },
        select: function (event, ui) {
            // Prevent value from being put in the input:
            this.value = ui.item.label;
            // Set the id to the next input hidden field
            $(this).next("input").val(ui.item.value);
            // Prevent other event from not being execute
            window.location.replace("/products/id/" + ui.item.value);
            event.preventDefault();
            // optionnal: submit the form after field has been filled up
            $('#quicksearch').submit();
        }
    });

    $('.cbp-vm-options').click(function () {
        $('#myList, #myGrid').toggleClass('cbp-vm-selected');
    });
    $("#limit").change(function () {
        var page = $.urlParam("page") || 1;
        var show = $.urlParam("show") || 12;
        var sort = $.urlParam("sort") || "dateAdded:-1";
        var newShow = Number($("#limit option:selected").text().trim());
        if (newShow != show) {
            window.location =window.location.pathname + "?page=" + page + "&show=" + newShow+"&sort="+sort;
        }
    });
    $("#sort").change(function () {
        var page = $.urlParam("page") || 1;
        var newShow = Number($("#limit option:selected").text().trim());
        var sort = $("#sort option:selected").val();
        window.location =window.location.pathname + "?page=" + page + "&show=" + newShow+"&sort="+sort;
    })


});