/*
** Talkup Project, 2025
** TalkUp.AI
** File description:
** Implementation of the Router class
*/

#include <nlohmann/json.hpp>
#include <chrono>
#include <sstream>

#include "WebsocketManager.hpp"
#include "ExceptionManager.hpp"
#include "Router.hpp"

void talkup_network::Router::set_routes_definitions(crow::SimpleApp& app)
{
    CROW_ROUTE(app, "/")([](){
        return "Hello world";
    });

    CROW_ROUTE(app, "/ws").websocket()
    .onopen([](crow::websocket::connection& conn){
        std::ostringstream oss;
        oss << "[WS] Connection opened: " << (void*)&conn;
        std::cout << oss.str() << std::endl;
    })
    .onclose([](crow::websocket::connection& conn, const std::string& reason){
        std::ostringstream oss;
        oss << "[WS] Connection closed: " << (void*)&conn << " reason: " << reason;
        std::cout << oss.str() << std::endl;
    })
    .onmessage([](crow::websocket::connection& conn, const std::string& data, bool is_binary){
        try {
            if (is_binary) {
                return;
            }
            talkup_network::WsManager wsManager;
            auto j = nlohmann::json::parse(data);

            if (!j.contains("type")) {
                nlohmann::json err;
                err["type"] = "error";
                err["timestamp"] = std::chrono::duration_cast<std::chrono::seconds>(
                    std::chrono::system_clock::now().time_since_epoch()).count();
                err["data"] = { {"message", "missing type field"} };
                conn.send_text(err.dump());
                throw ExceptionManager::NetworkMissingTypeField();
                return;
            }
            wsManager.connection_type_manager(j, conn);
        } catch (const std::exception &e) {
            nlohmann::json err;
            err["type"] = "error";
            err["timestamp"] = std::chrono::duration_cast<std::chrono::seconds>(
                std::chrono::system_clock::now().time_since_epoch()).count();
            err["data"] = { {"message", std::string("invalid json: ") + e.what()} };
            conn.send_text(err.dump());
        }
    });
}
