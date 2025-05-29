/*
** Talkup Project, 2025
** TalkUp.AI
** File description:
** This file defines the Notifications class, which is responsible
** for handling notifications in the TalkUp.AI server.
*/

#pragma once

#include <string>
#include <iostream>
#include "MicroservicesManager.hpp"

namespace talkup_network {
    class Notifications {
        public:

            /**
             * @brief Construct a new Notifications object
             *
             */
            Notifications() = default;

            /**
             * @brief Destroy the Notifications object
             *
             */
            ~Notifications() = default;

            /**
             * @brief Send output notification to the console.
             *
             * @param message
             */
            static void send_notification(const std::string &message);

            /**
             * @brief Send start notification to the console.
             * This will be called when the server starts.
             */
            static void send_start_notification(void);

        protected:
        private:
    };
}
