#!/bin/bash

ZIP_FILE="model.zip"
DEST_DIR="data-models/model/"

if [ ! -f "$ZIP_FILE" ]; then
    echo "[ERROR] ❌ : Failed to find the zip file: $ZIP_FILE"
    exit 1
fi

if [ ! -d "$DEST_DIR" ]; then
    mkdir -p "$DEST_DIR"
fi

unzip "$ZIP_FILE" -d "$DEST_DIR"

if [ $? -eq 0 ]; then
    echo "[INFO] 💡 : Unzipped the file successfully to $DEST_DIR"
else
    echo "[ERROR] ❌ : Failed to unzip the file."
    exit 1
fi