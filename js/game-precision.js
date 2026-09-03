const precisionGame = (() => {

    /* ------------------------------
       Settings
    ------------------------------ */

    const TOTAL_ROUNDS = 10;

    const ROUND_TIME = 5000;


    /*
        매 라운드 속도 +20%p

        R1 = 100%
        R2 = 120%
        ...
        R10 = 280%
    */

    const SPEED_STEP = 0.20;


    /*
        화면 폭 기준 % / second
    */

    const BASE_BALL_SPEED = 55;


    /*
        목표 구역 폭
        전체 트랙 폭의 %
    */

    const TARGET_WIDTH = 20;


    /*
        목표 구역 중심이 움직일 수 있는 범위
    */

    const TARGET_MIN_CENTER = 18;

    const TARGET_MAX_CENTER = 82;


    /*
        직전 목표와 너무 비슷한 위치가
        연속으로 나오지 않게 하는 최소 거리
    */

    const MIN_TARGET_DISTANCE = 18;


    /*
        라운드별 최대 배점
        총합 = 100
    */

    const ROUND_MAX_SCORES = [
        6,
        7,
        8,
        8,
        9,
        10,
        11,
        12,
        14,
        15
    ];


    /*
        판정 후 다음 라운드까지
        피드백 표시 시간
    */

    const FEEDBACK_TIME = 650;


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

        stop:
            "STOP",

        over:
            "OVER"

    };


    let gameRunning = false;

    let roundRunning = false;


    let animationFrame = null;


    let currentRound = 0;

    let roundStartTime = 0;

    let lastFrameTime = 0;


    /*
        Ball
    */

    let ballX = 0;

    let ballDirection = 1;


    /*
        Target
    */

    let targetCenter = 50;

    let previousTargetCenter = null;


    /*
        Score
    */

    let totalScore = 0;

    let roundResults = [];


    /* ------------------------------
       Helpers
    ------------------------------ */

    function randomRange(
        min,
        max
    ) {

        return (
            min
            +
            Math.random()
            *
            (
                max -
                min
            )
        );

    }


    function getRoundSpeed() {

        return (
            BASE_BALL_SPEED
            *
            (
                1
                +
                currentRound
                *
                SPEED_STEP
            )
        );

    }


    function getRoundMaxScore() {

        return ROUND_MAX_SCORES[
            currentRound
        ];

    }


    /* ------------------------------
       Target
    ------------------------------ */

    function createTargetCenter() {

        /*
            첫 라운드는 정중앙
        */

        if (
            currentRound === 0
        ) {

            return 50;

        }


        let candidate = 50;

        let attempts = 0;


        do {

            candidate =
                randomRange(
                    TARGET_MIN_CENTER,
                    TARGET_MAX_CENTER
                );


            attempts += 1;

        }
        while (
            previousTargetCenter !== null
            &&
            Math.abs(
                candidate -
                previousTargetCenter
            )
            <
            MIN_TARGET_DISTANCE
            &&
            attempts < 50
        );


        return candidate;

    }


    /* ------------------------------
       Render
    ------------------------------ */

    function renderRound() {

        stageElement.innerHTML = `
            <div
                class="precision-wrap"
            >

                <div
                    class="precision-hud"
                >

                    <span
                        id="precisionRound"
                        class="precision-round"
                    >
                        ${labels.round}
                        ${currentRound + 1}
                        /
                        ${TOTAL_ROUNDS}
                    </span>

                    <span
                        id="precisionTimer"
                        class="precision-timer"
                    >
                        ${(ROUND_TIME / 1000).toFixed(1)}s
                    </span>

                </div>


                <div
                    class="precision-track-wrap"
                >

                    <div
                        id="precisionTrack"
                        class="precision-track"
                    >

                        <div
                            id="precisionTarget"
                            class="precision-target"
                        >

                            <span
                                class="precision-target-center"
                            ></span>

                        </div>


                        <div
                            id="precisionBall"
                            class="precision-ball"
                        ></div>

                    </div>

                </div>


                <button
                    id="precisionStopButton"
                    class="precision-stop-button"
                    type="button"
                >
                    ${labels.stop}
                </button>


                <div
                    id="precisionFeedback"
                    class="precision-feedback"
                ></div>

            </div>
        `;


        const stopButton =
            stageElement.querySelector(
                "#precisionStopButton"
            );


        stopButton.addEventListener(
            "click",
            handleStop
        );


        updateTargetVisual();

        updateBallVisual();

    }


    /* ------------------------------
       Visual
    ------------------------------ */

    function updateTargetVisual() {

        const target =
            stageElement.querySelector(
                "#precisionTarget"
            );


        if (!target) {
            return;
        }


        target.style.width =
            `${TARGET_WIDTH}%`;


        target.style.left =
            `
                ${targetCenter
            -
            TARGET_WIDTH / 2
            }%
            `;

    }


    function updateBallVisual() {

        const ball =
            stageElement.querySelector(
                "#precisionBall"
            );


        if (!ball) {
            return;
        }


        ball.style.left =
            `${ballX}%`;

    }


    /* ------------------------------
       Ball
    ------------------------------ */

    function updateBall(
        deltaSeconds
    ) {

        const speed =
            getRoundSpeed();


        ballX +=
            ballDirection
            *
            speed
            *
            deltaSeconds;


        /*
            좌우 끝 반사
        */

        if (
            ballX >= 100
        ) {

            ballX = 100;

            ballDirection = -1;

        }


        if (
            ballX <= 0
        ) {

            ballX = 0;

            ballDirection = 1;

        }

    }


    /* ------------------------------
       Timer
    ------------------------------ */

    function updateTimer(
        elapsed
    ) {

        const timer =
            stageElement.querySelector(
                "#precisionTimer"
            );


        if (!timer) {
            return;
        }


        const remaining =
            Math.max(
                0,
                ROUND_TIME -
                elapsed
            );


        timer.textContent =
            `${(remaining / 1000).toFixed(1)}s`;

    }


    /* ------------------------------
       Score
    ------------------------------ */

    function calculateRoundScore() {

        const distance =
            Math.abs(
                ballX -
                targetCenter
            );


        const targetHalfWidth =
            TARGET_WIDTH / 2;


        /*
            목표 중심 = 1
            목표 경계 = 0
            목표 밖 = 음수 → 0 처리
        */

        const accuracy =
            1
            -
            distance
            /
            targetHalfWidth;


        const clampedAccuracy =
            Math.max(
                0,
                Math.min(
                    1,
                    accuracy
                )
            );


        const roundMaxScore =
            getRoundMaxScore();


        const FULL_SCORE_ACCURACY = 0.90;


        const scoreAccuracy =
            Math.min(
                1,
                clampedAccuracy
                /
                FULL_SCORE_ACCURACY
            );


        const roundScore =
            scoreAccuracy
            *
            roundMaxScore;


        return {

            score:
                roundScore,

            accuracy:
                clampedAccuracy,

            maxScore:
                roundMaxScore,

            distance

        };

    }


    /* ------------------------------
       STOP
    ------------------------------ */

    function handleStop() {

        if (
            !gameRunning
            ||
            !roundRunning
        ) {
            return;
        }


        roundRunning = false;


        if (
            animationFrame
        ) {

            cancelAnimationFrame(
                animationFrame
            );

        }


        const result =
            calculateRoundScore();


        totalScore +=
            result.score;


        roundResults.push({

            round:
                currentRound + 1,

            score:
                result.score,

            maxScore:
                result.maxScore,

            accuracy:
                result.accuracy,

            timeout:
                false

        });


        /*
            0점이면 실패음,
            0점보다 높으면 정답음
        */

        if (
            result.score > 0
        ) {

            playSound(
                "correct"
            );


            showFeedback(
                `${Math.round(result.accuracy * 100)}%`,
                "correct"
            );

        } else {

            playSound(
                "wrong"
            );


            showFeedback(
                labels.over,
                "wrong"
            );

        }


        disableStopButton();


        setTimeout(
            advanceRound,
            FEEDBACK_TIME
        );

    }


    /* ------------------------------
       Timeout
    ------------------------------ */

    function handleTimeout() {

        if (
            !roundRunning
        ) {
            return;
        }


        roundRunning = false;


        playSound(
            "wrong"
        );


        roundResults.push({

            round:
                currentRound + 1,

            score:
                0,

            maxScore:
                getRoundMaxScore(),

            accuracy:
                0,

            timeout:
                true

        });


        showFeedback(
            labels.over,
            "wrong"
        );


        disableStopButton();


        setTimeout(
            advanceRound,
            FEEDBACK_TIME
        );

    }


    /* ------------------------------
       Feedback
    ------------------------------ */

    function showFeedback(
        text,
        type
    ) {

        const feedback =
            stageElement.querySelector(
                "#precisionFeedback"
            );


        if (!feedback) {
            return;
        }


        feedback.textContent =
            text;


        feedback.className =
            `
                precision-feedback
                ${type}
            `;

    }


    function disableStopButton() {

        const button =
            stageElement.querySelector(
                "#precisionStopButton"
            );


        if (button) {

            button.disabled =
                true;

        }

    }


    /* ------------------------------
       Round
    ------------------------------ */

    function startRound() {

        if (!gameRunning) {
            return;
        }


        roundRunning = true;


        /*
            모든 라운드에서
            공은 왼쪽 끝에서 시작
        */

        ballX = 0;

        ballDirection = 1;


        targetCenter =
            createTargetCenter();


        previousTargetCenter =
            targetCenter;


        renderRound();


        roundStartTime =
            performance.now();


        lastFrameTime =
            roundStartTime;


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


        updateBall(
            deltaSeconds
        );


        updateBallVisual();


        updateTimer(
            elapsed
        );


        if (
            elapsed >=
            ROUND_TIME
        ) {

            handleTimeout();

            return;

        }


        animationFrame =
            requestAnimationFrame(
                gameLoop
            );

    }


    function advanceRound() {

        currentRound += 1;


        if (
            currentRound >=
            TOTAL_ROUNDS
        ) {

            finishGame();

            return;

        }


        startRound();

    }


    /* ------------------------------
       Finish
    ------------------------------ */

    function finishGame() {

        gameRunning = false;

        roundRunning = false;


        if (
            animationFrame
        ) {

            cancelAnimationFrame(
                animationFrame
            );

        }


        if (
            statusElement
        ) {

            statusElement.textContent =
                "";

        }


        onFinish({

            score:
                Math.round(
                    totalScore
                ),

            exactScore:
                Math.round(
                    totalScore
                    *
                    10
                )
                /
                10,

            rounds:
                roundResults

        });

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

        previousTargetCenter =
            null;


        totalScore = 0;

        roundResults = [];


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