/*
Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

This  program is free software;
you can redistribute it and/or modify it under the terms of the
GNU General Public License as published by the Free Software Foundation;
either version 3 of the License, or any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
*/

/*
Changes:
Doc reviewed ...
Tests ...
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@file Sanitizer.js
@copyright Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/
@license GNU General Public License
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

/**
@------------------------------------------------------------------------------------------------------------------------------

@module coreLib
@private

@------------------------------------------------------------------------------------------------------------------------------
*/

import { NOT_FOUND, ZERO } from '../main/Constants.js';

/**
@------------------------------------------------------------------------------------------------------------------------------

@class Sanitizer
@classdesc coming soon...
@hideconstructor

@------------------------------------------------------------------------------------------------------------------------------
*/

class Sanitizer {

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	This method verify that a string contains a valid url.
	A valid url must not contains html tags or html entities or invalid characters
	and must start with a valid protocol
	Valid protocols are http: and https:. For href attributes mailto:, sms: and tel: are also valid
	and for src attributes, data: is also valid.
	sms: and tel: url's  must start with a + and contains only digits, *, # or space
	@param {string} urlString The url to validate
	@param {attributeName} attributeName The attribute name in witch the url will be placed. must be 'src' or
	null (in this case 'href' is used as default)
	@return {object} a UrlValidationReult with the result of the validation
	*/

	sanitizeToUrl ( urlString, attributeName = 'href' ) {
		const parseResult = new DOMParser ( ).parseFromString ( '<div>' + urlString + '</div>', 'text/html' );
		if ( ! parseResult || '\u0023document' !== parseResult.nodeName ) {
			return { url : '', errorsString : 'Parsing error' };
		}
		const resultNode = parseResult.body.firstChild;
		let newUrlString = '';
		for ( let nodeCounter = 0; nodeCounter < resultNode.childNodes.length; nodeCounter ++ ) {
			if ( '\u0023text' === resultNode.childNodes [ nodeCounter ].nodeName ) {
				newUrlString += resultNode.childNodes [ nodeCounter ].nodeValue;
			}
			else {
				return { url : '', errorsString : 'Invalid characters found in the url' };
			}
		}
		newUrlString = newUrlString
			.replaceAll ( /</g, '' )
			.replaceAll ( />/g, '' )
			.replaceAll ( /"/g, '' )
			.replaceAll ( /\u0027/g, '' )
			.replaceAll ( /&lt;/g, '' )
			.replaceAll ( /&gt;/g, '' )
			.replaceAll ( /&quot;/g, '' )
			.replaceAll ( /&apos;/g, '' )
			.replaceAll ( /%3C/g, '' )
			.replaceAll ( /%3c/g, '' )
			.replaceAll ( /%3E/g, '' )
			.replaceAll ( /%3e/g, '' )
			.replaceAll ( /%22/g, '' )
			.replaceAll ( /%27/g, '' );
		if ( newUrlString !== urlString ) {
			return { url : '', errorsString : 'Invalid characters found in the url' };
		}

		const validProtocols = [ 'https:' ];
		if ( 'http:' === window.location.protocol || 'href' === attributeName ) {
			validProtocols.push ( 'http:' );
		}
		if ( 'href' === attributeName ) {
			validProtocols.push ( 'mailto:' );
			validProtocols.push ( 'sms:' );
			validProtocols.push ( 'tel:' );
			const urlHash = newUrlString.match ( /^\u0023\w*/ );
			if ( urlHash && newUrlString === urlHash [ ZERO ] ) {
				return { url : newUrlString, errorsString : '' };
			}
		}
		if ( 'src' === attributeName ) {
			validProtocols.push ( 'data:' );
		}
		let url = null;
		try {
			url = new URL ( newUrlString );
		}
		catch ( err ) {
			return { url : '', errorsString : 'Invalid url string' };
		}
		if ( NOT_FOUND === validProtocols.indexOf ( url.protocol ) ) {
			return { url : '', errorsString : 'Invalid protocol ' + url.protocol };
		}
		if ( NOT_FOUND !== [ 'sms:', 'tel:' ].indexOf ( url.protocol ) ) {
			if ( url.pathname.match ( /^\+[0-9,*,\u0023]*$/ ) ) {
				return { url : newUrlString, errorsString : '' };
			}
		}
		try {
			encodeURIComponent ( url.href );
		}
		catch ( err ) {
			return { url : '', errorsString : 'Invalid character in url' };
		}
		return { url : newUrlString, errorsString : '' };
	}

	/**
	Remove all html tags from a string and replace htmlEntities and < > ' " and nbsp chars with others similar unicode chars
	@param {string} stringToSanitize the string to transform
	@return {string} a string with html tags removed and htmlEntities and < >' " and nbsp chars replaced
	*/

	sanitizeToJsString ( stringToSanitize ) {
		const parseResult = new DOMParser ( ).parseFromString ( '<div>' + stringToSanitize + '</div>', 'text/html' );
		if ( ! parseResult || '\u0023document' !== parseResult.nodeName ) {
			return '';
		}
		const resultNode = parseResult.body.firstChild;
		let sanitizedString = '';
		for ( let nodeCounter = 0; nodeCounter < resultNode.childNodes.length; nodeCounter ++ ) {
			if ( '\u0023text' === resultNode.childNodes [ nodeCounter ].nodeName ) {
				sanitizedString += resultNode.childNodes [ nodeCounter ].nodeValue;
			}
			else {
				return '';
			}
		}
		sanitizedString = sanitizedString
			.replaceAll ( /</g, '\u227a' )
			.replaceAll ( />/g, '\u227b' )
			.replaceAll ( /"/g, '\u2033' )
			.replaceAll ( /\u0027/g, '\u2032' );

		return sanitizedString;
	}

	/**
	This method verify that a string describe a css color. A valid css color must start with a hash followed by 6 hex numbers
	@param {string} colorString the string to test
	@return {string} the verified color or null if the given color is invalid
	*/

	sanitizeToColor ( colorString ) {
		const newColor = colorString.match ( /^\u0023[0-9,A-F,a-f]{6}$/ );
		if ( newColor ) {
			return newColor [ ZERO ];
		}
		return null;
	}

}

export default Sanitizer;

/*
@------------------------------------------------------------------------------------------------------------------------------

end of Sanitizer.js file

@------------------------------------------------------------------------------------------------------------------------------
*/