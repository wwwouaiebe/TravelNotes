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

import FileLoader from '../../core/FileLoader.js';
import theErrorsUI from '../../uis/errorsUI/ErrorsUI.js';
import theConfig from '../../data/Config.js';
import { NOT_FOUND, ZERO } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
change event listener for the input associated to the open button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class OpenInputChangeEL {

	/**
	The constructor
	*/

	constructor ( ) {
		Object.freeze ( this );
	}

	/**
	Event listener method
	@param {Event} changeEvent The event to handle
	*/

	handleEvent ( changeEvent ) {
		changeEvent.stopPropagation ( );
		const fileName = changeEvent.target.files [ ZERO ].name;
		const fileExtension = fileName.split ( '.' )
			.pop ( )
			.toLowerCase ( );
		const fileReader = new FileReader ( );
		fileReader.onload = ( ) => {
			try {
				if ( NOT_FOUND !== theConfig.files.openTaN.indexOf ( fileExtension ) ) {
					new FileLoader ( ).openLocalTrvFile ( fileReader.result );
				}
				else if ( NOT_FOUND !== theConfig.files.openGpx.indexOf ( fileExtension ) ) {
					new FileLoader ( ).openLocalGpxFile ( fileReader.result );
				}
			}
			catch ( err ) {
				if ( err instanceof Error ) {
					console.error ( err );
					theErrorsUI.showError (
						'An error occurs when reading the file ' +
						fileName
					);
				}
			}
		};
		fileReader.readAsText ( changeEvent.target.files [ ZERO ] );
	}
}

export default OpenInputChangeEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */