



(function($) {

    var methods = {
        init : function(settings, callingElement, callback) {
            if ($('.vm-dlg-dialog[item-id="' + settings.id + '"]').length === 0) {
                var self = this;

                this.appendTo('body').addClass('vm-dlg-dialog').attr('item-id', settings.id);


                var buttons = $('<div/>').addClass('vm-dlg-buttons').appendTo(this);
                $('<div/>').addClass('vm-dlg-icon vm-dlg-icon-min').appendTo(buttons).hide().click(function() {
                    $(this).vmDialog('dlg').vmDialog('minimize');
                });
                $('<div/>').addClass('vm-dlg-icon vm-dlg-icon-max').appendTo(buttons).click(function() {
                    $(this).vmDialog('dlg').vmDialog('maximize');
                });
                $('<div/>').addClass('vm-dlg-icon vm-dlg-icon-close').appendTo(buttons).click(function() {
                    $(this).vmDialog('dlg').vmDialog('close');
                });
                $('<div/>').addClass('vm-dlg-title').appendTo(buttons);

                $('<div/>').addClass('vm-dlg-content').appendTo(this).load(settings.url, {
                    nid: settings.id,
                    snapshooting: settings.snapshooting
                }, function() {
                    callback(self);
                });

                this.data('resize', true).resizable({
                    containment: 'window',
                    start: function(event) {
                        $(this)
                        .data('resize-width', $(this).width())
                        .data('resize-height', $(this).height())
                        .data('resize-x', event.pageX)
                        .data('resize-y', event.pageY);
                    },
                    resize: function(event) {
                        if ($(this).data('resize')) {
                            $(this).css({
                                width: $(this).data('resize-width') + event.pageX - $(this).data('resize-x'),
                                height: $(this).data('resize-height') + event.pageY - $(this).data('resize-y')
                            });
                        }
                    }
                });
                this.draggable({
                    containment: 'window'
                });

                this.css({
                    top:  $(callingElement).offset().top - $(window).scrollTop(),
                    left:  $(callingElement).offset().left - $(window).scrollLeft(),
                    width:  $(callingElement).width(),
                    height:  $(callingElement).height()
                });
            } else {
                self = $('.vm-dlg-dialog[item-id="' + settings.id + '"]');
            }
      

            self.vmDialog('maximize');
            self.mousedown(function() {
                self.vmDialog('moveToTop');
            });
            self.vmDialog('moveToTop');
            return self;
        },
        moveToTop: function() {
            var min = false, max = 3000;
            $('.vm-dlg-dialog[item-id!="' + this.attr('item-id') + '"]').each(function() {
                var z = parseInt($(this).css('z-index'));
                min = min ? Math.min(min, z) : z;
                max = Math.max(max, z);
            });
            this.css('z-index', max + 1);
            if (min) {
                var d = min - 3000;
                if (d > 0) {
                    $('.vm-dlg-dialog').each(function() {
                        $(this).css('z-index', parseInt($(this).css('z-index')) - d);
                    });
                }
            }
        },
        dlg: function() {
            return this.parents('.vm-dlg-dialog');
        },
        close: function() {
            this.fadeOut('fast', function() {
                $(this).remove();
            });
        },

        maximize: function() {
            this.data('restore', {
                left: this.position().left,
                top: this.position().top,
                width: this.width(),
                height: this.height()
            });

            this.animate({
                top: 0,
                left: 0,
                width: $(window).width() - 20,
                height: $(window).height() - 20
            }, 'fast', function() {
                $(this).data('resize', false).find('.vm-dlg-icon-min').show().end()
                .find('.vm-dlg-icon-max').hide();
            });
        },
        minimize: function() {
            this.animate(this.data('restore'), 'fast', function() {
                $(this).data('resize', true).find('.vm-dlg-icon-min').hide().end()
                .find('.vm-dlg-icon-max').show();
            });
        }
    };

    $.fn.vmDialog = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            console.log('Method ' + method + ' does not exist on jQuery.itemBrowser');
        }
    };
})(jQuery);