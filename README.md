Raksha-Route is a proactive women’s safety navigation platform designed for real-world Indian conditions. Unlike traditional safety apps that only respond after a panic button is pressed, Raksha-Route focuses on preventing danger before it happens by guiding users through safer routes instead of simply faster ones.

Most existing women’s safety apps in India are reactive in nature. Help is triggered only after an incident occurs, there is no safety guidance during travel, and navigation systems prioritize speed over safety.

Raksha-Route changes this approach by introducing safety-first navigation. The platform calculates a Safety Score for routes by analyzing multiple real-world factors including streetlight density using satellite data and OpenStreetMap, proximity to nearby police stations, crowd density where busier streets are statistically safer, and historical crime data patterns. This allows users to choose routes that actively reduce risk rather than react to emergencies.

Raksha-Route includes an in-app AI assistant called Rakshak, powered by Google Gemini AI using the Gemini 2.5 Flash model. Rakshak understands natural language and provides real-time, context-aware safety guidance to users while navigating. It can answer safety-related questions, assist users during travel, and act as a supportive digital companion rather than a generic chatbot.

Rakshak AI is grounded with live Google Maps data, which allows it to show verified real-time locations of nearby police stations and hospitals instead of providing generic or assumed responses. This ensures that users receive accurate, location-specific, and reliable information during critical moments.

The backend infrastructure of Raksha-Route is built using Google Firebase. Firebase Authentication is used for secure login and signup, while Cloud Firestore stores user profiles and safety preferences in a secure cloud environment.

This repository is public for transparency and learning purposes. Therefore, all sensitive information such as Firebase configuration keys and Google Gemini API keys are securely hidden using environment variables. No private user data or credentials are exposed in this public repository, and proper precautions have been taken to ensure security and user safety.

Raksha-Route stands out because it focuses on proactive safety instead of reactive panic, is designed specifically for Indian streets and real-life scenarios, combines AI, mapping, and data intelligence with human empathy, and has the potential to scale across cities, campuses, and public transport systems.

Raksha-Route is not just an application, but a step toward making everyday travel safer by preventing harm before it happens.
