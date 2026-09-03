const predictionGame = (() => {

    /* ------------------------------
       Settings
    ------------------------------ */

    const GRID_SIZE = 4;

    const TOTAL_ROUNDS = 10;

    const OBSERVE_TIME = 1300;
    const ANSWER_TIME = 4000;

    const FEEDBACK_TIME = 1500;

    const MAX_GENERATION_ATTEMPTS = 50000;


    /*
        actualReflections:
        실제 경로에서 만나는 반사판 수

        decoys:
        실제 경로에서 만나지 않는 미끼 반사판 수

        minPath:
        시작 칸을 포함한 최소 내부 경로 길이
    */

    const ROUND_SETTINGS = [

        {
            actualReflections: 1,
            decoys: 0,
            minPath: 4
        },

        {
            actualReflections: 1,
            decoys: 1,
            minPath: 5
        },

        {
            actualReflections: 2,
            decoys: 1,
            minPath: 6
        },

        {
            actualReflections: 2,
            decoys: 2,
            minPath: 7
        },

        {
            actualReflections: 3,
            decoys: 2,
            minPath: 8
        },

        {
            actualReflections: 3,
            decoys: 3,
            minPath: 9
        },

        {
            actualReflections: 4,
            decoys: 3,
            minPath: 10
        },

        {
            actualReflections: 4,
            decoys: 4,
            minPath: 11
        },

        {
            actualReflections: 5,
            decoys: 4,
            minPath: 12
        },

        {
            actualReflections: 5,
            decoys: 4,
            minPath: 13
        }

    ];


    /* ------------------------------
       Direction Rules
    ------------------------------ */

    const DIRECTIONS = {

        up: {
            row: -1,
            col: 0,
            arrow: "↑"
        },

        right: {
            row: 0,
            col: 1,
            arrow: "→"
        },

        down: {
            row: 1,
            col: 0,
            arrow: "↓"
        },

        left: {
            row: 0,
            col: -1,
            arrow: "←"
        }

    };


    const MIRROR_RULES = {

        "/": {
            up: "right",
            right: "up",
            down: "left",
            left: "down"
        },

        "\\": {
            up: "left",
            left: "up",
            down: "right",
            right: "down"
        }

    };


    /* ------------------------------
       Runtime
    ------------------------------ */

    let stageElement = null;
    let statusElement = null;

    let playSound = () => { };
    let onFinish = () => { };


    let labels = {

        round: "ROUND",
        memorize: "MEMORIZE",
        choose: "CHOOSE EXIT",
        correct: "CORRECT",
        wrong: "WRONG",
        timeout: "TIME OUT"

    };


    let gameRunning = false;

    let roundIndex = 0;

    let correctCount = 0;

    let roundResults = [];

    let puzzles = [];

    let currentPuzzle = null;


    let phase = "idle";

    let phaseEndTime = 0;

    let phaseTimer = null;

    let animationFrame = null;


    /* ------------------------------
       Helpers
    ------------------------------ */

    function randomInt(max) {

        return Math.floor(
            Math.random() * max
        );

    }


    function randomChoice(array) {

        return array[
            randomInt(
                array.length
            )
        ];

    }


    function shuffle(array) {

        const result =
            [...array];


        for (
            let i = result.length - 1;
            i > 0;
            i--
        ) {

            const j =
                randomInt(
                    i + 1
                );


            [
                result[i],
                result[j]
            ]
                =
                [
                    result[j],
                    result[i]
                ];

        }


        return result;

    }


    function cellKey(
        row,
        col
    ) {

        return `${row},${col}`;

    }


    function stateKey(
        row,
        col,
        direction
    ) {

        return `${row},${col},${direction}`;

    }


    function isInside(
        row,
        col
    ) {

        return (
            row >= 0
            &&
            row < GRID_SIZE
            &&
            col >= 0
            &&
            col < GRID_SIZE
        );

    }


    /* ------------------------------
       Exit Rules
    ------------------------------ */

    /*
        출구 번호

              A   B
           ┌─────────┐
        H  │         │  C
        G  │         │  D
           └─────────┘
              F   E
    */

    function getExit(
        row,
        col,
        direction
    ) {

        const half =
            GRID_SIZE / 2;


        if (
            direction === "up"
        ) {

            return (
                col < half
                    ? "A"
                    : "B"
            );

        }


        if (
            direction === "right"
        ) {

            return (
                row < half
                    ? "C"
                    : "D"
            );

        }


        if (
            direction === "down"
        ) {

            return (
                col < half
                    ? "F"
                    : "E"
            );

        }


        return (
            row < half
                ? "H"
                : "G"
        );

    }


    /* ------------------------------
       Simulation
    ------------------------------ */

    function simulatePuzzle({

        startRow,
        startCol,
        startDirection,
        mirrors

    }) {

        let row =
            startRow;

        let col =
            startCol;

        let direction =
            startDirection;


        const path = [
            {
                row,
                col
            }
        ];


        const visitedStates =
            new Set();


        visitedStates.add(
            stateKey(
                row,
                col,
                direction
            )
        );


        const usedMirrors =
            [];


        let reflectionCount = 0;


        /*
            4x4에서는 사실 훨씬 일찍 끝나지만
            안전장치로 충분히 크게 둔다.
        */

        for (
            let step = 0;
            step < 200;
            step++
        ) {

            const movement =
                DIRECTIONS[
                direction
                ];


            const nextRow =
                row
                +
                movement.row;


            const nextCol =
                col
                +
                movement.col;


            /*
                바깥으로 나가면
                현재 가장자리 칸 기준으로
                출구를 판정한다.
            */

            if (
                !isInside(
                    nextRow,
                    nextCol
                )
            ) {

                return {

                    valid: true,

                    loop: false,

                    path,

                    exit:
                        getExit(
                            row,
                            col,
                            direction
                        ),

                    exitDirection:
                        direction,

                    reflectionCount,

                    usedMirrors

                };

            }


            row =
                nextRow;

            col =
                nextCol;


            path.push({
                row,
                col
            });


            const key =
                cellKey(
                    row,
                    col
                );


            /*
                반사판이 있는 칸에
                진입하면 즉시 반사.
            */

            if (
                mirrors.has(
                    key
                )
            ) {

                reflectionCount += 1;

                usedMirrors.push(
                    key
                );


                const mirror =
                    mirrors.get(
                        key
                    );


                direction =
                    MIRROR_RULES[
                    mirror
                    ][
                    direction
                    ];

            }


            const state =
                stateKey(
                    row,
                    col,
                    direction
                );


            /*
                같은 칸 + 같은 방향이
                다시 등장하면 이후 경로도
                완전히 동일하므로 무한루프.
            */

            if (
                visitedStates.has(
                    state
                )
            ) {

                return {

                    valid: false,
                    loop: true,

                    path,

                    reflectionCount,

                    usedMirrors

                };

            }


            visitedStates.add(
                state
            );

        }


        return {

            valid: false,
            loop: true,

            path,

            reflectionCount,

            usedMirrors

        };

    }


    /* ------------------------------
       Puzzle Generation
    ------------------------------ */

    function getAllCells() {

        const cells = [];


        for (
            let row = 0;
            row < GRID_SIZE;
            row++
        ) {

            for (
                let col = 0;
                col < GRID_SIZE;
                col++
            ) {

                cells.push({
                    row,
                    col
                });

            }

        }


        return cells;

    }


    function generatePuzzle(
        settings
    ) {

        const allCells =
            getAllCells();


        const totalMirrors =
            settings.actualReflections
            +
            settings.decoys;


        for (
            let attempt = 0;
            attempt <
            MAX_GENERATION_ATTEMPTS;
            attempt++
        ) {

            const start =
                randomChoice(
                    allCells
                );


            const startDirection =
                randomChoice([
                    "up",
                    "right",
                    "down",
                    "left"
                ]);


            /*
                시작 칸에는
                반사판을 놓지 않는다.
            */

            const mirrorCandidates =
                allCells.filter(
                    cell =>
                        !(
                            cell.row ===
                            start.row
                            &&
                            cell.col ===
                            start.col
                        )
                );


            const chosenCells =
                shuffle(
                    mirrorCandidates
                )
                    .slice(
                        0,
                        totalMirrors
                    );


            const mirrors =
                new Map();


            chosenCells.forEach(
                cell => {

                    mirrors.set(

                        cellKey(
                            cell.row,
                            cell.col
                        ),

                        Math.random() < 0.5
                            ? "/"
                            : "\\"

                    );

                }
            );


            const simulation =
                simulatePuzzle({

                    startRow:
                        start.row,

                    startCol:
                        start.col,

                    startDirection,

                    mirrors

                });


            if (
                !simulation.valid
            ) {
                continue;
            }


            /*
                실제 반사 횟수가
                라운드 조건과 정확히 같아야 한다.
            */

            if (
                simulation.reflectionCount
                !==
                settings.actualReflections
            ) {
                continue;
            }


            /*
                동일 반사판을 여러 번 밟아서
                반사 횟수만 채우는 문제는 제외.

                즉 실제 반사판 N개를
                각각 한 번씩 사용해야 한다.
            */

            const uniqueUsedMirrors =
                new Set(
                    simulation.usedMirrors
                );


            if (
                uniqueUsedMirrors.size
                !==
                settings.actualReflections
            ) {
                continue;
            }


            /*
                최소 경로 길이.
            */

            if (
                simulation.path.length
                <
                settings.minPath
            ) {
                continue;
            }


            /*
                전체 반사판 중 실제 사용된 것을
                제외한 나머지가 정확히
                미끼 개수여야 한다.
            */

            let decoyCount = 0;


            mirrors.forEach(
                (
                    mirror,
                    key
                ) => {

                    if (
                        !uniqueUsedMirrors.has(
                            key
                        )
                    ) {

                        decoyCount += 1;

                    }

                }
            );


            if (
                decoyCount
                !==
                settings.decoys
            ) {
                continue;
            }


            return {

                startRow:
                    start.row,

                startCol:
                    start.col,

                startDirection,

                mirrors,

                path:
                    simulation.path,

                exit:
                    simulation.exit,

                exitDirection:
                    simulation.exitDirection,

                usedMirrors:
                    uniqueUsedMirrors,

                reflectionCount:
                    simulation.reflectionCount,

                pathLength:
                    simulation.path.length,

                settings

            };

        }


        return null;

    }


    function generateAllPuzzles() {

        const result = [];


        for (
            let i = 0;
            i < ROUND_SETTINGS.length;
            i++
        ) {

            let puzzle =
                generatePuzzle(
                    ROUND_SETTINGS[i]
                );


            /*
                매우 낮은 확률로 첫 5만 번에
                실패할 경우 한 번 더 시도.
            */

            if (!puzzle) {

                puzzle =
                    generatePuzzle(
                        ROUND_SETTINGS[i]
                    );

            }


            if (!puzzle) {

                return null;

            }


            result.push(
                puzzle
            );

        }


        return result;

    }


    /* ------------------------------
       Coordinate Helpers
    ------------------------------ */

    function getCellPosition(
        row,
        col
    ) {

        return {

            x:
                (
                    col + 0.5
                )
                /
                GRID_SIZE
                *
                100,

            y:
                (
                    row + 0.5
                )
                /
                GRID_SIZE
                *
                100

        };

    }


    function getExitPathPoint(
        puzzle
    ) {

        const last =
            puzzle.path[
            puzzle.path.length - 1
            ];


        const position =
            getCellPosition(
                last.row,
                last.col
            );


        if (
            puzzle.exitDirection === "up"
        ) {

            return {
                x: position.x,
                y: 0
            };

        }


        if (
            puzzle.exitDirection === "right"
        ) {

            return {
                x: 100,
                y: position.y
            };

        }


        if (
            puzzle.exitDirection === "down"
        ) {

            return {
                x: position.x,
                y: 100
            };

        }


        return {
            x: 0,
            y: position.y
        };

    }


    /* ------------------------------
       Render
    ------------------------------ */

    function renderRound() {

        currentPuzzle =
            puzzles[
            roundIndex
            ];


        const mirrorHTML = [];


        currentPuzzle
            .mirrors
            .forEach(
                (
                    mirror,
                    key
                ) => {

                    const [
                        row,
                        col
                    ] =
                        key
                            .split(",")
                            .map(Number);


                    const position =
                        getCellPosition(
                            row,
                            col
                        );


                    const mirrorClass =
                        mirror === "/"
                            ? "slash"
                            : "backslash";


                    mirrorHTML.push(`
                        <div
                            class="
                                prediction-mirror
                                ${mirrorClass}
                            "
                            style="
                                left: ${position.x}%;
                                top: ${position.y}%;
                            "
                        ></div>
                    `);

                }
            );


        const startPosition =
            getCellPosition(
                currentPuzzle.startRow,
                currentPuzzle.startCol
            );


        stageElement.innerHTML = `
            <div class="prediction-wrap">

                <div class="prediction-hud">

                    <span
                        id="predictionRound"
                        class="prediction-round"
                    >
                        ${labels.round}
                        ${roundIndex + 1}
                        /
                        ${TOTAL_ROUNDS}
                    </span>

                    <span
                        id="predictionTimer"
                        class="prediction-timer"
                    >
                        ${(OBSERVE_TIME / 1000).toFixed(1)}s
                    </span>

                </div>


                <div
                    id="predictionMessage"
                    class="prediction-message"
                >
                    ${labels.memorize}
                </div>


                <div class="prediction-board-shell">

                    ${renderExitButtons()}


                    <div
                        id="predictionBoard"
                        class="prediction-board"
                    >

                        <div
                            class="prediction-mirror-layer"
                        >
                            ${mirrorHTML.join("")}
                        </div>


                        <svg
                            id="predictionPath"
                            class="prediction-path"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            aria-hidden="true"
                        ></svg>


                        <div
                            class="
                                prediction-start
                                ${currentPuzzle.startDirection}
                            "
                            style="
                                left: ${startPosition.x}%;
                                top: ${startPosition.y}%;
                            "
                        >

                            <span
                                class="prediction-start-dot"
                            ></span>

                            <span
                                class="prediction-start-arrow"
                            >
                                ${DIRECTIONS[
                currentPuzzle
                    .startDirection
            ]
                .arrow
            }
                            </span>

                        </div>


                        <div
                            id="predictionBlackout"
                            class="prediction-blackout"
                        ></div>

                    </div>

                </div>


                <div
                    id="predictionFeedback"
                    class="prediction-feedback"
                ></div>

            </div>
        `;


        stageElement
            .querySelectorAll(
                ".prediction-exit"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        handleExitClick
                    );

                }
            );


        setExitButtonsEnabled(
            false
        );


        beginObservePhase();

    }


    function renderExitButtons() {

        const exits = [

            {
                id: "A",
                className: "exit-a"
            },

            {
                id: "B",
                className: "exit-b"
            },

            {
                id: "C",
                className: "exit-c"
            },

            {
                id: "D",
                className: "exit-d"
            },

            {
                id: "E",
                className: "exit-e"
            },

            {
                id: "F",
                className: "exit-f"
            },

            {
                id: "G",
                className: "exit-g"
            },

            {
                id: "H",
                className: "exit-h"
            }

        ];


        return exits
            .map(
                exit => `
                    <button
                        type="button"
                        class="
                            prediction-exit
                            ${exit.className}
                        "
                        data-exit="${exit.id}"
                        aria-label="Exit ${exit.id}"
                    >
                        ${exit.id}
                    </button>
                `
            )
            .join("");

    }


    /* ------------------------------
       Phase Control
    ------------------------------ */

    function beginObservePhase() {

        phase =
            "observe";


        const message =
            stageElement.querySelector(
                "#predictionMessage"
            );


        if (message) {

            message.textContent =
                labels.memorize;

        }


        const blackout =
            stageElement.querySelector(
                "#predictionBlackout"
            );


        blackout?.classList.remove(
            "active"
        );


        phaseEndTime =
            performance.now()
            +
            OBSERVE_TIME;


        startTimerAnimation();


        phaseTimer =
            setTimeout(
                beginAnswerPhase,
                OBSERVE_TIME
            );

    }


    function beginAnswerPhase() {

        if (
            !gameRunning
        ) {
            return;
        }


        clearPhaseTimerOnly();


        phase =
            "answer";


        const blackout =
            stageElement.querySelector(
                "#predictionBlackout"
            );


        blackout?.classList.add(
            "active"
        );


        const message =
            stageElement.querySelector(
                "#predictionMessage"
            );


        if (message) {

            message.textContent =
                labels.choose;

        }


        setExitButtonsEnabled(
            true
        );


        phaseEndTime =
            performance.now()
            +
            ANSWER_TIME;


        startTimerAnimation();


        phaseTimer =
            setTimeout(
                () => {

                    revealAnswer(
                        null,
                        true
                    );

                },
                ANSWER_TIME
            );

    }


    function handleExitClick(
        event
    ) {

        if (
            !gameRunning
            ||
            phase !== "answer"
        ) {
            return;
        }


        const selectedExit =
            event.currentTarget
                .dataset.exit;


        revealAnswer(
            selectedExit,
            false
        );

    }


    /* ------------------------------
       Answer Reveal
    ------------------------------ */

    function revealAnswer(
        selectedExit,
        timedOut
    ) {

        if (
            phase !== "answer"
        ) {
            return;
        }


        phase =
            "feedback";


        clearTimers();


        setExitButtonsEnabled(
            false
        );


        const blackout =
            stageElement.querySelector(
                "#predictionBlackout"
            );


        blackout?.classList.remove(
            "active"
        );


        const correct =
            selectedExit
            ===
            currentPuzzle.exit;


        if (
            correct
        ) {

            correctCount += 1;

            playSound(
                "correct"
            );

        } else {

            playSound(
                "wrong"
            );

        }


        roundResults.push({

            round:
                roundIndex + 1,

            correct,

            selectedExit,

            correctExit:
                currentPuzzle.exit,

            timedOut,

            reflections:
                currentPuzzle.reflectionCount,

            decoys:
                currentPuzzle.settings.decoys,

            pathLength:
                currentPuzzle.pathLength

        });


        showPath();

        highlightAnswer(
            selectedExit,
            currentPuzzle.exit
        );


        const message =
            stageElement.querySelector(
                "#predictionMessage"
            );


        if (message) {

            if (
                timedOut
            ) {

                message.textContent =
                    labels.timeout;

            } else if (
                correct
            ) {

                message.textContent =
                    labels.correct;

            } else {

                message.textContent =
                    labels.wrong;

            }

        }


        const feedback =
            stageElement.querySelector(
                "#predictionFeedback"
            );


        if (feedback) {

            feedback.textContent =
                correct
                    ? "✓"
                    : `→ ${currentPuzzle.exit}`;

            feedback.className =
                `
                    prediction-feedback
                    ${correct
                    ? "correct"
                    : "wrong"
                }
                `;

        }


        phaseTimer =
            setTimeout(
                nextRound,
                FEEDBACK_TIME
            );

    }


    function showPath() {

        const svg =
            stageElement.querySelector(
                "#predictionPath"
            );


        if (!svg) {
            return;
        }


        const points =
            currentPuzzle.path
                .map(
                    cell => {

                        const position =
                            getCellPosition(
                                cell.row,
                                cell.col
                            );


                        return (
                            `${position.x},${position.y}`
                        );

                    }
                );


        const exitPoint =
            getExitPathPoint(
                currentPuzzle
            );


        points.push(
            `${exitPoint.x},${exitPoint.y}`
        );


        svg.innerHTML = `
            <polyline
                class="prediction-path-line"
                points="${points.join(" ")}"
            ></polyline>
        `;

    }


    function highlightAnswer(
        selectedExit,
        correctExit
    ) {

        stageElement
            .querySelectorAll(
                ".prediction-exit"
            )
            .forEach(
                button => {

                    const exit =
                        button.dataset.exit;


                    if (
                        exit ===
                        correctExit
                    ) {

                        button.classList.add(
                            "correct"
                        );

                    }


                    if (
                        selectedExit
                        &&
                        exit ===
                        selectedExit
                        &&
                        selectedExit !==
                        correctExit
                    ) {

                        button.classList.add(
                            "wrong"
                        );

                    }

                }
            );

    }


    /* ------------------------------
       Timer
    ------------------------------ */

    function startTimerAnimation() {

        if (
            animationFrame
        ) {

            cancelAnimationFrame(
                animationFrame
            );

        }


        animationFrame =
            requestAnimationFrame(
                updateTimer
            );

    }


    function updateTimer(
        now
    ) {

        if (
            !gameRunning
        ) {
            return;
        }


        if (
            phase !== "observe"
            &&
            phase !== "answer"
        ) {
            return;
        }


        const timer =
            stageElement.querySelector(
                "#predictionTimer"
            );


        const remaining =
            Math.max(
                0,
                phaseEndTime - now
            );


        if (timer) {

            timer.textContent =
                `${(remaining / 1000).toFixed(1)}s`;

        }


        if (
            remaining > 0
        ) {

            animationFrame =
                requestAnimationFrame(
                    updateTimer
                );

        }

    }


    /* ------------------------------
       Exit Buttons
    ------------------------------ */

    function setExitButtonsEnabled(
        enabled
    ) {

        stageElement
            .querySelectorAll(
                ".prediction-exit"
            )
            .forEach(
                button => {

                    button.disabled =
                        !enabled;

                }
            );

    }


    /* ------------------------------
       Round / Finish
    ------------------------------ */

    function nextRound() {

        clearTimers();


        roundIndex += 1;


        if (
            roundIndex >=
            TOTAL_ROUNDS
        ) {

            finishGame();

            return;

        }


        renderRound();

    }


    function calculateScore() {

        function getWeight(
            reflections
        ) {

            return (
                1
                +
                (
                    reflections - 1
                )
                *
                0.2
            );

        }


        const totalWeight =
            ROUND_SETTINGS.reduce(
                (
                    sum,
                    settings
                ) => {

                    return (
                        sum
                        +
                        getWeight(
                            settings.actualReflections
                        )
                    );

                },
                0
            );


        const earnedWeight =
            roundResults.reduce(
                (
                    sum,
                    result
                ) => {

                    if (
                        !result.correct
                    ) {
                        return sum;
                    }


                    return (
                        sum
                        +
                        getWeight(
                            result.reflections
                        )
                    );

                },
                0
            );


        return Math.round(
            earnedWeight
            /
            totalWeight
            *
            100
        );

    }


    function finishGame() {

        gameRunning = false;

        phase =
            "finished";


        clearTimers();


        if (
            statusElement
        ) {

            statusElement.textContent =
                "";

        }


        onFinish({

            score:
                calculateScore(),

            correct:
                correctCount,

            total:
                TOTAL_ROUNDS,

            rounds:
                roundResults

        });

    }


    /* ------------------------------
       Cleanup
    ------------------------------ */

    function clearPhaseTimerOnly() {

        if (
            phaseTimer
        ) {

            clearTimeout(
                phaseTimer
            );

            phaseTimer = null;

        }

    }


    function clearTimers() {

        clearPhaseTimerOnly();


        if (
            animationFrame
        ) {

            cancelAnimationFrame(
                animationFrame
            );

            animationFrame = null;

        }

    }


    /* ------------------------------
       Start
    ------------------------------ */

    function start(
        options
    ) {

        clearTimers();


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


        roundIndex = 0;

        correctCount = 0;

        roundResults = [];


        gameRunning = true;


        puzzles =
            generateAllPuzzles();


        if (
            !puzzles
        ) {

            gameRunning = false;


            stageElement.innerHTML = `
                <div class="prediction-generation-error">
                    Puzzle generation failed.
                </div>
            `;


            return;

        }


        renderRound();

    }


    /* ------------------------------
       Public
    ------------------------------ */

    return {
        start
    };

})();