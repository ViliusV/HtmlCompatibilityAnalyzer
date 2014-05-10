// Analyzer
function Analyzer(browsers) {
    this._browsers = browsers;
    this._documentTags = [];

    var collectDocumentTags = function(analyzer, parent) {
        parent = typeof parent !== 'undefined' ? parent : document.querySelector('body');

        if (parent.tagName !== 'undefined' && analyzer._documentTags.indexOf(parent.tagName.toLowerCase()) === -1) {
            analyzer._documentTags.push(parent.tagName.toLowerCase());
        }

        var children = parent.children;

        if (children.length > 0) {
            for (var id = 0; id < children.length; id++) {
                collectDocumentTags(analyzer, children[id]);
            }
        }
    };

    this.getDocumentTags = function() {
        if (this._documentTags.length === 0) {
            collectDocumentTags(this);
        }

        return this._documentTags;
    };

    this.getBrowserSupportInfo = function() {
        var tags = this.getDocumentTags();
        var supportedBrowsers = [];

        for (var id = 0; id < this._browsers.length; id++) {
            var name = this._browsers[id]._name;
            var version = this._browsers[id].getLowestSupportedVersionForKnownTags(tags);

            supportedBrowsers.push(new BrowserInfo(name, version));
        }

        return supportedBrowsers;
    };

    this.getBrowserSupportInfoForEachTag = function() {
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
}

// Information
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

    this.getVersionsIdentifiers = function() {
        var versionsIdentifiers = [];

        for (var id = 0; id < this._versions.length; id++) {
            versionsIdentifiers.push(this._versions[id]._identifier);
        }

        return versionsIdentifiers;
    };

    this.getTags = function() {
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

    this.isTagSupported = function(tag) {
        var tags = this.getTags();

        return tags.indexOf(tag.toLowerCase()) !== -1;
    };

    this.whenSupportAddedFor = function(tag) {
        var version = '';

        for (var id = 0 ; id < this._versions.length; id++) {
            if (this._versions[id].isSupportFromThisVersion(tag.toLowerCase())) {
                version = this._versions[id]._identifier;

                break;
            }
        }

        return version;
    };

    this.getLowestSupportedVersionForAllTags = function(tags) {
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

    this.getLowestSupportedVersionForKnownTags = function(tags) {
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
}


//Version
function BrowserVersion(identifier, tags) {
    this._identifier = identifier;
    this._tags = [];

    for (var id = 0; id < tags.length; id++) {
        this._tags.push(tags[id]._tag.toLowerCase());
    }

    this.isSupportFromThisVersion = function(tag) {
        return this._tags.indexOf(tag.toLowerCase()) !== -1;
    };
}


//Tag
var Tag = function(tag, attributes, isNew) {
    this._tag = tag.toLowerCase();
    this._attributes = attributes || [];
    this._isNew = isNew || false;
};


//Tag attribute
var TagAttribute = function(attribute, values, isNew){
    this._attribute = attribute.toLowerCase();
    this._values = values || [];
    this._isNew = isNew || false;
};


//Tag attribute value
var TagAttributeValue = function(value, isNew) {
    this._value = value;
    this._isNew = isNew || false;
};



(function() {
    //Internet Explorer
    var sectionTagIe9 = new Tag('section', [], true);
    var articleTagIe9 = new Tag('article', [], true);
    var asideTagIe9 = new Tag('aside', [], true);
    var headerTagIe9 = new Tag('header', [], true);
    var footerTagIe9 = new Tag('footer', [], true);
    var canvasTagIe9 = new Tag('canvas', [], true);
    var videoTagIe9 = new Tag('video', [new TagAttribute('type',  [new TagAttributeValue('video/mp4', true)], true)], true);
    var audioTagIe9 = new Tag('audio', [new TagAttribute('type', [new TagAttributeValue('audio/mpeg', true)], true)], true);
    var svgTagIe9 = new Tag('svg', [], true);
    var ie9 = new BrowserVersion('9.0', [sectionTagIe9, articleTagIe9, asideTagIe9, headerTagIe9, footerTagIe9, canvasTagIe9, videoTagIe9, audioTagIe9, svgTagIe9]);

    var inputTagIe10 = new Tag('input', [
        new TagAttribute('type', [new TagAttributeValue('range', true), new TagAttributeValue ('number', true)]),
        new TagAttribute('placeholder', [], true),
        new TagAttribute('required', [], true)]);
    var progressTagIe10 = new Tag('progress', [], true);
    var datalistTagIe10 = new Tag('datalist', [], true);
    var ie10 = new BrowserVersion('10.0', [inputTagIe10, progressTagIe10, datalistTagIe10]);

    var ie = new Browser('Microsoft Internet Explorer', [ie9, ie10]);

    //Mozilla Firefox
    var canvasTagFirefox2 = new Tag('canvas', [], true);
    var firefox2 = new BrowserVersion('2.0', [canvasTagFirefox2]);

    var videoTagFirefox3_5 = new Tag('video', [new TagAttribute('type', [new TagAttributeValue('video/webm', true), new TagAttributeValue('video/ogg', true)], true)], true);
    var audioTagFirefox3_5 = new Tag('audio', [new TagAttribute('type', [new TagAttributeValue('audio/ogg', true), new TagAttributeValue('audio/wav', true)], true)], true);
    var firefox3_5 = new BrowserVersion('3.5', [videoTagFirefox3_5, audioTagFirefox3_5]);

    var inputTagFirefox4 = new Tag('input', [new TagAttribute('placeholder',[], true), new TagAttribute('required', [], true)], false);
    var sectionTagFirefox4 = new Tag('section', [], true);
    var articleTagFirefox4 = new Tag('article', [], true);
    var asideTagFirefox4 = new Tag('aside', [], true);
    var headerTagFirefox4 = new Tag('header', [], true);
    var footerTagFirefox4 = new Tag('footer', [], true);
    var svgTagFirefox4 = new Tag('svg', [], true);
    var datalistTagFirefox4 = new Tag('datalist', [], true);
    var firefox4 = new BrowserVersion('4.0', [sectionTagFirefox4, articleTagFirefox4, asideTagFirefox4, headerTagFirefox4, footerTagFirefox4, svgTagFirefox4, inputTagFirefox4, datalistTagFirefox4]);

    var progressTagFirefox16 = new Tag('progress', [], true);
    var meterTagFirefox16 = new Tag('meter', [], true);
    var firefox16 = new BrowserVersion('16.0', [progressTagFirefox16, meterTagFirefox16]);

    var anchorTagFirefox20 = new Tag('a', [new TagAttribute('download', [], true)], false);
    var firefox20 = new BrowserVersion('20.0', anchorTagFirefox20);

    var videoTagFirefox21 = new Tag('video', [new TagAttribute('type', [new TagAttributeValue('video/mp4', true)], false)], false);
    var audioTagFirefox21 = new Tag('audio', [new TagAttribute('type', [new TagAttributeValue('audio/mpeg', true)], false)], false);
    var firefox21 = new BrowserVersion('21.0', [videoTagFirefox21, audioTagFirefox21]);

    var templateTagFirefox22 = new Tag('template', [], true);
    var firefox22 = new BrowserVersion('22.0', [templateTagFirefox22]);

    var inputTagFirefox23 = new Tag('input', [new TagAttribute('type', [new TagAttributeValue('range', true)], false)], false);
    var firefox23 = new BrowserVersion('23.0', [inputTagFirefox23]);

    var inputTagFirefox29 = new Tag('input', [new TagAttribute('type', [new TagAttributeValue('number', true), new TagAttributeValue('color', true)], false)], false);
    var firefox29 = new BrowserVersion('29.0', [inputTagFirefox29]);

    var firefox = new Browser('Mozilla Firefox', [firefox2, firefox3_5, firefox4, firefox16, firefox20, firefox21, firefox22, firefox23, firefox29]);


    //Google Chrome
    var canvasTagChrome4 = new Tag('canvas', [], true);
    var videoTagChrome4 = new Tag('video', [
            new TagAttribute(
                'type',[
                    new TagAttributeValue('video/mp4', true),
                    new TagAttributeValue('video/webm', true),
                    new TagAttributeValue('video/ogg', true)],
                true)],
        true);
    var audioTagChrome4 = new Tag('audio', [
            new TagAttribute(
                'type',[
                    new TagAttributeValue('audio/mpeg', true),
                    new TagAttributeValue('audio/ogg', true),
                    new TagAttributeValue('audio/wav', true)],
                true)],
        true);
    var inputTagChrome4 = new Tag('input', [new TagAttribute('placeholder',[], true)], false);
    var chrome4 = new BrowserVersion('4.0', [canvasTagChrome4, videoTagChrome4, audioTagChrome4, inputTagChrome4]);

    var inputTagChrome5 = new Tag('input', [new TagAttribute('type', [new TagAttributeValue('range', true)], false)], false);
    var chrome5 = new BrowserVersion('5.0', [inputTagChrome5]);

    var sectionTagChrome6 = new Tag('section', [], true);
    var articleTagChrome6 = new Tag('article', [], true);
    var asideTagChrome6 = new Tag('aside', [], true);
    var headerTagChrome6 = new Tag('header', [], true);
    var footerTagChrome6 = new Tag('footer', [], true);
    var chrome6 = new BrowserVersion('6.0', [sectionTagChrome6, articleTagChrome6, asideTagChrome6, headerTagChrome6, footerTagChrome6]);

    var svgTagChrome7 = new Tag('svg', [], true);
    var inputTagChrome7 = new Tag('input', [new TagAttribute('type', [new TagAttributeValue('number', true)], false)], false);
    var chrome7 = new BrowserVersion('7.0', [svgTagChrome7, inputTagChrome7]);

    var progressTagChrome8 = new Tag('progress', [], true);
    var meterTagChrome8 = new Tag('meter', [], true);
    var chrome8 = new BrowserVersion('8.0', [progressTagChrome8, meterTagChrome8]);

    var inputTagChrome10 = new Tag('input', [new TagAttribute('required', [], true)], false);
    var chrome10 = new BrowserVersion('10.0', [inputTagChrome10]);

    var detailsTagChrome12 = new Tag('details', [], true);
    var summaryTagChrome12 = new Tag('summary', [], true);
    var chrome12 = new BrowserVersion('12.0', [detailsTagChrome12, summaryTagChrome12]);

    var anchorTagChrome14 = new Tag('a', [new TagAttribute('download', [], true)], false);
    var chrome14 = new BrowserVersion('14.0', [anchorTagChrome14]);

    var datalistTagChrome20 = new Tag('datalist', [], true);
    var inputTagChrome20 = new Tag('input', [new TagAttribute('type', [new TagAttributeValue('color', true)], false)], false);
    var chrome20 = new BrowserVersion('20.0', [datalistTagChrome20, inputTagChrome20]);

    var templateTagChrome26 = new Tag('template', [], true);
    var chrome26 = new BrowserVersion('26.0', [templateTagChrome26]);

    var imageTagChrome34 = new Tag('img', [new TagAttribute('srcset', [], true)], false);
    var chrome34 = new BrowserVersion('34.0', [imageTagChrome34]);

    var chrome = new Browser('Google Chrome', [chrome4, chrome5, chrome6, chrome7, chrome8, chrome10, chrome12, chrome14, chrome20, chrome26, chrome34]);


    //Analyzer initialization
    var htmlCompatibilityAnalyzer = new Analyzer([ie, firefox, chrome]);

    console.log('ie name: ' + ie._name);
    console.log('is audio in ie9: ' + ie9.isSupportFromThisVersion('auDIO'));
    console.log('ie versions: ' +ie.getVersionsIdentifiers());
    console.log('ie tags: ' + ie.getTags());
    console.log('when canvas supported in ie: ' + ie.whenSupportAddedFor('canvas'));

    //TODO: print where is the tag supported

    var tags = htmlCompatibilityAnalyzer.getDocumentTags();
    console.log('your website can work in lowest version of IE (all tags):' + ie.getLowestSupportedVersionForAllTags(tags));
    console.log('your website can work in lowest version of IE (known tags only):' + ie.getLowestSupportedVersionForKnownTags(tags));

    for (var tagId = 0 ; tagId < tags.length; tagId++) {
        console.log(tags[tagId]);
    }

    var browsersInfo = htmlCompatibilityAnalyzer.getBrowserSupportInfo();

    console.log('This page is available in these browsers:');
    for (var browserInfoId = 0; browserInfoId < browsersInfo.length; browserInfoId++) {
        console.log(browsersInfo[browserInfoId]._name + ' ' + browsersInfo[browserInfoId]._version + '+');
    }

    var tagsSupportInfo = htmlCompatibilityAnalyzer.getBrowserSupportInfoForEachTag();
    for (var id = 0; id < tagsSupportInfo.length; id++) {
        var browserInfo = '|';

        for (var browserId = 0; browserId < tagsSupportInfo[id]._browsersInfo.length; browserId++) {
            browserInfo += tagsSupportInfo[id]._browsersInfo[browserId]._name + ' ' + tagsSupportInfo[id]._browsersInfo[browserId]._version + '|';
        }
        console.log(tagsSupportInfo[id]._tag + ': ' + browserInfo);


    }
})();