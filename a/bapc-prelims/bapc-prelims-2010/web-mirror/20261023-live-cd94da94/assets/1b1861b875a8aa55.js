document.addEventListener(
    "DOMContentLoaded", () => {
        // Unregister previously registered serviceworkers.
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for (let registration of registrations) {
                registration.unregister();
            }
        });

        // Prevent initial animation for collapse icon in sidebar.
        $('a[id^="toggler-btn"]').each(function() {
            $(this).on('click', function() {
                var collapse_icon = $(this).find('#collapse-icon');
                collapse_icon.toggleClass("fa-arrow-up-animated");
                if (collapse_icon.attr('class').split(/\s+/).includes("fa-arrow-default-animated")) {
                    collapse_icon.removeClass('fa-arrow-default-animated');
                    collapse_icon.addClass("fa-arrow-down-animated");
                }
            })
        });

        // Use a sticky header for mobile layouts.
        if ($(window).width() < 768) {
            new Mhead("#header");
        }

        // Build the context menu on the left.
        var domRoot = $('<nav hidden></nav>');
        domRoot.attr('id', 'context-mmenu');

        var navMain = $('.nav-main>ul').clone();
        navMain.find('#nav-social-dropdown').remove();
        navMain.find('.d-none').removeClass('d-none');
        navMain.find('#social-title').remove();
        navMain.find('#nav-main-chevron').remove();

        var navSocial = navMain.find('.nav-social').clone();

        // Delete nav-social from navMain.
        // It will be added seperately to the footer of the mobile navbar.
        navMain.find('.nav-social').remove();

        navMain.appendTo(domRoot);
        domRoot.appendTo($('body'));

        // Footer with social media links.
        const navbars = [{
            "position": "bottom",
            "content": []
        }];

        // Add social media links to the footer of nav-context in reverse order.
        navSocial.find('a').each(function() {
            navbars[0]['content'].unshift($(this)[0].outerHTML);
        });
        navMain.find('.float-left').each(function() {
            $(this).removeClass('float-left');
        });

        var drag = {};
        if ('ontouchstart' in window) {
            drag = { open: true };
        }

        var drag = {};
        if ('ontouchstart' in window) {
            drag = { open: true };
        }

        // Create the context (navigation) menu.
        const contextMenuAPI = new Mmenu("#context-mmenu", {
            drag: drag,
            classNames: {
                selected: 'active',
            },
            navbars: navbars,
            "counters": true
        }, {
            offCanvas: {
                clone: true
            },
        });

        // Create the user menu.
        const userMenuAPI = new Mmenu("#user-mmenu", {
            extensions: ["pagedim-black", "popup"],
            "autoHeight": true
        }, {});

        $("#user-mmenu").removeAttr("hidden");
        $("#mm-context-mmenu").removeAttr("hidden");

        // Hack to avoid starting the wrong transition of the context menu hamburger.
        userMenuAPI.bind('open:after', () => {
            $('body').removeClass("mm-wrapper_opened");
        });

        // Close both menus if the window has become too wide.
        $(window).on('resize', function() {
            if ($(window).width() > 1050) {
                contextMenuAPI.close();
                userMenuAPI.close();
            }
        });
    }
);
