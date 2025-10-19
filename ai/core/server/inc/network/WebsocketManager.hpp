/*
** Talkup Project, 2025
** TalkUp.AI
** File description:
** This file contains the declaration of the WebsocketManager class,
** which is responsible for managing WebSocket connections and communications.
*/

#pragma once

#include <nlohmann/json.hpp>
#include <crow.h>

namespace talkup_network {
    class WsManager {
        public:

            /**
             * @brief Construct a new WsManager object
             *
             */
            WsManager() = default;

            /**
             * @brief Destroy the WsManager object
             *
             */
            ~WsManager() = default;

            /**
             * @brief Manage the type of connection.
             * Based on the communication protocol, it will handle the type of connection.
             * (e.g., ping, stream_chunk, error...)
             *
             * @param j The JSON object containing the message data.
             * @param conn The WebSocket connection object.
             */
            void connection_type_manager(nlohmann::json &j, crow::websocket::connection& conn);

        protected:
        private:
    };
}
