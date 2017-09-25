$(function () {
    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (!results) return null;
        else return results[1];

    };
    var pg = $.urlParam("page") || 1;
    $("#page" + pg).click(function () {
        return false;
    });
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
                            value: el._id,
                            tags: el.tags
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
        var sort = $.urlParam("sort") || $("#sort option:selected").val() || "dateAdded_-1";
        var newShow = Number($("#limit option:selected").val().trim());
        if (newShow != show) {
            window.location = window.location.pathname + "?page=" + page + "&show=" + newShow + "&sort=" + sort;
        }
    });
    $("#sort").change(function () {
        var page = $.urlParam("page") || 1;
        var newShow = Number($("#limit option:selected").text().trim());
        var sort = $("#sort option:selected").val();
        window.location = window.location.pathname + "?page=" + page + "&show=" + newShow + "&sort=" + sort;
    });


    $('a.back').click(function () {
        parent.history.back();
        return false;
    });
    $("#newSizeClass").click(function () {
        $(".size-zone").append("<div class='input-group' id='size_group'>" +
            "<div class='input-group-btn'>\n" +
            "<select class='btn btn-default btn-sm' required name='size_class' id='size_class'>\n" +
            "<option>Size</option>\n" +
            "<option value='small'>Small</option>\n" +
            "<option value='medium'>Medium</option>\n" +
            "<option value='large'>Large</option>" +
            "</select></div>" +
            "<input class='form-control' type='number' min='0' pattern='\d*' step='1' required name='size_qty' placeholder='Quantity' id='size_qty'><span class='input-group-btn' id='trash_it'><button class='btn btn-danger btn-sm' type='button' onclick='$(this).parents()[1].remove()'><i class='fa fa-trash-o'></i></button></span>"
            + "</div>");
    });

    $("#submitItem").click(function () {
        var form = $("#addItemForm");
        var sizes=[];
        var formData = {
            name: form.find("[name='name']").val(),
            price: form.find("[name='price']").val(),
            shortdes:form.find("[name='shortdes']").val(),
            description:form.find("[name='description']").val(),
            featured:form.find("[name='featured']:checked").val(),
            specifications:{}
        };

        $("div #size_group").each(function(i){
            sizes.push({
                class:$(this).find("select[name='size_class'] option:selected").val(),
                qty:$(this).find("input[name='size_qty']").val()
            });
        });
        formData.specifications.sizes=sizes;
        $.post("/sul",formData,function (result, status) {
            if(status === "success"){
                $(".alert-zone").html("<div class='alert alert-success alert-dismissable text-center'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>Successfully added item: <a class='alert-link'>"+result.name+"</a></div>");
                form.trigger("reset");
                $("div #size_group").remove();
            }


        });
    });
});