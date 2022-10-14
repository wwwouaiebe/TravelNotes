<a href="#fr" >Vers la version française</a>
<a id="en" />

# Travel & Notes 

Travel & Notes allows you to plan a trip from the map. You can :
- draw one or more routes on the map
- add notes to these different routes or to the trip
- search for points of interest in OpenStreetMap and create notes from these results
- save your work to a file and reopen it later for editing or viewing
- create a travel book containing the different itineraries and notes created
- print route maps
- export routes to gpx files
- display the trip in a web page.
- use different basemap

## About your browser

Your browser must be recent. I don't do development for old versions of the browser. The code has been tested
with the most recent versions of Firefox, Microsoft Edge, Brave and Vivaldi on a Windows computer and with Firefox and Brave on
an Android tablet. If TravelNotes is not working in your browser, update it.

## Guides

[User guide - en ](https://wwwouaiebe.github.io/TravelNotes/userGuides/en/UserGuideEN.html)

[Installation guide - en ](https://wwwouaiebe.github.io/TravelNotes/userGuides/en/InstallationGuideEN.html)

[JS code documentation](https://wwwouaiebe.github.io/TravelNotes/techDoc/ )

## Demo

[Demo - en ](https://wwwouaiebe.github.io/TravelNotes/demo/?lng=en)

If you have a Mapbox, Stadia Maps, GraphHopper or OpenRouteService API key, you can also use this demo with Mapbox, Stadia Maps, GraphHopper and/or OpenRouteService. 
Simply add your API key via the access key management dialog (button 🔑 on the toolbar at the top of the control).

Also see this [demo](https://wwwouaiebe.github.io/TravelNotes/demo/viewer/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9UcmF2ZWxOb3Rlcy9zYW1wbGVzL0xpZWdlL1N0YXRpb25Ub1lvdXRoSG9zdGVsLnRydg==).
which displays a travel with a route and notes, without any edit box or interface, and therefore without the possibility of modifications.
And the same [demo](https://wwwouaiebe.github.io/TravelNotes/samples/Liege/index.html) inside a web page

Other samples:

[A great travel bike from Belgium to the North of Norway and return to Stockholm](https://wwwouaiebe.github.io/TravelNotes/demo/viewer/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9UcmF2ZWxOb3Rlcy9zYW1wbGVzL25vcmQvMjAxNS0yMDE4LU5vcmQudHJ2) (Keep calm... 8000 km 2Mb)

[An excerpt from my last bike trip from Dover to Chester](https://wwwouaiebe.github.io/TravelNotes/demo/viewer/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9UcmF2ZWxOb3Rlcy9zYW1wbGVzL1VLMjAxOS9VSzIwMTkudHJ2) 

[The printed maps for the first route of Dover to Chester in a pdf file](https://wwwouaiebe.github.io/TravelNotes/samples/UK2019/UK2019.pdf)

[A train, bus and bicycle trip from Liège to Tromsø](https://wwwouaiebe.github.io/TravelNotes/demo/viewer/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9UcmF2ZWxOb3Rlcy9zYW1wbGVzL0xpZWdlLVRyb21zby9zdW9taTIwMTgwNjA4LnRydg==)

[And the roadbook from Liège to Tromsø](https://wwwouaiebe.github.io/TravelNotes/samples/Liege-Tromso/suomi20180608-Roadbook.pdf)
  
## Releases and branches

### v4.1.0 branch

The [v4.1.0 release](https://github.com/wwwouaiebe/TravelNotes/releases/tag/v4.1.0) and the [v4.1.0 branch](https://github.com/wwwouaiebe/TravelNotes/tree/v4.1.0)
contains the files of the last stable version.

Sources are available in the [src folder](https://github.com/wwwouaiebe/TravelNotes/tree/v4.1.0/src)

### master branch

The [master branch](https://github.com/wwwouaiebe/TravelNotes/tree/master) is the development branch and is unstable. 

## What's new in the last release

- The installation procedure has changed following the release of Leaflet 1.9.0. Although TravelNotes still uses Leaflet, it is no longer necessary to load the Leaflet style sheet with a &lt;style&gt; tag, as it is embedded in the TravelNotes.min.css file. Similarly, Leaflet Javascript should no longer be loaded with a &lt;script&gt; tag, all the Leaflet code being integrated into the TravelNotes.min.js file.

- Issue #57 : The z-index of the profile menu is not correct
- Issue #58 : Changing the travel name is slow when multiple routes are added
- Issue #59 : Red value of the buttons is not correct in the color control
- Issue #60 : Review the profile dialog
- Issue #61 : Add an option for enable/disable the mouse leave event for dockable dialog
- Issue #62 : Review how the search of address is started in the note dialog
- Issue #63 : Limit the width of dialogs on big screens
- Issue #64 : Add a warning when an error occurs during a osm search
- Issue #65 : Leaflet 1.9 published
- Issue #66 : Hiding provider toolbar crash when a transit mode is selected

For other versions, see the document ['What's new?' - en ](https://wwwouaiebe.github.io/TravelNotes/userGuides/en/WhatsNew.html)

<a id="fr" />

# Travel & Notes 

Travel & Notes vous permet de préparer un voyage à partir de la carte. Vous pouvez :
- tracer un ou plusieurs itinéraires sur la carte
- ajouter des notes à ces différents itinéraires ou au voyage
- faire des recherches de points d'intérets dans OpenStreetMap et créer des notes à partir de ces résultats
- sauvegarder votre travail dans un fichier et le réouvrir plus tard pour modifications ou consultation
- créer un livre de voyage reprenant les différents itinéraires et notes créées
- imprimer les cartes d'un itinéraire
- exporter les itinéraires vers des fichiers gpx
- afficher le voyage dans une page web.
- utiliser différents fond de carte

## À propos de votre navigateur

Votre navigateur doit être récent. Je ne fais pas de développement pour des vieilles versions du navigateur. Le code a été testé
avec les versions les plus récentes de Firefox, Microsoft Edge, Brave et Vivaldi sur un pc Windows et avec Firefox et Brave
sur une tablette Android. Si TravelNotes ne fonctionne pas dans votre navigateur, faites une mise à jour de celui-ci.

## Guides

[Guide pour les utilisateurs - fr ](https://wwwouaiebe.github.io/TravelNotes/userGuides/fr/GuideUtilisateurFR.html)

[Guide d'installation - fr ](https://wwwouaiebe.github.io/TravelNotes/userGuides/fr/GuideInstallationFR.html)

[Documentation du code JS](https://wwwouaiebe.github.io/TravelNotes/techDoc/)

## Démo

[Demo - fr ](https://wwwouaiebe.github.io/TravelNotes/demo/?)

Si vous disposez d'une API key pour Mapbox, Stadia Maps, GraphHopper ou OpenRouteService, vous pouvez également utiliser cette démo avec Mapbox, Stadia Maps, GraphHopper et / ou OpenRouteService.
Ajoutez simplement votre API key via la boite de dialogue de gestion des clefs d'accès ( bouton 🔑 sur la barre d'outils en haut du contrôle ).

Voyez aussi cette [démo](https://wwwouaiebe.github.io/TravelNotes/demo/viewer/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9UcmF2ZWxOb3Rlcy9zYW1wbGVzL0xpZWdlL1N0YXRpb25Ub1lvdXRoSG9zdGVsLnRydg==)
qui affiche un voyage avec un trajet et des notes, sans aucune boite d'édition ou interface, et donc sans possibilité de modifications.

Et la même [démo](https://wwwouaiebe.github.io/TravelNotes/samples/Liege/index.html) intégrée dans une page web

D'autres exemples:

[Un grand voyage en vélo depuis la Belgique jusqu'au Nord de la Norvège et retour jusqu'à Stockholm](https://wwwouaiebe.github.io/TravelNotes/demo/viewer/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9UcmF2ZWxOb3Rlcy9zYW1wbGVzL25vcmQvMjAxNS0yMDE4LU5vcmQudHJ2) (Patientez... 8000 km 2Mb)

[Un extrait de mon dernier voyage en vélo de Dover à Chester](https://wwwouaiebe.github.io/TravelNotes/demo/viewer/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9UcmF2ZWxOb3Rlcy9zYW1wbGVzL1VLMjAxOS9VSzIwMTkudHJ2) 

[Les cartes imprimées dans un pdf du premier trajet de Dover à Chester](https://wwwouaiebe.github.io/TravelNotes/samples/UK2019/UK2019.pdf)

[Un voyage en train, bus et vélo de Liège à Tromsø](https://wwwouaiebe.github.io/TravelNotes/demo/viewer/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9UcmF2ZWxOb3Rlcy9zYW1wbGVzL0xpZWdlLVRyb21zby9zdW9taTIwMTgwNjA4LnRydg==)

[Et le livre de voyage de Liège à Tromsø](https://wwwouaiebe.github.io/samples/Liege-Tromso/suomi20180608-Roadbook.pdf)

## Versions et branches

### branche v4.1.0

La [version v4.1.0](https://github.com/wwwouaiebe/TravelNotes/releases/tag/v4.1.0) et la [branche v4.1.0](https://github.com/wwwouaiebe/TravelNotes/tree/v4.1.0)
contiennent les fichiers de la dernière version stable.

Les sources sont disponibles dans le [répertoire src](https://github.com/wwwouaiebe/TravelNotes/tree/v4.1.0/src)

### branche master

La [branche master](https://github.com/wwwouaiebe/TravelNotes/tree/master) est la branche de développement et est instable.

## Quoi de neuf dans la dernière version

- La procédure d'instalation a été modifiée, suite à la publication de Leaflet 1.9.0. Bien que TravelNotes utilise toujours Leaflet, il n'est plus nécessaire de charger la feuille de style de Leaflet avec une balise &lt;style&gt;, celle-ci étant intégrée dans le fichier TravelNotes.min.css. De même, il ne faut plus charger le Javascript de Leaflet avec une balise &lt;script&gt;, tout le code de Leaflet étant intégré dans le fichier TravelNotes.min.js.

- Issue #57 : Le z-index des profils n'est pas correct
- Issue #58 : Changer le nom du voyage est très lent quand plusieurs trajets sont présents
- Issue #59 : Les valeurs de rouge des boutons ne sont pas correctes dans le contrôle du choix des couleurs
- Issue #60 : Le dialogue des profils a été revu
- Issue #61 : Une option a été ajoutée pour activer ou désactiver le masquage de la fenêtre des dialogues
- Issue #62 : La recherche de l'adresse a été revu dans le dialogue des notes
- Issue #63 : La largeur des dialogues a été limitée sur les grands écrans
- Issue #64 : Un avertissement est affiché quand une erreur se produit lors d'une recherche dans OpenStreetMap
- Issue #65 : Leaflet 1.9 a été publié
- Issue #66 : une erreur se produit lors du masquage de la	barre d'outils après le choix d'un mode de parcours.

Pour les autres versions, voir le document ['Quoi de neuf?' - fr ](https://wwwouaiebe.github.io/TravelNotes/userGuides/fr/QuoiDeNeuf.html)
