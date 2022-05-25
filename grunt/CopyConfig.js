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

const debugFiles = [
	{ expand : true, cwd : 'src/cfg/', src : [ '*.json', '*.csv' ], dest : 'debug/' },
	{ expand : true, cwd : 'src/translations/', src : [ '*.json' ], dest : 'debug/' },
	{ expand : true, cwd : 'src/html/', src : 'indexDebug.html', rename : function ( ) { return 'debug/index.html'; } },
	{
		expand : true,
		cwd : 'src/html/',
		src : 'TravelNotesRoadbookDebug.html',
		rename : function ( ) { return 'debug/TravelNotesRoadbook.html'; }
	},
	{ expand : true, cwd : 'src/cfg/', src : [ 'TravelNotesConfig.json', 'TravelNotesLayers.json' ], dest : 'debug/viewer/' },
	{ expand : true, cwd : 'src/translations/', src : [ '*.json' ], dest : 'debug/viewer/' },
	{
		expand : true,
		cwd : 'src/html/',
		src : 'TravelNotesViewerDebug.html',
		rename : function ( ) { return 'debug/viewer/index.html'; }
	},
	{ expand : true, cwd : 'tmpDebug/', src : [ 'TravelNotesViewer.min.css' ], dest : 'debug/viewer/' },
	{
		expand : true,
		cwd : 'node_modules/osrm-text-instructions/languages/abbreviations/',
		src : [ '*.json' ],
		dest : 'debug/TravelNotesProviders/languages/abbreviations/'
	},
	{
		expand : true,
		cwd : 'node_modules/osrm-text-instructions/languages/translations/',
		src : [ '*.json' ],
		dest : 'debug/TravelNotesProviders/languages/instructions/'
	},
	{
		expand : true,
		cwd : 'node_modules/osrm-text-instructions/languages/grammar/',
		src : [ '*.json' ],
		dest : 'debug/TravelNotesProviders/languages/grammars/'
	}
];

const localServerPath = 'c:/MAMP/htdocs/TaN/';

const debugAndroidFiles = [
	{ expand : true, cwd : 'src/cfg/', src : [ '*.json', '*.csv' ], dest : localServerPath },
	{ expand : true, cwd : 'src/translations/', src : [ '*.json' ], dest : localServerPath },
	{
		expand : true,
		cwd : 'src/html/',
		src : 'indexDebugAndroid.html',
		rename : function ( ) { return localServerPath + 'index.html'; }
	},
	{
		expand : true,
		cwd : 'src/html/',
		src : 'TravelNotesRoadbookDebugAndroid.html',
		rename : function ( ) { return localServerPath + 'TravelNotesRoadbook.html'; }
	},
	{
		expand : true,
		cwd : 'src/cfg/',
		src : [ 'TravelNotesConfig.json', 'TravelNotesLayers.json' ],
		dest : localServerPath + 'viewer/'
	},
	{ expand : true, cwd : 'src/translations/', src : [ '*.json' ], dest : localServerPath + 'viewer/' },
	{
		expand : true,
		cwd : 'src/html/',
		src : 'TravelNotesViewerDebugAndroid.html',
		rename : function ( ) { return localServerPath + 'viewer/index.html'; }
	},
	{ expand : true, cwd : 'tmpDebug/', src : [ 'TravelNotesViewer.min.css' ], dest : localServerPath + 'viewer/' },
	{
		expand : true,
		cwd : 'node_modules/osrm-text-instructions/languages/abbreviations/',
		src : [ '*.json' ],
		dest : localServerPath + 'TravelNotesProviders/languages/abbreviations/'
	},
	{
		expand : true,
		cwd : 'node_modules/osrm-text-instructions/languages/translations/',
		src : [ '*.json' ],
		dest : localServerPath + 'TravelNotesProviders/languages/instructions/'
	},
	{
		expand : true,
		cwd : 'node_modules/osrm-text-instructions/languages/grammar/',
		src : [ '*.json' ],
		dest : localServerPath + 'TravelNotesProviders/languages/grammars/'
	},
	{
		expand : true,
		cwd : 'src',
		src : [ '**/*.*' ],
		dest : localServerPath + 'src'
	},
	{
		expand : true,
		cwd : 'node_modules/leaflet/dist/',
		src : [ 'leaflet.js', 'leaflet.css' ],
		dest : localServerPath + 'leaflet/'
	},
	{
		expand : true,
		cwd : 'node_modules/leaflet/dist/images/',
		src : [ '*.png' ],
		dest : localServerPath + 'leaflet/images/'
	}
];

const beforeReleaseFiles = [
	{ expand : true, cwd : '', src : [ 'src/**/*.js' ], dest : 'tmpRelease/' }
];

const releaseFiles = [

	// dist
	{ expand : true, cwd : 'src/cfg/', src : [ '*.json', '*.csv' ], dest : 'dist/' },
	{ expand : true, cwd : 'src/translations/', src : [ '*.json' ], dest : 'dist/' },
	{ expand : true, cwd : 'src/html/', src : [ 'index.html' ], dest : 'dist/' },
	{ expand : true, cwd : 'src/html/', src : [ 'TravelNotesRoadbook.html' ], dest : 'dist/' },
	{ expand : true, cwd : 'src/cfg/', src : [ 'TravelNotesConfig.json', 'TravelNotesLayers.json' ], dest : 'dist/viewer/' },
	{ expand : true, cwd : 'src/translations/', src : [ '*.json' ], dest : 'dist/viewer/' },
	{
		expand : true,
		cwd : 'src/html/',
		src : [ 'TravelNotesViewer.html' ],
		rename : function ( ) { return 'dist/viewer/index.html'; }
	},
	{
		expand : true,
		cwd : 'node_modules/osrm-text-instructions/languages/abbreviations/',
		src : [ '*.json' ],
		dest : 'dist/TravelNotesProviders/languages/abbreviations/'
	},
	{
		expand : true,
		cwd : 'node_modules/osrm-text-instructions/languages/translations/',
		src : [ '*.json' ],
		dest : 'dist/TravelNotesProviders/languages/instructions/'
	},
	{
		expand : true,
		cwd : 'node_modules/osrm-text-instructions/languages/grammar/',
		src : [ '*.json' ],
		dest : 'dist/TravelNotesProviders/languages/grammars/'
	},

	// docs/demo

	{ expand : true, cwd : 'src/cfg/', src : [ '*.json', '*.csv' ], dest : 'docs/demo/' },
	{ expand : true, cwd : 'src/translations/', src : [ '*.json' ], dest : 'docs/demo/' },
	{ expand : true, cwd : 'src/html/', src : [ 'index.html' ], dest : 'docs/demo/'	},
	{ expand : true, cwd : 'src/html/', src : [ 'TravelNotesRoadbook.html' ], dest : 'docs/demo/' },
	{
		expand : true,
		cwd : 'src/cfg/',
		src : [ 'TravelNotesConfig.json', 'TravelNotesLayers.json' ],
		dest : 'docs/demo/viewer/'
	},
	{ expand : true, cwd : 'src/translations/', src : [ '*.json' ], dest : 'docs/demo/viewer/' },
	{
		expand : true,
		cwd : 'src/html/',
		src : [ 'TravelNotesViewer.html' ],
		rename : function ( ) { return 'docs/demo/viewer/index.html'; }
	},
	{
		expand : true,
		cwd : 'node_modules/osrm-text-instructions/languages/abbreviations/',
		src : [ 'fr.json', 'en.json' ],
		dest : 'docs/demo/TravelNotesProviders/languages/abbreviations/'
	},
	{
		expand : true,
		cwd : 'node_modules/osrm-text-instructions/languages/translations/',
		src : [ 'fr.json', 'en.json' ],
		dest : 'docs/demo/TravelNotesProviders/languages/instructions/'
	},
	{
		expand : true,
		cwd : 'node_modules/osrm-text-instructions/languages/grammar/',
		src : [ 'fr.json' ],
		dest : 'docs/demo/TravelNotesProviders/languages/grammars/'
	},
	{ expand : true, cwd : 'node_modules/leaflet/dist/', src : [ 'leaflet.js', 'leaflet.css' ], dest : 'docs/demo/leaflet/' },
	{ expand : true, cwd : 'node_modules/leaflet/dist/images/', src : [ '*.png' ], dest : 'docs/demo/leaflet/images/' },

	// README.md

	{ expand : true, cwd : 'TravelNotesGuides', src : [ 'README.md' ], dest : '' }

];

// eslint-disable-next-line no-undef
module.exports = {
	beforeRelease : { files : beforeReleaseFiles },
	release : {	files : releaseFiles },
	debug : { files : debugFiles },
	debugAndroid : { files : debugAndroidFiles }
};

/* --- End of file --------------------------------------------------------------------------------------------------------- */