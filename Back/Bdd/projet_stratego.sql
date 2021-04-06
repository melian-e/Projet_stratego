-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le :  mar. 06 avr. 2021 à 21:54
-- Version du serveur :  5.7.17
-- Version de PHP :  5.6.30

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

CREATE TABLE `games` (
  `id_game` int(11) NOT NULL,
  `id_winner` int(11) NOT NULL,
  `id_loser` int(11) NOT NULL,
  `score_winner` int(11) NOT NULL,
  `score_loser` int(11) NOT NULL,
  `date` text NOT NULL,
  `play_time` text NOT NULL,
  `name_winner` text NOT NULL,
  `name_loser` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `games`
--

INSERT INTO `games` (`id_game`, `id_winner`, `id_loser`, `score_winner`, `score_loser`, `date`, `play_time`, `name_winner`, `name_loser`) VALUES
(9, 9, 10, 35, -10, '2021-04-05', '14:23', 'alexis', 'axel'),
(10, 9, 10, 35, -10, '2021-04-05', '15:32', 'alexis', 'axel'),
(11, 10, 9, 35, -10, '2021-04-05', '19:07', 'axel', 'alexis'),
(12, 10, 9, 35, -10, '2021-04-05', '13:08', 'axel', 'alexis'),
(13, 10, 9, 35, -10, '2021-04-05', '5:12', 'axel', 'alexis'),
(14, 10, 9, 35, -10, '2021-04-06', '10:05', 'axel', 'alexis'),
(15, 10, 9, 35, -10, '2021-04-06', '25:11', 'axel', 'alexis'),
(16, 10, 9, 35, -10, '2021-04-06', '30:09', 'axel', 'alexis'),
(17, 10, 9, 35, -10, '2021-04-06', '41:40', 'axel', 'alexis'),
(18, 10, 9, 35, -10, '2021-04-06', '40:05', 'axel', 'alexis'),
(19, 9, 10, 35, -10, '2021-04-06', '57:50', 'alexis', 'axel'),
(20, 9, 10, 35, -10, '2021-04-06', '34:58', 'alexis', 'axel'),
(21, 9, 10, 35, -10, '2021-04-06', '34:09', 'alexis', 'axel'),
(22, 9, 10, 35, -10, '2021-04-06', '43:06', 'alexis', 'axel'),
(23, 9, 10, 35, -10, '2021-04-06', '34:25', 'alexis', 'axel'),
(48, 10, 11, 35, -10, '2021-04-06', '55:02', 'axel', 'IéIé'),
(47, 11, 9, 35, -10, '2021-04-06', '14:01', 'IéIé', 'alexis'),
(46, 11, 9, 35, -10, '2021-04-06', '30:02', 'IéIé', 'alexis'),
(45, 11, 10, 35, -10, '2021-04-06', '44:04', 'IéIé', 'axel'),
(42, 9, 10, 35, -10, '2021-04-06', '21:35', 'alexis', 'axel'),
(43, 10, 9, 35, -10, '2021-04-06', '20:28', 'axel', 'alexis'),
(44, 11, 10, 35, -10, '2021-04-06', '13:34', 'IéIé', 'axel');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(12) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(12) NOT NULL,
  `mmr` int(11) NOT NULL COMMENT 'valeur permettant le classement du joueur'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `mmr`) VALUES
(9, 'alexis', 'alexis@gmail.com', 'azerty', 530),
(10, 'axel', 'axel@hotmail.com', 'qsdfgh', 990),
(11, 'IéIé', 'Lemalian@gmail.com', 'mpol', 610),
(12, 'mika', 'mika@jaimejunia.com', 'kiuj', 460);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id_game`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `games`
--
ALTER TABLE `games`
  MODIFY `id_game` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;
--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
