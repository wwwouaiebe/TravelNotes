/*
Copyright - 2017 2021 - wwwouaiebe - Contact: https://www.ouaie.be/

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

module.exports = function(grunt) {
	
	// The banner inserted in the generated js files
	
	let banner = 
		'/**\n * ' +
		'\n * @source: <%= pkg.sources %>\n * ' + 
		'\n * @licstart  The following is the entire license notice for the' +
		'\n * JavaScript code in this page.\n * \n * <%= pkg.name %> - version <%= pkg.version %>' + 
		'\n * Build <%= pkg.buildNumber %> - <%= grunt.template.today("isoDateTime") %> ' + 
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
		
	// css files needed for TravelNotes
	
	let travelNotesCss = [
		'src/css/Map.css', 
		'src/css/Notes.css', 'src/css/NotesIcons.css', 'src/css/NotesForMap.css', 'src/css/NotesForUI.css', 
		'src/css/Print.css',
		'src/css/RoutesForMap.css' ,'src/css/RoutesForUI.css', 'src/css/RoutesForSvgProfile.css',
		'src/css/WayPointsForMap.css',
		'src/css/Background.css', 'src/css/WaitAnimation.css', 'src/contextMenus/BaseContextMenu.css',
		'src/dialogs/AboutDialog.css', 'src/dialogAPIKeys/APIKeysDialog.css', 'src/dialogBase/BaseDialog.css', 'src/dialogColorControl/ColorControl.css', 'src/dialogNotes/NoteDialog.css', 
		'src/dialogs/PrintRouteMapDialog.css', 'src/dialogs/RoutePropertiesDialog.css', 'src/dialogs/TwoButtonsDialog.css', 'src/dialogs/WayPointPropertiesDialog.css',
		'src/dialogFloatWindow/FloatWindow.css', 'src/dialogPassword/PasswordDialog.css', 
		'src/AttributionsUI/AttributionsUI.css', 'src/ErrorsUI/ErrorsUI.css',
		'src/UI/ItineraryPaneUI.css', 'src/mapLayersToolbarUI/MapLayersToolbarUI.css', 'src/mouseUI/MouseUI.css', 'src/UI/OsmSearchPaneUI.css', 'src/UI/PanesManagerUI.css', 
		'src/UI/ProvidersToolbarUI.css', 'src/UI/TravelNotesPaneUI.css', 'src/UI/TravelNotesToolbarUI.css', 'src/UI/TravelUI.css', 'src/UI/RoutesListUI.css',
		'src/UI/UI.css', 'src/waitUI/WaitUI.css',
		'src/css/Hidden.css' // must always be the last css
	];
	
	// css files needed for the viewer
	
	let travelNotesViewerCss = [ 
		'src/css/Map.css', 
		'src/css/Notes.css', 'src/css/NotesIcons.css', 'src/css/NotesForMap.css', 
		'src/css/RoutesForMap.css',
		'src/AttributionsUI/AttributionsUI.css', 'src/ErrorsUI/ErrorsUI.css','src/viewerLayersToolbarUI/ViewerLayersToolbarUI.css'
	];
	
	// css files needed for the roadbook
	
	let travelNotesRoadbookCss = [ 
		'src/css/TravelForRoadbook.css',
		'src/css/Notes.css', 'src/css/NotesIcons.css', 'src/css/NotesForRoadbook.css',
		'src/css/RoutesForRoadbook.css',
		'src/css/RoutesForSvgProfile.css',
		'src/roadbook/Roadbook.css',
		'src/css/Hidden.css'
	];
	
	// grunt config
	
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		
		// eslint config
		
		eslint: {
			options: {
				fix: true,
				configFile: '.eslintrc.json'
			},				
			target: ['src/**/*.js']
		},	
		
		// replace config
		
		replace: {
			
			// release mode
			
			release : {
				src: ['tmpRelease/src/**/*.js'],
				overwrite: true, 
				replacements: [
					// # are replaced with _private_ so the code can be executed by old browsers
					{
						from: '#',
						to: '_private_'
					},
					// Object.freeze in the constructors is removed
					{
						from: 'Object.freeze ( this );',
						to: '/* Object.freeze ( this ); */'
					},
					// and Object.seal in the constructors is removed
					{
						from: 'Object.seal ( this );',
						to: '/* Object.seal ( this ); */'
					}
				]
			}
		},
		
		// rollup config
		
		rollup : {
			
			// debug mode. Files are created but not used, so import and export errors are detected
			
			debug : {
				options : {
					format : 'iife'
				},
				files: {
				  'tmpDebug/TravelNotes.min.js': ['src/main/main.js'],  
				  'tmpDebug/TravelNotesViewer.min.js': ['src/main/mainViewer.js'],  
				  'tmpDebug/TravelNotesRoadbook.min.js': ['src/roadbook/roadbook.js'],			  
				  'tmpDebug/GraphHopperRouteProvider.min.js': ['src/routeProviders/GraphHopperRouteProvider.js'],			  
				  'tmpDebug/MapboxRouteProvider.min.js': ['src/routeProviders/MapboxRouteProvider.js'],			  
				  'tmpDebug/MapzenValhallaRouteProvider.min.js': ['src/routeProviders/MapzenValhallaRouteProvider.js'],			  
				  'tmpDebug/OpenRouteServiceRouteProvider.min.js': ['src/routeProviders/OpenRouteServiceRouteProvider.js'],				  
				  'tmpDebug/OsrmRouteProvider.min.js': ['src/routeProviders/OsrmRouteProvider.js'],				  
				  'tmpDebug/PolylineRouteProvider.min.js': ['src/routeProviders/PolylineRouteProvider.js'],				  
				  'tmpDebug/PublicTransportRouteProvider.min.js': ['src/routeProviders/PublicTransportRouteProvider.js']				  
				}
			},
			
			// release mode
			
			release : {
				options : {
					format : 'iife'
				},
				files: {
				  'tmpRelease/TravelNotes.min.js': ['tmpRelease/src/main/main.js'],  
				  'tmpRelease/TravelNotesViewer.min.js': ['tmpRelease/src/main/mainViewer.js'],  
				  'tmpRelease/TravelNotesRoadbook.min.js': ['tmpRelease/src/roadbook/roadbook.js'],			  
				  'tmpRelease/GraphHopperRouteProvider.min.js': ['tmpRelease/src/routeProviders/GraphHopperRouteProvider.js'],			  
				  'tmpRelease/MapboxRouteProvider.min.js': ['tmpRelease/src/routeProviders/MapboxRouteProvider.js'],			  
				  'tmpRelease/MapzenValhallaRouteProvider.min.js': ['tmpRelease/src/routeProviders/MapzenValhallaRouteProvider.js'],			  
				  'tmpRelease/OpenRouteServiceRouteProvider.min.js': ['tmpRelease/src/routeProviders/OpenRouteServiceRouteProvider.js'],				  
				  'tmpRelease/OsrmRouteProvider.min.js': ['tmpRelease/src/routeProviders/OsrmRouteProvider.js'],				  
				  'tmpRelease/PolylineRouteProvider.min.js': ['tmpRelease/src/routeProviders/PolylineRouteProvider.js'],				  
				  'tmpRelease/PublicTransportRouteProvider.min.js': ['tmpRelease/src/routeProviders/PublicTransportRouteProvider.js']				  
				}
			}
		},
		
		// stylelint config for debug and release
		
		stylelint: {
			 options: {
				 fix: true
			 },
			src: ['src/**/*.css']
		},	
		
		// cssmin config
		
		cssmin: {
			options: {
				
				// don't remove this. Colors must not be changed in css to avoid problems with data uri
				compatibility : {
					properties : {
						colors : false
					}
				},
				mergeIntoShorthands: false,
				roundingPrecision: -1
			},
			
			// debug mode. Files are copied in the debug folder
			
			debug: {
				files: {
					'debug/TravelNotes.min.css': travelNotesCss,
					'debug/viewer/TravelNotesViewer.min.css': travelNotesViewerCss,
					'debug/TravelNotesRoadbook.min.css': travelNotesRoadbookCss
				}
			},
			
			// release mode. Files are copied in the dist and gh-page folders
			
			release: {
				files: {
					'dist/TravelNotes.min.css': travelNotesCss,
					'dist/viewer/TravelNotesViewer.min.css': travelNotesViewerCss,
					'dist/TravelNotesRoadbook.min.css': travelNotesRoadbookCss,
					'gh-page/TravelNotes.min.css': travelNotesCss,
					'gh-page/viewer/TravelNotesViewer.min.css': travelNotesViewerCss,
					'gh-page/TravelNotesRoadbook.min.css': travelNotesRoadbookCss
				}
			}
		},
		
		// terser config
		terser: {
			
			// release only for TravelNotes
			
			TravelNotes: {
				options: {
					mangle: {
						properties: {
							regex : /^_private_/
						}
					},
					output: {
						preamble: banner
					}
				},
				files: {
					
					// dist
					
					'dist/TravelNotes.min.js': ['tmpRelease/TravelNotes.min.js'],
					'dist/TravelNotesProviders/GraphHopperRouteProvider.min.js': ['tmpRelease/GraphHopperRouteProvider.min.js'],			  
					'dist/TravelNotesProviders/MapboxRouteProvider.min.js': ['tmpRelease/MapboxRouteProvider.min.js'],			  
					'dist/TravelNotesProviders/MapzenValhallaRouteProvider.min.js': ['tmpRelease/MapzenValhallaRouteProvider.min.js'],			  
					'dist/TravelNotesProviders/OpenRouteServiceRouteProvider.min.js': ['tmpRelease/OpenRouteServiceRouteProvider.min.js'],				  
					'dist/TravelNotesProviders/OsrmRouteProvider.min.js': ['tmpRelease/OsrmRouteProvider.min.js'],				  
					'dist/TravelNotesProviders/PolylineRouteProvider.min.js': ['tmpRelease/PolylineRouteProvider.min.js'],				  
					'dist/TravelNotesProviders/PublicTransportRouteProvider.min.js': ['tmpRelease/PublicTransportRouteProvider.min.js'],
					
					// gh-page
					
					'gh-page/TravelNotes.min.js': ['tmpRelease/TravelNotes.min.js'],
					'gh-page/TravelNotesProviders/GraphHopperRouteProvider.min.js': ['tmpRelease/GraphHopperRouteProvider.min.js'],			  
					'gh-page/TravelNotesProviders/MapboxRouteProvider.min.js': ['tmpRelease/MapboxRouteProvider.min.js'],			  
					'gh-page/TravelNotesProviders/MapzenValhallaRouteProvider.min.js': ['tmpRelease/MapzenValhallaRouteProvider.min.js'],			  
					'gh-page/TravelNotesProviders/OpenRouteServiceRouteProvider.min.js': ['tmpRelease/OpenRouteServiceRouteProvider.min.js'],				  
					'gh-page/TravelNotesProviders/OsrmRouteProvider.min.js': ['tmpRelease/OsrmRouteProvider.min.js'],				  
					'gh-page/TravelNotesProviders/PolylineRouteProvider.min.js': ['tmpRelease/PolylineRouteProvider.min.js'],				  
					'gh-page/TravelNotesProviders/PublicTransportRouteProvider.min.js': ['tmpRelease/PublicTransportRouteProvider.min.js']				  
				}
			},
			
			// release only for the viewer
			
			Viewer: {
				options: {
					mangle: true,
					output: {
						preamble: banner
					}
				},
				files: {
					'dist/viewer/TravelNotesViewer.min.js': ['tmpRelease/TravelNotesViewer.min.js'],
					'gh-page/viewer/TravelNotesViewer.min.js': ['tmpRelease/TravelNotesViewer.min.js']
				}
			},
			
			// release only for the roadbook
			
			Roadbook: {
				options: {
					mangle: true,
					output: {
						preamble: banner
					}
				},
				files: {
					'dist/TravelNotesRoadbook.min.js': ['tmpRelease/TravelNotesRoadbook.min.js'],
					'gh-page/TravelNotesRoadbook.min.js': ['tmpRelease/TravelNotesRoadbook.min.js']
				}
			},
		},
		
		// copy config
		
		copy: {
			beforeRelease:{
				
				// JS files are copied in a temp folder for replace
				
				files: [
					{ expand: true, cwd: '', src: ['src/**/*.js' ], dest: 'tmpRelease/' }
				]
			},
			release: {
				
				// release mode
				
				files: [
				
					// dist
					
					{ expand: true, cwd: 'src/cfg/', src: ['*.json', '*.csv' ], dest: 'dist/' },
					{ expand: true, cwd: 'src/translations/', src: ['*.json'], dest: 'dist/' },
					{ expand: true, cwd: 'src/html/', src: ['index.html'], dest: 'dist/' },
					{ expand: true, cwd: 'src/html/', src: ['TravelNotesRoadbook.html'], dest: 'dist/' },		
					{ expand: true, cwd: 'src/cfg/', src: [ 'TravelNotesConfig.json', 'TravelNotesLayers.json' ], dest: 'dist/viewer/' },
					{ expand: true, cwd: 'src/translations/', src: ['*.json'], dest: 'dist/viewer/' },
					{ expand: true, cwd: 'src/html/', src: ['TravelNotesViewer.html'], rename: function ( ){return 'dist/viewer/index.html';} },
					{ expand: true, cwd: 'node_modules/osrm-text-instructions/languages/abbreviations/', src: ['*.json'], dest: 'dist/TravelNotesProviders/languages/abbreviations/' },
					{ expand: true, cwd: 'node_modules/osrm-text-instructions/languages/translations/', src: ['*.json'], dest: 'dist/TravelNotesProviders/languages/instructions/' },
					{ expand: true, cwd: 'node_modules/osrm-text-instructions/languages/grammar/', src: ['*.json'], dest: 'dist/TravelNotesProviders/languages/grammars/' },
					
					// gh-page
					
					{ expand: true, cwd: 'src/cfg/', src: ['*.json', '*.csv' ], dest: 'gh-page/' },
					{ expand: true, cwd: 'src/translations/', src: ['*.json'], dest: 'gh-page/' },
					{ expand: true, cwd: 'src/html/', src: ['index.html'], dest: 'gh-page/'	},
					{ expand: true, cwd: 'src/html/', src: ['TravelNotesRoadbook.html'], dest: 'gh-page/' },		
					{ expand: true, cwd: 'src/cfg/', src: [ 'TravelNotesConfig.json', 'TravelNotesLayers.json' ], dest: 'gh-page/viewer/' },
					{ expand: true, cwd: 'src/translations/', src: ['*.json'], dest: 'gh-page/viewer/' },
					{ expand: true, cwd: 'src/html/', src: ['TravelNotesViewer.html'], rename: function ( ){return 'gh-page/viewer/index.html';} },
					{ expand: true, cwd: 'node_modules/osrm-text-instructions/languages/abbreviations/', src: ['fr.json', 'en.json'], dest: 'gh-page/TravelNotesProviders/languages/abbreviations/' },
					{ expand: true, cwd: 'node_modules/osrm-text-instructions/languages/translations/', src: ['fr.json', 'en.json'], dest: 'gh-page/TravelNotesProviders/languages/instructions/' },
					{ expand: true, cwd: 'node_modules/osrm-text-instructions/languages/grammar/', src: ['fr.json'], dest: 'gh-page/TravelNotesProviders/languages/grammars/' },
					{ expand: true, cwd: 'TravelNotesGuides/', src: ['**/*.*'], dest: 'gh-page/TravelNotesGuides/' },
					{ expand: true, cwd: 'TechDoc/', src: ['**/*.*'], dest: 'gh-page/TechDoc/' },
					{ expand: true, cwd: 'node_modules/leaflet/dist/', src: ['leaflet.js', 'leaflet.css' ], dest: 'gh-page/leaflet/' },
					{ expand: true, cwd: 'node_modules/leaflet/dist/images/', src: ['*.png' ], dest: 'gh-page/leaflet/images/' }
					
				]
			},
			debug: {
				
				// debug mode
				
				files: [
					{ expand: true, cwd: 'src/cfg/', src: ['*.json', '*.csv'], dest: 'debug/' },
					{ expand: true, cwd: 'src/translations/', src: ['*.json'], dest: 'debug/' },
					{ expand: true, cwd: 'src/html/', src: 'indexDebug.html', rename: function ( ){return 'debug/index.html';} },
					{ expand: true, cwd: 'src/html/', src: 'TravelNotesRoadbookDebug.html', rename: function ( ){return 'debug/TravelNotesRoadbook.html';} },
					{ expand: true, cwd: 'tmpDebug/', src: ['TravelNotesRoadbook.min.css'], dest: 'debug/' },
					{ expand: true, cwd: 'tmpDebug/', src: ['TravelNotes.min.css'], dest: 'debug/' },
					{ expand: true, cwd: 'src/cfg/', src: [ 'TravelNotesConfig.json', 'TravelNotesLayers.json' ], dest: 'debug/viewer/' },
					{ expand: true, cwd: 'src/translations/', src: ['*.json'], dest: 'debug/viewer/' },
					{ expand: true, cwd: 'src/html/', src: 'TravelNotesViewerDebug.html', rename: function ( ){return 'debug/viewer/index.html';} },
					{ expand: true, cwd: 'tmpDebug/', src: ['TravelNotesViewer.min.css'], dest: 'debug/viewer/' },
					{ expand: true, cwd: 'node_modules/osrm-text-instructions/languages/abbreviations/', src: ['*.json'], dest: 'debug/TravelNotesProviders/languages/abbreviations/' },
					{ expand: true, cwd: 'node_modules/osrm-text-instructions/languages/translations/', src: ['*.json'], dest: 'debug/TravelNotesProviders/languages/instructions/' },
					{ expand: true, cwd: 'node_modules/osrm-text-instructions/languages/grammar/', src: ['*.json'], dest: 'debug/TravelNotesProviders/languages/grammars/' }
				]
			}
		},
		
		// clean config
		
		clean: {
			beforeDoc: ['TechDoc'],
			beforeDebug: ['debug', 'tmpDebug', 'out'],
			beforeRelease: [ 'dist', 'gh-page', 'tmpRelease', 'out'],
			afterDebug: [ 'tmpDebug', 'out' ],
			afterRelease: [ 'tmpRelease', 'out' ]
		},
		
		// jsdoc config
		
		jsdoc : {
			doc : {
				src: ['src/**/*.js'],
				options: {
					destination : 'TechDoc',
					configure : "JSDocConf/JSDocConf.json",
					private : false
				}
			}
		}		
	});
	
	// Build number
	
	grunt.config.data.pkg.buildNumber = grunt.file.readJSON('buildNumber.json').buildNumber;
	grunt.config.data.pkg.buildNumber = ("00000" + ( Number.parseInt ( grunt.config.data.pkg.buildNumber ) + 1 ) ).substr ( -5, 5 ) ;
	grunt.file.write ( 'buildNumber.json', '{ "buildNumber" : "' + grunt.config.data.pkg.buildNumber + '"}'  );
	
	// Load tasks
	
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-text-replace');
	grunt.loadNpmTasks('grunt-rollup');
	grunt.loadNpmTasks('grunt-stylelint');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-terser');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-jsdoc');
	
	// Register tasks
	
	grunt.registerTask (
		'default',
		[ 'eslint' ]
	);
	grunt.registerTask(
		'doc', 
		[ 'clean:beforeDoc', 'jsdoc' ]
	);
	grunt.registerTask(
		'debug',
		[ 'eslint', 'stylelint', 'clean:beforeDebug', 'rollup:debug', 'cssmin:debug', 'copy:debug',	'clean:afterDebug' ]
	);
	grunt.registerTask(
		'release',
		[ 'eslint', 'stylelint', 'clean:beforeDebug', 'rollup:debug', 'cssmin:debug', 'copy:debug', 'clean:afterDebug', 'clean:beforeRelease', 'copy:beforeRelease', 'replace:release', 'rollup:release', 'terser', 'cssmin:release', 'copy:release', 'clean:afterRelease', 'clean:beforeDoc', 'jsdoc' ]
	);
	
	// console
	
	console.log ( '---------------------------------------------------------------------------------------------------------------------------------------------');
	console.log ( '\n                                     ' + grunt.config.data.pkg.name + ' - ' + grunt.config.data.pkg.version +' - build: '+ grunt.config.data.pkg.buildNumber + ' - ' + grunt.template.today("isoDateTime") +'\n' );
	console.log ( '---------------------------------------------------------------------------------------------------------------------------------------------');	
};

// end of file


