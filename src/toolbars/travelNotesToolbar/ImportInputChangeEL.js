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
		- created from v3.6.0
Doc reviewed 202208
 */

import FileLoader from '../../core/FileLoader.js';
import theErrorsUI from '../../uis/errorsUI/ErrorsUI.js';
import { ZERO } from '../../main/Constants.js';

/* ------------------------------------------------------------------------------------------------------------------------- */
/**
change event listener for the input associated to the import button
*/
/* ------------------------------------------------------------------------------------------------------------------------- */

class ImportInputChangeEL {

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
		const fileReader = new FileReader ( );
		fileReader.onload = ( ) => {
			try {
				const fileExtension = changeEvent.target.files [ ZERO ].name.split ( '.' ).pop ( )
					.toLowerCase ( );
				switch ( fileExtension ) {
				case 'trv' :
					new FileLoader ( ).mergeLocalTrvFile ( fileReader.result );
					break;
				case 'gpx' :
					new FileLoader ( ).mergeLocalGpxFile ( fileReader.result );
					break;
				default :
					break;
				}
			}
			catch ( err ) {
				if ( err instanceof Error ) {
					console.error ( err );
					theErrorsUI.showError ( 'An error occurs when reading the file : ' + err.message );
				}
			}
		};

		fileReader.readAsText ( changeEvent.target.files [ ZERO ] );
	}
}

export default ImportInputChangeEL;

/* --- End of file --------------------------------------------------------------------------------------------------------- */