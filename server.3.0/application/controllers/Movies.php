<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Movies extends CI_Controller
{

    private $tmdb_img_path = 'http://image.tmdb.org/';
    private $no_poster_w92 = '/images/tmdb/no-poster-w92.jpg';
    private $no_profile_w45 = '/images/tmdb/no-profile-w45.jpg';
    private $no_profile_w92 = '/images/tmdb/no-profile-w92.jpg';
    private $no_poster_w185 = '/images/tmdb/no-poster-w185.jpg';
    private $no_profile_w185 = '/images/tmdb/no-profile-w185.jpg';

    public function __construct()
    {
        parent::__construct();
        $this->load->library('tmdb');
        $this->load->model('mod_tmdb');
        $this->load->helper('download');
    }

    //--------------------------------------------------------------------------
    // TMDB Charts (Box Office & Popular)
    //--------------------------------------------------------------------------

    public function BoxOffice()
    {
        $result = $this->mod_tmdb->BoxOffice(true, true);
        $result['records'] = $result['records']['boxoffice'];
        $result['total'] = count($result['records']);
        echo json_encode($result);
    }

    public function Popular()
    {
        $result = $this->mod_tmdb->BoxOffice(true, false);
        // false doesn't check the tmdb_charts update
        $result['records'] = $result['records']['popular'];
        $result['total'] = count($result['records']);
        echo json_encode($result);
    }

    public function PopularTV()
    {
        $result = $this->mod_tmdb->BoxOffice(true, false);
        // false doesn't check the tmdb_charts update

        $result['records'] = $result['records']['popular_tv'];
        $result['total'] = count($result['records']);
        echo json_encode($result);
    }

    public function BoxOfficeTV()
    {
        $result = $this->mod_tmdb->BoxOffice(true, false);
        $result['records'] = $result['records']['boxoffice_tv'];
        $result['total'] = count($result['records']);
        echo json_encode($result);
    }

    public function PersonsPopular()
    {
        $result = $this->mod_tmdb->PersonsPopular();
        echo json_encode($result);
    }

    public function MoviesPopular()
    {
        $result = $this->mod_tmdb->MoviesPopular();
        echo json_encode($result);
    }

    //--------------------------------------------------------------------------
    // Search by search item (movies and persons)
    //--------------------------------------------------------------------------

    public function search($search = false, $chkMovies = false, $chkPersons = false)
    {
        if ($search == false) {
            $search = $this->input->post('search');
            // paging
            $page = $this->input->post('page');
            $start = $this->input->post('start');
            $limit = $this->input->post('limit');
        }

        $this->mod_tmdb->AddSearch($search);

        if ($chkMovies == false) {
            $chkMovies = $this->input->post('chkMovies');
            $chkPersons = $this->input->post('chkPersons');
            $chkTV = $this->input->post('chkTV');
        }

        $movies = $chkMovies == 'true' ? json_decode($this->MovieSearch($search)) : array();
        $persons = $chkPersons == 'true' ? json_decode($this->PersonSearch($search)) : array();
        $tv = $chkTV == 'true' ? json_decode($this->TvSearch($search)) : array();

        $movies = (count($movies) == 0) ? array() : $movies->results;
        $persons = (count($persons) == 0) ? array() : $persons->results;
        $tv = (count($tv) == 0) ? array() : $tv->results;

        $result = array();
        // assemble
        foreach ($movies as $r) {

            $thumbnail = array_key_exists('poster_w92', $r) ? $r->poster_w92 : $this->no_poster_w92;

            $result[] = array(
                'type' => 'M',
                // 'popularity' => $r->popularity,
                'name' => $r->title,
                'original_name' => $r->original_title,
                'id' => $r->id,
                'thumbnail' => $thumbnail,
                'released' => date('Y', strtotime($r->release_date))
            );
        }

        foreach ($tv as $r) {

            $thumbnail = array_key_exists('poster_w92', $r) ? $r->poster_w92 : $this->no_poster_w92;

            $result[] = array(
                'type' => 'T',
                // 'popularity' => $r->popularity,
                'name' => $r->name,
                'original_name' => $r->original_name,
                'id' => $r->id,
                'thumbnail' => $thumbnail,
                'released' => date('Y', strtotime($r->first_air_date))
            );
        }

        foreach ($persons as $r) {

            $thumbnail = array_key_exists('profile_w185', $r) ? $r->profile_w185 : $this->no_profile_w185;

            $result[] = array(
                'type' => 'P',
                'popularity' => false,
                'name' => $r->name,
                'birthday' => false,
                'original_name' => false,
                'id' => $r->id,
                'thumbnail' => $thumbnail,
                'released' => false
            );
        }

        $total = count($result);
        $message = $total . ' records found';
        $records = array_slice($result, $start, $limit, false);

        $fb = array(
            'success' => true,
            'message' => 'OK',
            'records' => $records,
            'total' => $total
        );

        echo(json_encode($fb));
    }

    //--------------------------------------------------------------------------
    // Search Content by ID
    //--------------------------------------------------------------------------

    public function ContentSearch($id = false, $type = false, $return = false, $limit = true)
    {
        // paging
        $page = $limit === false ? 1 : $this->input->post('page');
        $start = $limit === false ? 0 : $this->input->post('start');
        $limit = $limit === false ? 99999 : $this->input->post('limit');
    
        if ($id == false) {
            $id = $this->input->post('id');
            $type = $this->input->post('type');
            $episode = $this->input->post('episode');
            $season = $this->input->post('season');
        }

        $set_cache = false;

        $records = array();


        if ($type === 'M') {

            $set_cache = true;
            // first check cache
            $cache = $this->mod_tmdb->cache_read($id, 'C', $page);
            // cast
            if ($cache !== false) {
                echo $cache;
                return;
            }

            $result = json_decode($this->tmdb->MovieCasts($id));
            if (count($result) > 0) {

                if (array_key_exists('cast', $result) == true) {

                    foreach ($result->cast as $actor) {
                        $records[] = array(
                            'id' => $actor->id,
                            'type' => 'P',
                            'name' => $actor->name,
                            'character' => $actor->character,
                            'thumbnail' => array_key_exists('profile_w185', $actor) ? $actor->profile_w185 : $this->no_profile_w185
                        );
                    }
                }

                if (array_key_exists('crew', $result) == true) {
                    foreach ($result->crew as $crew) {
                        $records[] = array(
                            'id' => $crew->id,
                            'type' => 'P',
                            'department' => $crew->department,
                            'job' => $crew->job,
                            'name' => $crew->name,
                            'thumbnail' => array_key_exists('profile_w185', $crew) ? $crew->profile_w185 : $this->no_profile_w185
                        );
                    }
                }
            }
        } else if ($type === 'T' || $type === 'E') {  // TV or Episode
            $set_cache = true;
            // first check cache
            if ($type === 'T') {
                $cache = $this->mod_tmdb->cache_read($id, 'V', $page);
            } else {
                $cache = $this->mod_tmdb->cache_read($id, 'E', $page);
            }
            // cast (TV)
            if ($cache !== false) {
                echo $cache;
                return;
            }

            if ($type === 'T') {
                $result = json_decode($this->tmdb->TVCasts($id));
            } else {
                $result = json_decode($this->tmdb->TvEpisodeCasts($id, $season, $episode));
            }
            if (count($result) > 0) {

                if (array_key_exists('cast', $result) == true) {

                    foreach ($result->cast as $actor) {
                        $records[] = array(
                            'id' => $actor->id,
                            'type' => 'P',
                            'name' => $actor->name,
                            'character' => $actor->character,
                            'thumbnail' => array_key_exists('profile_w185', $actor) ? $actor->profile_w185 : $this->no_profile_w185
                        );
                    }
                }

                if (array_key_exists('crew', $result) == true) {
                    foreach ($result->crew as $crew) {
                        $records[] = array(
                            'id' => $crew->id,
                            'type' => 'P',
                            'department' => $crew->department,
                            'job' => $crew->job,
                            'name' => $crew->name,
                            'thumbnail' => array_key_exists('profile_w185', $crew) ? $crew->profile_w185 : $this->no_profile_w185
                        );
                    }
                }
            }

        } else if ($type === 'P') {

            $role = $this->input->post('role');
            // A(cting), T(v), O(ther)

            $set_cache = true;
            // this is what the actor already has done in his carrier
            $cache = $this->mod_tmdb->cache_read($id, 'R', $page);
            // Repertoire (PersonCredits Repertoire)
            if ($cache !== false) {
                $result = json_decode($cache);
            } else {
                $pc = $this->tmdb->PersonCredits($id);
                $result = json_decode($pc);
                if ($set_cache == true && count($result) > 0) {
                    $this->mod_tmdb->cache_write($id, 'R', $pc, $page);
                }
            }

            if (count($result->cast) > 0) {

                if (array_key_exists('cast', $result) == true) {
                    foreach ($result->cast as $actor) {
                        if ($actor->media_type === 'movie') {
                            if ($role === 'A' || !$role) {
                                $records[] = array(
                                    'id' => $actor->id,
                                    'type' => 'M',
                                    'title' => $actor->title,
                                    'character' => $actor->character,
                                    'released' => date('Y', strtotime($actor->release_date)),
                                    'thumbnail' => array_key_exists('poster_w92', $actor) && $actor->poster_w92 !== null ? $actor->poster_w92 : $this->no_poster_w92
                                );
                            }
                        } else {
                            if ($role === 'T' || !$role) {
                                $records[] = array(
                                    'id' => $actor->id,
                                    'type' => 'T',
                                    'title' => $actor->name,
                                    'character' => $actor->character,
                                    'released' => date('Y', strtotime($actor->first_air_date)),
                                    'thumbnail' => array_key_exists('poster_path', $actor) && $actor->poster_path !== null ? $this->tmdb_img_path . '/t/p/w92' . $actor->poster_path : $this->no_poster_w92
                                );
                            }
                        }
                    }
                }

                if (array_key_exists('crew', $result) == true) {
                    foreach ($result->crew as $crew) {
                        if ($crew->media_type === 'movie') {
                            if ($role === 'O' || !$role) {
                                $records[] = array(
                                    'id' => $crew->id,
                                    'type' => 'M',
                                    'title' => $crew->title,
                                    'department' => $crew->department,
                                    'job' => $crew->job,
                                    'released' => date('Y', strtotime($crew->release_date)),
                                    'thumbnail' => array_key_exists('poster_w92', $crew) && $crew->poster_w92 !== null ? $crew->poster_w92 : $this->no_poster_w92
                                );
                            }
                        } else {
                            if ($role === 'O' || !$role) {
                                $records[] = array(
                                    'id' => $crew->id,
                                    'type' => 'T',
                                    'title' => $crew->name,
                                    'department' => $crew->department,
                                    'job' => $crew->job,
                                    'released' => isset($crew->first_air_date) ? date('Y', strtotime($crew->first_air_date)) : '1970-01-01',
                                    'thumbnail' => array_key_exists('poster_w92', $crew) && $crew->poster_w92 !== null ? $crew->poster_w92 : $this->no_poster_w92
                                );
                            }
                        }
                    }
                }
            }
        }

        if ($type == 'P') {
            $records = $this->ArraySort($records, 'released');
        }

        $fb = json_encode(array(
            'success' => true,
            'message' => count($records) . ' records found',
            'records' => array_slice($records, $start, $limit, false),
            'total' => count($records)
        ));

        // cache the page !!!
        if ($set_cache == true && count($records) > 0) {
            $this->mod_tmdb->cache_write($id, 'C', $fb, $page);
        }

        if ($return == true)
            return $fb;

        echo $fb;
    }

    //--------------------------------------------------------------------------
    // Search persons by search item
    //--------------------------------------------------------------------------

    public function PersonSearch($id = false)
    {
        $result = $this->tmdb->PersonSearch($id);
        return $result;
    }

    //--------------------------------------------------------------------------
    // Search movies by search item
    //--------------------------------------------------------------------------

    public function MovieSearch($id = false)
    {
        $result = $this->tmdb->MovieSearch($id);
        return $result;
    }

    public function MovieReleaseInfo($id = false)
    {
        if ($id == false) {
            $id = $this->input->post('movieId');
        }

        $result = $this->tmdb->MovieReleaseInfo($id);
        echo $result;
    }

    //--------------------------------------------------------------------------
    // Search TV programmes by search item
    //--------------------------------------------------------------------------

    public function TVSearch($id = false)
    {
        $result = $this->tmdb->TvSearch($id);
        return $result;
    }

    public function TvTranslations($id = false)
    {
        if ($id == false) {
            $id = $this->input->post('id');
        }

        $result = json_decode($this->tmdb->TvTranslations($id));

        $fb = json_encode(array(
            'success' => true,
            'message' => 'OK',
            'records' => $result,
            'total' => count($result->translations)
        ));

        echo $fb;
    }

    //--------------------------------------------------------------------------
    // Get Movie || TV Info (by Id)
    //--------------------------------------------------------------------------

    public function MovieInfo($id = false, $type = false)
    {
        if ($id === false) {
            $id = $this->input->post('id');
            $type = $this->input->post('type');
        }

        // first check cache
        $cache = $this->mod_tmdb->cache_read($id, $type);

        $cache = false; // TEMPORARY

        if ($cache !== false) {
            $this->mod_tmdb->Hits(array(
                'id' => $id,
                'type' => $type
            ));
            echo $cache;
            return;
        }

        do {
            if ($type === 'M') {
                $result = json_decode($this->tmdb->MovieInfo($id));
            } else {
                $result = json_decode($this->tmdb->TvInfo($id));

                if (isset($result->seasons)) {
                    $this->ExplodeImages($result->seasons, 'poster');
                }

                // tmdb links and so on..

                $result->external_ids = json_decode($this->tmdb->TvExternalIds($id));

            }
            sleep(.3);
        } while (count($result) == 0);

        if ($type === 'M') {
            $poster = isset($result->poster_w185) ? $result->poster_w185 : $this->no_poster_w185;
        } else {
            if (isset($result->poster_path)) {
                $result->poster_w185 = $poster = $this->tmdb_img_path . '/t/p/w185' . $result->poster_path;

            } else {
                $result->poster_w185 = $poster = $this->no_poster_w185;
            }
        }

        $title = $type === 'M' ? $result->title : $result->name;
        $release_date = $type === 'M' ? $result->release_date : $result->first_air_date;

        $result->type = $type;

        $this->mod_tmdb->Hits(array(
            'id' => $id,
            'type' => $type,
            'thumb' => $poster,
            'name' => $title,
            'datum' => $release_date
        ));

        $fb = json_encode(array(
            'success' => true,
            'message' => 'OK',
            'records' => $result,
            'total' => 1
        ));

        if (count($result) > 0) {
            $this->mod_tmdb->cache_write($id, $type, $fb);
        }

        echo $fb;
    }

    private function ExplodeImages($element, $type)
    {

        $path = $type . '_path';
        $sizes = $type . '_sizes';

        $configuration = $this->tmdb->getConfig();

        foreach ($element as $idx => $el) {
            if (isset($el->$path) && $el->$path !== null) {
                $base_url = $configuration['images']['base_url'];
                foreach ($configuration['images'][$sizes] as $size) {
                    $ix = $type . '_' . $size;
                    $image = $base_url . $size . '/' . $el->$path;
                    $image = str_replace('//', '/', $image);
                    $image = str_replace('http:/', 'http://', $image);
                    $element[$idx]->$ix = $image;
                }
            }
        }
    }

    //--------------------------------------------------------------------------
    // Get Season Information
    //--------------------------------------------------------------------------

    public function TvSeason($id = false, $season = 1)
    {
        if ($id === false) {
            $id = $this->input->post('id');
            $season = $this->input->post('season');
        }

        $result = json_decode($this->tmdb->SeasonInfo($id, $season));

        // explode the images
        if (isset($result->episodes)) {
            $this->ExplodeImages($result->episodes, 'still');

            foreach ($result->episodes as $idx => $episode) {
                $result->episodes[$idx]->tv_id = $id;
                $result->episodes[$idx]->season_number = $season;
            }

            $records = $result->episodes;

        } else {
            $records = array();
        }

        $fb = json_encode(array(
            'success' => true,
            'message' => 'OK',
            'records' => $records,
            'total' => count($records)
        ));

        echo $fb;
    }

    //--------------------------------------------------------------------------
    // Get Person Info (by Id)
    //--------------------------------------------------------------------------

    public function PersonInfo($id = false)
    {
        if ($id == false) {
            $id = $this->input->post('id');
        }

        // first check cache
        $cache = $this->mod_tmdb->cache_read($id, 'P');

        if ($cache != false) {
            $this->mod_tmdb->Hits(array(
                'id' => $id,
                'type' => 'P',
            ));
            echo $cache;
            return;
        }

        do {
            $result = json_decode($this->tmdb->PersonInfo($id));
            sleep(.3);
        } while (count($result) == 0);

        if ($result->profile_path == NULL) {
            $result->profile_w185 = $this->no_profile_w185;
            $result->profile_w45 = $this->no_profile_w45;
        }

        $this->mod_tmdb->Hits(array(
            'id' => $id,
            'type' => 'P',
            'thumb' => $result->profile_w185,
            'thumb_w45' => $result->profile_w45,
            'name' => $result->name,
            'datum' => $result->birthday
        ));

        $result->type = 'P';

        $fb = json_encode(array(
            'success' => true,
            'message' => 'OK',
            'records' => $result,
            'total' => 1
        ));

        if (count($result) > 0) {
            $this->mod_tmdb->cache_write($id, 'P', $fb);
        }

        echo $fb;
    }

    //--------------------------------------------------------------------------
    // Get Movie Media (by Id)
    // This function is using the Media function, but it collects with one
    // call Images + Trailers !!!
    //--------------------------------------------------------------------------

    public function MovieMedia($id = false)
    {

        if ($id == false) {
            $id = $this->input->post('id');
        }

        $images = $this->Media($id, 'movieimages', true);

        if (count($images['records']['posters']) == 0) {
            $posters = false;
        } else {
            $posters = $this->AddId($images['records']['posters'], $id);
        }

        if (count($images['records']['backdrops']) == 0) {
            $backdrops = false;
        } else {
            $backdrops = $this->AddId($images['records']['backdrops'], $id);
        }

        if (count($images['records']['profiles']) == 0) {
            $profiles = false;
        } else {
            $profiles = $this->AddId($images['records']['profiles'], $id);
        }

        $trailers = $this->Media($id, 'trailers', true);

        $fb = array(
            'success' => true,
            'message' => 'Images and Trailers Loaded',
            'id' => $id,
            'records' => array(
                'id' => $id,
                'posters' => $posters,
                'backdrops' => $backdrops,
                'profiles' => $profiles,
                'trailers' => count($trailers['records']['trailers']) == 0 ? false : $trailers['records']['trailers']
            ),
            'total' => 1
        );

        echo json_encode($fb);
    }

    //--------------------------------------------------------------------------
    // Get TV Media (by Id)
    // This function is using the Media function, but it collects with one
    // call Images + Trailers !!!
    //--------------------------------------------------------------------------

    public function TvMedia($id = false)
    {

        if ($id == false) {
            $id = $this->input->post('id');
        }

        $images = $this->Media($id, 'tvimages', true);

        if (count($images['records']['posters']) == 0) {
            $posters = false;
        } else {
            $posters = $this->AddId($images['records']['posters'], $id);
        }

        if (count($images['records']['backdrops']) == 0) {
            $backdrops = false;
        } else {
            $backdrops = $this->AddId($images['records']['backdrops'], $id);
        }

        if (count($images['records']['profiles']) == 0) {
            $profiles = false;
        } else {
            $profiles = $this->AddId($images['records']['profiles'], $id);
        }

        $trailers = $this->Media($id, 'videos', true);

        $fb = array(
            'success' => true,
            'message' => 'Images and Trailers Loaded',
            'id' => $id,
            'records' => array(
                'id' => $id,
                'posters' => $posters,
                'backdrops' => $backdrops,
                'profiles' => $profiles,
                'trailers' => count($trailers['records']['trailers']) == 0 ? false : $trailers['records']['trailers']
            ),
            'total' => 1
        );

        echo json_encode($fb);
    }

    //----------------------------------------------------------------------------------------
    // Make entries unique with id
    //----------------------------------------------------------------------------------------

    private function AddId($images, $id)
    {

        if (!is_array($images))
            return $images;

        foreach ($images as $row) {
            $row->id = $id . uniqid("-", true);
        }

        return $images;
    }

    //--------------------------------------------------------------------------
    // Get Media (by Id)
    //--------------------------------------------------------------------------

    public function Media($id = false, $type = false, $return = false)
    {

        if ($id == false) {
            $id = $this->input->post('id');
            $type = $this->input->post('type');
        }

        $routine = false;
        switch ($type) {
            case 'trailers' :
                $routine = 'MovieTrailers';
                break;
            case 'movieimages' :
                $routine = 'MovieImages';
                break;
            case 'tvimages' :
                $routine = 'TvImages';
                break;
            case 'videos' :
                $routine = 'TvVideos';
                break;
            case 'personimages' :
                $routine = 'PersonImages';
                break;
        }

        if ($routine == false) {
            return false;
        }

        do {
            $this->tmdb->setLang(false);
            // no language for media
            $result = json_decode($this->tmdb->$routine($id));
            sleep(.3);
        } while (count($result) == 0);

        $backdrops = array_key_exists('backdrops', $result) == true ? $result->backdrops : false;
        $posters = array_key_exists('posters', $result) == true ? $result->posters : false;
        $profiles = array_key_exists('profiles', $result) == true ? $result->profiles : false;
        $trailers = array_key_exists('trailers', $result) == true ? $result->trailers : false;

        $fb = array(
            'success' => true,
            'message' => 'OK',
            'id' => $id,
            'records' => array(
                'id' => $id,
                'posters' => count($posters) == 0 ? false : $posters,
                'backdrops' => count($backdrops) == 0 ? false : $backdrops,
                'profiles' => count($profiles) == 0 ? false : $profiles,
                'trailers' => count($trailers) == 0 ? false : $trailers
            ),
            'total' => 1
        );

        if ($return == true)
            return $fb;

        echo json_encode($fb);
    }

    //--------------------------------------------------------------------------
    // Work Compare, this function compares the carrier from an array of actors
    // and gives back the equal result
    //--------------------------------------------------------------------------
    //public function WorkCompare($actors = '[{"id":228},{"id":2227}]') {
    public function WorkCompare($actors = false)
    {
        if ($actors == false) {
            $actors = $this->input->post('selection');
        }

        // paging
        $page = $this->input->post('page');
        $start = $this->input->post('start');
        $limit = $this->input->post('limit');

        $actors = json_decode($actors);

        if (count($actors) == 0) {

            $fb = array(
                'success' => true,
                'records' => $actors,
                'total' => 0,
                'message' => 'Nothing to compare'
            );

            echo json_encode($fb);
            return;
        }

        $compare = array();
        $idx = 0;
        foreach ($actors as $actor) {
            $result = $this->ContentSearch($actor->id, 'P', true, false); // no limit
            $compare[$idx] = json_decode($result, true); // assoc. array
            $compare[$idx]['id'] = $actor->id;
            // add the actor to the result
            $idx++;
        }

        foreach ($compare[0]['records'] as $idx => $movie) {
            $compare[0]['records'][$idx]['roles'][0] = array(
                'id' => $movie['id'],
                'character' => array_key_exists('character', $movie) ? $movie['character'] : '',
                'job' => array_key_exists('job', $movie) ? $movie['job'] : ''
            );
        }

        if (count($compare) == 1) {

            $total = count($compare[0]['records']);
            $message = $total . ' matches found';
            $records = array_slice($compare[0]['records'], $start, $limit, false);

            $fb = array(
                'success' => true,
                'records' => $records,
                'total' => $total,
                'message' => $message
            );
            echo json_encode($fb);
            return;
        }

        for ($i = 1; $i <= count($compare) - 1; $i++) {
            $reference = $compare[0]['records'];

            $other = $compare[$i]['records'];

            foreach ($reference as $key => $movie) {
                $found = $this->ArraySearch($other, 'id', $movie['id']);

                $f = count($found) > 0 ? $found[0] : array();
                $role = array(
                    'id' => $compare[$i]['id'],
                    'character' => array_key_exists('character', $f) ? $f['character'] : '',
                    'job' => array_key_exists('job', $f) ? $f['job'] : ''
                );
                if (count($found) == 0) {
                    unset($compare[0]['records'][$key]);
                } else {
                    $compare[0]['records'][$key]['roles'][$i] = $role;
                }
            }
        }

        $records = array();
        foreach ($compare[0]['records'] as $movie) {
            $records[] = $movie;
        }

        // slice it for paging
        $total = count($records);

        //dump($records);
        $records = array_slice($records, $start, $limit, false);

        $fb = array(
            'success' => true,
            'records' => $records,
            'total' => $total,
            'message' => count($records) . ' matches found'
        );
        echo json_encode($fb);
    }

    public function DownloadImage()
    {
        $url = urldecode($this->input->post('url'));

        if (!$url)
            echo json_encode(array(
                'success' => false,
                'message' => 'Invalid Image URL'
            ));

        $content = file_get_contents($url);

        if (!$content)
            echo json_encode(array(
                'success' => false,
                'message' => 'Download failed, try another image'
            ));

        $name = 'movieworld-tmdb-image.jpg';

        //ob_clean();
        //flush();

        //force_download($name, $content);

        header('Content-Type: application/octet-stream');
        header("Content-Disposition: attachment; filename=$name");

        ob_clean();
        flush();
        readfile($url);

    }

    private function ArraySearch($array, $key, $value)
    {
        $results = array();

        if (is_array($array)) {
            if (isset($array[$key]) && $array[$key] == $value)
                $results[] = $array;

            foreach ($array as $subarray)
                $results = array_merge($results, $this->ArraySearch($subarray, $key, $value));
        }

        return $results;
    }

    private function ArraySort(&$array, $subkey = "id", $sort_ascending = false)
    {

        $temp_array = array();

        if (count($array))
            $temp_array[key($array)] = array_shift($array);

        foreach ($array as $key => $val) {
            $offset = 0;
            $found = false;
            foreach ($temp_array as $tmp_key => $tmp_val) {
                if (!$found and strtolower($val[$subkey]) > strtolower($tmp_val[$subkey])) {
                    $temp_array = array_merge((array)array_slice($temp_array, 0, $offset), array($key => $val), array_slice($temp_array, $offset));
                    $found = true;
                }
                $offset++;
            }
            if (!$found)
                $temp_array = array_merge($temp_array, array($key => $val));
        }

        if ($sort_ascending)
            $array = array_reverse($temp_array);
        else
            $array = $temp_array;

        return $array;
    }


    // cleanup, change from private in public to run it
    // set it back to private to forbid public behavior from others
    public function CleanUp() {
        $sql = "

            select * from tmdb_items
            order by 'type', id, c_date desc

        ";

        $query = $this->db->query($sql);

        $id = -1;
        $type = 'x';

        foreach ($query->result() as $row) {
            if ($row->id === $id && $row->type = $type) {
                $sql2 = "
                    delete from tmdb_items
                    where `key` = '{$row->key}'
                ";
                $q2 = $this->db->query($sql2);
            }

            $id = $row->id;
            $type = $row->type;
        }

        echo 'Done!';
    }

}
