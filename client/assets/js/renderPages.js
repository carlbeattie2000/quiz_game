// this constructor is to create the room lobby menu
const buildRoom = `
    <div class="hostMenu">
        <div class="quizMenuFormContainer">
            <form id="start-quiz-form">
                <label for="questionsAmount">Questions Amount</label>
                <select id="questionsAmount">
                    <option value="1">1</option>
                    <option value="10">10</option>
                    <option value="10">20</option>
                    <option value="10">30</option>
                    <option value="10">40</option>
                    <option value="10">50</option>
                </select>
                <label for="questionsCategory">Questions Category</label>
                <select id="questionsCategory">
                    <option value="general%20knowledge">General Knowledge</option>
                    <option value="computer%20science">Computer Science</option>
                    <option value="music">Music</option>
                    <option value="">Any</option>
                </select>
                <label for="questionDifficulty">Questions Difficulty</label>
                <select id="questionDifficulty">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="">Any</option>
                </select>
                <button class="btn" id="start-quiz-form">Start Quiz</button>
            </form>
        </div>
        <div class="player-lobby" id="quiz_lobby_players">
            <ul id="quiz_lobby_list">
            </ul>
            <span>Waiting for host...</span>
        </div>
    </div>
`

const buildRoomClient = `
    <div class="player-lobby">
        <ul id="quiz_lobby_list">
            
        </ul>
        <span>Waiting for host...</span>
    </div>
`

const buildHostQuizPage = `
    <div class="mainGameWindow" id="main-host-div">
        <div class="score_board" id="score_board">
        </div>

        <div class="question" id="question-div">
            
        </div>
    </div>
`

const buildClientQuizPage = `
    <div class="buttons" id="options_section">
        
    </div>
`

const buildHostLeaderboard = `
    <div class="end-table">
        <table class="styled-table" id="leaderboard-table">
            <thead>
                <tr>
                    <th>Question</th>
                    <th>Username</th>
                    <th>Answer</th>
                    <th>Result</th>
                </tr>
            </thead>
        </table>
    </div>

    <div class="end-game">
        <button id="end_game" class="btn">End Game</button>
    </div>
`