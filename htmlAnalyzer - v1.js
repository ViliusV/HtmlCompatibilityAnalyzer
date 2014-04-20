(function ($) {
    //todo: refactor according to browser tags
    var Analyzer = function () {
        var tags = [];

        return {
            addTags: function (parent) {

                if (parent.tagName !== undefined && tags.indexOf(parent.tagName) == -1) {
                    tags.push(parent.tagName);
                }

                var children = $(parent).children();

                if (children.length > 0) {
                    for (var id = 0; id < children.length; id++) {
                        this.addTags(children[id]);
                    }
                }

            },

            getTags: function () {
                return tags;
            }
        }
    }();


    //TODO: browser [0..N] versions [0..N] tags
    function BrowserTags(name, version, tags) {
        this._name = name;
        this._version = version;
        this._tags = [];

        for (var id = 0; id < tags.length; id++) {
            this._tags.push(tags[id].toLowerCase());
        }

        BrowserTags.prototype.getName = function () {
            return this._name;
        }

        BrowserTags.prototype.getVersion = function () {
            return this._version;
        }

        BrowserTags.prototype.getTags = function () {
            return this._tags;
        }

        BrowserTags.prototype.isTagSupported = function (tag) {
            return this._tags.indexOf(tag.toLowerCase()) != -1;
        }
    }

    var tags = ['audio', 'div', 'VidEO'];
    var ie9 = new BrowserTags('IE', '9.2.2.', tags);
    console.log(ie9.getName());
    console.log(ie9.isTagSupported('auDIO'));
    console.log(ie9.isTagSupported('canvas'));

    //Instantenious function body:
    Analyzer.addTags('body');
    var tags = Analyzer.getTags();

    for (var id = 0 ; id < tags.length; id++) {
        console.log(tags[id]);
    }

})(jQuery);