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

// The banner inserted in the generated js files
const banner =
    '/**\n * ' +
    '\n * @source: <%= pkg.sources %>\n * ' +
    '\n * @licstart  The following is the entire license notice for the' +
    '\n * JavaScript code in this page.\n * \n * <%= pkg.name %> - version <%= pkg.version %>' +
    '\n * Build <%= build %> - <%= grunt.template.today("isoDateTime") %> ' +
    '\n * Copyright 2017 <%= grunt.template.today("yyyy") %> wwwouaiebe ' +
    '\n * Contact: https://www.ouaie.be/' +
    '\n * License: <%= pkg.license %>' +
    '\n * \n * The JavaScript code in this page is free software: you can' +
    '\n * redistribute it and/or modify it under the terms of the GNU' +
    '\n * General Public License (GNU GPL) as published by the Free Software' +
    '\n * Foundation, either version 3 of the License, or (at your option)' +
    '\n * any later version.  The code is distributed WITHOUT ANY WARRANTY;' +
    '\n * without even the implied warranty of MERCHANTABILITY or FITNESS' +
    '\n * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.' +
    '\n * \n * As additional permission under GNU GPL version 3 section 7, you' +
    '\n * may distribute non-source (e.g., minimized or compacted) forms of' +
    '\n * that code without the copy of the GNU GPL normally required by' +
    '\n * section 4, provided you include this license notice and a URL' +
    '\n * through which recipients can access the Corresponding Source.' +
    '\n * \n * @licend  The above is the entire license notice' +
    '\n * for the JavaScript code in this page.' +
    '\n * \n */\n\n';

// eslint-disable-next-line no-undef
module.exports = {

	// release only for TravelNotes

	TravelNotes : {
		options : {
			mangle : {
				properties : {
					regex : /^_private_/
				}
			},
			output : {
				preamble : banner
			}
		},
		files : {

			// dist

			'dist/TravelNotes.min.js' :
                [ 'tmpRelease/TravelNotes.min.js' ],
			'dist/TravelNotesProviders/GraphHopperRouteProvider.min.js' :
                [ 'tmpRelease/GraphHopperRouteProvider.min.js' ],
			'dist/TravelNotesProviders/MapboxRouteProvider.min.js' :
                [ 'tmpRelease/MapboxRouteProvider.min.js' ],
			'dist/TravelNotesProviders/MapzenValhallaRouteProvider.min.js' :
                [ 'tmpRelease/MapzenValhallaRouteProvider.min.js' ],
			'dist/TravelNotesProviders/OpenRouteServiceRouteProvider.min.js' :
                [ 'tmpRelease/OpenRouteServiceRouteProvider.min.js' ],
			'dist/TravelNotesProviders/OsrmRouteProvider.min.js' :
                [ 'tmpRelease/OsrmRouteProvider.min.js' ],
			'dist/TravelNotesProviders/PolylineRouteProvider.min.js' :
                [ 'tmpRelease/PolylineRouteProvider.min.js' ],
			'dist/TravelNotesProviders/PublicTransportRouteProvider.min.js' :
                [ 'tmpRelease/PublicTransportRouteProvider.min.js' ],

			// docs/demo

			'docs/demo/TravelNotes.min.js' :
                [ 'tmpRelease/TravelNotes.min.js' ],
			'docs/demo/TravelNotesProviders/GraphHopperRouteProvider.min.js' :
                [ 'tmpRelease/GraphHopperRouteProvider.min.js' ],
			'docs/demo/TravelNotesProviders/MapboxRouteProvider.min.js' :
                [ 'tmpRelease/MapboxRouteProvider.min.js' ],
			'docs/demo/TravelNotesProviders/MapzenValhallaRouteProvider.min.js' :
                [ 'tmpRelease/MapzenValhallaRouteProvider.min.js' ],
			'docs/demo/TravelNotesProviders/OpenRouteServiceRouteProvider.min.js' :
                [ 'tmpRelease/OpenRouteServiceRouteProvider.min.js' ],
			'docs/demo/TravelNotesProviders/OsrmRouteProvider.min.js' :
                [ 'tmpRelease/OsrmRouteProvider.min.js' ],
			'docs/demo/TravelNotesProviders/PolylineRouteProvider.min.js' :
                [ 'tmpRelease/PolylineRouteProvider.min.js' ],
			'docs/demo/TravelNotesProviders/PublicTransportRouteProvider.min.js' :
                [ 'tmpRelease/PublicTransportRouteProvider.min.js' ]
		}
	},

	// release only for the viewer

	Viewer : {
		options : {
			mangle : true,
			output : {
				preamble : banner
			}
		},
		files : {
			'dist/viewer/TravelNotesViewer.min.js' :
                [ 'tmpRelease/TravelNotesViewer.min.js' ],
			'docs/demo/viewer/TravelNotesViewer.min.js' :
                [ 'tmpRelease/TravelNotesViewer.min.js' ]
		}
	},

	// release only for the roadbook

	Roadbook : {
		options : {
			mangle : true,
			output : {
				preamble : banner
			}
		},
		files : {
			'dist/TravelNotesRoadbook.min.js' :
                [ 'tmpRelease/TravelNotesRoadbook.min.js' ],
			'docs/demo/TravelNotesRoadbook.min.js' :
                [ 'tmpRelease/TravelNotesRoadbook.min.js' ]
		}
	}
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */