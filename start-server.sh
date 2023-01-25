#! /bin/bash
 
if [ "$env" = "stage" ]; then
    echo "Running Stage Mode";
    yarn stage;
else
    echo "Running Production Mode";
    yarn production;
fi
