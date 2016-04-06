<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Movies extends CI_Controller {

    private $no_poster_w92 = '/images/tmdb/no-poster-w92.jpg';
    private $no_profile_w45 = '/images/tmdb/no-profile-w45.jpg';
    private $no_profile_w92 = '/images/tmdb/no-profile-w92.jpg';
    private $no_poster_w185 = '/images/tmdb/no-poster-w185.jpg';
    private $no_profile_w185 = '/images/tmdb/no-profile-w185.jpg';

    public function __construct() {
        parent::__construct();
        $this->load->library('tmdb');
        $this->load->model('mod_tmdb');
        $this->load->helper('download');
    }

    //--------------------------------------------------------------------------
    // TMDB Charts (Box Office & Popular)
    //--------------------------------------------------------------------------

    public function Popular() {
        $result = $this->mod_tmdb->BoxOffice(true, false); // false doesn't check the tmdb_charts update
        $result['records'] = $result['records']['popular'];
        $result['total'] = count($result['records']);
        echo json_encode($result);
    }

    public function BoxOffice() {
        $result = $this->mod_tmdb->BoxOffice(true, true);
        $result['records'] = $result['records']['boxoffice'];
        $result['total'] = count($result['records']);
        echo json_encode($result);
    }

    public function PersonsPopular() {
        $result = $this->mod_tmdb->PersonsPopular();
        echo json_encode($result);
    }

    public function MoviesPopular() {
        $result = $this->mod_tmdb->MoviesPopular();
        echo json_encode($result);
    }

    //--------------------------------------------------------------------------
    // Search by search item (movies and persons)
    //--------------------------------------------------------------------------

    public function search($search = false, $chkMovies = false, $chkPersons = false) {
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
        }

        $movies = $chkMovies == 'true' ? json_decode($this->MovieSearch($search)) : array();
        $persons = $chkPersons == 'true' ? json_decode($this->PersonSearch($search)) : array();

        $movies = (count($movies) == 0) ? array() : $movies->results;
        $persons = (count($persons) == 0) ? array() : $persons->results;

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

        echo (json_encode($fb));
    }

    //--------------------------------------------------------------------------
    // Search Content by ID
    //--------------------------------------------------------------------------

    public function ContentSearch($id = false, $type = false, $return = false) {
        if ($id == false) {
            $id = $this->input->post('id');
            $type = $this->input->post('type');
            // paging
            $page = $this->input->post('page');
            $start = $this->input->post('start');

            $limit = $this->input->post('limit');
        }

        $set_cache = false;

        $records = array();
        if ($type == 'M') {

            $set_cache = true;
            // first check cache
            $cache = $this->mod_tmdb->cache_read($id, 'C');
            if ($cache != false) {
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
        } else {
            $set_cache = true;
            // this is what the actor already has done in his carrier
            $cache = $this->mod_tmdb->cache_read($id, 'R'); // Reportoire (PersonCredits Reportoire)
            if ($cache != false) {
                $result = json_decode($cache);
            } else {
                $pc = $this->tmdb->PersonCredits($id);
                $result = json_decode($pc);
                if ($set_cache == true && count($result) > 0) {
                    $this->mod_tmdb->cache_write($id, 'R', $pc);
                }
            }

            if (count($result->cast) > 0) {

                if (array_key_exists('cast', $result) == true) {
                    foreach ($result->cast as $actor) {
                        $records[] = array(
                            'id' => $actor->id,
                            'type' => 'M',
                            'title' => $actor->title,
                            'character' => $actor->character,
                            'released' => date('Y', strtotime($actor->release_date)),
                            'thumbnail' => array_key_exists('poster_w92', $actor) ? $actor->poster_w92 : $this->no_poster_w92
                        );
                    }
                }

                if (array_key_exists('crew', $result) == true) {
                    foreach ($result->crew as $crew) {
                        $records[] = array(
                            'id' => $crew->id,
                            'type' => 'M',
                            'title' => $crew->title,
                            'department' => $crew->department,
                            'job' => $crew->job,
                            'released' => date('Y', strtotime($crew->release_date)),
                            'thumbnail' => array_key_exists('poster_w92', $crew) ? $crew->poster_w92 : $this->no_poster_w92
                        );
                    }
                }
            }
        }

        if ($type == 'P') {
            $records = $this->ArraySort($records, 'released');
        }

        $fb = array(
            'success' => true,
            'message' => 'OK',
            'records' => $records,
            'total' => count($records)
        );

        // cache the complete set !!!
        if ($set_cache == true && count($records) > 0) {
            $this->mod_tmdb->cache_write($id, 'C', json_encode($fb));
        }

        if ($return == true)
            return $fb;

        $fb['total'] = count($records);
        $fb['message'] = count($records) . ' records found';
        $fb['records'] = array_slice($records, $start, $limit, false);

        // but ony echo a slice (paging)
        echo json_encode($fb);
    }

    //--------------------------------------------------------------------------
    // Search persons by search item
    //--------------------------------------------------------------------------

    public function PersonSearch($id = false) {
        $result = $this->tmdb->PersonSearch($id);
        return $result;
    }

    //--------------------------------------------------------------------------
    // Search movies by search item
    //--------------------------------------------------------------------------

    public function MovieSearch($id = false) {
        $result = $this->tmdb->MovieSearch($id);
        return $result;
    }

    public function MovieReleaseInfo($id = false) {
        if ($id == false) {
            $id = $this->input->post('movieId');
        }

        $result = $this->tmdb->MovieReleaseInfo($id);
        echo $result;
    }

    //--------------------------------------------------------------------------
    // Get Movie Info (by Id)
    //--------------------------------------------------------------------------

    public function MovieInfo($id = false) {
        if ($id == false) {
            $id = $this->input->post('id');
        }

        // first check cache
        $cache = $this->mod_tmdb->cache_read($id, 'M');
        if ($cache != false) {
            $this->mod_tmdb->Hits(array(
                'id' => $id,
                'type' => 'M',
            ));
            echo $cache;
            return;
        }

        do {
            $result = json_decode($this->tmdb->MovieInfo($id));
            sleep(.3);
        } while (count($result) == 0);

        if ($result->poster_path == null) {
            $result->poster_w185 = $this->no_poster_w185;
        }

        $result->type = 'M';

        $this->mod_tmdb->Hits(array(
            'id' => $id,
            'type' => 'M',
            'thumb' => $result->poster_w185,
            'name' => $result->title,
            'datum' => $result->release_date
        ));

        $fb = json_encode(array(
            'success' => true,
            'message' => 'OK',
            'records' => $result,
            'total' => 1
        ));

        if (count($result) > 0) {
            $this->mod_tmdb->cache_write($id, 'M', $fb);
        }

        echo $fb;
    }

    //--------------------------------------------------------------------------
    // Get Person Info (by Id)
    //--------------------------------------------------------------------------

    public function PersonInfo($id = false) {
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
    // Get MovieMedia (by Id)
    // This function is using the Media function, but it collects with one
    // call Images + Trailers !!!
    //--------------------------------------------------------------------------

    public function MovieMedia($id = false) {

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

    private function AddId($images, $id) {

        if (!is_array($images)) return $images;

        foreach ($images as $row) {
            $row->id = $id . uniqid ("-", true );
        }

        return $images;
    }

    //--------------------------------------------------------------------------
    // Get Media (by Id)
    //--------------------------------------------------------------------------

    public function Media($id = false, $type = false, $return = false) {

        if ($id == false) {
            $id = $this->input->post('id');
            $type = $this->input->post('type');
        }

        $routine = false;
        switch ($type) {
            case 'trailers':
                $routine = 'MovieTrailers';
                break;
            case 'movieimages':
                $routine = 'MovieImages';
                break;
            case 'personimages':
                $routine = 'PersonImages';
                break;
        }

        if ($routine == false) {
            return false;
        }

        do {
            $this->tmdb->setLang(false); // no language for media
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
    public function WorkCompare($actors = false) {
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
            $result = $this->ContentSearch($actor->id, 'P', true);
            $compare[$idx] = $result;
            $compare[$idx]['id'] = $actor->id; // add the actor to the result
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

    public  function DownloadImage() {
        $url = urldecode($this->input->post('url'));

        if (!$url) echo json_encode(array(
            'success' => false,
            'message' => 'Invalid Image URL'
        ));

        $content = file_get_contents($url);

        if (!$content) echo json_encode(array(
            'success' => false,
            'message' => 'Download failed, try another image'
        ));

        $name = 'movieworld-tmdb-image.jpg';

        //ob_clean();
        //flush();

        force_download($name, $content);

    }

    private function ArraySearch($array, $key, $value) {
        $results = array();

        if (is_array($array)) {
            if (isset($array[$key]) && $array[$key] == $value)
                $results[] = $array;

            foreach ($array as $subarray)
                $results = array_merge($results, $this->ArraySearch($subarray, $key, $value));
        }


        return $results;
    }

    private function ArraySort(&$array, $subkey = "id", $sort_ascending = false) {

        if (count($array))
            $temp_array[key($array)] = array_shift($array);

        foreach ($array as $key => $val) {
            $offset = 0;
            $found = false;
            foreach ($temp_array as $tmp_key => $tmp_val) {
                if (!$found and strtolower($val[$subkey]) > strtolower($tmp_val[$subkey])) {
                    $temp_array = array_merge((array) array_slice($temp_array, 0, $offset), array($key => $val), array_slice($temp_array, $offset)
                    );
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

}