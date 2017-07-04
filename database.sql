-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Jun 08, 2017 at 12:54 PM
-- Server version: 5.6.21
-- PHP Version: 5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `quiz`
--

-- --------------------------------------------------------

--
-- Table structure for table `quiz_forms`
--

CREATE TABLE IF NOT EXISTS `quiz_forms` (
`id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `form_json` text NOT NULL,
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '1=Active,0=Inactive',
  `modified_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `quiz_forms`
--

INSERT INTO `quiz_forms` (`id`, `title`, `form_json`, `status`, `modified_at`, `created_at`) VALUES
(1, 'Quiz Name', '{\n  "name": "Quiz Name",\n  "description": "Quiz Description",\n  "pages": [\n    {\n      "id": "dcad69c0fafeec8296b7ab1b395631cb",\n      "number": 1,\n      "name": "Section 1",\n      "description": null,\n      "pageFlow": {\n        "nextPage": true,\n        "label": "mwForm.pageFlow.goToNextPage"\n      },\n      "elements": [\n        {\n          "id": "d18bba2d10a144975494a872af2147cc",\n          "orderNo": 1,\n          "type": "question",\n          "question": {\n            "id": "bde23dd95914b0a07d73c4bafced9e66",\n            "text": "Question 1",\n            "answer": "Option 3",\n            "type": "radio",\n            "required": false,\n            "offeredAnswers": [\n              {\n                "id": "331032e4c6e3755d81ac45d52be8f51f",\n                "orderNo": 1,\n                "value": "Option 1",\n                "pageFlow": {\n                  "nextPage": true,\n                  "label": "mwForm.pageFlow.goToNextPage"\n                }\n              },\n              {\n                "id": "f7a85f93fe745eb3630da3bd3783cc14",\n                "orderNo": 2,\n                "value": "Option 2",\n                "pageFlow": {\n                  "nextPage": true,\n                  "label": "mwForm.pageFlow.goToNextPage"\n                }\n              },\n              {\n                "id": "46fbcec59d376df616baeb545aa6260a",\n                "orderNo": 3,\n                "value": "Option 3",\n                "pageFlow": {\n                  "nextPage": true,\n                  "label": "mwForm.pageFlow.goToNextPage"\n                }\n              },\n              {\n                "id": "89727f303bbfb9ebdd45474087273645",\n                "orderNo": 4,\n                "value": "Option 4",\n                "pageFlow": {\n                  "nextPage": true,\n                  "label": "mwForm.pageFlow.goToNextPage"\n                }\n              }\n            ]\n          }\n        },\n        {\n          "id": "88b27339a6bc7cde4a6b084b303a003e",\n          "orderNo": 2,\n          "type": "question",\n          "question": {\n            "id": "29d7f1ef8825c7cf9c24ed0b96ef36af",\n            "text": "Question 2",\n            "answer": "Answer 2",\n            "type": "text",\n            "required": false,\n            "pageFlowModifier": false\n          }\n        }\n      ],\n      "namedPage": true\n    },\n    {\n      "id": "ce1877d452936f39f58a27f5ea3439ae",\n      "number": 2,\n      "name": "Section 2",\n      "description": null,\n      "pageFlow": {\n        "nextPage": true,\n        "label": "mwForm.pageFlow.goToNextPage"\n      },\n      "elements": [\n        {\n          "id": "1198a20c559939ad39f03a9fcf801f5d",\n          "orderNo": 1,\n          "type": "question",\n          "question": {\n            "id": "472bbb01d1c66ebe0b6fdbc459697dbe",\n            "text": "Question 3",\n            "answer": "Answer 3",\n            "type": "text",\n            "required": false,\n            "pageFlowModifier": false\n          }\n        }\n      ],\n      "namedPage": true\n    }\n  ],\n  "confirmationMessage": "System has evaluated your performance in the test & based on your performance prepared a detailed report for your reference"\n}', 1, '2017-06-08 10:17:08', '2017-06-08 10:17:08');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_form_sections`
--

CREATE TABLE IF NOT EXISTS `quiz_form_sections` (
`id` int(11) NOT NULL,
  `uid` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `number` int(11) NOT NULL,
  `form_id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `quiz_form_sections`
--

INSERT INTO `quiz_form_sections` (`id`, `uid`, `name`, `number`, `form_id`) VALUES
(1, 'dcad69c0fafeec8296b7ab1b395631cb', 'Section 1', 1, 1),
(2, 'ce1877d452936f39f58a27f5ea3439ae', 'Section 2', 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `quiz_form_section_questions`
--

CREATE TABLE IF NOT EXISTS `quiz_form_section_questions` (
`id` int(11) NOT NULL,
  `uid` varchar(255) NOT NULL,
  `text` varchar(500) NOT NULL,
  `answer` varchar(500) NOT NULL,
  `type` varchar(255) NOT NULL,
  `section_id` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `quiz_form_section_questions`
--

INSERT INTO `quiz_form_section_questions` (`id`, `uid`, `text`, `answer`, `type`, `section_id`) VALUES
(1, 'bde23dd95914b0a07d73c4bafced9e66', 'Question 1', 'Option 3', 'radio', 1),
(2, '29d7f1ef8825c7cf9c24ed0b96ef36af', 'Question 2', 'Answer 2', 'text', 1),
(3, '472bbb01d1c66ebe0b6fdbc459697dbe', 'Question 3', 'Answer 3', 'text', 2);

-- --------------------------------------------------------

--
-- Table structure for table `quiz_user_reponse`
--

CREATE TABLE IF NOT EXISTS `quiz_user_reponse` (
`id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `form_id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `quid` varchar(255) NOT NULL,
  `response` varchar(500) NOT NULL,
  `correct` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `quiz_user_reponse`
--

INSERT INTO `quiz_user_reponse` (`id`, `user_id`, `form_id`, `section_id`, `quid`, `response`, `correct`, `created_at`) VALUES
(1, 1, 1, 1, 'bde23dd95914b0a07d73c4bafced9e66', 'Option 3', 1, '2017-06-08 10:17:47'),
(2, 1, 1, 1, '29d7f1ef8825c7cf9c24ed0b96ef36af', 'Answer 2', 1, '2017-06-08 10:17:47'),
(3, 1, 1, 2, '472bbb01d1c66ebe0b6fdbc459697dbe', 'dfgsdfds', 0, '2017-06-08 10:17:47'),
(4, 1, 1, 1, 'bde23dd95914b0a07d73c4bafced9e66', 'Option 3', 1, '2017-06-08 10:53:20'),
(5, 1, 1, 1, '29d7f1ef8825c7cf9c24ed0b96ef36af', 'fdsfds', 0, '2017-06-08 10:53:20'),
(6, 1, 1, 2, '472bbb01d1c66ebe0b6fdbc459697dbe', 'dfsfds', 0, '2017-06-08 10:53:20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `quiz_forms`
--
ALTER TABLE `quiz_forms`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quiz_form_sections`
--
ALTER TABLE `quiz_form_sections`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quiz_form_section_questions`
--
ALTER TABLE `quiz_form_section_questions`
 ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quiz_user_reponse`
--
ALTER TABLE `quiz_user_reponse`
 ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `quiz_forms`
--
ALTER TABLE `quiz_forms`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `quiz_form_sections`
--
ALTER TABLE `quiz_form_sections`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `quiz_form_section_questions`
--
ALTER TABLE `quiz_form_section_questions`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `quiz_user_reponse`
--
ALTER TABLE `quiz_user_reponse`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=7;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
