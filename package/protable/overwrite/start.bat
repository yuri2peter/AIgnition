@echo off
rem start.bat

title App

set node_app_runtime_path=%cd%

cd %node_app_runtime_path%\node

call nodevars.bat

cd /d %node_app_runtime_path%\app\dist

node server/main.js

echo "Done."
pause