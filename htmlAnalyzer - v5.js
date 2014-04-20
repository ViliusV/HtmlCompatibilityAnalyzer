
//Analyzer
function Analyzer(browsers) {
    this._browsers = browsers;
    this._documentTags = [];
}

Analyzer.prototype.collectDocumentTags = function(parent) {

    parent = typeof parent !== 'undefined' ? parent : document.getElementsByTagName('body')[0];

    if (parent.tagName !== undefined && this._documentTags.indexOf(parent.tagName.toLowerCase()) === -1) {
        this._documentTags.push(parent.tagName.toLowerCase());
    }

    var children = parent.children;

    if (children.length > 0) {
        for (var id = 0; id < children.length; id++) {
            this.collectDocumentTags(children[id]);
        }
    }
};


Analyzer.prototype.getDocumentTags = function() {
    if (this._documentTags.length === 0) {
        this.collectDocumentTags();
    }

    return this._documentTags;
};

Analyzer.prototype.getBrowserSupportInfo = function() {
    var tags = this.getDocumentTags();
    var supportedBrowsers = [];

    for (var id = 0; id < this._browsers.length; id++) {
        var name = this._browsers[id]._name;
        var version = this._browsers[id].getLowestSupportedVersionForKnownTags(tags); //TODO: maybe use function for all tags

        supportedBrowsers.push(new BrowserInfo(name, version));
    }

    return supportedBrowsers;
};

Analyzer.prototype.getBrowserSupportInfoForEachTag = function() {
    var tags = this.getDocumentTags();
    var tagSupportInfo = [];

    for (var tagId = 0; tagId < tags.length; tagId++) {
        var tagInfo = new TagSupportInfo(tags[tagId], []);

        for (var browserId = 0; browserId < this._browsers.length; browserId++) {
            var name = this._browsers[browserId]._name;
            var version = this._browsers[browserId].whenSupportAddedFor(tags[tagId]);

            if (version !== '') {
                tagInfo._browsersInfo.push(new BrowserInfo(name, version));
            }
        }

        tagSupportInfo.push(tagInfo);
    }

    return tagSupportInfo;
};


function BrowserInfo(name, version) {
    this._name = name;
    this._version = version;
}

function TagSupportInfo(tag, browsersInfo) {
    this._tag = tag;
    this._browsersInfo = browsersInfo;
}

//Browser
function Browser(name, versions) {
    this._name = name;
    this._versions = versions;
}


Browser.prototype.getVersionsIdentifiers = function() {
    var versionsIdentifiers = [];

    for (var id = 0; id < this._versions.length; id++) {
        versionsIdentifiers.push(this._versions[id]._identifier);
    }

    return versionsIdentifiers;
};


Browser.prototype.getTags = function() {
    var tags = [];

    for (var versionId = 0; versionId < this._versions.length; versionId++) {
        var versionTags = this._versions[versionId]._tags;

        for (var tagId = 0; tagId < versionTags.length; tagId++) {
            if (tags.indexOf(versionTags[tagId] === -1)) {
                tags.push(versionTags[tagId]); //TODO: fix to avoid duplicates
            }
        }
    }

    return tags;
};

Browser.prototype.isTagSupported = function(tag) {
    var tags = this.getTags();

    return tags.indexOf(tag.toLowerCase()) !== -1;
};

Browser.prototype.whenSupportAddedFor = function(tag) {
    var version = '';

    for (var id = 0 ; id < this._versions.length; id++) {
        if (this._versions[id].isSupportFromThisVersion(tag.toLowerCase())) {
            version = this._versions[id]._identifier;

            break;
        }
    }

    return version;
};

Browser.prototype.getLowestSupportedVersionForAllTags = function(tags) {
    var versions = this.getVersionsIdentifiers();
    var lowestSupportedVersionId = 0;

    for (var id = 0; id < tags.length; id++) {
        var supportedVersion = this.whenSupportAddedFor(tags[id].toLowerCase());

        var supportedVersionId = versions.indexOf(supportedVersion);

        if (supportedVersionId !== -1 || supportedVersionId > lowestSupportedVersionId) {
            lowestSupportedVersionId = supportedVersionId;
        }

        if (supportedVersionId === -1) {
            return versions[versions.length - 1];
        }
    }

    return versions[lowestSupportedVersionId];
};

Browser.prototype.getLowestSupportedVersionForKnownTags = function(tags) {
    var versions = this.getVersionsIdentifiers();
    var lowestSupportedVersionId = 0;

    for (var id = 0; id < tags.length; id++) {
        var tag = tags[id].toLowerCase();


        if (this.isTagSupported(tag)) {

            var supportedVersion = this.whenSupportAddedFor(tag);

            var supportedVersionId = versions.indexOf(supportedVersion);

            if (supportedVersionId > lowestSupportedVersionId) {
                lowestSupportedVersionId = supportedVersionId;
            }
        }
    }

    return versions[lowestSupportedVersionId];
};

//Version entity
function VersionTags(identifier, tags) {
    this._identifier = identifier;
    this._tags = [];

    for (var id = 0; id < tags.length; id++) {
        this._tags.push(tags[id].toLowerCase());
    }
}


VersionTags.prototype.isSupportFromThisVersion = function(tag) {
    return this._tags.indexOf(tag.toLowerCase()) !== -1;
};




(function() {


    //
    var ie8 = new VersionTags('8.0.1', ['script', 'div']);
    var ie9 = new VersionTags('9.0', ['div', 'VidEO', 'canvas', 'audio', 'article']);
    var ie10 = new VersionTags('10.1.0.1', ['canvas']);
    var ie = new Browser('Internet explorer', [ie8, ie9, ie10]);


    var chrome3 = new VersionTags('3.0', ['script', 'audio', 'div']);
    var chrome4 = new VersionTags('4.0', ['canvas', 'script', 'audio', 'div']);
    var chrome6 = new VersionTags('6.0', ['script', 'audio', 'div', 'article']);
    var chrome12 = new VersionTags('12.2.2.', ['div', 'VidEO', 'canvas']);
    var chrome15 = new VersionTags('10.1.0.1', ['canvas']);
    var chrome = new Browser('Google Chrome', [chrome3, chrome4, chrome6, chrome12, chrome15]);


    var ff2 = new VersionTags('2.0', ['canvas', 'script', 'audio', 'div']);
    var ff35 = new VersionTags('3.5', ['script', 'audio', 'div']);
    var ff4 = new VersionTags('4.0', ['script', 'audio', 'div', 'article']);
    var ff = new Browser('Mozilla Firefox', [ff2, ff35, ff4]);
    //TODO: allow order to be non sequential and create versions order. So it would be possilbe to know that 8.0.1 < 10.1.01


    console.log(ie._name);
    console.log(ie9.isSupportFromThisVersion('auDIO'));
    console.log(ie.getVersionsIdentifiers());
    console.log(ie.getTags());
    console.log(ie.whenSupportAddedFor('canvas'));


    //TODO: print where is the tag supported

    //Instantenious function body:
    var analyzer = new Analyzer([ie, chrome, ff]);
    analyzer.collectDocumentTags();

    var tags = analyzer.getDocumentTags();
    console.log('your website can work in lowest version of IE (all tags):' + ie.getLowestSupportedVersionForAllTags(tags));
    console.log('your website can work in lowest version of IE (known tags only):' + ie.getLowestSupportedVersionForKnownTags(tags));

    for (var tagId = 0 ; tagId < tags.length; tagId++) {
        console.log(tags[tagId]);
    }

    var browsersInfo = analyzer.getBrowserSupportInfo();

    console.log('This page is available in these browsers:');
    for (var browserInfoId = 0; browserInfoId < browsersInfo.length; browserInfoId++) {
        console.log(browsersInfo[browserInfoId]._name + ' ' + browsersInfo[browserInfoId]._version + '+');
    }

    var tagsSupportInfo = analyzer.getBrowserSupportInfoForEachTag();
    for (var id = 0; id < tagsSupportInfo.length; id++) {
        var browserInfo = '|';

        for (var browserId = 0; browserId < tagsSupportInfo[id]._browsersInfo.length; browserId++) {
            browserInfo += tagsSupportInfo[id]._browsersInfo[browserId]._name + ' ' + tagsSupportInfo[id]._browsersInfo[browserId]._version + '|';
        }


        console.log(tagsSupportInfo[id]._tag + ': ' + browserInfo);


    }

})();
//INFO apie tai, kokoiose narsyklese ir ju versijose prieinamas puslapis pvz 
/*

IE9, Chrome5 ff9

div ie4, chrome 1, ff 1
audio ie9, chrome5, ff9
video ie8, chrome5, ff7

*/