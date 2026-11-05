# garde-timecodes

Vérifie les raccords d'une liste de timecodes à fréquence entière.

## Usage

Node.js 22+ ; aucune dépendance externe. Depuis ce dossier :

```powershell
node main.mjs example.json exemple-sortie.json
node --test test.mjs
```

Entrée : `fps` entier de 1 à 60 et `segments` dans l'ordre de lecture, avec `start` et `end` au format `HH:MM:SS:FF`. Fin exclusive. Contrôle depuis zéro : trou avant le premier segment inclus. Pas de drop-frame. Sortie : `ok`, `totalFrames` (somme des longueurs, pas durée de timeline si chevauchements), et anomalies gap/overlap. Une liste vide a zéro frame. Codes de sortie : 0 continu, 2 anomalies de continuité avec rapport écrit, 1 entrée invalide. Aucun média n'est inspecté.

La sortie est écrite seulement après validation complète et remplace le fichier de sortie choisi. Utiliser un chemin distinct de l'entrée. JSON UTF-8 sans BOM. Le dossier de destination doit exister. Erreur de lecture/JSON/validation/écriture : message sur stderr, code 1. Aucun accès réseau.

## Exemple

Voir `example.json` et `exemple-sortie.json`. Les exemples n'utilisent que des métadonnées ou des textes fictifs.

Licence MIT. Version 0.1.0.

