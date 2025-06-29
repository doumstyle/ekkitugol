-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 19 mai 2025 à 18:27
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `ekkitugol`
--
CREATE DATABASE IF NOT EXISTS `ekkitugol` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `ekkitugol`;

-- --------------------------------------------------------

--
-- Structure de la table `doctrine_migration_versions`
--

CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Déchargement des données de la table `doctrine_migration_versions`
--

INSERT INTO `doctrine_migration_versions` (`version`, `executed_at`, `execution_time`) VALUES
('DoctrineMigrations\\Version20250508095404', '2025-05-08 11:54:13', 19),
('DoctrineMigrations\\Version20250508132551', '2025-05-08 15:26:00', 20),
('DoctrineMigrations\\Version20250508133451', '2025-05-08 15:35:00', 48),
('DoctrineMigrations\\Version20250518080657', '2025-05-18 10:07:23', 129),
('DoctrineMigrations\\Version20250518102513', '2025-05-18 12:25:22', 16),
('DoctrineMigrations\\Version20250519085309', '2025-05-19 10:53:21', 23);

-- --------------------------------------------------------

--
-- Structure de la table `leagues`
--

CREATE TABLE `leagues` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `leagues`
--

INSERT INTO `leagues` (`id`, `name`) VALUES
(1, 'Bronze'),
(2, 'Argent'),
(3, 'Or');

-- --------------------------------------------------------

--
-- Structure de la table `messenger_messages`
--

CREATE TABLE `messenger_messages` (
  `id` bigint(20) NOT NULL,
  `body` longtext NOT NULL,
  `headers` longtext NOT NULL,
  `queue_name` varchar(190) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `available_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `delivered_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `profile`
--

CREATE TABLE `profile` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `picture` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `birthdate` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `updated_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)',
  `score` int(11) DEFAULT NULL,
  `xp` int(11) DEFAULT NULL,
  `ranking` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `profile`
--

INSERT INTO `profile` (`id`, `user_id`, `picture`, `description`, `birthdate`, `created_at`, `updated_at`, `score`, `xp`, `ranking`) VALUES
(1, 7, 'ai-avatar-6828287284f7e.png', 'The Boss is here', '1983-09-06 00:00:00', '2025-05-07 16:10:46', NULL, 0, 70, 30),
(2, 9, '5cafad705475370f999b24e183387dbe52b0fd81.jpg', 'Hottest rapper these days', '1987-06-17 00:00:00', '2025-05-08 13:31:24', NULL, 0, 0, 30);

-- --------------------------------------------------------

--
-- Structure de la table `sounds`
--

CREATE TABLE `sounds` (
  `id` int(11) NOT NULL,
  `letter` varchar(255) NOT NULL,
  `example` varchar(255) NOT NULL,
  `audio` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `updated_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)',
  `translation` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `sounds`
--

INSERT INTO `sounds` (`id`, `letter`, `example`, `audio`, `created_at`, `updated_at`, `translation`) VALUES
(1, 'i', 'gassi', 'gassi.mp3', '2025-05-12 21:46:55', NULL, 'C\'est fini'),
(2, 'a', 'amde', 'amde.mp3', '2025-05-15 16:00:07', NULL, 'Danser'),
(3, 'e', 'enen', 'enen.mp3', '2025-05-15 16:06:23', NULL, 'Nous'),
(4, 'o', 'onon', 'onon.mp3', '2025-05-15 16:06:42', NULL, 'Vous'),
(5, 'u', 'uddu', 'uddu.mp3', '2025-05-15 16:07:06', NULL, 'Ferme (fermer)'),
(6, 'aa', 'aamde', 'aamde.mp3', '2025-05-15 16:08:53', NULL, 'Paresse'),
(7, 'ee', 'weendu', 'weendu.mp3', '2025-05-15 16:09:16', NULL, 'Lac'),
(8, 'ii', 'fiide', 'fiide.mp3', '2025-05-15 16:09:28', NULL, 'Frapper'),
(9, 'oo', 'hoorde', 'hoorde.mp3', '2025-05-15 16:09:42', NULL, 'Jeûner'),
(10, 'uu', 'huunde', 'huunde.mp3', '2025-05-15 16:10:10', NULL, 'Chose'),
(11, 'p', 'paɗɗe', 'paɗɗe.mp3', '2025-05-15 16:30:20', NULL, 'Chaussure'),
(12, 'b', 'baaba', 'baaba.mp3', '2025-05-15 16:32:38', NULL, 'Père, Papa'),
(13, 'ɓ', 'ɓeydude', 'ɓeydude.mp3', '2025-05-15 16:33:08', NULL, 'Augmenter'),
(14, 't', 'teew', 'teew.mp3', '2025-05-15 16:33:33', NULL, 'Viande'),
(15, 'd', 'debbo', 'debbo.mp3', '2025-05-15 16:33:47', NULL, 'Femme'),
(16, 'ɗ', 'ɗemŋgal', 'ɗemŋgal.mp3', '2025-05-15 16:34:21', NULL, 'Langue'),
(17, 'k', 'kammu', 'kammu.mp3', '2025-05-15 16:34:42', NULL, 'Ciel'),
(18, 'g', 'galle', 'galle.mp3', '2025-05-15 16:34:52', NULL, 'Maison'),
(19, 'm', 'maaro', 'maaro.mp3', '2025-05-15 16:35:11', NULL, 'Riz'),
(20, 'n', 'neene', 'neene.mp3', '2025-05-15 16:35:28', NULL, 'Mère, Maman'),
(21, 'nd', 'ndiyam', 'ndiyam.mp3', '2025-05-15 16:37:37', NULL, 'Eau'),
(22, 'nj', 'njaram', 'njaram.mp3', '2025-05-15 16:38:09', NULL, 'Boisson'),
(23, 'ŋ', 'ŋabbude', 'ŋabbude.mp3', '2025-05-15 16:38:48', NULL, 'Monter'),
(24, 'f', 'faamde', 'faamde.mp3', '2025-05-15 16:39:04', NULL, 'Comprendre'),
(25, 's', 'subaka', 'subaka.mp3', '2025-05-15 16:39:23', NULL, 'Matin'),
(26, 'l', 'laana', 'laana.mp3', '2025-05-15 16:39:43', NULL, 'Bateau'),
(27, 'c', 'caggal', 'caggal.mp3', '2025-05-15 16:39:54', NULL, 'Après, Derrière'),
(28, 'r', 'rawaandu', 'rawaandu.mp3', '2025-05-15 16:40:14', NULL, 'Chien'),
(29, 'h', 'haala', 'haala.mp3', '2025-05-15 16:40:24', NULL, 'Conversation'),
(30, 'j', 'jam', 'jam.mp3', '2025-05-15 16:40:38', NULL, 'Paix'),
(31, 'y', 'yeeso', 'yeeso.mp3', '2025-05-15 16:40:58', NULL, 'Devant, Visage, A l\'avant de'),
(32, 'w', 'wallude', 'wallude.mp3', '2025-05-15 16:41:10', NULL, 'Aider, Assister');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `league_id` int(11) NOT NULL,
  `firstname` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(180) NOT NULL,
  `roles` longtext NOT NULL COMMENT '(DC2Type:json)',
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `league_id`, `firstname`, `lastname`, `email`, `roles`, `password`) VALUES
(7, 1, 'Mamadou', 'Amadou', 'mamadou.ngatte13@gmail.com', '[\"ROLE_USER\",\"ROLE_ADMIN\"]', '$2y$13$phxgYS7DOYcd54Yl0jWle.yIf2YTAuBzj5ZU7mH.h04h.5qTQit.S'),
(9, 1, 'Kendrick', 'Lamar', 'kendrick.lamar@kdot.mail', '[\"ROLE_USER\"]', '$2y$13$TbPUtuGV9Xiv4G2sKoAVo.Xef5lbACjVMBRv58fvb1H2xuA.m6V2y');

-- --------------------------------------------------------

--
-- Structure de la table `user_sound_progress`
--

CREATE TABLE `user_sound_progress` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `sound_id` int(11) DEFAULT NULL,
  `progress` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user_sound_progress`
--

INSERT INTO `user_sound_progress` (`id`, `user_id`, `sound_id`, `progress`) VALUES
(1, 7, 1, 10),
(2, 7, 2, 20),
(3, 7, 3, 30),
(4, 7, 4, 50),
(5, 7, 5, 30),
(6, 7, 6, 10),
(7, 7, 7, 40),
(8, 7, 8, 20),
(9, 7, 9, 30),
(10, 7, 10, 30),
(11, 7, 11, 30),
(12, 7, 12, 30),
(13, 7, 13, 30),
(14, 7, 14, 40),
(15, 7, 15, 20),
(16, 7, 16, 10),
(17, 7, 17, 10),
(18, 7, 18, 20),
(19, 7, 19, 30),
(20, 7, 20, 30),
(21, 7, 21, 20),
(22, 7, 22, 30),
(23, 7, 23, 20),
(24, 7, 24, 10),
(25, 7, 25, 20),
(26, 7, 26, 20),
(27, 7, 27, 10),
(28, 7, 28, 10),
(29, 7, 29, 10),
(30, 7, 30, 20),
(31, 7, 31, 20),
(32, 7, 32, 10);

-- --------------------------------------------------------

--
-- Structure de la table `words`
--

CREATE TABLE `words` (
  `id` int(11) NOT NULL,
  `peul` varchar(255) NOT NULL,
  `french` varchar(255) NOT NULL,
  `audio` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `words`
--

INSERT INTO `words` (`id`, `peul`, `french`, `audio`) VALUES
(1, 'Mi', 'Je', NULL),
(2, 'A', 'Tu', NULL),
(3, 'O', 'Il, Elle', NULL),
(4, 'En', 'Nous (inclusif)', NULL),
(5, 'Min', 'Nous (exclusif)', NULL),
(6, 'On', 'Vous', NULL),
(7, 'Ɓe', 'Ils, Elles', NULL),
(8, 'Debbo', 'Femme', NULL),
(9, 'Rewɓe', 'Femmes', NULL),
(10, 'Gorko', 'Homme', NULL),
(11, 'Worɓe', 'Hommes', NULL),
(12, 'Mboomri', 'Fille', NULL),
(13, 'Boomi', 'Filles', NULL),
(14, 'Suka Gorko', 'Garçon', NULL),
(15, 'Sukaaɓe worɓe', 'Garçons', NULL),
(16, 'Cukalel', 'Enfant', NULL),
(17, 'Sukaaɓe', 'Enfants', NULL),
(18, 'Ɓesngu', 'Famille', NULL),
(19, 'Yumiraaɗo', 'Mère', NULL),
(20, 'Baabiraaɗo', 'Père', NULL),
(21, 'Jom suudu', 'Epouse', NULL),
(22, 'Jom Galle', 'Epoux', NULL),
(23, 'Mawniraaɗo debbo', 'Soeur ainée', NULL),
(24, 'Miñiraado debbo', 'Soeur cadette', NULL),
(25, 'Mawniraaɗo gorko', 'Frère ainé', NULL),
(26, 'Miñiraado gorko', 'Frère cadet', NULL),
(27, 'Subaka', 'Matin', NULL),
(28, 'Naange-hoore', 'Midi', NULL),
(29, 'Kikiiɗe', 'Après-midi', NULL),
(30, 'Jamma', 'Nuit', NULL),
(31, 'Kacitaari', 'Petit déjeuner', NULL),
(32, 'Bottaari', 'Déjeuner', NULL),
(33, 'Hiraande', 'Diner', NULL),
(34, 'Jam waali', 'Bonjour (matin)', NULL),
(35, 'Jam ñalli', 'Bonjour (après-midi)', NULL),
(36, 'Jam hiiri', 'Bonsoir', NULL),
(37, 'On ngoni e jam ?', 'Etes-vous en paix ?', NULL),
(38, 'Jam tan', 'Que la paix', NULL),
(39, 'No mbaɗɗaa ?', 'Comment allez-vous ?', NULL),
(40, 'Ko mawɗum', 'Je vais bien', NULL),
(41, 'No besngu maa waɗl ?', 'Comment va la famille ?', NULL),
(42, 'Eɓe e jam', 'Ils vont bien', NULL),
(43, 'No mbaɗɗaa e liggeey ?', 'Comment ça va au travail ?', NULL),
(44, 'No mbaɗɗaa e tampere ?', 'Comment ça va avec la fatigue ?', NULL),
(45, 'Ko mawɗum', 'Je vais bien', NULL),
(46, 'No Maryam waɗi ?', 'Comment va Mariam ?', NULL),
(47, 'Omo e jam', 'Elle va bien', NULL),
(48, 'No sukaaɓe maa mbaɗl ?', 'Comment vont tes enfants ?', NULL),
(49, 'Bismilla !', 'Bienvenue !', NULL),
(50, 'A Jaraama', 'Merci', NULL),
(51, 'Goo', 'Un', NULL),
(52, 'Ɗiɗi', 'Deux', NULL),
(53, 'Tati', 'Trois', NULL),
(54, 'Nayi', 'Quatre', NULL),
(55, 'Joyi', 'Cinq', NULL),
(56, 'Jeegom', 'Six', NULL),
(57, 'Jeeɗiɗi', 'Sept', NULL),
(58, 'Jeetati', 'Huit', NULL),
(59, 'Jeenayi', 'Neuf', NULL),
(60, 'Sappo', 'Dix', NULL),
(61, 'Sappo e goo', 'Onze', NULL),
(62, 'Sappo e ɗiɗi', 'Douze', NULL),
(63, 'Sappo e tati', 'Treize', NULL),
(64, 'Sappo e nayi', 'Quatorze', NULL),
(65, 'Sappo e joyi', 'Quinze', NULL),
(66, 'Sappo e jeegom', 'Seize', NULL),
(67, 'Sappo e jeeɗiɗi', 'Dix-sept', NULL),
(68, 'Sappo e jeetati', 'Dix-huit', NULL),
(69, 'Sappo e jeenayi', 'Dix-neuf', NULL),
(70, 'Noogaas', 'Vingt', NULL),
(71, 'Taabal', 'Table', NULL),
(72, 'Siis', 'Chaise', NULL),
(73, 'Damal', 'Porte', NULL),
(74, 'Falanteere', 'Fenêtre', NULL),
(75, 'Bindirgal', 'Stylo', NULL),
(76, 'Kiriyoŋ', 'Crayon', NULL),
(77, 'Kayee', 'Cahier', NULL),
(78, 'Deftere', 'Livre', NULL),
(79, 'Sakkoos', 'Sacoche', NULL),
(80, 'Keree', 'Craie', NULL),
(81, 'Tabloo', 'Tableau', NULL),
(82, 'Palaat', 'Assiette', NULL),
(83, 'Kuddu', 'Cuillière', NULL),
(84, 'Laɓi', 'Couteau', NULL),
(85, 'Pitirgal', 'Balai', NULL),
(86, 'Ndaɗudi', 'Lit', NULL),
(87, 'Mbajju', 'Couverture', NULL),
(88, 'Darap', 'Drap', NULL),
(89, 'Leeso', 'Matelas', NULL),
(90, 'Comci', 'Vêtements', NULL),
(91, 'Simis', 'Chemise', NULL),
(92, 'Tuuba', 'Pantalon', NULL),
(93, 'Paɗe', 'Chaussures', NULL),
(94, 'Welo', 'Vélo', NULL),
(95, 'Lone', 'Lunettes', NULL),
(96, 'Ndiyam', 'Eau', NULL),
(97, 'Ataaye', 'Thé', NULL),
(98, 'Kafe', 'Café', NULL),
(99, 'Kosam', 'Lait', NULL),
(100, 'Suukara', 'Sucre', NULL),
(101, 'Lamɗam', 'Sel', NULL),
(102, 'Maaro', 'Riz', NULL),
(103, 'Liɗi', 'Poisson', NULL),
(104, 'Teew', 'Viande', NULL),
(105, 'Ekkol', 'Ecole', NULL),
(106, 'Kalaas', 'Classe', NULL),
(107, 'Taarodde', 'Toilettes', NULL),
(108, 'Defnirde', 'Cuisine (pièce)', NULL),
(109, 'Galle', 'Maison', NULL),
(110, 'Suudu', 'Chambre', NULL),
(111, 'Tilliisa', 'Tente', NULL),
(112, 'Dispaaseer', 'Dispensaire', NULL),
(113, 'Jeere', 'Marché', NULL),
(114, 'Bitik', 'Boutique', NULL),
(115, 'Biro', 'Bureau', NULL),
(116, 'Maayo', 'Rivière', NULL),
(117, 'Woyndu', 'Puit', NULL),
(118, 'Sardiŋe', 'Jardin', NULL),
(119, 'Ngesa', 'Champ', NULL),
(120, 'Nokku liggorɗo', 'Lieu de travail', NULL),
(121, 'Jamaa', 'Mosquée', NULL),
(122, 'Baŋke', 'Banque', NULL),
(123, 'Gaaraas', 'Station de bus', NULL),
(124, 'Boowal laaɗe diwooje', 'Aéroport', NULL),
(125, 'Altine', 'Lundi', NULL),
(126, 'Talaata', 'Mardi', NULL),
(127, 'Alarba', 'Mercredi', NULL),
(128, 'Alkamisa', 'Jeudi', NULL),
(129, 'Aljumaa', 'Vendredi', NULL),
(130, 'Aset', 'Samedi', NULL),
(131, 'Alet', 'Dimanche', NULL),
(132, 'Ñalawma fof', 'Tous les jours', NULL),
(133, 'Subaka fof', 'Tous les matins', NULL),
(134, 'Kikiiɗe fof', 'Tous les après-midi', NULL),
(135, 'Jamma fof', 'Tous les soirs', NULL),
(136, 'Altine fof', 'Tous les lundis', NULL),
(137, 'Aljumaa fof', 'Tous les vendredis', NULL),
(138, 'Ñalawma', 'Jour', NULL),
(139, 'Yontere', 'Semaine', NULL),
(140, 'Lewru', 'Mois', NULL),
(141, 'Hitaande', 'Année', NULL),
(142, 'Yontere fof', 'Toutes les semaines', NULL),
(143, 'Lewru fof', 'Tous les mois', NULL),
(144, 'Hitaande fof', 'Tous les ans', NULL),
(145, 'Mbiyeteemi ko Kalidou', 'Je m\'appelle Kalidou', NULL),
(146, 'Yettoode am ko Sall', 'Mon nom de famille est Sall', NULL),
(147, 'Hol no mbiyeteɗaa ?', 'Quel est ton prénom ?', NULL),
(148, 'Hol yettoode maa ?', 'Quel est ton nom de famille ?', NULL),
(149, 'Njeyaami ko Moritani', 'Je viens de Mauritanie', NULL),
(150, 'Jom suudu am jeyaa ko Moritani', 'Ma femme viens de Mauritanie', NULL),
(151, 'Holto njeyeɗaa ?', 'D\'où venez-vous ?', NULL),
(152, 'Holto jom suudu maa jeyaa ?', 'D\'où viens votre femme ?', NULL),
(153, 'Holto o jeyaa ?', 'D\'où vient-il-elle ?', NULL),
(154, 'Innde makko ko Jean', 'Son prénom est Jean', NULL),
(155, 'Yettoode makko ko Dupont', 'Son nom de famille est Dupont', NULL),
(156, 'Jean jeyaaka Moritani. O jeyaa ko Amerik', 'Jean ne viens pas de Mauritanie. Il vient des Etats-Unis', NULL),
(157, 'Njeyeɗaa ko Amerik ?', 'Venez-vous des Etats-Unis ?', NULL),
(158, 'Alaa, mi jeyaaka Amerik', 'Non, je ne viens pas des Etats-Unis', NULL),
(159, 'Njeyeɗaa ko Moritani ?', 'Venez-vous de Mauritanie ?', NULL),
(160, 'Eey, njeyaami ko Moritani', 'Oui, je viens de Mauritanie', NULL),
(161, 'Ko mi jaŋnginoowo', 'Je suis un professeur', NULL),
(162, 'Jom suudu am wonaa jaŋnginoowo', 'Ma femme n\'est pas professeure', NULL),
(163, 'Jean ko wolonteer', 'Jean est un bénévole', NULL),
(164, 'Jom suudu makko wona wolonteer', 'Sa femme n\'est pas une bénévole', NULL),
(165, 'Jom suudu Jean ko doktoor', 'La femme de Jean est une docteure', NULL),
(166, 'Ngonen e jam !', 'Au revoir', NULL),
(167, 'Njiiden e jam !', 'A bientôt', NULL),
(168, 'Ñallen e jam', 'Passe une bonne journée', NULL),
(169, 'Mbaalen e jam', 'Passe une bonne nuit', NULL),
(170, 'Yo Alla rokku-en waalde e jam', 'Que Dieu nous accorde une bonne nuit', NULL),
(171, 'Yo jam ɓooy', 'Soit en paix', NULL),
(172, 'Aamin !', 'Amen !', NULL),
(173, 'Haa jaŋngo subaka', 'A demain matin', NULL),
(174, 'Haa kikiiɗe', 'A cette après-midi', NULL),
(175, 'Hedde naange-hoore', 'On se voit vers midi', NULL),
(176, 'Haa jamma', 'A ce soir', NULL),
(177, 'Haa jaŋngo', 'A demain', NULL),
(178, 'Ɗo e ɓooyde', 'A très bientôt', NULL),
(179, 'Ɗo e yeeso', 'A plus tard', NULL),
(180, 'Mi tampii', 'Je suis fatigué', NULL),
(181, 'Mi ŋoŋii', 'J\'ai sommeil', NULL),
(182, 'Mi heyɗi', 'J\'ai faim', NULL),
(183, 'Mi heyɗaani', 'Je n\'ai pas faim', NULL),
(184, 'Mi ɗomɗii', 'J\'ai soif', NULL),
(185, 'Mi ɗomɗaani', 'Je n\'ai pas soif', NULL),
(186, 'Ina wuli', 'Il fait chaud', NULL),
(187, 'Wulaani', 'Il ne fait pas chaud', NULL),
(188, 'Ina jaangi', 'Il fait froid', NULL),
(189, 'Jaangaani', 'Il ne fait pas froid', NULL),
(190, 'Yaafo-mi', 'Excusez-moi', NULL),
(191, 'A yaafaama', 'Vous êtes excusé', NULL),
(192, 'Holto paaɗa ?', 'Où allez-vous ?', NULL),
(193, 'Paa-mi ko galle', 'Je rentre à la maison', NULL),
(194, 'Jean nana yaha jeere', 'Jean va au marché', NULL),
(195, 'Omo na yaha jeere', 'Il va au marché', NULL),
(196, 'Mi yahaani biro', 'Je ne vais pas au bureau', NULL),
(197, 'Aɗa nana Pulaar ?', 'Est-ce que vous parler le Peul ?', NULL),
(198, 'Eey mbeɗe nana Pulaar seeɗa', 'Oui je parle un peu le Peul', NULL),
(199, 'Jean nanataa Pulaar', 'Jean ne parle pas le Peul', NULL),
(200, 'Mi yiɗa Farayse', 'Je n\'aime pas le Français', NULL),
(201, 'Mi yiɗaa kafe', 'Je n\'aime pas le café', NULL),
(202, 'Jennifer ina yiɗl Pulaar', 'Jennifer aime le Peul', NULL),
(203, 'Mbeɗe jaŋnga', 'J\'étudie', NULL),
(204, 'Mbeɗe ñaama', 'Je mange', NULL),
(205, 'Mbeɗe liggo', 'Je travaille', NULL),
(206, 'O jaŋngataa', 'Il n\'étudie pas', NULL),
(207, 'O ñaamataa', 'Il ne mange pas', NULL),
(208, 'Ɓe liggotaako', 'Ils ne travaillent pas', NULL),
(209, 'Mbeɗe ɗaano seeɗa', 'Je dors un peu', NULL),
(210, 'Mi liggotaako jooni', 'Je ne travaille pas actuellement', NULL),
(211, 'Mbeɗe yiɗl fooftaade', 'Je veux me reposer', NULL);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `doctrine_migration_versions`
--
ALTER TABLE `doctrine_migration_versions`
  ADD PRIMARY KEY (`version`);

--
-- Index pour la table `leagues`
--
ALTER TABLE `leagues`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `messenger_messages`
--
ALTER TABLE `messenger_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_75EA56E0FB7336F0` (`queue_name`),
  ADD KEY `IDX_75EA56E0E3BD61CE` (`available_at`),
  ADD KEY `IDX_75EA56E016BA31DB` (`delivered_at`);

--
-- Index pour la table `profile`
--
ALTER TABLE `profile`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_8157AA0FA76ED395` (`user_id`);

--
-- Index pour la table `sounds`
--
ALTER TABLE `sounds`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_IDENTIFIER_EMAIL` (`email`),
  ADD KEY `IDX_8D93D64958AFC4DE` (`league_id`);

--
-- Index pour la table `user_sound_progress`
--
ALTER TABLE `user_sound_progress`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_893C7333A76ED395` (`user_id`),
  ADD KEY `IDX_893C73336AAA5C3E` (`sound_id`);

--
-- Index pour la table `words`
--
ALTER TABLE `words`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `leagues`
--
ALTER TABLE `leagues`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `messenger_messages`
--
ALTER TABLE `messenger_messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `profile`
--
ALTER TABLE `profile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `sounds`
--
ALTER TABLE `sounds`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `user_sound_progress`
--
ALTER TABLE `user_sound_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT pour la table `words`
--
ALTER TABLE `words`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=212;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `profile`
--
ALTER TABLE `profile`
  ADD CONSTRAINT `FK_8157AA0FA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_8D93D64958AFC4DE` FOREIGN KEY (`league_id`) REFERENCES `leagues` (`id`);

--
-- Contraintes pour la table `user_sound_progress`
--
ALTER TABLE `user_sound_progress`
  ADD CONSTRAINT `FK_893C73336AAA5C3E` FOREIGN KEY (`sound_id`) REFERENCES `sounds` (`id`),
  ADD CONSTRAINT `FK_893C7333A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
