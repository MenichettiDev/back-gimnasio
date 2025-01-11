-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3307
-- Generation Time: Jan 10, 2025 at 03:33 AM
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
-- Table structure for table `tb_asistencia`
--

CREATE TABLE `tb_asistencia` (
  `id_asistencia` int(11) NOT NULL,
  `id_atleta` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `asistio` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_atleta`
--

CREATE TABLE `tb_atleta` (
  `id_atleta` int(11) NOT NULL,
  `dni` char(8) NOT NULL,
  `id_entrenador` int(11) NOT NULL,
  `id_gimnasio` int(11) NOT NULL,
  `estado` enum('activo','inactivo') NOT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_ejercicios`
--

CREATE TABLE `tb_ejercicios` (
  `id_ejercicio` int(11) NOT NULL,
  `id_grupo_muscular` int(11) NOT NULL,
  `id_entrenador` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `img_1` varchar(200) NOT NULL,
  `img_2` varchar(200) NOT NULL,
  `img_3` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_entrenador`
--

CREATE TABLE `tb_entrenador` (
  `id_entrenador` int(11) NOT NULL,
  `dni` char(8) NOT NULL,
  `fecha_ingreso` date NOT NULL,
  `estado` enum('activo','inactivo') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_gimnasio`
--

CREATE TABLE `tb_gimnasio` (
  `id_gimnasio` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `correo_electronico` varchar(255) DEFAULT NULL,
  `horario_apertura` time DEFAULT NULL,
  `horario_cierre` time DEFAULT NULL,
  `estado` enum('activo','inactivo') DEFAULT 'activo',
  `descripcion` text DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
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
-- Table structure for table `tb_logros`
--

CREATE TABLE `tb_logros` (
  `id_logro` int(11) NOT NULL,
  `id_atleta` int(11) DEFAULT NULL,
  `nombre_logro` varchar(255) DEFAULT NULL,
  `descripcion_logro` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_membresia`
--

CREATE TABLE `tb_membresia` (
  `id_membresia` int(11) NOT NULL,
  `id_gimnasio` int(11) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `duracion` int(11) NOT NULL,
  `tipo` enum('mensual','anual','semanal','trimestral','') NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('activo','inactivo') DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_menu`
--

CREATE TABLE `tb_menu` (
  `id_menu` bigint(20) UNSIGNED NOT NULL,
  `menu_descripcion` varchar(50) NOT NULL,
  `menu_icono` varchar(30) DEFAULT NULL,
  `menu_link` varchar(100) DEFAULT NULL,
  `menu_grupo` varchar(10) DEFAULT NULL,
  `menu_principal` int(11) DEFAULT NULL,
  `menu_orden` int(11) DEFAULT NULL,
  `menu_estado` tinyint(1) NOT NULL DEFAULT 1,
  `tipo_ruta` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_menu_perfil`
--

CREATE TABLE `tb_menu_perfil` (
  `id_acceso` bigint(20) UNSIGNED NOT NULL,
  `id_menu` bigint(20) UNSIGNED NOT NULL,
  `id_perfil` bigint(20) UNSIGNED NOT NULL,
  `estado_acceso` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Table structure for table `tb_pago`
--

CREATE TABLE `tb_pago` (
  `id_pago` int(11) NOT NULL,
  `id_atleta` int(11) NOT NULL,
  `id_membresia` int(11) NOT NULL,
  `fecha_pago` datetime NOT NULL DEFAULT current_timestamp(),
  `monto` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_perfil`
--

CREATE TABLE `tb_perfil` (
  `id_perfil` bigint(20) UNSIGNED NOT NULL,
  `nombre_perfil` varchar(100) NOT NULL,
  `estado` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_persona`
--

CREATE TABLE `tb_persona` (
  `dni` varchar(20) NOT NULL,
  `id_acceso` int(11) DEFAULT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `apodo` varchar(30) DEFAULT NULL,
  `fecha_nacimiento` date NOT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `celular` varchar(15) DEFAULT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `foto_archivo` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_proceso`
--

CREATE TABLE `tb_proceso` (
  `id_proceso` int(11) NOT NULL,
  `id_atleta` int(11) NOT NULL,
  `fecha_medicion` date NOT NULL,
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
-- Table structure for table `tb_repeticion`
--

CREATE TABLE `tb_repeticion` (
  `id_repeticion` int(11) NOT NULL,
  `nombre` varchar(20) NOT NULL,
  `frecuencia` varchar(20) NOT NULL,
  `comentario` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_rutina`
--

CREATE TABLE `tb_rutina` (
  `id_rutina` int(11) NOT NULL,
  `id_entrenador` int(11) NOT NULL,
  `id_atleta` int(11) DEFAULT NULL,
  `nombre` varchar(50) NOT NULL,
  `cantidad_dias` enum('1','2','3','4','5','6','7') NOT NULL,
  `nivel_atleta` enum('Principiante','Intermedio','Avanzado','') NOT NULL,
  `objetivo` enum('Musculacion','Tonificacion','Resistencia','Peso','') NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tb_rutina_grupo_muscular`
--

CREATE TABLE `tb_rutina_grupo_muscular` (
  `id_rutina_grupo_muscular` int(11) NOT NULL,
  `id_rutina` int(11) NOT NULL,
  `id_grupo_muscular` int(11) NOT NULL,
  `id_ejercicio` int(11) NOT NULL,
  `id_repeticion` int(11) NOT NULL,
  `dia` enum('1','2','3','4','5','6','7') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_asistencia`
--
ALTER TABLE `tb_asistencia`
  ADD PRIMARY KEY (`id_asistencia`),
  ADD KEY `id_atleta` (`id_atleta`);

--
-- Indexes for table `tb_atleta`
--
ALTER TABLE `tb_atleta`
  ADD PRIMARY KEY (`id_atleta`),
  ADD KEY `fk_atleta_persona` (`dni`),
  ADD KEY `id_entrenador` (`id_entrenador`),
  ADD KEY `id_gimnasio` (`id_gimnasio`);

--
-- Indexes for table `tb_ejercicios`
--
ALTER TABLE `tb_ejercicios`
  ADD PRIMARY KEY (`id_ejercicio`),
  ADD KEY `id_grupo_muscular` (`id_grupo_muscular`),
  ADD KEY `id_entrenador` (`id_entrenador`);

--
-- Indexes for table `tb_entrenador`
--
ALTER TABLE `tb_entrenador`
  ADD PRIMARY KEY (`id_entrenador`),
  ADD KEY `fk_entrenador_persona` (`dni`);

--
-- Indexes for table `tb_gimnasio`
--
ALTER TABLE `tb_gimnasio`
  ADD PRIMARY KEY (`id_gimnasio`);

--
-- Indexes for table `tb_grupos_musculares`
--
ALTER TABLE `tb_grupos_musculares`
  ADD PRIMARY KEY (`id_grupo_muscular`);

--
-- Indexes for table `tb_logros`
--
ALTER TABLE `tb_logros`
  ADD PRIMARY KEY (`id_logro`),
  ADD KEY `id_atleta` (`id_atleta`);

--
-- Indexes for table `tb_membresia`
--
ALTER TABLE `tb_membresia`
  ADD PRIMARY KEY (`id_membresia`),
  ADD KEY `id_gimnasio` (`id_gimnasio`);

--
-- Indexes for table `tb_menu`
--
ALTER TABLE `tb_menu`
  ADD PRIMARY KEY (`id_menu`);

--
-- Indexes for table `tb_menu_perfil`
--
ALTER TABLE `tb_menu_perfil`
  ADD PRIMARY KEY (`id_acceso`),
  ADD KEY `id_menu` (`id_menu`),
  ADD KEY `id_perfil` (`id_perfil`);

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
-- Indexes for table `tb_pago`
--
ALTER TABLE `tb_pago`
  ADD PRIMARY KEY (`id_pago`),
  ADD KEY `fk_pago_atleta` (`id_atleta`),
  ADD KEY `id_membresia` (`id_membresia`);

--
-- Indexes for table `tb_perfil`
--
ALTER TABLE `tb_perfil`
  ADD PRIMARY KEY (`id_perfil`);

--
-- Indexes for table `tb_persona`
--
ALTER TABLE `tb_persona`
  ADD PRIMARY KEY (`dni`);

--
-- Indexes for table `tb_proceso`
--
ALTER TABLE `tb_proceso`
  ADD PRIMARY KEY (`id_proceso`),
  ADD KEY `id_atleta` (`id_atleta`);

--
-- Indexes for table `tb_repeticion`
--
ALTER TABLE `tb_repeticion`
  ADD PRIMARY KEY (`id_repeticion`);

--
-- Indexes for table `tb_rutina`
--
ALTER TABLE `tb_rutina`
  ADD PRIMARY KEY (`id_rutina`),
  ADD KEY `id_entrenador` (`id_entrenador`),
  ADD KEY `id_atleta` (`id_atleta`);

--
-- Indexes for table `tb_rutina_grupo_muscular`
--
ALTER TABLE `tb_rutina_grupo_muscular`
  ADD PRIMARY KEY (`id_rutina_grupo_muscular`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_asistencia`
--
ALTER TABLE `tb_asistencia`
  MODIFY `id_asistencia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_atleta`
--
ALTER TABLE `tb_atleta`
  MODIFY `id_atleta` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_ejercicios`
--
ALTER TABLE `tb_ejercicios`
  MODIFY `id_ejercicio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_entrenador`
--
ALTER TABLE `tb_entrenador`
  MODIFY `id_entrenador` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_gimnasio`
--
ALTER TABLE `tb_gimnasio`
  MODIFY `id_gimnasio` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_grupos_musculares`
--
ALTER TABLE `tb_grupos_musculares`
  MODIFY `id_grupo_muscular` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_logros`
--
ALTER TABLE `tb_logros`
  MODIFY `id_logro` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_membresia`
--
ALTER TABLE `tb_membresia`
  MODIFY `id_membresia` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_menu`
--
ALTER TABLE `tb_menu`
  MODIFY `id_menu` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_menu_perfil`
--
ALTER TABLE `tb_menu_perfil`
  MODIFY `id_acceso` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

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
-- AUTO_INCREMENT for table `tb_pago`
--
ALTER TABLE `tb_pago`
  MODIFY `id_pago` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_perfil`
--
ALTER TABLE `tb_perfil`
  MODIFY `id_perfil` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_proceso`
--
ALTER TABLE `tb_proceso`
  MODIFY `id_proceso` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_repeticion`
--
ALTER TABLE `tb_repeticion`
  MODIFY `id_repeticion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_rutina`
--
ALTER TABLE `tb_rutina`
  MODIFY `id_rutina` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_rutina_grupo_muscular`
--
ALTER TABLE `tb_rutina_grupo_muscular`
  MODIFY `id_rutina_grupo_muscular` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tb_asistencia`
--
ALTER TABLE `tb_asistencia`
  ADD CONSTRAINT `tb_asistencia_ibfk_1` FOREIGN KEY (`id_atleta`) REFERENCES `tb_atleta` (`id_atleta`);

--
-- Constraints for table `tb_atleta`
--
ALTER TABLE `tb_atleta`
  ADD CONSTRAINT `atleta_ibfk_1` FOREIGN KEY (`id_entrenador`) REFERENCES `tb_entrenador` (`id_entrenador`),
  ADD CONSTRAINT `fk_atleta_persona` FOREIGN KEY (`dni`) REFERENCES `tb_persona` (`dni`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tb_atleta_ibfk_1` FOREIGN KEY (`id_gimnasio`) REFERENCES `tb_gimnasio` (`id_gimnasio`);

--
-- Constraints for table `tb_ejercicios`
--
ALTER TABLE `tb_ejercicios`
  ADD CONSTRAINT `tb_ejercicios_ibfk_1` FOREIGN KEY (`id_grupo_muscular`) REFERENCES `tb_grupos_musculares` (`id_grupo_muscular`),
  ADD CONSTRAINT `tb_ejercicios_ibfk_2` FOREIGN KEY (`id_entrenador`) REFERENCES `tb_entrenador` (`id_entrenador`);

--
-- Constraints for table `tb_entrenador`
--
ALTER TABLE `tb_entrenador`
  ADD CONSTRAINT `fk_entrenador_persona` FOREIGN KEY (`dni`) REFERENCES `tb_persona` (`dni`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tb_logros`
--
ALTER TABLE `tb_logros`
  ADD CONSTRAINT `tb_logros_ibfk_1` FOREIGN KEY (`id_atleta`) REFERENCES `tb_atleta` (`id_atleta`) ON DELETE CASCADE;

--
-- Constraints for table `tb_membresia`
--
ALTER TABLE `tb_membresia`
  ADD CONSTRAINT `tb_membresia_ibfk_1` FOREIGN KEY (`id_gimnasio`) REFERENCES `tb_gimnasio` (`id_gimnasio`);

--
-- Constraints for table `tb_menu_perfil`
--
ALTER TABLE `tb_menu_perfil`
  ADD CONSTRAINT `tb_menu_perfil_ibfk_1` FOREIGN KEY (`id_menu`) REFERENCES `tb_menu` (`id_menu`),
  ADD CONSTRAINT `tb_menu_perfil_ibfk_2` FOREIGN KEY (`id_perfil`) REFERENCES `tb_perfil` (`id_perfil`);

--
-- Constraints for table `tb_pago`
--
ALTER TABLE `tb_pago`
  ADD CONSTRAINT `fk_pago_atleta` FOREIGN KEY (`id_atleta`) REFERENCES `tb_atleta` (`id_atleta`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tb_pago_ibfk_1` FOREIGN KEY (`id_membresia`) REFERENCES `tb_membresia` (`id_membresia`);

--
-- Constraints for table `tb_proceso`
--
ALTER TABLE `tb_proceso`
  ADD CONSTRAINT `tb_proceso_ibfk_1` FOREIGN KEY (`id_atleta`) REFERENCES `tb_atleta` (`id_atleta`);

--
-- Constraints for table `tb_rutina`
--
ALTER TABLE `tb_rutina`
  ADD CONSTRAINT `tb_rutina_ibfk_1` FOREIGN KEY (`id_entrenador`) REFERENCES `tb_entrenador` (`id_entrenador`),
  ADD CONSTRAINT `tb_rutina_ibfk_2` FOREIGN KEY (`id_atleta`) REFERENCES `tb_atleta` (`id_atleta`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
