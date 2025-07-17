/*
** EPITECH PROJECT, 2025
** TalkUp.AI
** File description:
** This file defines the ExceptionManager class, which is responsible
// for managing exceptions in the TalkUp.AI server.
*/

#pragma once

#include <exception>

class ExceptionManager {
    public:
        /**
         * @brief Construct a new Exception Manager object
         *
         */
        ExceptionManager() = default;

        /**
         * @brief Destroy the Exception Manager object
         *
         */
        ~ExceptionManager() = default;

        // Notifications Categories

        // Server Categories

        /**
         * @brief Exception thrown when if starting the server fails.
         *
         */
        class StartServerException : public std::exception {
            public:
                const char *what() const noexcept override;
        };

        /**
         * @brief Exception thrown when if stopping the server fails.
         *
         */
        class StopServerException : public std::exception {
            public:
                const char *what() const noexcept override;
        };

        /**
         * @brief Exception thrown when the server is already running.
         *
         */
        class ServerAlreadyRunningException : public std::exception {
            public:
                const char *what() const noexcept override;
        };

    protected:
    private:
};
