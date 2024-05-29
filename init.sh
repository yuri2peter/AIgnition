#!/bin/bash

npm ci --silent
cp src/example.env src/.env
npm start
