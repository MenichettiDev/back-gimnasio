-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3307
-- Generation Time: Dec 29, 2024 at 12:16 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gimnasio`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_ejercicios`
--

CREATE TABLE `tb_ejercicios` (
  `id_ejercicio` int(11) NOT NULL,
  `id_grupo_muscular` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_grupos_musculares`
--

CREATE TABLE `tb_grupos_musculares` (
  `id_grupo_muscular` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_medidas`
--

CREATE TABLE `tb_medidas` (
  `id_medida` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `peso` decimal(5,2) DEFAULT NULL,
  `altura` decimal(5,2) DEFAULT NULL,
  `biceps` decimal(10,0) DEFAULT NULL,
  `pecho` decimal(10,0) DEFAULT NULL,
  `hombros` decimal(10,0) DEFAULT NULL,
  `cintura` decimal(10,0) DEFAULT NULL,
  `gluteos` decimal(10,0) DEFAULT NULL,
  `cuadriceps` decimal(10,0) DEFAULT NULL,
  `gemelos` decimal(10,0) DEFAULT NULL,
  `antebrazo` decimal(10,0) DEFAULT NULL,
  `cuello` decimal(10,0) DEFAULT NULL,
  `grasa_corporal` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_nivel_dificultad`
--

CREATE TABLE `tb_nivel_dificultad` (
  `id_nivel` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_objetivo`
--

CREATE TABLE `tb_objetivo` (
  `id_objetivo` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_perfiles`
--

CREATE TABLE `tb_perfiles` (
  `id_perfil` int(11) NOT NULL,
  `nombre` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_perfil_usuario`
--

CREATE TABLE `tb_perfil_usuario` (
  `id_usuario` int(11) NOT NULL,
  `id_perfil` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_rutina`
--

CREATE TABLE `tb_rutina` (
  `id_rutina` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_nivel` int(11) NOT NULL,
  `id_objetivo` int(11) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_rutina_grupo_muscular`
--

CREATE TABLE `tb_rutina_grupo_muscular` (
  `id_rutina` int(11) NOT NULL,
  `id_grupo_muscular` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_usuario`
--

CREATE TABLE `tb_usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(20) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `fecha_registro` datetime NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `activo` tinyint(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_ejercicios`
--
ALTER TABLE `tb_ejercicios`
  ADD PRIMARY KEY (`id_ejercicio`),
  ADD KEY `id_grupo_muscular` (`id_grupo_muscular`);

--
-- Indexes for table `tb_grupos_musculares`
--
ALTER TABLE `tb_grupos_musculares`
  ADD PRIMARY KEY (`id_grupo_muscular`);

--
-- Indexes for table `tb_medidas`
--
ALTER TABLE `tb_medidas`
  ADD PRIMARY KEY (`id_medida`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indexes for table `tb_nivel_dificultad`
--
ALTER TABLE `tb_nivel_dificultad`
  ADD PRIMARY KEY (`id_nivel`);

--
-- Indexes for table `tb_objetivo`
--
ALTER TABLE `tb_objetivo`
  ADD PRIMARY KEY (`id_objetivo`);

--
-- Indexes for table `tb_perfiles`
--
ALTER TABLE `tb_perfiles`
  ADD PRIMARY KEY (`id_perfil`);

--
-- Indexes for table `tb_perfil_usuario`
--
ALTER TABLE `tb_perfil_usuario`
  ADD PRIMARY KEY (`id_usuario`,`id_perfil`),
  ADD KEY `id_perfil` (`id_perfil`);

--
-- Indexes for table `tb_rutina`
--
ALTER TABLE `tb_rutina`
  ADD PRIMARY KEY (`id_rutina`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `id_nivel` (`id_nivel`),
  ADD KEY `id_objetivo` (`id_objetivo`);

--
-- Indexes for table `tb_rutina_grupo_muscular`
--
ALTER TABLE `tb_rutina_grupo_muscular`
  ADD PRIMARY KEY (`id_rutina`,`id_grupo_muscular`),
  ADD KEY `id_grupo_muscular` (`id_grupo_muscular`);

--
-- Indexes for table `tb_usuario`
--
ALTER TABLE `tb_usuario`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_ejercicios`
--
ALTER TABLE `tb_ejercicios`
  MODIFY `id_ejercicio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_grupos_musculares`
--
ALTER TABLE `tb_grupos_musculares`
  MODIFY `id_grupo_muscular` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_medidas`
--
ALTER TABLE `tb_medidas`
  MODIFY `id_medida` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_nivel_dificultad`
--
ALTER TABLE `tb_nivel_dificultad`
  MODIFY `id_nivel` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_objetivo`
--
ALTER TABLE `tb_objetivo`
  MODIFY `id_objetivo` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_perfiles`
--
ALTER TABLE `tb_perfiles`
  MODIFY `id_perfil` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_rutina`
--
ALTER TABLE `tb_rutina`
  MODIFY `id_rutina` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_usuario`
--
ALTER TABLE `tb_usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tb_ejercicios`
--
ALTER TABLE `tb_ejercicios`
  ADD CONSTRAINT `tb_ejercicios_ibfk_1` FOREIGN KEY (`id_grupo_muscular`) REFERENCES `tb_grupos_musculares` (`id_grupo_muscular`);

--
-- Constraints for table `tb_medidas`
--
ALTER TABLE `tb_medidas`
  ADD CONSTRAINT `tb_medidas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `tb_usuario` (`id_usuario`);

--
-- Constraints for table `tb_perfil_usuario`
--
ALTER TABLE `tb_perfil_usuario`
  ADD CONSTRAINT `tb_perfil_usuario_ibfk_1` FOREIGN KEY (`id_perfil`) REFERENCES `tb_perfiles` (`id_perfil`),
  ADD CONSTRAINT `tb_perfil_usuario_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `tb_usuario` (`id_usuario`);

--
-- Constraints for table `tb_rutina`
--
ALTER TABLE `tb_rutina`
  ADD CONSTRAINT `tb_rutina_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `tb_usuario` (`id_usuario`),
  ADD CONSTRAINT `tb_rutina_ibfk_2` FOREIGN KEY (`id_nivel`) REFERENCES `tb_nivel_dificultad` (`id_nivel`),
  ADD CONSTRAINT `tb_rutina_ibfk_3` FOREIGN KEY (`id_objetivo`) REFERENCES `tb_objetivo` (`id_objetivo`);

--
-- Constraints for table `tb_rutina_grupo_muscular`
--
ALTER TABLE `tb_rutina_grupo_muscular`
  ADD CONSTRAINT `tb_rutina_grupo_muscular_ibfk_1` FOREIGN KEY (`id_rutina`) REFERENCES `tb_rutina` (`id_rutina`),
  ADD CONSTRAINT `tb_rutina_grupo_muscular_ibfk_2` FOREIGN KEY (`id_grupo_muscular`) REFERENCES `tb_grupos_musculares` (`id_grupo_muscular`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
