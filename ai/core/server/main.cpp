/*
** Talkup Project, 2025
** TalkUp.AI
** File description:
** main of the server
*/

#include <iostream>
#include "Router.hpp"
#include "MicroservicesManager.hpp"

/**
 * @brief Main function of the microservices manager server.
 *
 * @return true
 * @return false
 */
int main(void)
{
    crow::SimpleApp app;
    talkup_network::Router router;

    router.set_routes_definitions(app);
    talkup_network::MicroservicesManager::load_microservices_info(
        "services.json");

    app.port(8088).multithreaded().run();
    return EXIT_SUCCESS;
}
