# Travel & Notes - Guide de l'utilisateur

1. [Pourquoi Travel & Notes](#WhyTravelNotes)
2. [Quelques explications sur les termes utilisés](#SomeExplanations)
3. [Avant de commencer à utiliser Travel & Notes](#BeforeStart)
	1. [Comment introduire vos clefs d'accès dans Travel & Notes](#APIKeys)
4. [Menus contextuels](#ContextMenus)
5. [Barre d'outils principale](#MainToolbar)
6. [Barre d'outils des cartes](#MapsToolbar)
7. [Barre d'outils des modes de parcours et des fournisseurs](#RouterToolbar)
8. [Fenêtre "Propriétés du voyage"](#TravelPropertiesWindow)
9. [Fenêtre "Notes de voyage"](#TravelNotesWindow)
10. [Fenêtre "Recherche OpenStreetMap"](#SearchOsmWindow)
11. [Boites d'édition](#EditBoxes)
12. [Trajets et points de passage](#Routes)	
	1. [Créer un point de passage](#AddWayPoint)
	2. [Ajouter un point de passage avec un glisser/déposer ](#AddWayPointDragDrop)
	3. [Modifier un point de passage ](#ModifyWayPoint)
	4. [Supprimer un point de passage](#DeleteWayPoint)
	5. [Renommer un point de passage ou changer son adresse](#RenameWayPoint)
	6. [Choisir un mode de parcours et un fournisseur d'itinéraire](#ItineraryModeAndProvider)
	7. [Calcul de l'itinéraire](#ComputingItinerary)
	8. [Sauver ou abandonner les modifications](#SaveOrDiscardRoute)
	9. [Profil d'un trajet](#RouteProfile)
	10. [Trajet en train](#TrainItinerary)
	11. [Dessiner une ligne entre deux points sur la carte](#LineItinerary)
	12. [Dessiner un cercle sur la carte](#CircleItinerary)
	13. [La boite d'édition des propriétés d'un trajet](#RouteDlg)
	14. [Imprimer les cartes d'un trajet](#PrintRouteMaps)
13. [Notes](#Notes1)
	1. [Créer une note de voyage](#NewTravelNote)
	2. [Modifier l'ordre des notes de voyage](#ReorderTravelNote)
	3. [Créer une note de trajet](#NewRouteNote)
	4. [Consulter une note](#ViewNote)
	5. [Modifier le contenu d'une note](#ModifyNote)
	6. [Effacer une note](#DeleteNote)
	7. [Déplacer l'icône d'une note](#MoveNote)
	8. [Modifier la latitude et la longitude d'une note](#LatLngNote)
	9. [Transformer une note de trajet en note de voyage](#RouteToTravelNote)
	10. [Transformer une note de voyage en note de trajet](#TravelToRouteNote)
	11. [Créer une note pour chaque manœuvre du trajet](#AllManeuverNotesFromOsm)
	12. [La boite d'édition d'une note](#NoteDlg)
		1. [Insérer du texte en html](#AddHtmltext)
		2. [Note de trajet prédéfinie "Icône SVG depuis OSM"](#SvgNoteFromOsm)
		3. [Quelques exemples de notes](#NoteSamples)
14. [Fichiers GPX](#GpxFiles)
15. [Livre de voyage](#Roadbook)
16. [Préparer un voyage et le consulter depuis internet](#PrepareTravel)
17. [Viewer](#Viewer)

<a id="WhyTravelNotes"></a>
## 1. Pourquoi Travel & Notes

Je pars de temps en temps en voyage en vélo pour plusieurs semaines, parfois dans des régions isolées. Ce genre de voyage ne s'improvise pas, même si il y a toujours une part d'imprévu. Il me fallait un outil pour préparer mon itinéraire à partir de la carte et pouvoir y ajouter des notes.

Oui, je sais, il y a des tas d'applications qui permettent de faire un itinéraire d'un point à un autre, mais aucune ne me donne vraiment satisfaction: je ne cherche pas souvent le trajet le plus court - parfois il s'agit même d'un trajet circulaire - et en général on est limité à quelques centaines de kilomètres.

En final , il est aussi important de pouvoir enrégistrer ce qui a été préparé car cela ne se fait pas en quelques minutes.Il faut aussi pouvoir imprimer le résultat. Dans certaines région isolées, il n'y a pas toujours de réseau mobile ni de possibilité de recharger une batterie. Une bonne vieille copie papier est souvent précieuse.

<a id="SomeExplanations"></a>
## 2. Quelques explications sur les termes utilisés

Un **trajet** relie deux points. Sur la carte, il est représenté par une polyligne.

Un **itinéraire** est la description des différents changements de direction nécessaires pour parcourir le trajet. Chaque changement de direction est une **manœuvre**.

Un **voyage** est constitué de un ou plusieurs trajets. Ceux-ci ne doivent pas obligatoirement se toucher à leur extrémités. Il peut également y avoir plus de deux trajets partant d'un même point.

Dans un voyage, certains trajets peuvent être **chainés** entre eux. Dans ce cas les différents trajets chainés seront considérés comme n'en faisant qu'un seul pour le calcul des distances. Une seule chaine peut-être créée par voyage, mais il n'est pas obligatoire que tous les trajets soient inclus dans la chaine.

Une **note** est un ensemble d'informations qui concerne un point précis sur la carte ou sur un trajet. Une note est composée d'une icône, d'un 'tooltip', d'un texte libre, d'une adresse, d'un lien et d'un numéro de téléphone. Aucune de ces informations n'est obligatoire, à l'exception de l'icône, qui est utilisée pour représenter la note sur la carte. Cette icône peut être une image,une photo, un texte...

Le **livre de voyage** est une page HTML qui regroupe toute l'information du voyage: les notes, les trajets et les itinéraires.

<a id="BeforeStart"></a>
## 3. Avant de commencer à utiliser Travel & Notes

Si vous utilisez Travel & Notes uniquement pour créer des notes, vous pouvez ignorer toute la partie qui concernent les clefs d'accès. Celles-ci ne sont utilisées que pour le calcul des trajets et l'affichage de certaines cartes.

Travel & Notes ne calcule pas lui-même les itinéraires des trajets. Il se connecte chez un fournisseur d'itinéraires pour obtenir cet itinéraire. Les différents fournisseurs d'itinéraire qu'il est possible d'utiliser actuellement sont GraphHopper, Stadia Maps, Mapbox, OpenRouteService et OSRM. Il est également possible de tracer une polyligne entre deux endroits, sans suivre de chemins. Un itinéraire en train entre deux gares peut aussi être ajouté, à condition que cet itinéraire soit encodé dans Openstreetmap, en respectant les règles des transports publics version 2.

Pour GraphHopper, Stadia Maps, OpenRouteService et Mapbox il est nécessaire de posséder une clef d'accès ( **API Key** ) pour se connecter au serveur. Consultez les sites internet de ces différents fournisseurs pour obtenir une clef d'accès.

Pour l' affichage de certaines cartes (Thunderforest, Lantmäteriet - Suède, Mapbox), une clef d'accès est également indispensable. Pour d'autres cartes, ce n'est pas nécessaire (OpenStreetMap, vue aérienne ESRI, IGN - Belgique, Kartverket - Norvège, Maanmittauslaitos - Finlande).

Vous devez également lire correctement  les conditions d'utilisation des clefs d'accès et vérifier que ce que vous faites avec Travel & Notes correspond à ces conditions d'utilisation.

Vous êtes également responsable de l'utilisation qui est faite de vos clefs d'accès. N'oubliez pas qu'il peut y avoir une facturation qui est faite sur la base de ces clefs d'accès. Ne les donnez pas à n'importe qui, ne les laissez pas trainer n'importe où.

<a id="APIKeys"></a>
### 3.1. Comment introduire vos clefs d'accès dans Travel & Notes

Les clefs d'accès sont gérées à partir de la boite de dialogue des clefs d'accès. Pour afficher celle-ci, cliquez sur le bouton 🔑 dans la barre d'outil en haut de l'interface.

<img src="APIKeysDialogFR.PNG" />

Pour chaque fournisseur de service, vous devez indiquer à gauche le nom de ce fournisseur  et à droite la clef d' accès. Les différents noms possibles actuellement sont 'GraphHopper', 'Lantmateriet', 'Mapbox', 'MapzenValhalla', 'OpenRouteService' et 'Thunderforest' (insensibles au majuscules/minuscules).

Utilisez le bouton + pour ajouter un fournisseur de service et le bouton ❌ à droite pour supprimer celui-ci.

Quand vos clefs d'accès sont introduites, appuyez sur le bouton 🆗 pour terminer. Vos clefs sont sauvegardées dans le "sessionStorage" du browser et disponibles jusqu'à la fermeture de l'onglet.

Il est possible de sauvegarder les clefs d'accès dans un fichier, protégé par un mot de passe ou non protégé.

**Attention**: la page doit être servie en HTTPS pour sauvegarder dans un fichier protégé par un mot de passe.

Le bouton 🔄 permet de recharger le fichier des clefs d'accès depuis le serveur web, si un fichier a été trouvé précédemment sur le serveur.

Le bouton 💾 à **gauche** de la boite de dialogue permet de sauver les clefs d'accès dans un fichier protégé par mot de passe. Celui-ci doit contenir au moins 12 caractères dont au moins une majuscule, une minuscule, un chiffre et un autre caractère.

Le bouton 📂 à **gauche** de la boite de dialogue remplace toutes les clefs d'accès de laboite de dialogue par le contenu d'un fichier protégé par mot de passe.

Ces deux boutons ne sont présents que si toutes les conditions pour pouvoir sauvegarder/restaurer les clefs avec un mot de passe sont réunies.

Le bouton 💾 à **droite** de la boite de dialogue permet de sauver les clefs d'accès dans un fichier **non protégé** par mot de passe.

Le bouton 📂 à **droite** de la boite de dialogue remplace toutes les clefs d'accès de la boite de dialogue par le contenu d'un fichier **non protégé** par mot de passe.

Ces deux boutons ne sont présents que si ils ont été activés dans le fichier TravelNotesConfig.json.

Si un fichier protégé par un mot de passe et nommé **APIKeys** est placé dans le même répertoire que Travel & Notes sur le serveur, Travel & Notes vous demandera le mot de passe à l'ouverture pour pouvoir utiliser les clefs contenues dans ce fichier.

Pour les geeks et les paranos voyez aussi ,dans le [guide d'installation](GuideInstallationFR.html#TravelNotesConfigJson) et dans le fichier TravelNotesConfig.json:
- APIKeys.saveToSessionStorage pour sauver ou non les clefs dans le sessionStorage
- APIKeysDialog.showButton pour afficher ou masquer le bouton 🔑 dans la barre d'outils
- APIKeysDialog.showAPIKeys pour montrer ou masquer les clefs comme un mot de passe dans la boite de dialogue
- APIKeysDialog.haveUnsecureButtons pour afficher ou masquer les boutons 💾 et 📂 à __droite__

<a id="ContextMenus"></a>
## 4. Menus contextuels

Tous les objets de la carte (points de passage, notes, trajets, carte) ont un menu contextuel. Toutes les commandes relatives à ces objets se trouvent dans ces menus contextuels. 

Le menu contextuel des trajets peut aussi être affiché en faisant un click droit (avec une souris) ou un long click (avec un écran tactile) sur un trajet dans la fenêtre "Propriétés du voyage".

Le menu contextuel des notes de voyage peut aussi être affiché en faisant un click droit (avec une souris) ou un long click (avec un écran tactile) sur une note dans la fenêtre "Notes de voyage".

<a id="MainToolbar"></a>
## 5 Barre d'outils principale

Lorsque la carte s'affiche, seul un petit rectangle noir est est visible dans le coin supérieur droit de la carte:

<img src="MinInterface.PNG" />

Déplacez la souris sur ce rectangle ou clickez sur celui-ci (sur un écran tactile) pour voir la barre d'outils complète.

- le bouton 🌐 ou 🏀 active ou désactive la localisation. 
- le bouton ❌ efface toutes les données du voyage et commence l'édition d'un nouveau voyage.
- le bouton 💾 sauve le voyage en cours d'édition dans un fichier sur votre ordinateur, tablette ou mobile
- le bouton 📂 ouvre un voyage préalablement sauvé dans un fichier ou ouvre un fichier .GPX
- le bouton 🌏 ouvre un voyage préalablement sauvé dans un fichier et inclut tous les trajets et toutes les notes de ce voyage dans le voyage en cours d'édition ou insère le contenu d'un fichier .GPX 
- le bouton 📙 ouvre le livre de voyage
- le bouton 🔑 affiche la boite de dialogue des clefs d'accès
- le bouton 🛄 ouvre la fenêtre "Propriétés du voyage"
- le bouton 🗨️ ouvre la fenêtre "Notes de voyage"
- le bouton 🔍 ouvre la fenêtre "Recherche OpenStreetMap"
- le bouton ☢️ sauve le voyage en cours d'édition SANS les notes ni les manœuvres.
- le bouton 🛠️ ouvre la fenêtre "À propos de Travel & Notes"
- le bouton 🔺 ou 🔻 active ou désactive l'affichage en plein écran
- le bouton + augmente la taille des textes
- le bouton - diminue la taille des textes
- le bouton 🏠 redirige vers votre page d'accueil.
- le bouton ? redirige vers la page d'aide sur Github (ce document ).
- le bouton @ redirige vers une page de contact. Par défaut, c'est [la page des issues de Travel & Notes sur Github](https://github.com/wwwouaiebe/TravelNotes/issues). L'url peut être modifiée via le fichier TravelNotesConfig.json (travelNotesToolbarUI.contactMail.url)

<a id="MapsToolbar"></a>
## 6 Barre d'outils des cartes

De même, dans le coin supérieur gauche se trouve une barre d'outils qui permet de choisir parmi plusieurs fonds de carte. Seules les cartes ne nécéssitant pas de clé d'accès ou celles pour lesquelles vous avez introduit une clef d'accès sont visibles.

<a id="RouterToolbar"></a>
## 7 Barre d'outils des modes de parcours et des fournisseurs

Dans le bas de l'écran se trouve une autre barre d'outils.

Les différents modes de parcours (vélo, piéton, voiture,train ou ligne) ainsi que les différents fournisseurs d'itinéraires sont sélectionnés sur cette barre d'outils.

<img src="RouterToolbarFR.PNG" />

Les boutons bleus à gauche permettent de sélectionner le mode de parcours, les autres boutons sélectionnent les fournisseurs d'itinéraire.

Seuls les boutons utilisables sont visibles dans la barre d'outils:
- les modes de parcours dépendent du fournisseur d'itinéraire sélectionné
- un fournisseur d'itinéraire n'est présent que si le plugin correspondant est installé et si la clef d'accès pour ce fournisseur est connue (qund une clef d'accès est nécessaire).

<a id="TravelPropertiesWindow"></a>
## 8 Fenêtre "Propriétés du voyage"

Cette fenêtre est affichée en cliquant sur le bouton 🛄 dans la barre d'outils principale.

<img src="TravelPropertiesWindowFR.PNG" />

En haut de la fenêtre vous pouvez donner un nom à votre voyage. Ceci est indispensable si vous voulez sauver votre voyage dans un ficher.

En dessous, se trouve la liste des différents trajets du voyage.

Une icône ⛓ est affichée avant le nom des trajets chainés.

Une icône 🔴 est affichée avant le nom du trajet édité.

Un clic droit (avec une souris) ou un long clic (avec un écran tactile) sur un trajet affichera le menu contextuel de ce trajet.

Si la fenêtre est trop petite pour afficher tous les trajets, utilisez la roulette de la souris pour faire défiler la liste. Sur un écran tactile faites la simplement glisser.

Vous pouvez réorganiser la liste en faisant un "tirer et déposer" avec la souris. Sur un écran tactile, vous devez faire un double-click sur le trajet à déplacer suivi d'un "glissé".

Si vous lachez le trajet à déplacer dans le bas d'un autre trajet, le trajet à déplacer sera inséré après et si vous le lacher dans le haut, il sera inséré avant.

<a id="TravelNotesWindow"></a>
## 9 Fenêtre "Notes de voyage"

Cette fenêtre est affichée en cliquant sur le bouton 🗨️ dans la barre d'outils principale.

<img src="TravelNotesWindowFR.PNG" />

Comme pour les trajets du voyage dans la fenêtre "Propriétés du voyage", il est possible d'afficher un menu contextuel et de modifier l'ordre des notes.

<a id="SearchOsmWindow"></a>
## 10 Fenêtre "Recherche OpenStreetMap"

Dans cette fenêtre, il est possible de rechercher des points d'intérêts (POI) dans OpenStreetMap. Une barre d'outils est affichée dans le haut et ensuite une liste arborescente permettant de choisir les POI à rechercher est affichée.

<img src="SearchOsmWindowFR.PNG" />

- le bouton 🔎 lance la recherche
- le bouton ▼ ouvre complètement la liste arborescente
- le bouton ▶ ferme la liste arborescente, à l'exception du premier niveau
- le bouton ❌ désélecte toute la liste arborescente

La liste arborescente peut être facilement modifiée et adaptée à vos besoins. Voir le [guide d'installation](GuideInstallationFR.html#OsmSearch).

Sélectionnez le type de POI à rechercher dans la liste arborescente et ensuite cliquez sur le bouton 🔎. Après quelques instants, les résultats sont affichés:

<img src="OsmSearchResultsFR.PNG" />

Déplacez la souris sur un des résultats. Celui-ci sera affiché sur la carte, de même que un tooltip avec tous les tags introduits dans OpenStreetMap.

Un clic droit sur un des résultats montrera un menu contextuel permettant de créer des notes avec ce résultat ou de choisir ce résultat comme point de passage pour l'itinéraire en cours d'édition.

La zone de recherche est limitée à la carte affichée sur l'écran avec un maximum de 10 km sur 10 km.

Lorsque la fenêtre "Rechercher dans OpenStreetMap" est activé, un carré rouge montrant les limites de la prochaine recherche est affiché à l'écran. Le carré vert montre les limites de la recherche précédente.

<a id="EditBoxes"></a>
## 11. Boites d'édition

Parfois, une boite d'édition peut masquer un objet de la carte que l'on désire consulter. Il est toujours possible, soit de déplacer / modifier la carte avec un zoom ou un pan, soit de glisser / déposer la boite d'édition en la saississant par la barre dans la partie supérieure.

<a id="Routes"></a>
## 12. Trajets et points de passage

Pour ajouter, modifier ou supprimer des points de passage, il est nécessaire d'éditer le trajet depuis l'interface ou via le menu contextuel du trajet si celui-ci existe déjà.

Les autres modifications (notes, propriétés du trajet) peuvent se faire, que le trajet soit édité ou non.

<a id="AddWayPoint"></a>
### 12.1. Créer un point de passage

Pour créer un point de passage, faites un clic droit sur la carte à l'endroit souhaité et choissisez "Sélectionner cet endroit comme point de départ", "Sélectionner cet endroit comme point intermédiaire" ou "Sélectionner cet endroit comme point d'arrivée", "Sélectionner cet endroit comme point de départ et d'arrivée" dans le menu:

<img src="MapContextMenuFR.PNG" />

Une icône verte (pour le point de départ), orange (pour un point intermédiaire) ou rouge (pour le point de fin) est ajoutée à la carte à l'endroit choisi.

Un point intermédiaire ajouté via le menu contextuel sera toujours ajouté à la fin de la liste des points intermédiaires.

<a id="AddWayPointDragDrop"></a>
### 12.2. Ajouter un point de passage avec un glisser/déposer

Amenez la souris sur le trajet ou cliquez sur le trajet à l'endroit souhaité (écran tactile) pour voir apparaître un point de passage temporaire gris. En faisant ensuite un glisser / déposer de celui-ci, le point de passage est ajouté au trajet.

<img src="AddWayPointFR.PNG" />

<a id="ModifyWayPoint"></a>
### 12.3. Modifier un point de passage 

Faites un glisser / déposer du point de passage sur la carte pour modifier un point de passage

<a id="DeleteWayPoint"></a>
### 12.4. Supprimer un point de passage

Faites un clic droit sur le point de passage et choisissez "supprimer ce point de passage" dans le menu. Il n'est pas possible de supprimer le point de départ ni le point de fin. Seul un glisser / déposer est possible.

<a id="RenameWayPoint"></a>
### 12.5. Renommer un point de passage ou changer son adresse

Quand un point de passage est créé, son adresse est recherchée avec Nominatim. Si un nom, tel que un nom de magasin ou d'immeuble est trouvé par Nominatim, celui-ci sera également ajouté ( voir wayPoint.geocodingIncludeName dans le fichier TravelNotesConfig.json pour désactiver cette possibilité ).

Vous pouvez modifier ce nom et cette adresse en faisant un clic droit sur le point de passage et en sélectionnant "Modifier les propriétés de ce point de passage" dans le menu contextuel.

À noter cependant que chaque fois que le point de passage est déplacé, le nom et l'adresse seront modifiés par Nominatim et vos modificatons perdues. Il vaut donc mieux faire ces changements quand vous êtes certain de ne plus déplacer ce point de passage.

<a id="ItineraryModeAndProvider"></a>
### 12.6. Choisir un mode de parcours et un fournisseur d'itinéraire

Utilisez les boutons dans le bas du contrôle pour modifier le mode de déplacement (vélo, piéton, voiture ou train) ainsi que le fournisseur de trajet.

<img src="RouterToolbarFR.PNG" />

<a id="ComputingItinerary"></a>
### 12.7. Calcul de l'itinéraire

Lorsque le point de départ et le point de fin sont connus, l'itinéraire est calculé et affiché sur la carte. Il en est de même chaque fois qu'un point intermédiaire est ajouté ou qu'un point de passage est déplacé.

La description de l'itinéraire est également affichée dans la partie "Itinéraire et notes".

<a id="SaveOrDiscardRoute"></a>
### 12.8 Sauver ou abandonner les modifications

Lorsque l'édition d'un trajet est terminée, il faut sauver celle-ci. Faites un clic droit sur le trajet et sélectionnez 'Sauver les modifications de ce trajet' dans le menu contextuel.

Il est également possible d'abandonner l'édition d'un trajet et de revenir à la situation avant modifications avec la commande 'Abandonner les modifications de ce trajet'. Attention, __toutes__ les modifications seront perdues, y compris les propriétés modifiées et les notes ajoutées depuis le début de l'édition.

<a id="RouteProfile"></a>
### 12.9 Profil d'un trajet

Lorsque un trajet est calculé avec GraphHopper ou OpenRouteService, il est possible d'afficher un profil de ce trajet. Faites un clic droit sur le __trajet__ et sélectionnez "Voir le profil du trajet" dans le menu contextuel.

<img src="ProfileFR.PNG" />

Il peut y avoir plusieurs fenêtres affichant des profils ouvertes.

Il est possible de déplacer un profil sur l'écran en faisant un glisser/déposer de la barre supérieure de la fenêtre.

<a id="TrainItinerary"></a>
### 12.10 Trajet en train

- sélectionnez TravelNotesPublicTransport comme fournisseur de trajet en cliquant sur l'icône <img src="trainRed.svg" width="20px" height="20px" /> dans le bas de l'interface
- faites un clic droit sur la carte à proximité de la gare de départ et choisissez "Sélectionner cet endroit comme point de départ" dans le menu contextuel.
- faites un clic droit sur la carte à proximité de la gare de destination et choisissez "Sélectionner cet endroit comme point de fin" dans le menu contextuel.
- après quelques instants, une liste de tous les trains reliant les deux gares est affichée 

<img src="TrainsSelectBox.PNG" />

- ouvrez la liste 

<img src="TrainsSelectBoxOpen.PNG" />

et sélectionnez le train correspondant au trajet souhaité et terminez en cliquant sur le bouton 🆗.

- le trajet en train s'affichera sur la carte.

<img src="TrainMap.PNG" /> 

- les différents arrêts du train seront ajoutés à l'itinéraire.

<a id="LineItinerary"></a>
### 12.11. Dessiner une ligne entre deux points sur la carte

- sélectionnez "Polyline & Circle" comme fournisseur de trajet en cliquant sur l'icône <img class="icon" src="polyline.svg" width="20px" height="20px"/> dans le bas de l'interface et "Itinéraire à vol d'oiseau" comme mode de déplacement en cliquant sur l'icône <img class="icon" src="line.svg" width="20px" height="20px"/>.
- indiquez le point de départ et le point de fin ainsi que éventuellement des points intermédiaires. Entre chacun des points indiqués, une portion de "grand cercle" est dessinée.

Notez que, en fonction des points choisis, le résultat sur la carte peut être une ligne, un arc de cercle ou une partie de sinusoïde, mais dans tous les cas ce sera la représentation d'une portion de grand cercle sur le globe terrestre ( = le plus court chemin entre les deux points).

<img src="HELJFK.PNG" />

<a id="CircleItinerary"></a>
### 12.12. Dessiner un cercle sur la carte

- sélectionnez "Polyline & Circle" comme fournisseur de trajet en cliquant sur l'icône <img class="icon" src="polyline.svg" width="20px" height="20px"/> dans le bas de l'interface et "Cercle" comme mode de déplacement en cliquant sur l'icône <img class="icon" src="circle.svg" width="20px" height="20px"/>.
- Indiquez le centre du cercle en utilisant la commande "Sélectionner cet endroit comme point de départ" et un point devant être sur le cercle en utilisant la commande "Sélectionner cet endroit comme point de fin".

Ici aussi, le résultat peut être une ellipse, un rectangle ou une sinusoïde mais dans tous les cas ce sera la représentation d'un cercle sur le globe terrestre.

<a id="RouteDlg"></a>
### 12.13 La boite d'édition des propriétés d'un trajet

Faites un clic droit sur le trajet et sélectionnez "Modifier les propriétés de ce trajet" dans le menu contextuel.

<img src="RoutePropertiesFR.PNG" />

Vous pouvez tout d'abord modifier les noms du trajet et remplacer le nom proposé par le programme par un nom de votre choix. 

Notez que quand le nom a été modifié, les adresses ne seront plus ajoutées au nom, même si vous modifiez les points de départ et d'arrivée. 

Il est également possible de modifier la largeur du trajet ainsi que le type de ligne et également chainer le trajet au voyage.

Enfin vous pouvez modifier la couleur utilisée pour afficher le trajet. Sélectionnez une couleur parmi les 6 rangées de boutons de couleur. La tirette sous les boutons de couleur ajoute plus ou moins de nuance de rouge dans les couleurs proposées.

Chaque nuance de rouge, vert et bleu pour la couleur désirée peut également être réglée individuellement via les 3 zones d'édition des couleurs.

<a id="PrintRouteMaps"></a>
### 12.14 Imprimer les cartes d'un trajet

Attention: cette commande est expérimentale. Elle peut ne pas fonctionner avec votre installation de Travel & Notes si vous avez ajouté d'autres éléments à la page. De plus, les browsers ne réagissent pas tous de la même façon aux balises css, spécialement celles qui imposent un saut de page à l'impression. Si cette commande ne vous convient pas, vous pouvez la désactiver à partir du fichier TravelNotesConfig.json (printRouteMap.isEnabled). Voir le [guide d'installation](GuideInstallationFR.html#TravelNotesConfigJson).

Faites un clic droit sur le trajet pour lequel vous voulez imprimer les cartes et sélectionnez "Imprimer les cartes de ce trajet" dans le menu contextuel.

La boite d'édition est affichée:

<img src="PrintRouteMapDlgFR.PNG" />

"Largeur du papier" et "hauteur du papier": il s'agit de la largeur et hauteur de la zone imprimable du papier. Vous devez contrôler celle-ci avec votre imprimante.

"Dimension de la marge": c'est une zone autour de la carte et à l'interieur de celle-ci qui sera réimprimée dans la carte suivante.

"Zoom" : le zoom à utiliser pour les cartes. Il est indépendant du zoom utilisé pour afficher la carte avant le lancement de la commande. Pour des raisons de performance des serveurs de tuiles, il n'est pas possible d'utiliser un zoom plus grand que 15.

"Imprimer les notes du trajet" quand cette case est cochée, l'icône des notes est imprimée sur la carte.

Enfin, sélectionnez le browser que vous utilisez (soit Firefox, soit un autre browser basé sur Chrome). Ce choix est important : la carte peut être mal découpée en bas de page dans le cas d'un mauvais choix.

Lorsque la boite d'édition est fermée avec le bouton "ok", la carte et les contrôles sont remplacés par des vues de la carte qui ont les dimensions souhaitées et deux boutons sont présents en haut à gauche:

<img src="PrintRouteMapToolbar.PNG" />

Le bouton 🖨️ lancera la commande d'impression de votre browser et le bouton ❌ annulera l'impression et réaffichera la carte.

Lorsque la commande d'impression du browser est fermée, les vues d'impression seront également fermées et la carte réaffichée.

Toutes les valeurs par défaut de la boite d'édition peuvent être modifiées dans le fichier TravelNotesConfig.json. Voir le [guide d'installation](GuideInstallationFR.html#TravelNotesConfigJson).

Évitez de surcharger les serveurs de tuiles. Ne lancez cette commande que si vous en avez réellement besoin. Diminuer les dimensions du papier, la dimension de la marge et le zoom diminuera également le nombre de tuiles nécessaires.

Lorsque la boite d'édition est fermée, le programme calcule le nombre de tuiles nécessaires. Si ce nombre est trop important, la commande est arrêtée.

#### Quelques astuces pour imprimer

- indiquez comme "hauteur de papier" la hauteur réelle de votre papier moins les marges d'impression haut et bas moins 1 mm
- pour les geeks: vous pouvez insérer un fichier css dans la page html avec une règle css @page pour fixer les dimensions, orientation et marges du papier:

```
@page {
  size: A4 landscape;
  margin: 7mm;
}
```

- vérifiez que tout est correct avec la commande "Aperçu avant impression"

<a id="Notes1"></a>
## 13. Notes

Il y a deux sortes de notes: les notes de voyage et les notes de trajet. La position des notes de voyage est totalement libre et elles seront toutes affichées au début du livre de voyage. Les notes de trajet sont toujours positionnées sur un trajet et affichées avec l'itinéraire dans le livre de voyage.

<a id="NewTravelNote"></a>
### 13.1. Créer une note de voyage

Faite un clic droit à l'endroit souhaité sur la __carte__ et sélectionnez "Ajouter une note de voyage" dans le menu contextuel.

<a id="ReorderTravelNote"></a>
### 13.2. Modifier l'ordre des notes de voyage

L'ordre des notes de voyage peut se modifier en faisant du glisser / déposer dans la fenêtre des notes de voyage.

<a id="NewRouteNote"></a>
### 13.3. Créer une note de trajet

Faite un clic droit à l'endroit souhaité sur le __trajet__ et sélectionnez "Ajouter une note à ce trajet" dans le menu contextuel.

<a id="ViewNote"></a>
### 13.4. Consulter une note

Faites un clic gauche sur l'icône de la note.

<a id="ModifyNote"></a>
### 13.5 Modifier le contenu d'une note

Faites un clic droit sur l'icône de la note et sélectionnez "Éditer cette note" dans le menu contextuel.

<a id="DeleteNote"></a>
### 13.6. Effacer une note

Faites un clic droit sur l'icône de la note et sélectionnez "Effacer cette note" dans le menu contextuel.

<a id="MoveNote"></a>
### 13.7. Déplacer l'icône d'une note

Faites un glisser / déposer de la note. Une ligne sera tracée entre l'icône de la note et le point choisi pour l'insertion de la note. La latitude et longitude de la note ne sont pas modifiées.

<a id="LatLngNote"></a>
### 13.8. Modifier la latitude et la longitude d'une note

Déplacez l'icône de la note pour que la ligne soit visible. Déplacez la souris près de l'extrémité de la ligne. Lorsque un petit carré noir apparait sur celle-ci, faites un glisser / déposer de ce carré et de la ligne.

Une note de trajet a toujours sa latitude et longitude sur le trajet. Lorsque la ligne est déposée, le point le plus proche sur le trajet est recherché et l'extrémité libre de la ligne déplacé vers ce point.

<a id="RouteToTravelNote"></a>
### 13.9. Transformer une note de trajet en note de voyage

Faites un clic droit sur l'icône de la note et sélectionnez "Transformer en note de voyage" dans le menu contextuel. La transformation n'est possible que si aucun trajet n'est en cours d'édition.

<a id="TravelToRouteNote"></a>
### 13.10. Transformer une note de voyage en note de trajet

Faites un clic droit sur l'icône de la note et sélectionnez "Transformer en note de trajet" dans le menu contextuel. La transformation n'est possible que si aucun trajet n'est en cours d'édition. La note sera attachée au trajet le plus proche de celle-ci.

<a id="AllManeuverNotesFromOsm"></a>
### 13.11 Créer une note pour chaque manœuvre du trajet

Faites un clic droit sur le trajet et sélectionnez "Créer une note pour chaque manœuvre du trajet" dans le menu contextuel. Une demande de confirmation est affichée. Pour chaque manœuvre du trajet, [une note en SVG à partir des données OpenStreetMap ](#SvgNoteFromOsm) sera créée.

<a id="NoteDlg"></a>
### 13.12. La boite d'édition d'une note

<img src="NoteEditionFR.PNG" />

Dans le haut de la boite, une liste déroulante permet de choisir des notes prédéfinies. Il est possible de modifier cette liste. Consultez le [guide d'installation](GuideInstallationFR.html#TravelNotesNoteDialogJson).

Le bouton ▼ cache ou affiche certaines zones d'édition qui sont masquées par défaut (les deux contrôles permettant de modifier les dimensions de l'icône et le n° de téléphone ). Il est possible de choisir quelles zones sont masquées par défaut. Consultez le [guide d'installation](GuideInstallationFR.html#TravelNotesConfigJson)

Le bouton 📂 vous permet de charger votre propre fichier avec des notes prédéfinies dans Travel & Notes. Consultez le [guide d'installation](GuideInstallationFR.html#TravelNotesNoteDialogJson). pour savoir comment créer ce fichier.

Tous les autres boutons sont modifiables et permettent d'insérer des balises html ou du texte prédéfini dans les zones d'édition. Voir le [guide d'installation](GuideInstallationFR.html#TravelNotesNoteDialogJson).

La zone "Contenu de l'icône" sera utilisée pour représenter la note sur la carte et ne peut pas être vide (laisser cette zone vide empêcherait toute modification ultérieure de la note).

La zone "Adresse" est complétée automatiquement lors de la création de la note - [Nominatim](http://wiki.openstreetmap.org/wiki/Nominatim) est utilisé pour le nom de rue et OverpassAPI pour le nom de commune. Cette zone ne sera jamais modifiée par Nominatim par la suite, même si la note a été déplacée. Le bouton 🔄 permet cependant de demander une nouvelle géolocalisation à Nominatim/OverpassAPI.

Si la zone d'édition du téléphone contient seulement un numéro de téléphone valide (= commençant par un + et ensuite uniquement des chifres ou les caractères #, * ou espace), le numéro de téléphone sera affiché avec un lien tel: et un lien sms:.

Chaque zone d'édition peut contenir du texte simple ou du html, à l'exception de la zone "Lien" qui ne peut contenir qu'un lien valide.

<a id="AddHtmltext"></a>
#### 13.12.1 Insérer du texte en html

Seules les balises html et attributs suivantes peuvent être utilisé·e·s:
- la balise &lt;div&gt; (bloc de texte)
- la balise &lt;p&gt; (paragraphe)
- les balises &lt;h1&gt; à &lt;h6&gt; (titres)
- la balise &lt;hr&gt; (ligne horizontale)
- la balise &lt;ol&gt; (liste à puces ou liste numérotée)
- la balise &lt;li&gt; (élément de liste à puce)
- la balise &lt;ul&gt; (élément de liste numérotée)
- la balise &lt;span&gt; (bloc de texte en inline)
- la balise &lt;figure&gt; (figure)
- la balise &lt;figcaption&gt; (légende pour la balise figure)
- la balise &lt;img&gt; avec les attributs src, alt width et height (image)
- la balise &lt;a&gt; avec les attributs href et target
- la balise &lt;del&gt; (texte supprimé)
- la balise &lt;ins&gt; (texte ajouté)
- la balise &lt;mark&gt; (texte surligné)
- la balise &lt;s&gt; (texte barré)
- la balise &lt;em&gt; (texte en italique)
- la balise &lt;small&gt; (texte en petits caractères)
- la balise &lt;strong&gt; (texte en gras)
- la balise &lt;sub&gt; (texte en indice)
- la balise &lt;sup&gt; (texte en exposant)

En outre, les balises svg suivantes peuvent être utilisées:
- la balise &lt;svg&gt; avec les attributs xmlns et viewBox
- la balise &lt;text&gt; avec les attributs x, y et text-anchor
- la balise &lt;polyline&gt; avec les attributs points et transform

Pour toutes les balises, les attributs id, class, dir et title peuvent également être utilisées.

Les règles d'édition du html sont bien sûr d'application:
- une balise ouvrante ET une balise fermante doivent être utilisées: &lt;p&gt;Lorem ipsum... &lt;/p&gt;
- les valeurs des attributs doivent toujours être placées entre des &quot; : class=&quot;myClass&quot;
- les caractères &lt; et &gt; sont réservés pour les balises html et ne peuvent être utilisés ailleurs. Si vous avez absolument besoin de ces caractères, vous devez les remplacer par les entités html &amp;lt; pour &lt; et &amp;gt; pour &gt;
- les doubles guillemets sont réservés pour la délimitation des valeurs d'attribut. En cas de besoin utilisez l'entité html &amp;quot; en remplacement
- le caractère &apos; ne peut pas être utilisé et doit être remplacé par l'entité html &amp;apos;
- le caractère &amp; est ambigü et ne devrait être utilisé que dans les entités html
- l'espace insécable doit être inséré avec l'entité html &amp;nbsp;

Les url's introduits dans les attributs href et src, ainsi que dans la zone d'édition "lien" doivent être des url's valides:
- les url's doivent être des liens absolus
- les url's ne peuvent pas contenir les caractères &lt;, &gt;, &apos; et &quot;
- les protocoles doivent être http:, https:, mailto:, sms: ou tel: pour un attribut href:
- les protocoles doivent être https: pour l'attribut src (http: est également acceptable si le protocole de l'apps est http:)
- les 'pathname' des liens sms: et tel: doivent commencer par un + et ne contenir que les caractères #, * ou des chiffres

Au fur et à mesure que du texte est inséré dans une zone d'édition, l'apps interprète celui-ci et adapte la prévisualisation de la note en conséquence. Lorsque la boite d'édition est fermée avec le bouton 🆗, le texte que vous avez introduit est remplacé par celui produit par l'interprétation que l'apps en a fait.

<a id="SvgNoteFromOsm"></a>
#### 13.12.2 Note de trajet prédéfinie "Icône SVG depuis OSM"

Lorsque l'on crée une note de trajet, il est possible de choisir "Icône SVG depuis OSM" dans la liste des notes prédéfinies. Dans ce cas, Travel & Notes va rechercher dans Openstreetmap l'intersection la plus proche située sur le trajet et va créer une icône en SVG reprenant les rues proches de cette intersection.

L'intersection sera placée au centre de l'icône et le contenu de celle-ci sera orientée en fonction du trajet suivi: la route par laquelle on arrive à l'intersection sera tournée vers le bas de l'icône.

L'adresse sera également modifiée: tous les noms de rue trouvés à l'intersection seront indiqués, séparés par un symbole ⪥. Le premier nom de rue sera toujours celui par lequel on arrive à l'intersection et le dernier nom celui par lequel on quitte l'intersection. Ce nom sera précédé d'une flèche indiquant la direction à suivre. Le nom de la commune / ville sera également ajouté. Si un nom de hameau ou de village est trouvé à proximité de l'intersection, celui-ci sera également ajouté entre parenthèses.

<a id="NoteSamples"></a>
#### 13.12.3 Quelques exemples de notes 

##### Une note simple créée à partir d'une note prédéfinie

La boite de dialogue: 

<img src="NoteStandard1FR.PNG" />

Et le résultat dans TravelNotes:

<img src="NoteStandard2FR.PNG" />

##### Une note de trajet créée avec "Icône SVG depuis OSM"

Le trajet va de la droite vers la gauche. L'intersection des rues Tiyou d'Hestreu, Chemin des Patars et Basse Voie se trouve au centre de l'icône. Les rues sont orientées de telle sorte que une personne qui suit le trajet sur le terrain voit les rues dans la même position que sur l'icône. La rue par laquelle on arrive est le Tiyou d'Hestreu. Une flèche vers la droite indique qu'il faut tourner à droite dans la Basse Voie. Nous sommes dans la commune de Anthisnes et au hameau de Limont.

<img src="SVGIconFR.PNG" />

##### Une note avec un texte sur une ligne

La boite de dialogue: 

<img src="NoteTexte1FR.PNG" />

Et le résultat dans TravelNotes:

<img src="NoteTexte2FR.PNG" />

##### Une note avec une photo

La boite de dialogue: 

<img src="NotePhoto1FR.PNG" />

Et le résultat dans TravelNotes:

<img src="NotePhoto2FR.PNG" />

<a id="GpxFiles"></a>
## 14. Fichiers GPX

Lorsque un fichier .GPX est ouvert avec le bouton 📂 ou importé avec le bouton 🌏, les règles suivantes sont appliquées:

- Pour chaque balise &lt;trk&gt; trouvée dans le fichier .gpx, une route est créée dans TravelNotes
- Les contenus de toutes les balises &lt;trkseg&gt; trouvées à l'intérieur d'une balise &lt;trk&gt; sont fusionnés en une seule balise &lt;trkseg&gt; et, par conséquent, les tronçons manquants de la route, dus à une interruption de la réception gps, sont remplacés par une ligne droite.
- Si une et une seule balise &lt;rte&gt; est trouvée dans le fichier .gpx, alors:
	- Si une balise &lt;name&gt; est trouvée dans la balise &lt;rte&gt;, le contenu de cette balise sera utilisé comme nom pour la route créée.
	- Pour chaque balise &lt;rtept&gt; trouvée dans la balise &lt;rte&gt;,une manœuvre est créée, à partir du contenu de cette balise et ajoutée à la route. Cependant, aucune icône ne sera créée pour cette manœuvre.
- Si des balises &lt;wpt&gt; sont trouvées dans le fichier .gpx et si une seule route a été ajoutée, alors un point de passage est créé pour chaque balise &lt;wpt&gt; et ce point de passage sera ajouté à la route. De plus, si le fichier .GPX a été créé à partir des sites [fietsnet.be](https://www.fietsnet.be/routeplanner/default.aspx) ou [knooppuntnet.be](https://knooppuntnet.be/fr/), une note avec le numéro du point noeud sera créée.
- Dans le cas contraire, des points de passage seront créés au début et à la fin de chaque route ajoutée.

<a id="Roadbook"></a>
## 15. Livre de voyage

Cliquez sur le bouton 📙. Un nouvel onglet est créé avec le livre de voyage. Celui-ci contient tous les trajets ainsi que toutes les notes qui ont été créées sur la carte. Il est possible de choisir ce que l'on désire voir présent dans le livre de voyage via le menu en haut de page :

<img src="RoadbookFR.PNG" />

<a id="PrepareTravel"></a>
## 16. Préparer un voyage et le consulter depuis internet

Il est possible de préparer un voyage, sauver celui-ci dans un fichier sur un serveur web et consulter celui-ci depuis internet.

Pour consulter le voyage, il faut appeler TravelNotes en lui donnant en paramètre dans l'url l'adresse du fichier convertie en base64. Et rappelez-vous que l'on ne peut convertir en base64 que des caractères ascii...

```
https://wwwouaiebe.github.io/TravelNotes/demo/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9UcmF2ZWxOb3Rlcy9zYW1wbGVzL0xpZWdlL1N0YXRpb25Ub1lvdXRoSG9zdGVsLnRydg==
```

aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9UcmF2ZWxOb3Rlcy9zYW1wbGVzL0xpZWdlL1N0YXRpb25Ub1lvdXRoSG9zdGVsLnRydg== est l'équivalent de https://wwwouaiebe.github.io/TravelNotes/samples/Liege/StationToYouthHostel.trv encodé en base64

Voir l'exemple sur la [démo](https://wwwouaiebe.github.io/TravelNotes/demo/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9UcmF2ZWxOb3Rlcy9zYW1wbGVzL0xpZWdlL1N0YXRpb25Ub1lvdXRoSG9zdGVsLnRydg==)

Quand un tel fichier est affiché, il n'est pas possible de modifier celui-ci. Le contrôle n'est pas visible et tous les menus contextuels sont désactivés.

<a id="Viewer"></a>
## 17. Viewer

Certains browsers anciens, surtout sur des mobiles, ne comprennent pas toujours tout le code JavaScript de Travel & Notes. Dans ce cas, vous pouvez essayer une version simplifiée de Travel & Notes qui permet juste la visualisation des fichiers. L'url doit être complétée de la même façon que pour la version normale:

```
https://wwwouaiebe.github.io/TravelNotes/viewer/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9zYW1wbGVzL0xpZWdlL1N0YXRpb25Ub1lvdXRoSG9zdGVsLnRydg==
```

Vous pouvez cependant ajouter &lay à la fin de l'url pour afficher également une barre d'outils reprenant les fonds de carte ne nécéssitant pas de clef d'accès.

Vous pouvez également utiliser le clavier pour quelques commandes:

- les flèches __haut__ , __bas__, __gauche__ et __droite__ pour déplacer la carte
- __+__ et __-__ pour zoomer sur la carte
- __Z__ et __z__ pour zoomer sur le voyage
- __G__ et __g__ pour activer/deactiver la géolocalisation
- les chiffres de __0__ à __9__ pour activer d'autres fonds de carte ( les chiffres utilisables dépendent des fonds de carte définis dans le fichier TravelNotesLayers.json - Seules les cartes ne nécessitant pas de clefs d'accès peuvent être affichées, le viewer ne gérant pas les clefs d'accès ).

```
https://wwwouaiebe.github.io/TravelNotes/demo/viewer/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9UcmF2ZWxOb3Rlcy9zYW1wbGVzL0xpZWdlL1N0YXRpb25Ub1lvdXRoSG9zdGVsLnRydg==&lay
```

Voir l'exemple sur la [démo](https://wwwouaiebe.github.io/TravelNotes/demo/viewer/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9UcmF2ZWxOb3Rlcy9zYW1wbGVzL0xpZWdlL1N0YXRpb25Ub1lvdXRoSG9zdGVsLnRydg==&lay)

D'autres exemples:

[Un extrait de mon dernier voyage en vélo de Dover à Chester](https://wwwouaiebe.github.io/TravelNotes/demo/viewer/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9UcmF2ZWxOb3Rlcy9zYW1wbGVzL1VLMjAxOS9VSzIwMTkudHJ2) 

[Les cartes du premier trajet de Dover à Chester](https://wwwouaiebe.github.io/TravelNotes/samples/UK2019/UK2019.pdf)

[Un voyage en train, bus et vélo de Liège à Tromsø](https://wwwouaiebe.github.io/TravelNotes/demo/viewer/?fil=aHR0cHM6Ly93d3dvdWFpZWJlLmdpdGh1Yi5pby9UcmF2ZWxOb3Rlcy9zYW1wbGVzL0xpZWdlLVRyb21zby9zdW9taTIwMTgwNjA4LnRydg==)

[Et le livre de voyage de Liège à Tromsø](https://wwwouaiebe.github.io/TravelNotes/samples/Liege-Tromso/suomi20180608-Roadbook.pdf)
