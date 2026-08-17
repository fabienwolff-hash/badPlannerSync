# BPS - Backlog Refactoring Technique

## Objectif

Réduire :

- la taille des fichiers ;
- la duplication ;
- le couplage entre les composants ;
- la complexité perçue du code.

⚠️ Aucun de ces refactorings n'est bloquant pour la V1.

L'ordre ci-dessous est classé du plus rentable au moins rentable.

---

# Priorité 1 - Harmoniser Committee35Parser

## Problème

`LeagueCalendarParser` joue essentiellement un rôle de :

```text
Lecture calendrier
↓
Identification du type
↓
Dispatch vers le parser métier
```

Exemple :

```javascript
parseBAC(...)
parseBNP(...)
parseCEJ(...)
parseTRJ(...)
parseTIJ(...)
```

Mais `Committee35Parser` contient encore beaucoup de logique métier directement dans les `switch`.

Exemple :

```javascript
createCompetition({
  ...
})
```

à de nombreux endroits.

## Cible

Même modèle que LeagueCalendarParser :

```javascript
case COMPETITION_TYPES.BAC:
  competitions.push(
    parseBAC(...)
  );
  break;
```

```javascript
case COMPETITION_TYPES.CEJ:
  competitions.push(
    parseCEJ(...)
  );
  break;
```

## Gain

- Cohérence d'architecture.
- Réutilisation des parsers Ligue / Comité.
- Réduction de la duplication.

---

# Priorité 2 - Paramétrer les parsers par source

## Problème

Dans :

```javascript
parseBAC()
parseBNP()
parseCEJ()
```

la source est codée en dur :

```javascript
source: SOURCES.LIGUE_BRETAGNE
```

## Cible

```javascript
parseBAC(
  source,
  ...
)
```

Puis :

```javascript
createCompetition({
  source,
  ...
})
```

## Gain

Même parser utilisé pour :

```text
Ligue
Comité
```

---

# Priorité 3 - Centraliser les règles métier

Créer :

```text
CompetitionRules.gs
```

Ou :

```text
CompetitionMetadataService.gs
```

Contenant :

```javascript
buildTitle()
buildCategories()
buildDisciplines()
```

## Pourquoi

Aujourd'hui ces règles sont dispersées.

Elles représentent pourtant la connaissance métier du badminton.

## Gain

Un seul endroit où maintenir :

```text
TDJ
CDJ
TRJ
TIJ
CEJ
BAC
BNP
Championnats
Promobad
```

---

# Priorité 4 - Centraliser la logique géographique

## Maintenant

```javascript
CITY_REFERENCES
```

est déjà en place.

## Évolution

Créer :

```text
LocationService.gs
```

avec :

```javascript
enrichLocation()
normalizeCity()
```

et éventuellement :

```javascript
getDepartmentFromCity()
getRegionFromCity()
```

## Gain

Toutes les règles géographiques au même endroit.

---

# Priorité 5 - Nettoyer les utilitaires de dates

Créer un DateUtils complet.

## Fonctions

```javascript
toDate()
formatDate()
sameDate()
getMonthFromDate()
addDays()
buildDate()
getCompetitionDates()
```

## Gain

Plus aucune logique date dans :

```text
TournamentMatcher
TournamentIdService
Parsers
```

---

# Priorité 6 - Extraire normalizeCity()

Aujourd'hui :

```javascript
city
  .toUpperCase()
  .normalize(...)
  .replace(...)
```

est embarqué dans :

```javascript
buildCityBasedTournamentId()
```

## Cible

```javascript
normalizeCity(city)
```

## Gain

Réutilisable partout.

---

# Priorité 7 - Réduire les regex TDJ/CDJ

## Problème

```javascript
parseTDJLabel()
```

contient plusieurs regex successives.

## Cible

Tableau de patterns :

```javascript
const TDJ_PATTERNS = [
  ...
];
```

puis boucle.

## Gain

Ajout de nouveaux formats plus simple.

---

# Priorité 8 - Factoriser les compétitions nationales

## Problème

```javascript
parseBAC()
parseBNP()
parseCEJ()
```

ont une structure quasiment identique.

## Cible

Builder commun :

```javascript
buildNationalCompetition(...)
```

## Gain

Réduction du code dupliqué.

---

# Priorité 9 - Mutualiser la lecture du calendrier

## Problème

On retrouve partout :

```javascript
const data = calendar.values;
const mergedIndex = ...
let currentMonth = null;
```

## Cible

Un helper :

```javascript
forEachCalendarRow(
  calendar,
  callback
)
```

## Gain

Allège fortement :

```text
Committee35Parser
LeagueCalendarParser
```

---

# Priorité 10 - Documenter les formats spéciaux

Exemples :

```javascript
parseTRJ()
parseTIJ()
parseTDJLabel()
```

Ajouter des commentaires du type :

```text
TRJ S1
(Poussin-Minime)
Guer
```

```text
TDJ 35 - Bruz - S - Ben à Cad
```

## Gain

Lisibilité future.

---

# À NE PAS faire maintenant

## Fusionner les parsers

Conserver :

```text
NationalCompetitionParsers.gs
RegionalCompetitionParsers.gs
DepartmentalCompetitionParsers.gs
```

Le découpage est bon.

---

## Automatiser CREATE / UPDATE

Le contrôle manuel :

```text
CREATE
UPDATE
UNCHANGED
```

est une bonne décision métier.

---

## Remplacer les snapshots

Conserver :

```text
SNAPSHOT_LIGUE
SNAPSHOT_COMITE_35
```

Ils seront précieux pour diagnostiquer :
- fautes de frappe ;
- changements de format ;
- anomalies de source.

---

# Priorité réelle recommandée

1. Committee35Parser → dispatch vers les parsers métier
2. Paramètre `source` dans les parsers nationaux
3. CompetitionRules.gs
4. DateUtils
5. LocationService
6. Le reste
