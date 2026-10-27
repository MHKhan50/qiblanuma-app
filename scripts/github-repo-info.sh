#!/bin/sh
# Sets the GitHub repository description, website and topics (needs the GitHub CLI, gh).
command -v gh >/dev/null || { echo "gh not installed: brew install gh && gh auth login"; exit 0; }
gh repo edit MHKhan50/qiblanuma-app \
  --description "Free Quran, prayer times and Qibla app (React Native, Expo). Recitation, voice commands in Urdu, Hanafi prayer times. No ads, no tracking." \
  --homepage "https://masmatixinnovations.co.uk" \
  --add-topic quran --add-topic islam --add-topic prayer-times --add-topic qibla --add-topic react-native \
  --add-topic expo --add-topic typescript --add-topic accessibility --add-topic urdu
