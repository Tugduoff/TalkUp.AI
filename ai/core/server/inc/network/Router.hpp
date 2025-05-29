/*
** Talkup Project, 2025
** TalkUp.AI
** File description:
** The Router class is used to handle routing of requests in the server.
** It is responsible for managing routes and handling requests based on those routes.
*/

#pragma once

#include <crow.h>

namespace talkup_network {
    class Router {
        public:

            /**
             * @brief Construct a new Router object
             *
             */
            Router() = default;

            /**
             * @brief Destroy the Router object
             *
             */
            ~Router() = default;

            /**
             * @brief Set the routes definitions for the application.
             * It should be called to initialize the routes
             *
             * @param app
             */
            void set_routes_definitions(crow::SimpleApp& app);

        protected:
        private:
    };
}
