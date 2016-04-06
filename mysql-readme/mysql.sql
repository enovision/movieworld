-- --------------------------------------------------------
-- Host:                         host
-- Server version:               5.5.47-0+deb8u1 - (Debian)
-- Server OS:                    debian-linux-gnu
-- HeidiSQL Version:             9.3.0.5052
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table movieworld.tmdb_boxoffice
CREATE TABLE IF NOT EXISTS `tmdb_boxoffice` (
  `key` int(11) NOT NULL AUTO_INCREMENT,
  `type` char(1) NOT NULL,
  `id` int(9) NOT NULL,
  `name` char(128) NOT NULL,
  `img` char(128) NOT NULL,
  `popularity` float DEFAULT '0',
  `vote_average` float DEFAULT '0',
  `release_date` char(10) DEFAULT '',
  `c_date` date DEFAULT NULL,
  `c_time` time DEFAULT NULL,
  `uid` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`key`),
  KEY `uid` (`uid`)
) ENGINE=MyISAM AUTO_INCREMENT=37955 DEFAULT CHARSET=latin1 ROW_FORMAT=FIXED;

-- Data exporting was unselected.
-- Dumping structure for table movieworld.tmdb_cache
CREATE TABLE IF NOT EXISTS `tmdb_cache` (
  `key` int(11) NOT NULL AUTO_INCREMENT,
  `id` varchar(15) CHARACTER SET utf8 NOT NULL,
  `type` char(1) NOT NULL,
  `page` tinyint(3) unsigned DEFAULT '1',
  `season` int(11) DEFAULT NULL,
  `episode` int(11) DEFAULT NULL,
  `json` mediumtext NOT NULL,
  `c_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`key`),
  KEY `id` (`id`,`type`)
) ENGINE=MyISAM AUTO_INCREMENT=122 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table movieworld.tmdb_chart
CREATE TABLE IF NOT EXISTS `tmdb_chart` (
  `key` int(11) NOT NULL AUTO_INCREMENT,
  `type` char(1) NOT NULL,
  `id` int(9) NOT NULL,
  `hits` int(11) NOT NULL,
  `c_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `m_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`key`)
) ENGINE=MyISAM AUTO_INCREMENT=2092 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table movieworld.tmdb_feedback
CREATE TABLE IF NOT EXISTS `tmdb_feedback` (
  `msg_id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Einmalige Satz ID',
  `msg_module` char(4) NOT NULL COMMENT 'Bericht Type (Mail oder System)',
  `msg_date` datetime DEFAULT NULL COMMENT 'Datum',
  `msg_subject` varchar(256) NOT NULL COMMENT 'Betreff',
  `msg_name` varchar(128) NOT NULL,
  `msg_email` varchar(128) NOT NULL,
  `msg_emailto` text NOT NULL,
  `msg_reply` char(20) NOT NULL,
  `msg_message` text NOT NULL COMMENT 'Inhalt des Berichtes',
  `msg_ip` text NOT NULL,
  `msg_status` int(1) NOT NULL COMMENT 'Status von Bericht',
  PRIMARY KEY (`msg_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table movieworld.tmdb_hits
CREATE TABLE IF NOT EXISTS `tmdb_hits` (
  `key` int(11) NOT NULL AUTO_INCREMENT,
  `type` char(1) NOT NULL,
  `id` int(9) NOT NULL,
  `ip` varchar(30) NOT NULL,
  `country` char(2) NOT NULL,
  `c_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`key`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table movieworld.tmdb_items
CREATE TABLE IF NOT EXISTS `tmdb_items` (
  `key` int(11) NOT NULL AUTO_INCREMENT,
  `id` char(20) CHARACTER SET utf8 NOT NULL,
  `type` char(1) NOT NULL,
  `thumb` varchar(128) NOT NULL,
  `name` varchar(128) DEFAULT NULL,
  `datum` char(10) DEFAULT NULL COMMENT 'Date Released or Date born',
  `c_date` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`key`),
  KEY `id` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
-- Dumping structure for table movieworld.tmdb_log
CREATE TABLE IF NOT EXISTS `tmdb_log` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT 'Unique ID',
  `request_ip` char(15) NOT NULL COMMENT 'IP Number of client',
  `requester` char(30) NOT NULL COMMENT 'Request URL (info)',
  `request_ts` datetime NOT NULL COMMENT 'Date time of request',
  `record_ts` datetime NOT NULL COMMENT 'Datetime of the record write',
  `request_url` varchar(255) NOT NULL COMMENT 'complete request url',
  `request_client` varchar(255) NOT NULL COMMENT 'Web client of request',
  `request_output` char(4) NOT NULL COMMENT 'Type of requested output',
  `request_charset` varchar(255) NOT NULL COMMENT 'Character Set Requester',
  `request_encoding` varchar(255) NOT NULL COMMENT 'Encoding Requester',
  `request_language` varchar(255) NOT NULL COMMENT 'Language Requester',
  `request_secure` char(1) NOT NULL COMMENT 'Secure Request (https)',
  `request_secid` varchar(50) NOT NULL COMMENT 'Requester Security ID',
  `server_admin` varchar(50) NOT NULL COMMENT 'Server administrator client',
  `error_code` int(5) NOT NULL COMMENT 'Error code',
  `request_trigger` varchar(30) DEFAULT NULL COMMENT 'Trigger of the log',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.
-- Dumping structure for table movieworld.tmdb_search
CREATE TABLE IF NOT EXISTS `tmdb_search` (
  `key` int(11) NOT NULL AUTO_INCREMENT,
  `search` text NOT NULL,
  `ip` char(30) NOT NULL,
  `country` char(2) DEFAULT NULL,
  `c_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`key`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
