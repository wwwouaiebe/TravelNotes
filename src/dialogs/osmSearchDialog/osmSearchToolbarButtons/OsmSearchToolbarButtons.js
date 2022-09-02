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
	- v4.0.0:
		- created
Doc reviewed 20220825
Tests ...
*/

import theHTMLElementsFactory from '../../../core/uiLib/HTMLElementsFactory.js';
import theTranslator from '../../../core/uiLib/Translator.js';
import ClearButtonClickEL from './ClearButtonClickEL.js';
import CollapseButtonClickEL from './CollapseButtonClickEL.js';
import ExpandTreeButtonClickEL from './ExpandTreeButtonClickEL.js';
import SearchButtonClickEL from './SearchButtonClickEL.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class build the search toolbar and contains also the event listeners for the toolbar
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmSearchToolbarButtons {

	/**
	The toolbar container
	@type {HTMLElement}
	*/

	#toolbarButtonsHTMLElement;

	/**
	The constructor
	@param {OsmSearchTree} osmSearchTree A reference to the OsmSearchTree object
	@param {OsmSearchWait} osmSearchWait A reference to the OsmSearchWait object
	*/

	constructor ( osmSearchTree, osmSearchWait ) {

		Object.freeze ( this );

		// container
		this.#toolbarButtonsHTMLElement = theHTMLElementsFactory.create (
			'div'
		);

		// Search button
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-Button',
				title : theTranslator.getText ( 'OsmSearchToolbarButtons - Start the search' ),
				textContent : '🔎'
			},
			this.#toolbarButtonsHTMLElement
		)
			.addEventListener ( 'click', new SearchButtonClickEL ( osmSearchTree, osmSearchWait ), false );

		// Expand tree button
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-Button',
				title : theTranslator.getText ( 'OsmSearchToolbarButtons - Expand the tree' ),
				textContent : '▼'
			},
			this.#toolbarButtonsHTMLElement
		)
			.addEventListener ( 'click', new ExpandTreeButtonClickEL ( osmSearchTree ), false );

		// Collapse button
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-Button',
				title : theTranslator.getText ( 'OsmSearchToolbarButtons - Collapse the tree' ),
				textContent : '▶'
			},
			this.#toolbarButtonsHTMLElement
		)
			.addEventListener ( 'click', new CollapseButtonClickEL ( osmSearchTree ), false );

		// clear button
		theHTMLElementsFactory.create (
			'div',
			{
				className : 'TravelNotes-BaseDialog-Button',
				title : theTranslator.getText ( 'OsmSearchToolbarButtons - Clear the tree' ),
				textContent : '❌'
			},
			this.#toolbarButtonsHTMLElement
		)
			.addEventListener ( 'click', new ClearButtonClickEL ( osmSearchTree ), false );

	}

	/**
	The toolbar htmlElement
	@type {HTMLElement}
	*/

	get toolbarButtonsHTMLElement ( ) { return this.#toolbarButtonsHTMLElement; }

}

export default OsmSearchToolbarButtons;

/* --- End of file --------------------------------------------------------------------------------------------------------- */