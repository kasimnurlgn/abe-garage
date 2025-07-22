const db = require("../config/db.config");
const { hashPassword } = require("../utils/password");
const logger = require("../utils/logger");

const installService = {
  async initializeDatabase() {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Check if tables exist (schema.sql should already be applied, but verify key tables)
      const [tables] = await connection.query(
        `
        SELECT COUNT(*) AS count
        FROM information_schema.tables
        WHERE table_schema = ? AND table_name IN ('employee', 'employee_info', 'employee_pass', 'employee_role', 'company_roles', 'common_services')
      `,
        [process.env.DB_NAME]
      );
      if (tables[0].count < 6) {
        throw new Error(
          "Required tables are missing. Please apply schema.sql first."
        );
      }

      // Seed initial Admin user (idempotent: skip if email exists)
      const adminEmail = "admin@abesgarage.com";
      const [existingAdmin] = await connection.query(
        "SELECT employee_id FROM employee WHERE employee_email = ?",
        [adminEmail]
      );
      if (existingAdmin.length === 0) {
        const hashedPassword = await hashPassword("SecureAdminPass123!"); // Change in production
        const [employeeResult] = await connection.query(
          "INSERT INTO employee (employee_email, employee_active_status) VALUES (?, 1)",
          [adminEmail]
        );
        const employeeId = employeeResult.insertId;
        await connection.query(
          "INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES (?, ?, ?, ?)",
          [employeeId, "Admin", "User", "1234567890"]
        );
        await connection.query(
          "INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)",
          [employeeId, hashedPassword]
        );
        await connection.query(
          "INSERT INTO employee_role (employee_id, company_role_id) VALUES (?, ?)",
          [employeeId, 1] // 1 = Admin role from company_roles
        );
        logger.info(`Created initial Admin user: ${adminEmail}`);
      } else {
        logger.info(
          `Admin user ${adminEmail} already exists, skipping creation.`
        );
      }

      // Seed default services in common_services (idempotent: skip if service_name exists)
      const defaultServices = [
        {
          name: "Oil Change",
          description: "Standard oil change service",
          active_status: 1,
        },
        {
          name: "Tire Rotation",
          description: "Rotate tires for even wear",
          active_status: 1,
        },
        {
          name: "Brake Inspection",
          description: "Inspect and service brakes",
          active_status: 1,
        },
      ];
      for (const service of defaultServices) {
        const [existingService] = await connection.query(
          "SELECT service_id FROM common_services WHERE service_name = ?",
          [service.name]
        );
        if (existingService.length === 0) {
          await connection.query(
            "INSERT INTO common_services (service_name, service_description, service_active_status) VALUES (?, ?, ?)",
            [service.name, service.description, service.active_status]
          );
          logger.info(`Seeded service: ${service.name}`);
        } else {
          logger.info(
            `Service ${service.name} already exists, skipping creation.`
          );
        }
      }

      await connection.commit();
      logger.info("Database initialization and seeding completed.");
    } catch (err) {
      await connection.rollback();
      logger.error("Database initialization failed:", err);
      throw err;
    } finally {
      connection.release();
    }
  },
};

module.exports = installService;
