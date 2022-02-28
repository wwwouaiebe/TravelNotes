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
	- v1.11.0:
		- created
	- v2.0.0:
		- Issue ♯135 : Remove innerHTML from code
	- v3.0.0:
		- Issue ♯175 : Private and static fields and methods are coming
	- v3.1.0:
		- Issue ♯2 : Set all properties as private and use accessors.
Doc reviewed 20210914
Tests ...
*/

import BaseDialog from '../dialogBase/BaseDialog.js';
import theHTMLElementsFactory from '../UILib/HTMLElementsFactory.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
A customizable dialog with two buttons.
Create an instance of the dialog, then execute the show ( ) method. The Promise returned by the show ( ) method fullfil
when the first button is used and reject when the second button or the cancel button on the topbar is used
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class TwoButtonsDialog extends BaseDialog {

	/**
	The constructor
	@param {DialogOptions|Object} options An Object with the needed options. See DialogOptions class.
	*/

	constructor ( options ) {
		super ( options );
	}

	/**
	An array with the HTMLElements that have to be added in the content of the dialog.
	Overload of the BaseDialog contentHTMLElements property.
	@type {Array.<HTMLElement>}
	*/

	get contentHTMLElements ( ) {
		return [
			theHTMLElementsFactory.create (
				'div',
				{
					textContent : this.options.text || ''
				}
			)
		];
	}

	/**
	The title of the dialog. Overload of the BaseDialog title property.
	@type {String}
	*/

	get title ( ) { return this.options.title || ''; }
}

export default TwoButtonsDialog;

/* --- End of file --------------------------------------------------------------------------------------------------------- */