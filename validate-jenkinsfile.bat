@echo off

:: Set paths to secrets
set USERNAME_FILE=secrets\JenkinsUsername
set API_TOKEN_FILE=secrets\JenkinsApiToken

:: Read username and API token from files
set /p USERNAME=<%USERNAME_FILE%
set /p API_TOKEN=<%API_TOKEN_FILE%

:: Set Jenkins URL and Jenkinsfile path
set JENKINS_URL=http://localhost:8080/pipeline-model-converter/validate
set JENKINSFILE=jenkinsfile

:: Construct and execute the curl command
curl -X POST -u %USERNAME%:%API_TOKEN% ^
  -F "jenkinsfile=<%JENKINSFILE%" ^
  %JENKINS_URL%

pause
