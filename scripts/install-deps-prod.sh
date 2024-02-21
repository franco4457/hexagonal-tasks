#!/usr/bin/env bash

pnpm install --prod --frozen-lockfile

pnpm uninstall bcrypt
pnpm add bcrypt