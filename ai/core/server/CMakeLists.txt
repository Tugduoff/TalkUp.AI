cmake_minimum_required(VERSION 3.14)
project(Talkup)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

set(BUILD_TESTING OFF CACHE BOOL "Disable tests")
set(CROW_BUILD_TESTS OFF CACHE BOOL "Disable Crow tests")
set(JSON_BuildTests OFF CACHE BOOL "Disable JSON tests")

include(FetchContent)

# Crow
FetchContent_Declare(
  crow
  GIT_REPOSITORY https://github.com/CrowCpp/Crow.git
  GIT_TAG v1.0+1
)
FetchContent_MakeAvailable(crow)

# CPR
FetchContent_Declare(
  cpr
  GIT_REPOSITORY https://github.com/libcpr/cpr.git
  GIT_TAG 1.11.2
)
FetchContent_MakeAvailable(cpr)

# JSON
set(JSON_BuildTests OFF CACHE INTERNAL "")
FetchContent_Declare(
  json
  GIT_REPOSITORY https://github.com/nlohmann/json.git
  GIT_TAG v3.11.3
)
FetchContent_MakeAvailable(json)

set(SOURCES
    src/network/Router.cpp
    src/network/MicroservicesManager.cpp
    main.cpp
)

include_directories(${CMAKE_SOURCE_DIR}/inc)

add_executable(talkup_ai_mic_server ${SOURCES})

file(GLOB_RECURSE HEADER_FILES "${CMAKE_SOURCE_DIR}/inc/*.hpp")

foreach(HEADER_FILE ${HEADER_FILES})
    get_filename_component(HEADER_DIR ${HEADER_FILE} DIRECTORY)
    list(APPEND INCLUDE_DIRS ${HEADER_DIR})
endforeach()
list(REMOVE_DUPLICATES INCLUDE_DIRS)

target_include_directories(talkup_ai_mic_server
    PRIVATE
        ${crow_SOURCE_DIR}/include
        ${INCLUDE_DIRS}
)

target_link_libraries(talkup_ai_mic_server
    PRIVATE
        cpr::cpr
        nlohmann_json::nlohmann_json
        pthread
)
