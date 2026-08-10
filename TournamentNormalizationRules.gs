/**
 * ============================================================
 * BAC
 * ============================================================
 *
 * Snapshot :
 *   BAC
 *   BAC 2
 *
 * Normalisation :
 *   BAC -> BAC N°1
 *   BAC 2 -> BAC N°2
 *
 * TournamentId :
 *   BAC-09-01
 *   BAC-02-02
 *
 * Categories :
 *   Benjamin;Minime;Cadet
 *
 * Disciplines :
 *   Simple
 */


/**
 * ============================================================
 * BNP
 * ============================================================
 *
 * Snapshot :
 *   Brassage National Poussin 1
 *   Brassage National Poussin 2
 *   Brassage National Poussin 3
 *
 * Normalisation :
 *   BNP N°1
 *   BNP N°2
 *   BNP N°3
 *
 * TournamentId :
 *   BNP-12-01
 *   BNP-03-02
 *   BNP-05-03
 *
 * Categories :
 *   Poussin
 *
 * Disciplines :
 *   Simple
 */


/**
 * ============================================================
 * CEJ
 * ============================================================
 *
 * Snapshot :
 *   CEJ 1
 *   CEJ 2
 *   ...
 *   CEJ 6
 *
 * Normalisation :
 *   CEJ N°1
 *   ...
 *   CEJ N°6
 *
 * TournamentId :
 *   CEJ-10-01
 *   ...
 *
 * Disciplines :
 *   Simple;Double;Mixte
 */


/**
 * ============================================================
 * TIJ
 * ============================================================
 *
 * Snapshot :
 *   TIJ 1 Normandie
 *   TIJ 2 Pays de la Loire
 *   TIJ 3 Bretagne
 *
 * Normalisation :
 *   TIJ N°1
 *   TIJ N°2
 *   TIJ N°3
 *
 * Region :
 *   déduite du libellé
 *
 * Categories :
 *   Poussin;Benjamin;Minime;Cadet
 *
 * Disciplines :
 *   Jour 1 : Simple
 *   Jour 2 : Double;Mixte
 */


/**
 * ============================================================
 * TRJ
 * ============================================================
 *
 * Snapshot :
 *   TRJ S1
 *   TRJ D1
 *   TRJ S2
 *   TRJ D2
 *   ...
 *
 * Normalisation :
 *   TRJ S1 -> TRJ N°1 Simple
 *   TRJ D1 -> TRJ N°1 Double
 *   TRJ S2 -> TRJ N°2 Simple
 *   TRJ D2 -> TRJ N°2 Double
 *
 * Department :
 *   déduit du libellé lorsque présent
 *
 * Categories :
 *   si absentes :
 *     Poussin;Benjamin;Minime
 *
 * Disciplines :
 *   Sx -> Simple
 *   Dx -> Double;Mixte
 */


/**
 * ============================================================
 * CHAMPIONNATS
 * ============================================================
 *
 * Championnat de Bretagne Jeunes
 *   Type  : Championnat
 *   Scope : Régionale
 *
 * Championnats Départementaux Jeunes
 *   Type  : Championnat
 *   Scope : Départementale
 *
 * Qualification France Jeunes
 *   Type  : Championnat
 *   Scope : Nationale
 *
 * Championnats de France Jeunes
 *   Type  : Championnat
 *   Scope : Nationale
 */


/**
 * ============================================================
 * INTERCLUBS
 * ============================================================
 *
 * Finale Régionale Interclubs Jeunes
 *   Type  : Interclub
 *   Scope : Régionale
 */