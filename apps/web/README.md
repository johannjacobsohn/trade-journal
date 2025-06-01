🔥🔬 LIT - Lab Inventory Tracker UI
================

This is a small project to display a list of lab devices. Data is fetched from a [backend service](../backend)


Getting started
===============

Run Docker
----------

    pnpm run docker-build
    pnpm run docker-run

The frontend will be available at `http://localhost:8081/` and expecting the backend on `http://localhost:8080/`

Alternatively, you can use [the docker-compose file](../docker-compose.yml) in the root of this project to start both the frontend and the backend.

Run locally
-----------

    pnpm install
    pnpm dev

The frontend will be available at `http://localhost:5173/`
