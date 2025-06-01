/*
** Talkup Project, 2025
** TalkUp.AI
** File description:
** Implementation of the Notifications class
*/

#include "Notifications.hpp"

void talkup_network::Notifications::send_notification(const std::string &message)
{
    std::cout << message << std::endl;
}

void talkup_network::Notifications::send_start_notification(void)
{
    std::cout << "[SERVER] 💡 TalkUp.AI server started successfully!" << std::endl;
    auto services_list = talkup_network::MicroservicesManager::get_services_list();
    std::cout << "[SERVER] 💡 Microservices loaded: " << services_list.size() << std::endl;
    for (const auto &service : services_list) {
        std::cout << "[SERVICES] 📚 Service: " << service.first << std::endl;
        for (const auto &info : service.second) {
            std::cout << "  " << info.first << ": " << info.second << std::endl;
        }
    }

}
