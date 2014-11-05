// ==UserScript==
// @name        rm
// @namespace   rm
// @description rm agile extender
// @include     http://dev.citystar.ru:8080/projects/*/agile/*
// @version     1.1
// @grant       none
// ==/UserScript==

$(function () {
    $("body").append("<div id='context-menu' style='display:none;'></div>");
    $('.issue-card').each(function () {
        var id = parseInt($(this).attr("data-id"));
        $(this).addClass("hascontextmenu")
            .append("<div class='quick-view' data-load='/issues/" + id + " .description .wiki'>\
                <div class='quick-view-content'>загрузка...</div></div>\
            <div class='quick-view quick-view-comments' data-load='/issues/" + id + " #history'>\
                <div class='quick-view-content'>загрузка...</div></div>");
        
        if($(this).find('td.closed').length || $(this).find('td.todo').length){
            var v = $(this).find('.closed').length ? (parseInt($(this).find('.closed')[0].style.width) || 0) : 0;
            $(this).append("<div class='slider'></div>")
                .find('.slider').slider({
                    value: v,
                    min: 0,
                    max: 100,
                    step: 10,
                    range: "min",
                    change: function (event, ui) {
                        if (ui.value == v) return false;
                        $.post("/issues/bulk_update?back_url=/&ids[]=" + id + "&issue[done_ratio]=" + ui.value);
                    }
                });
        }
    });

    $('.quick-view').click(function () {
        if(!$(this).hasClass("ready")) {
            var content = $(this).find('.quick-view-content');
            $(this).addClass('ready');
            content.load($(this).attr("data-load"), function(data){
                content.append("<div class='quick-view-close'><img src='https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_close_48px-16.png'/></div>");
            });
        }
    });
    $('.quick-view').on("click", ".quick-view-close", function (event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).parent().parent().removeClass('ready');
        $(this).parent().html('загрузка...');
    });
    
    $('.quick-view-content').draggable({ });
    
    $('#content > h2').click(function () {
        $('#query_form_with_buttons').slideToggle(100);
    });

    // redmine context menu
    contextMenuInit('/issues/context_menu');

    // styles
    $('body').append("<style>\
.controller-agile_boards .ui-slider { margin:20px -6px -6px -6px; }\
.ui-slider .ui-slider-handle { \
    width:8px;height:8px;border-radius:50%;background:#cc9;box-shadow:0 0 0 2px #fff;\
    border:none;margin-left:-4px;margin-top:2px;display:none;cursor:pointer; \
}\
.ui-slider .ui-slider-handle:hover { transform:scale(1.5);}\
.issue-card:hover .ui-slider .ui-slider-handle{display:block;}\
.ui-slider-horizontal { border-radius:0;border:none;height:5px;background:none;}\
.ui-slider-range { background:#eea;}\
\
\
#footer,.issue-card .progress, #query_form_with_buttons, .controller-agile_boards #sidebar { \
    display:none;\
}\
\
.controller-agile_boards  #content { width:98%;box-sizind:border-box;margin:0;border:0;padding:1%; }\
\
.quick-view { \
    opacity:.5;position:absolute;top:5px;left:100%;margin-left:5px;cursor:pointer; \
    width:0;height:0;border:4px solid;border-color:#a0a062 transparent transparent transparent; \
} \
.quick-view:hover { opacity:1; } \
.quick-view.ready { opacity:1; border-color: transparent transparent #a0a062 transparent; } \
\
.quick-view-comments { width:16px;height:16px;top:20px;margin-left:4px;border:none; }\
.quick-view-comments:before {\
    box-shadow: 1px 1px 0 #7e7e48,2px 1px 0 #7e7e48,3px 1px 0 #7e7e48,4px 1px 0 #7e7e48,5px 1px 0 #7e7e48,6px 1px 0 #7e7e48,7px 1px 0 #7e7e48,8px 1px 0 #7e7e48,1px 2px 0 #7e7e48,8px 2px 0 #7e7e48,1px 3px 0 #7e7e48,3px 3px 0 #7e7e48,4px 3px 0 #7e7e48,5px 3px 0 #7e7e48,6px 3px 0 #7e7e48,8px 3px 0 #7e7e48,1px 4px 0 #7e7e48,8px 4px 0 #7e7e48,1px 5px 0 #7e7e48,4px 5px 0 #7e7e48,5px 5px 0 #7e7e48,6px 5px 0 #7e7e48,7px 5px 0 #7e7e48,8px 5px 0 #7e7e48,1px 6px 0 #7e7e48,3px 6px 0 #7e7e48,1px 7px 0 #7e7e48,2px 7px 0 #7e7e48,1px 8px 0 #7e7e48;\
   display:block;content:\"\";width:1px;height:1px;\
} \
.quick-view-close { position:absolute;top:2px;right:2px;color:#444; \
    text-shadow:1px 1px 0 #fff;font-size:18px; \
} \
.quick-view textarea, .quick-view input[type=text] { \
    border:1px solid #ccc;background:#fff;box-sizing:border-box;\
    width:100%;margin:10px 0;\
} \
.quick-view-close img { transform:rotate(0deg);transition:.2s; } \
.quick-view-close:hover img { transform:rotate(180deg);transition:.2s; }\
.quick-view .quick-view-content { \
    position:absolute;display:none; left:-100px;top:10px;background:#fff; \
    border:1px solid #ccc;color:#555;width:400px;height:auto; \
    padding:10px;z-index:100;box-shadow:0 2px 3px rgba(0,0,0,.2);overflow:visible; \
} \
.quick-view.ready .quick-view-content { display:block; } \
\
div.agile-board.autoscroll { overflow:visible !important; } \
\
.issue-card { position:relative;border:1px solid #eea; } \
.issue-card * { font-weight:400;font-size:13px; } \
.issue-id { color:#cc9; }\
\
table.list{ border:none; }\
table.list th{ background:none;color:#ddd;font-size:18px;font-weight:100; } \
</style>");

});



var contextMenuObserving;
var contextMenuUrl;
var ctxParams = {
    authenticity_token: $("input[name='authenticity_token']").val(),
    back_url: "/",
    ids: [],
    utf8: ""
};

function contextMenuInit(url) {
    if (contextMenuObserving) return;
    contextMenuUrl = url;
    $(document).click(contextMenuClick);
    $(document).contextmenu(function(event){
        var el = $(event.target).hasClass('issue-card') ? $(event.target) : $(event.target).closest('.issue-card');
        if (!el.hasClass('hascontextmenu')) return;
        ctxParams.ids = [+el.attr("data-id")];
        event.preventDefault();
        contextMenuShow(event);
    });
    contextMenuObserving = true;
}

function contextMenuClick(event) {
    $('#context-menu').hide();
}

function contextMenuShow(event) {
    var mouse_x = event.pageX,
        mouse_y = event.pageY,
        render_x = mouse_x,
        render_y = mouse_y;
    var menu_width, menu_height;

    $('#context-menu').css({
        'left': (render_x + 'px'),
        'top': (render_y + 'px')
    }).html('');

    $.ajax({
        url: contextMenuUrl,
        data: $.param(ctxParams),
        success: function (data, textStatus, jqXHR) {
            $('#context-menu').html(data);
            menu_width = $('#context-menu').width();
            menu_height = $('#context-menu').height();

            var ws = window_size();

            if (mouse_x + 2 * menu_width > ws.width) {
                render_x -= menu_width;
                $('#context-menu').addClass('reverse-x');
            } else {
                $('#context-menu').removeClass('reverse-x');
            }
            if (mouse_y + menu_height > ws.height) {
                render_y -= menu_height;
                $('#context-menu').addClass('reverse-y');
            } else {
                $('#context-menu').removeClass('reverse-y');
            }
            if (render_x <= 0) render_x = 1;
            if (render_y <= 0) render_y = 1;
            $('#context-menu').css({
                'left': (render_x + 'px'),
                'top': (render_y + 'px')
            }).show();

        }
    });
}

function window_size() {
    var w, h;
    if (window.innerWidth) {
        w = window.innerWidth;
        h = window.innerHeight;
    } else if (document.documentElement) {
        w = document.documentElement.clientWidth;
        h = document.documentElement.clientHeight;
    } else {
        w = document.body.clientWidth;
        h = document.body.clientHeight;
    }
    return {
        width: w,
        height: h
    };
}