#!/bin/bash

# install node and bower modules

(cd class-jam/src && npm install)

gbp buildpackage -S -us -uc --git-ignore-new

if [ $? -eq 0 ]; then
    echo "Build successful.";
fi
