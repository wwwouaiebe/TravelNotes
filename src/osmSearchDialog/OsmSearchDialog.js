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
Doc reviewed ...
Tests ...
*/

import theConfig from '../data/Config.js';
import theTranslator from '../UILib/Translator.js';
import DockableBaseDialog from '../baseDialog/DockableBaseDialog.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';
import OsmSearchToolbarButtons from '../osmSearchDialog/OsmSearchToolbarButtons.js';
import OsmSearchTree from '../osmSearchDialog/OsmSearchTree.js';
import OsmSearchWait from './OsmSearchWait.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
This class is the TravelPropertiesDialog
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OsmSearchDialog extends DockableBaseDialog {

	/**
	The toolbar HTMLElement
	@type {HTMLElement}
	*/

	#toolbarHTMLElement;

	#osmSearchTree;
	#osmSearchWait;

	/**
	Toolbar creation
	*/

	#createToolbar ( ) {
		this.#toolbarHTMLElement = theHTMLElementsFactory.create ( 'div' );
		this.#osmSearchTree = new OsmSearchTree ( );
		this.#osmSearchWait = new OsmSearchWait ( );
		const osmSearchToolbarButtons = new OsmSearchToolbarButtons ( this.#osmSearchTree, this.#osmSearchWait );
		this.#toolbarHTMLElement.appendChild ( osmSearchToolbarButtons.toolbarButtonsHTMLElement );
		this.#toolbarHTMLElement.appendChild ( this.#osmSearchTree.treeHTMLElement );
		this.#toolbarHTMLElement.appendChild ( this.#osmSearchWait.waitHTMLElement );
	}

	/**
	The constructor
	*/

	constructor ( ) {
		super ( theConfig.osmSearchDialog.dialogX, theConfig.osmSearchDialog.dialogY );
		this.#createToolbar ( );
	}

	/**
	An array with the HTMLElements that have to be added in the content of the dialog.
	Overload of the BaseDialog contentHTMLElements property.
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) {
		return [ ]; /* .concat (
			this.#travelNotesControl.controlHTMLElement
		);*/
	}

	/**
	The dialog title. Overload of the BaseDialog.title property
	@type {String}
	*/

	get title ( ) { return theTranslator.getText ( 'OsmSearchDialog - Search OpenStreetMap' ); }

	/**
	The toolbar HTMLElement
	@type {HTMLElement}
	*/

	get toolbarHTMLElement ( ) {
		return this.#toolbarHTMLElement;
	}

	/**
	Update the content of the dialog
	*/

	updateContent ( ) {
	}
}

export default OsmSearchDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */