@echo off
SETLOCAL ENABLEDELAYEDEXPANSION

:: Pull the latest code
git pull

:: Checkout and merge stage branch
git checkout stage
git pull
git merge --no-ff develop

:: Run the production build
node --max_old_space_size=5120 ./node_modules/@angular/cli/bin/ng build  --build-optimizer --aot

:: Push changes
git push

:: Checkout develop branch
git checkout develop

:: Define the deployment directory
SET DIR=dist\stage
IF EXIST "%DIR%" (
    echo Deploying %DIR%...

    :: Secure copy files to remote server (requires SCP in Windows)
    scp -i %USERPROFILE%\.ssh\softmeet_rsa -r %DIR% root@web.iroms.in:/var/www/html/irtma/

    echo Deployed %DIR%...
) ELSE (
    echo Directory %DIR% does not exist, skipping deployment.
)

ENDLOCAL
