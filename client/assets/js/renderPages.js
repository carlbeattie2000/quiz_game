// this constructor is to create the room lobby menu
const buildRoom = `
    <div id="quiz_start_form_div">
        <div class="new-room">
            <form id="start-quiz-form">
                <label for="questionAmount">Question Amount</label>
                <select id="questionsAmount">
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="30">30</option>
                    <option value="40">40</option>
                    <option value="50">50</option>
                </select>
                <label for="questionDifficulty">Question Difficulty</label>
                <select id="questionDifficulty">
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="">Any</option>
                </select>
                <label for="questionsCategory">Question Category</label>
                <select id="questionsCategory">
                    <option value="general%20knowledge">General Knowledge</option>
                    <option value="computer%20science">Computer Science</option>
                    <option value="">Any</option>
                </select>
                <button class="btn-main" id="start_game">Start Quiz</button>
            </form>
        </div>
        <div class="new-room" id="quiz_lobby_players">
            <h4>Players Joined</h4>
            <ul id="quiz_lobby_list">
            </ul>
        </div>
    </div>
`

const buildRoomClient = `
<div id="quiz_start_form_div">
    <div class="new-room" id="quiz_lobby_players">
        <h4>Players Joined</h4>
        <ul id="quiz_lobby_list">
        </ul>

        <div class="waiting-for-host">
            <h3>Waiting for host!</h3>
            <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        </div>
    </div>
</div>
`

const buildHostQuizPage = `
    <div class="score_board" id="score_board">
        <div class="score_card">
            <div class="score_player_name">
                Player One
            </div>
            
            <div class="score_main">
                0
            </div>
        </div>
    </div>
`