/*
** EPITECH PROJECT, 2025
** TalkUp.AI
** File description:
** ExceptionManager
*/

#include "ExceptionManager.hpp"

ExceptionManager::ExceptionManager()
{
}

ExceptionManager::~ExceptionManager()
{
}

const char *ExceptionManager::StartServerException::what() const noexcept
{
    return "Failed to start the server.";
}

const char *ExceptionManager::StopServerException::what() const noexcept
{
    return "Failed to stop the server.";
}

const char *ExceptionManager::ServerAlreadyRunningException::what() const noexcept
{
    return "The server is already running.";
}