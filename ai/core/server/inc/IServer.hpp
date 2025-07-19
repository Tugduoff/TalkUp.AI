/*
** Talkup Project, 2025
** TalkUp.AI
** File description:
** This file defines the IServer class, which is an interface for the server.
*/


#pragma once

#include <string>
#include <iostream>
#include "Router.hpp"
#include "MicroservicesManager.hpp"
#include "Notifications.hpp"

class IServer {
    public:
        /**
         * @brief Construct a new IServer object
         *
         */
        IServer() = default;

        IServer(const std::string &server_name,
                const std::string &server_version, int port);

        /**
         * @brief Destroy the IServer object
         *
         */
        ~IServer() = default;

        /**
         * @brief Start the server on a specific port.
         *
         * @param port
         * @return true
         * @return false
         */
        virtual bool start_server(crow::SimpleApp &app) = 0;

        /**
         * @brief Stop the server.
         *
         * @return true
         * @return false
         */
        virtual bool stop_server(void) = 0;

        /**
         * @brief Get the server name.
         *
         * @return std::string
         */
        virtual std::string get_server_name(void) const = 0;

        /**
         * @brief Get the server version.
         *
         * @return std::string
         */
        virtual std::string get_server_version(void) const = 0;

        /**
         * @brief Get the port number.
         *
         * @return int
         */
        virtual int get_port_number(void) const = 0;

        /**
         * @brief Enable or disable console notifications.
         *
         * @param value
         */
        virtual void set_console_notification(const bool value) = 0;

    protected:
    private:
};
