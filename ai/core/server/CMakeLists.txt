cmake_minimum_required(VERSION 3.31)
project(Talkup)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

file(GLOB_RECURSE SOURCES "src/*.cpp")

include(FetchContent)
include_directories(inc)

# Fetch Crow
FetchContent_Declare(
  crow
  GIT_REPOSITORY https://github.com/CrowCpp/Crow.git
  GIT_TAG v1.0+1
)
FetchContent_MakeAvailable(crow)

# Fetch CPR (HTTP client)
FetchContent_Declare(
  cpr
  GIT_REPOSITORY https://github.com/libcpr/cpr.git
  GIT_TAG 1.11.2
)
FetchContent_MakeAvailable(cpr)

add_executable(talkup_ai_mic_server main.cpp)

target_link_libraries(talkup_ai_mic_server PRIVATE cpr::cpr)
target_include_directories(talkup_ai_mic_server PRIVATE ${crow_SOURCE_DIR}/include)

