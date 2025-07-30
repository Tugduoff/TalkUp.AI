#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include <thread>
#include <chrono>
#include <crow.h>
#include "Server.hpp"


// Mock class for Server
class MockServer : public talkup_network::Server {
public:
    MockServer(const std::string &name, const std::string &version, int port)
        : talkup_network::Server(name, version, port) {}

    MOCK_METHOD(bool, start_server, (crow::SimpleApp &app), (override));
    MOCK_METHOD(std::string, get_name, (), (const));
    MOCK_METHOD(std::string, get_version, (), (const));
    MOCK_METHOD(int, get_port, (), (const));
};

// Test fixture for Server tests
class ServerTest : public ::testing::Test {
protected:
    void SetUp() override {
    }

    void TearDown() override {
    }
};

/**
 * @brief Test the initialization of the server.
 *
 */
TEST_F(ServerTest, ServerInitialization) {
    MockServer server("TalkUp.AI Server", "1.0.0", 8088);
    crow::SimpleApp app;

    EXPECT_CALL(server, get_name())
        .WillOnce(::testing::Return("TalkUp.AI Server"));

    EXPECT_CALL(server, get_version())
        .WillOnce(::testing::Return("1.0.0"));

    EXPECT_CALL(server, get_port())
        .WillOnce(::testing::Return(8088));

    EXPECT_CALL(server, start_server(::testing::Ref(app)))
        .Times(1);

    std::thread server_thread([&]() {
        server.start_server(app);
    });
    EXPECT_EQ(server.get_name(), "TalkUp.AI Server");
    EXPECT_EQ(server.get_version(), "1.0.0");
    EXPECT_EQ(server.get_port(), 8088);
    server_thread.join();
}