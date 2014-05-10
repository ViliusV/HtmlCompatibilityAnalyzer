// Analyzer
function Analyzer(browsers) {
    this._browsers = browsers;
    this._documentTags = [];

    var collectDocumentTags = function(parent) {
        parent = typeof parent !== 'undefined' ? parent : document.getElementsByTagName('body')[0];

        if (parent.tagName !== 'undefined' && this._documentTags.indexOf(parent.tagName.toLowerCase()) === -1) {
            this._documentTags.push(parent.tagName.toLowerCase());
        }

        var children = parent.children;

        if (children.length > 0) {
            for (var id = 0; id < children.length; id++) {
                collectDocumentTags(children[id]);
            }
        }
    };

    this.getDocumentTags = function() {
        if (this._documentTags.length === 0) {
            collectDocumentTags();
        }

        return this._documentTags;
    };

    this.getBrowserSupportInfo = function() {
        var tags = this.getDocumentTags();
        var supportedBrowsers = [];

        for (var id = 0; id < this._browsers.length; id++) {
            var name = this._browsers[id]._name;
            var version = this._browsers[id].getLowestSupportedVersionForKnownTags(tags); //TODO: maybe use function for all tags

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
    this._tags = tags;

    for (var id = 0; id < tags.length; id++) {
        this._tags.push(tags[id].toLowerCase());
    }

    this.isSupportFromThisVersion = function(tag) {
        return this._tags.indexOf(tag.toLowerCase()) !== -1;
    };
}


//INFO apie tai, kokoiose narsyklese ir ju versijose prieinamas puslapis pvz 
/*

IE9, Chrome5 ff9

div ie4, chrome 1, ff 1
audio ie9, chrome5, ff9
video ie8, chrome5, ff7

*/

var Tag = function(tag, attributes, isNew) {
    this._tag = tag.toLowerCase();
    this._attributes = attributes || [];
    this._isNew = isNew || false;
}

var TagAttribute = function(attribute, values, isNew){
    this._attribute = attribute.toLowerCase();
    this._values = values || [];
    this._isNew = isNew || false;

};

var TagAttributeValue = function(value, isNew) {
    this._value = value;
    this._isNew = isNew || false;
}

(function(w) {


    //
    var ie8 = new BrowserVersion('8.0.1', ['script', 'div']);
    var ie9 = new BrowserVersion('9.0', ['div', 'VidEO', 'canvas', 'audio', 'article']);
    var ie10 = new BrowserVersion('10.1.0.1', ['canvas']);
    var ie = new Browser('Internet Explorer', [ie8, ie9, ie10]);


    var chrome3 = new BrowserVersion('3.0', ['script', 'audio', 'div']);
    var chrome4 = new BrowserVersion('4.0', ['canvas', 'script', 'audio', 'div']);
    var chrome6 = new BrowserVersion('6.0', ['script', 'audio', 'div', 'article']);
    var chrome12 = new BrowserVersion('12.2.2.', ['div', 'VidEO', 'canvas']);
    var chrome15 = new BrowserVersion('10.1.0.1', ['canvas']);
    var chrome = new Browser('Google Chrome', [chrome3, chrome4, chrome6, chrome12, chrome15]);


    var ff2 = new BrowserVersion('2.0', ['canvas', 'script', 'audio', 'div']);
    var ff35 = new BrowserVersion('3.5', ['script', 'audio', 'div']);
    var ff4 = new BrowserVersion('4.0', ['script', 'audio', 'div', 'article']);
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








    //browser tags turėtų saugoti objektus iš tag'o ir jo palaikomų atributų su reikšmėmis. pvz

    //Internet Explorer
    var sectionTagIe9 = new Tag('section', [], true);
    var articleTagIe9 = new Tag('article', [], true);
    var asideTagIe9 = new Tag('aside', [], true);
    var headerTagIe9 = new Tag('header', [], true);
    var footerTagIe9 = new Tag('footer', [], true);
    var canvasTagIe9 = new Tag('canvas', [], true);
    var videoTagIe9 = new Tag('video', [new TagAttribute('type',  [new TagAttributeValue('video/mp4', true)], true)], true);
    var audioTagIe9 = new Tag('audio', [new TagAttribute('type', [new TagAttributeValue('audio/mpeg', true)], true)], true)
    var svgTagIe9 = new Tag('svg', [], true);
    var ie9 = new BrowserVersion('9.0', [sectionTagIe9, articleTagIe9, asideTagIe9, headerTagIe9, footerTagIe9, canvasTagIe9, videoTagIe9, audioTagIe9, svgTagIe9]);

    var inputTagIe10 = new Tag('input', [
        new TagAttribute('type', [new TagAttributeValue('range', true), new TagAttributeValue ('number', true)]),
        new TagAttribute('placeholder', [], true)]);
    var progressTagIe10 = new Tag('progress', [], true);
    var ie10 = new BrowserVersion('10.0', [inputTagIe10, progressTagIe10]);

    var ie = new Browser('Microsoft Internet Explorer', [ie9, ie10]);

    //Mozilla Firefox
    var canvasTagFirefox2 = new Tag('canvas', [], true);
    var firefox2 = new BrowserVersion('2.0', [canvasTagFirefox2]);

    var videoTagFirefox3_5 = new Tag('video', [new TagAttribute('type', [new TagAttributeValue('video/webm', true), new TagAttributeValue('video/ogg', true)], true)], true);
    var audioTagFirefox3_5 = new Tag('audio', [new TagAttribute('type', [new TagAttributeValue('audio/ogg', true), new TagAttributeValue('audio/wav', true)], true)], true);
    var firefox3_5 = new BrowserVersion('3.5', [videoTagFirefox3_5, audioTagFirefox3_5]);

    var inputTagFirefox4 = new Tag('input', new TagAttribute('placeholder',[], true), false);
    var sectionTagFirefox4 = new Tag('section', [], true);
    var articleTagFirefox4 = new Tag('article', [], true);
    var asideTagFirefox4 = new Tag('aside', [], true);
    var headerTagFirefox4 = new Tag('header', [], true);
    var footerTagFirefox4 = new Tag('footer', [], true);
    var svgTagFirefox4 = new Tag('svg', [], true);
    var firefox4 = new BrowserVersion('4.0', [sectionTagFirefox4, articleTagFirefox4, asideTagFirefox4, headerTagFirefox4, footerTagFirefox4, svgTagFirefox4, inputTagFirefox4]);

    var progressTagFirefox16 = new Tag('progress', [], true);
    var meterTagFirefox16 = new Tag('meter', [], true);
    var firefox16 = new BrowserVersion('16.0', [progressTagFirefox16, meterTagFirefox16]);

    var videoTagFirefox21 = new Tag('video', [new TagAttribute('type', [new TagAttributeValue('video/mp4', true)], false)], false);
    var audioTagFirefox21 = new Tag('audio', [new TagAttribute('type', [new TagAttributeValue('audio/mpeg', true)], false)], false);
    var firefox21 = new BrowserVersion('21.0', [videoTagFirefox21, audioTagFirefox21]);

    var inputTagFirefox23 = new Tag('input', [new TagAttribute('type', [new TagAttributeValue('range', true)], false)], false);
    var firefox23 = new BrowserVersion('23.0', [inputTagFirefox23]);

    var firefox = new Browser('Mozilla Firefox', [firefox2, firefox3_5, firefox4, firefox16, firefox21, firefox23]);


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
    var inputTagChrome4 = new Tag('input', new TagAttribute('placeholder',[], true), false);
    var chrome4 = new BrowserVersion('4.0', [canvasTagChrome4, videoTagChrome4, audioTagChrome4, inputTagChrome4]);

    var inputTagChrome5 = new Tag('input', [new TagAttribute('type', [new TagAttributeValue('range', true)], false)], false);
    var chrome5 = new BrowserVersion('5.0', [inputTagChrome5]);

    var sectionTagChrome6 = new Tag('section', [], true);
    var articleTagChrome6 = new Tag('article', [], true);
    var asideTagChrome6 = new Tag('aside', [], true);
    var headerTagChrome6 = new Tag('header', [], true);
    var footerTagChrome6 = new Tag('footer', [], true);
    var chrome6 = new BrowserVersion('6.0', [sectionTagChrome6, articleTagChrome6, asideTagChrome6, headerTagChrome6, footerTagChrome6]);

    var svg = new Tag('svg', [], true);
    var chrome7 = new BrowserVersion('7.0', [svg]);

    var progressTagChrome8 = new Tag('progress', [], true);
    var meterTagChrome8 = new Tag('meter', [], true);
    var chrome8 = new BrowserVersion('8.0', [progressTagChrome8, meterTagChrome8]);

    var chrome = new Browser('Google Chrome', [chrome4, chrome5, chrome6, chrome7, chrome8]);



    var htmlCompatibilityAnalyzer = new Analyzer([ie, firefox, chrome]);
})(window);