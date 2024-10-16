## Quoi de neuf

### Quoi de neuf dans la version 1.6.0

- La gestion des clefs d'accès a été entièrement revue. Celle-ci se fait maintenant via une boite de dialogue et il est
possible de lire / sauver ces clefs d'accès depuis / vers un fichier protégé par mot de passe.
- L'affichage des erreurs a été amélioré
- Une barre d'outils permettant des gérer les fonds de cartes a été ajoutée.
- Un viewer léger a été créé. Celui-ci permet la visualisation d'un voyage sur un appareil ancien qui ne comprend pas
toutes les nouveautés de JavaScript

De nombreuses modifications techniques ont également été faites:
- Tout le code a été migré vers ES6 et utilise les modules ES6 au lieu de modules nodeJS
- eslint est utilisé pour vérifier la qualité du code
- toutes les boites de dialogue sont basées sur l'utilisation de Promise
- les mises à jour de l'interface utilisateur et de la carte se font via des events, ce qui réduit fortement
les dépendances dans le code.

### Quoi de neuf dans la version 1.7.0

- Lorsque OpenRouteService ou GraphHopper sont utilisés comme fournisseurs d'itinéraire, il est également possible d'afficher le profil de la route.
- Lorsque un trajet entre deux points est fait avec TravelNotesPolyline ce trajet n'est plus représente sous forme de ligne droite,
mais bien sous forme d'un segment de grand cercle. Voir la documentation de [TravelNotesPolyline](https://github.com/wwwouaiebe/TravelNotesPolyline/blob/master/README.md)
- Il est également possible de tracer des cercles avec TravelNotesPolyline. Voir la documentation de [TravelNotesPolyline](https://github.com/wwwouaiebe/TravelNotesPolyline/blob/master/README.md)

### Quoi de neuf dans la version 1.8.0

- Ajouter un point de passage à un trajet a été amélioré. Il suffit maintenant d'amener la souris sur le trajet pour voir apparaître un point de passage temporaire.
En faisant ensuite un glisser / déposer de celui-ci, le point de passage est ajouté au trajet.

### Quoi de neuf dans la version 1.9.0

- Il est maintenant possible d'imprimer les cartes d'un trajet.

### Quoi de neuf dans la version 1.10.0

- Un nouveau fournisseur de service, basé sur Mapzen Valhalla, a été ajouté: Stadia Maps
- Un bouton permettant de recharger les clefs d'accès a été ajouté dans la boite de dialogue de gestion des clefs d'accès
- Un message d'erreur est affiché quand un problème survient lors de la lecture du fichier des clefs d'accès
- Quelques bugs sont corrigés

### Quoi de neuf dans la version 1.11.0

- Les notes de trajet prédéfinie "Icône SVG depuis OSM" ont été améliorées pour les entrées et sorties des rond-points
- Il est possible de créer une note pour toutes les manoeuvres d'un trajet en une opération
- L'affichage des erreurs lors de la lecture du fichier "APIKeys" a été amélioré
- Quelques bugs sont corrigés ( Issues #113, #115, #116, #117 et #118)

### Quoi de neuf dans la version 1.12.0

- L'interface utilisateur a été modifiée. Consultez le [guide pour les utilisateurs - fr ](https://github.com/wwwouaiebe/TravelNotes/blob/gh-pages/TravelNotesGuides/fr/GuideUtilisateurFR.md).
- Toutes les commandes sont uniformisées. Chaque objet (carte, route, note, point de passage, manoeuvre) est créé, modifié ou supprimé via des commandes
dans des menus contextuels qui sont disponibles sur la carte ou dans l'interface utilisateur.
- Les performances sont améliorées. L'utilisation de la mémoire a fortement diminué et les temps de chargement réduits. Cela est particulièrement sensible pour de longs voyages.
- [Tout le code est documenté](https://wwwouaiebe.github.io/TravelNotes/TechDoc/)

### Quoi de neuf dans la version 1.13.0

- Il est possible de rechercher des points d'intérêt dans OpenStreetMap.
- Des notes peuvent être créées à partir des résultats de recherche dans OpenStreetMap.
- De nouvelles notes prédéfinies ont été ajoutées. Il y a maintenant plus de 70 notes prédéfinies.
- L'arrière-plan des notes peut être transparent.
- Toutes les icônes des notes prédéfinies sont désormais en svg.

### Quoi de neuf dans la version 2.0.0

Pour éviter des [attaques xss](https://fr.wikipedia.org/wiki/Cross-site_scripting), notamment lors de l'échange de fichiers, toute la sécurité de l'apps a été revue, 
ce qui entraine un certain nombre de limitations et de modifications:
- [Content Security Policy](https://developer.mozilla.org/fr/docs/Web/HTTP/CSP) est activé par défaut via une balise &lt;meta&gt; dans le fichier index.html. 
Grâce à cela, il n'est plus possible d'exécuter du javascript depuis un autre site que celui où est installé Travel & Notes, d'exécuter des scripts en inline 
dans le html ni de télécharger des images ou des fichiers depuis un autre site.
Si vous en avez la possibilité, il est cependant préférable d'activer Content Securty Policy via un header installé par le serveur plutôt que via une balise &lt;meta&gt;.
- les balises html pouvant être utilisées lors de la création des notes sont restreintes, de même que les attributs attachés à ces balises html.
Consultez le [guide pour les utilisateurs - fr ](https://github.com/wwwouaiebe/TravelNotes/blob/gh-pages/TravelNotesGuides/fr/GuideUtilisateurFR.md#AddHtmltext).
- lors de l'ouverture d'un fichier de voyage réalisé avec une version antérieure, toutes les balises et les attributs non autorisés sont effacé·e·s.
- afin d'éviter une attaque xss via un lien envoyé par mail, il n'est plus possible d'ouvrir automatiquement un fichier de voyage via l'url de l'apps quand ce fichier
de voyage provient d'un autre site, même si Content Security Policy est complètement désactivé.
- il n'est plus possible de définir des styles en inline. Si vous désirez créer un style personnalisé, il faut le créer dans un fichier css et importer celui-ci
avec une balise &lt;link&gt;
- il n'est évidemment plus possible d'utiliser une balise &lt;script&gt; ni aucun gestionnaire d'événements attaché à une balise html (onmouseover, onclick...).
- les liens présents dans les attributs href et src doivent être corrects et complets. Dans un attribut src, le protocole ne peut être que https: (et http: si l'apps
est installée sur un site http:). Dans les attributs href, le protocole doit être http:, https:, mailto:, sms: ou tel:. En outre, les liens sms: et tel: doivent commencer par
un + et ne peuvent comprendre que les caractères #, * espace et des chiffres de 0 à 9.
- il n'est plus possible d'entrer les clefs API des fournisseurs de service via des paramètres de l'url.

En outre, les améliorations suivantes on été apportées:
- les icônes SVG depuis OSM contiennent le numéro du point-noeud lorsque l'icône se trouve sur ce point-noeud et que l'itinéraire est calculé pour un vélo (N.B. les 
points-noeuds sont une particularité des itinéraires vélo en Belgique, aux Pays-Bas et partiellement en Allemagne).
- il est nécessaire de nommer le voyage avant de pouvoir sauver celui-ci dans un fichier
- une solution temporaire a été créée pour contourner les erreurs de noms de commune retournés par Nominatim.
- une prévisualisation de la note en cours d'édition a été ajoutée à la boite d'édition des notes.
- il est possible de cacher ou activer certaines parties de cette même boite d'édition.

### Quoi de neuf dans la version 2.1.0

La version 2.1.0. est avant tout une version contenant des changements pour les dévelopeurs:
- tous les repositories de plugins on été fusionnés dans TravelNotes et il n'y a donc plus qu'un seul repository. Grâce à celà,
les tailles de certains plugins ont été considérablement réduites.
- @mapbox\polyline n'est plus utilisé pour la compression des données et a été remplacé par un dévelopement 
interne, ce qui permet également de réduire fortement la taille des fichiers de donnée.

### Quoi de neuf dans la version 2.2.0

- le fichier TravelNotesConfig.json a été entièrement revu. Si vous utilisez une version modifiée de ce fichier, il est important
de revoir celle-ci. Voyez le guide d'installation.
- un indicateur du statut de la dernière utilisation de la commande "Sauver dans un fichier" a été ajoutée (vert : voyage sauvé - jaune :
voyage modifié depuis la dernière sauvegarde - rouge : voyage modifié et non sauvé depuis au mins 5 minutes).
- la méthode utilisée pour rechercher la commune d'une adresse a été revue.
- la recherche de points d'intérêts dans OpenStreetMap a été améliorée et est beaucoup plus rapide.
- une commande "Sauvegarde partielle" a été ajoutée. Celle-ci permet de sauver un voyage SANS les notes de voyage et/ou SANS les notes de
trajet et/ou SANS les manoeuvres. Cette commande permet d'avoir un fichier beaucoup plus léger pour des présentations de carte sur Internet
- les css ont été réorganisés et revus. De nombreux petits bugs de présentation liés à CSS ont été corrigés.
- il est possible de faire des zooms et des pans sur la carte quand un dialogue est affiché.
- il est possible d'utiliser le clavier pour les commandes du viewer. Voir 
le [guide pour les utilisateurs - fr ](https://github.com/wwwouaiebe/TravelNotes/blob/gh-pages/TravelNotesGuides/fr/GuideUtilisateurFR.md#Viewer)
- et de nombreuses modifications purement techniques ainsi qie la correction de nombreux petits bugs.

### Quoi de neuf dans la version 2.3.0

Les bugs suivants sont corrigés:

- Issue #158: la distance entre une note de trajet et le début du trajet est 0 quand cette note est créée depuis un résultat de recherche dans OpenStreetMap.
- Issue #159: l'adresse doit être vérifiée quand une note est créée depuis un résultat de recherche dans OpenStreetMap.
- Issue #160: noopener noreferrer sont ajoutés automatiquement quand un lien est créé avec target='_blank'
- Issue #162: le zoom ne fonctionne pas quand un dialogue est affiché ( Firefox ).
- Issue #163: les icônes en svg intégrées dans les fichiers JS ne sont pas affichées correctement ( Chrome ).
- Issue #164: polylineProvider et PublicTransportProvider crash quand les providers sont sélectionnés 
- Issue #168: La couleur des références RCN-REF est modifiée dans les icônes.
- Issue #170: un crash survient lorsque un trajet édité est sauvé avant qu'un point de passage soit entièrement renommé.

### Quoi de neuf dans la version 3.0.0

Les bugs suivants sont corrigés:

- Issue #179: Réordonner la liste des routes avec un glisser/déposer ne fonctionne pas quand la route sélectionnée est la route en cours d'édition.
- Issue #173: Un message incorrect pour l'attribut "rel" est affiché dans la console quand un fichier est ouvert.

Et les améliorations suivantes ont été apportées:

- Issue #175: Les variables et méthodes private et static sont disponible dans Firefox. Une grande mise à jour du code a été effectuée.
- Issue #173: Le generateur de UUID ne suit pas la norme publiée dans la rfc 4122.

### Quoi de neuf dans la version 3.1.0

La version 3.1.0 ne contient pas de nouveautés pour les utilisateurs. Par contre, d'importantes modifications ont été apportées au code, 
suite à l'utilisation des variables et méthodes 'private' et 'static'.

### Quoi de neuf dans la version 3.2.0

Il est désormais possible d'ouvrir des fichiers .gpx comme fichier de voyage ou d'insérer des fichiers .gpx dans un voyage en cours d'édition.
Voir le [guide pour les utilisateurs - fr](https://wwwouaiebe.github.io/TravelNotes/userGuides/fr/GuideUtilisateurFR.html#GpxFiles)

Les issues suivantes sont corrigées:

- Issue #4 : Line type and line width for routes are not adapted on the print views
- Issue #8 : Review the translation files.
- Issue #9 : String.substr ( ) is deprecated... Replace...

### Quoi de neuf dans la version 3.3.0

- Il est possible de faire des trajets en boucle en sélectionnant un point sur la carte comme étant à la fois le point de départ et le point d'arrivée.
- Il est possible de voir les données de la route en cours d'édition en faisant un click sur celle-ci
- Il est possible de choisir dans la configuration si les panneaux de l'itinéraire, des notes de voyage et de la recherche OSM sont activés
ou non lors de chaque modification.

Les issues suivantes sont corrigées:

- Issue #14 : Cities are sometime not correct in address
- Issue #15 : Not possible to edit a route due to slow response of the Geocoder
- Issue #16 : Password is asked each time the page is refreshed

### Quoi de neuf dans la version 3.4.0

- Il n'est plus nécessaire d'avoir un unsafe-inline pour le style quand Content Security Policy est activé (ceci concerne uniquement les supergeek).
- Il est possible de visualiser les notes dans des tables plutôt qu'en lignes dans le livre de voyage.
- L'url pour obtenir les tuiles OpenStreetMap a été modifiées.
- Le processus d'impression des cartes d'un trajet a été revu et est maintenant correct dans Firefox
- Un bouton pour imprimer le livre de voyage a été ajouté dans le menu de celui-ci

### Quoi de neuf dans la version 3.5.0

- Issue #30 : les indications RCN REF sont difficiles à lire dans le livre de voyage
- Issue #31 : Leaflet v1.8.0 a été publié et est distribué avec Travel Notes
- Issue #32 : la Geo Location ne fonctionne pas correctement avec FF Android

### Quoi de neuf dans la version 3.6.0

- Issue #32 : la Geo Location ne fonctionne toujours pas correctement avec FF Android. Masquer le bouton de geo location a été supprimé

### Quoi de neuf dans la version 4.0.0

- l'interface utilisateur a été complètement revue. Toutes les commandes se font, soit via la barre d'outils à droite de l'écran,
soit via les menus contextuels. Voyez le [guide pour les utilisateurs - fr ](https://wwwouaiebe.github.io/TravelNotes/userGuides/fr/GuideUtilisateurFR.html).
- le programme est complètement compatible avec un mobile ou une tablette Android.
- bien qu'il s'agisse d'une version majeure, tous les fichiers de voyage créés avec une version précédente sont utilisables avec cette version.

### Quoi de neuf dans la version 4.1.0

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

### Quoi de neuf dans la version 4.2.0

- Issue #68 : Quand un bouton d'une barre d'outil ouvre un lien, il est nécessaire de cliquer sur le texte du bouton pour ouvrir le lien
- Issue #69 : les popup pour les trajets en cours d'édition sont manquants

### Quoi de neuf dans la version 4.3.0

- Issue #71 : Une case à cocher pour montrer ou cacher les profils a été ajoutée dans le livre de voyage
- Issue #72 : Des notes pour "départ de bus", "arrivée de bus", "départ de ferry", "arrivée de ferry","départ de train", "arrivée de train" ont été ajoutées
- Issue #73 : Il est possible de charger un fichier distant lorsque l'URL donnée est une URL relative

### Quoi de neuf dans la version 4.3.1

- Juste des mises à jour de sécurité des dépendances

## Quoi de neuf dans la dernière 4.3.2

- Issue #80 : PublicTransportProvider ne prend pas en charge les roles osm stop_enter_only et stop_exit_only
- Issue #81 : Une erreur se produit lors de l'ajout d'une note avec une adresse incomplète dans OSM
- Issue #82 : Il n'est pas possible d'ouvrir un fichier distant quand le port n'est pas standard ( 80 ou 443 )
- Mises à jour de sécurité des dépendances

## Quoi de neuf dans la dernière 4.3.3

- Issue #84 : Ajout d'une note de voyage au démarage quand les paramètres de l'url contiennent des paramètres lat et lon
- Mises à jour de sécurité des dépendances