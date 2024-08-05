# Foodeventeny Web application

## Technologies:
Frontend: Vanilla JS
Backend: Express Node.JS
Database: MySQL
## Steps to run the application
- Update the DB credentials to match the your MySQL env

- To run `npm start` to start an HTTP server that runs on http://localhost:3004. 
- To run tests `npm test`

## SQL Schemas
```
CREATE TABLE `application_items` (
   `item_id` int NOT NULL AUTO_INCREMENT,
   `application_id` varchar(255) DEFAULT NULL,
   `item_name` varchar(255) DEFAULT NULL,
   `price` decimal(10,2) DEFAULT NULL,
   `quantity` int DEFAULT NULL,
   `total_price` decimal(10,2) DEFAULT NULL,
   PRIMARY KEY (`item_id`),
   KEY `indx_fk_application_id` (`application_id`),
   CONSTRAINT `indx_fk_application_id` FOREIGN KEY (`application_id`) REFERENCES `application_table` (`application_id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
 ```

 ```
CREATE TABLE `application_table` (
   `application_id` varchar(255) NOT NULL,
   `applicant_name` varchar(255) DEFAULT NULL,
   `description` text,
   `created_date` datetime DEFAULT NULL,
   `applicant_phone` varchar(50) DEFAULT NULL,
   `applicant_email` varchar(100) DEFAULT NULL,
   `status` varchar(100) DEFAULT NULL,
   `cuisine_type` varchar(255) DEFAULT NULL,
   `venue_location` varchar(255) DEFAULT NULL,
   `requester_comments` varchar(255) DEFAULT NULL,
   `total_price` decimal(10,2) DEFAULT '0.00',
   `allocated_location` varchar(255) DEFAULT NULL,
   PRIMARY KEY (`application_id`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
 ```

 ```
 CREATE TABLE `organizer_table` (
   `organizer_id` int NOT NULL AUTO_INCREMENT,
   `application_id` varchar(255) DEFAULT NULL,
   `organizer_comments` text,
   `allocated_location` varchar(255) DEFAULT NULL,
   `update_date` datetime DEFAULT NULL,
   PRIMARY KEY (`organizer_id`),
   KEY `fk_application_id` (`application_id`),
   CONSTRAINT `fk_application_id` FOREIGN KEY (`application_id`) REFERENCES `application_table` (`application_id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
 ```
