/*
** Talkup Project, 2025
** TalkUp.AI
** File description:
** main of the server
*/

#include <iostream>
#include <Server.hpp>

/**
 * @brief Main function of the microservices manager server.
 *
 * @return true
 * @return false
 */
int main(void)
{
    crow::SimpleApp app;
    talkup_network::Server server("TalkUp.AI Server", "1.0.0", 8088);

    if(!server.is_running)
        server.start_server(std::ref(app));
    return EXIT_SUCCESS;
}
