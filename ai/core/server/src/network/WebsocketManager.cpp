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

        if (type == "stream_chunk") {
            if (j["format"] == "audio") {
                conn.send_text(set_respond_json_format("audio_received", j["key"], j["stream_id"],
                    "audio", j["timestamp"], j["data"]).dump());

                    //call async microservice network manager to handle audio stream chunk
            }
        }
    } catch (const std::exception &e) {
        nlohmann::json err;
        err["type"] = "error";
        err["timestamp"] = std::chrono::duration_cast<std::chrono::seconds>(
            std::chrono::system_clock::now().time_since_epoch()).count();
        err["data"] = { {"message", e.what()} };
        conn.send_text(err.dump());
    }
}

nlohmann::json talkup_network::WsManager::set_respond_json_format(const std::string& type, const std::string& key,
    const std::string& stream_id, const std::string& format, int64_t timestamp, const std::string& data) const
{
    nlohmann::json json;

    json["type"] = type;
    json["key"] = key;
    json["stream_id"] = stream_id;
    json["format"] = format;
    json["timestamp"] = timestamp;
    json["data"] = data;

    std::cout << "[WS] Respond JSON: " << json.dump() << std::endl;
    return json;
}