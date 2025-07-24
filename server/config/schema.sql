
-- Table 1: employee
CREATE TABLE IF NOT EXISTS `employee` (
  `employee_id` INT NOT NULL AUTO_INCREMENT,
  `employee_email` VARCHAR(255) NOT NULL,
  `employee_active_status` INT NOT NULL DEFAULT 1,
  `employee_added_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`employee_id`),
  UNIQUE (`employee_email`)
) ENGINE=InnoDB;

-- Table 2: employee_info
CREATE TABLE IF NOT EXISTS `employee_info` (
  `employee_info_id` INT NOT NULL AUTO_INCREMENT,
  `employee_id` INT NOT NULL,
  `employee_first_name` VARCHAR(255) NOT NULL,
  `employee_last_name` VARCHAR(255) NOT NULL,
  `employee_phone` VARCHAR(255),
  PRIMARY KEY (`employee_info_id`),
  FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table 3: employee_pass
CREATE TABLE IF NOT EXISTS `employee_pass` (
  `employee_pass_id` INT NOT NULL AUTO_INCREMENT,
  `employee_id` INT NOT NULL,
  `employee_password_hashed` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`employee_pass_id`),
  FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table 4: company_roles
CREATE TABLE IF NOT EXISTS `company_roles` (
  `company_role_id` INT NOT NULL AUTO_INCREMENT,
  `company_role_name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`company_role_id`)
) ENGINE=InnoDB;

-- Table 5: employee_role
CREATE TABLE IF NOT EXISTS `employee_role` (
  `employee_role_id` INT NOT NULL AUTO_INCREMENT,
  `employee_id` INT NOT NULL,
  `company_role_id` INT NOT NULL,
  PRIMARY KEY (`employee_role_id`),
  FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`) ON DELETE CASCADE,
  FOREIGN KEY (`company_role_id`) REFERENCES `company_roles` (`company_role_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table 6: customer_identifier
CREATE TABLE IF NOT EXISTS `customer_identifier` (
  `customer_id` INT NOT NULL AUTO_INCREMENT,
  `customer_email` VARCHAR(255) NOT NULL,
  `customer_phone_number` VARCHAR(255) NOT NULL,
  `customer_added_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `customer_hash` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`customer_id`),
  UNIQUE (`customer_email`),
  UNIQUE (`customer_phone_number`),
  UNIQUE (`customer_hash`)
) ENGINE=InnoDB;

-- Table 7: customer_info
CREATE TABLE IF NOT EXISTS `customer_info` (
  `customer_info_id` INT NOT NULL AUTO_INCREMENT,
  `customer_id` INT NOT NULL,
  `customer_first_name` VARCHAR(255) NOT NULL,
  `customer_last_name` VARCHAR(255) NOT NULL,
  `customer_active_status` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`customer_info_id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customer_identifier` (`customer_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table 8: customer_vehicle_info
CREATE TABLE IF NOT EXISTS `customer_vehicle_info` (
  `vehicle_id` INT NOT NULL AUTO_INCREMENT,
  `customer_id` INT NOT NULL,
  `vehicle_year` INT NOT NULL,
  `vehicle_make` VARCHAR(255) NOT NULL,
  `vehicle_model` VARCHAR(255) NOT NULL,
  `vehicle_type` VARCHAR(255) NOT NULL,
  `vehicle_mileage` INT NOT NULL,
  `vehicle_tag` VARCHAR(255) NOT NULL,
  `vehicle_serial_number` VARCHAR(255) NOT NULL,
  `vehicle_color` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`vehicle_id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customer_identifier` (`customer_id`) ON DELETE CASCADE,
  UNIQUE (`vehicle_tag`),
  UNIQUE (`vehicle_serial_number`)
) ENGINE=InnoDB;

-- Table 9: common_services
CREATE TABLE IF NOT EXISTS `common_services` (
  `service_id` INT NOT NULL AUTO_INCREMENT,
  `service_name` VARCHAR(255) NOT NULL,
   `service_price` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `service_description` VARCHAR(255) NOT NULL,
  `service_active_status` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`service_id`)
) ENGINE=InnoDB;

-- Table 10: orders
CREATE TABLE IF NOT EXISTS `orders` (
  `order_id` INT NOT NULL AUTO_INCREMENT,
  `customer_id` INT NOT NULL,
  `employee_id` INT NOT NULL,
  `order_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `order_hash` VARCHAR(255) NOT NULL,
  `order_status` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`order_id`),
  FOREIGN KEY (`customer_id`) REFERENCES `customer_identifier` (`customer_id`) ON DELETE CASCADE,
  FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employee_id`) ON DELETE CASCADE,
  UNIQUE (`order_hash`)
) ENGINE=InnoDB;

-- Table 11: order_info
CREATE TABLE IF NOT EXISTS `order_info` (
  `order_info_id` INT NOT NULL AUTO_INCREMENT,
  `order_id` INT NOT NULL,
  `order_total_price` INT NOT NULL,
  `order_estimated_completion_date` DATETIME NOT NULL,
  `order_completion_date` DATETIME,
  `order_additional_requests` VARCHAR(255),
  `order_additional_requests_completed` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`order_info_id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table 12: order_services
CREATE TABLE IF NOT EXISTS `order_services` (
  `order_service_id` INT NOT NULL AUTO_INCREMENT,
  `order_id` INT NOT NULL,
  `service_id` INT NOT NULL,
  `service_completed` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`order_service_id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  FOREIGN KEY (`service_id`) REFERENCES `common_services` (`service_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table 13: order_status
CREATE TABLE IF NOT EXISTS `order_status` (
  `order_status_id` INT NOT NULL AUTO_INCREMENT,
  `order_id` INT NOT NULL,
  `order_status` INT NOT NULL,
  PRIMARY KEY (`order_status_id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Insert initial data for company_roles
INSERT INTO `company_roles` (`company_role_id`, `company_role_name`) VALUES
(1, 'Admin'),
(2, 'Manager'),
(3, 'Employee');