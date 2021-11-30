# Realtime quiz with socket.io

`npm i inside client & server folders`
`You may need to tweak the cors policy in index.js and questionsAPI.js`
`new questions can be added inside of questions_part_1.json`

The goal was for me to play around with web sockets, learn about them, and then make this project. Instead i got carried away playing around and ended up making the project first time around. 
There are a few bugs, and some features i skipped, an is a mess. It includes many bad practices as i was learnings socket.io i was getting to certain features and thinking crap i need to go back to square one
to implement this, so it includes a lot of workarounds.

## The goal and how it works.

You have a host that creates the room, which will display the questions, and score.(tv, monitor)
Then each player connects to the room from there phone and enters a "lobby".
Once everyone is connected the host can choose some quiz options and start the quiz.
The quiz does not check and move onto the next question until everyone has answered. (i know this should be based on a timer, or at least have an option for it.) 
If the player is correct it adds there point and displays there new score on the host's screen.
At the end of the round/quiz a table is displayed with everyone's answers for every question and if they was right or wrong.

I have learnt alot from this project, and with a bit more research and learning i will be able to approach this project again with a better understanding, and will be able to build it better.