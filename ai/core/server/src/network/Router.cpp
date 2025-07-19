/*
** Talkup Project, 2025
** TalkUp.AI
** File description:
** Implementation of the Router class
*/

#include "Router.hpp"

void talkup_network::Router::set_routes_definitions(crow::SimpleApp& app)
{
    CROW_ROUTE(app, "/")([](){
        return "Hello world";
    });
}
