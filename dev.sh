#!/bin/bash

# Run backend
(cd backend && npm run dev) &

# Run frontend
(cd frontend && npm run dev) &

# Wait for both to finish
wait
