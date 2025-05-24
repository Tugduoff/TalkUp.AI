/*
** Talkup Project, 2025
** TalkUp.AI
** File description:
** main of the server
*/

#include <iostream>

#include <unistd.h>

/**
 * @brief Main function of the microservices manager server.
 *
 * @return true
 * @return false
 */
int main(void)
{
    while(1) {
        std::cout << "Microservices server is runing" << std::endl;
        sleep(5);
    }
    return EXIT_SUCCESS;
}
