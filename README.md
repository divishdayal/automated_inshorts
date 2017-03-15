# automated_inshorts

This project was made for the course - Information Retrieval in my college by me and 3 of my colleagues.

The application shows the top trending news articles summarized to a concise content. The back-end monitors RSS feeds for the selected news websites(NDTV, Times of India, Hindustan Times and Rediff) and ranks the articles(by popularity in realtime) using twitter API(trends and tweets API). For twitter, we first get the top trends using trends API, then these trends are queried into the tweets API to get the tweets related to that trend/topic. These both are vectorized, cos similarity is calculated and the articles above a certain threshold are displayed on the web app.
The application has been coded in nodejs which is using python and js scripts with mongodb database. Run index.py and index.js from the terminal to launch the app.
For more info - check out the project report-'project_report.pdf'.
