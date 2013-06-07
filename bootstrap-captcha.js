(function ($) {
    "use strict";
    $.fn.bootstrapCaptcha = function (userOptions) {
        this.attr('data-valid', 'false');
        this.attr('data-bot', 'false');
        this.iconSize = '3x';
        this.resetInvalidDrop = false;
        this.clearWhenCorrect = true;
        this.asText = true;
        this.displayTargetArrows = true;
        $.extend(this, userOptions);
        if (this.onDrop && typeof this.onDrop === 'function') {
            this.callback = true;
        } else {
            this.callback = false;
        }
        this.toThisTarget = '<strong><span id="bsCaptchaError">to this target</span></strong>';
        this.icons = [
                'envelope',
                'anchor',
                'pencil',
                'bullhorn',
                'fire-extinguisher',
                'camera',
                'wrench',
                'cut',
                'beaker',
                'magic',
                'heart',
                'cogs',
                'trophy',
                'fire',
                'bell',
                'money',
                'truck',
                'coffee',
                'lightbulb',
                'paper-clip',
                'lock',
                'credit-card',
                'headphones',
                'microphone',
                'rocket',
                'fighter-jet',
                'search',
                'beer',
                'eye-open',
                'magnet',
                'ambulance',
                'home',
                'glass',
                'facetime-video',
                'thumbs-up',
                'gift',
                'book',
                'road',
                'star',
                'music',
                'user',
                'shield',
                'puzzle-piece',
                'bolt',
                'briefcase',
                'globe',
                'leaf',
                'circle-blank',
                'calendar',
                'frown',
                'question',
                'printer',
                'smile',
                'key'
        ];
        this.iconNames = {
            envelope: 'envelope',
            anchor: 'anchor',
            pencil: 'pencil',
            bullhorn: 'bullhorn',
            'fire-extinguisher': 'fire extinguisher',
            camera: 'camera',
            wrench: 'wrench',
            cut: 'scissors',
            beaker: 'beaker',
            magic: 'magic wand',
            heart: 'heart',
            cogs: 'cogs',
            trophy: 'trophy',
            fire: 'fire',
            bell: 'bell',
            money: 'money',
            truck: 'truck',
            coffee: 'coffee cup',
            lightbulb: 'lightbulb',
            'paper-clip': 'paper clip',
            lock: 'lock',
            'credit-card': 'credit card',
            headphones: 'headphones',
            microphone: 'microphone',
            smile: 'smily face',
            rocket: 'rocket',
            'fighter-jet': 'fighter jet',
            search: 'magnifying glass',
            beer: 'beer mug',
            'eye-open': 'eye',
            magnet: 'magnet',
            ambulance: 'ambulance',
            home: 'house',
            glass: 'glass',
            'facetime-video': 'movie camera',
            'thumbs-up': 'thumbs-up',
            gift: 'gift',
            book: 'book',
            road: 'road',
            star: 'star',
            music: 'musical notes',
            user: 'person',
            shield: 'shield',
            'puzzle-piece': 'puzzle piece',
            bolt: 'lightning bolt',
            question: 'question mark',
            briefcase: 'briefcase',
            globe: 'globe',
            leaf: 'leaf',
            'circle-blank': 'circle',
            calendar: 'calendar',
            frown: 'frown',
            key: 'key',
            print: 'printer'
        };
        this.used = [];
        this.stored = [];
        this.mouseUsed = false;
        this.seri = '';
        this.str = '';
        this.validate = function ($icon) {
            var x = {
                valid: false,
                bot: false
            },
                klass = 'icon-' + this.seri;
            if (!this.mouseUsed) {
                this.attr('data-valid', 'false');
                this.attr('data-bot', 'true');
                x.bot = true;
                if (this.callback === true) {
                    this.onDrop(x);
                }
                return;
            }
            if ($icon.hasClass(klass)) {
                x.valid = true;
                this.attr('data-valid', 'true');
                this.attr('data-bot', 'false');
                $icon.hide();
                $('#targetSpan').empty().append('<strong>Correct!</strong>');
                $('.icon-bullseye').hide();
                $('#bsCaptchaTarget').removeClass('alert-danger').addClass('alert-success');
                $('.valid-icon').fadeIn();
                if (this.callback === true) {
                    this.onDrop(x);
                }
                if (this.clearWhenCorrect === true) {
                    $('.bsCaptchaRemove').slideUp();
                }
                return;
            }
            if (this.resetInvalidDrop === true) {
                this.makeLayout();
                return;
            }
            this.attr('data-valid', 'false');
            $('#bsCaptchaError').empty().append('Try again');
            if (this.callback === true) {
                this.onDrop(x);
            }
        };
        this.getRandomInt = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        this.addIcon = function () {
            var that = this,
                randomnumber = this.getRandomInt(0, (this.icons.length - 1));
            if ($.inArray(randomnumber, this.used) === -1) {
                this.used.push(randomnumber);
                $('<i/>', {
                    'class': 'dr icon-' + this.iconSize + ' icon-' + this.icons[randomnumber]
                }).appendTo('#bsCaptchaOut');
                $('#bsCaptchaOut').append('&nbsp;&nbsp;');
                this.stored.push(this.icons[randomnumber]);
            }
            if (this.used.length < 6) {
                this.addIcon();
            } else {
                randomnumber = this.getRandomInt(0, (this.used.length - 1));
                if (typeof this.stored[randomnumber] === "undefined") {
                    this.addIcon();
                    return;
                }
                if (this.asText === true) {
                    if (typeof this.iconNames[this.stored[randomnumber]] === 'undefined') {
                        this.addIcon();
                    }
                    $('.what').empty().append('<strong>' + this.iconNames[this.stored[randomnumber]] + '</strong> icon');
                } else {
                    $('.what').empty().append($('<i/>', {
                        'class': 'icon-' + this.iconSize + ' icon-' + this.stored[randomnumber]
                    }));
                }
                $('#bsCaptchaTarget').append($('<i/>', {
                    'class': 'hide valid-icon icon-' + this.iconSize + ' icon-' + this.stored[randomnumber]
                }));
                this.seri = this.stored[randomnumber];
                $('.dr').draggable({
                    revert: true,
                    cursor: "move",
                    helper: "clone"
                }).on("mousedown", function () {
                    that.mouseUsed = true;
                });
                $('#bsCaptchaTarget').droppable({
                    accept: ".dr",
                    activeClass: "ui-state-highlight",
                    drop: function (event, ui) {
                        that.validate(ui.draggable);
                    }
                });
                $('#bootstrapCaptchaDiv').slideDown();
            }
        };
        //  credit: http://sedition.com/perl/javascript-fy.html
        this.fisherYates = function () {
            var i = this.icons.length,
                j, temp;
            if (i === 0) {
                return false;
            }
            while (--i) {
                j = Math.floor(Math.random() * (i + 1));
                temp = this.icons[i];
                this.icons[i] = this.icons[j];
                this.icons[j] = temp;
            }
            this.addIcon();
        };
        this.makeLayout = function () {
            this.used = [];
            this.stored = [];
            this.mouseUsed = false;
            this.seri = '';
            this.str = '';
            this.empty();
            $('<div/>', {
                'class': 'hide',
                id: "bootstrapCaptchaDiv"
            }).appendTo(this);
            $('<div/>', {
                'class': 'row-fluid bsCaptchaDiv bsCaptchaRemove'
            }).appendTo('#bootstrapCaptchaDiv');
            $('<ul/>', {
                'class': 'text-center span6'
            }).appendTo('.bsCaptchaDiv:last').append('<li>Please drag and drop the <span class="what"></span> below</li>');
            $('<div/>', {
                'class': "row-fluid bsCaptchaDiv bsCaptchaRemove"
            }).appendTo('#bootstrapCaptchaDiv');
            $('<ul/>', {
                'class': "span6 text-center"
            }).appendTo('.bsCaptchaDiv:last').append('<li id="bsCaptchaOut"></li>');
            $('<div/>', {
                'class': 'row-fluid bsCaptchaRemove'
            }).appendTo('#bootstrapCaptchaDiv').append($('<p/>', {
                'class': 'span6',
                html: '<hr>'
            }));
            $('<div/>', {
                'class': 'row-fluid bsCaptchaDiv'
            }).appendTo('#bootstrapCaptchaDiv');
            $('<ul/>', {
                'class': "span6 text-center"
            }).appendTo('.bsCaptchaDiv:last').append('<li id="targetSpanLI">&nbsp</li>');
            this.str = '<span id="targetSpan">';
            if (this.displayTargetArrows) {
                this.str += '<i class="icon-arrow-down icon-' + this.iconSize + '"></i>';
                this.str += this.toThisTarget;
                this.str += '<i class="icon-arrow-down icon-' + this.iconSize + '"></i>';
            } else {
                this.str += '<strong><span id="bsCaptchaError">to this target</span></strong>';
            }
            this.str += '</span>';
            $('#targetSpanLI').append(this.str);
            $('<div/>', {
                'class': 'row-fluid bsCaptchaDiv'
            }).appendTo('#bootstrapCaptchaDiv');
            $('<ul/>', {
                'class': "span2 offset2 text-center well well-small alert alert-danger",
                id: 'bsCaptchaTarget'
            }).appendTo('.bsCaptchaDiv:last').append('<li><i class="icon-bullseye icon-' + this.iconSize + '"></i></li>');
            this.fisherYates();
        };
        if ($('body').hasClass('bootstrapCaptcha')) {
            return this;
        }
        $('body').addClass('bootstrapCaptcha');
        this.makeLayout();
        return this;
    };
}(jQuery));
