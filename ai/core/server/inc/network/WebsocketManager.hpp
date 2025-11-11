/*
** Talkup Project, 2025
** TalkUp.AI
** File description:
** This file contains the declaration of the WebsocketManager class,
** which is responsible for managing WebSocket connections and communications.
*/

#pragma once

#include <string>
#include <cstdint>
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
            /**
             * @brief With the given parameters, it will set the respond JSON format and return it.
             *
             * @param type The type of the message.
             * @param key The key associated with the message.
             * @param stream_id The stream ID associated with the message.
             * @param format The format of the message.
             * @param timestamp The timestamp of the message.
             * @param data The data of the message.
             */
            nlohmann::json set_respond_json_format(const std::string& type, const std::string& key,
                const std::string& stream_id, const std::string& format, int64_t timestamp, const std::string& data) const;

        protected:
        private:
    };
}
