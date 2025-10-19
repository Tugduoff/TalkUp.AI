/*
** Talkup Project, 2025
** TalkUp.AI
** File description:
** Implementation of the WsManager class
*/

#include <nlohmann/json.hpp>
#include <chrono>
#include <sstream>

#include "ExceptionManager.hpp"
#include "WebsocketManager.hpp"

void talkup_network::WsManager::connection_type_manager(nlohmann::json &j, crow::websocket::connection &conn)
{
    try {
        std::string type = j["type"].get<std::string>();
        if (type == "ping") {
            nlohmann::json pong;
            pong["type"] = "pong";
            pong["timestamp"] = std::chrono::duration_cast<std::chrono::seconds>(
                std::chrono::system_clock::now().time_since_epoch()).count();
            if (j.contains("key")) pong["key"] = j["key"];
            if (j.contains("data")) pong["data"] = j["data"];
            conn.send_text(pong.dump());
            return;
        }
        // Additional connection types can be handled here
    } catch (const std::exception &e) {
        nlohmann::json err;
        err["type"] = "error";
        err["timestamp"] = std::chrono::duration_cast<std::chrono::seconds>(
            std::chrono::system_clock::now().time_since_epoch()).count();
        err["data"] = { {"message", e.what()} };
        conn.send_text(err.dump());
    }
}
