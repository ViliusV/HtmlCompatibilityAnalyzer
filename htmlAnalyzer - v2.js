(function ($) {
    //todo: refactor according to browser tags
    var Analyzer = function (browsers) {
        this._browsers = browsers;

        return {
            addDocumentTags: function (parent) {

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

            getDocumentTags: function () {
                return tags;
            }
        }
    }();


    //TODO: browser [0..N] versions [0..N] tags
    function VersionTags(version, tags) {
        this._version = version;
        this._tags = []

        for (var id = 0; id < tags.length; id++) {
            this._tags.push(tags[id].toLowerCase());
        }

        VersionTags.prototype.isSupportFromThisVersion = function (tag) {
            return this._tags.indexOf(tag.toLowerCase()) != -1;
        }

        VersionTags.prototype.getVersion = function () {
            return this._version;
        }

        VersionTags.prototype.getTags = function () {
            return this._tags;
        }
    }


    function Browser(name, versions) {
        this._name = name;
        this._versions = versions;


        Browser.prototype.getName = function () {
            return this._name;
        }

        Browser.prototype.getVersions = function () {
            return this._versions;
        }

        Browser.prototype.getVersionsNumbers = function () {
            var versionNumbers = [];

            for (id = 0; id < this._versions.length; id++) {
                versionNumbers.push(this._versions[id]._version);
            }

            return versionNumbers;
        }

        Browser.prototype.getTags = function () {
            var tags = [];

            for (versionId = 0; versionId < this._versions.length; versionId++) {
                var versionTags = this._versions[versionId]._tags;

                for (var tagId = 0; tagId < versionTags.length; tagId++) {
                    if (tags.indexOf(versionTags[tagId] == -1)) {
                        tags.push(versionTags[tagId]); //TODO: fix to avoid duplicates
                    }
                }
            }

            return tags;
        }

        Browser.prototype.isTagSupported = function (tag) {
            return this._tags.indexOf(tag.toLowerCase()) != -1;
        }

        Browser.prototype.whenSupportAddedFor = function (tag) {
            var version = '';

            for (var id = 0 ; id < this._versions.length; id++) {
                if (this._versions[id].isSupportFromThisVersion(tag.toLowerCase())) {
                    version = this._versions[id]._version;

                    break;
                }
            }

            return version;
        }

        Browser.prototype.getLowestSupportedVersion = function (tags) {

        }
    }

    var tags9 = ['audio', 'div', 'VidEO', 'canvas'];
    var tags10 = ['canvas'];
    var ie9 = new VersionTags('9.2.2.', tags9);
    var ie10 = new VersionTags('10.1.0.1', tags10);
    var ie = new Browser('internet explorer', [ie9, ie10]);


    console.log(ie.getName());
    console.log(ie9.isSupportFromThisVersion('auDIO'));
    console.log(ie.getVersionsNumbers());
    console.log(ie.getTags());
    console.log(ie.whenSupportAddedFor('canvas'));


    //TODO: print where is the tag supported

    //Instantenious function body:
    Analyzer.addDocumentTags('body');
    var tags = Analyzer.getDocumentTags();

    for (var id = 0 ; id < tags.length; id++) {
        console.log(tags[id]);
    }

})(jQuery);