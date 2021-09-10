# Travel & Notes - User Guide

- [Why Travel & Notes](#WhyTravelNotes)
- [Some explanations on the terms used](#SomeExplanations)
- [Open a travel file created with a version earlier than v2.0.0](#OpenFileWithV200)
- [Before you start using Travel & Notes](#BeforeStart)
	- [How to introduce your access keys in Travel & Notes](#APIKeys)
- [Context menus](#ContextMenus)
- [Interface](#Interface1)
	- [Toolbar buttons on top of the interface](#InterfaceToolbar)
	- [Travel](#Travel)
		- [Travel name](#TravelName)
		- [Toolbar buttons "Travel"](#RouteToolbar)
		- [Travel routes](#RoutesTravel)
	- [Itinerary and notes](#ItineraryAndNotes)
	- [Search OpenStreetMap](#OsmSearch)
	- [Route modes and route providers toolbar](#RouterButtons)
- [Edit boxes](#EditBoxes)
- [Routes and waypoints](#Routes)	
	- [Create a waypoint](#AddWayPoint)
	- [Adding a waypoint with Drag And Drop](#AddWayPointDragDrop)
	- [Modify a waypoint](#ModifyWayPoint)
	- [Delete a waypoint](#DeleteWayPoint)
	- [Rename a waypoint or change its address](#RenameWayPoint)
	- [Choose a route mode and route provider](#ItineraryModeAndProvider)
	- [Calculation of the itinerary](#ComputingItinerary)
	- [Save or discard changes](#SaveOrDiscardRoute)
	- [Route profile](#RouteProfile)
	- [Train route](#TrainItinerary)
	- [Draw a line between two points on the map](#LineItinerary)
	- [Draw a circle on the map](#CircleItinerary)
	- [Editing the properties of a route](#RouteDlg)
	- [Print route maps](#PrintRouteMaps)
- [Notes](#Notes1)
	- [Add a travel note](#NewTravelNote)
	- [Change the order of travel notes](#ReorderTravelNote)
	- [Add a route note](#NewRouteNote)
	- [Consult a note](#ViewNote)
	- [Modify a note](#ModifyNote)
	- [Delete a note](#DeleteNote)
	- [Move the icon of a note](#MoveNote)
	- [Change the latitude and longitude of a note](#LatLngNote)
	- [Turn a route note into a travel note](#RouteToTravelNote)
	- [Turn a travel note into a route note](#TravelToRouteNote)
	- [Create a note for each route maneuver](#AllManeuverNotesFromOsm)
	- [The note dialog box](#NoteDlg)
		- [Insert text in html](#AddHtmltext)
		- [Predefined route notes "SVG icon from OSM"](#SvgNoteFromOsm)
		- [Some examples of notes](#NoteSamples)
- [Background map menu](#MapsMenu)
- [Roadbook](#Roadbook)
- [Prepare a travel and consult it from the internet](#PrepareTravel)
- [Viewer](#Viewer)

<a id="WhyTravelNotes"></a>
## __Why Travel & Notes__

I go from time to time on a bike travel for several weeks, sometimes in isolated areas. This kind 
of travel can not be improvised, even if there is always a part of unforeseen. I needed a tool to 
prepare my route from the map and to add notes.

Yes, I know, there are a lot of applications that can make a route from one point to another, but 
none really gives me satisfaction: I do not often look for the shortest route - sometimes it's even 
a circular route - and in general we're limited to a few hundred kilometers.

Finally, it is also important to be able to record what has been prepared because it is not done in a 
few minutes. You must also be able to print the result. In some isolated areas, there is not always 
a mobile network or the possibility of recharging a battery. A good old hard copy is often valuable.

<a id="SomeExplanations"></a>
## __Some explanations on the terms used__

A **route** connects two points. On the map, it is represented by a polyline.

An **itinerary** is the description of the various changes of direction needed to follow a route.
A change of direction is a **maneuver**.

A **travel** consists of one or more routes. They do not have to touch each other at their ends.
There may also be more than two routes starting from the same point.

In a travel, some routes may be **chained** between them. In this case, the different chained routes 
will be considered as only one for the calculation of the distances. One and only one chain maybe 
created by travel, but it is not mandatory that all routes are included in the chain.

A **note** is a set of information that relates to a specific point on the map or on a route. A note 
consists of an icon, a tooltip, a free text, an address, a link and a phone number. None of this 
information is required, except for the icon, which is used to represent the note on the map. 
This icon can be an image, a photo, a text ...

The **roadbook** is an HTML page that contains all the information of the travel: the notes, the 
routes and the itineraries.

<a id="OpenFileWithV200"></a>
## __Open a travel file created with a version earlier than v2.0.0__

__**ATTENTION : It is not possible to open with version 1.x.x a file saved with version 2.0.0**__

You may still need the older version to make corrections in the notes.
You can do two installations of Travel & Notes without any problem. You just have to place them 
in different directories. You can also use the demo of version v2.0.0 installed on 
[https://wwwouaiebe.github.io/leaflet.TravelNotes/?lng=en](https://wwwouaiebe.github.io/leaflet.TravelNotes/?lng=en).

- **Make a backup copy of your travel files**.
- Open Travel & Notes v2.0.0 and also open the browser's web console.
- Open a file to convert.
- The list of all deleted html tags and attributes is displayed in the console and the travel
displayed in Travel & Notes.
- Correct any errors by using your old version and then reopening your travel with version 2.0.0. OR directly
make the necessary corrections in version 2.0.0.
- Do not panic. The only fixes I had to make in my files were links which were incorrect anyway and 
therefore didn't lead to anything.

<a id="BeforeStart"></a>
## __Before you start using Travel & Notes__

If you use Travel & Notes only to create notes, you can skip all the part about the access keys. 
These are only used for calculating routes and the display of certain maps.

Travel & Notes does not calculate routes and itineraries. It connects to a route provider to get 
this itinerary. The different route providers that can currently be used are GraphHopper, Mapbox, 
Stadia Maps, OpenRouteService and OSRM. It is also possible to draw a polyline between two places, without 
following paths. A train route between two stations can also be added, provided
that this route is encoded in OpenStreetMap, respecting the rules of public transport version 2.

For GraphHopper, OpenRouteService, Stadia Maps and Mapbox it is necessary to have an access key (**API Key**) 
to connect to the server. Check the websites of these different providers to obtain an access key.

You must also correctly read the conditions of use of the access keys and check that what you do 
with Travel & Notes corresponds to these conditions of use.

For the display of certain maps (Thunderforest, Lantmäteriet - Sweden, Mapbox), an access key
is also essential. For other maps, this is not necessary (OpenStreetMap,
aerial view ESRI, IGN - Belgium, Kartverket - Norway, Maanmittauslaitos - Finland).

You are also responsible for the use of your access keys. Remember that there may be billing that 
is done based on these access keys. Do not give them to anyone or do not let them hang around anywhere.

<a id="APIKeys"></a>
### How to introduce your access keys in Travel & Notes

Access keys are managed from the access keys dialog. To view it, click the 🔑 button 
in the toolbar at the top of the interface.

<img src="APIKeysDialogEN.PNG" />

For each service provider, you must indicate on the left the name of this service provider and on the right
the access key. The different names currently possible are 'GraphHopper', 'Lantmateriet',
'Mapbox', 'MapzenValhalla', 'OpenRouteService' et 'Thunderforest' (insensitive to upper / lower case).

Use the + button to add a service provider and the ❌ button on the right to delete this one.

When your access keys are entered, press the button 🆗 to finish.
Your keys are saved in the "sessionStorage" of the browser and available until the tab is closed.

It is possible to save the access keys in a file, protected by a password or unprotected.

**Attention**: the page must be served in HTTPS to save in a file protected by a password.

The 🔄 button is used to reload the access keys file from the web server, if a file was previously found on the server.

The button 💾 on the **left** of the dialog box allows you to save the access keys
in a password protected file. This must contain at least 12 characters including at least 
one uppercase, one lowercase, one number, and one other character.

The button 📂 on the **left** of the dialog box replaces all the access keys of the
dialog box with the contents of a password protected file.

These two buttons are only present if all the conditions to be able to save / restore the
keys with a password are met.

The button 💾 on the **right** of the dialog box allows you to save the access keys in
a file **not protected** by password.

The button 📂 on the **right** of the dialog box replaces all the access keys of the
dialog box by the contents of a file **not protected** by password.

These two buttons are only present if they have been enabled in the TravelNotesConfig.json file.

If a password protected file named **APIKeys** is placed in the same directory as
Travel & Notes on the server, Travel & Notes will ask you for the password when you open it 
in order to use the keys contained in this file.

For geeks and paranos also see in the [installation guide](InstallationGuideEN.md#TravelNotesConfigJson) and in the file TravelNotesConfig.json:
- APIKeys.saveToSessionStorage to save or not the keys in the sessionStorage
- APIKeysDialog.showButton to show or hide the 🔑 button in the toolbar
- APIKeysDialog.showAPIKeys to show or hide the keys as a password in the dialog box
- APIKeysDialog.haveUnsecureButtons to show or hide the buttons 💾 and 📂 on __right__

The old method consisting in entering the access keys via the url is removed.

<a id="ContextMenus"></a>
## __Context menus__

All map objects (waypoints, notes, routes, map) have a context menu. All the commands related to 
these objects can be found in these context menus.

The same menus are found in the user interface on the right of the screen. Right clicking on a route in the routes list 
will display a context menu for that route, right clicking on a note in the route description or in the travel notes list 
will display a context menu for that note and right clicking on a maneuver in the route description will display a 
context menu for that maneuver.

<a id="Interface1"></a>
## __Interface__

When the map is displayed, only a small black rectangle is visible in the upper right corner of the map:

<img src="MinInterface.PNG" />

Move the mouse over this rectangle to see the complete interface:

<img src="InterfaceEN.PNG" />

<a id="InterfaceToolbar"></a>
### Toolbar buttons on top of the interface

At the top of the interface is a first toolbar:
- the button 🏠 redirects to your home page
- the button ? redirects to
[the Travel & Notes help page on Github](https://github.com/wwwouaiebe/leaflet.TravelNotes/tree/gh-pages/TravelNotesGuides)
- the @ button redirects to a contact page. By default it is
[the Travel & Notes issues page on Github](https://github.com/wwwouaiebe/leaflet.TravelNotes/issues).
the url can be modified via the TravelNotes Config.json file (travelNotesToolbarUI.contactMail.url)
- the button 🔑 displays the dialog box of the access keys
- the button 🌐 enables or disables localization.
- the button 📌 permanently displays the interface.

<a id="Travel"></a>
### Travel

<a id="TravelName"></a>
#### Travel name

In this edit box you can give a name to the travel. This name will then be proposed as the default name
for all the files you will create from this travel. It is necessary to give a name to the travel before
to be able to save this one.

<a id="RouteToolbar"></a>
#### Toolbar buttons "Travel"

- the button 💾 on a red **background** saves the travel being edited WITHOUT any notes or maneuvers.
- the button ❌ erases all travel data and starts editing a new travel.
- the button 💾 saves the travel being edited to a file on your computer
- the button 📂 opens a previously saved travel
- the button 🌏 opens a previously saved travel and includes all routes and notes from that 
travel in the current edited travel
- the button 📋 opens the roadbook

<a id="RoutesTravel"></a>
#### Travel routes

In this part, the different travel routes are displayed.

- the ▶ or ▼ buttons reduce or enlarge the list of routes
- the button + add a new route to the travel

For each route, right-clicking on it displays a context menu containing commands
which allow operations to be carried out on the route.

It is also possible to drag and drop to reorder the different routes.

When a route is being modified, an icon 🔴 is present to the left of it.
Likewise, when a route is chained, an ⛓ icon is present on the left.

By default, the name of a route is the name and address of the starting point followed by ⮞ followed 
by the name and the address of the point of arrival. It is possible to modify this name by selecting 
the command 'Modify the properties of this route' in the contextual menu.

<a id="ItineraryAndNotes"></a>
### Itinerary and notes

This part includes the maneuvers of the route as well as notes related to the route.

When the mouse is placed on a line of the itinerary, a marker is displayed at this location on the map.

Right-clicking on a route line will display a context menu with commands
which allow operations to be carried out on the maneuver or the note.

<a id="OsmSearch"></a>
### Search OpenStreetMap

In this part, it is possible to search for points of interest (POI) in OpenStreetMap.
A toolbar is displayed at the top and then a tree list allowing you to choose the
POI to search is displayed.

<img src="OsmSearchEN.PNG" />

- the button 🔎 starts the search
- the button ▼ completely opens the tree list
- the ▶ button closes the tree list, except for the first level
- the ❌ button deselects the entire tree list

La liste arborescente peut être facilement modifiée et adaptée à vos besoins. 
Voir le [guide d'installation](InstallationGuideEN.md#OsmSearch).

Select the type of POI to search from the tree list and then click on the 🔎 button.
After a few moments, the results are displayed:

<img src="OsmSearchResultsEN.PNG" />

Move the mouse over one of the results. This will be displayed on the map, as well as a tooltip
with all the tags introduced in OpenStreetMap.

Right clicking on one of the results will show a context menu allowing you to create notes with that result
or choose this result as the waypoint for the route being edited.

The search area is limited to the map displayed on the screen with a maximum of 10 km by 10 km.

When the "Search OpenStreetMap" panel is activated, a red square showing the limits of the next search
is displayed on the screen. The green square shows the limits of the previous search.

<a id="RouterButtons"></a>
### Route modes and route providers toolbar

The different route modes (bicycle, pedestrian, car, train or line) as well as the different 
route providers are selected on this toolbar.

<img src="RouterButtons.PNG" />

The blue buttons on the left allow you to select the route mode, the other buttons select 
the route providers.

Only the buttons that can be used are visible in the toolbar:
- the route modes depend on the route provider selected
- a route provider is only present if the corresponding plugin is installed and if the access key 
for this provider is known (when an access key is required).

<a id="EditBoxes"></a>
## Edit boxes

Sometimes, an edit box can hide an object of the map that you want to consult. It is always possible, 
either to move / modify the map with a zoom or a pan, or to drag / drop the edit box with the bar at the top.

<a id="Routes"></a>
## Routes and waypoints

To add, modify or delete waypoints, it is necessary to edit the route from the interface or via the 
contextual menu of the route if it already exists.

All other modifications (notes, properties of the route) can be made, whether the route
is edited or not.

<a id="AddWayPoint"></a>
### Create a waypoint

To create a waypoint, right-click on the map at the desired location and choose "Select this point 
as start point", "Select this point as waypoint" or "Select this point as end point" in the menu:

<img src="MapContextMenuEN.PNG" />

A green icon (for the start point), orange (for a waypoint) or red (for the end point) is added to 
the map at the chosen location.

An intermediate waypoint added via the context menu will always be added at the end of the
list of intermediate waypoints. 

<a id="AddWayPointDragDrop"></a>
### Adding a waypoint with Drag And Drop

Move the mouse over the route to see a temporary gray waypoint.
Then by dragging and dropping it, the waypoint is added to the path.

<img src="AddWayPointEN.PNG" />

<a id="ModifyWayPoint"></a>
### Modify a waypoint

Drag and drop the waypoint on the map to change a waypoint

<a id="DeleteWayPoint"></a>
### Delete a waypoint

Right click on the waypoint and choose "delete this waypoint" from the menu. It is not possible to 
delete the start point or the end point. Only a drag and drop is possible.

<a id="RenameWayPoint"></a>
### Rename a waypoint or change its address

When a waypoint is created, its address is searched with Nominatim. If a name, such as a store or building name 
is found by Nominatim, this will also be added (see wayPoint.geocodingIncludeName in the TravelNotesConfig.json 
file to disable this possibility).

You can change this name and address by right-clicking on the waypoint and 
selecting "Modify the properties of this waypoint" from the context menu.

Note, however, that each time the waypoint is moved, the name and address will be
modified by Nominatim and your lost modifications. So it is better to make these changes when you are
certain not to move this waypoint any more.

<a id="ItineraryModeAndProvider"></a>
### Choose a route mode and route provider

Use the buttons at the bottom of the control to change the route mode (bike, pedestrian, car or train) 
as well as the route provider.

<img src="RouterButtons.PNG" />

<a id="ComputingItinerary"></a>
### Calculation of the itinerary

When the starting point and end point are known, the route is calculated and displayed on the map. 
It's the same every time an intermediate point is added or a waypoint is moved.

The description of the route is also displayed in the "Itinerary and notes" section.

<a id="SaveOrDiscardRoute"></a>
### Save or discard changes

When editing a route is finished, it must be saved. Right click on the route
and select 'Save the modifications on this route' from the context menu.

It is also possible to quit editing a route and return to the situation before
changes with the command 'Cancel the modifications on this route'. Attention, __all__
changes will be lost, including changed properties and added notes since the start of the edition.

<a id="RouteProfile"></a>
### Route profile

When a route is calculated with GraphHopper or OpenRouteService, it is possible to display a profile of this route.
Right-click on the __route__ and select "View the profile" from the context menu.

<img src="ProfileEN.PNG" />

There may be multiple open windows displaying profiles.

It is possible to move a profile on the screen by dragging and dropping with the top bar of the window.

<a id="TrainItinerary"></a>
### Train route

- select leaflet.TravelNotesPublicTransport as the route provider by clicking on the <img src="PublicTransportButton.PNG" /> icon at the bottom of the interface
- right click on the map near the departure station and choose "Select this point as the start point" from the context menu.
- right click on the map near the destination station and choose "Select this point as end point" from the context menu.
- after a few moments, a list of all the trains connecting the two stations is displayed.

<img src="TrainsSelectBox.PNG" />

- open the list

<img src="TrainsSelectBoxOpen.PNG" />

and select the train corresponding to the desired route and finish by clicking on the button 🆗.

- the train route will be displayed on the map 

<img src="TrainMap.PNG" /> 

- the different train stops will be added to the route

<img src="TrainItinerary.PNG" />

<a id="LineItinerary"></a>
### Draw a line between two points on the map

- select "Polyline & Circle" as the route provider by clicking on the <img src="PolylineCircleButton.PNG" /> icon at the bottom of the interface and 
"Directions as the crow flies" as the transit mode by clicking on the icon <img src="PolylineButton.PNG" />.

- indicate the starting point and the end point as well as possible intermediate points. Between each of the points
indicated, a portion of "large circle" is drawn.

Note that, depending on the points chosen, the result on the map can be a line, an arc of a circle or a part of a sinusoid, but in all cases it will be 
the representation of a portion of a large circle on the terrestrial globe ( = the shortest path between the two points).

<img src="HELJFK.PNG" />

<a id="CircleItinerary"></a>
### Draw a circle on the map

- select "Polyline & Circle" as the route provider by clicking on the icon <img src="PolylineCircleButton.PNG" />
at the bottom of the interface and "Circle" as transit mode by clicking on the icon <img src="CircleButton.PNG" />

- Indicate the center of the circle using the command "Select this point as start point" and a point to be on
circle using the command "Select this point as end point".

Here too, the result can be an ellipse, a rectangle or a sinusoid but in all cases it will be the representation of a
circle on the earth globe.

<a id="RouteDlg"></a>
### Editing the properties of a route

Right click on the route and select "Modify the properties of this route" from the context menu.

<img src="RoutePropertiesEN.PNG" />

You can first change the name of the route and replace the name suggested by the program
with a name of your choice.

Note that when the name has been changed, the addresses will no longer be added to the name,
even if you change the start and end points.

It is also possible to change the width of the route as well as the type of line and also chaining 
the route.

Finally you can change the color used to display the route. Select a color from the 6 rows of 
colored buttons. The slider under the colored buttons adds more or less shade of red in the colors offered.

Each shade of red, green and blue for the desired color can also be set individually via the 3 color editing areas.

<a id="PrintRouteMaps"></a>
### Print route maps

Please note: this command is experimental. It may not work with your Travel & Notes installation 
if you have added other elements to the page. In addition, not all browsers have implemented all 
the necessary css tags. If this command does not suit you, you can disable it from the 
TravelNotesConfig.json file (printRouteMap.isEnabled).
See the [installation guide](InstallationGuideEN.md#TravelNotesConfigJson).

Right-click on the route for which you want to print the maps and select "Print the maps for this route" 
from the context menu.

The edit box is displayed:

<img src="PrintRouteMapDlgEN.PNG" />

"Paper width" et "Paper height": this is the width and height of the printable area of the paper.
 You must check this with your printer.

"Border width": it is an area around the map and inside it which will be reprinted in the 
following map.

"Zoom" : the zoom to use for maps. It is independent of the zoom used to display the map before launching 
the command. For reasons of performance of the tile servers, it is not possible to use a zoom 
larger than 15.

"Insert a page break": when this box is checked, a page break is inserted after each map.

"Print notes" when this box is checked, the notes icon is printed on the map.

When the edit box is closed with the "ok" button, the map and controls are replaced by views of the map that 
have the desired dimensions and two buttons are present at the top right:

<img src="PrintRouteMapToolbar.PNG" />

The button 🖨️ will launch the print command from your browser and the button &#x274c; 
will cancel printing and redisplay the map.

When the print command of the browser is closed, the print views will also be closed and 
the map redisplayed.

All the default values of the edit box can be modified in the TravelNotesConfig.json file.
See the [installation guide](InstallationGuideEN.md#TravelNotesConfigJson).

Avoid overloading the tile servers. Issue this command only if you really need it.
Decreasing the paper size, the margin size and the zoom will also decrease the number of tiles required.

When the edit box is closed, the program calculates the number of tiles required. If this number is too 
large, the command is stopped.

#### Some tips for printing with a browser based on Chrome (Brave, Vivaldi, MS Edge latest version, Chromium, Chrome)

- Check the box "Insert a page break"
- indicate as "paper height" the actual height of your paper minus the top and bottom printing margins minus 1 mm
- for geeks: you can insert a css file in the html page with a css @page rule to fix the dimensions,
 orientation and margins of the paper:
```
@page {
  size: A4 landscape;
  margin: 7mm;
}
```

#### Some tips for printing with Firefox

- Never check the "Insert page break" box or use a css @page rule. If you do this, the route will not be 
printed correctly after the page break.
- indicate as "paper height" the actual height of your paper minus the top and bottom printing 
margins minus 1 mm (to be checked with your printer ...). Check that everything is correct with the
 "Print preview" command in Firefox.

<a id="Notes1"></a>
## __Notes__

There are two kinds of notes: travel notes and route notes. The position of the travel notes 
is completely free and they will all be displayed at the beginning of the roadbook. Route notes 
are always positioned on a route and displayed with the route in the roadbook.

<a id="NewTravelNote"></a>
### Add a travel note

Right-click at the desired point on the __map__ and select "Add a travel note" from the context menu.

<a id="ReorderTravelNote"></a>
### Change the order of travel notes

The order of travel notes can be changed by dragging and dropping in the list of travel notes in the user interface.

<a id="NewRouteNote"></a>
### Add a route note

Right-click at the desired location on the __route__ and select "Add a note on the route" in 
the context menu.

<a id="ViewNote"></a>
### Consult a note

Left click on the note icon.

<a id="ModifyNote"></a>
### Modify a note

Right-click on the note icon and select "Edit this note" from the context menu.

<a id="DeleteNote"></a>
### Delete a note

Right-click on the note icon and select "Delete this note" from the context menu.

<a id="MoveNote"></a>
### Move the icon of a note

Drag and drop the note. A line will be drawn between the icon of the note and the point chosen for 
the insertion of the note. The latitude and longitude of the note are not modified.

<a id="LatLngNote"></a>
### Change the latitude and longitude of a note

Move the note icon to make the line visible. Move the mouse near the end of the line.
When a small black square appears on it, drag and drop this square and the line.

A route note always has its latitude and longitude on the route. When the line is dropped, the nearest 
point on the route is searched and the free end of the line moved to this point.

<a id="RouteToTravelNote"></a>
### Turn a route note into a travel note

Right-click on the note icon and select "Transform to travel note" from the context menu. 
The transformation is only possible if no route is being edited.

<a id="TravelToRouteNote"></a>
### Turn a travel note into a route note

Right-click on the note icon and select "Transform to route note" from the context menu. 
The transformation is only possible if no route is being edited. The note will be attached 
to the route closest to it.

<a id="AllManeuverNotesFromOsm"></a>
### Create a note for each route maneuver

Right-click on the route and select "Create a note for each route maneuver" from the context menu. 
A confirmation request is displayed.
For each route maneuver, [a SVG note from the OpenStreetMap data](#SvgNoteFromOsm) will be created.

<a id="NoteDlg"></a>
### The note dialog box

<img src="NoteEditionEN.PNG" />

At the top of the box, a drop-down list allows you to choose predefined notes. It is possible to 
modify this list. See the [installation guide](InstallationGuideEN.md#TravelNotesNoteDialogJson).

The ▼ button hides or displays certain editing areas which are hidden by default (the two controls allow you to modify 
the dimensions of the icon and the telephone number). It is possible to choose which areas are hidden by default. 
Consult the [installation guide](InstallationGuideEN.md#TravelNotesConfigJson);

The 📂 button allows you to upload your own file with notes predefined in Travel & Notes. 
See the [installation guide] (InstallationGuideEN.md#TravelNotesNoteDialogJson) for how to create this file.																						   

All the other buttons are modifiable and allow you to insert html tags or predefined text in the edit zones. 
Consult the [installation guide](InstallationGuideEN.md#TravelNotesConfigJson);

The "Icon Content" area will be used to represent the note on the map and can not be empty 
(leaving this area blank would prevent any subsequent changes to the note).

The "Address" zone is automatically completed when creating the note - 
[Nominatim](http://wiki.openstreetmap.org/wiki/Nominatim) is used for the street name and
OverpassAPI for the municipality name.
This area will never be changed by Nominatim afterwards, even if the note has been moved. 
The button 🔄 allows, however, to request a new geolocation to Nominatim/OverpassAPI.

If the phone edit box contains only a valid phone number (= starting with a + and then only digits or the 
characters #, * or space), the phone number will be displayed with a tel: link and a sms: link.

Each edit zone can contain plain text or html, with the exception of the "Link" zone which can only contain a valid link.

<a id="AddHtmltext"></a>

#### Insert text in html

Only the following html tags and attributes can be used:
- the tag &lt;div&gt; (text block)
- the tag &lt;p&gt; (paragraph)
- the tags &lt;h1&gt; à &lt;h6'&gt; (heading)
- the tag &lt;hr&gt; (horizontal line)
- the tag &lt;ol&gt; (bulleted list or numbered list)
- the tag &lt;li&gt; (element of bulleted list)
- the tag &lt;ul&gt; (element of numbered list)
- the tag &lt;span&gt; (inline text block)
- the tag &lt;figure&gt; (figure)
- the tag &lt;figcaption&gt; (legend for the figure tag)
- the tag &lt;img&gt; with the attributes src, alt width and height (image)
- the tag &lt;a&gt; with the attributes href end target
- the tag &lt;del&gt; (deleted text)
- the tag &lt;ins&gt; (added text)
- the tag &lt;mark&gt; (highlighted text)
- the tag &lt;s&gt; (strikethrough text)
- the tag &lt;em&gt; (italic text)
- the tag &lt;small&gt; (small text)
- the tag &lt;strong&gt; (bold text)
- the tag &lt;sub&gt; (subscript text)
- the tag &lt;sup&gt; (superscript text)

Also, the following svg tags can be used:
- the tag &lt;svg&gt; with the attributes xmlns and viewBox
- the tag &lt;text&gt; with the attributes x, y and text-anchor
- the tag &lt;polyline&gt; with the attributes points and transform

For all tags, id, class, dir and title attributes can also be used.

The rules for editing html are of course applicable:
- an opening tag AND a closing tag must be used: &lt;p&gt;Lorem ipsum... &lt;/p&gt;
- attribute values must always be placed between &quot; : class=&quot;myClass&quot;
- the characters &lt; and &gt; are reserved for tags and cannot be used elsewhere.
If you absolutely need these characters, you should replace them with the html entities &amp;lt; for &lt; and
&amp;gt; for &gt;.
- double quotes are reserved for delimiting attribute values. If necessary use the html entity &amp;quot;.
- the character &apos; cannot be used and must be replaced by the html entity &amp;apos;.
- the character &amp; is ambiguous and should only be used in html entities
- the non-breaking space must be inserted with the html entity &amp;nbsp;

The urls introduced in the href and src attributes, as well as in the "link" edit zone must be valid urls:
- url's must be absolute links
- url's cannot contain characters &lt;, &gt;, &apos; et &quot;
- protocol must be http:, https:, mailto:, sms: or tel: for an href attribute
- protocol must be https: for the src attribute (http: is also acceptable if the app's protocol is http:)
- the pathname of the sms: and tel: links must start with a + and contain only the characters #, * or numbers

As more text is inserted into an edit box, the app interprets the text and adapts the note preview accordingly. 
When the edit box is closed with the 🆗 button, the text you entered is replaced by the one produced by 
the interpretation that the app made of it.

<a id="SvgNoteFromOsm"></a>
#### Predefined route notes "SVG icon from OSM"

When creating a route note, you can choose "SVG icon from OSM" in the list of predefined notes. 
In this case, Travel & Notes will search OpenStreetMap the nearest intersection located on the 
route and will create an SVG icon showing the streets near this intersection.

The intersection will be placed in the center of the icon and its content will be oriented 
according to the path followed: the route by which one arrives at the intersection will be 
turned towards the bottom of the icon.

The address will also be modified: all the street names found at the intersection will be indicated, 
separated by a symbol ⪥. The first street name will always be the one by which we arrive at 
the intersection and the last name the one by which one leaves the intersection. 
This name will be preceded by an arrow indicating the direction to follow. The name of the 
town / city will also be added. If a hamlet or village name is found near the intersection, 
it will also be added in parentheses.

<a id="NoteSamples"></a>
#### Some examples of notes

##### A simple note created from a predefined note

The dialog box: 

<img src="NoteStandard1EN.PNG" />

And the result on TravelNotes:

<img src="NoteStandard2EN.PNG" />

##### A route note created with "SVG icon from OSM"

The path goes from right to left. The intersection of Tiyou d'Hestreu, Chemin des Patars and Basse Voie
streets is at the center of the icon. The streets are oriented so that a person who follows the path on 
the ground sees the streets in the same position as on the icon. The street we arrive at is Tiyou 
d'Hestreu. An arrow to the right indicates that you must turn right in the Basse Voie. We are in the 
city of Anthisnes and the hamlet of Limont.

<img src="SVGIconEN.PNG" />

##### A note with a text on a line

The dialog box: 

<img src="NoteTexte1EN.PNG" />

And the result on TravelNotes:

<img src="NoteTexte2EN.PNG" />

##### A note with a photo

The dialog box:

<img src="NotePhoto1EN.PNG" />

And the result on TravelNotes:

<img src="NotePhoto2EN.PNG" />

<a id="MapsMenu"></a>
## __Background map menu__

On the left of the screen, a toolbar allows you to choose different background maps. Only a little
black rectangle is visible on the screen:

<img src="MapsInterface1EN.PNG" />

Move the mouse over this rectangle to display the entire toolbar:

<img src="MapsInterface2EN.PNG" />

For each background map there is a button in the toolbar. 
The composition of the toolbar depends on the maps defined in the TravelNotesLayers.json file 
as well as the access keys that have been introduced. Consult the [installation guide](InstallationGuideEN.md#TravelNotesLayersJson).

It is possible to move around in the toolbar using the mouse wheel.

<a id="Roadbook"></a>
## __Roadbook__

Click on the button 📋. A new tab is created with the roadbook. This contains all the routes as 
well as all the notes that have been created on the map. It is possible to choose what you want to see 
in the roadbook via the menu at the top of the page:

<img src="RoadbookEN.PNG" />

<a id="PrepareTravel"></a>
## __Prepare a travel and consult it from the internet__

It is possible to prepare a travel, save it in a file on a web server and consult it from the internet.

To consult the travel, you must call TravelNotes by giving it as a parameter in the URL the address 
of the file converted to base64. And remember that you can only convert ascii characters to base64 ...

```
https://wwwouaiebe.github.io/leaflet.TravelNotes/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9zYW1wbGVzL0xpZWdlL1N0YXRpb25Ub1lvdXRoSG9zdGVsLnRydg==
```

aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9zYW1wbGVzL0xpZWdlL1N0YXRpb25Ub1lvdXRoSG9zdGVsLnRydg== 
is 
https://wwwouaiebe.github.io/samples/Liege/StationToYouthHostel.trv
base64 encoded

See the sample on the [demo](https://wwwouaiebe.github.io/leaflet.TravelNotes/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9zYW1wbGVzL0xpZWdlL1N0YXRpb25Ub1lvdXRoSG9zdGVsLnRydg==&lng=en)

When such a file is displayed, it is not possible to modify it. The TravelNotes interface is not 
visible and all context menus are disabled.

<a id="Viewer"></a>
## __Viewer__

Some older browsers, especially on mobile phones, do not always understand all of the Travel & Notes 
JavaScript code. In this case, you can try a simplified version of Travel & Notes which just allows 
you to view the files. The url must be completed in the same way as for the normal version:

```
https://wwwouaiebe.github.io/leaflet.TravelNotes/viewer/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9zYW1wbGVzL0xpZWdlL1N0YXRpb25Ub1lvdXRoSG9zdGVsLnRydg==
```

You can however add &lay at the end of the url to also display a toolbar showing the background maps 
not requiring an access key.

You can also use the keyboard for a few commands:

- the arrows __up__, __down__, __left__ and __right__ to move the map
- __ + __ and __-__ to zoom in on the map
- __Z__ and __z__ to zoom in on the travel
- __G__ and __g__ to activate / deactivate geolocation
- the numbers __0__ to __9__ to activate other base maps (the numbers that can be used depend on the base maps defined in the 
TravelNotesLayers.json file - Only maps that do not require access keys can be displayed, the viewer does not manage the access keys).

```
https://wwwouaiebe.github.io/leaflet.TravelNotes/viewer/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9zYW1wbGVzL0xpZWdlL1N0YXRpb25Ub1lvdXRoSG9zdGVsLnRydg==&lay
```

See the sample on the
[demo](https://wwwouaiebe.github.io/leaflet.TravelNotes/viewer/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9zYW1wbGVzL0xpZWdlL1N0YXRpb25Ub1lvdXRoSG9zdGVsLnRydg==&lay)

Other samples:

[An excerpt from my last bike trip from Dover to Chester](https://wwwouaiebe.github.io/leaflet.TravelNotes/viewer/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9zYW1wbGVzL1VLMjAxOS9VSzIwMTkudHJ2) 

[The maps for the first route of Dover to Chester](https://wwwouaiebe.github.io/samples/UK2019/UK2019.pdf)

[A train, bus and bicycle trip from Liège to Tromsø](https://wwwouaiebe.github.io/leaflet.TravelNotes/viewer/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9zYW1wbGVzL0xpZWdlLVRyb21zby9zdW9taTIwMTgwNjA4LnRydg==)

[And the roadbook from Liège to Tromsø](https://wwwouaiebe.github.io/samples/Liege-Tromso/suomi20180608-Roadbook.pdf)
