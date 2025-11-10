/*
** Talkup Project, 2025
** TalkUp.AI
** File description:
** Implementation of the Router class
*/

#include <nlohmann/json.hpp>
#include <chrono>
#include <sstream>
#include <fstream>
#include <cstdlib>
#include <cctype>
#include <vector>

#include "WebsocketManager.hpp"
#include "ExceptionManager.hpp"
#include "Router.hpp"

std::string talkup_network::Router::get_env_key(void)
{
    std::ifstream f(".env");
    std::string line;
    std::string val;

    if (!f.is_open())
        return std::string();
    while (std::getline(f, line)) {
        bool allws = true;
        for (char c : line) if (!std::isspace((unsigned char)c)) { allws = false; break; }
        if (allws) continue;
        auto pos = line.find('=');
        if (pos != std::string::npos) val = line.substr(pos + 1);
        else {
            std::istringstream iss(line);
            std::vector<std::string> toks;
            std::string t;
            while (iss >> t) toks.push_back(t);
            if (!toks.empty()) val = toks.back();
        }
        auto tmp = [&](std::string &s){ while(!s.empty() && std::isspace((unsigned char)s.front()))
            s.erase(s.begin()); while(!s.empty() && std::isspace((unsigned char)s.back())) s.pop_back(); };
        tmp(val);
        if (!val.empty())
            return val;
    }
    return std::string();
}

void talkup_network::Router::set_routes_definitions(crow::SimpleApp& app)
{
    auto load_server_key = [&]() {
        Router router;
        return router.get_env_key();
    };

    CROW_ROUTE(app, "/")([](){
        return "Hello world";
    });
    CROW_ROUTE(app, "/process/initialization").methods("POST"_method)([&](const crow::request& req){
        try {
            static const std::string SERVER_KEY = load_server_key();
            if (req.body.empty()) {
                nlohmann::json err;
                err["type"] = "error";
                err["timestamp"] = std::chrono::duration_cast<std::chrono::seconds>(
                    std::chrono::system_clock::now().time_since_epoch()).count();
                err["data"] = { {"message", "empty request body"} };
                crow::response res(err.dump());
                res.set_header("Content-Type", "application/json");
                res.code = 400;
                return res;
            }
            auto j = nlohmann::json::parse(req.body);
            if (!j.contains("key") || !j.contains("type") || !j.contains("format")) {
                nlohmann::json err;
                err["type"] = "error";
                err["timestamp"] = std::chrono::duration_cast<std::chrono::seconds>(
                    std::chrono::system_clock::now().time_since_epoch()).count();
                err["data"] = { {"message", "missing required fields: key/type/format"} };
                crow::response res(err.dump());
                res.set_header("Content-Type", "application/json");
                res.code = 400;
                return res;
            }
            if (!SERVER_KEY.empty()) {
                try {
                    std::string provided = j["key"].get<std::string>();
                    if (provided != SERVER_KEY) {
                        nlohmann::json err;
                        err["type"] = "error";
                        err["timestamp"] = std::chrono::duration_cast<std::chrono::seconds>(std::chrono::system_clock::now().time_since_epoch()).count();
                        err["data"] = { {"message", "unauthorized: invalid key"} };
                        crow::response res(err.dump());
                        res.set_header("Content-Type", "application/json");
                        res.code = 401;
                        return res;
                    }
                } catch (...) {
                    nlohmann::json err;
                    err["type"] = "error";
                    err["timestamp"] = std::chrono::duration_cast<std::chrono::seconds>(std::chrono::system_clock::now().time_since_epoch()).count();
                    err["data"] = { {"message", "invalid key format"} };
                    crow::response res(err.dump());
                    res.set_header("Content-Type", "application/json");
                    res.code = 400;
                    return res;
                }
            } else {
                nlohmann::json err;
                err["type"] = "error";
                err["timestamp"] = std::chrono::duration_cast<std::chrono::seconds>(
                    std::chrono::system_clock::now().time_since_epoch()).count();
                err["data"] = { {"message", "server key not set"} };
                crow::response res(err.dump());
                res.set_header("Content-Type", "application/json");
                res.code = 500;
                return res;
            }
            if (j["type"].get<std::string>() != "initialization") {
                nlohmann::json err;
                err["type"] = "error";
                err["timestamp"] = std::chrono::duration_cast<std::chrono::seconds>(
                    std::chrono::system_clock::now().time_since_epoch()).count();
                err["data"] = { {"message", "invalid type for this endpoint"} };
                crow::response res(err.dump());
                res.set_header("Content-Type", "application/json");
                res.code = 400;
                return res;
            }
            nlohmann::json ok;
            ok["key"] = SERVER_KEY;
            ok["type"] = "initialization_response";
            ok["format"] = "text";
            ok["data"] = "ws://51.75.255.115:8088/ws";
            crow::response res(ok.dump());
            res.set_header("Content-Type", "application/json");
            res.code = 200;
            return res;
        } catch (const std::exception &e) {
            nlohmann::json err;
            err["type"] = "error";
            err["timestamp"] = std::chrono::duration_cast<std::chrono::seconds>(
                std::chrono::system_clock::now().time_since_epoch()).count();
            err["data"] = { {"message", std::string("invalid json: ") + e.what()} };
            crow::response res(err.dump());
            res.set_header("Content-Type", "application/json");
            res.code = 400;
            return res;
        }
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
