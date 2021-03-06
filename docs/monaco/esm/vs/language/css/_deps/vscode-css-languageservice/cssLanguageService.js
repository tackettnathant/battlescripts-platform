/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import { Parser } from './parser/cssParser.js';
import { CSSCompletion } from './services/cssCompletion.js';
import { CSSHover } from './services/cssHover.js';
import { CSSNavigation } from './services/cssNavigation.js';
import { CSSCodeActions } from './services/cssCodeActions.js';
import { CSSValidation } from './services/cssValidation.js';
import { SCSSParser } from './parser/scssParser.js';
import { SCSSCompletion } from './services/scssCompletion.js';
import { LESSParser } from './parser/lessParser.js';
import { LESSCompletion } from './services/lessCompletion.js';
import { getFoldingRanges } from './services/cssFolding.js';
import { CSSDataManager } from './languageFacts/dataManager.js';
import { CSSDataProvider } from './languageFacts/dataProvider.js';
import { getSelectionRanges } from './services/cssSelectionRange.js';
import { SCSSNavigation } from './services/scssNavigation.js';
import { cssData } from './data/webCustomData.js';
export * from './cssLanguageTypes.js';
export function getDefaultCSSDataProvider() {
    return newCSSDataProvider(cssData);
}
export function newCSSDataProvider(data) {
    return new CSSDataProvider(data);
}
function createFacade(parser, completion, hover, navigation, codeActions, validation, cssDataManager) {
    return {
        configure: function (settings) {
            validation.configure(settings);
            completion.configure(settings === null || settings === void 0 ? void 0 : settings.completion);
            hover.configure(settings === null || settings === void 0 ? void 0 : settings.hover);
        },
        setDataProviders: cssDataManager.setDataProviders.bind(cssDataManager),
        doValidation: validation.doValidation.bind(validation),
        parseStylesheet: parser.parseStylesheet.bind(parser),
        doComplete: completion.doComplete.bind(completion),
        doComplete2: completion.doComplete2.bind(completion),
        setCompletionParticipants: completion.setCompletionParticipants.bind(completion),
        doHover: hover.doHover.bind(hover),
        findDefinition: navigation.findDefinition.bind(navigation),
        findReferences: navigation.findReferences.bind(navigation),
        findDocumentHighlights: navigation.findDocumentHighlights.bind(navigation),
        findDocumentLinks: navigation.findDocumentLinks.bind(navigation),
        findDocumentLinks2: navigation.findDocumentLinks2.bind(navigation),
        findDocumentSymbols: navigation.findDocumentSymbols.bind(navigation),
        doCodeActions: codeActions.doCodeActions.bind(codeActions),
        doCodeActions2: codeActions.doCodeActions2.bind(codeActions),
        findDocumentColors: navigation.findDocumentColors.bind(navigation),
        getColorPresentations: navigation.getColorPresentations.bind(navigation),
        doRename: navigation.doRename.bind(navigation),
        getFoldingRanges: getFoldingRanges,
        getSelectionRanges: getSelectionRanges
    };
}
var defaultLanguageServiceOptions = {};
export function getCSSLanguageService(options) {
    if (options === void 0) { options = defaultLanguageServiceOptions; }
    var cssDataManager = new CSSDataManager(options);
    return createFacade(new Parser(), new CSSCompletion(null, options, cssDataManager), new CSSHover(options && options.clientCapabilities, cssDataManager), new CSSNavigation(options && options.fileSystemProvider), new CSSCodeActions(cssDataManager), new CSSValidation(cssDataManager), cssDataManager);
}
export function getSCSSLanguageService(options) {
    if (options === void 0) { options = defaultLanguageServiceOptions; }
    var cssDataManager = new CSSDataManager(options);
    return createFacade(new SCSSParser(), new SCSSCompletion(options, cssDataManager), new CSSHover(options && options.clientCapabilities, cssDataManager), new SCSSNavigation(options && options.fileSystemProvider), new CSSCodeActions(cssDataManager), new CSSValidation(cssDataManager), cssDataManager);
}
export function getLESSLanguageService(options) {
    if (options === void 0) { options = defaultLanguageServiceOptions; }
    var cssDataManager = new CSSDataManager(options);
    return createFacade(new LESSParser(), new LESSCompletion(options, cssDataManager), new CSSHover(options && options.clientCapabilities, cssDataManager), new CSSNavigation(options && options.fileSystemProvider), new CSSCodeActions(cssDataManager), new CSSValidation(cssDataManager), cssDataManager);
}
