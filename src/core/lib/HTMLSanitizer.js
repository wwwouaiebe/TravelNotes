/*
Copyright - 2017 2022 - wwwouaiebe - Contact: https://www.ouaie.be/

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
	- v2.0.0:
		- created
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

import { HTMLSanitizerData, HtmlStringValidationResult, UrlValidationResult } from '../coreLib/HTMLSanitizerData.js';

import { SVG_NS, ZERO, NOT_FOUND } from '../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class contains methods to sanitize url and string, filtering html tags and attributes
present in the string.

See theHTMLSanitizer for the one and only one instance of this class
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class HTMLSanitizer {

	/**
	the results of the #stringify method
	@type {String}
	*/

	#stringifiedHTML = '';

	/**
	the errors detected by the #stringify method
	@type {String}
	*/

	#stringifyErrors = '';

	/**
	An instance of the HTMLSanitizerData
	@type {HTMLSanitizerData}
	*/

	static #htmlSanitizerData = new HTMLSanitizerData ( );

	/**
	Replace < >' " and nbsp chars with htmlEntities
	@param {String} htmlString the string to transform
	@return {String} a string with htmlEntities
	*/

	#addHtmlEntities ( htmlString ) {
		const newHtmlString = htmlString
			.replaceAll ( /\u003c/g, '&lt;' )
			.replaceAll ( /\u003e/g, '&gt;' )
			.replaceAll ( /\u0022/g, '&quot;' )
			.replaceAll ( /\u0027/g, '&apos;' )
			.replaceAll ( /\u0a00/g, '&nbsp;' );

		return newHtmlString;
	}

	/**
	Helper method for the #stringify method. Validate an url present in a htmlString
	@param {String} url The url to validate
	@param {String} attributeName The attribute name in witch the url was found
	*/

	#stringifyUrl ( url, attributeName ) {
		const validUrl = this.sanitizeToUrl ( url, attributeName ).url;
		if ( '' === validUrl && '' !== url ) {
			this.#stringifyErrors +=
				'\nAn invalid url (' + 	url + ') was removed from a ' + attributeName + ' attribute';
		}
		else {
			this.#stringifiedHTML += ' ' + attributeName + '="' + validUrl + '"';
		}
	}

	/**
	Helper method for the #stringify method.  Validate and stringify the attributes of a svg node
	@param {SVGElement} currentNode The svg node for witch the attributes are stringified.
	@param {String} nodeName the name of the currentNode
	*/

	#stringifySvgAttributes ( currentNode, nodeName ) {
		HTMLSanitizer.#htmlSanitizerData.getValidAttributesNames ( nodeName ).forEach (
			validAttributeName => {
				if ( currentNode.hasAttributeNS ( null, validAttributeName ) ) {
					this.#stringifiedHTML += ' ' + validAttributeName + '="' +
						this.#addHtmlEntities ( currentNode.getAttributeNS ( null, validAttributeName ) ) +
						'"';
					currentNode.removeAttributeNS ( null, validAttributeName );
				}
			}
		);
	}

	/**
	Helper method for the #stringify method.  Validate and stringify the attributes of a HTML node
	@param {HTMLElement} currentNode The HTML node for witch the attributes are stringified.
	@param {String} nodeName the name of the currentNode
	*/

	#stringifyHTMLAttributes ( currentNode, nodeName ) {
		if ( currentNode.hasAttribute ( 'target' ) ) {
			this.#stringifiedHTML += ' rel="noopener noreferrer"';
		}
		HTMLSanitizer.#htmlSanitizerData.getValidAttributesNames ( nodeName ).forEach (
			validAttributeName => {
				if ( currentNode.hasAttribute ( validAttributeName ) ) {
					if ( 'href' === validAttributeName || 'src' === validAttributeName ) {
						this.#stringifyUrl ( currentNode.getAttribute ( validAttributeName ), validAttributeName );
					}
					else {
						this.#stringifiedHTML += ' ' + validAttributeName + '="' +
						this.#addHtmlEntities ( currentNode.getAttribute ( validAttributeName ) ) +
						'"';
					}
					currentNode.removeAttribute ( validAttributeName );
				}
			}
		);
	}

	/**
	Helper method for the #stringify method.  Add the removed attributes to the error string
	@param {HTMLElement} currentNode The HTML node for witch the attributes are stringified.
	*/

	#addStringifyErrors ( currentNode ) {
		for ( let attCounter = ZERO; attCounter < currentNode.attributes.length; attCounter ++ ) {
			if ( 'rel' !== currentNode.attributes [ attCounter ].name ) {
				this.#stringifyErrors +=
					'\nAn unsecure attribute ' +
					currentNode.attributes [ attCounter ].name +
					'="' +
					currentNode.attributes [ attCounter ].value +
					'" was removed.';
			}
		}
	}

	/**
	Transform a node and it's descendants into a string, removing all the invalid tags, invalid atrributes,
	invalid texts and invalid url's
	@param {HTMLElement} sourceNode The node to stringify
	*/

	#stringify ( sourceNode ) {
		const childs = sourceNode.childNodes;
		for ( let nodeCounter = 0; nodeCounter < childs.length; nodeCounter ++ ) {
			const currentNode = sourceNode.childNodes [ nodeCounter ];
			const nodeName = HTMLSanitizer.#htmlSanitizerData.getValidNodeName ( currentNode.nodeName );
			if ( '' === nodeName ) {
				this.#stringifyErrors += '\nAn invalid tag ' + currentNode.nodeName + ' was removed';
			}
			else if ( '\u0023text' === nodeName ) {
				this.#stringifiedHTML += this.#addHtmlEntities ( currentNode.nodeValue );
			}
			else {
				this.#stringifiedHTML += '<' + nodeName;
				if ( 'svg' === nodeName || 'text' === nodeName || 'polyline' === nodeName ) {
					this.#stringifySvgAttributes ( currentNode, nodeName );
				}
				else {
					this.#stringifyHTMLAttributes ( currentNode, nodeName );
				}
				this.#stringifiedHTML += '>';
				this.#stringify ( currentNode );
				this.#stringifiedHTML += '</' + nodeName + '>';
				if ( currentNode.attributes ) {
					this.#addStringifyErrors ( currentNode );
				}
			}
		}
	}

	/**
	Helper function for the #cloneNode method. Clone a svg node
	@param {SVGElement} currentNode The svg node to clone
	@param {String} nodeName The name of the currentNode
	*/

	#cloneSvg ( currentNode, nodeName ) {
		const newChildNode = document.createElementNS ( SVG_NS, nodeName );
		HTMLSanitizer.#htmlSanitizerData.getValidAttributesNames ( nodeName ).forEach (
			validAttributeName => {
				if ( currentNode.hasAttributeNS ( null, validAttributeName ) ) {
					newChildNode.setAttributeNS (
						null,
						validAttributeName,
						currentNode.getAttributeNS ( null, validAttributeName )
					);
					currentNode.removeAttributeNS ( null, validAttributeName );
				}
			}
		);
		return newChildNode;
	}

	/**
	Helper function for the #cloneNode method. Clone a HTML node
	@param {HTMLElement} currentNode The html node to clone
	@param {String} nodeName The name of the currentNode
	*/

	#cloneHTML ( currentNode, nodeName ) {
		const newChildNode = document.createElement ( nodeName );
		HTMLSanitizer.#htmlSanitizerData.getValidAttributesNames ( nodeName ).forEach (
			validAttributeName => {
				if ( currentNode.hasAttribute ( validAttributeName ) ) {
					if ( 'href' === validAttributeName || 'src' === validAttributeName ) {
						const attributeValue = this.sanitizeToUrl (
							currentNode.getAttribute ( validAttributeName ),
							validAttributeName
						).url;
						if ( '' !== attributeValue ) {
							newChildNode.setAttribute ( validAttributeName, attributeValue );
						}
					}
					else {
						newChildNode.setAttribute (
							validAttributeName,
							currentNode.getAttribute ( validAttributeName )
						);
					}
				}
			}
		);
		if ( currentNode.hasAttribute ( 'target' ) ) {
			newChildNode.setAttribute ( 'rel', 'noopener noreferrer' );
		}
		return newChildNode;
	}

	/**
	Deep clone the contains of an HTML node into another node. Only valid tags, valid attributes, valid url's
	and valid texts are cloned

	@param {HTMLElement} clonedNode The node to clone
	@param {HTMLElement} newNode The destination node
	*/

	#cloneNode ( clonedNode, newNode ) {
		const childs = clonedNode.childNodes;
		for ( let nodeCounter = 0; nodeCounter < childs.length; nodeCounter ++ ) {
			const currentNode = clonedNode.childNodes [ nodeCounter ];
			const nodeName = HTMLSanitizer.#htmlSanitizerData.getValidNodeName ( currentNode.nodeName );
			if ( '\u0023text' === nodeName ) {
				newNode.appendChild ( document.createTextNode ( currentNode.nodeValue ) );
			}
			else if ( '' !== nodeName ) {
				const newChildNode =
					'svg' === nodeName || 'text' === nodeName || 'polyline' === nodeName
						?
						this.#cloneSvg ( currentNode, nodeName )
						:
						this.#cloneHTML ( currentNode, nodeName );

				newNode.appendChild ( newChildNode );
				this.#cloneNode ( currentNode, newChildNode );
			}
		}
	}

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	This method transform a string containing html and svg tags into html and svg elements and copy these elements
	as child nodes of the targetNode. Only tags and attributes present in the HTMLSanitizerData.#validityMap variable
	are copied in the targetNode. Url in the href and src attributes must be valid url (see sanitizeToUrl method)
	@param {String} htmlString the string to transform
	@param {HTMLElement} targetNode the node in witch the created elements are placed
	*/

	sanitizeToHtmlElement ( htmlString, targetNode ) {

		const parseResult = new DOMParser ( ).parseFromString ( '<div>' + htmlString + '</div>', 'text/html' );

		const docFragment = new DocumentFragment ( );
		if ( parseResult && '\u0023document' === parseResult.nodeName ) {
			this.#cloneNode ( parseResult.body.firstChild, docFragment );
			targetNode.appendChild ( docFragment );
		}
		else {
			targetNode.textContent = '';
		}
	}

	/**
	This method clone a DOM node, removing all invalid childs and attributes
	@param {HTMLElement} htmlElement The node to clone
	@return {HTMLElement} The cloned node
	*/

	clone ( htmlElement ) {
		const clone = document.createElement ( htmlElement.tagName );
		this.#cloneNode ( htmlElement, clone );

		return clone;
	}

	/**
	This method transform a string containing html and svg tags. Tags and attributes not present in the
	HTMLSanitizerData.#validityMap variable are removed. Invalid Url in the href and src attributes are
	also removed (see sanitizeToUrl method)
	@param {String} htmlString the string to transform
	@return {HtmlStringValidationResult} a HtmlStringValidationResult with the result of the validation
	*/

	sanitizeToHtmlString ( htmlString ) {

		// ! don't use XMLSerializer. Problems with &quot, &apos and &nbsp; and xmlns

		this.#stringifiedHTML = '';
		this.#stringifyErrors = '';

		const parseResult =
			new DOMParser ( ).parseFromString ( '<div>' + htmlString.replace ( '&nbsp;', '\u0a00' ) + '</div>', 'text/html' );
		if ( parseResult && '\u0023document' === parseResult.nodeName ) {
			this.#stringify ( parseResult.body.firstChild );
			return new HtmlStringValidationResult ( this.#stringifiedHTML, this.#stringifyErrors );
		}
		return new HtmlStringValidationResult ( '', 'Parsing error' );
	}

	/**
	This method verify that a string contains a valid url.

	A valid url must not contains html tags or html entities or invalid characters
	and must start with a valid protocol.

	Valid protocols are http: and https:. For href attributes mailto:, sms: and tel: are also valid
	and for src attributes, data: is also valid.

	sms: and tel: url's  must start with a + and contains only digits, *, # or space
	@param {String} urlString The url to validate
	@param {String} attributeName The attribute name in witch the url will be placed. must be 'src' or
	null (in this case 'href' is used as default)
	@return {UrlValidationResult} a UrlValidationResult with the result of the validation
	*/

	sanitizeToUrl ( urlString, attributeName ) {

		const tmpAttributeName = attributeName || 'href';

		// set the url inside a div and then parsing...
		const parseResult = new DOMParser ( ).parseFromString ( '<div>' + urlString + '</div>', 'text/html' );
		if ( ! parseResult || '\u0023document' !== parseResult.nodeName ) {

			// strange: no result or not a document. We return an empty string
			return new UrlValidationResult ( '', 'Parsing error' );
		}

		// Taking the first child node of the pasing and concatenate the childnodes of this node...
		const resultNode = parseResult.body.firstChild;
		let newUrlString = '';
		for ( let nodeCounter = 0; nodeCounter < resultNode.childNodes.length; nodeCounter ++ ) {
			if ( '\u0023text' === resultNode.childNodes [ nodeCounter ].nodeName ) {

				// ...  if only text nodes are found
				newUrlString += resultNode.childNodes [ nodeCounter ].nodeValue;
			}
			else {

				// otherwise returning an empty string
				return new UrlValidationResult ( '', 'Invalid characters found in the url' );
			}
		}

		// removing < > " ' characters in a copy url ...
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

		// and comparing the result with the url
		if ( newUrlString !== urlString ) {

			// < > " ' characters found i the url. Returning an empty string
			return new UrlValidationResult ( '', 'Invalid characters found in the url' );
		}

		// creating a list of valid protocols for the url
		const validProtocols = [ 'https:' ];
		if ( 'http:' === window.location.protocol || 'href' === tmpAttributeName ) {
			validProtocols.push ( 'http:' );
		}
		if ( 'href' === tmpAttributeName ) {
			validProtocols.push ( 'mailto:' );
			validProtocols.push ( 'sms:' );
			validProtocols.push ( 'tel:' );

			// the url contains only letters and numbers chars and start with a hash. It's a link to the document itself
			const urlHash = newUrlString.match ( /^\u0023\w*/ );
			if ( urlHash && newUrlString === urlHash [ ZERO ] ) {
				return new UrlValidationResult ( newUrlString, '' );
			}
		}
		if ( 'src' === tmpAttributeName ) {
			validProtocols.push ( 'data:' );
		}

		// We try to create a url object from the url string
		let url = null;
		try {
			url = new URL ( newUrlString );
		}
		catch ( err ) {

			// not possible to create an url. Returning an empty string
			return new UrlValidationResult ( '', 'Invalid url string' );
		}
		if ( NOT_FOUND === validProtocols.indexOf ( url.protocol ) ) {

			// the url protocol is not in the list of valid protocol. Returning an empty string
			return new UrlValidationResult ( '', 'Invalid protocol ' + url.protocol );
		}
		if ( NOT_FOUND !== [ 'sms:', 'tel:' ].indexOf ( url.protocol ) ) {

			// sms and tel url must start with a + and contains only numbers, hash or star
			if ( url.pathname.match ( /^\+[0-9,*,\u0023]*$/ ) ) {
				return new UrlValidationResult ( newUrlString, '' );
			}

			return new UrlValidationResult ( '', 'Invalid sms: or tel: url' );

		}

		// try the encodeURIComponent function on the href part of the url
		try {
			encodeURIComponent ( url.href );
		}
		catch ( err ) {
			return new UrlValidationResult ( '', 'Invalid character in url' );
		}
		return new UrlValidationResult ( newUrlString, '' );
	}

	/**
	Remove all html tags from a string and replace htmlEntities and < > ' " and nbsp chars with others similar unicode chars
	@param {String} stringToSanitize the string to transform
	@return {String} a string with html tags removed and htmlEntities and < >' " and nbsp chars replaced
	*/

	sanitizeToJsString ( stringToSanitize ) {

		// Parsing the string inside a div...
		const parseResult = new DOMParser ( ).parseFromString ( '<div>' + stringToSanitize + '</div>', 'text/html' );
		if ( ! parseResult || '\u0023document' !== parseResult.nodeName ) {

			// Bad results from the parsing... Returning an empty string
			return '';
		}
		const resultNode = parseResult.body.firstChild;
		let sanitizedString = '';
		for ( let nodeCounter = 0; nodeCounter < resultNode.childNodes.length; nodeCounter ++ ) {
			if ( '\u0023text' === resultNode.childNodes [ nodeCounter ].nodeName ) {
				sanitizedString += resultNode.childNodes [ nodeCounter ].nodeValue;
			}
			else {

				// The parsing contains others nodes than text string... returning an empty string
				return '';
			}
		}

		// replacing <>'" with others similar chars
		sanitizedString = sanitizedString
			.replaceAll ( /</g, '\u227a' )
			.replaceAll ( />/g, '\u227b' )
			.replaceAll ( /"/g, '\u2033' )
			.replaceAll ( /\u0027/g, '\u2032' );

		return sanitizedString;
	}

	/**
	This method verify that a string describe a css color. A valid css color must start with a hash followed by 6 hex numbers
	@param {String} colorString the string to test
	@return {String} the verified color or null if the given color is invalid
	*/

	sanitizeToColor ( colorString ) {
		const newColor = colorString.match ( /^\u0023[0-9,A-F,a-f]{6}$/ );
		if ( newColor ) {
			return newColor [ ZERO ];
		}
		return null;
	}
}

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
The one and only one instance of HTMLSanitizer class
@type {HTMLSanitizer}
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

const theHTMLSanitizer = new HTMLSanitizer ( );

export default theHTMLSanitizer;

/* --- End of file --------------------------------------------------------------------------------------------------------- */