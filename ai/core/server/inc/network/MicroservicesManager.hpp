/*
** Talkup Project, 2025
** TalkUp.AI
** File description:
** This file defines the MicroservicesManager class, which is responsible
** for managing microservices in the TalkUp.AI server.
*/

#pragma once

#include <nlohmann/json.hpp>
#include <string>
#include <unordered_map>
#include <iostream>
#include <fstream>

namespace talkup_network {
    class MicroservicesManager {
        public:
            /**
             * @brief Construct a new MicroservicesManager object
             *
             */
            MicroservicesManager() = default;

            /**
             * @brief Destroy the MicroservicesManager object
             *
             */
            ~MicroservicesManager() = default;

            /**
             * @brief Get the URL of a microservice by its name.
             * It's will allow the server to communicate with other microservices.
             *
             * @param service_name
             * @return std::string
             */
            static std::string get_microservice_url(const std::string &service_name);

            /**
             * @brief Load the microservices information from a JSON file.
             *
             * @param file_path
             */
            static void load_microservices_info(
                const std::string &file_path = "../../services.json");

            /**
             * @brief Get the list of services.
             *
             * @return std::unordered_map<std::string, std::string>
             */
            static std::unordered_map<std::string,
                std::unordered_map<std::string, std::string>> get_services_list();

        protected:
        private:
            static inline std::unordered_map<std::string,
                std::unordered_map<std::string, std::string>> __services_list;
    };
}
