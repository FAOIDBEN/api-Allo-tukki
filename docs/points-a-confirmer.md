# Points à confirmer avec la cliente

Choix faits pendant la construction de la démo quand la maquette était ambiguë ou incohérente.

## Général
- **Cartes** : tuiles OpenStreetMap standard adoucies par un filtre (les tuiles « Carto » proches du rendu des maquettes exigent désormais une clé API).
- **Centrale – menu** : aucun état « actif » n'est dessiné ; un fond blanc discret a été ajouté sur l'entrée courante.

## Application Client
- **Numérotation des étapes d'inscription** incohérente : C4 « Étape 2 sur 3 », C5 « Étape 3 sur 4 », C6 « 4/4 ». Reproduite telle quelle.
- **C2** : seule l'étape 1 est dessinée. Les étapes 2 (« Proche ») et 3 (« Espèces ») ont été rédigées à partir des textes du PDF, avec des photos issues des maquettes.
- **C8** s'intitule « Recherche du point de départ » mais l'écran dessiné choisit la destination (« Où allez-vous ? »). La démo l'utilise pour la destination ; le point de départ se modifie depuis C7 (« Modifier »).
- **Prix** : C8 affiche des prix par lieu (400 à 600 F CFA) alors que C10/C11/C13/C15 affichent un tarif fixe de 700 FCFA. La démo réserve toujours à 700 FCFA la place.
- **Trajets urbains vs interrégionaux** : les maquettes montrent des trajets dans Tivaouane (Marché Central → Hôpital) avec le libellé « Trajet interrégional ».
- **Titres techniques** : certains en-têtes de maquette contiennent le code (« C11 Recherche D'un Chauffeur », « C15 Arrivée Et Paiement », « Trajet C15 »). Les codes ont été retirés des titres (ils restent visibles dans le panneau démo).
- **Chauffeur Moussa Diop** : téléphone +221 77 645 28 19 (C13) vs +221 77 481 23 45 (D5) ; note 4.8 (C13) vs 4.9 (C15, D7). La démo utilise +221 77 645 28 19.
- **C15** : la saisie du billet remis (1 000 / 2 000 / 5 000 / 10 000 F) a été ajoutée pour calculer la monnaie à rendre.
- **C13** : il n'existe pas d'écran client « voyage en cours » (C14 absent) ; C13 continue d'afficher le suivi pendant le trajet, puis bascule sur C15 à l'arrivée.
