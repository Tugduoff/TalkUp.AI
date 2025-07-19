/*
** Talkup Project, 2025
** TalkUp.AI
** File description:
** Implementation of the MicroservicesManager class
*/

#include "MicroservicesManager.hpp"

std::string talkup_network::MicroservicesManager::get_microservice_url(
    const std::string &service_name)
{

    if (service_name == "example_service") {
        return "http://localhost:8080";
    }
    return "";
}

void talkup_network::MicroservicesManager::load_microservices_info(
    const std::string &file_path)
{
    try
    {
        std::ifstream file(file_path);
        nlohmann::json info;

        if (!file.is_open())
            throw std::ios_base::failure("Failed to open file: " + file_path);
        file >> info;
        for (auto &[k, lv] : info.items()) {
            for (auto &[lvk, value] : lv.items())
                __services_list[k][lvk] = value;
        }
        file.close();
    }
    catch(const std::exception& e)
    {
        std::cerr << e.what() << std::endl;
    }
}

const std::unordered_map<std::string, std::unordered_map<std::string, std::string>>&
    talkup_network::MicroservicesManager::get_services_list()
{
    return __services_list;
}
