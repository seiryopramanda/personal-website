"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "projects",
      [
        {
          title: "Personal Website Seiryo",
          start_date: "2024-01-01",
          end_date: "2024-01-20",
          duration: "19 Hari",
          description: "Ini merupakan sebuah project portofolio saya.",
          tech: ["fa-node-js", "fa-react"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
