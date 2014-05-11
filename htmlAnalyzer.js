// Analyzer
function Analyzer(browsers) {
    this._browsers = browsers;
    this._documentTags = [];
    var _ignoredAttributesValues = ['class', 'src', 'id', 'width', 'height', 'placeholder'];

    var collectDocumentTags = function(analyzer, parent) {
        parent = typeof parent !== 'undefined' ? parent : document.querySelector('body');

        if (parent.tagName !== 'undefined' && analyzer._documentTags.indexOf(parent.tagName.toLowerCase()) === -1) {
            var tag = analyzer._documentTags.filter(function(t) {return t._tag === parent.tagName.toLocaleLowerCase()});

            if (tag.length === 0) {
                tag = new Tag(parent.tagName.toLowerCase(), []);
                collectTagAttributes(parent, tag);
                analyzer._documentTags.push(tag);
            } else {
                collectTagAttributes(parent, tag[0]);
            }
        }

        var children = parent.children;

        if (children.length > 0) {
            for (var id = 0; id < children.length; id++) {
                collectDocumentTags(analyzer, children[id]);
            }
        }
    };

    var collectTagAttributes = function(element, tag) {
        var attributes = element.attributes;
        for (var id = 0; id < attributes.length; id++) {
            (function()
            {
                var name = attributes[id].nodeName.toLowerCase();
                var existingAttribute = tag._attributes.filter(function (a) {return a._attribute === name});
                var value = attributes[id].nodeValue.toLowerCase();
                value = value !== '' && _ignoredAttributesValues.indexOf(name) == -1 ? value : '';

                if (existingAttribute.length === 0) {
                    tag._attributes.push(new TagAttribute(name, value === '' ? [] : [new TagAttributeValue(value)]));
                } else {
                    existingAttribute = existingAttribute[0];

                    if (value !== '') {
                        var existingValue = existingAttribute._values.filter(function (v) {return v._value === value});

                        if (existingValue.length === 0) {
                            existingAttribute._values.push(new TagAttributeValue(value))
                        }
                    }
                }
            })();
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
            var tagsVersion = this._browsers[id].getLowestSupportedVersionForKnownTags(tags);
            var attributesVersion = this._browsers[id].getLowestSupportedVersionForKnownAttributes(tags);
            var valuesVersion = this._browsers[id].getLowestSupportedVersionForKnownValues(tags);

            var versions = this._browsers[id].getVersionsIdentifiers();
            for (var versionId = versions.length - 1; versionId >= 0; versionId--) {
                var version = null;
                if (versions[versionId] === tagsVersion) {
                    version = tagsVersion;
                } else if (versions[versionId] === attributesVersion) {
                    version = attributesVersion;
                } else if (versions[versionId] === valuesVersion) {
                    version = valuesVersion;
                }

                if (version != null) {
                    supportedBrowsers.push(new BrowserInfo(name, version));
                    break;
                }

            }


        }

        return supportedBrowsers;
    };

    this.getBrowserSupportInfoForTag = function(tag) {
        var tagInfo = new HtmlEntitySupportInfo(tag._tag, []);

        for (var browserId = 0; browserId < this._browsers.length; browserId++) {
            var name = this._browsers[browserId]._name;
            var version = this._browsers[browserId].whenSupportAddedForTag(tag._tag.toLowerCase());

            if (version !== '') {
                tagInfo._browsersInfo.push(new BrowserInfo(name, version));
            }
        }

        return tagInfo;
    };

    this.getBrowserSupportInfoForTagAttribute = function(tag, attribute) {
        var attributeInfo = new HtmlEntitySupportInfo(attribute._attribute, []);

        for (var browserId = 0; browserId < this._browsers.length; browserId++) {
            var name = this._browsers[browserId]._name;
            var version = this._browsers[browserId].whenSupportAddedForTagAttribute(tag._tag.toLowerCase(), attribute._attribute.toLowerCase());

            if (version !== '') {
                attributeInfo._browsersInfo.push(new BrowserInfo(name, version));
            }
        }

        return attributeInfo;
    };

    this.getBrowserSupportInfoForTagAttributeValue = function(tag, attribute, value) {
        var valueInfo = new HtmlEntitySupportInfo(value._value, []);

        for (var browserId = 0; browserId < this._browsers.length; browserId++) {
            var name = this._browsers[browserId]._name;
            var version = this._browsers[browserId].whenSupportAddedForTagAttributeValue(tag._tag.toLowerCase(), attribute._attribute.toLowerCase(), value._value.toLowerCase());

            if (version !== '') {
                valueInfo._browsersInfo.push(new BrowserInfo(name, version));
            }
        }

        return valueInfo;
    };
}

// Information
function BrowserInfo(name, version) {
    this._name = name;
    this._version = version;
}


function HtmlEntitySupportInfo(tag, browsersInfo) {
    this._name = tag;
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

    var getTags = function(browser) {
        var tags = [];

        for (var versionId = 0; versionId < browser._versions.length; versionId++) {
            var versionTags = browser._versions[versionId]._tags;

            for (var tagId = 0; tagId < versionTags.length; tagId++) {
                if (tags.indexOf(versionTags[tagId]._tag === -1)) {
                    tags.push(versionTags[tagId]);
                }
            }
        }

        return tags;
    };

    var isTagSupported = function(browser, tagName) {
        var tags = getTags(browser);

        return tags.indexOf(tagName.toLowerCase()) !== -1;
    };

    this.whenSupportAddedForTag = function(tagName) {
        var version = '';

        for (var id = 0 ; id < this._versions.length; id++) {
            if (this._versions[id].isTagSupportedFromThisVersion(tagName.toLowerCase())) {
                version = this._versions[id]._identifier;

                break;
            }
        }

        return version;
    };

    this.whenSupportAddedForTagAttribute = function(tagName, attributeName) {
        var version = '';

        for (var id = 0 ; id < this._versions.length; id++) {
            if (this._versions[id].isAttributeSupportedFromThisVersion(tagName.toLowerCase(), attributeName.toLowerCase())) {
                version = this._versions[id]._identifier;
                break;
            }
        }

        return version;
    };

    this.whenSupportAddedForTagAttributeValue = function(tagName, attributeName, value) {
        var version = '';

        for (var id = 0 ; id < this._versions.length; id++) {
            if (this._versions[id].isValueSupportedFromThisVersion(tagName.toLowerCase(), attributeName.toLowerCase(), value.toLowerCase())) {
                version = this._versions[id]._identifier;
                break;
            }
        }

        return version;
    };

    this.getLowestSupportedVersionForKnownTags = function(tags) {
        var versions = this.getVersionsIdentifiers();
        var lowestSupportedVersionId = 0;

        for (var id = 0; id < tags.length; id++) {
            var tagName = tags[id]._tag.toLowerCase();


            if (isTagSupported(this, tagName)) {

                var supportedVersion = this.whenSupportAddedForTag(tagName);

                var supportedVersionId = versions.indexOf(supportedVersion);

                if (supportedVersionId > lowestSupportedVersionId) {
                    lowestSupportedVersionId = supportedVersionId;
                }
            }
        }

        return versions[lowestSupportedVersionId];
    };

    this.getLowestSupportedVersionForKnownAttributes = function (tags) {
        var versions = this.getVersionsIdentifiers();
        var lowestSupportedVersionId = 0;

        for (var id = 0; id < tags.length; id++) {
            var tag = tags[id];

            for (var attributeId = 0; attributeId < tag._attributes.length; attributeId++) {
                var supportedVersion = this.whenSupportAddedForTagAttribute(tag._tag.toLowerCase(), tag._attributes[attributeId]._attribute.toLowerCase());
                var supportedVersionId = versions.indexOf(supportedVersion);

                if (supportedVersionId > lowestSupportedVersionId) {
                    lowestSupportedVersionId = supportedVersionId;
                }
            }
        }

        return versions[lowestSupportedVersionId];
    };

    this.getLowestSupportedVersionForKnownValues = function(tags) {
        var versions = this.getVersionsIdentifiers();
        var lowestSupportedVersionId = 0;

        for (var id = 0; id < tags.length; id++) {
            var tag = tags[id];

            for (var attributeId = 0; attributeId < tag._attributes.length; attributeId++) {
                var attribute = tag._attributes[attributeId];
                for (var valueId = 0; valueId < attribute._values.length; valueId++) {
                    var supportedVersion = this.whenSupportAddedForTagAttributeValue(tag._tag.toLowerCase(), attribute._attribute.toLowerCase(), attribute._values[valueId]._value.toLowerCase());
                    var supportedVersionId = versions.indexOf(supportedVersion);

                    if (supportedVersionId > lowestSupportedVersionId) {
                        lowestSupportedVersionId = supportedVersionId;
                    }
                }
            }
        }

        return versions[lowestSupportedVersionId];
    }
}


//Version
function BrowserVersion(identifier, tags) {
    this._identifier = identifier;
    this._tags = tags;

    for (var id = 0; id < tags.length; id++) {
        this._tags[id]._tag = this._tags[id]._tag.toLowerCase();
    }

    this.isTagSupportedFromThisVersion = function(tagName) {
        return this._tags.filter(function(t){return t._tag.toLowerCase() === tagName.toLowerCase()}).length > 0;
    };

    this.isAttributeSupportedFromThisVersion = function(tagName, attributeName) {
        var isSupported = false;
        var tags = this._tags.filter(function(t){return t._tag.toLowerCase() === tagName.toLowerCase()});

        for (var id = 0; id < tags.length && !isSupported; id++) {
            var existingAttribute = tags[id]._attributes.filter(function(a) {return a._attribute.toLowerCase() === attributeName.toLowerCase()});
            isSupported = existingAttribute.length > 0;
        }

        return isSupported;
    };
    
    this.isValueSupportedFromThisVersion = function (tagName, attributeName, value) {
        var isSupported = false;
        var tags = this._tags.filter(function(t){return t._tag.toLowerCase() === tagName.toLowerCase()});

        for (var id = 0; id < tags.length && !isSupported; id++) {
            var existingAttributes = tags[id]._attributes.filter(function(a) {return a._attribute.toLowerCase() === attributeName.toLowerCase()});

            for (var attributeId = 0; attributeId < existingAttributes.length && !isSupported; attributeId++) {
                var existingValues = existingAttributes[attributeId]._values.filter(function(v) {return v._value.toLowerCase() === value.toLowerCase()});
                isSupported = existingValues.length > 0;
            }
        }

        return isSupported;
    }
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


//Presenter
var Presenter = function() {
    var isNavigatorSupportingStyling = navigator.userAgent.toLowerCase().indexOf('chrome') != -1;
    var styleForHtmlEntityTitle = 'font-style: italic; color: #00bb00';
    var styleForInfoSection = 'font-weight: 700; color: #0000bb';

    var createAnalyzer = function () {
        if (typeof analyzer !== 'undefined') {
            return analyzer;
        }

        //Internet Explorer
        var inputTagIe1 = new Tag('input', [new TagAttribute('type', [], true)], true);
        var bodyTagIe1 = new Tag('body', [], true);
        var ie1 = new BrowserVersion('1.0', [inputTagIe1, bodyTagIe1]);

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
            new TagAttribute('type', [new TagAttributeValue('range', true), new TagAttributeValue ('number', true)], false),
            new TagAttribute('placeholder', [], true),
            new TagAttribute('required', [], true)]);
        var progressTagIe10 = new Tag('progress', [], true);
        var datalistTagIe10 = new Tag('datalist', [], true);
        var ie10 = new BrowserVersion('10.0', [inputTagIe10, progressTagIe10, datalistTagIe10]);

        var ie = new Browser('Microsoft Internet Explorer', [ie1, ie9, ie10]);

        //Mozilla Firefox
        var inputTagIeFirefox1 = new Tag('input', [new TagAttribute('type', [], true)], true);
        var bodyTagFirefox1 = new Tag('body', [], true);
        var firefox1 = new BrowserVersion('1.0', [inputTagIeFirefox1, bodyTagFirefox1]);

        var canvasTagFirefox2 = new Tag('canvas', [], true);
        var firefox2 = new BrowserVersion('2.0', [canvasTagFirefox2]);

        var videoTagFirefox3_5 = new Tag('video', [new TagAttribute('type', [new TagAttributeValue('video/webm', true), new TagAttributeValue('video/ogg', true)], true)], true);
        var audioTagFirefox3_5 = new Tag('audio', [new TagAttribute('type', [new TagAttributeValue('audio/ogg', true), new TagAttributeValue('audio/wav', true)], true)], true);
        var firefox3_5 = new BrowserVersion('3.5', [videoTagFirefox3_5, audioTagFirefox3_5]);

        var inputTagFirefox4 =  new Tag('input', [new TagAttribute('placeholder', [], true), new TagAttribute('required', [], true)], false);
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
        var firefox20 = new BrowserVersion('20.0', [anchorTagFirefox20]);

        var videoTagFirefox21 = new Tag('video', [new TagAttribute('type', [new TagAttributeValue('video/mp4', true)], false)], false);
        var audioTagFirefox21 = new Tag('audio', [new TagAttribute('type', [new TagAttributeValue('audio/mpeg', true)], false)], false);
        var firefox21 = new BrowserVersion('21.0', [videoTagFirefox21, audioTagFirefox21]);

        var templateTagFirefox22 = new Tag('template', [], true);
        var firefox22 = new BrowserVersion('22.0', [templateTagFirefox22]);

        var inputTagFirefox23 = new Tag('input', [new TagAttribute('type', [new TagAttributeValue('range', true)], false)], false);
        var firefox23 = new BrowserVersion('23.0', [inputTagFirefox23]);

        var inputTagFirefox29 = new Tag('input', [new TagAttribute('type', [new TagAttributeValue('number', true), new TagAttributeValue('color', true)], false)], false);
        var firefox29 = new BrowserVersion('29.0', [inputTagFirefox29]);

        var firefox = new Browser('Mozilla Firefox', [firefox1, firefox2, firefox3_5, firefox4, firefox16, firefox20, firefox21, firefox22, firefox23, firefox29]);


        //Google Chrome
        var inputTagChrome1 = new Tag('input', [new TagAttribute('type', [], true)], true);
        var bodyTagChrome1 = new Tag('body', [], true);
        var chrome1 = new BrowserVersion('1.0', [inputTagChrome1, bodyTagChrome1]);

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
        var inputTagChrome4 = new Tag('input', [new TagAttribute('placeholder', [], true)], false);
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

        var chrome = new Browser('Google Chrome', [chrome1, chrome4, chrome5, chrome6, chrome7, chrome8, chrome10, chrome12, chrome14, chrome20, chrome26, chrome34]);

        //Analyzer initialization
        return new Analyzer([ie, firefox, chrome]);
    };

    var analyzer = createAnalyzer();

    this.showHtmlEntitiesInDocument = function() {
        var tags = analyzer.getDocumentTags();
        if (isNavigatorSupportingStyling) {
            console.log('%cTag[attribute=value] found in this page:', styleForInfoSection);
        } else {
            console.log('Tag[attribute=value] found in this page:');
        }

        for (var id = 0; id < tags.length; id++) {
            var tag = tags[id];
            var tagAttributes = [];

            for (var attributeId = 0; attributeId < tag._attributes.length; attributeId++) {
                var attribute = tag._attributes[attributeId];
                var attributeInfo = '[' + attribute._attribute;

                if (attribute._values.length > 0) {
                    var attributeValues = [];

                    for (var valueId = 0; valueId < attribute._values.length; valueId++) {
                        attributeValues.push(attribute._values[valueId]._value);
                    }

                    attributeInfo += ' = ' + attributeValues. join(' | ');
                }

                attributeInfo += ']';
                tagAttributes.push(attributeInfo);
            }

            console.log(tag._tag, tagAttributes.join(', '));
        }

        console.log('');
    };

    this.showHtmlPageSupportInfoByBrowsers = function () {
        var browsersInfo = analyzer.getBrowserSupportInfo();

        if (isNavigatorSupportingStyling) {
            console.log('%cThis page is available in these browsers:', styleForInfoSection);
        } else {
            console.log('This page is available in these browsers:');
        }

        for (var browserInfoId = 0; browserInfoId < browsersInfo.length; browserInfoId++) {
            console.log(browsersInfo[browserInfoId]._name + ' ' + browsersInfo[browserInfoId]._version + '+');
        }

        console.log('');
    };

    this.showHtmlEntitiesSupportInfo = function() {
        var tags = analyzer.getDocumentTags();

        if (isNavigatorSupportingStyling) {
            console.log('%cPage tags, attributes and values support by each browser:', styleForInfoSection);
            console.log('%cTags:', styleForHtmlEntityTitle);
        } else {
            console.log('Page tags, attributes and values support by each browser:');
            console.log('Tags:');
        }

        for (var id = 0; id < tags.length; id++) {
            var tagSupportInfo = analyzer.getBrowserSupportInfoForTag(tags[id]);
            var tagBrowserInfo = '|';

            for (var tagBrowserId = 0; tagBrowserId < tagSupportInfo._browsersInfo.length; tagBrowserId++) {
                tagBrowserInfo += tagSupportInfo._browsersInfo[tagBrowserId]._name + ' ' + tagSupportInfo._browsersInfo[tagBrowserId]._version + '|';
            }
            console.log(tagSupportInfo._name + ':' +tagBrowserInfo);

            if (tags[id]._attributes.length > 0) {
                if (isNavigatorSupportingStyling) {
                    console.log('%c\tAttributes:', styleForHtmlEntityTitle);
                } else {
                    console.log('\tAttributes:');
                }

                for (var attributeId = 0; attributeId < tags[id]._attributes.length; attributeId++) {
                    var attributeSupportInfo = analyzer.getBrowserSupportInfoForTagAttribute(tags[id], tags[id]._attributes[attributeId]);
                    var attributeBrowsersInfo = '|';
                    for (var attributeBrowserId = 0; attributeBrowserId < attributeSupportInfo._browsersInfo.length; attributeBrowserId++) {
                        attributeBrowsersInfo += attributeSupportInfo._browsersInfo[attributeBrowserId]._name + ' ' + attributeSupportInfo._browsersInfo[attributeBrowserId]._version + '|';
                    }
                    console.log('\t' + attributeSupportInfo._name + ':' + attributeBrowsersInfo);

                    if (tags[id]._attributes[attributeId]._values.length > 0) {
                        if (isNavigatorSupportingStyling) {
                            console.log('%c\t\tValues:', styleForHtmlEntityTitle);
                        } else {
                            console.log('\t\tValues:');
                        }

                        for (var valueId = 0; valueId < tags[id]._attributes[attributeId]._values.length; valueId++) {
                            var value = tags[id]._attributes[attributeId]._values[valueId];
                            var valueSupportInfo = analyzer.getBrowserSupportInfoForTagAttributeValue(tags[id], tags[id]._attributes[attributeId], value);
                            var valueBrowsersInfo = valueSupportInfo._name + ': |';

                            for (var browserId = 0; browserId < valueSupportInfo._browsersInfo.length; browserId++) {
                                valueBrowsersInfo += valueSupportInfo._browsersInfo[browserId]._name + ' ' + valueSupportInfo._browsersInfo[browserId]._version + '|';
                            }

                            console.log('\t\t' + valueBrowsersInfo);
                        }
                    }
                }
            }
        }

        console.log('');
    }
};



(function() {
    var htmlCompatibilityAnalyzerPresenter = new Presenter();

    htmlCompatibilityAnalyzerPresenter.showHtmlEntitiesInDocument();
    htmlCompatibilityAnalyzerPresenter.showHtmlEntitiesSupportInfo()
    htmlCompatibilityAnalyzerPresenter.showHtmlPageSupportInfoByBrowsers();
})();