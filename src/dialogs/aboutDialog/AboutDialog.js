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

import theHTMLElementsFactory from '../../core/uiLib/HTMLElementsFactory.js';
import theTranslator from '../../core/uiLib/Translator.js';
import NonModalBaseDialog from '../baseDialog/NonModalBaseDialog.js';
import theHTMLSanitizer from '../../core/htmlSanitizer/HTMLSanitizer.js';
import { theAppVersion } from '../../data/Version.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the 'About' dialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class AboutDialog extends NonModalBaseDialog {

	/**
	The main
	@type {HTMLElement}
	*/

	#aboutHTMLElement = null;

	/**
	The constructor
	*/

	constructor ( ) {
		super ( );
	}

	/**
	Create all the controls needed for the dialog.
	Overload of the base class createContentHTML
	*/

	createContentHTML ( ) {
		this.#aboutHTMLElement = theHTMLElementsFactory.create ( 'div', { id : 'travelnotes-about-dialog-about' } );
		theHTMLSanitizer.sanitizeToHtmlElement (
			'<p>This  program is free software; you can redistribute it and/or modify it under the terms of the ' +
				'GNU General Public License as published by the Free Software Foundation; either version 3 of the License, ' +
				'or any later version.</p>' +
				'<p>Copyright - 2017 2023 - wwwouaiebe</p>' +
				'<p>Contact : <a href="https://www.ouaie.be/pages/Contact" target="_blank">https://www.ouaie.be/</a></p>' +
				'<p>GitHub : <a href="https://github.com/wwwouaiebe/TravelNotes" target="_blank">' +
				'https://github.com/wwwouaiebe/TravelNotes</a></p>' +
				'<p>Version : ' + theAppVersion + '.' +
				'<p>This program uses:' +
				' <a href="https://leafletjs.com/" target="_blank">leaflet</a>,' +
				' <a href="https://github.com/Project-OSRM/osrm-text-instructions" target="_blank">' +
				'Project-OSRM/osrm-text-instructions</a> and ' +
				' <a href="https://github.com/drolbr/Overpass-API" target="_blank">the Overpass API</a></p>',
			this.#aboutHTMLElement
		);
	}

	/**
	Overload of the base class show
	*/

	show ( ) {
		super.show ( );
		this.mover.centerDialog ( );
	}

	/**
	Get an array with the HTMLElements that have to be added in the content of the dialog.
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) { return [ this.#aboutHTMLElement ]; }

	/**
	Return the dialog title. Overload of the BaseDialog.title property
	@type {String}
	*/

	get title ( ) { return theTranslator.getText ( 'AboutDialog - About Travel & Notes' ); }

}

export default AboutDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */