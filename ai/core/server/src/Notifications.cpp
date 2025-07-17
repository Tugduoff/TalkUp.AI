/*
** Talkup Project, 2025
** TalkUp.AI
** File description:
** Implementation of the Notifications class
*/

#include "Notifications.hpp"

talkup_network::Notifications::Notifications()
{
    types[0] = {"INFO", "💡"};
    types[1] = {"WARNING", "⚠️"};
    types[2] = {"ERROR", "❗"};
    types[3] = {"SUCCESS", "✅"};
    types[4] = {"DEBUG", "🐞"};
    types[5] = {"Service", "📚"};
}

void talkup_network::Notifications::send_notification(const std::string &message)
{
    std::cout << message << std::endl;
}

void talkup_network::Notifications::send_start_notification(void)
{
    Notifications notif = Notifications();

    std::cout << "[SERVER] " + notif.types[0].second + " TalkUp.AI server started successfully!" << std::endl;
    auto services_list = talkup_network::MicroservicesManager::get_services_list();
    std::cout << "[SERVER] " + notif.types[0].second + " Microservices loaded: " << services_list.size() << std::endl;
    for (const auto &service : services_list) {
        std::cout << "[SERVICES] "+ notif.types[0].second + " Service: " << service.first << std::endl;
        for (const auto &info : service.second) {
            std::cout << "  " << info.first << ": " << info.second << std::endl;
        }
    }
}

std::string talkup_network::Notifications::get_notification_type_by_id(int id) const
{
    if (id < 0 || id >= static_cast<int>(types.size()))
        return "UNKNOWN";
    return types.at(id).first;
}

std::string talkup_network::Notifications::get_notification_emoji_by_id(int id) const
{
    if (id < 0 || id >= static_cast<int>(types.size()))
        return "❓";
    auto it = types.find(id);
    if (it != types.end())
        return it->second.second;
    return "❓";
}
