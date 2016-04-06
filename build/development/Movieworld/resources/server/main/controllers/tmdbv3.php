<?php

class TmdbV3 extends CI_Controller {

        const MOVIE = '49529'; // John Carter (Disney)
        const ACTOR = '190';   // Clint Eastwood

	function __construct()
	{
		parent::__construct();
                $this->load->library('tmdb');
	}

        function configuration() {
            $result = $this->tmdb->getConfig();
            dump($result);
        }

        function MovieSearch($query="Bridges of Madison County") {
            $result = $this->tmdb->MovieSearch($query);
            dump(json_decode($result));
        }

        function MovieInfo($movie=TMDBV3::MOVIE) {
            $result = $this->tmdb->MovieInfo($movie);
            dump(json_decode($result));
        }

        function LatestMovie() {
            $result = $this->tmdb->LatestMovie();
            dump(json_decode($result));
        }

        function MovieTranslations($movie = TMDBV3::MOVIE) {
            $result = $this->tmdb->MovieTranslations($movie, true); // edited
            dump(json_decode($result));
            $result = $this->tmdb->MovieTranslations($movie);       // raw
            dump(json_decode($result));
        }

        function MovieAlternativeTitles($movie = TMDBV3::MOVIE) {
            $result = $this->tmdb->MovieAlternativeTitles($movie);
            dump(json_decode($result));
        }

        function MovieTrailers($movie = TMDBV3::MOVIE) {
            $result = $this->tmdb->MovieTrailers($movie, true);
            dump(json_decode($result));
        }

        function MovieImages($movie = TMDBV3::MOVIE) {
            $result = $this->tmdb->MovieImages($movie, false, true);
            dump(json_decode($result));
        }

        function MoviePosters($movie = TMDBV3::MOVIE) {
            $result = $this->tmdb->MoviePosters($movie, true);
            dump(json_decode($result));
        }

        // The second parameter on the $result gives back the full paths to the images
        function MovieBackdrops($movie = TMDBV3::MOVIE) {
            $result = $this->tmdb->MovieBackdrops($movie, true);
            dump(json_decode($result));
        }

        function MovieCasts($movie = TMDBV3::MOVIE) {
            $result = $this->tmdb->MovieCasts($movie);
            dump(json_decode($result));
        }

        function MovieCastActors($movie = TMDBV3::MOVIE) {
            $result = $this->tmdb->MovieCastActors($movie);
            dump(json_decode($result));
        }

        function MovieCastCrew($movie = TMDBV3::MOVIE) {
            $result = $this->tmdb->MovieCastCrew($movie);
            dump(json_decode($result));
        }

        function MovieKeywords($movie = TMDBV3::MOVIE) {
            $result = $this->tmdb->MovieKeywords($movie);
            dump(json_decode($result));
        }

        function MovieReleaseInfo($movie = TMDBV3::MOVIE) {
            $result = $this->tmdb->MovieReleaseInfo($movie);
            dump(json_decode($result));
        }

        function PersonSearch($query = "Eastwood") {
            $result = $this->tmdb->PersonSearch($query);
            dump(json_decode($result));
        }

        function PersonInfo($id = TMDBV3::ACTOR) {
            $result = $this->tmdb->PersonInfo($id);
            dump(json_decode($result));
        }

        function PersonCredits($id = TMDBV3::ACTOR) {
            $result = $this->tmdb->PersonCredits($id);
            dump(json_decode($result));
        }

        function PersonCreditsRole($id = TMDBV3::ACTOR, $role='producer') {
            $result = $this->tmdb->PersonCreditsRole($id, $role);
            dump(json_decode($result));
        }

        function PersonImages($id = TMDBV3::ACTOR) {
            $result = $this->tmdb->PersonImages($id, true);
            dump(json_decode($result));
        }

        function Boxoffice() {
            $result = $this->tmdb->MovieNowPlaying();
            dump(json_decode($result));
        }

        function Popular() {
            $result = $this->tmdb->MoviePopular();
            dump(json_decode($result));
        }

}
?>