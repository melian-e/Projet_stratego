-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  mar. 06 avr. 2021 à 17:02
-- Version du serveur :  5.7.28
-- Version de PHP :  5.6.40

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `projet_stratego`
--

-- --------------------------------------------------------

--
-- Structure de la table `games`
--

DROP TABLE IF EXISTS `games`;
CREATE TABLE IF NOT EXISTS `games` (
  `id_game` int(11) NOT NULL AUTO_INCREMENT,
  `id_winner` int(11) NOT NULL,
  `id_loser` int(11) NOT NULL,
  `score_winner` int(11) NOT NULL,
  `score_loser` int(11) NOT NULL,
  `date` text NOT NULL,
  `play_time` text NOT NULL,
  `name_winner` text NOT NULL,
  `name_loser` text NOT NULL,
  PRIMARY KEY (`id_game`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `games`
--

INSERT INTO `games` (`id_game`, `id_winner`, `id_loser`, `score_winner`, `score_loser`, `date`, `play_time`, `name_winner`, `name_loser`) VALUES
(7, 10, 9, 35, -10, '2021-04-05', '1:32', 'testtestest', 'testtest'),
(8, 10, 9, 35, -10, '2021-04-05', '1:32', 'testtestest', 'testtest'),
(9, 10, 9, 35, -10, '2021-04-05', '1:32', 'testtestest', 'testtest'),
(10, 10, 9, 35, -10, '2021-04-05', '1:32', 'testtestest', 'testtest'),
(11, 10, 9, 35, -10, '2021-04-05', '1:32', 'testtestest', 'testtest'),
(12, 10, 9, 35, -10, '2021-04-05', '1:32', 'testtestest', 'testtest');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(12) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(12) NOT NULL,
  `mmr` int(11) NOT NULL COMMENT 'valeur permettant le classement du joueur',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `mmr`) VALUES
(6, 'test', 'test1@test.test', 'test', 200),
(5, 'test1', 'test@test.test', 'test', 200),
(7, 'test2', 'test2@test.test', 'test', 200),
(8, 'test4', 'test4@test.test', 'test', 200),
(9, 'testtest', 'test4test@test.test', 'test', 200),
(10, 'testtestest', 'testsetest@test.test', 'test', 200);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
