project(offstore)
cmake_minimum_required(VERSION 3.4.1)

set (PACKAGE_NAME "offstore")
set (BUILD_DIR ${CMAKE_SOURCE_DIR}/build)

set (CMAKE_VERBOSE_MAKEFILE ON)
set (CMAKE_CXX_STANDARD 17)

# Specifies a path to native header files.
include_directories(
  ../cpp
  ../includes
)

add_library(
  offstore
  SHARED
  ../cpp/react-native-offstore.cpp
  cpp-adapter.cpp
)

set_target_properties(
  offstore PROPERTIES
  CXX_STANDARD 17
  CXX_EXTENSIONS OFF
  POSITION_INDEPENDENT_CODE ON
)

find_package(fbjni REQUIRED CONFIG)
find_package(ReactAndroid REQUIRED CONFIG)
find_library(log-lib log)

add_library(fbjni ALIAS fbjni::fbjni)

target_link_libraries(
  offstore
  ${log-lib}
  fbjni
  ReactAndroid::jsi
  ReactAndroid::turbomodulejsijni
  ReactAndroid::fabricjni
  ReactAndroid::react_debug
  ReactAndroid::react_render_core
  ReactAndroid::react_nativemodule_core
  ReactAndroid::react_render_mounting
  ReactAndroid::react_render_scheduler
  ReactAndroid::react_render_uimanager
  ReactAndroid::rrc_view
  android
)
