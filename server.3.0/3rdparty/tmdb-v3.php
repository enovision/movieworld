<?php

/**
 * TMDB API v3 PHP class - wrapper to API version 3 of 'themoviedb.org
 * API Documentation: http://help.themoviedb.org/kb/api/about-3
 * Documentation and usage in README file
 *
 * @package TMDB_V3 API WRAPPER FOR PHP
 * @adapted by J. van de Merwe <jvandemerwe@arumbai.com>
 * @date 2014-04-07
 * @link http://www.github.com/enovision
 * @version 0.9 (update with TV functionality)
 * @license BSD http://www.opensource.org/licenses/bsd-license.php
 *
 * @package TMDB_V3 API WRAPPER FOR PHP
 * @adapted by J. van de Merwe <jvandemerwe@arumbai.com>
 * @date 2012-02-12
 * @link http://www.github.com/enovision
 * @version 0.5
 * @license BSD http://www.opensource.org/licenses/bsd-license.php
 *
 * Portions of this file are based on parts of: TMDB_V3_API_PHP
 * @author adangq <adangq@gmail.com>
 * @copyright 2012 adangq
 * @date 2012-02-12
 * @link http://www.github.com/adangq
 * @version 0.0.1
 * @license BSD http://www.opensource.org/licenses/bsd-license.php
 * and on: TMDb PHP API class - API 'themoviedb.org'
 * @author Jonas De Smet
 * @Copyright Jonas De Smet - Glamorous | https://github.com/glamorous/TMDb-PHP-API
 * Licensed under BSD (http://www.opensource.org/licenses/bsd-license.php)
 * @date 10.12.2010
 * @version 0.9.10
 * @author Jonas De Smet - Glamorous
 * @link {https://github.com/glamorous/TMDb-PHP-API}
 *
 */
class TMDB
{

    const TMDB = 'Themoviedb.org (TMDb)';
    const IMDB = 'The Internet Movie Database (IMDb)';
    const POST = 'post';
    const GET = 'get';
    const API_URL = 'http://api.themoviedb.org/3/';
    const VERSION = '0.5';
    const LANGUAGE = 'en';
    const FULLPATH = true;
    const JSON = 'json';
    const XML = 'xml';
    const YAML = 'yaml';

    private $_apikey;
    private $_lang;
    private $_imgUrl;
    private $_fullPath;
    public $result = array();

    //--------------------------------------------------------------------------
    // C O N S T R U C T O R
    //--------------------------------------------------------------------------

    function __construct($apikey = false, $defaultFormat = TMDb::JSON, $defaultLang = 'en', $fullPath = true)
    {

        $this->setApikey($apikey);
        $this->setFormat($defaultFormat);
        $this->setLang($defaultLang);
        $this->setFullPath($fullPath);

        //Get Configuration
        $this->configuration = $this->getConfig();
        if (empty($this->configuration)) {
            echo "Not a valid configuration found, check your API key";
            exit;
        }

        $this->setImageURL($this->configuration); //set Images URL contain in config
    }

    //--------------------------------------------------------------------------
    // M O V I E  - M E T H O D S
    //--------------------------------------------------------------------------

    /**
     * Search Movie
     * a good starting point to start finding movies on TMDb. The idea is to be a
     * quick and light method so you can iterate through movies quickly
     * http://api.themoviedb.org/3/search/movie?api_keyf&language&query=future
     *
     * @param string $query
     */
    public function MovieSearch($query, $lang = TMDB::LANGUAGE)
    {
        $query = "query=" . urlencode($query);
        $result = $this->_call("search/movie", $query, $lang);
        if (array_key_exists('results', $result) == true) {
            foreach ($result['results'] as $idx => $r) {
                $result['results'][$idx] = $this->getImages($r);
            }
        }

        return $this->ProcessResult($result);
    }

    /**
     * Method: MovieAlternativeTitles
     * This method is used to retrieve all of the alternative titles we have for
     * a particular movie
     * http://api.themoviedb.org/3/movie/11/alternative_titles?api_key
     *
     * @param idMovie
     */
    public function MovieAlternativeTitles($idMovie)
    {
        $result = $this->MovieInfo($idMovie, "alternative_titles", true);
        return $this->ProcessResult($result);
    }

    /**
     * Method: MovieCollection
     * This method is used to retrieve all of the basic information about a movie
     * collection. You can get the ID needed for this method by making a GET request
     * with the /movie/:id method and paying attention to the belongs_to_collection hash
     * http://http://api.themoviedb.org/3/collection/10?api_key
     *
     * @param idCollection
     */
    public function MovieCollection($idCollection, $lang = TMDB::LANGUAGE)
    {
        $result = $this->_call("collection", $idCollection, $lang);
        return $this->ProcessResult($result);
    }

    /**
     * Method: MovieInfo
     * This method is used to retrieve all of the basic movie information. It will
     * return the single highest rated poster and backdrop.
     * http://http://api.themoviedb.org/3/movie/11?api_key
     *
     * @param idMovie
     */
    public function MovieInfo($idMovie, $option = "", $return = false)
    {
        $option = (empty($option)) ? "" : "/" . $option;
        $params = "movie/" . $idMovie . $option;
        $movie = $this->_call($params, "");
        if ($option == "") {
            $movie = $this->getImages($movie);
        }

        if ($return == true)
            return $movie;

        return $this->ProcessResult($movie);
    }

    // alternate call for MovieInfo
    public function MovieDetail($idMovie)
    {
        $result = $this->MovieInfo($idMovie, "", true);
        return $this->ProcessResult($result);
    }

    /**
     * Method: MovieTranslations
     * This method is used to retrieve a list of the available translations for a
     * specific movie.
     * http://http://api.themoviedb.org/3/movie/11/translations?api_key
     *
     * @param idMovie
     */
    public function MovieTranslations($idMovie, $edit = false)
    {
        $result = $this->MovieInfo($idMovie, "translations", true);

        if ($edit == true) {
            $trans = array();
            foreach ($result['translations'] as $item) {
                $trans[] = $item['english_name'] . " (" . $item['iso_639_1'] . ")";
            }
            return $this->ProcessResult($trans);
        }
        return $this->ProcessResult($result);
    }

    /**
     * Method: MovieTrailers
     * This method is used to retrieve all of the trailers for a particular movie.
     * Supported sites are YouTube and QuickTime.
     * http://http://api.themoviedb.org/3/movie/11/trailers?api_key
     *
     * @param idMovie
     */
    public function MovieTrailers($idMovie)
    {
        $trailer = $this->MovieInfo($idMovie, "trailers", true);

        $trail = array();
        foreach ($trailer['quicktime'] as $t) {

            $name = $t['name'];

            foreach ($t['sources'] as $source) {
                $trail[] = array(
                    'name' => $name . ' (' . $source['size'] . ')',
                    'service' => 'quicktime',
                    'source' => $source['source'],
                    'size' => $source['size']
                );
            }
        }
        foreach ($trailer['youtube'] as $t) {
            if ($t['source'] != null && $t['size'] != null) {
                $trail[] = array(
                    'name' => $t['name'],
                    'service' => 'youtube',
                    'source' => $t['source'],
                    'size' => $t['size']
                );
            }
        }

        $trailer = array(
            'trailers' => $trail
        );

        // $trailer =$trailer['posters'];
        return $this->ProcessResult($trailer);
    }

    /**
     * Method: MovieImages
     * This method should be used when you’re wanting to retrieve all of the images
     * for a particular movie. In order to use the file paths returned in this
     * method and find the available sizes you need to understand how the configuration
     * system works.
     * http://http://api.themoviedb.org/3/movie/11/images?api_key
     *
     * @param idMovie
     */
    public function MovieImages($idMovie, $type = false)
    {
        $images = $this->movieInfo($idMovie, "images", true);

        if (array_key_exists('backdrops', $images) == true) {
            foreach ($images['backdrops'] as $idx => $image) {
                $images['backdrops'][$idx] = $this->getImages($image, 'backdrops');
            }
        }

        if (array_key_exists('posters', $images) == true) {
            foreach ($images['posters'] as $idx => $image) {
                $images['posters'][$idx] = $this->getImages($image);
            }
        }

        if ($type == false) {
            return $this->ProcessResult($images);
        } else {
            $result = array_key_exists($type, $images) == true ? $images[$type] : array();
            return $this->ProcessResult($result);
        }
    }

    /**
     * Method: MovieBackdrops
     * Convenient way to get the backdrops from the images
     * if no backdrops are found the method returns an empty array
     *
     * @param idMovie
     */
    public function MovieBackdrops($idMovie)
    {
        $backdrops = $this->movieImages($idMovie, "backdrops");
        return $this->ProcessResult($backdrops);
    }

    /**
     * Method: MoviePosters
     * Convenient way to get the posters from the images
     * if no backdrops are found the method returns an empty array
     *
     * @param idMovie , fullpath (true = full path to image)
     */
    public function MoviePosters($idMovie)
    {
        $posters = $this->movieImages($idMovie, "posters");
        return $this->ProcessResult($posters);
    }

    /**
     * Method: MovieCasts (plural!)
     * This method is used to retrieve all of the movie cast information. The results
     * are split into separate cast and crew arrays.
     * http://http://api.themoviedb.org/3/movie/11/casts?api_key
     *
     * @param idMovie
     */
    public function MovieCasts($idMovie, $type = false)
    {
        $casts = $this->movieInfo($idMovie, "casts", true);

        if (array_key_exists('cast', $casts) == true) {
            foreach ($casts['cast'] as $idx => $actor) {
                $casts['cast'][$idx] = $this->getImages($actor);
            }
        }

        if (array_key_exists('crew', $casts) == true) {
            foreach ($casts['crew'] as $idx => $crew) {
                $casts['crew'][$idx] = $this->getImages($crew);
            }
        }

        if ($type == false) {
            return $this->ProcessResult($casts);
        } else {
            $result = array_key_exists($type, $casts) == true ? $casts[$type] : array();
            return $this->ProcessResult($result);
        }
    }

    /**
     * Method: MovieCastActors
     * Convenient way to get the actors of a movies cast
     * if no actors found, it returns an empty array
     *
     * @param idMovie
     */
    public function MovieCastActors($idMovie)
    {
        $actors = $this->movieCasts($idMovie, "cast");
        return $this->ProcessResult($actors);
    }

    /**
     * Method: MovieCastCrew
     * Convenient way to get the crew of a movies cast
     * if no crew found, it returns an empty array
     *
     * @param idMovie
     */
    public function MovieCastCrew($idMovie)
    {
        $crew = $this->movieCasts($idMovie, "crew");
        return $this->ProcessResult($crew);
    }

    /**
     * Method: MovieKeywords
     * This method is used to retrieve all of the keywords that have been added
     * to a particular movie. Currently, only English keywords exist.
     * http://http://api.themoviedb.org/3/movie/11/keywords?api_key
     *
     * @param idMovie
     */
    public function MovieKeywords($idMovie)
    {
        $keywords = $this->movieInfo($idMovie, "keywords", true);
        return $this->ProcessResult($keywords);
    }

    /**
     * Method: MovieReleaseInfo
     * This method is used to retrieve all of the release and certification data
     * we have for a specific movie.
     * http://http://api.themoviedb.org/3/movie/11/releases?api_key
     *
     * @param idMovie
     */
    public function MovieReleaseInfo($idMovie)
    {
        $releases = $this->movieInfo($idMovie, "releases", true);
        return $this->ProcessResult($releases);
    }

    /**
     * Method: LatestMovie
     * This method is used to retrieve the newest movie that was added to TMDb
     * http://http://api.themoviedb.org/3/latest/movie?api_key
     *
     * @param idMovie
     */
    public function LatestMovie($lang = TMDB::LANGUAGE)
    {
        $latest = $this->_call("latest/movie", "", $lang);
        return $this->ProcessResult($latest);
    }

    /**
     * Method: MoviePopular
     * This method is used to retrieve the most popular movies on tmdb
     * we have for a specific movie.
     * http://http://api.themoviedb.org/3/movie/popular?api_key
     */
    public function MoviePopular($lang = TMDB::LANGUAGE)
    {
        $popular = $this->_call("movie/popular", "", $lang);
        return $this->ProcessResult($popular);
    }

    /**
     * Method: MovieNowPlaying
     * This method is used to retrieve the boxoffice movies on tmdb
     * we have for a specific movie.
     * http://http://api.themoviedb.org/3/movie/now_playing?api_key
     */
    public function MovieNowPlaying($lang = TMDB::LANGUAGE)
    {
        $popular = $this->_call("movie/now_playing", "", $lang);
        return $this->ProcessResult($popular);
    }

    //--------------------------------------------------------------------------
    // TV - M E T H O D S
    //--------------------------------------------------------------------------

    /**
     * Search TV
     * a good starting point to start finding TV (series) on TMDb. The idea is to be a
     * quick and light method so you can iterate through movies quickly
     * http://api.themoviedb.org/3/search/tv?api_keyf&language&query=future
     *
     * @param string $query
     */
    public function TVSearch($query, $lang = TMDB::LANGUAGE)
    {
        $query = "query=" . urlencode($query);
        $result = $this->_call("search/tv", $query, $lang);
        if (array_key_exists('results', $result) == true) {
            foreach ($result['results'] as $idx => $r) {
                $result['results'][$idx] = $this->getImages($r);
            }
        }

        return $this->ProcessResult($result);
    }

    /**
     * Method: TvCasts (plural!)
     * This method is used to retrieve all of the movie cast information. The results
     * are split into separate cast and crew arrays.
     * http://http://api.themoviedb.org/3/tv/11/credits?api_key
     *
     * @param idTV
     */
    public function TvCasts($idTV, $type = false)
    {
        $casts = $this->TvInfo($idTV, "credits", true);

        if (array_key_exists('cast', $casts) == true) {
            foreach ($casts['cast'] as $idx => $actor) {
                $casts['cast'][$idx] = $this->getImages($actor);
            }
        }

        if (array_key_exists('crew', $casts) == true) {
            foreach ($casts['crew'] as $idx => $crew) {
                $casts['crew'][$idx] = $this->getImages($crew);
            }
        }

        if ($type == false) {
            return $this->ProcessResult($casts);
        } else {
            $result = array_key_exists($type, $casts) == true ? $casts[$type] : array();
            return $this->ProcessResult($result);
        }
    }

    /**
     * Method: TvCastActors
     * Convenient way to get the actors of a tv films cast
     * if no actors found, it returns an empty array
     *
     * @param idMovie
     */
    public function TvCastActors($idTV)
    {
        $actors = $this->TvCasts($idTV, "cast");
        return $this->ProcessResult($actors);
    }

    /**
     * Method: TvCastCrew
     * Convenient way to get the crew of a tv films cast
     * if no crew found, it returns an empty array
     *
     * @param idMovie
     */
    public function TvCastCrew($idTV)
    {
        $crew = $this->TvCasts($idTV, "crew");
        return $this->ProcessResult($crew);
    }

    /**
     * Method: TvPopular
     * This method is used to retrieve the most popular tv programmes on tmdb
     * http://http://api.themoviedb.org/3/tv/popular?api_key
     */
    public function TvPopular($lang = TMDB::LANGUAGE)
    {
        $popular = $this->_call("tv/popular", "", $lang);
        return $this->ProcessResult($popular);
    }

    /**
     * Method: TvTopRated
     * This method is used to retrieve the highest rated tv programmes on tmdb
     * http://http://api.themoviedb.org/3/tv/top_rated?api_key
     */
    public function TvTopRated($lang = TMDB::LANGUAGE)
    {
        $toprated = $this->_call("tv/top_rated", "", $lang);
        return $this->ProcessResult($toprated);
    }

    /**
     * Method: TvOnAir
     * This method is used to retrieve tv programmes currently on air on tmdb
     * http://http://api.themoviedb.org/3/tv/on_the_air?api_key
     */
    public function TvOnAir($lang = TMDB::LANGUAGE)
    {
        $onair = $this->_call("tv/on_the_air", "", $lang);
        return $this->ProcessResult($onair);
    }

    /**
     * Method: AiringToday
     * This method is used to retrieve tv programmes currently on air on tmdb
     * http://http://api.themoviedb.org/3/tv/airing_today?api_key
     */
    public function TvAiringToday($lang = TMDB::LANGUAGE)
    {
        $airtoday = $this->_call("tv/airing_today", "", $lang);
        return $this->ProcessResult($airtoday);
    }

    /**
     * Method: TvImages
     * This method should be used when you’re wanting to retrieve all of the images
     * for a particular TV program. In order to use the file paths returned in this
     * method and find the available sizes you need to understand how the configuration
     * system works.
     * http://http://api.themoviedb.org/3/tv/11/images?api_key
     *
     * @param idTV
     */
    public function TvImages($idTV, $type = false)
    {
        $images = $this->TvInfo($idTV, "images", true);

        if (array_key_exists('backdrops', $images) == true) {
            foreach ($images['backdrops'] as $idx => $image) {
                $images['backdrops'][$idx] = $this->getImages($image, 'backdrops');
            }
        }

        if (array_key_exists('posters', $images) == true) {
            foreach ($images['posters'] as $idx => $image) {
                $images['posters'][$idx] = $this->getImages($image);
            }
        }

        if ($type == false) {
            return $this->ProcessResult($images);
        } else {
            $result = array_key_exists($type, $images) == true ? $images[$type] : array();
            return $this->ProcessResult($result);
        }
    }

    /**
     * Method: TvBackdrops
     * Convenient way to get the backdrops from the images
     * if no backdrops are found the method returns an empty array
     *
     * @param idTV
     */
    public function TvBackdrops($idTV)
    {
        $backdrops = $this->TvImages($idTV, "backdrops");
        return $this->ProcessResult($backdrops);
    }

    /**
     * Method: TvPosters
     * Convenient way to get the posters from the images
     * if no backdrops are found the method returns an empty array
     *
     * @param idTV
     */
    public function TvPosters($idTV)
    {
        $posters = $this->movieImages($idTV, "posters");
        return $this->ProcessResult($posters);
    }

    /**
     * Method: TvVideos
     * This method is used to retrieve all of the trailers for a particular movie.
     * Supported sites are YouTube and QuickTime.
     * http://http://api.themoviedb.org/3/movie/11/trailers?api_key
     *
     * @param idTV
     */
    public function TvVideos($idTV)
    {
        $trailer = $this->TvInfo($idTV, "videos", true);

        $trail = array();

        foreach ($trailer['results'] as $t) {
            if ($t['key'] !== null && $t['size'] !== null) {
                $trail[] = array(
                    'name' => $t['type'],
                    'service' => strtolower($t['site']),
                    'source' => $t['key'],
                    'size' => $t['size']
                );
            }
        }

        $trailer = array(
            'trailers' => $trail
        );

        // $trailer =$trailer['posters'];
        return $this->ProcessResult($trailer);
    }

    /**
     * Method: TvExternalIds
     * Get the external ids that we have stored for a TV series.
     * http://http://api.themoviedb.org/3/tv/{id}/external_ids
     *
     * @param idTV
     */
    public function TvExternalIds($idTV)
    {
        $result = $this->TvInfo($idTV, "external_ids", true);
        return $this->ProcessResult($result);
    }

    /**
     * Method: TvTranslations
     * Get the translations that we have stored for a TV series.
     * http://http://api.themoviedb.org/3/tv/{id}/external_ids
     *
     * @param idTV
     */
    public function TvTranslations($idTV)
    {
        $result = $this->TvInfo($idTV, "translations", true);
        return $this->ProcessResult($result);
    }

    /**
     * Method: TvInfo
     * This method is used to retrieve all of the basic TV movie/series information. It will
     * return the single highest rated poster and backdrop.
     * http://http://api.themoviedb.org/3/tv/11?api_key
     *
     * @param idTV
     */
    public function TvInfo($idTV, $option = "", $return = false)
    {
        $option = (empty($option)) ? "" : "/" . $option;
        $params = "tv/" . $idTV . $option;
        $tv = $this->_call($params, "");
        if ($option == "") {
            $tv = $this->getImages($tv);
            if (isset($tv->seasons)) {
                foreach ($tv->seasons as $idx => $season) {
                    $season = GetImages($season);
                    $tv->seasons->$$idx = $season;
                }
            }
        }

        if ($return == true)
            return $tv;

        return $this->ProcessResult($tv);
    }

    //--------------------------------------------------------------------------
    // TV Seasons - M E T H O D S 
    //--------------------------------------------------------------------------


    /**
     * Method: TvEpisodeCasts (plural!)
     * This method is used to retrieve all of the movie cast information. The results
     * are split into separate cast and crew arrays.
     * http://http://api.themoviedb.org/3/tv/{id}/season/{season_number}/credits
     *
     * @param idTV
     */
    public function SeasonCasts($idTV, $season = false, $type = false)
    {
        $casts = $this->SeasonInfo($idTV, $season, "credits", true);

        if (array_key_exists('cast', $casts) == true) {
            foreach ($casts['cast'] as $idx => $actor) {
                $casts['cast'][$idx] = $this->getImages($actor);
            }
        }

        if (array_key_exists('crew', $casts) == true) {
            foreach ($casts['crew'] as $idx => $crew) {
                $casts['crew'][$idx] = $this->getImages($crew);
            }
        }

        if ($type == false) {
            return $this->ProcessResult($casts);
        } else {
            $result = array_key_exists($type, $casts) == true ? $casts[$type] : array();
            return $this->ProcessResult($result);
        }
    }

    /**
     * Method: SeasonCastActors
     * Convenient way to get the actors of a tv episode cast
     * if no actors found, it returns an empty array
     *
     * @param idMovie
     */
    public function SeasonCastActors($idTV, $season)
    {
        $actors = $this->SeasonCasts($idTV, $season, "cast");
        return $this->ProcessResult($actors);
    }

    /**
     * Method: SeasonCastCrew
     * Convenient way to get the crew of a tv films cast
     * if no crew found, it returns an empty array
     *
     * @param idMovie
     */
    public function SeasonCastCrew($idTV, $season)
    {
        $crew = $this->SeasonsCasts($idTV, $season, "crew");
        return $this->ProcessResult($crew);
    }

    /**
     * Method: SeasonImages
     * This method should be used when you’re wanting to retrieve all of the images
     * for a particular TV program. In order to use the file paths returned in this
     * method and find the available sizes you need to understand how the configuration
     * system works.
     * http://http://api.themoviedb.org/3/tv/{id}/season/{season_number}/images
     *
     * @param idTV
     */
    public function SeasonImages($idTV, $season = false, $type = false)
    {
        $images = $this->SeasonInfo($idTV, $season, "images", true);

        if (array_key_exists('backdrops', $images) == true) {
            foreach ($images['backdrops'] as $idx => $image) {
                $images['backdrops'][$idx] = $this->getImages($image, 'backdrops');
            }
        }

        if (array_key_exists('posters', $images) == true) {
            foreach ($images['posters'] as $idx => $image) {
                $images['posters'][$idx] = $this->getImages($image);
            }
        }

        if ($type == false) {
            return $this->ProcessResult($images);
        } else {
            $result = array_key_exists($type, $images) == true ? $images[$type] : array();
            return $this->ProcessResult($result);
        }
    }

    /**
     * Method: SeasonBackdrops
     * Convenient way to get the backdrops from the images
     * if no backdrops are found the method returns an empty array
     *
     * @param idTV
     */
    public function SeasonBackdrops($idTV, $season)
    {
        $backdrops = $this->SeasonImages($idTV, $season, "backdrops");
        return $this->ProcessResult($backdrops);
    }

    /**
     * Method: SeasonPosters
     * Convenient way to get the posters from the images
     * if no backdrops are found the method returns an empty array
     *
     * @param idTV
     */
    public function SeasonPosters($idTV, $season)
    {
        $posters = $this->SeasonImages($idTV, $season, "posters");
        return $this->ProcessResult($posters);
    }

    /**
     * Method: SeasonVideos
     * This method is used to retrieve all of the trailers for a particular movie.
     * Supported sites are YouTube and QuickTime.
     * http://http://api.themoviedb.org/3/tv/{id}/season/{season_number}/videos
     *
     * @param idTV , $season
     */
    public function SeasonVideos($idTV, $season)
    {
        $trailer = $this->TvInfo($idTV, $season, "videos", true);

        $trail = array();

        foreach ($trailer['results'] as $t) {
            if ($t['key'] !== null && $t['size'] !== null) {
                $trail[] = array(
                    'name' => $t['type'],
                    'service' => strtolower($t['site']),
                    'source' => $t['key'],
                    'size' => $t['size']
                );
            }
        }

        $trailer = array(
            'trailers' => $trail
        );

        return $this->ProcessResult($trailer);
    }

    /**
     * Method: SeasonInfo
     * This method is used to retrieve all of the basic TV movie/series information. It will
     * return the single highest rated poster and backdrop.
     * http://http://api.themoviedb.org/3/tv/{id}/season/{season_number}
     *
     * @param idTV
     */
    public function SeasonInfo($idTV, $season, $option = "", $return = false)
    {
        $option = (empty($option)) ? "" : "/" . $option;
        $params = "tv/" . $idTV . "/season/" . $season . $option;
        $season = $this->_call($params, "");
        if ($option == "") {
            $season = $this->getImages($season);
        }

        if ($return == true)
            return $season;

        return $this->ProcessResult($season);
    }

    //--------------------------------------------------------------------------
    // TV Episodes - M E T H O D S 
    //--------------------------------------------------------------------------

    /**
     * Method: TvEpisodeCasts (plural!)
     * This method is used to retrieve all of the movie cast information. The results
     * are split into separate cast and crew arrays.
     * http://http://api.themoviedb.org/3/tv/{id}/season/{season_number}/episode/{episode_number}/credits
     *
     * @param idTV
     */
    public function TvEpisodeCasts($idTV, $season, $episode, $type = false)
    {
        $casts = $this->SeasonInfo($idTV, $season, $episode, "credits", true);

        if (array_key_exists('cast', $casts) == true) {
            foreach ($casts['cast'] as $idx => $actor) {
                $casts['cast'][$idx] = $this->getImages($actor);
            }
        }

        if (array_key_exists('crew', $casts) == true) {
            foreach ($casts['crew'] as $idx => $crew) {
                $casts['crew'][$idx] = $this->getImages($crew);
            }
        }

        if ($type == false) {
            return $this->ProcessResult($casts);
        } else {
            $result = array_key_exists($type, $casts) == true ? $casts[$type] : array();
            return $this->ProcessResult($result);
        }
    }

    /**
     * Method: TvEpisodeCastActors
     * Convenient way to get the actors of a tv episode cast
     * if no actors found, it returns an empty array
     *
     * @param idMovie
     */
    public function TvEpisodeCastActors($idTV, $season, $episode)
    {
        $actors = $this->TvEpisodeCasts($idTV, $season, $episode, "cast");
        return $this->ProcessResult($actors);
    }

    /**
     * Method: TvEpisodeCastCrew
     * Convenient way to get the crew of a tv films cast
     * if no crew found, it returns an empty array
     *
     * @param idMovie
     */
    public function TvEpisodeCastCrew($idTV, $season, $episode)
    {
        $crew = $this->TvEpisodeCasts($idTV, $season, "crew");
        return $this->ProcessResult($crew);
    }

    /**
     * Method: TvEpisodeImages
     * This method should be used when you’re wanting to retrieve all of the images
     * for a particular TV program. In order to use the file paths returned in this
     * method and find the available sizes you need to understand how the configuration
     * system works.
     * http://http://api.themoviedb.org/3/tv/{id}/season/{season_number}/images
     *
     * @param idTV
     */
    public function TvEpisodeImages($idTV, $season, $episode, $type = false)
    {
        $images = $this->TvEpisodeInfo($idTV, $season, $episode, "images", true);

        if (array_key_exists('backdrops', $images) == true) {
            foreach ($images['backdrops'] as $idx => $image) {
                $images['backdrops'][$idx] = $this->getImages($image, 'backdrops');
            }
        }

        if (array_key_exists('posters', $images) == true) {
            foreach ($images['posters'] as $idx => $image) {
                $images['posters'][$idx] = $this->getImages($image);
            }
        }

        if ($type == false) {
            return $this->ProcessResult($images);
        } else {
            $result = array_key_exists($type, $images) == true ? $images[$type] : array();
            return $this->ProcessResult($result);
        }
    }

    /**
     * Method: SeasonBackdrops
     * Convenient way to get the backdrops from the images
     * if no backdrops are found the method returns an empty array
     *
     * @param idTV
     */
    public function TvEpisodeBackdrops($idTV)
    {
        $backdrops = $this->TvEpisodeImages($idTV, $season, "backdrops");
        return $this->ProcessResult($backdrops);
    }

    /**
     * Method: TvEpisodePosters
     * Convenient way to get the posters from the images
     * if no backdrops are found the method returns an empty array
     *
     * @param idTV
     */
    public function TvEpisodePosters($idTV)
    {
        $posters = $this->TvEpisodeImages($idTV, $season, "posters");
        return $this->ProcessResult($posters);
    }

    /**
     * Method: TvEpisodeVideos
     * This method is used to retrieve all of the trailers for a particular TV episode.
     * Supported sites are YouTube and QuickTime.
     * http://http://api.themoviedb.org/3/tv/{id}/season/{season_number}/videos
     *
     * @param idTV , $season
     */
    public function TvEpisodeVideos($idTV, $season, $episode)
    {
        $trailer = $this->TvEpisodeInfo($idTV, $season, $episode, "videos", true);

        $trail = array();

        foreach ($trailer['results'] as $t) {
            if ($t['key'] !== null && $t['size'] !== null) {
                $trail[] = array(
                    'name' => $t['type'],
                    'service' => strtolower($t['site']),
                    'source' => $t['key'],
                    'size' => $t['size']
                );
            }
        }

        $trailer = array(
            'trailers' => $trail
        );

        return $this->ProcessResult($trailer);
    }

    /**
     * Method: TvEpisodeInfo
     * This method is used to retrieve all of the basic TV movie/series information. It will
     * return the single highest rated poster and backdrop.
     * http://http://api.themoviedb.org/3/tv/{id}/season/{season_number}
     *
     * @param idTV
     */
    public function TvEpisodeInfo($idTV, $season, $episode, $option = "", $return = false)
    {
        $option = (empty($option)) ? "" : "/" . $option;
        $params = "tv/" . $idTV . "/season/" . $season . "/episode/" . $episode . $option;
        $episode = $this->_call($params, "");
        if ($option == "") {
            $episode = $this->getImages($episode);
        }

        if ($return == true)
            return $episode;

        return $this->ProcessResult($episode);
    }


    //--------------------------------------------------------------------------
    // P E R S O N S   -   M E T H O D S
    //--------------------------------------------------------------------------

    /**
     * Method: SearchPerson
     * a good starting point to start finding movies on TMDb. The idea is to be a
     * quick and light method so you can iterate through movies quickly.
     * http://http://api.themoviedb.org/3/search/person?api_key&query
     *
     * @param query , language
     */
    public function PersonSearch($query, $lang = TMDB::LANGUAGE)
    {
        $query = "query=" . urlencode($query);
        $result = $this->_call("search/person", $query, $lang);
        if (array_key_exists('results', $result) == true) {
            foreach ($result['results'] as $idx => $r) {
                $result['results'][$idx] = $this->getImages($r);
            }
        }
        return $this->ProcessResult($result);
    }

    /**
     * Method: PersonInfo
     * This method is used to retrieve all of the basic person information. It will
     * return the single highest rated profile image.
     * http://http://api.themoviedb.org/3/person/287?api_key
     *
     * @param idPerson
     */
    public function PersonInfo($idPerson, $option = "", $return = false)
    {
        $option = (empty($option)) ? "" : "/" . $option;
        $params = "person/" . $idPerson . $option;
        $info = $this->_call($params, "");
        if (array_key_exists('profile_path', $info) == true) {
            $info = $this->getImages($info);
        }

        return $return == false ? $this->ProcessResult($info) : $info;
    }

    /**
     * Method: PersonCredits
     * This method is used to retrieve all of the cast & crew information for the person.
     * It will return the single highest rated poster for each movie record.
     * http://http://api.themoviedb.org/3/person/287/credits?api_key
     *
     * @param idPerson
     */
    public function PersonCredits($idPerson, $return = false)
    {
        $credits = $this->PersonInfo($idPerson, "combined_credits", true);
        if (array_key_exists('cast', $credits) == true) {
            foreach ($credits['cast'] as $idx => $r) {
                $credits['cast'][$idx] = $this->getImages($r);
            }
        }
        if (array_key_exists('crew', $credits) == true) {
            foreach ($credits['crew'] as $idx => $r) {
                $credits['crew'][$idx] = $this->getImages($r);
            }
        }

        return $return == false ? $this->ProcessResult($credits) : $credits;
    }

    /**
     * Method: PersonCreditsRole
     * This method is used to retrieve all of the cast & crew information for the person.
     * It will return the single highest rated poster for each movie record.
     * http://http://api.themoviedb.org/3/person/287/credits?api_key
     *
     * @param idPerson
     */
    public function PersonCreditsRole($idPerson, $role = 'cast')
    {
        $role = strtolower($role);
        if ($role == 'actor' || $role == 'actrice') {
            $role = 'cast';
        }

        $jobs = array('cast', 'director', 'producer', 'music', 'composer');

        $credits = $this->PersonCredits($idPerson, true);

        if (strtolower($role) == 'cast') {
            return array_key_exists('cast', $credits) == true ? $this->ProcessResult($credits['cast']) : $this->ProcessResult(array());
        } else {
            if (array_key_exists('crew', $credits) == true) {
                $crew = array();
                foreach ($credits['crew'] as $c) {
                    if (strpos(strtolower($c['job']), $role) !== false) {
                        $crew[] = $c;
                    }
                }
                return $this->ProcessResult($crew);
            } else {
                return $this->ProcessResult(array());
            }
        }

        return $this->ProcessResult($credits);
    }

    /**
     * Method: PersonImages
     * This method is used to retrieve all of the profile images for a person.
     * http://http://api.themoviedb.org/3/movie/11/images?api_key
     *
     * @param idPerson
     */
    public function PersonImages($idPerson)
    {
        $images = $this->PersonInfo($idPerson, "images", true); // return array !!!

        if (array_key_exists('profiles', $images) == true) {
            foreach ($images['profiles'] as $idx => $image) {
                if (array_key_exists('file_path', $image) == true) {
                    $images['profiles'][$idx] = $this->getImages($image);
                    // $images['profiles'][$idx]['file_path'] = $this->getImageURL() . $image['file_path'];
                }
            }
        }
        return json_encode($images);
    }

//--------------------------------------------------------------------------
// G E N E R A L   M E T H O D S
//--------------------------------------------------------------------------

    /**
     * Get Confuguration of API
     * configuration        http://api.themoviedb.org/3/configuration?apikey
     *
     * @param
     *
     * @return array
     */
    public function getConfig()
    {

        return $this->_call("configuration", "");
    }

    /**
     * Makes the call to the API
     *
     * @param string $action API specific function name for in the URL
     * @param string $query Unencoded paramter for in the URL
     *
     * @return string
     */
    private function _call($action, $query, $lang = "", $format = "")
    {

        $lang = (empty($lang)) ? $this->getLang() : $lang;
        $format = (empty($format)) ? $this->getFormat() : $format;

        $query = strlen($query) == 0 ? "" : "&$query";

        $lang_url = $lang != false ? "&language=" . $lang : '';

        $url = TMDB::API_URL . $action .
            "?api_key=" . $this->getApikey() .
            "&format=" . $format .
            $lang_url .
            $query;

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_FAILONERROR, 1);

        $results = curl_exec($ch);
        $headers = curl_getinfo($ch);

        $error_number = curl_errno($ch);
        $error_message = curl_error($ch);

        curl_close($ch);

        $results = json_decode(($results), true);
        return (array)$results;
    }

    /**
     * Setter for the API-key
     *
     * @param string $apikey
     *
     * @return void
     */
    private function setApikey($apikey)
    {
        $this->_apikey = $apikey['tmdb_key'];
    }

    /**
     * Getter for the API-key
     * e
     * @return string
     */
    private function getApikey()
    {
        return $this->_apikey;
    }

    /*
     * Setter for the default language
     *
     * @param string $lang
     * @return void
     */

    public function setLang($lang = TMDB::LANGUAGE)
    {
        $this->_lang = $lang;
    }

    /**
     * Getter for the default language
     *
     * @return string
     */
    public function getLang()
    {
        return $this->_lang;
    }

    /*
     * Setter for the default language
     *
     * @param string $lang
     * @return void
     */

    public function setFormat($format = TMDb::JSON)
    {
        $this->_format = $format;
    }

    /**
     * Getter for the default language
     *
     * @return string
     */
    public function getFormat()
    {
        return $this->_format;
    }

    /**
     * Set URL of images
     *
     * @param  $config Configurarion of API
     *
     * @return array
     */
    public function setImageURL($config)
    {
        $this->_imgUrl = (string)$config['images']["base_url"];
    }

    /**
     * Get URL of images
     *
     * @param  $config Configurarion of API
     *
     * @return array
     */
    public function getImageURL()
    {
        return $this->_imgUrl . "original";
    }

    /**
     * Setter for the full path
     *
     * @return string
     */
    public function setFullPath($path = TMDB::FULLPATH)
    {
        $this->_fullPath = $path;
    }

    /**
     * Sets all images to a full path image
     *
     * @return array
     */
    private function GetImages($element, $type = false)
    {

        foreach ($this->configuration['images'] as $label => $item) {

            switch ($label) {
                case 'poster_sizes':
                    if (array_key_exists('poster_path', $element) == true) {
                        $element = $this->ExplodeImages($element, $item, 'poster_');
                    }
                    break;
                case 'backdrop_sizes':
                    if (array_key_exists('backdrop_path', $element) == true ||
                        $type = 'backdrops') {
                        $element = $this->ExplodeImages($element, $item, 'file_');
                    }
                    break;
                case 'profile_sizes':
                    if (array_key_exists('profile_path', $element) == true) {
                        $element = $this->ExplodeImages($element, $item, 'profile_');
                    }
                    if (array_key_exists('file_path', $element) == true) {
                        $element = $this->ExplodeImages($element, $item, 'file_');
                    }
                    break;
            }
        }
        return $element;
    }

    private function ExplodeImages($element, $item, $type)
    {

        $base_url = $this->configuration['images']['base_url'];

        foreach ($element as $idx => $field) {
            $comp = $type . 'path';
            if ($idx == $comp && $field !== null) {
                foreach ($item as $i) {
                    $label = $type . $i;
                    $image = $base_url . $i . $field;
                    $image = str_replace('//', '/', $image);
                    $image = str_replace('http:/', 'http://', $image);
                    $element[$label] = $image;
                }

            }
        }

        return $element;
    }

    /**
     * Process the output
     *
     * @return $result in the requested output format
     */
    private function ProcessResult($result)
    {

        $format = $this->getFormat();

        if ($format == TMDB::JSON) {
            return json_encode($result);
        } elseif ($format == TMDB::YAML) {
            return parse_yaml($result);
        } elseif ($format == TMDB::XML) {
            return 'johan';
        }
        // return the array (fallback)
        return $result;
    }

}

?>