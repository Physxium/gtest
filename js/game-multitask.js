const multitaskGame = (() => {

    /* ------------------------------
       Settings
    ------------------------------ */

    /*
        여기 숫자들만 바꾸면
        대부분의 난이도를 조절할 수 있다.
    */

    const ROUNDS = [

        {
            symbolCount: 3,
            memoryPoints: 15
        },

        {
            symbolCount: 4,
            memoryPoints: 20
        },

        {
            symbolCount: 5,
            memoryPoints: 25
        }

    ];


    const SYMBOLS = [
        "♠",
        "♥",
        "♦",
        "♣"
    ];


    /*
        라운드 타이밍
    */

    const ROUND_START_DELAY = 2000;

    const SYMBOL_SHOW_TIME = 300;

    const SYMBOL_GAP_TIME = 2700;


    /*
        문제 제한시간

    */

    const QUESTION_TIME = 10000;


    /*
        장애물 설정
    */

    const SPAWN_LANES = 4;

    const BASE_SPAWN_INTERVAL = 800;


    /*
        3초마다 장애물 속도, 간격 up
    */

    const DIFFICULTY_STEP_TIME = 3000;

    const SPEED_STEP = 0.1;

    const SPAWN_STEP = 0.1;


    /*
        플레이어는 빠르게 움직이고
        장애물 초기 속도는
        대략 절반 정도로 시작.
        
        단위는 화면 크기에 대한
        % / second.
    */

    const PLAYER_SPEED = 50;

    const BASE_OBSTACLE_SPEED = 70;


    /*
        4개 레인 각각 폭 25%.

    */

    const OBSTACLE_WIDTH = 14;

    const PLAYER_WIDTH = 12;


    /*
        아무 조작도 안 했을 때
        예상 회피율.

    */

    const NO_INPUT_AVOID_RATE = 0.8;


    /*
        문제 답변 후 피드백 시간
    */

    const ANSWER_FEEDBACK_TIME = 800;


    /* ------------------------------
       Runtime
    ------------------------------ */

    let stageElement = null;

    let statusElement = null;

    let playSound =
        () => { };

    let onFinish =
        () => { };


    let labels = {

        round:
            "ROUND",

        question:
            "Choose the sequence.",

        time:
            "TIME"

    };


    let gameRunning = false;

    let roundRunning = false;

    let questionRunning = false;


    let animationFrame = null;

    let questionFrame = null;


    let currentRound = 0;

    let roundStartTime = 0;

    let lastFrameTime = 0;

    let nextSpawnTime = 0;


    let currentSequence = [];

    let symbolCurrentlyShown =
        null;


    /*
        Player
    */

    let playerX =
        (
            100 -
            PLAYER_WIDTH
        )
        /
        2;


    /*
        0 = 아직 움직이지 않음
        1 = 오른쪽
        -1 = 왼쪽
    */

    let playerDirection = 0;


    /*
        Obstacles
    */

    let obstacles = [];

    let nextObstacleId = 1;


    /*
        Score
    */

    let memoryRawScore = 0;

    let correctRounds = 0;

    let obstacleHits = 0;

    let obstacleAvoided = 0;


    /* ------------------------------
       Helpers
    ------------------------------ */

    function randomInt(max) {

        return Math.floor(
            Math.random() * max
        );

    }


    function shuffle(array) {

        const copy =
            [...array];


        for (
            let i = copy.length - 1;
            i > 0;
            i--
        ) {

            const j =
                randomInt(
                    i + 1
                );


            [
                copy[i],
                copy[j]
            ]
                =
                [
                    copy[j],
                    copy[i]
                ];

        }


        return copy;

    }


    function arraysEqual(
        a,
        b
    ) {

        if (
            a.length !==
            b.length
        ) {
            return false;
        }


        return a.every(
            (
                value,
                index
            ) =>
                value ===
                b[index]
        );

    }


    function getRoundConfig() {

        return ROUNDS[
            currentRound
        ];

    }


    function getRoundDuration() {

        const config =
            getRoundConfig();


        return (
            ROUND_START_DELAY
            +
            config.symbolCount
            *
            (
                SYMBOL_SHOW_TIME
                +
                SYMBOL_GAP_TIME
            )
        );

    }


    function getDifficultyLevel(
        elapsed
    ) {

        return Math.floor(
            elapsed
            /
            DIFFICULTY_STEP_TIME
        );

    }


    function getObstacleSpeed(
        elapsed
    ) {

        const level =
            getDifficultyLevel(
                elapsed
            );


        return (
            BASE_OBSTACLE_SPEED
            *
            (
                1
                +
                level
                *
                SPEED_STEP
            )
        );

    }


    function getSpawnInterval(
        elapsed
    ) {

        const level =
            getDifficultyLevel(
                elapsed
            );


        const multiplier =
            Math.max(
                0.2,
                1
                -
                level
                *
                SPAWN_STEP
            );


        return (
            BASE_SPAWN_INTERVAL
            *
            multiplier
        );

    }


    /* ------------------------------
       Sequence
    ------------------------------ */

    function createSequence(
        length
    ) {

        const result = [];


        for (
            let i = 0;
            i < length;
            i++
        ) {

            let symbol;


            do {

                symbol =
                    SYMBOLS[
                    randomInt(
                        SYMBOLS.length
                    )
                    ];

            }
            while (
                i > 0
                &&
                symbol ===
                result[i - 1]
            );


            result.push(
                symbol
            );

        }


        return result;

    }


    /* ------------------------------
       Main Render
    ------------------------------ */

    function renderRound() {

        const config =
            getRoundConfig();


        stageElement.innerHTML = `
            <div
                class="multitask-wrap"
            >

                <div
                    class="multitask-hud"
                >

                    <span
                        id="multitaskRound"
                        class="multitask-round"
                    >
                        ${labels.round}
                        ${currentRound + 1}
                        /
                        ${ROUNDS.length}
                    </span>

                    <span
                        id="multitaskTimer"
                        class="multitask-timer"
                    >
                        ${(getRoundDuration() / 1000).toFixed(1)}s
                    </span>

                </div>


                <div
                    id="multitaskBody"
                    class="multitask-body"
                >

                    <div
                        id="multitaskField"
                        class="multitask-field"
                    >

                        <div
                            class="multitask-memory-zone"
                        >

                            <div
                                id="multitaskSymbol"
                                class="multitask-symbol"
                            ></div>

                        </div>


                        <div
                            id="multitaskDodgeZone"
                            class="multitask-dodge-zone"
                        >

                            <div
                                class="multitask-lanes"
                            >

                                <span></span>
                                <span></span>
                                <span></span>

                            </div>


                            <div
                                id="multitaskObstacleLayer"
                                class="multitask-obstacle-layer"
                            ></div>

                            <div class="multitask-direction-hint left">
                                ←
                            </div>

                            <div class="multitask-direction-hint right">
                                →
                            </div>

                            <div
                                id="multitaskPlayer"
                                class="multitask-player"
                            ></div>

                        </div>

                    </div>

                </div>

            </div>
        `;


        const field =
            stageElement.querySelector(
                "#multitaskField"
            );


        field.addEventListener(
            "pointerdown",
            handleControl
        );


        updatePlayerVisual();

    }


    /* ------------------------------
       Player Control
    ------------------------------ */

    function handleControl(event) {

        if (
            !roundRunning
            ||
            questionRunning
        ) {
            return;
        }


        event.preventDefault();


        const field =
            event.currentTarget;


        const rect =
            field.getBoundingClientRect();


        const clickX =
            event.clientX
            -
            rect.left;


        const half =
            rect.width / 2;


        playerDirection =
            clickX < half
                ? -1
                : 1;

    }


    function updatePlayer(
        deltaSeconds
    ) {

        if (
            playerDirection === 0
        ) {
            return;
        }


        playerX +=
            playerDirection
            *
            PLAYER_SPEED
            *
            deltaSeconds;


        const maxX =
            100 -
            PLAYER_WIDTH;


        playerX =
            Math.max(
                0,
                Math.min(
                    maxX,
                    playerX
                )
            );

    }


    function updatePlayerVisual() {

        const player =
            stageElement.querySelector(
                "#multitaskPlayer"
            );


        if (!player) {
            return;
        }


        player.style.left =
            `${playerX}%`;

    }


    /* ------------------------------
       Obstacles
    ------------------------------ */

    function spawnObstacle(
        elapsed
    ) {

        const lane =
            randomInt(
                SPAWN_LANES
            );


        const laneWidth =
            100
            /
            SPAWN_LANES;


        const laneCenter =
            (
                lane
                +
                0.5
            )
            *
            laneWidth;


        const x =
            laneCenter
            -
            OBSTACLE_WIDTH
            /
            2;


        const layer =
            stageElement.querySelector(
                "#multitaskObstacleLayer"
            );


        if (!layer) {
            return;
        }


        const element =
            document.createElement(
                "div"
            );


        element.className =
            "multitask-obstacle";


        element.style.left =
            `${x}%`;


        element.style.width =
            `${OBSTACLE_WIDTH}%`;


        layer.appendChild(
            element
        );


        obstacles.push({

            id:
                nextObstacleId++,

            x,

            y:
                -18,

            speed:
                getObstacleSpeed(
                    elapsed
                ),

            element

        });

    }


    function updateObstacles(
        deltaSeconds
    ) {

        const player =
            stageElement.querySelector(
                "#multitaskPlayer"
            );


        if (!player) {
            return;
        }


        const remaining = [];


        obstacles.forEach(
            obstacle => {

                obstacle.y +=
                    obstacle.speed
                    *
                    deltaSeconds;


                obstacle.element.style.top =
                    `${obstacle.y}%`;


                /*
                    충돌 판정
                */

                if (
                    isCollision(
                        player,
                        obstacle.element
                    )
                ) {

                    obstacleHits += 1;


                    playSound(
                        "wrong"
                    );


                    showPlayerHit();


                    obstacle.element.remove();


                    return;

                }


                /*
                    화면 아래로 통과하면
                    회피 성공
                */

                if (
                    obstacle.y >
                    105
                ) {

                    obstacleAvoided += 1;


                    obstacle.element.remove();


                    return;

                }


                remaining.push(
                    obstacle
                );

            }
        );


        obstacles =
            remaining;

    }


    function isCollision(
        playerElement,
        obstacleElement
    ) {

        const playerRect =
            playerElement
                .getBoundingClientRect();


        const obstacleRect =
            obstacleElement
                .getBoundingClientRect();


        return !(
            playerRect.right
            <
            obstacleRect.left
            ||
            playerRect.left
            >
            obstacleRect.right
            ||
            playerRect.bottom
            <
            obstacleRect.top
            ||
            playerRect.top
            >
            obstacleRect.bottom
        );

    }


    function showPlayerHit() {

        const player =
            stageElement.querySelector(
                "#multitaskPlayer"
            );


        if (!player) {
            return;
        }


        player.classList.remove(
            "hit"
        );


        void player.offsetWidth;


        player.classList.add(
            "hit"
        );


        setTimeout(
            () => {

                player.classList.remove(
                    "hit"
                );

            },
            260
        );

    }


    function clearObstacles() {

        obstacles.forEach(
            obstacle => {

                obstacle.element
                    ?.remove();

            }
        );


        obstacles = [];

    }


    /* ------------------------------
       Symbol Display
    ------------------------------ */

    function updateSymbol(
        elapsed
    ) {

        const symbolElement =
            stageElement.querySelector(
                "#multitaskSymbol"
            );


        if (!symbolElement) {
            return;
        }


        if (
            elapsed <
            ROUND_START_DELAY
        ) {

            setDisplayedSymbol(
                null
            );

            return;

        }


        const cycleTime =
            SYMBOL_SHOW_TIME
            +
            SYMBOL_GAP_TIME;


        const sequenceElapsed =
            elapsed
            -
            ROUND_START_DELAY;


        const index =
            Math.floor(
                sequenceElapsed
                /
                cycleTime
            );


        const insideCycle =
            sequenceElapsed
            %
            cycleTime;


        if (
            index >=
            currentSequence.length
        ) {

            setDisplayedSymbol(
                null
            );

            return;

        }


        if (
            insideCycle <
            SYMBOL_SHOW_TIME
        ) {

            setDisplayedSymbol(
                currentSequence[
                index
                ]
            );

        } else {

            setDisplayedSymbol(
                null
            );

        }

    }


    function setDisplayedSymbol(
        symbol
    ) {

        if (
            symbol ===
            symbolCurrentlyShown
        ) {
            return;
        }


        symbolCurrentlyShown =
            symbol;


        const element =
            stageElement.querySelector(
                "#multitaskSymbol"
            );


        if (!element) {
            return;
        }


        element.textContent =
            symbol || "";


        element.classList.toggle(
            "red",
            symbol === "♥"
            ||
            symbol === "♦"
        );


        element.classList.remove(
            "show"
        );


        if (symbol) {

            void element.offsetWidth;


            element.classList.add(
                "show"
            );

        }

    }


    /* ------------------------------
       Timer
    ------------------------------ */

    function updateRoundTimer(
        elapsed
    ) {

        const timer =
            stageElement.querySelector(
                "#multitaskTimer"
            );


        if (!timer) {
            return;
        }


        const remaining =
            Math.max(
                0,
                getRoundDuration()
                -
                elapsed
            );


        timer.textContent =
            `${(remaining / 1000).toFixed(1)}s`;

    }


    /* ------------------------------
       Round
    ------------------------------ */

    function startRound() {

        if (!gameRunning) {
            return;
        }


        roundRunning = true;

        questionRunning = false;


        playerX =
            (
                100 -
                PLAYER_WIDTH
            )
            /
            2;


        playerDirection = 0;


        obstacles = [];

        nextObstacleId = 1;


        symbolCurrentlyShown =
            null;


        currentSequence =
            createSequence(
                getRoundConfig()
                    .symbolCount
            );


        renderRound();


        roundStartTime =
            performance.now();


        lastFrameTime =
            roundStartTime;


        /*
            장애물은 라운드 시작과
            동시에 하나 생성.
        */

        nextSpawnTime =
            0;


        animationFrame =
            requestAnimationFrame(
                gameLoop
            );

    }


    function gameLoop(now) {

        if (
            !gameRunning
            ||
            !roundRunning
            ||
            questionRunning
        ) {
            return;
        }


        const elapsed =
            now -
            roundStartTime;


        const deltaSeconds =
            Math.min(
                0.05,
                (
                    now -
                    lastFrameTime
                )
                /
                1000
            );


        lastFrameTime =
            now;


        updatePlayer(
            deltaSeconds
        );


        updatePlayerVisual();


        /*
            현재 난이도에 맞춰
            장애물 생성.
        */

        if (
            elapsed >=
            nextSpawnTime
        ) {

            spawnObstacle(
                elapsed
            );


            nextSpawnTime =
                elapsed
                +
                getSpawnInterval(
                    elapsed
                );

        }


        updateObstacles(
            deltaSeconds
        );


        updateSymbol(
            elapsed
        );


        updateRoundTimer(
            elapsed
        );


        if (
            elapsed >=
            getRoundDuration()
        ) {

            finishRound();

            return;

        }


        animationFrame =
            requestAnimationFrame(
                gameLoop
            );

    }


    function finishRound() {

        roundRunning = false;


        if (
            animationFrame
        ) {

            cancelAnimationFrame(
                animationFrame
            );

        }


        clearObstacles();


        playerDirection = 0;


        showQuestionTransition();

    }

    function showQuestionTransition() {

        const body =
            stageElement.querySelector(
                "#multitaskBody"
            );


        body.innerHTML = `
        <div class="multitask-transition">
            READY
        </div>
    `;


        setTimeout(
            () => {

                showQuestion();

            },
            1200
        );

    }


    /* ------------------------------
       Question
    ------------------------------ */

    function createChoices() {

        const correct =
            [...currentSequence];


        const choices = [
            correct
        ];


        let attempts = 0;


        while (
            choices.length < 4
            &&
            attempts < 100
        ) {

            attempts += 1;


            const candidate =
                [...correct];


            const indexA =
                randomInt(
                    candidate.length
                );


            let indexB;


            do {

                indexB =
                    randomInt(
                        candidate.length
                    );

            }
            while (
                indexA ===
                indexB
            );


            [
                candidate[indexA],
                candidate[indexB]
            ]
                =
                [
                    candidate[indexB],
                    candidate[indexA]
                ];


            const duplicate =
                choices.some(
                    choice =>
                        arraysEqual(
                            choice,
                            candidate
                        )
                );


            if (
                !duplicate
                &&
                !arraysEqual(
                    correct,
                    candidate
                )
            ) {

                choices.push(
                    candidate
                );

            }

        }


        /*
            중복 문양 때문에 swap만으로
            네 보기를 못 만든 경우를 위한
            보조 생성.
        */

        while (
            choices.length < 4
        ) {

            const candidate =
                createSequence(
                    correct.length
                );


            const duplicate =
                choices.some(
                    choice =>
                        arraysEqual(
                            choice,
                            candidate
                        )
                );


            if (
                !duplicate
                &&
                !arraysEqual(
                    correct,
                    candidate
                )
            ) {

                choices.push(
                    candidate
                );

            }

        }


        return shuffle(
            choices
        );

    }


    function renderSequence(
        sequence
    ) {

        return sequence
            .map(
                symbol => {

                    const red =
                        symbol === "♥"
                        ||
                        symbol === "♦";


                    return `
                        <span
                            class="
                                multitask-choice-symbol
                                ${red ? "red" : ""}
                            "
                        >
                            ${symbol}
                        </span>
                    `;

                }
            )
            .join("");

    }


    function showQuestion() {

        questionRunning = true;


        const body =
            stageElement.querySelector(
                "#multitaskBody"
            );


        const timer =
            stageElement.querySelector(
                "#multitaskTimer"
            );


        const choices =
            createChoices();


        body.innerHTML = `
            <div
                class="multitask-question"
            >

                <div
                    class="multitask-question-title"
                >
                    ${labels.question}
                </div>


                <div
                    id="multitaskChoices"
                    class="multitask-choices"
                >

                    ${choices
                .map(
                    (
                        choice,
                        index
                    ) => `
                                <button
                                    class="multitask-choice"
                                    type="button"
                                    data-choice="${index}"
                                >
                                    ${renderSequence(
                        choice
                    )}
                                </button>
                            `
                )
                .join("")}

                </div>

            </div>
        `;


        body
            .querySelectorAll(
                ".multitask-choice"
            )
            .forEach(
                (
                    button,
                    index
                ) => {

                    button.addEventListener(
                        "click",
                        () => {

                            handleAnswer(
                                choices[index],
                                button
                            );

                        }
                    );

                }
            );


        const questionStart =
            performance.now();


        function updateQuestionTimer(
            now
        ) {

            if (
                !questionRunning
            ) {
                return;
            }


            const elapsed =
                now -
                questionStart;


            const remaining =
                Math.max(
                    0,
                    QUESTION_TIME
                    -
                    elapsed
                );


            if (timer) {

                timer.textContent =
                    `${(remaining / 1000).toFixed(1)}s`;

            }


            if (
                remaining <= 0
            ) {

                handleTimeout();

                return;

            }


            questionFrame =
                requestAnimationFrame(
                    updateQuestionTimer
                );

        }


        questionFrame =
            requestAnimationFrame(
                updateQuestionTimer
            );

    }


    function handleAnswer(
        selected,
        button
    ) {

        if (
            !questionRunning
        ) {
            return;
        }


        questionRunning = false;


        if (
            questionFrame
        ) {

            cancelAnimationFrame(
                questionFrame
            );

        }


        const correct =
            arraysEqual(
                selected,
                currentSequence
            );


        if (correct) {

            memoryRawScore +=
                getRoundConfig()
                    .memoryPoints;


            correctRounds += 1;


            playSound(
                "correct"
            );


            button.classList.add(
                "correct"
            );

        } else {

            playSound(
                "wrong"
            );


            button.classList.add(
                "wrong"
            );


            revealCorrectChoice();

        }


        disableQuestionButtons();


        setTimeout(
            advanceRound,
            ANSWER_FEEDBACK_TIME
        );

    }


    function handleTimeout() {

        if (
            !questionRunning
        ) {
            return;
        }


        questionRunning = false;


        playSound(
            "wrong"
        );


        revealCorrectChoice();


        disableQuestionButtons();


        setTimeout(
            advanceRound,
            ANSWER_FEEDBACK_TIME
        );

    }


    function revealCorrectChoice() {

        const buttons =
            stageElement
                .querySelectorAll(
                    ".multitask-choice"
                );


        buttons.forEach(
            button => {

                const symbols =
                    Array.from(
                        button.querySelectorAll(
                            ".multitask-choice-symbol"
                        )
                    )
                        .map(
                            element =>
                                element.textContent
                                    .trim()
                        );


                if (
                    arraysEqual(
                        symbols,
                        currentSequence
                    )
                ) {

                    button.classList.add(
                        "correct"
                    );

                }

            }
        );

    }


    function disableQuestionButtons() {

        stageElement
            .querySelectorAll(
                ".multitask-choice"
            )
            .forEach(
                button => {

                    button.disabled =
                        true;

                }
            );

    }


    /* ------------------------------
       Round Advance
    ------------------------------ */

    function advanceRound() {

        currentRound += 1;


        if (
            currentRound >=
            ROUNDS.length
        ) {

            finishGame();

            return;

        }


        startRound();

    }


    /* ------------------------------
       Score
    ------------------------------ */

    function calculateResult() {

        /*
            기억

            15 + 20 + 25 = 60 raw
            → 50점으로 변환
        */

        const memoryScore =
            (
                memoryRawScore
                /
                60
            )
            *
            50;


        /*
            회피

            무조작 회피율 = 0점
            100% 회피 = 50점
        */

        const totalResolved =
            obstacleHits
            +
            obstacleAvoided;


        const avoidRate =
            totalResolved > 0
                ?
                obstacleAvoided
                /
                totalResolved
                :
                0;


        const normalizedAvoidance =
            (
                avoidRate
                -
                NO_INPUT_AVOID_RATE
            )
            /
            (
                1
                -
                NO_INPUT_AVOID_RATE
            );


        const dodgeScore =
            Math.max(
                0,
                Math.min(
                    50,
                    normalizedAvoidance
                    *
                    50
                )
            );


        const score =
            Math.round(
                memoryScore
                +
                dodgeScore
            );


        return {

            score,

            memoryScore:
                Math.round(
                    memoryScore
                ),

            dodgeScore:
                Math.round(
                    dodgeScore
                ),

            memoryRawScore,

            correctRounds,

            totalRounds:
                ROUNDS.length,

            hits:
                obstacleHits,

            avoided:
                obstacleAvoided,

            totalObstacles:
                totalResolved,

            avoidRate:
                Math.round(
                    avoidRate
                    *
                    1000
                )
                /
                10

        };

    }


    /* ------------------------------
       Finish
    ------------------------------ */

    function finishGame() {

        gameRunning = false;

        roundRunning = false;

        questionRunning = false;


        if (
            animationFrame
        ) {

            cancelAnimationFrame(
                animationFrame
            );

        }


        if (
            questionFrame
        ) {

            cancelAnimationFrame(
                questionFrame
            );

        }


        clearObstacles();


        if (
            statusElement
        ) {

            statusElement.textContent =
                "";

        }


        onFinish(
            calculateResult()
        );

    }


    /* ------------------------------
       Start
    ------------------------------ */

    function start(options) {

        stageElement =
            options.stageElement;


        statusElement =
            options.statusElement;


        playSound =
            options.playSound
            ||
            (() => { });


        onFinish =
            options.onFinish
            ||
            (() => { });


        labels = {
            ...labels,
            ...(options.labels || {})
        };


        currentRound = 0;


        memoryRawScore = 0;

        correctRounds = 0;

        obstacleHits = 0;

        obstacleAvoided = 0;


        gameRunning = true;


        startRound();

    }


    /* ------------------------------
       Public
    ------------------------------ */

    return {
        start
    };

})();