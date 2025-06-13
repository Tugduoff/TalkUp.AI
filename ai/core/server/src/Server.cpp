/*
** EPITECH PROJECT, 2025
** TalkUp.AI
** File description:
** Implementation of the Server class
*/

#include "Server.hpp"

talkup_network::Server::Server(const std::string &server_name,
    const std::string &server_version, int port) : __server_name(server_name),
    __server_version(server_version), __port(port)
{
    __console_notification = true;
    router = std::make_shared<talkup_network::Router>();
}

talkup_network::Server::~Server()
{
    if (__console_notification) {
        talkup_network::Notifications::send_notification(
            "[SERVER] 💡 TalkUp.AI server stopped successfully!");
    }
}

bool talkup_network::Server::start_server(crow::SimpleApp &app)
{
    try
    {
        if(is_running) {
            throw std::runtime_error("Server is already running.");
        }
        router->set_routes_definitions(app);
        talkup_network::MicroservicesManager::load_microservices_info(
            "services.json");
        if (__console_notification) {
            talkup_network::Notifications::send_start_notification();
        }
        is_running = true;
        app.port(__port).multithreaded().run();
    }
    catch (const std::exception &e)
    {
        std::cerr << "[ERROR] ❌ " << e.what() << std::endl;
        return false;
    }
    return true;
}

bool talkup_network::Server::stop_server(void)
{
    if (__console_notification) {
        talkup_network::Notifications::send_notification(
            "[SERVER] 💡 TalkUp.AI server is stopping...");
    }
    is_running = false;
    return true;
}

std::string talkup_network::Server::get_server_name(void) const
{
    return __server_name;
}

std::string talkup_network::Server::get_server_version(void) const
{
    return __server_version;
}

int talkup_network::Server::get_port_number(void) const
{
    return __port;
}

void talkup_network::Server::set_console_notification(const bool value)
{
    __console_notification = value;
    if (__console_notification) {
        talkup_network::Notifications::send_notification(
            "[SERVER] 💡 Console notifications enabled.");
    } else {
        talkup_network::Notifications::send_notification(
            "[SERVER] 💡 Console notifications disabled.");
    }
}