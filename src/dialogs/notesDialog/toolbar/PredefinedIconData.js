/*
Copyright - 2017 2023 - wwwouaiebe - Contact: https://www.ouaie.be/

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
	- v4.0.0:
		- created from v3.6.0
Doc reviewed 202208
 */

import theHTMLSanitizer from '../../../core/htmlSanitizer/HTMLSanitizer.js';

import { ICON_DIMENSIONS } from '../../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
Simple container for predefined icons data of the NoteDialogToolbar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class PredefinedIconData {

	/**
	The name of the predefined icon. This name will be displayed in the select of the NoteDialogToolbar
	@type {String}
	*/

	#name;

	/**
	The html definition of the predefined icon
	@type {String}
	*/

	#icon;

	/**
	The tooltip of the predefined icon
	@type {String}
	*/

	#tooltip;

	/**
	The width of the predefined icon
	@type {Number}
	*/

	#width;

	/**
	The height of the predefined icon
	@type {Number}
	*/

	#height;

	/**
	The constructor
	@param {JsonObject} jsonPredefinedIconData A json object with the data for the predefined icon
	*/

	constructor ( jsonPredefinedIconData ) {
		this.#name =
			'string' === typeof ( jsonPredefinedIconData?.name )
				?
				theHTMLSanitizer.sanitizeToJsString ( jsonPredefinedIconData.name )
				:
				'?';
		this.#icon =
			'string' === typeof ( jsonPredefinedIconData.icon )
				?
				theHTMLSanitizer.sanitizeToHtmlString ( jsonPredefinedIconData?.icon ).htmlString
				:
				'?';
		this.#tooltip =
			'string' === typeof ( jsonPredefinedIconData?.tooltip )
				?
				theHTMLSanitizer.sanitizeToHtmlString ( jsonPredefinedIconData.tooltip ).htmlString
				:
				'?';
		this.#width =
			'number' === typeof ( jsonPredefinedIconData?.width ) ? jsonPredefinedIconData.width : ICON_DIMENSIONS.width;
		this.#height =
			'number' === typeof ( jsonPredefinedIconData?.height ) ? jsonPredefinedIconData.height : ICON_DIMENSIONS.height;
	}

	/**
	The name of the predefined icon. This name will be displayed in the select of the NoteDialog
	@type {String}
	*/

	get name ( ) { return this.#name; }

	/**
	The html definition of the predefined icon
	@type {String}
	*/

	get icon ( ) { return this.#icon; }

	/**
	The tooltip of the predefined icon
	@type {String}
	*/

	get tooltip ( ) { return this.#tooltip; }

	/**
	The width of the predefined icon
	@type {Number}
	*/

	get width ( ) { return this.#width; }

	/**
	The height of the predefined icon
	@type {Number}
	*/

	get height ( ) { return this.#height; }

}

export default PredefinedIconData;

/* --- End of file --------------------------------------------------------------------------------------------------------- */