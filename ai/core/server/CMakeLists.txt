cmake_minimum_required(VERSION 3.31)
project(Talkup)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

file(GLOB_RECURSE SOURCES "src/*.cpp" "main.cpp")

include(FetchContent)
include_directories(${CMAKE_SOURCE_DIR}/inc)

# Fetch Crow
FetchContent_Declare(
  crow
  GIT_REPOSITORY https://github.com/CrowCpp/Crow.git
  GIT_TAG v1.0+1
)
set(CROW_BUILD_TESTS OFF CACHE BOOL "Disable Crow tests")
FetchContent_MakeAvailable(crow)

# Fetch CPR (HTTP client)
FetchContent_Declare(
  cpr
  GIT_REPOSITORY https://github.com/libcpr/cpr.git
  GIT_TAG 1.11.2
)
FetchContent_MakeAvailable(cpr)

add_executable(talkup_ai_mic_server ${SOURCES})

file(GLOB_RECURSE HEADER_FILES ${CMAKE_SOURCE_DIR}/inc/*.hpp)

foreach(HEADER_FILE ${HEADER_FILES})
    get_filename_component(HEADER_DIR ${HEADER_FILE} DIRECTORY)
    list(APPEND INCLUDE_DIRS ${HEADER_DIR})
endforeach()

list(REMOVE_DUPLICATES INCLUDE_DIRS)

target_link_libraries(talkup_ai_mic_server PRIVATE cpr::cpr)
target_include_directories(talkup_ai_mic_server PRIVATE ${crow_SOURCE_DIR}/include ${INCLUDE_DIRS})

