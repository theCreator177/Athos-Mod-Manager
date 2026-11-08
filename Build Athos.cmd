@echo off
setlocal
cd /d "%~dp0"
if exist ".athos-tools\node_modules\.bin\pnpm.cmd" goto toolsReady
call npm install --prefix ".athos-tools" --no-save --no-package-lock --ignore-scripts pnpm@11.10.0
if errorlevel 1 exit /b 1
:toolsReady
set "PATH=%~dp0node_modules\node;%~dp0.athos-tools\node_modules\.bin;%~dp0node_modules\.bin;%PATH%"
set "HUSKY=0"
set "NX_DAEMON=false"
set "NX_TUI=false"
set "NX_PARALLEL=4"
set "CSC_IDENTITY_AUTO_DISCOVERY=false"
set "CSC_LINK="
set "WIN_CSC_LINK="
call pnpm install --frozen-lockfile
if errorlevel 1 exit /b 1
call pnpm run fork:test
if errorlevel 1 exit /b 1
call pnpm run verify
if errorlevel 1 exit /b 1
call pnpm run package:nosign
if errorlevel 1 exit /b 1
node scripts\verify-packaged-asar.mjs
if errorlevel 1 exit /b 1
echo Athos build and package checks passed. Open dist\win-unpacked\AthosModManager.exe.
exit /b 0
