#! /bin/bash
 
if [ "$env" = "stage" ]; then
    echo "Running Stage Mode";
    yarn stage;
else if [ "$env" = "production" ]; then
    echo "Running Production Mode";
    yarn production;
else 
    echo "Running Development Mode";
    yarn development;
fi
